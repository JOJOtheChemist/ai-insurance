/**
 * 字符串相似度计算工具
 * 使用 Levenshtein 距离算法
 */

/**
 * 计算两个字符串的 Levenshtein 距离
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  
  // 创建距离矩阵
  const matrix: number[][] = Array(len1 + 1)
    .fill(null)
    .map(() => Array(len2 + 1).fill(0));
  
  // 初始化第一行和第一列
  for (let i = 0; i <= len1; i++) matrix[i][0] = i;
  for (let j = 0; j <= len2; j++) matrix[0][j] = j;
  
  // 填充矩阵
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // 删除
        matrix[i][j - 1] + 1,      // 插入
        matrix[i - 1][j - 1] + cost // 替换
      );
    }
  }
  
  return matrix[len1][len2];
}

/**
 * 计算字符串相似度（0-1之间，1表示完全相同）
 * 基于 Levenshtein 距离
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  // 空字符串处理
  if (s1.length === 0 && s2.length === 0) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  // 完全相同
  if (s1 === s2) return 1;
  
  const distance = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  
  return 1 - distance / maxLen;
}

/**
 * 判断两个字符串是否相似（阈值默认0.7）
 */
export function isSimilar(str1: string, str2: string, threshold = 0.7): boolean {
  return calculateSimilarity(str1, str2) >= threshold;
}

/**
 * 在数组中找到最相似的字符串
 */
export function findMostSimilar(
  target: string,
  candidates: string[],
  threshold = 0.7
): { value: string; score: number } | null {
  let best: { value: string; score: number } | null = null;
  
  for (const candidate of candidates) {
    const score = calculateSimilarity(target, candidate);
    if (score >= threshold && (!best || score > best.score)) {
      best = { value: candidate, score };
    }
  }
  
  return best;
}


