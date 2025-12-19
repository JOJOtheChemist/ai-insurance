import { AgentEvent, AgentEventEnvelope, AgentInfo, AgentStatus, Bookmark, ControlEvent, MonitorEvent, ProgressEvent, ReminderOptions, ResumeStrategy, SnapshotId } from './types';
import { Hooks } from './hooks';
import { Scheduler } from './scheduler';
import { TodoInput, TodoItem } from './todo';
import { AgentTemplateRegistry, AgentTemplateDefinition, PermissionConfig, SubAgentConfig, TodoConfig } from './template';
import { Store } from '../infra/store';
import { Sandbox, SandboxKind } from '../infra/sandbox';
import { SandboxFactory } from '../infra/sandbox-factory';
import { ModelProvider, ModelConfig } from '../infra/provider';
import { ToolRegistry, ToolInstance, ToolDescriptor } from '../tools/registry';
import { ContextManagerOptions } from './context-manager';
import { SendOptions as QueueSendOptions } from './agent/message-queue';
export interface ModelFactory {
    (config: ModelConfig): ModelProvider;
}
export interface AgentDependencies {
    store: Store;
    templateRegistry: AgentTemplateRegistry;
    sandboxFactory: SandboxFactory;
    toolRegistry: ToolRegistry;
    modelFactory?: ModelFactory;
}
export type SendOptions = QueueSendOptions;
export interface SandboxConfig {
    kind: SandboxKind;
    workDir?: string;
    enforceBoundary?: boolean;
    allowPaths?: string[];
    watchFiles?: boolean;
    [key: string]: any;
}
export interface AgentConfig {
    agentId?: string;
    templateId: string;
    templateVersion?: string;
    model?: ModelProvider;
    modelConfig?: ModelConfig;
    sandbox?: Sandbox | SandboxConfig;
    tools?: string[];
    exposeThinking?: boolean;
    overrides?: {
        permission?: PermissionConfig;
        todo?: TodoConfig;
        subagents?: SubAgentConfig;
        hooks?: Hooks;
    };
    context?: ContextManagerOptions;
    metadata?: Record<string, any>;
}
interface SubAgentRuntime {
    depthRemaining: number;
}
export interface CompleteResult {
    status: 'ok' | 'paused';
    text?: string;
    last?: Bookmark;
    permissionIds?: string[];
}
export interface StreamOptions {
    since?: Bookmark;
    kinds?: Array<ProgressEvent['type']>;
}
export interface SubscribeOptions {
    since?: Bookmark;
    kinds?: Array<AgentEvent['type']>;
}
export declare class Agent {
    private readonly config;
    private readonly deps;
    private readonly events;
    private readonly hooks;
    private readonly scheduler;
    private readonly todoService?;
    private readonly contextManager;
    private readonly filePool;
    private readonly breakpoints;
    private readonly permissions;
    private readonly model;
    private readonly sandbox;
    private readonly sandboxConfig?;
    private readonly todoConfig?;
    private readonly messageQueue;
    private readonly todoManager;
    private readonly ajv;
    private readonly validatorCache;
    private readonly toolControllers;
    private readonly toolTimeoutMs;
    private readonly maxToolConcurrency;
    private readonly tools;
    private readonly toolDescriptors;
    private readonly toolDescriptorIndex;
    private createdAt;
    private readonly pendingPermissions;
    private readonly toolRunner;
    private messages;
    private state;
    private toolRecords;
    private interrupted;
    private processingPromise;
    private lastProcessingStart;
    private readonly PROCESSING_TIMEOUT;
    private stepCount;
    private lastSfpIndex;
    private lastBookmark?;
    private exposeThinking;
    private permission;
    private subagents?;
    private template;
    private lineage;
    private userToken?;
    private userId?;
    /**
     * 设置用户认证信息
     */
    setUserAuth(userId: string, userToken: string): void;
    private get persistentStore();
    private static requireStore;
    constructor(config: AgentConfig, deps: AgentDependencies, runtime: {
        template: AgentTemplateDefinition;
        model: ModelProvider;
        sandbox: Sandbox;
        sandboxConfig?: SandboxConfig;
        tools: ToolInstance[];
        toolDescriptors: ToolDescriptor[];
        permission: PermissionConfig;
        todoConfig?: TodoConfig;
        subagents?: SubAgentConfig;
        context?: ContextManagerOptions;
    });
    get agentId(): string;
    static create(config: AgentConfig, deps: AgentDependencies): Promise<Agent>;
    private initialize;
    chatStream(input: string, opts?: StreamOptions): AsyncIterable<AgentEventEnvelope<ProgressEvent>>;
    chat(input: string, opts?: StreamOptions): Promise<CompleteResult>;
    complete(input: string, opts?: StreamOptions): Promise<CompleteResult>;
    stream(input: string, opts?: StreamOptions): AsyncIterable<AgentEventEnvelope<ProgressEvent>>;
    send(text: string, options?: SendOptions): Promise<string>;
    schedule(): Scheduler;
    on<T extends ControlEvent['type'] | MonitorEvent['type']>(event: T, handler: (evt: any) => void): () => void;
    subscribe(channels?: Array<'progress' | 'control' | 'monitor'>, opts?: SubscribeOptions): AsyncIterable<AgentEventEnvelope<AgentEvent>>;
    getTodos(): TodoItem[];
    setTodos(todos: TodoInput[]): Promise<void>;
    updateTodo(todo: TodoInput): Promise<void>;
    deleteTodo(id: string): Promise<void>;
    decide(permissionId: string, decision: 'allow' | 'deny', note?: string): Promise<void>;
    interrupt(opts?: {
        note?: string;
    }): Promise<void>;
    snapshot(label?: string): Promise<SnapshotId>;
    fork(sel?: SnapshotId | {
        at?: string;
    }): Promise<Agent>;
    status(): Promise<AgentStatus>;
    info(): Promise<AgentInfo>;
    private setBreakpoint;
    remind(content: string, options?: ReminderOptions): void;
    spawnSubAgent(templateId: string, prompt: string, runtime?: SubAgentRuntime): Promise<CompleteResult>;
    /**
     * Create and run a sub-agent with a task, without requiring subagents config.
     * This is useful for tools that want to delegate work to specialized agents.
     */
    delegateTask(config: {
        templateId: string;
        prompt: string;
        model?: string;
        tools?: string[];
    }): Promise<CompleteResult>;
    static resume(agentId: string, config: AgentConfig, deps: AgentDependencies, opts?: {
        autoRun?: boolean;
        strategy?: ResumeStrategy;
    }): Promise<Agent>;
    static resumeFromStore(agentId: string, deps: AgentDependencies, opts?: {
        autoRun?: boolean;
        strategy?: ResumeStrategy;
        overrides?: Partial<AgentConfig>;
    }): Promise<Agent>;
    private ensureProcessing;
    private runStep;
    private executeTools;
    private processToolCall;
    private registerToolRecord;
    private updateToolRecord;
    private snapshotToolRecord;
    private normalizeToolRecord;
    private preview;
    private requestPermission;
    private findLastSfp;
    private appendSyntheticToolResults;
    private autoSealIncompleteCalls;
    private validateToolArgs;
    private makeToolResult;
    private buildSealPayload;
    private wrapReminder;
    private getToolSchemas;
    private setState;
    private persistMessages;
    private persistToolRecords;
    private persistInfo;
    private registerTodoTools;
    /**
     * 收集所有工具的使用说明
     */
    private collectToolPrompts;
    /**
     * 渲染工具手册
     */
    private renderManual;
    /**
     * 刷新工具手册（运行时工具变更时调用）
     */
    private refreshToolManual;
    /**
     * 根据错误类型生成建议
     */
    private getErrorRecommendations;
    /**
     * 将工具手册注入到系统提示中
     */
    private injectManualIntoSystemPrompt;
    private enqueueMessage;
    private handleExternalFileChange;
    private relativePath;
    private static generateAgentId;
}
export {};
