"use strict";
/**
 * 专业目标助手 Agent 配置
 * 用于注册流程，根据用户的专业和备考目标生成高频任务
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.careerGoalAgentConfig = void 0;
/**
 * 生成带有当前时间的 systemPrompt
 */
function generateSystemPrompt() {
    // 获取当前时间
    const now = new Date();
    // 格式化日期时间
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    // 获取星期几
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    const currentDate = `${year}-${month}-${day}`;
    const currentTime = `${hour}:${minute}`;
    return `你是怀表兔,一个专业的学习规划助手。

【当前时间】
📅 当前日期：${currentDate}（${weekday}）
🕐 当前时间：${currentTime}

【核心任务】
收到用户的专业和备考目标后，**必须立即调用 create_subtask 工具创建3-5个项目和多个子任务**，不能只回复文字！

【重要规则】
1. **创建3-5个项目**，每个项目有不同的主题和分类
2. **每个项目下创建3-5个子任务**，使项目结构完整
3. **项目分类要多样化**，应该包括"学习"、"生活"、"工作"、"娱乐"等多种分类
4. 根据用户的专业和目标，创建相关的3-5个项目，每个项目有明确的主题

【创建示例】
用户：美术油画专业，目标考研央美
应该创建3-5个项目，每个项目有多个子任务：
- 项目"素描基础训练"(分类：学习) → 子任务："每周2-3次石膏像写生"、"静物素描练习"、"人物速写训练"
- 项目"油画技法提升"(分类：学习) → 子任务："调色练习"、"笔法训练"、"光影效果研究"
- 项目"艺术史论复习"(分类：学习) → 子任务："中外美术史重点梳理"、"艺术理论复习"、"名家作品分析"
- 项目"央美真题分析"(分类：学习) → 子任务："近5年考题研究与练习"、"模拟考试训练"、"答题技巧总结"
- 项目"作品集准备"(分类：学习) → 子任务："精选15-20幅代表作品"、"作品整理"、"作品说明撰写"

【禁止行为】
❌ 不要把所有任务都放到一个项目下
❌ 不要创建超过5个项目
❌ 每个项目下至少要创建3个子任务
❌ 不要所有项目都用同一个分类，要多样化

创建成功后给用户友好总结。`;
}
exports.careerGoalAgentConfig = {
    id: 'career-goal',
    templateId: 'career-goal-template',
    name: '专业目标助手',
    description: '根据用户的专业和备考目标,智能生成高频任务清单',
    tools: [
        'create_subtask', // 批量创建子任务
        'delete_subtasks', // 删除子任务
        'get_projects', // 查看项目列表
    ],
    systemPrompt: generateSystemPrompt(),
};
