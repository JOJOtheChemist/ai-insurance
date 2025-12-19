"use strict";
/**
 * 业务文件编辑工具模板工厂
 *
 * 这是一个可以直接引入和使用的模板工厂函数。
 * 通过传入配置参数，快速创建符合你业务需求的专用工具。
 *
 * 使用示例：
 * ```typescript
 * import { createBusinessEditTool } from './business_edit_template';
 *
 * const MyConfigTool = createBusinessEditTool({
 *   name: 'config_edit',
 *   description: 'Edit application configuration files',
 *   dataSchema: z.object({
 *     key: z.string(),
 *     value: z.union([z.string(), z.number(), z.boolean()]),
 *   }),
 *   fileFormat: 'json',
 *   validator: async (data, existing, operation) => {
 *     // 你的校验逻辑
 *   },
 *   operator: (existing, data, operation) => {
 *     // 你的操作逻辑
 *   },
 * });
 * ```
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBusinessEditTool = createBusinessEditTool;
exports.createArrayBusinessTool = createArrayBusinessTool;
const tool_1 = require("./tool");
const zod_1 = require("zod");
const type_inference_1 = require("./type-inference");
// ============================================================================
// 默认文件格式处理器
// ============================================================================
const defaultParsers = {
    json: (content) => {
        try {
            return JSON.parse(content);
        }
        catch {
            return {};
        }
    },
    yaml: (content) => {
        // 如果需要 YAML 支持，需要安装 yaml 包
        try {
            const yaml = require('yaml');
            return yaml.parse(content);
        }
        catch {
            return {};
        }
    },
    toml: (content) => {
        // 如果需要 TOML 支持，需要安装 @iarna/toml 包
        try {
            const toml = require('@iarna/toml');
            return toml.parse(content);
        }
        catch {
            return {};
        }
    },
    custom: () => ({}),
};
const defaultSerializers = {
    json: (data) => JSON.stringify(data, null, 2),
    yaml: (data) => {
        try {
            const yaml = require('yaml');
            return yaml.stringify(data);
        }
        catch {
            return JSON.stringify(data, null, 2);
        }
    },
    toml: (data) => {
        try {
            const toml = require('@iarna/toml');
            return toml.stringify(data);
        }
        catch {
            return JSON.stringify(data, null, 2);
        }
    },
    custom: () => '',
};
// ============================================================================
// 模板工厂函数
// ============================================================================
function createBusinessEditTool(config) {
    const { name, description, dataSchema, fileFormat = 'json', fileParser, fileSerializer, validator, operator, metadata = {}, prompt, } = config;
    // 选择文件处理器
    const parser = fileParser || defaultParsers[fileFormat];
    const serializer = fileSerializer || defaultSerializers[fileFormat];
    if (fileFormat === 'custom' && (!fileParser || !fileSerializer)) {
        throw new Error(`File format is 'custom' but fileParser and fileSerializer are not provided`);
    }
    // 定义编辑操作的 Schema
    const editSchema = zod_1.z.object({
        path: type_inference_1.patterns.filePath('Path to business file'),
        data: dataSchema,
        operation: zod_1.z.enum(['create', 'update', 'delete']).describe('Operation type'),
    });
    // 创建工具
    const BusinessEditTool = (0, tool_1.tool)({
        name,
        description,
        parameters: zod_1.z.object({
            edits: zod_1.z.array(editSchema).describe('List of business edit operations'),
        }),
        async execute(args, ctx) {
            const { edits } = args;
            const results = [];
            for (const edit of edits) {
                try {
                    // ============================================================
                    // 步骤1: 文件新鲜度检查（复用基础设施）
                    // ============================================================
                    const freshness = await ctx.services?.filePool?.validateWrite(edit.path);
                    if (freshness && !freshness.isFresh) {
                        results.push({
                            path: edit.path,
                            status: 'skipped',
                            message: 'File changed externally',
                            _validationError: true,
                        });
                        continue;
                    }
                    // ============================================================
                    // 步骤2: 读取现有文件内容
                    // ============================================================
                    const content = await ctx.sandbox.fs.read(edit.path);
                    // ============================================================
                    // 步骤3: 解析现有数据
                    // ============================================================
                    const existingData = parser(content);
                    // ============================================================
                    // 步骤4: 业务数据校验
                    // ============================================================
                    const validationResult = await validator(edit.data, existingData, edit.operation);
                    if (!validationResult.valid) {
                        results.push({
                            path: edit.path,
                            status: 'error',
                            message: validationResult.error,
                            _validationError: true,
                            _businessError: true,
                            errors: validationResult.errors,
                        });
                        continue;
                    }
                    // ============================================================
                    // 步骤5: 执行业务逻辑
                    // ============================================================
                    const updatedData = operator(existingData, edit.data, edit.operation);
                    // ============================================================
                    // 步骤6: 序列化并写入文件
                    // ============================================================
                    const updatedContent = serializer(updatedData);
                    await ctx.sandbox.fs.write(edit.path, updatedContent);
                    await ctx.services?.filePool?.recordEdit(edit.path);
                    results.push({
                        path: edit.path,
                        status: 'ok',
                        operation: edit.operation,
                    });
                }
                catch (error) {
                    results.push({
                        path: edit.path,
                        status: 'error',
                        message: error?.message || String(error),
                        _thrownError: true,
                    });
                }
            }
            return {
                ok: results.every((r) => r.status === 'ok'),
                results,
            };
        },
        metadata: {
            readonly: false,
            version: metadata.version || '1.0',
            tags: metadata.tags || ['business', 'edit'],
            ...metadata,
        },
    });
    // 设置 Prompt
    if (prompt) {
        BusinessEditTool.prompt = prompt;
    }
    else {
        // 生成默认 Prompt
        BusinessEditTool.prompt = generateDefaultPrompt(name, description);
    }
    return BusinessEditTool;
}
// ============================================================================
// 默认 Prompt 生成器
// ============================================================================
function generateDefaultPrompt(name, description) {
    return `Use this tool to edit business files with structured data validation.

Tool: ${name}
Description: ${description}

Guidelines:
- Each operation specifies a path, data structure, and operation type (create/update/delete).
- The tool validates data against business rules before applying changes.
- Use fs_read to verify the current file state before editing.
- All edits are applied sequentially; failures are isolated per file.
- Each edit includes detailed status feedback (ok, skipped, or error).

Data Validation:
- Schema validation ensures data structure correctness.
- Business rules validation ensures data meets business requirements.
- Validation errors include field-level details for easy debugging.

Safety/Limitations:
- Freshness validation prevents conflicts with external modifications.
- Failed edits are reported but don't halt the batch.
- Business rule violations return structured error information.

Operation Types:
- create: Add new items to the file
- update: Modify existing items
- delete: Remove items from the file`;
}
// ============================================================================
// 辅助函数：创建简单的数组操作工具
// ============================================================================
/**
 * 快速创建基于数组结构的业务工具
 * 适用于文件内容是数组的情况（如配置列表、API列表等）
 */
function createArrayBusinessTool(config) {
    const { name, description, itemSchema, idField = 'id', fileFormat = 'json', validator, metadata, prompt, } = config;
    // 默认校验器：检查ID唯一性
    const defaultValidator = async (data, existing, operation) => {
        const errors = [];
        const itemId = data[idField];
        if (operation === 'create') {
            if (existing?.items?.some((item) => item[idField] === itemId)) {
                errors.push({
                    field: idField,
                    message: `${idField} ${itemId} already exists`,
                    code: 'DUPLICATE_ID',
                });
            }
        }
        if (operation === 'update' || operation === 'delete') {
            if (!existing?.items?.some((item) => item[idField] === itemId)) {
                errors.push({
                    field: idField,
                    message: `${idField} ${itemId} not found`,
                    code: 'NOT_FOUND',
                });
            }
        }
        return {
            valid: errors.length === 0,
            error: errors.length > 0 ? errors.map(e => e.message).join('; ') : undefined,
            errors: errors.length > 0 ? errors : undefined,
        };
    };
    // 默认操作器：数组操作
    const defaultOperator = (existing, newData, operation) => {
        const updated = { ...existing };
        if (!updated.items) {
            updated.items = [];
        }
        const itemId = newData[idField];
        switch (operation) {
            case 'create':
                updated.items.push(newData);
                break;
            case 'update':
                const index = updated.items.findIndex((item) => item[idField] === itemId);
                if (index !== -1) {
                    updated.items[index] = { ...updated.items[index], ...newData };
                }
                break;
            case 'delete':
                updated.items = updated.items.filter((item) => item[idField] !== itemId);
                break;
        }
        return updated;
    };
    return createBusinessEditTool({
        name,
        description,
        dataSchema: itemSchema,
        fileFormat,
        validator: validator || defaultValidator,
        operator: defaultOperator,
        metadata,
        prompt,
    });
}
