export const DESCRIPTION = 'List files matching a glob pattern';

export const PROMPT = `Use this tool to find files in the project.
- Use pattern "**/*" to list everything (respects .gitignore by default if supported).
- Use specific patterns like "src/**/*.ts" to narrow down.
- Returns a list of file paths.`;
