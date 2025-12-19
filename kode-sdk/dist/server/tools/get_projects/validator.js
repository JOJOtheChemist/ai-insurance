"use strict";
/**
 * Get projects tool validation logic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInput = validateInput;
/**
 * 验证输入参数
 * 由于此工具不需要参数，验证总是通过
 */
function validateInput(args) {
    // get_projects 不需要任何参数，所以总是有效
    return { valid: true };
}
