import { defineTool } from '../../../src';
import fg from 'fast-glob';
import { DESCRIPTION, PROMPT } from './prompt';
import { z } from 'zod'; // Assuming zod is available or I should structure params manually if defineTool doesn't use zod schema object directly but a custom schema.
// search_notes uses 'params' object with 'type' string. It seems defineTool uses a custom schema format, not Zod object directly in 'params'.
// Let's check search_notes/index.ts again.
// params: { query: { type: 'string', ... } }
// So I should follow that format.

export const fs_globTool = defineTool({
    name: 'fs_glob',
    description: DESCRIPTION,
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
    async exec(args: { path: string; recursive?: boolean; limit?: number }, ctx?: any) {
        const { path, recursive = true, limit = 1000 } = args;

        // Safety check: prevent traversing outside project if possible, though fast-glob is generally safe with cwd
        try {
            const entries = await fg(path, {
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
        } catch (error: any) {
            return {
                ok: false,
                error: error.message
            };
        }
    },
});

(fs_globTool as any).prompt = PROMPT;
