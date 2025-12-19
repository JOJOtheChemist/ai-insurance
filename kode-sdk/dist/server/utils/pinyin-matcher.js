"use strict";
/**
 * 拼音匹配工具
 * 用于中文任务名称的模糊匹配
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPinyinInitials = getPinyinInitials;
exports.pinyinSimilar = pinyinSimilar;
/**
 * 获取拼音首字母（简化版）
 * TODO: 完整实现可以使用 pinyin-pro 库
 *
 * 当前实现：提取字母和数字，转小写
 */
function getPinyinInitials(text) {
    // 移除所有非字母数字字符，转小写
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}
/**
 * 判断两个字符串的拼音首字母是否相似
 */
function pinyinSimilar(str1, str2) {
    const py1 = getPinyinInitials(str1);
    const py2 = getPinyinInitials(str2);
    if (py1 === py2)
        return true;
    if (py1.includes(py2) || py2.includes(py1))
        return true;
    return false;
}
// ========== 完整实现示例（需要安装 pinyin-pro） ==========
// 
// import { pinyin } from 'pinyin-pro';
// 
// export function getPinyinInitials(text: string): string {
//   return pinyin(text, { 
//     pattern: 'first',  // 只返回首字母
//     toneType: 'none',  // 不带声调
//     type: 'array',
//   }).join('').toLowerCase();
// }
// 
// export function getPinyinFull(text: string): string {
//   return pinyin(text, { 
//     toneType: 'none',
//     type: 'array',
//   }).join('').toLowerCase();
// }
// 
// 使用方式：
// getPinyinInitials("团队周会") → "tdzh"
// getPinyinFull("团队周会") → "tuanduizhouhui"
