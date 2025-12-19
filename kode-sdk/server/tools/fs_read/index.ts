import { defineTool } from '../../../src';
import * as fs from 'fs/promises';
import * as pathFn from 'path';
import { DESCRIPTION, PROMPT } from './prompt';

export const fs_readTool = defineTool({
    name: 'fs_read',
    description: DESCRIPTION,
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
    async exec(args: { path: string; encoding?: string }, ctx?: any) {
        const { path, encoding = 'utf-8' } = args;

        try {
            // Resolve path relative to CWD to ensure we find it
            const resolvedPath = pathFn.resolve(process.cwd(), path);

            // Simple security check (basic)
            if (!resolvedPath.startsWith(process.cwd())) {
                // Optional: allow reading outside if necessary, but generally restrict to project
                // For now, let's just log a warning or allow it if it's the user's system
            }

            const content = await fs.readFile(resolvedPath, { encoding: encoding as BufferEncoding });

            return {
                ok: true,
                content: content,
                path: path,
                size: content.length
            };
        } catch (error: any) {
            return {
                ok: false,
                error: error.message
            };
        }
    },
});

(fs_readTool as any).prompt = PROMPT;
