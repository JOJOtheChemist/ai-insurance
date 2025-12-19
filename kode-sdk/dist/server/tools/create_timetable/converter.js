"use strict";
/**
 * AI时间表格式转换器
 *
 * 功能：将AI返回的forAI.json格式（纯文字任务名）转换为API需要的fromAPI.json格式（带ID）
 *
 * 流程：
 * 1. AI接收：当前时间 + 用户所有项目/子任务列表
 * 2. AI返回：forAI.json格式（纯文字任务名，支持时间段）
 * 3. 转换函数：将任务名匹配到ID，时间段拆分成time_block
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertAIToAPI = convertAIToAPI;
exports.generateAIPrompt = generateAIPrompt;
// ==================== 工具函数 ====================
/**
 * 将时间向下取整到最近的半小时
 * @param time 时间字符串，格式："09:00" 或 "09:24"
 * @returns 规范化后的时间字符串（XX:00 或 XX:30）
 */
function roundDownToHalfHour(time) {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    const totalMinutes = hour * 60 + minute;
    // 向下取整到最近的30分钟
    const roundedMinutes = Math.floor(totalMinutes / 30) * 30;
    const roundedHour = Math.floor(roundedMinutes / 60);
    const roundedMin = roundedMinutes % 60;
    return `${String(roundedHour).padStart(2, '0')}:${String(roundedMin).padStart(2, '0')}`;
}
/**
 * 规范化时间（确保是整半小时）
 * @param time 时间字符串
 * @returns 规范化后的时间字符串（XX:00 或 XX:30）
 */
function normalizeTime(time) {
    const [hour, minutes] = time.split(':').map(Number);
    // 如果已经是整半小时，直接返回
    if (minutes === 0 || minutes === 30) {
        return time;
    }
    // 不是整半小时，向下取整
    return roundDownToHalfHour(time);
}
/**
 * 规范化时间槽（确保所有时间都是整半小时）
 * @param timeSlot 时间槽字符串，格式："09:00" 或 "09:00-17:00"
 * @returns 规范化后的时间槽字符串
 */
function normalizeTimeSlot(timeSlot) {
    if (timeSlot.includes('-')) {
        // 时间段格式 "09:00-17:00"
        const [start, end] = timeSlot.split('-').map(t => t.trim());
        const normalizedStart = normalizeTime(start);
        const normalizedEnd = normalizeTime(end);
        return `${normalizedStart}-${normalizedEnd}`;
    }
    else {
        // 单点格式 "09:00"
        return normalizeTime(timeSlot.trim());
    }
}
/**
 * 将时间字符串转换为time_block编号
 * @param timeStr 时间字符串，格式："09:00" 或 "9:00"
 * @returns time_block编号 (0-47)
 */
function timeToBlock(timeStr) {
    const [hourStr, minuteStr] = timeStr.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    // 每个block是30分钟，计算公式：hour * 2 + (minute >= 30 ? 1 : 0)
    return hour * 2 + (minute >= 30 ? 1 : 0);
}
/**
 * 解析时间段，返回起始和结束block
 * @param timeSlot 时间段字符串："09:00-17:00" 或 "09:00"
 * @returns [startBlock, endBlock] (endBlock 是最后一个**要包含的** block)
 */
function parseTimeSlot(timeSlot) {
    if (timeSlot.includes('-')) {
        // 时间段格式 "09:00-17:00"
        const [start, end] = timeSlot.split('-');
        const startBlock = timeToBlock(start.trim());
        const endBlock = timeToBlock(end.trim());
        // 🔥 修复：结束时间需要减1，因为 "00:00-01:00" 表示 [00:00, 01:00)，不包含 01:00
        // 例如："00:00-01:00" → startBlock=0, endBlock=2 → 应该是 [0, 1]
        // 但如果结束时间已经是某个block的开始，则减1
        const actualEndBlock = endBlock > startBlock ? endBlock - 1 : endBlock;
        return [startBlock, actualEndBlock];
    }
    else {
        // 单点格式 "09:00"
        const block = timeToBlock(timeSlot.trim());
        return [block, block];
    }
}
/**
 * 匹配任务名到项目/子任务ID
 * @param taskName 任务名（纯文字）
 * @param userProjects 用户的所有项目列表
 * @returns 匹配结果
 */
function matchTaskToId(taskName, userProjects) {
    if (!taskName) {
        return { matched_type: 'none' };
    }
    const taskNameLower = taskName.toLowerCase().trim();
    // 1. 精确匹配子任务名
    for (const project of userProjects) {
        if (project.subtasks) {
            for (const subtask of project.subtasks) {
                if (subtask.name.toLowerCase() === taskNameLower) {
                    return {
                        project_id: project.id,
                        subtask_id: subtask.id,
                        matched_type: 'exact'
                    };
                }
            }
        }
    }
    // 2. 精确匹配项目名
    for (const project of userProjects) {
        if (project.name.toLowerCase() === taskNameLower) {
            return {
                project_id: project.id,
                matched_type: 'exact'
            };
        }
    }
    // 3. 模糊匹配子任务名（包含关系）
    for (const project of userProjects) {
        if (project.subtasks) {
            for (const subtask of project.subtasks) {
                if (subtask.name.toLowerCase().includes(taskNameLower) ||
                    taskNameLower.includes(subtask.name.toLowerCase())) {
                    return {
                        project_id: project.id,
                        subtask_id: subtask.id,
                        matched_type: 'fuzzy'
                    };
                }
            }
        }
    }
    // 4. 模糊匹配项目名（包含关系）
    for (const project of userProjects) {
        if (project.name.toLowerCase().includes(taskNameLower) ||
            taskNameLower.includes(project.name.toLowerCase())) {
            return {
                project_id: project.id,
                matched_type: 'fuzzy'
            };
        }
    }
    // 5. 未匹配到任何任务
    return { matched_type: 'none' };
}
/**
 * 匹配项目和子任务名到ID（同时提供项目名和子任务名时使用）
 * @param projectName 项目名
 * @param subtaskName 子任务名
 * @param userProjects 用户的所有项目列表
 * @returns 匹配结果
 */
function matchProjectAndSubtask(projectName, subtaskName, userProjects) {
    // 如果两者都没有，返回空
    if (!projectName && !subtaskName) {
        return { matched_type: 'none' };
    }
    // 如果只有项目名，使用原来的匹配逻辑
    if (projectName && !subtaskName) {
        return matchTaskToId(projectName, userProjects);
    }
    // 如果只有子任务名，使用原来的匹配逻辑
    if (!projectName && subtaskName) {
        return matchTaskToId(subtaskName, userProjects);
    }
    // 如果两者都有，先匹配项目，再在该项目下匹配子任务
    const projectNameLower = projectName.toLowerCase().trim();
    const subtaskNameLower = subtaskName.toLowerCase().trim();
    // 1. 精确匹配项目名
    for (const project of userProjects) {
        if (project.name.toLowerCase() === projectNameLower) {
            // 找到项目后，在该项目下匹配子任务
            if (project.subtasks) {
                // 精确匹配子任务
                for (const subtask of project.subtasks) {
                    if (subtask.name.toLowerCase() === subtaskNameLower) {
                        return {
                            project_id: project.id,
                            subtask_id: subtask.id,
                            matched_type: 'exact'
                        };
                    }
                }
                // 模糊匹配子任务
                for (const subtask of project.subtasks) {
                    if (subtask.name.toLowerCase().includes(subtaskNameLower) ||
                        subtaskNameLower.includes(subtask.name.toLowerCase())) {
                        return {
                            project_id: project.id,
                            subtask_id: subtask.id,
                            matched_type: 'fuzzy'
                        };
                    }
                }
            }
            // 项目匹配到了，但子任务没匹配到，只返回项目ID
            return {
                project_id: project.id,
                matched_type: 'exact'
            };
        }
    }
    // 2. 模糊匹配项目名
    for (const project of userProjects) {
        if (project.name.toLowerCase().includes(projectNameLower) ||
            projectNameLower.includes(project.name.toLowerCase())) {
            // 找到项目后，在该项目下匹配子任务
            if (project.subtasks) {
                for (const subtask of project.subtasks) {
                    if (subtask.name.toLowerCase().includes(subtaskNameLower) ||
                        subtaskNameLower.includes(subtask.name.toLowerCase())) {
                        return {
                            project_id: project.id,
                            subtask_id: subtask.id,
                            matched_type: 'fuzzy'
                        };
                    }
                }
            }
            // 项目匹配到了，但子任务没匹配到，只返回项目ID
            return {
                project_id: project.id,
                matched_type: 'fuzzy'
            };
        }
    }
    // 都没匹配到
    return { matched_type: 'none' };
}
/**
 * 验证mood值是否有效并转换
 * @param mood 心情值（支持中文或英文）
 * @returns 有效的英文mood值或undefined
 */
function validateMood(mood) {
    if (!mood)
        return undefined;
    const validMoods = [
        'happy', 'sad', 'angry', 'anxious', 'calm',
        'tired', 'excited', 'focused', 'stressed', 'neutral', 'relaxed'
    ];
    const moodLower = mood.toLowerCase().trim();
    // 精确匹配英文
    if (validMoods.includes(moodLower)) {
        return moodLower;
    }
    // 中文到英文映射
    const chineseToEnglish = {
        '愉快': 'happy', '开心': 'happy', '高兴': 'happy',
        '悲伤': 'sad', '难过': 'sad',
        '生气': 'angry', '愤怒': 'angry',
        '焦虑': 'anxious', '紧张': 'anxious',
        '平静': 'calm', '冷静': 'calm',
        '疲惫': 'tired', '累': 'tired',
        '兴奋': 'excited',
        '专注': 'focused', '集中': 'focused',
        '压力': 'stressed', '有压力': 'stressed',
        '中性': 'neutral', '一般': 'neutral',
        '放松': 'relaxed', '轻松': 'relaxed'
    };
    return chineseToEnglish[mood] || undefined;
}
// ==================== 主转换函数 ====================
/**
 * 将AI返回的格式转换为API需要的格式
 *
 * forAI.json格式（AI返回）：
 * {
 *   "2025-11-01": [
 *     {
 *       "time_slot": "09:00-17:00",
 *       "actual_task": "学习数据结构",
 *       "actual_notes": "看源码学习tools",
 *       "mood": "专注"
 *     }
 *   ]
 * }
 *
 * fromAPI.json格式（API需要）：
 * {
 *   "time_slots": [
 *     {
 *       "date": "2025-11-01",
 *       "time_block": 18,
 *       "actual_project_id": 52,
 *       "actual_subtask_id": 118,
 *       "actual_note": "看源码学习tools",
 *       "mood": "focused"
 *     }
 *   ]
 * }
 *
 * @param aiResponse AI返回的时间表（forAI.json格式）
 * @param userProjects 用户的所有项目列表（从API获取）
 * @returns API批量创建请求格式（fromAPI.json格式）
 */
function convertAIToAPI(aiResponse, userProjects) {
    const apiTimeSlots = [];
    console.log('[converter] 开始转换AI格式到API格式');
    console.log('[converter] 用户项目数量:', userProjects.length);
    // 遍历每一天
    for (const [dateStr, aiSlots] of Object.entries(aiResponse)) {
        // 跳过以下划线或等号开头的字段（说明字段）
        if (dateStr.startsWith('_') || dateStr.startsWith('===')) {
            continue;
        }
        // 验证日期格式
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            console.warn(`[converter] 跳过无效日期格式: ${dateStr}`);
            continue;
        }
        console.log(`[converter] 处理日期 ${dateStr}，包含 ${aiSlots.length} 个时间槽`);
        // 遍历该日期的所有时间槽
        for (const aiSlot of aiSlots) {
            // 规范化时间槽（确保是整半小时）
            const normalizedTimeSlot = normalizeTimeSlot(aiSlot.time_slot);
            if (normalizedTimeSlot !== aiSlot.time_slot) {
                console.warn(`[converter] 时间槽 "${aiSlot.time_slot}" 被规范化为 "${normalizedTimeSlot}"（必须为整半小时）`);
            }
            // 解析时间段
            const [startBlock, endBlock] = parseTimeSlot(normalizedTimeSlot);
            console.log(`[converter] 时间段 "${normalizedTimeSlot}" 转换为 block ${startBlock}-${endBlock}`);
            // 匹配任务到ID（使用新的匹配函数，支持同时匹配项目和子任务）
            const plannedMatch = matchProjectAndSubtask(aiSlot.planned_task, aiSlot.planned_subtask, userProjects);
            const actualMatch = matchProjectAndSubtask(aiSlot.actual_task, aiSlot.actual_subtask, userProjects);
            if (aiSlot.planned_task || aiSlot.planned_subtask) {
                console.log(`[converter] 计划任务 "${aiSlot.planned_task}" + 子任务 "${aiSlot.planned_subtask}" 匹配结果:`, plannedMatch);
            }
            if (aiSlot.actual_task || aiSlot.actual_subtask) {
                console.log(`[converter] 实际任务 "${aiSlot.actual_task}" + 子任务 "${aiSlot.actual_subtask}" 匹配结果:`, actualMatch);
            }
            // 验证mood
            const validMood = validateMood(aiSlot.mood);
            if (aiSlot.mood && validMood) {
                console.log(`[converter] mood "${aiSlot.mood}" 转换为 "${validMood}"`);
            }
            // 生成该时间段内所有的time_block
            for (let block = startBlock; block <= endBlock; block++) {
                const apiSlot = {
                    date: dateStr,
                    time_block: block
                };
                // 添加计划任务信息
                if (plannedMatch.project_id) {
                    apiSlot.planned_project_id = plannedMatch.project_id;
                    if (plannedMatch.subtask_id) {
                        apiSlot.planned_subtask_id = plannedMatch.subtask_id;
                    }
                    apiSlot.planned_note = aiSlot.planned_notes || aiSlot.planned_task;
                }
                else if (aiSlot.planned_task) {
                    // 未匹配到ID，但有任务名，记录在note中
                    apiSlot.planned_note = aiSlot.planned_task + (aiSlot.planned_notes ? `: ${aiSlot.planned_notes}` : '');
                }
                // 添加实际任务信息
                if (actualMatch.project_id) {
                    apiSlot.actual_project_id = actualMatch.project_id;
                    if (actualMatch.subtask_id) {
                        apiSlot.actual_subtask_id = actualMatch.subtask_id;
                    }
                    apiSlot.actual_note = aiSlot.actual_notes || aiSlot.actual_task;
                }
                else if (aiSlot.actual_task) {
                    // 未匹配到ID，但有任务名，记录在note中
                    apiSlot.actual_note = aiSlot.actual_task + (aiSlot.actual_notes ? `: ${aiSlot.actual_notes}` : '');
                }
                // 添加心情
                if (validMood) {
                    apiSlot.mood = validMood;
                }
                apiTimeSlots.push(apiSlot);
            }
        }
    }
    console.log(`[converter] 转换完成，生成 ${apiTimeSlots.length} 个API时间槽`);
    return {
        time_slots: apiTimeSlots
    };
}
// ==================== 辅助函数：生成AI Prompt ====================
/**
 * 生成发送给AI的完整Prompt
 * @param userInput 用户输入的原始文本
 * @param currentTime 当前时间
 * @param userProjects 用户的所有项目列表
 * @returns 完整的Prompt
 */
function generateAIPrompt(userInput, currentTime, userProjects) {
    // 格式化当前时间
    const dateStr = currentTime.toISOString().split('T')[0];
    const timeStr = currentTime.toTimeString().split(' ')[0].substring(0, 5);
    // 格式化项目列表
    const projectList = userProjects.map(project => {
        if (project.subtasks && project.subtasks.length > 0) {
            const subtaskNames = project.subtasks.map(s => `  - ${s.name}`).join('\n');
            return `- ${project.name}\n${subtaskNames}`;
        }
        return `- ${project.name}`;
    }).join('\n');
    return `【当前时间】
${dateStr} ${timeStr}

【用户的所有项目和任务】
${projectList}

【用户输入】
${userInput}

【要求】
请根据用户输入，生成时间表安排。返回格式为JSON，严格按照以下格式：

{
  "2025-10-19": [
    {
      "time_slot": "09:00-17:00",
      "actual_task": "写代码",
      "actual_notes": "全天写代码"
    }
  ]
}

格式说明：
1. time_slot支持两种格式：
   - 单点："09:00" 表示单个时间点
   - 时间段："09:00-17:00" 表示连续时间段
   - ⚠️ **重要**：时间必须是整半小时！只能是 XX:00 或 XX:30
   - ❌ 错误：4:20, 6:15, 9:45（不能使用非整半小时）
   - ✅ 正确：4:00, 4:30, 6:00, 6:30
   - 如果输入非整半小时时间（如 4:20），系统会自动向下取整为 4:00，但建议直接使用整半小时
   
2. 任务字段（使用用户已有的项目/任务名称）：
   - planned_task: 计划做的任务
   - planned_notes: 计划任务的详细说明
   - actual_task: 实际做的任务
   - actual_notes: 实际任务的详细说明
   - mood: 心情（可选）
   
3. planned和actual的使用：
   - 只有actual: 纯过去的事，只填actual_task和actual_notes
   - 只有planned: 纯未来计划，只填planned_task和planned_notes
   - 两者并存: 本来计划A实际做了B时，同时填写
   
4. 尽量匹配用户已有的项目/任务名称，如果没有匹配的，可以使用用户输入的原文

请直接返回JSON，不要包含任何其他说明文字。`;
}
