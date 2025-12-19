"use strict";
/**
 * Calculator tool prompts and descriptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '执行数学计算，支持加减乘除';
exports.PROMPT = `使用此工具执行基本的数学运算。

支持的运算类型:
- add (加法): 计算两个数字的和
- subtract (减法): 计算两个数字的差
- multiply (乘法): 计算两个数字的积
- divide (除法): 计算两个数字的商

参数说明:
- operation: 运算类型，必须是 add、subtract、multiply 或 divide 之一
- a: 第一个数字（被运算数）
- b: 第二个数字（运算数）

返回结果:
- ok: 操作是否成功
- operation: 执行的运算类型
- operands: 操作数 { a, b }
- result: 计算结果
- error: 错误信息（如果失败）

使用示例:
- calculator({ operation: 'add', a: 5, b: 3 }) // 返回 8
- calculator({ operation: 'multiply', a: 4, b: 7 }) // 返回 28
- calculator({ operation: 'divide', a: 10, b: 2 }) // 返回 5

注意事项:
- 除法运算时，除数（b）不能为 0
- 所有参数都是必需的
- 计算结果为浮点数类型`;
