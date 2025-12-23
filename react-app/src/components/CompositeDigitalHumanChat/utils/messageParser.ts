
export const knownKeys = ['"content"', '"insight_summary"', '"quick_replies"', '"suggested_next_steps"', '"next_actions"', '"customer_profile"', '"thought"', '"thinking"', '"recommendations"', '"sales_pitch"'];

export function tryParsePartialJson(jsonStr: string): any {
    if (!jsonStr) return null;

    // 1. 尝试直接解析
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        // Continue to repair
    }

    let repaired = jsonStr.trim();

    // 2. 找到第一个 '{' (如果前面有 garbage)
    const firstBrace = repaired.indexOf('{');
    if (firstBrace === -1) return null; // No JSON object start found

    repaired = repaired.substring(firstBrace);

    // 3. 智能修复：闭合字符串、删除尾部逗号、处理悬空冒号、闭合括号
    let inString = false;
    let escape = false;
    const stack: string[] = [];

    for (let i = 0; i < repaired.length; i++) {
        const char = repaired[i];

        if (escape) {
            escape = false;
            continue;
        }

        if (char === '\\') {
            escape = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            continue;
        }

        if (!inString) {
            if (char === '{') stack.push('}');
            else if (char === '[') stack.push(']');
            else if (char === '}') {
                if (stack.length > 0 && stack[stack.length - 1] === '}') stack.pop();
            }
            else if (char === ']') {
                if (stack.length > 0 && stack[stack.length - 1] === ']') stack.pop();
            }
        }
    }

    // 4. 根据最终状态进行修补

    // 如果在字符串中结束，先闭合引号
    if (inString) {
        repaired += '"';
    }

    // 再次清理一下尾部以处理特殊情况
    repaired = repaired.trim();
    if (repaired.endsWith(':')) {
        repaired += 'null'; // 补一个 null 值
    } else if (repaired.endsWith(',')) {
        repaired = repaired.slice(0, -1); // 移除尾部逗号
    }

    // 闭合剩余的括号
    while (stack.length > 0) {
        repaired += stack.pop();
    }

    try {
        return JSON.parse(repaired);
    } catch (e) {
        // console.warn("Partial JSON repair failed", e);
        return null;
    }
}
