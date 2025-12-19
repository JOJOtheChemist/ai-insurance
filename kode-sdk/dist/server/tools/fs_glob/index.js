"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs_globTool = void 0;
const src_1 = require("../../../src");
const fast_glob_1 = __importDefault(require("fast-glob"));
const prompt_1 = require("./prompt");
// search_notes uses 'params' object with 'type' string. It seems defineTool uses a custom schema format, not Zod object directly in 'params'.
// Let's check search_notes/index.ts again.
// params: { query: { type: 'string', ... } }
// So I should follow that format.
exports.fs_globTool = (0, src_1.defineTool)({
    name: 'fs_glob',
    description: prompt_1.DESCRIPTION,
    params: {
        path: {
            type: 'string',
            description: 'Glob pattern to search for files (e.g. "**/*.ts")',
        },
        recursive: {
            type: 'boolean',
            description: 'Whether to search recursively (default: true)',
        },
        limit: {
            type: 'number',
            description: 'Maximum number of files to return (default: 1000)',
        },
    },
    async exec(args, ctx) {
        const { path, recursive = true, limit = 1000 } = args;
        // Safety check: prevent traversing outside project if possible, though fast-glob is generally safe with cwd
        try {
            const entries = await (0, fast_glob_1.default)(path, {
                dot: true,
                onlyFiles: true,
                ignore: ['**/node_modules/**', '**/.git/**'],
                cwd: process.cwd(), // Working directory
            });
            return {
                ok: true,
                files: entries.slice(0, limit),
                total: entries.length,
                limit_applied: entries.length > limit
            };
        }
        catch (error) {
            return {
                ok: false,
                error: error.message
            };
        }
    },
});
exports.fs_globTool.prompt = prompt_1.PROMPT;
