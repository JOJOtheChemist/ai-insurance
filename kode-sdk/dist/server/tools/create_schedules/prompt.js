"use strict";
/**
 * Prompt 构建层
 *
 * 负责：
 * - 构建包含任务列表的系统提示词
 * - 格式化任务列表
 * - 提供 JSON 格式说明和示例
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSystemPrompt = buildSystemPrompt;
exports.buildRetryPrompt = buildRetryPrompt;
/**
 * 构建包含任务列表的系统提示词
 */
function buildSystemPrompt(tasks, customDate) {
    // 获取北京时间的日期和时间
    const now = new Date();
    // 使用 Intl.DateTimeFormat 从北京时区直接获取年月日
    let currentDate = customDate;
    if (!currentDate) {
        const formatter = new Intl.DateTimeFormat('zh-CN', {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const parts = formatter.formatToParts(now);
        const year = parts.find(p => p.type === 'year')?.value || '';
        const month = parts.find(p => p.type === 'month')?.value || '';
        const day = parts.find(p => p.type === 'day')?.value || '';
        currentDate = `${year}-${month}-${day}`;
    }
    // 格式化完整的时间字符串
    const currentTime = now.toLocaleString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long'
    });
    // 任务列表（按分类整理）
    const tasksByCategory = {};
    for (const task of tasks) {
        const category = task.category || '其他';
        if (!tasksByCategory[category]) {
            tasksByCategory[category] = [];
        }
        tasksByCategory[category].push(task);
    }
    // 构建任务列表文本
    let taskListText = '\n## 系统中已有的任务列表（必须精确匹配）\n\n';
    taskListText += '**严格要求：任务名必须从下列列表中【完全一致】地复制，一个字都不能错！**\n';
    taskListText += '**如果任务名不在列表中，验证会失败，你需要重新生成！**\n\n';
    // 收集所有任务名（去重）
    const allTaskNames = new Set();
    for (const [category, categoryTasks] of Object.entries(tasksByCategory)) {
        taskListText += `### ${category}\n`;
        for (const task of categoryTasks.slice(0, 20)) { // 每个分类最多显示20个
            taskListText += `- ${task.name}\n`;
            allTaskNames.add(task.name);
        }
        taskListText += '\n';
    }
    taskListText += '**任务选择规则：**\n';
    taskListText += '- 任务名必须从上述列表【完全一致】复制\n';
    taskListText += '- "写代码" → 选择 "数据结构与算法" 或 "看源码学习tools"\n';
    taskListText += '- "开会" → 选择 "AI评价工作" 或 "跟导师沟通"\n';
    taskListText += '- "学习" → 选择 "ai agent学习" 或 "数据结构与算法"\n';
    taskListText += '- 找不到匹配 → 选择最相关的任务，或使用 "AI评价工作"\n\n';
    // 完整的系统提示词
    const systemPrompt = `# 任务：将用户的自然语言拆解成格式化的 JSON

## 当前时间
${currentTime}（日期：${currentDate}）

${taskListText}

## JSON 格式说明

日期作为key，时间槽数组作为value，嵌套1层：

{
  "YYYY-MM-DD": [
    {
      "time_slot": "单点'09:00'或时间段'09:00-17:00'",
      "planned_task": "计划任务名（可选）",
      "planned_notes": "计划备注（可选）",
      "actual_task": "实际任务名（可选）",
      "actual_notes": "实际备注（可选）",
      "mood": "心情（可选，必须是英文值）"
    }
  ]
}

## 字段说明

- **mood**: 心情值（可选），**必须使用以下英文单词之一**：
  - "happy" - 开心、愉快、高兴
  - "calm" - 平静、冷静
  - "excited" - 兴奋、激动
  - "focused" - 专注、集中
  - "relaxed" - 放松、轻松
  - "neutral" - 中性、一般
  - "tired" - 疲惫、累
  - "stressed" - 压力大、紧张
  - "anxious" - 焦虑、不安
  - "sad" - 难过、伤心
  - "angry" - 生气、愤怒
  - **中文映射示例**：
    - "还不错/不错/挺好" → "happy"
    - "很累/好累" → "tired"
    - "紧张/有压力" → "stressed"
    - "一般/还行" → "neutral"
    - "放松/轻松" → "relaxed"

- **time_slot**: 支持两种格式（**必须是整半小时！**）
  - 单点格式: "09:00" 或 "19:30" - 表示单个时间点
  - 时间段格式: "09:00-17:00" 或 "19:30-20:00" - 表示连续时间段
  - **重要**：只能是 XX:00 或 XX:30，不能是 XX:24 或 XX:15 等
  - 推荐：长时间持续任务用时间段，更简洁

- **时间判断规则**（重要！）:
  - "7点" → 需要判断是 "07:00" 还是 "19:00"
    - **优先考虑当前时间**: 如果当前是下午/晚上，"7点"更可能指晚上19:00（尤其是说"刚才"、"到现在"等）
    - **结合活动类型**: 吃饭→可能是晚饭19:00；起床→早上07:00；工作→根据当前时间判断
    - **常规习惯**: 写代码、开会通常在白天或晚上；睡觉、起床在早上或深夜
  - "当前时间 20:24" → 向下取整为 "20:00"
  - "当前时间 20:35" → 向下取整为 "20:30"
  
- **planned vs actual**:
  - 只有actual: 纯过去的事，只填 actual_task 和 actual_notes
  - 只有planned: 纯未来计划，只填 planned_task 和 planned_notes
  - 两者并存: 本来计划A实际做了B时，同时填写 planned_ 和 actual_

## 重要规则

1. **只输出纯 JSON**，不要思考过程，不要解释，不要 markdown 标记
2. **任务名**：必须从任务列表中精确复制，一个字都不能错！

3. **时间格式**：
   - ✅ **必须是整半小时**：只能是 XX:00 或 XX:30
   - ✅ **判断早晚**：如果说"7点"，根据活动判断是早上7点还是晚上7点，可能跟当前时间有关

4. **次要活动**：上厕所、买东西等时间短的活动，放在 actual_notes 里即可
5. **一个时间段一个主要任务**，其他次要活动都放备注

## 示例

输入1: 五点到六点写代码，期间上了个厕所
思考: "五点"没说早晚，但跟当前时间19:00相近，判断为 17:00
输出: {"2025-10-19": [{"time_slot": "17:00-18:00", "actual_task": "数据结构与算法", "actual_notes": "写代码，期间上厕所"}]}

输入2: 明天上午九点到十二点开会
思考: 明确说"上午"，所以是 09:00
输出: {"2025-10-20": [{"time_slot": "09:00-12:00", "planned_task": "AI评价工作", "planned_notes": "上午团队会议"}]}

输入3: 本来计划写代码，实际在开会
输出: {"2025-10-19": [{"time_slot": "09:00-17:00", "planned_task": "数据结构与算法", "actual_task": "AI评价工作", "actual_notes": "会议临时增加"}]}

输入4: 七点半开始工作到现在（当前时间 20:24）
思考: 
  - "七点半"工作，通常是晚上，判断为 19:30，工作到20:30（取整）
输出: {"2025-10-19": [{"time_slot": "19:30-20:00", "actual_task": "看源码学习tools"}]}

现在请解析：`;
    return {
        systemPrompt,
        availableTaskNames: Array.from(allTaskNames),
    };
}
/**
 * 构建验证失败后的重试提示词
 */
function buildRetryPrompt(errors) {
    const invalidTasks = errors.map(e => `"${e.task}" (${e.field})`).join(', ');
    return `上次输出的任务名验证失败！

**错误的任务名：** ${invalidTasks}

**原因：** 这些任务名不在系统的任务列表中。

**解决方案：**
1. 重新查看上面的任务列表
2. 从列表中【精确复制】任务名，一个字都不能错
3. 如果找不到完全匹配的，选择最相关的任务

请重新生成 JSON，确保所有任务名都从列表中精确复制！`;
}
