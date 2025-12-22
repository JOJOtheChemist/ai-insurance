"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const events_1 = require("./events");
const hooks_1 = require("./hooks");
const scheduler_1 = require("./scheduler");
const context_manager_1 = require("./context-manager");
const file_pool_1 = require("./file-pool");
const ajv_1 = __importDefault(require("ajv"));
const todo_1 = require("./todo");
const provider_1 = require("../infra/provider");
const breakpoint_manager_1 = require("./agent/breakpoint-manager");
const permission_manager_1 = require("./agent/permission-manager");
const todo_read_1 = require("../tools/todo_read");
const todo_write_1 = require("../tools/todo_write");
const errors_1 = require("./errors");
const message_queue_1 = require("./agent/message-queue");
const todo_manager_1 = require("./agent/todo-manager");
const tool_runner_1 = require("./agent/tool-runner");
const CONFIG_VERSION = 'v2.7.0';
class Agent {
    /**
     * 设置用户认证信息
     */
    setUserAuth(userId, userToken) {
        this.userId = userId;
        this.userToken = userToken;
        console.log(`[Agent] 设置用户认证: ${userId}`);
    }
    /**
     * 设置会话信息
     */
    setSessionInfo(sessionId) {
        this.sessionId = sessionId;
        console.log(`[Agent] 设置会话信息: ${sessionId}`);
    }
    get persistentStore() {
        if (!this.deps.store) {
            throw new Error('Agent persistent store is not configured for this operation.');
        }
        return this.deps.store;
    }
    static requireStore(deps) {
        if (!deps.store) {
            throw new errors_1.ResumeError('CORRUPTED_DATA', 'Agent store is not configured.');
        }
        return deps.store;
    }
    constructor(config, deps, runtime) {
        this.config = config;
        this.deps = deps;
        this.events = new events_1.EventBus();
        this.hooks = new hooks_1.HookManager();
        this.ajv = new ajv_1.default({ allErrors: true, strict: false });
        this.validatorCache = new Map();
        this.toolControllers = new Map();
        this.tools = new Map();
        this.toolDescriptors = [];
        this.toolDescriptorIndex = new Map();
        this.pendingPermissions = new Map();
        this.messages = [];
        this.state = 'READY';
        this.toolRecords = new Map();
        this.interrupted = false;
        this.processingPromise = null;
        this.lastProcessingStart = 0;
        this.PROCESSING_TIMEOUT = 5 * 60 * 1000; // 5 分钟
        this.stepCount = 0;
        this.lastSfpIndex = -1;
        this.lineage = [];
        Agent.requireStore(this.deps);
        this.template = runtime.template;
        this.model = runtime.model;
        this.sandbox = runtime.sandbox;
        this.sandboxConfig = runtime.sandboxConfig;
        this.permission = runtime.permission;
        this.subagents = runtime.subagents;
        this.exposeThinking = config.exposeThinking ?? runtime.template.runtime?.exposeThinking ?? false;
        this.toolDescriptors = runtime.toolDescriptors;
        for (const descriptor of this.toolDescriptors) {
            this.toolDescriptorIndex.set(descriptor.name, descriptor);
        }
        this.todoConfig = runtime.todoConfig;
        this.permissions = new permission_manager_1.PermissionManager(this.permission, this.toolDescriptorIndex);
        this.scheduler = new scheduler_1.Scheduler({
            onTrigger: (info) => {
                this.events.emitMonitor({
                    channel: 'monitor',
                    type: 'scheduler_triggered',
                    taskId: info.taskId,
                    spec: info.spec,
                    kind: info.kind,
                    triggeredAt: Date.now(),
                });
            },
        });
        const runtimeMeta = { ...(this.template.runtime?.metadata || {}), ...(config.metadata || {}) };
        this.createdAt = new Date().toISOString();
        this.toolTimeoutMs = typeof runtimeMeta.toolTimeoutMs === 'number' ? runtimeMeta.toolTimeoutMs : 60000;
        this.maxToolConcurrency = typeof runtimeMeta.maxToolConcurrency === 'number' ? runtimeMeta.maxToolConcurrency : 3;
        this.toolRunner = new tool_runner_1.ToolRunner(Math.max(1, this.maxToolConcurrency));
        for (const tool of runtime.tools) {
            this.tools.set(tool.name, tool);
            if (tool.hooks) {
                this.hooks.register(tool.hooks, 'toolTune');
            }
        }
        if (this.template.hooks) {
            this.hooks.register(this.template.hooks, 'agent');
        }
        if (config.overrides?.hooks) {
            this.hooks.register(config.overrides.hooks, 'agent');
        }
        this.breakpoints = new breakpoint_manager_1.BreakpointManager((previous, current, entry) => {
            this.events.emitMonitor({
                channel: 'monitor',
                type: 'breakpoint_changed',
                previous,
                current,
                timestamp: entry.timestamp,
            });
        });
        this.breakpoints.set('READY');
        if (runtime.todoConfig?.enabled) {
            this.todoService = new todo_1.TodoService(this.persistentStore, this.agentId);
        }
        this.filePool = new file_pool_1.FilePool(this.sandbox, {
            watch: this.sandboxConfig?.watchFiles !== false,
            onChange: (event) => this.handleExternalFileChange(event.path, event.mtime),
        });
        this.contextManager = new context_manager_1.ContextManager(this.persistentStore, this.agentId, runtime.context);
        this.messageQueue = new message_queue_1.MessageQueue({
            wrapReminder: this.wrapReminder.bind(this),
            addMessage: (message, kind) => this.enqueueMessage(message, kind),
            persist: () => this.persistMessages(),
            ensureProcessing: () => this.ensureProcessing(),
        });
        this.todoManager = new todo_manager_1.TodoManager({
            service: this.todoService,
            config: this.todoConfig,
            events: this.events,
            remind: (content, options) => this.remind(content, options),
        });
        this.events.setStore(this.persistentStore, this.agentId);
        // 自动注入工具说明书到系统提示
        this.injectManualIntoSystemPrompt();
    }
    get agentId() {
        return this.config.agentId;
    }
    static async create(config, deps) {
        if (!config.agentId) {
            config.agentId = Agent.generateAgentId();
        }
        const template = deps.templateRegistry.get(config.templateId);
        const sandboxConfig = config.sandbox && 'kind' in config.sandbox
            ? config.sandbox
            : template.sandbox;
        const sandbox = typeof config.sandbox === 'object' && 'exec' in config.sandbox
            ? config.sandbox
            : deps.sandboxFactory.create(sandboxConfig || { kind: 'local', workDir: process.cwd() });
        const model = config.model
            ? config.model
            : config.modelConfig
                ? ensureModelFactory(deps.modelFactory)(config.modelConfig)
                : template.model
                    ? ensureModelFactory(deps.modelFactory)({ provider: 'anthropic', model: template.model })
                    : ensureModelFactory(deps.modelFactory)({ provider: 'anthropic', model: 'claude-3-5-sonnet-20241022' });
        const resolvedTools = resolveTools(config, template, deps.toolRegistry, deps.templateRegistry);
        const permissionConfig = config.overrides?.permission || template.permission || { mode: 'auto' };
        const normalizedPermission = {
            ...permissionConfig,
            mode: permissionConfig.mode || 'auto',
        };
        const agent = new Agent(config, deps, {
            template,
            model,
            sandbox,
            sandboxConfig,
            tools: resolvedTools.instances,
            toolDescriptors: resolvedTools.descriptors,
            permission: normalizedPermission,
            todoConfig: config.overrides?.todo || template.runtime?.todo,
            subagents: config.overrides?.subagents || template.runtime?.subagents,
            context: config.context || template.runtime?.metadata?.context,
        });
        await agent.initialize();
        return agent;
    }
    async initialize() {
        await this.todoService?.load();
        const messages = await this.persistentStore.loadMessages(this.agentId);
        this.messages = messages;
        this.lastSfpIndex = this.findLastSfp();
        this.stepCount = messages.filter((m) => m.role === 'user').length;
        const records = await this.persistentStore.loadToolCallRecords(this.agentId);
        this.toolRecords = new Map(records.map((record) => [record.id, this.normalizeToolRecord(record)]));
        if (this.todoService) {
            this.registerTodoTools();
            this.todoManager.handleStartup();
        }
        await this.persistInfo();
    }
    async *chatStream(input, opts) {
        const since = opts?.since ?? this.events.getLastBookmark();
        await this.send(input);
        const subscription = this.events.subscribeProgress({ since, kinds: opts?.kinds });
        for await (const event of subscription) {
            yield event;
            if (event.event.type === 'done') {
                this.lastBookmark = event.bookmark;
                break;
            }
        }
    }
    async chat(input, opts) {
        let streamedText = '';
        let bookmark;
        for await (const envelope of this.chatStream(input, opts)) {
            if (envelope.event.type === 'text_chunk') {
                streamedText += envelope.event.delta;
            }
            if (envelope.event.type === 'done') {
                bookmark = envelope.bookmark;
            }
        }
        const pending = Array.from(this.pendingPermissions.keys());
        let finalText = streamedText;
        const lastAssistant = [...this.messages].reverse().find((message) => message.role === 'assistant');
        if (lastAssistant) {
            const combined = lastAssistant.content
                .filter((block) => block.type === 'text')
                .map((block) => block.text)
                .join('\n');
            if (combined.trim().length > 0) {
                finalText = combined;
            }
        }
        return {
            status: pending.length ? 'paused' : 'ok',
            text: finalText,
            last: bookmark,
            permissionIds: pending,
        };
    }
    async complete(input, opts) {
        return this.chat(input, opts);
    }
    async *stream(input, opts) {
        yield* this.chatStream(input, opts);
    }
    async send(text, options) {
        return this.messageQueue.send(text, options);
    }
    schedule() {
        return this.scheduler;
    }
    on(event, handler) {
        if (event === 'permission_required' || event === 'permission_decided') {
            return this.events.onControl(event, handler);
        }
        return this.events.onMonitor(event, handler);
    }
    subscribe(channels, opts) {
        if (!opts || (!opts.since && !opts.kinds)) {
            return this.events.subscribe(channels);
        }
        return this.events.subscribe(channels, { since: opts.since, kinds: opts.kinds });
    }
    getTodos() {
        return this.todoManager.list();
    }
    async setTodos(todos) {
        await this.todoManager.setTodos(todos);
    }
    async updateTodo(todo) {
        await this.todoManager.update(todo);
    }
    async deleteTodo(id) {
        await this.todoManager.remove(id);
    }
    async decide(permissionId, decision, note) {
        const pending = this.pendingPermissions.get(permissionId);
        if (!pending)
            throw new Error(`Permission not pending: ${permissionId}`);
        pending.resolve(decision, note);
        this.pendingPermissions.delete(permissionId);
        this.events.emitControl({
            channel: 'control',
            type: 'permission_decided',
            callId: permissionId,
            decision,
            decidedBy: 'api',
            note,
        });
        if (decision === 'allow') {
            this.setState('WORKING');
            this.setBreakpoint('PRE_TOOL');
            this.ensureProcessing();
        }
        else {
            this.setBreakpoint('POST_TOOL');
            this.setState('READY');
        }
    }
    async interrupt(opts) {
        this.interrupted = true;
        this.toolRunner.clear();
        for (const controller of this.toolControllers.values()) {
            controller.abort();
        }
        this.toolControllers.clear();
        await this.appendSyntheticToolResults(opts?.note || 'Interrupted by user');
        this.setState('READY');
        this.setBreakpoint('READY');
    }
    async snapshot(label) {
        const id = label || `sfp:${this.lastSfpIndex}`;
        const snapshot = {
            id,
            messages: JSON.parse(JSON.stringify(this.messages)),
            lastSfpIndex: this.lastSfpIndex,
            lastBookmark: this.lastBookmark ?? { seq: -1, timestamp: Date.now() },
            createdAt: new Date().toISOString(),
            metadata: {
                stepCount: this.stepCount,
            },
        };
        await this.persistentStore.saveSnapshot(this.agentId, snapshot);
        return id;
    }
    async fork(sel) {
        const snapshotId = typeof sel === 'string' ? sel : sel?.at ?? (await this.snapshot());
        const snapshot = await this.persistentStore.loadSnapshot(this.agentId, snapshotId);
        if (!snapshot)
            throw new Error(`Snapshot not found: ${snapshotId}`);
        const forkId = `${this.agentId}/fork:${Date.now()}`;
        const forkConfig = {
            ...this.config,
            agentId: forkId,
        };
        const fork = await Agent.create(forkConfig, this.deps);
        fork.messages = JSON.parse(JSON.stringify(snapshot.messages));
        fork.lastSfpIndex = snapshot.lastSfpIndex;
        fork.stepCount = snapshot.metadata?.stepCount ?? fork.messages.filter((m) => m.role === 'user').length;
        fork.lineage = [...this.lineage, this.agentId];
        await fork.persistMessages();
        return fork;
    }
    async status() {
        return {
            agentId: this.agentId,
            state: this.state,
            stepCount: this.stepCount,
            lastSfpIndex: this.lastSfpIndex,
            lastBookmark: this.lastBookmark,
            cursor: this.events.getCursor(),
            breakpoint: this.breakpoints.getCurrent(),
        };
    }
    async info() {
        return {
            agentId: this.agentId,
            templateId: this.template.id,
            createdAt: this.createdAt,
            lineage: this.lineage,
            configVersion: CONFIG_VERSION,
            messageCount: this.messages.length,
            lastSfpIndex: this.lastSfpIndex,
            lastBookmark: this.lastBookmark,
            breakpoint: this.breakpoints.getCurrent(),
        };
    }
    setBreakpoint(state, note) {
        this.breakpoints.set(state, note);
    }
    remind(content, options) {
        this.messageQueue.send(content, { kind: 'reminder', reminder: options });
        this.events.emitMonitor({
            channel: 'monitor',
            type: 'reminder_sent',
            category: options?.category ?? 'general',
            content,
        });
    }
    async spawnSubAgent(templateId, prompt, runtime) {
        if (!this.subagents) {
            throw new Error('Sub-agent configuration not enabled for this agent');
        }
        const remaining = runtime?.depthRemaining ?? this.subagents.depth;
        if (remaining <= 0) {
            throw new Error('Sub-agent recursion limit reached');
        }
        if (this.subagents.templates && !this.subagents.templates.includes(templateId)) {
            throw new Error(`Template ${templateId} not allowed for sub-agent`);
        }
        const subConfig = {
            templateId,
            modelConfig: this.model.toConfig(),
            sandbox: this.sandboxConfig || { kind: 'local', workDir: this.sandbox.workDir },
            exposeThinking: this.exposeThinking,
            metadata: this.config.metadata,
            overrides: {
                permission: this.subagents.overrides?.permission || this.permission,
                todo: this.subagents.overrides?.todo || this.template.runtime?.todo,
                subagents: this.subagents.inheritConfig ? { ...this.subagents, depth: remaining - 1 } : undefined,
            },
        };
        const subAgent = await Agent.create(subConfig, this.deps);
        subAgent.lineage = [...this.lineage, this.agentId];
        const result = await subAgent.complete(prompt);
        return result;
    }
    /**
     * Create and run a sub-agent with a task, without requiring subagents config.
     * This is useful for tools that want to delegate work to specialized agents.
     */
    async delegateTask(config) {
        const subAgentConfig = {
            templateId: config.templateId,
            modelConfig: config.model
                ? { provider: 'anthropic', model: config.model }
                : this.model.toConfig(),
            sandbox: this.sandboxConfig || { kind: 'local', workDir: this.sandbox.workDir },
            tools: config.tools,
            metadata: {
                ...this.config.metadata,
                parentAgentId: this.agentId,
                delegatedBy: 'task_tool',
            },
        };
        const subAgent = await Agent.create(subAgentConfig, this.deps);
        subAgent.lineage = [...this.lineage, this.agentId];
        const result = await subAgent.complete(config.prompt);
        return result;
    }
    static async resume(agentId, config, deps, opts) {
        const store = Agent.requireStore(deps);
        const info = await store.loadInfo(agentId);
        if (!info) {
            throw new errors_1.ResumeError('AGENT_NOT_FOUND', `Agent metadata not found: ${agentId}`);
        }
        const metadata = info.metadata;
        if (!metadata) {
            throw new errors_1.ResumeError('CORRUPTED_DATA', `Agent metadata incomplete for: ${agentId}`);
        }
        const templateId = metadata.templateId;
        let template;
        try {
            template = deps.templateRegistry.get(templateId);
        }
        catch (error) {
            throw new errors_1.ResumeError('TEMPLATE_NOT_FOUND', `Template not registered: ${templateId}`);
        }
        if (config.templateVersion && metadata.templateVersion && config.templateVersion !== metadata.templateVersion) {
            throw new errors_1.ResumeError('TEMPLATE_VERSION_MISMATCH', `Template version mismatch: expected ${config.templateVersion}, got ${metadata.templateVersion}`);
        }
        let sandbox;
        try {
            sandbox = deps.sandboxFactory.create(metadata.sandboxConfig || { kind: 'local', workDir: process.cwd() });
        }
        catch (error) {
            throw new errors_1.ResumeError('SANDBOX_INIT_FAILED', error?.message || 'Failed to create sandbox');
        }
        const model = metadata.modelConfig
            ? ensureModelFactory(deps.modelFactory)(metadata.modelConfig)
            : ensureModelFactory(deps.modelFactory)({ provider: 'anthropic', model: template.model || 'claude-3-5-sonnet-20241022' });
        const toolInstances = metadata.tools.map((descriptor) => {
            try {
                return deps.toolRegistry.create(descriptor.registryId || descriptor.name, descriptor.config);
            }
            catch (error) {
                throw new errors_1.ResumeError('CORRUPTED_DATA', `Failed to restore tool ${descriptor.name}: ${error?.message || error}`);
            }
        });
        const permissionConfig = metadata.permission || template.permission || { mode: 'auto' };
        const normalizedPermission = {
            ...permissionConfig,
            mode: permissionConfig.mode || 'auto',
        };
        const agent = new Agent({ ...config, agentId, templateId: templateId, exposeThinking: metadata.exposeThinking }, deps, {
            template,
            model,
            sandbox,
            sandboxConfig: metadata.sandboxConfig,
            tools: toolInstances,
            toolDescriptors: metadata.tools,
            permission: normalizedPermission,
            todoConfig: metadata.todo,
            subagents: metadata.subagents,
            context: metadata.context,
        });
        agent.lineage = metadata.lineage || [];
        agent.createdAt = metadata.createdAt || agent.createdAt;
        await agent.initialize();
        if (metadata.breakpoint) {
            agent.breakpoints.reset(metadata.breakpoint);
        }
        let messages;
        try {
            messages = await store.loadMessages(agentId);
        }
        catch (error) {
            throw new errors_1.ResumeError('CORRUPTED_DATA', error?.message || 'Failed to load messages');
        }
        agent.messages = messages;
        agent.lastSfpIndex = agent.findLastSfp();
        agent.stepCount = messages.filter((m) => m.role === 'user').length;
        const toolRecords = await store.loadToolCallRecords(agentId);
        agent.toolRecords = new Map(toolRecords.map((record) => [record.id, agent.normalizeToolRecord(record)]));
        if (opts?.strategy === 'crash') {
            const sealed = await agent.autoSealIncompleteCalls();
            agent.events.emitMonitor({
                channel: 'monitor',
                type: 'agent_resumed',
                strategy: 'crash',
                sealed,
            });
        }
        else {
            agent.events.emitMonitor({
                channel: 'monitor',
                type: 'agent_resumed',
                strategy: 'manual',
                sealed: [],
            });
        }
        if (opts?.autoRun) {
            agent.ensureProcessing();
        }
        return agent;
    }
    static async resumeFromStore(agentId, deps, opts) {
        const store = Agent.requireStore(deps);
        const info = await store.loadInfo(agentId);
        if (!info || !info.metadata) {
            throw new errors_1.ResumeError('AGENT_NOT_FOUND', `Agent metadata not found: ${agentId}`);
        }
        const metadata = info.metadata;
        const baseConfig = {
            agentId,
            templateId: metadata.templateId,
            templateVersion: metadata.templateVersion,
            modelConfig: metadata.modelConfig,
            sandbox: metadata.sandboxConfig,
            exposeThinking: metadata.exposeThinking,
            context: metadata.context,
            metadata: metadata.metadata,
            overrides: {
                permission: metadata.permission,
                todo: metadata.todo,
                subagents: metadata.subagents,
            },
            tools: metadata.tools.map((descriptor) => descriptor.registryId || descriptor.name),
        };
        const overrides = opts?.overrides ?? {};
        return Agent.resume(agentId, { ...baseConfig, ...overrides }, deps, opts);
    }
    ensureProcessing() {
        // 检查是否超时
        if (this.processingPromise) {
            const now = Date.now();
            if (now - this.lastProcessingStart > this.PROCESSING_TIMEOUT) {
                this.events.emitMonitor({
                    channel: 'monitor',
                    type: 'error',
                    severity: 'error',
                    phase: 'lifecycle',
                    message: 'Processing timeout detected, forcing restart',
                    detail: {
                        lastStart: this.lastProcessingStart,
                        elapsed: now - this.lastProcessingStart
                    }
                });
                this.processingPromise = null; // 强制重启
            }
            else {
                return; // 正常执行中
            }
        }
        this.lastProcessingStart = Date.now();
        this.processingPromise = this.runStep()
            .finally(() => {
            this.processingPromise = null;
        })
            .catch((err) => {
            // 确保异常不会导致状态卡住
            this.events.emitMonitor({
                channel: 'monitor',
                type: 'error',
                severity: 'error',
                phase: 'lifecycle',
                message: 'Processing failed',
                detail: { error: err.message, stack: err.stack }
            });
            this.setState('READY');
            this.setBreakpoint('READY');
        });
    }
    async runStep() {
        if (this.state !== 'READY')
            return;
        if (this.interrupted) {
            this.interrupted = false;
            return;
        }
        this.setState('WORKING');
        this.setBreakpoint('PRE_MODEL');
        try {
            await this.messageQueue.flush();
            const usage = this.contextManager.analyze(this.messages);
            if (usage.shouldCompress) {
                this.events.emitMonitor({
                    channel: 'monitor',
                    type: 'context_compression',
                    phase: 'start',
                });
                const compression = await this.contextManager.compress(this.messages, this.events.getTimeline(), this.filePool, this.sandbox);
                if (compression) {
                    this.messages = [...compression.retainedMessages];
                    this.messages.unshift(compression.summary);
                    this.lastSfpIndex = this.messages.length - 1;
                    await this.persistMessages();
                    this.events.emitMonitor({
                        channel: 'monitor',
                        type: 'context_compression',
                        phase: 'end',
                        summary: compression.summary.content.map((block) => (block.type === 'text' ? block.text : JSON.stringify(block))).join('\n'),
                        ratio: compression.ratio,
                    });
                }
            }
            await this.hooks.runPreModel(this.messages);
            this.setBreakpoint('STREAMING_MODEL');
            console.log('[Agent] Calling model.stream() with', this.messages.length, 'messages');
            console.log('[Agent] System prompt length:', this.template.systemPrompt?.length || 0);
            console.log('[Agent] Tools count:', this.getToolSchemas().length);
            const stream = this.model.stream(this.messages, {
                tools: this.getToolSchemas(),
                maxTokens: this.config.metadata?.maxTokens,
                temperature: this.config.metadata?.temperature,
                system: this.template.systemPrompt,
            });
            console.log('[Agent] Stream created, starting to iterate...');
            const assistantBlocks = [];
            let currentBlockIndex = -1;
            let currentToolBuffer = '';
            const textBuffers = new Map();
            let chunkCount = 0;
            let isFirstTextBlock = true; // 🤔 跟踪是否是第一个文本块（用于思考内容）
            console.log('[Agent] exposeThinking =', this.exposeThinking, 'isFirstTextBlock =', isFirstTextBlock);
            if (this.exposeThinking) {
                console.log('[Agent] 发送 think_chunk_start 事件');
                this.events.emitProgress({ channel: 'progress', type: 'think_chunk_start', step: this.stepCount });
            }
            for await (const chunk of stream) {
                chunkCount++;
                console.log('[Agent] Received chunk', chunkCount, ':', chunk.type);
                if (chunk.type === 'content_block_start') {
                    if (chunk.content_block?.type === 'text') {
                        currentBlockIndex = chunk.index ?? 0;
                        assistantBlocks[currentBlockIndex] = { type: 'text', text: '' };
                        // 🤔 如果不是第一个文本块，或者不显示思考，则发送 text_chunk_start
                        if (!this.exposeThinking || !isFirstTextBlock) {
                            this.events.emitProgress({ channel: 'progress', type: 'text_chunk_start', step: this.stepCount });
                        }
                    }
                    else if (chunk.content_block?.type === 'tool_use') {
                        currentBlockIndex = chunk.index ?? 0;
                        currentToolBuffer = '';
                        assistantBlocks[currentBlockIndex] = {
                            type: 'tool_use',
                            id: chunk.content_block.id,
                            name: chunk.content_block.name,
                            input: {},
                        };
                    }
                }
                else if (chunk.type === 'content_block_delta') {
                    if (chunk.delta?.type === 'text_delta') {
                        const text = chunk.delta.text ?? '';
                        const existing = textBuffers.get(currentBlockIndex) ?? '';
                        textBuffers.set(currentBlockIndex, existing + text);
                        if (assistantBlocks[currentBlockIndex]?.type === 'text') {
                            assistantBlocks[currentBlockIndex].text = existing + text;
                        }
                        // 🤔 如果是第一个文本块且开启思考模式，发送 think_chunk；否则发送 text_chunk
                        if (this.exposeThinking && isFirstTextBlock) {
                            console.log('[Agent] 发送 think_chunk，长度=', text.length);
                            this.events.emitProgress({ channel: 'progress', type: 'think_chunk', step: this.stepCount, delta: text });
                        }
                        else {
                            this.events.emitProgress({ channel: 'progress', type: 'text_chunk', step: this.stepCount, delta: text });
                        }
                    }
                    else if (chunk.delta?.type === 'input_json_delta') {
                        currentToolBuffer += chunk.delta.partial_json ?? '';
                        try {
                            const parsed = JSON.parse(currentToolBuffer);
                            if (assistantBlocks[currentBlockIndex]?.type === 'tool_use') {
                                assistantBlocks[currentBlockIndex].input = parsed;
                            }
                        }
                        catch {
                            // continue buffering
                        }
                    }
                }
                else if (chunk.type === 'message_delta') {
                    const inputTokens = chunk.usage?.input_tokens ?? 0;
                    const outputTokens = chunk.usage?.output_tokens ?? 0;
                    if (inputTokens || outputTokens) {
                        this.events.emitMonitor({
                            channel: 'monitor',
                            type: 'token_usage',
                            inputTokens,
                            outputTokens,
                            totalTokens: inputTokens + outputTokens,
                        });
                    }
                }
                else if (chunk.type === 'content_block_stop') {
                    if (assistantBlocks[currentBlockIndex]?.type === 'text') {
                        const fullText = textBuffers.get(currentBlockIndex) ?? '';
                        // 🤔 如果是第一个文本块且开启思考模式，发送 think_chunk_end；否则发送 text_chunk_end
                        if (this.exposeThinking && isFirstTextBlock) {
                            this.events.emitProgress({ channel: 'progress', type: 'think_chunk_end', step: this.stepCount });
                            isFirstTextBlock = false; // 标记第一个文本块已处理完毕
                        }
                        else {
                            this.events.emitProgress({ channel: 'progress', type: 'text_chunk_end', step: this.stepCount, text: fullText });
                        }
                    }
                    currentBlockIndex = -1;
                    currentToolBuffer = '';
                }
            }
            await this.hooks.runPostModel({ role: 'assistant', content: assistantBlocks });
            this.messages.push({ role: 'assistant', content: assistantBlocks });
            await this.persistMessages();
            const toolBlocks = assistantBlocks.filter((block) => block.type === 'tool_use');
            if (toolBlocks.length > 0) {
                this.setBreakpoint('TOOL_PENDING');
                const outcomes = await this.executeTools(toolBlocks);
                if (outcomes.length > 0) {
                    this.messages.push({ role: 'user', content: outcomes });
                    this.lastSfpIndex = this.messages.length - 1;
                    this.stepCount++;
                    await this.persistMessages();
                    this.todoManager.onStep();
                    // ✅ 修复: 延迟调用 ensureProcessing，确保当前 runStep 完全结束后再启动新的
                    setImmediate(() => this.ensureProcessing());
                    return;
                }
            }
            else {
                this.lastSfpIndex = this.messages.length - 1;
            }
            const envelope = this.events.emitProgress({
                channel: 'progress',
                type: 'done',
                step: this.stepCount,
                reason: this.pendingPermissions.size > 0 ? 'interrupted' : 'completed',
            });
            this.lastBookmark = envelope.bookmark;
            this.stepCount++;
            this.scheduler.notifyStep(this.stepCount);
            this.todoManager.onStep();
            this.events.emitMonitor({ channel: 'monitor', type: 'step_complete', step: this.stepCount, bookmark: envelope.bookmark });
        }
        catch (error) {
            this.events.emitMonitor({
                channel: 'monitor',
                type: 'error',
                severity: 'error',
                phase: 'model',
                message: error?.message || 'Model execution failed',
                detail: { stack: error?.stack },
            });
        }
        finally {
            this.setState('READY');
            this.setBreakpoint('READY');
        }
    }
    async executeTools(toolUses) {
        const uses = toolUses.filter((block) => block.type === 'tool_use');
        if (uses.length === 0) {
            return [];
        }
        const results = new Map();
        await Promise.all(uses.map((use) => this.toolRunner.run(async () => {
            const result = await this.processToolCall(use);
            if (result) {
                results.set(use.id, result);
            }
        })));
        await this.persistToolRecords();
        const ordered = [];
        for (const use of uses) {
            const block = results.get(use.id);
            if (block) {
                ordered.push(block);
            }
        }
        return ordered;
    }
    async processToolCall(toolUse) {
        const tool = this.tools.get(toolUse.name);
        const record = this.registerToolRecord(toolUse);
        this.events.emitProgress({ channel: 'progress', type: 'tool:start', call: this.snapshotToolRecord(record.id) });
        if (!tool) {
            const message = `Tool not found: ${toolUse.name}`;
            this.updateToolRecord(record.id, { state: 'FAILED', error: message, isError: true }, 'tool missing');
            this.events.emitMonitor({ channel: 'monitor', type: 'error', severity: 'warn', phase: 'tool', message });
            return this.makeToolResult(toolUse.id, {
                ok: false,
                error: message,
                recommendations: ['确认工具是否已注册', '检查模板或配置中的工具列表'],
            });
        }
        const validation = this.validateToolArgs(tool, toolUse.input);
        if (!validation.ok) {
            const message = validation.error || 'Tool input validation failed';
            this.updateToolRecord(record.id, { state: 'FAILED', error: message, isError: true }, 'input schema invalid');
            return this.makeToolResult(toolUse.id, {
                ok: false,
                error: message,
                recommendations: ['检查工具入参是否符合 schema', '根据提示修正参数后重试'],
            });
        }
        const context = {
            agentId: this.agentId,
            sandbox: this.sandbox,
            agent: this,
            services: {
                todo: this.todoService,
                filePool: this.filePool,
            },
            emit: (eventType, data) => {
                this.events.emitMonitor({
                    channel: 'monitor',
                    type: 'tool_custom_event',
                    toolName: tool.name,
                    eventType,
                    data,
                    timestamp: Date.now(),
                });
            },
            userToken: this.userToken,
            userId: this.userId,
            sessionId: this.sessionId,
        };
        let approvalMeta;
        let requireApproval = false;
        const policyDecision = this.permissions.evaluate(toolUse.name);
        if (policyDecision === 'deny') {
            const message = 'Tool denied by policy';
            this.updateToolRecord(record.id, {
                state: 'DENIED',
                approval: buildApproval('deny', 'policy', message),
                error: message,
                isError: true,
            }, 'policy deny');
            this.setBreakpoint('POST_TOOL');
            this.events.emitProgress({ channel: 'progress', type: 'tool:end', call: this.snapshotToolRecord(record.id) });
            return this.makeToolResult(toolUse.id, {
                ok: false,
                error: message,
                recommendations: ['检查模板或权限配置的 allow/deny 列表', '如需执行该工具，请调整权限模式或审批策略'],
            });
        }
        if (policyDecision === 'ask') {
            requireApproval = true;
            approvalMeta = { reason: 'Policy requires approval', tool: toolUse.name };
        }
        const decision = await this.hooks.runPreToolUse({ id: toolUse.id, name: toolUse.name, args: toolUse.input, agentId: this.agentId }, context);
        if (decision) {
            if ('decision' in decision) {
                if (decision.decision === 'ask') {
                    requireApproval = true;
                    approvalMeta = { ...(approvalMeta || {}), ...(decision.meta || {}) };
                }
                else if (decision.decision === 'deny') {
                    const message = decision.reason || 'Denied by hook';
                    this.updateToolRecord(record.id, {
                        state: 'DENIED',
                        approval: buildApproval('deny', 'hook', message),
                        error: message,
                        isError: true,
                    }, 'hook deny');
                    this.setBreakpoint('POST_TOOL');
                    this.events.emitProgress({ channel: 'progress', type: 'tool:end', call: this.snapshotToolRecord(record.id) });
                    return this.makeToolResult(toolUse.id, {
                        ok: false,
                        error: decision.toolResult || message,
                        recommendations: ['根据 Hook 给出的原因调整输入或策略'],
                    });
                }
            }
            else if ('result' in decision) {
                this.updateToolRecord(record.id, {
                    state: 'COMPLETED',
                    result: decision.result,
                    completedAt: Date.now(),
                }, 'hook provided result');
                this.events.emitMonitor({ channel: 'monitor', type: 'tool_executed', call: this.snapshotToolRecord(record.id) });
                this.setBreakpoint('POST_TOOL');
                this.events.emitProgress({ channel: 'progress', type: 'tool:end', call: this.snapshotToolRecord(record.id) });
                return this.makeToolResult(toolUse.id, { ok: true, data: decision.result });
            }
        }
        if (requireApproval) {
            this.setBreakpoint('AWAITING_APPROVAL');
            const decisionResult = await this.requestPermission(record.id, toolUse.name, toolUse.input, approvalMeta);
            if (decisionResult === 'deny') {
                const message = approvalMeta?.reason || 'Denied by approval';
                this.updateToolRecord(record.id, { state: 'DENIED', error: message, isError: true }, 'approval denied');
                this.setBreakpoint('POST_TOOL');
                this.events.emitProgress({ channel: 'progress', type: 'tool:end', call: this.snapshotToolRecord(record.id) });
                return this.makeToolResult(toolUse.id, { ok: false, error: message });
            }
            this.setBreakpoint('PRE_TOOL');
        }
        this.setBreakpoint('PRE_TOOL');
        this.updateToolRecord(record.id, { state: 'EXECUTING', startedAt: Date.now() }, 'execution start');
        this.setBreakpoint('TOOL_EXECUTING');
        const controller = new AbortController();
        this.toolControllers.set(toolUse.id, controller);
        context.signal = controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), this.toolTimeoutMs);
        try {
            const output = await tool.exec(toolUse.input, context);
            // 检查 output 是否包含 ok 字段来判断工具是否成功
            const outputOk = output && typeof output === 'object' && 'ok' in output ? output.ok : true;
            let outcome = {
                id: toolUse.id,
                name: toolUse.name,
                ok: outputOk !== false,
                content: output
            };
            outcome = await this.hooks.runPostToolUse(outcome, context);
            if (toolUse.name === 'fs_read' && toolUse.input?.path) {
                await this.filePool.recordRead(toolUse.input.path);
            }
            if ((toolUse.name === 'fs_write' || toolUse.name === 'fs_edit' || toolUse.name === 'fs_multi_edit') && toolUse.input?.path) {
                await this.filePool.recordEdit(toolUse.input.path);
            }
            const success = outcome.ok !== false;
            const duration = Date.now() - (this.toolRecords.get(record.id)?.startedAt ?? Date.now());
            if (success) {
                this.updateToolRecord(record.id, {
                    state: 'COMPLETED',
                    result: outcome.content,
                    durationMs: duration,
                    completedAt: Date.now(),
                }, 'execution complete');
                this.events.emitMonitor({ channel: 'monitor', type: 'tool_executed', call: this.snapshotToolRecord(record.id) });
                return this.makeToolResult(toolUse.id, { ok: true, data: outcome.content });
            }
            else {
                const errorContent = outcome.content;
                const errorMessage = errorContent?.error || 'Tool returned failure';
                const errorType = errorContent?._validationError ? 'validation' :
                    errorContent?._thrownError ? 'runtime' : 'logical';
                const isRetryable = errorType !== 'validation';
                this.updateToolRecord(record.id, {
                    state: 'FAILED',
                    result: outcome.content,
                    error: errorMessage,
                    isError: true,
                    durationMs: duration,
                    completedAt: Date.now(),
                }, 'tool reported failure');
                this.events.emitProgress({
                    channel: 'progress',
                    type: 'tool:error',
                    call: this.snapshotToolRecord(record.id),
                    error: errorMessage,
                });
                this.events.emitMonitor({
                    channel: 'monitor',
                    type: 'error',
                    severity: 'warn',
                    phase: 'tool',
                    message: errorMessage,
                    detail: { ...outcome.content, errorType, retryable: isRetryable },
                });
                const recommendations = errorContent?.recommendations || this.getErrorRecommendations(errorType, toolUse.name);
                return this.makeToolResult(toolUse.id, {
                    ok: false,
                    error: errorMessage,
                    errorType,
                    retryable: isRetryable,
                    data: outcome.content,
                    recommendations,
                });
            }
        }
        catch (error) {
            const isAbort = error?.name === 'AbortError';
            const message = isAbort ? 'Tool execution aborted' : error?.message || String(error);
            const errorType = isAbort ? 'aborted' : 'exception';
            this.updateToolRecord(record.id, { state: 'FAILED', error: message, isError: true }, isAbort ? 'tool aborted' : 'execution failed');
            this.events.emitProgress({
                channel: 'progress',
                type: 'tool:error',
                call: this.snapshotToolRecord(record.id),
                error: message,
            });
            this.events.emitMonitor({
                channel: 'monitor',
                type: 'error',
                severity: isAbort ? 'warn' : 'error',
                phase: 'tool',
                message,
                detail: { errorType, stack: error?.stack },
            });
            const recommendations = isAbort
                ? ['检查是否手动中断', '根据需要重新触发工具', '考虑调整超时时间']
                : this.getErrorRecommendations('runtime', toolUse.name);
            return this.makeToolResult(toolUse.id, {
                ok: false,
                error: message,
                errorType,
                retryable: !isAbort,
                recommendations,
            });
        }
        finally {
            clearTimeout(timeoutId);
            this.toolControllers.delete(toolUse.id);
            this.setBreakpoint('POST_TOOL');
            this.events.emitProgress({ channel: 'progress', type: 'tool:end', call: this.snapshotToolRecord(record.id) });
        }
    }
    registerToolRecord(toolUse) {
        const now = Date.now();
        const record = {
            id: toolUse.id,
            name: toolUse.name,
            input: toolUse.input,
            state: 'PENDING',
            approval: { required: false },
            createdAt: now,
            updatedAt: now,
            auditTrail: [{ state: 'PENDING', timestamp: now }],
        };
        this.toolRecords.set(record.id, record);
        return record;
    }
    updateToolRecord(id, update, auditNote) {
        const record = this.toolRecords.get(id);
        if (!record)
            return;
        const now = Date.now();
        if (update.state && update.state !== record.state) {
            record.auditTrail.push({ state: update.state, timestamp: now, note: auditNote });
        }
        else if (auditNote) {
            record.auditTrail.push({ state: record.state, timestamp: now, note: auditNote });
        }
        Object.assign(record, update, { updatedAt: now });
    }
    snapshotToolRecord(id) {
        const record = this.toolRecords.get(id);
        if (!record)
            throw new Error(`Tool record not found: ${id}`);
        return {
            id: record.id,
            name: record.name,
            state: record.state,
            approval: record.approval,
            result: record.result,
            error: record.error,
            isError: record.isError,
            durationMs: record.durationMs,
            startedAt: record.startedAt,
            completedAt: record.completedAt,
            inputPreview: this.preview(record.input),
            auditTrail: [...record.auditTrail],
        };
    }
    normalizeToolRecord(record) {
        const timestamp = record.updatedAt ?? record.createdAt ?? Date.now();
        const auditTrail = record.auditTrail && record.auditTrail.length > 0
            ? record.auditTrail.map((entry) => ({ ...entry }))
            : [{ state: record.state, timestamp }];
        return { ...record, auditTrail };
    }
    preview(value, limit = 200) {
        const text = typeof value === 'string' ? value : JSON.stringify(value);
        return text.length > limit ? `${text.slice(0, limit)}…` : text;
    }
    async requestPermission(id, _toolName, _args, meta) {
        const approval = {
            required: true,
            decision: undefined,
            decidedAt: undefined,
            decidedBy: undefined,
            note: undefined,
            meta,
        };
        this.updateToolRecord(id, { state: 'APPROVAL_REQUIRED', approval }, 'awaiting approval');
        return new Promise((resolve) => {
            this.pendingPermissions.set(id, {
                resolve: (decision, note) => {
                    this.updateToolRecord(id, {
                        approval: buildApproval(decision, 'api', note),
                        state: decision === 'allow' ? 'APPROVED' : 'DENIED',
                        error: decision === 'deny' ? note : undefined,
                        isError: decision === 'deny',
                    }, decision === 'allow' ? 'approval granted' : 'approval denied');
                    if (decision === 'allow') {
                        this.setBreakpoint('PRE_TOOL');
                    }
                    else {
                        this.setBreakpoint('POST_TOOL');
                    }
                    resolve(decision);
                },
            });
            this.events.emitControl({
                channel: 'control',
                type: 'permission_required',
                call: this.snapshotToolRecord(id),
                respond: async (decision, opts) => {
                    await this.decide(id, decision, opts?.note);
                },
            });
            this.setState('PAUSED');
            this.setBreakpoint('AWAITING_APPROVAL');
        });
    }
    findLastSfp() {
        for (let i = this.messages.length - 1; i >= 0; i--) {
            const msg = this.messages[i];
            if (msg.role === 'user')
                return i;
            if (msg.role === 'assistant' && !msg.content.some((block) => block.type === 'tool_use'))
                return i;
        }
        return -1;
    }
    async appendSyntheticToolResults(note) {
        const last = this.messages[this.messages.length - 1];
        if (!last || last.role !== 'assistant')
            return;
        const toolUses = last.content.filter((block) => block.type === 'tool_use');
        if (!toolUses.length)
            return;
        const resultIds = new Set();
        for (const message of this.messages) {
            for (const block of message.content) {
                if (block.type === 'tool_result')
                    resultIds.add(block.tool_use_id);
            }
        }
        const synthetic = [];
        for (const tu of toolUses) {
            if (!resultIds.has(tu.id)) {
                const sealedResult = this.buildSealPayload('TOOL_RESULT_MISSING', tu.id, note);
                this.updateToolRecord(tu.id, { state: 'SEALED', error: sealedResult.message, isError: true }, 'sealed due to interrupt');
                synthetic.push(this.makeToolResult(tu.id, sealedResult.payload));
            }
        }
        if (synthetic.length) {
            this.messages.push({ role: 'user', content: synthetic });
            await this.persistMessages();
            await this.persistToolRecords();
        }
    }
    async autoSealIncompleteCalls(note = 'Sealed due to crash while executing; verify potential side effects.') {
        const sealedSnapshots = [];
        const resultIds = new Set();
        for (const message of this.messages) {
            for (const block of message.content) {
                if (block.type === 'tool_result') {
                    resultIds.add(block.tool_use_id);
                }
            }
        }
        const synthetic = [];
        for (const [id, record] of this.toolRecords) {
            if (['COMPLETED', 'FAILED', 'DENIED', 'SEALED'].includes(record.state))
                continue;
            const sealedResult = this.buildSealPayload(record.state, id, note, record);
            this.updateToolRecord(id, { state: 'SEALED', error: sealedResult.message, isError: true, completedAt: Date.now() }, 'auto seal');
            const snapshot = this.snapshotToolRecord(id);
            sealedSnapshots.push(snapshot);
            if (!resultIds.has(id)) {
                synthetic.push(this.makeToolResult(id, sealedResult.payload));
            }
        }
        if (synthetic.length > 0) {
            this.messages.push({ role: 'user', content: synthetic });
            await this.persistMessages();
        }
        await this.persistToolRecords();
        return sealedSnapshots;
    }
    validateToolArgs(tool, args) {
        if (!tool.input_schema) {
            return { ok: true };
        }
        const key = JSON.stringify(tool.input_schema);
        let validator = this.validatorCache.get(key);
        if (!validator) {
            validator = this.ajv.compile(tool.input_schema);
            this.validatorCache.set(key, validator);
        }
        const valid = validator(args);
        if (!valid) {
            return {
                ok: false,
                error: this.ajv.errorsText(validator.errors, { separator: '\n' }),
            };
        }
        return { ok: true };
    }
    makeToolResult(toolUseId, payload) {
        return {
            type: 'tool_result',
            tool_use_id: toolUseId,
            content: {
                ok: payload.ok,
                data: payload.data,
                error: payload.error,
                errorType: payload.errorType,
                retryable: payload.retryable,
                note: payload.note,
                recommendations: payload.recommendations,
            },
            is_error: payload.ok ? false : true,
        };
    }
    buildSealPayload(state, toolUseId, fallbackNote, record) {
        const baseMessage = (() => {
            switch (state) {
                case 'APPROVAL_REQUIRED':
                    return '工具在等待审批时会话中断，系统已自动封口。';
                case 'APPROVED':
                    return '工具已通过审批但尚未执行，系统已自动封口。';
                case 'EXECUTING':
                    return '工具执行过程中会话中断，系统已自动封口。';
                case 'PENDING':
                    return '工具刚准备执行时会话中断，系统已自动封口。';
                default:
                    return fallbackNote;
            }
        })();
        const recommendations = (() => {
            switch (state) {
                case 'APPROVAL_REQUIRED':
                    return ['确认审批是否仍然需要', '如需继续，请重新触发工具并完成审批'];
                case 'APPROVED':
                    return ['确认工具输入是否仍然有效', '如需执行，请重新触发工具'];
                case 'EXECUTING':
                    return ['检查工具可能产生的副作用', '确认外部系统状态后再重试'];
                case 'PENDING':
                    return ['确认工具参数是否正确', '再次触发工具以继续流程'];
                default:
                    return ['检查封口说明并决定是否重试工具'];
            }
        })();
        const detail = {
            status: state,
            startedAt: record?.startedAt,
            approval: record?.approval,
            toolId: toolUseId,
            note: baseMessage,
        };
        return {
            payload: {
                ok: false,
                error: baseMessage,
                data: detail,
                recommendations,
            },
            message: baseMessage,
        };
    }
    wrapReminder(content, options) {
        if (options?.skipStandardEnding)
            return content;
        return [
            '<system-reminder>',
            content,
            '',
            'This is a system reminder. DO NOT respond to this message directly.',
            'DO NOT mention this reminder to the user.',
            'Continue with your current task.',
            '</system-reminder>',
        ].join('\n');
    }
    getToolSchemas() {
        return Array.from(this.tools.values()).map((tool) => ({
            name: tool.name,
            description: tool.description,
            input_schema: tool.input_schema,
        }));
    }
    setState(state) {
        if (this.state === state)
            return;
        this.state = state;
        this.events.emitMonitor({ channel: 'monitor', type: 'state_changed', state });
    }
    async persistMessages() {
        await this.persistentStore.saveMessages(this.agentId, this.messages);
        await this.persistInfo();
        const snapshot = {
            agentId: this.agentId,
            messages: this.messages.map((message) => ({
                role: message.role,
                content: message.content.map((block) => ({ ...block })),
            })),
            lastBookmark: this.lastBookmark,
        };
        await this.hooks.runMessagesChanged(snapshot);
    }
    async persistToolRecords() {
        await this.persistentStore.saveToolCallRecords(this.agentId, Array.from(this.toolRecords.values()));
    }
    async persistInfo() {
        const metadata = {
            agentId: this.agentId,
            templateId: this.template.id,
            templateVersion: this.config.templateVersion || this.template.version,
            sandboxConfig: this.sandboxConfig,
            modelConfig: this.model.toConfig(),
            tools: this.toolDescriptors,
            exposeThinking: this.exposeThinking,
            permission: this.permission,
            todo: this.todoConfig,
            subagents: this.subagents,
            context: this.config.context,
            createdAt: this.createdAt,
            updatedAt: new Date().toISOString(),
            configVersion: CONFIG_VERSION,
            metadata: this.config.metadata,
            lineage: this.lineage,
            breakpoint: this.breakpoints.getCurrent(),
        };
        const info = {
            agentId: this.agentId,
            templateId: this.template.id,
            createdAt: this.createdAt,
            lineage: metadata.lineage || [],
            configVersion: CONFIG_VERSION,
            messageCount: this.messages.length,
            lastSfpIndex: this.lastSfpIndex,
            lastBookmark: this.lastBookmark,
        };
        info.metadata = metadata;
        await this.persistentStore.saveInfo(this.agentId, info);
    }
    registerTodoTools() {
        const read = todo_read_1.TodoRead;
        const write = todo_write_1.TodoWrite;
        this.tools.set(read.name, read);
        this.tools.set(write.name, write);
        const descriptorNames = new Set(this.toolDescriptors.map((d) => d.name));
        if (!descriptorNames.has(read.name)) {
            const descriptor = read.toDescriptor();
            this.toolDescriptors.push(descriptor);
            this.toolDescriptorIndex.set(descriptor.name, descriptor);
        }
        if (!descriptorNames.has(write.name)) {
            const descriptor = write.toDescriptor();
            this.toolDescriptors.push(descriptor);
            this.toolDescriptorIndex.set(descriptor.name, descriptor);
        }
    }
    // ========== 工具说明书自动注入 ==========
    /**
     * 收集所有工具的使用说明
     */
    collectToolPrompts() {
        const prompts = [];
        for (const tool of this.tools.values()) {
            if (tool.prompt) {
                const promptText = typeof tool.prompt === 'string' ? tool.prompt : undefined;
                if (promptText) {
                    prompts.push({
                        name: tool.name,
                        prompt: promptText,
                    });
                }
            }
        }
        return prompts;
    }
    /**
     * 渲染工具手册
     */
    renderManual(prompts) {
        if (prompts.length === 0)
            return '';
        const sections = prompts.map(({ name, prompt }) => {
            return `**${name}**\n${prompt}`;
        });
        return `\n\n### Tools Manual\n\nThe following tools are available for your use. Please read their usage guidance carefully:\n\n${sections.join('\n\n')}`;
    }
    /**
     * 刷新工具手册（运行时工具变更时调用）
     */
    refreshToolManual() {
        // 移除旧的 Tools Manual 部分
        const manualPattern = /\n\n### Tools Manual\n\n[\s\S]*$/;
        if (this.template.systemPrompt) {
            this.template.systemPrompt = this.template.systemPrompt.replace(manualPattern, '');
        }
        // 重新注入
        this.injectManualIntoSystemPrompt();
    }
    /**
     * 根据错误类型生成建议
     */
    getErrorRecommendations(errorType, toolName) {
        switch (errorType) {
            case 'validation':
                return [
                    '检查工具参数是否符合schema要求',
                    '确认所有必填参数已提供',
                    '检查参数类型是否正确',
                    '参考工具手册中的参数说明'
                ];
            case 'runtime':
                return [
                    '检查系统资源是否可用',
                    '确认文件/路径是否存在且有权限',
                    '考虑添加错误处理逻辑',
                    '可以重试该操作'
                ];
            case 'logical':
                if (toolName.startsWith('fs_')) {
                    return [
                        '确认文件内容是否符合预期',
                        '检查文件是否被外部修改',
                        '验证路径和模式是否正确',
                        '可以先用 fs_read 确认文件状态'
                    ];
                }
                else if (toolName.startsWith('bash_')) {
                    return [
                        '检查命令语法是否正确',
                        '确认命令在沙箱环境中可执行',
                        '查看stderr输出了解详细错误',
                        '考虑调整超时时间或拆分命令'
                    ];
                }
                else {
                    return [
                        '检查工具逻辑是否符合预期',
                        '验证输入数据的完整性',
                        '考虑重试或使用替代方案',
                        '查看错误详情调整策略'
                    ];
                }
            default:
                return [
                    '查看错误信息调整输入',
                    '考虑使用替代工具',
                    '必要时寻求人工协助'
                ];
        }
    }
    /**
     * 将工具手册注入到系统提示中
     */
    injectManualIntoSystemPrompt() {
        const prompts = this.collectToolPrompts();
        if (prompts.length === 0)
            return;
        const manual = this.renderManual(prompts);
        // 追加到模板的 systemPrompt
        if (this.template.systemPrompt) {
            this.template.systemPrompt += manual;
        }
        else {
            this.template.systemPrompt = manual;
        }
        // 发出 Monitor 事件
        this.events.emitMonitor({
            channel: 'monitor',
            type: 'tool_manual_updated',
            tools: prompts.map((p) => p.name),
            timestamp: Date.now(),
        });
    }
    enqueueMessage(message, kind) {
        this.messages.push(message);
        if (kind === 'user') {
            this.lastSfpIndex = this.messages.length - 1;
            this.stepCount++;
        }
    }
    handleExternalFileChange(path, mtime) {
        const relPath = this.relativePath(path);
        this.events.emitMonitor({ channel: 'monitor', type: 'file_changed', path: relPath, mtime });
        const reminder = `检测到外部修改：${relPath}。请重新使用 fs_read 确认文件内容，并在必要时向用户同步。`;
        this.remind(reminder, { category: 'file', priority: 'medium' });
    }
    relativePath(absPath) {
        const path = require('path');
        return path.relative(this.sandbox.workDir || process.cwd(), this.sandbox.fs.resolve(absPath));
    }
    static generateAgentId() {
        const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
        const now = Date.now();
        const timePart = encodeUlid(now, 10, chars);
        const random = Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return `agt:${timePart}${random}`;
    }
}
exports.Agent = Agent;
function ensureModelFactory(factory) {
    if (factory)
        return factory;
    return (config) => {
        if (config.provider === 'anthropic') {
            if (!config.apiKey) {
                throw new Error('Anthropic provider requires apiKey');
            }
            return new provider_1.AnthropicProvider(config.apiKey, config.model, config.baseUrl);
        }
        throw new Error(`Model factory not provided for provider: ${config.provider}`);
    };
}
function resolveTools(config, template, registry, templateRegistry) {
    const requested = config.tools ?? (template.tools === '*' ? registry.list() : template.tools || []);
    const instances = [];
    const descriptors = [];
    for (const id of requested) {
        const creationConfig = buildToolConfig(id, template, templateRegistry);
        const tool = registry.create(id, creationConfig);
        instances.push(tool);
        descriptors.push(tool.toDescriptor());
    }
    return { instances, descriptors };
}
function buildToolConfig(id, template, templateRegistry) {
    if (id === 'task_run') {
        const allowed = template.runtime?.subagents?.templates;
        const templates = allowed && allowed.length > 0 ? allowed.map((tplId) => templateRegistry.get(tplId)) : templateRegistry.list();
        return { templates };
    }
    return undefined;
}
function encodeUlid(time, length, chars) {
    let remaining = time;
    const encoded = Array(length);
    for (let i = length - 1; i >= 0; i--) {
        const mod = remaining % 32;
        encoded[i] = chars.charAt(mod);
        remaining = Math.floor(remaining / 32);
    }
    return encoded.join('');
}
function buildApproval(decision, by, note) {
    return {
        required: true,
        decision,
        decidedBy: by,
        decidedAt: Date.now(),
        note,
    };
}
