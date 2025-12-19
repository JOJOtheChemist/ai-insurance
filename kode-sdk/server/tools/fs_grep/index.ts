import { defineTool } from '../../../src';
import fg from 'fast-glob';
import * as fs from 'fs/promises';
import * as pathFn from 'path';
import { DESCRIPTION, PROMPT } from './prompt';

export const fs_grepTool = defineTool({
    name: 'fs_grep',
    description: DESCRIPTION,
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
    async exec(args: {
        path: string;
        pattern: string;
        regex?: boolean;
        case_sensitive?: boolean;
        max_results?: number
    }, ctx?: any) {
        const {
            path: searchPath,
            pattern,
            regex = false,
            case_sensitive = true,
            max_results = 200
        } = args;

        try {
            // 1. Find files
            const files = await fg(searchPath, {
                dot: true,
                onlyFiles: true,
                ignore: ['**/node_modules/**', '**/.git/**'],
                cwd: process.cwd(),
            });

            const results: Array<{
                path: string;
                line: number;
                column: number;
                preview: string;
            }> = [];

            let count = 0;

            // Prepare regex
            let searchRegex: RegExp;
            try {
                const flags = case_sensitive ? 'g' : 'gi';
                if (regex) {
                    searchRegex = new RegExp(pattern, flags);
                } else {
                    // Escape special chars for literal search
                    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    searchRegex = new RegExp(escaped, flags);
                }
            } catch (e: any) {
                return { ok: false, error: `Invalid regex: ${e.message}` };
            }

            // 2. Search in files
            for (const file of files) {
                if (count >= max_results) break;

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
                            if (count >= max_results) break;
                        }
                    }

                } catch (err) {
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

        } catch (error: any) {
            return {
                ok: false,
                error: error.message
            };
        }
    },
});

(fs_grepTool as any).prompt = PROMPT;
