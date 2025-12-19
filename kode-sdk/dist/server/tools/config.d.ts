/**
 * 工具统一配置文件
 *
 * 用于统一管理 JWT 认证、API 地址等配置
 * 如果需要修改后端 API 地址，只需在此文件或环境变量中修改一次即可
 */
/**
 * 后端 API 配置
 */
export declare const API_CONFIG: {
    /**
     * 主后端 API 地址
     *
     * 可以通过环境变量 BACKEND_API_URL 修改
     * 默认值: http://localhost:8000
     */
    BASE_URL: string;
    /**
     * API 请求超时时间（毫秒）
     */
    TIMEOUT: number;
    /**
     * API 版本
     */
    VERSION: string;
};
/**
 * JWT 认证配置
 */
export declare const AUTH_CONFIG: {
    /**
     * 从环境变量获取默认用户 JWT Token
     * （可选，主要用于测试）
     */
    DEFAULT_USER_TOKEN: string | undefined;
    /**
     * Token 过期时间检查（毫秒）
     */
    TOKEN_EXPIRY_BUFFER: number;
};
/**
 * GLM AI 配置（用于自然语言解析）
 */
export declare const GLM_CONFIG: {
    /**
     * GLM API Key
     */
    API_KEY: string;
    /**
     * GLM API 地址
     */
    BASE_URL: string;
    /**
     * 使用的模型
     */
    MODEL: string;
    /**
     * 默认温度参数
     */
    TEMPERATURE: number;
    /**
     * 最大 token 数
     */
    MAX_TOKENS: number;
};
/**
 * 工具通用配置
 */
export declare const TOOL_CONFIG: {
    /**
     * 默认最大重试次数
     */
    MAX_RETRY: number;
    /**
     * 重试间隔（毫秒）
     */
    RETRY_INTERVAL: number;
    /**
     * 是否启用调试日志
     */
    DEBUG: boolean;
};
/**
 * 获取完整的 API URL
 * @param endpoint API 端点，例如 '/api/v1/tasks'
 * @returns 完整的 URL
 */
export declare function getApiUrl(endpoint: string): string;
/**
 * 获取 Authorization header
 * @param token JWT token
 * @returns Authorization header 字符串
 */
export declare function getAuthHeader(token: string): string;
/**
 * 获取通用请求 headers
 * @param token JWT token
 * @returns 请求 headers 对象
 */
export declare function getRequestHeaders(token: string): Record<string, string>;
/**
 * 从 JWT Token 解析用户 ID
 * @param token JWT token
 * @returns 用户 ID，解析失败返回 null
 */
export declare function parseUserIdFromToken(token: string): number | null;
/**
 * 打印当前配置（用于调试）
 */
export declare function printConfig(): void;
declare const _default: {
    API_CONFIG: {
        /**
         * 主后端 API 地址
         *
         * 可以通过环境变量 BACKEND_API_URL 修改
         * 默认值: http://localhost:8000
         */
        BASE_URL: string;
        /**
         * API 请求超时时间（毫秒）
         */
        TIMEOUT: number;
        /**
         * API 版本
         */
        VERSION: string;
    };
    AUTH_CONFIG: {
        /**
         * 从环境变量获取默认用户 JWT Token
         * （可选，主要用于测试）
         */
        DEFAULT_USER_TOKEN: string | undefined;
        /**
         * Token 过期时间检查（毫秒）
         */
        TOKEN_EXPIRY_BUFFER: number;
    };
    GLM_CONFIG: {
        /**
         * GLM API Key
         */
        API_KEY: string;
        /**
         * GLM API 地址
         */
        BASE_URL: string;
        /**
         * 使用的模型
         */
        MODEL: string;
        /**
         * 默认温度参数
         */
        TEMPERATURE: number;
        /**
         * 最大 token 数
         */
        MAX_TOKENS: number;
    };
    TOOL_CONFIG: {
        /**
         * 默认最大重试次数
         */
        MAX_RETRY: number;
        /**
         * 重试间隔（毫秒）
         */
        RETRY_INTERVAL: number;
        /**
         * 是否启用调试日志
         */
        DEBUG: boolean;
    };
    getApiUrl: typeof getApiUrl;
    getAuthHeader: typeof getAuthHeader;
    getRequestHeaders: typeof getRequestHeaders;
    parseUserIdFromToken: typeof parseUserIdFromToken;
    printConfig: typeof printConfig;
};
export default _default;
