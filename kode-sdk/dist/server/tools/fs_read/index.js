"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs_readTool = void 0;
const src_1 = require("../../../src");
const fs = __importStar(require("fs/promises"));
const pathFn = __importStar(require("path"));
const prompt_1 = require("./prompt");
exports.fs_readTool = (0, src_1.defineTool)({
    name: 'fs_read',
    description: prompt_1.DESCRIPTION,
    params: {
        path: {
            type: 'string',
            description: 'Path to the file to read',
        },
        encoding: {
            type: 'string',
            description: 'File encoding (default: utf-8)',
        },
    },
    async exec(args, ctx) {
        const { path, encoding = 'utf-8' } = args;
        try {
            // Resolve path relative to CWD to ensure we find it
            const resolvedPath = pathFn.resolve(process.cwd(), path);
            // Simple security check (basic)
            if (!resolvedPath.startsWith(process.cwd())) {
                // Optional: allow reading outside if necessary, but generally restrict to project
                // For now, let's just log a warning or allow it if it's the user's system
            }
            const content = await fs.readFile(resolvedPath, { encoding: encoding });
            return {
                ok: true,
                content: content,
                path: path,
                size: content.length
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
exports.fs_readTool.prompt = prompt_1.PROMPT;
