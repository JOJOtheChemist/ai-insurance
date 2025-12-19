export type ResumeErrorCode = 'SESSION_NOT_FOUND' | 'AGENT_NOT_FOUND' | 'TEMPLATE_NOT_FOUND' | 'TEMPLATE_VERSION_MISMATCH' | 'SANDBOX_INIT_FAILED' | 'CORRUPTED_DATA';
export declare class ResumeError extends Error {
    readonly code: ResumeErrorCode;
    constructor(code: ResumeErrorCode, message: string);
}
export declare function assert(condition: any, code: ResumeErrorCode, message: string): asserts condition;
