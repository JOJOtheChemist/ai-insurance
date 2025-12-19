/**
 * 拼音匹配工具
 * 用于中文任务名称的模糊匹配
 */
/**
 * 获取拼音首字母（简化版）
 * TODO: 完整实现可以使用 pinyin-pro 库
 *
 * 当前实现：提取字母和数字，转小写
 */
export declare function getPinyinInitials(text: string): string;
/**
 * 判断两个字符串的拼音首字母是否相似
 */
export declare function pinyinSimilar(str1: string, str2: string): boolean;
