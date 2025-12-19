/**
 * Batch Edit Tool Template - Prompt
 *
 * 批量编辑工具的提示词模板
 */
export declare const DESCRIPTION = "Batch edit operations with preview, backup, and diff support";
export declare const PROMPT = "Batch edit tool with advanced features.\n\nFeatures:\n- Preview mode: Calculate diff without executing\n- Backup: Automatic backup before modifications\n- Diff calculation: Show changes for each operation\n- Permission check: Validate user permissions\n- Operation-level approval: Approve/reject individual operations\n\nUsage:\n1. Preview mode: Set preview=true to see changes without executing\n2. Review differences: Check the diff and stats for each operation\n3. Approve operations: Use approvedIndices to specify which operations to execute\n4. Execute: Call again with preview=false and approvedIndices\n\nOperations:\n- create: Add new items\n- update: Modify existing items\n- delete: Remove items\n\nSafety:\n- All operations are backed up before execution\n- Failed operations trigger automatic restore\n- Permission checks prevent unauthorized access\n- Preview mode allows review before changes";
