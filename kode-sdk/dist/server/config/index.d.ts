/**
 * 服务器配置管理
 */
export declare const config: {
    readonly port: number;
    readonly host: string;
    readonly ai: {
        readonly apiKey: string | undefined;
        readonly modelId: string;
        readonly baseUrl: string | undefined;
    };
    readonly agent: {
        readonly toolTimeoutMs: 30000;
        readonly maxToolConcurrency: 1;
        readonly workDir: "./workspace";
    };
    readonly isDevelopment: boolean;
};
/**
 * 验证必需的配置项
 */
export declare function validateConfig(): {
    valid: boolean;
    errors: string[];
};
