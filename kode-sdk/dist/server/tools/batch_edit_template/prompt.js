"use strict";
/**
 * Batch Edit Tool Template - Prompt
 *
 * 批量编辑工具的提示词模板
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = 'Batch edit operations with preview, backup, and diff support';
exports.PROMPT = `Batch edit tool with advanced features.

Features:
- Preview mode: Calculate diff without executing
- Backup: Automatic backup before modifications
- Diff calculation: Show changes for each operation
- Permission check: Validate user permissions
- Operation-level approval: Approve/reject individual operations

Usage:
1. Preview mode: Set preview=true to see changes without executing
2. Review differences: Check the diff and stats for each operation
3. Approve operations: Use approvedIndices to specify which operations to execute
4. Execute: Call again with preview=false and approvedIndices

Operations:
- create: Add new items
- update: Modify existing items
- delete: Remove items

Safety:
- All operations are backed up before execution
- Failed operations trigger automatic restore
- Permission checks prevent unauthorized access
- Preview mode allows review before changes`;
