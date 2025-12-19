"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = 'Search for a string or pattern in files';
exports.PROMPT = `Use this tool to search within files.
- Provides 'grep'-like functionality.
- Supports regex or literal string matching.
- returns line numbers and previews.
- Use pattern args to narrow down search scope (e.g. "src/**/*.ts").`;
