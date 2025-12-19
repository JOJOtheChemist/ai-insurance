"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tool = tool;
exports.tools = tools;
const zod_1 = require("zod");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const registry_1 = require("./registry");
/**
 * 实现
 */
function tool(nameOrDef, executeFn) {
    // 解析参数
    const def = typeof nameOrDef === 'string'
        ? {
            name: nameOrDef,
            description: `Execute ${nameOrDef}`,
            parameters: zod_1.z.any(),
            execute: executeFn,
        }
        : nameOrDef;
    // 生成 JSON Schema
    const input_schema = def.parameters
        ? (0, zod_to_json_schema_1.zodToJsonSchema)(def.parameters, { target: 'openApi3', $refStrategy: 'none' })
        : { type: 'object', properties: {} };
    // 创建工具实例
    const toolInstance = {
        name: def.name,
        description: def.description || `Execute ${def.name}`,
        input_schema,
        hooks: def.hooks,
        async exec(args, ctx) {
            try {
                // 参数验证
                if (def.parameters) {
                    const parseResult = def.parameters.safeParse(args);
                    if (!parseResult.success) {
                        return {
                            ok: false,
                            error: `Invalid parameters: ${parseResult.error.message}`,
                            _validationError: true,
                        };
                    }
                    args = parseResult.data;
                }
                // 增强上下文
                const enhancedCtx = {
                    ...ctx,
                    emit(eventType, data) {
                        ctx.agent?.events?.emitMonitor({
                            type: 'tool_custom_event',
                            toolName: def.name,
                            eventType,
                            data,
                            timestamp: Date.now(),
                        });
                    },
                };
                // 执行工具
                const result = await def.execute(args, enhancedCtx);
                // 如果工具返回 {ok: false}，保持原样
                if (result && typeof result === 'object' && 'ok' in result && result.ok === false) {
                    return result;
                }
                // 正常结果
                return result;
            }
            catch (error) {
                // 捕获工具执行中的所有错误，统一返回格式
                return {
                    ok: false,
                    error: error?.message || String(error),
                    _thrownError: true,
                };
            }
        },
        toDescriptor() {
            return {
                source: 'registered',
                name: def.name,
                registryId: def.name,
                metadata: {
                    version: def.metadata?.version,
                    tags: def.metadata?.tags,
                    cacheable: def.metadata?.cacheable,
                    cacheTTL: def.metadata?.cacheTTL,
                    timeout: def.metadata?.timeout,
                    concurrent: def.metadata?.concurrent,
                    access: def.metadata?.readonly ? 'read' : 'write',
                    mutates: !def.metadata?.readonly,
                },
            };
        },
    };
    // 自动注册到全局 registry
    registry_1.globalToolRegistry.register(def.name, () => toolInstance);
    return toolInstance;
}
/**
 * 批量定义工具
 */
function tools(definitions) {
    return definitions.map((def) => tool(def));
}
