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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs_grepTool = void 0;
const src_1 = require("../../../src");
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs = __importStar(require("fs/promises"));
const pathFn = __importStar(require("path"));
const prompt_1 = require("./prompt");
exports.fs_grepTool = (0, src_1.defineTool)({
    name: 'fs_grep',
    description: prompt_1.DESCRIPTION,
    params: {
        path: {
            type: 'string',
            description: 'Glob pattern for files to search in (e.g. "src/**/*.ts")',
        },
        pattern: {
            type: 'string',
            description: 'Text or regex pattern to search for',
        },
        regex: {
            type: 'boolean',
            description: 'Treat pattern as a regular expression (default: false)',
        },
        case_sensitive: {
            type: 'boolean',
            description: 'Case sensitive search (default: true)',
        },
        max_results: {
            type: 'number',
            description: 'Maximum number of results to return (default: 200)',
        }
    },
    async exec(args, ctx) {
        const { path: searchPath, pattern, regex = false, case_sensitive = true, max_results = 200 } = args;
        try {
            // 1. Find files
            const files = await (0, fast_glob_1.default)(searchPath, {
                dot: true,
                onlyFiles: true,
                ignore: ['**/node_modules/**', '**/.git/**'],
                cwd: process.cwd(),
            });
            const results = [];
            let count = 0;
            // Prepare regex
            let searchRegex;
            try {
                const flags = case_sensitive ? 'g' : 'gi';
                if (regex) {
                    searchRegex = new RegExp(pattern, flags);
                }
                else {
                    // Escape special chars for literal search
                    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    searchRegex = new RegExp(escaped, flags);
                }
            }
            catch (e) {
                return { ok: false, error: `Invalid regex: ${e.message}` };
            }
            // 2. Search in files
            for (const file of files) {
                if (count >= max_results)
                    break;
                try {
                    // Limit file size read? For now read all.
                    const content = await fs.readFile(pathFn.resolve(process.cwd(), file), 'utf-8');
                    const lines = content.split('\n');
                    for (let i = 0; i < lines.length; i++) {
                        const lineContent = lines[i];
                        // Reset lastIndex for global regex on new string if needed, 
                        // but here we create new regex or use strict match logic.
                        // Actually `match` or `exec`? 
                        // If we want multiple matches per line? Usually grep returns the line once.
                        // Simpler approach: check if line matches
                        if (searchRegex.test(lineContent)) {
                            // Find column (index of first match)
                            // Reset regex to find index
                            searchRegex.lastIndex = 0;
                            const match = searchRegex.exec(lineContent);
                            const col = match ? match.index + 1 : 1;
                            results.push({
                                path: file,
                                line: i + 1,
                                column: col,
                                preview: lineContent.trim().substring(0, 200) // Truncate preview
                            });
                            count++;
                            if (count >= max_results)
                                break;
                        }
                    }
                }
                catch (err) {
                    // Ignore read errors (e.g. binary files or permissions)
                    continue;
                }
            }
            return {
                ok: true,
                results: results,
                total: results.length,
                limit_hit: count >= max_results
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
exports.fs_grepTool.prompt = prompt_1.PROMPT;
