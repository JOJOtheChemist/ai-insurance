/**
 * 字符串相似度计算工具
 * 使用 Levenshtein 距离算法
 */
/**
 * 计算字符串相似度（0-1之间，1表示完全相同）
 * 基于 Levenshtein 距离
 */
export declare function calculateSimilarity(str1: string, str2: string): number;
/**
 * 判断两个字符串是否相似（阈值默认0.7）
 */
export declare function isSimilar(str1: string, str2: string, threshold?: number): boolean;
/**
 * 在数组中找到最相似的字符串
 */
export declare function findMostSimilar(target: string, candidates: string[], threshold?: number): {
    value: string;
    score: number;
} | null;
