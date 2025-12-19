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
import { ZodType } from 'zod';
export type BusinessOperation = 'create' | 'update' | 'delete';
export interface ValidationResult {
    valid: boolean;
    error?: string;
    errors?: Array<{
        field: string;
        message: string;
        code: string;
    }>;
}
export type BusinessValidator<TData = any> = (data: TData, existingData: any, operation: BusinessOperation) => Promise<ValidationResult> | ValidationResult;
export type BusinessOperator<TData = any> = (existingData: any, newData: TData, operation: BusinessOperation) => any;
export type FileParser = (content: string) => any;
export type FileSerializer = (data: any) => string;
export type FileFormat = 'json' | 'yaml' | 'toml' | 'custom';
export interface BusinessEditToolConfig<TData = any> {
    /** 工具名称（必须唯一） */
    name: string;
    /** 工具描述 */
    description: string;
    /** 业务数据结构 Schema（Zod） */
    dataSchema: ZodType<TData>;
    /** 文件格式 */
    fileFormat?: FileFormat;
    /** 自定义文件解析器（如果 fileFormat 为 'custom' 则必须提供） */
    fileParser?: FileParser;
    /** 自定义文件序列化器（如果 fileFormat 为 'custom' 则必须提供） */
    fileSerializer?: FileSerializer;
    /** 业务数据校验函数 */
    validator: BusinessValidator<TData>;
    /** 业务操作函数 */
    operator: BusinessOperator<TData>;
    /** 工具元数据 */
    metadata?: {
        version?: string;
        tags?: string[];
        readonly?: boolean;
    };
    /** 自定义 Prompt（可选） */
    prompt?: string;
}
export interface EditResult {
    path: string;
    status: 'ok' | 'skipped' | 'error';
    operation?: BusinessOperation;
    message?: string;
    _validationError?: boolean;
    _businessError?: boolean;
    errors?: Array<{
        field: string;
        message: string;
        code: string;
    }>;
}
export declare function createBusinessEditTool<TData = any>(config: BusinessEditToolConfig<TData>): import("./registry").ToolInstance;
/**
 * 快速创建基于数组结构的业务工具
 * 适用于文件内容是数组的情况（如配置列表、API列表等）
 */
export declare function createArrayBusinessTool<TItem = any>(config: {
    name: string;
    description: string;
    itemSchema: ZodType<TItem>;
    idField?: string;
    fileFormat?: FileFormat;
    validator?: BusinessValidator<TItem>;
    metadata?: BusinessEditToolConfig<TItem>['metadata'];
    prompt?: string;
}): import("./registry").ToolInstance;
