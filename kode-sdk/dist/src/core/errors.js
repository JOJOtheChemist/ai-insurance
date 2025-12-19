"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeError = void 0;
exports.assert = assert;
class ResumeError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = 'ResumeError';
    }
}
exports.ResumeError = ResumeError;
function assert(condition, code, message) {
    if (!condition) {
        throw new ResumeError(code, message);
    }
}
