"use strict";
/**
 * 子任务验证器
 * 验证AI填写的子任务名称是否真的属于对应项目的子任务列表
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSubtasks = validateSubtasks;
/**
 * 检查子任务是否存在于项目中（使用与converter相同的匹配算法）
 * @param projectName 项目名称
 * @param subtaskName 子任务名称
 * @param userProjects 用户的所有项目列表
 * @returns 是否有效
 */
function isSubtaskValid(projectName, subtaskName, userProjects) {
    const projectNameLower = projectName.toLowerCase().trim();
    const subtaskNameLower = subtaskName.toLowerCase().trim();
    // 1. 精确匹配项目名
    let matchedProject = userProjects.find(p => p.name.toLowerCase() === projectNameLower);
    // 2. 如果精确匹配失败，尝试模糊匹配项目名
    if (!matchedProject) {
        matchedProject = userProjects.find(p => p.name.toLowerCase().includes(projectNameLower) ||
            projectNameLower.includes(p.name.toLowerCase()));
    }
    // 3. 如果项目匹配到了，检查子任务
    if (matchedProject && matchedProject.subtasks) {
        // 精确匹配子任务（不区分大小写）
        const exactMatch = matchedProject.subtasks.some(s => s.name.toLowerCase() === subtaskNameLower);
        if (exactMatch)
            return true;
        // 模糊匹配子任务（包含关系，不区分大小写）
        const fuzzyMatch = matchedProject.subtasks.some(s => s.name.toLowerCase().includes(subtaskNameLower) ||
            subtaskNameLower.includes(s.name.toLowerCase()));
        if (fuzzyMatch)
            return true;
    }
    return false;
}
/**
 * 查找匹配的项目（用于错误信息展示）
 */
function findMatchedProject(projectName, userProjects) {
    const projectNameLower = projectName.toLowerCase().trim();
    // 精确匹配
    let project = userProjects.find(p => p.name.toLowerCase() === projectNameLower);
    if (project)
        return project;
    // 模糊匹配
    project = userProjects.find(p => p.name.toLowerCase().includes(projectNameLower) ||
        projectNameLower.includes(p.name.toLowerCase()));
    return project;
}
/**
 * 验证子任务名称
 * @param args 创建时间表的输入参数
 * @param userProjects 用户的所有项目列表
 * @returns 验证结果
 */
function validateSubtasks(args, userProjects) {
    const invalidSubtasks = [];
    Object.entries(args.schedule).forEach(([date, slots]) => {
        slots.forEach((slot, index) => {
            // 验证计划任务的子任务
            if (slot.planned_task && slot.planned_subtask) {
                const isValid = isSubtaskValid(slot.planned_task, slot.planned_subtask, userProjects);
                if (!isValid) {
                    const project = findMatchedProject(slot.planned_task, userProjects);
                    const availableSubtasks = project?.subtasks?.map(s => s.name).join('、') || '（未找到项目或项目无子任务）';
                    invalidSubtasks.push(`日期 ${date} 时间段${index + 1}: 项目"${slot.planned_task}"下不存在子任务"${slot.planned_subtask}"。\n` +
                        `  可用子任务: ${availableSubtasks}`);
                }
            }
            // 验证实际任务的子任务
            if (slot.actual_task && slot.actual_subtask) {
                const isValid = isSubtaskValid(slot.actual_task, slot.actual_subtask, userProjects);
                if (!isValid) {
                    const project = findMatchedProject(slot.actual_task, userProjects);
                    const availableSubtasks = project?.subtasks?.map(s => s.name).join('、') || '（未找到项目或项目无子任务）';
                    invalidSubtasks.push(`日期 ${date} 时间段${index + 1}: 项目"${slot.actual_task}"下不存在子任务"${slot.actual_subtask}"。\n` +
                        `  可用子任务: ${availableSubtasks}`);
                }
            }
        });
    });
    if (invalidSubtasks.length > 0) {
        console.error(`[subtask-validator] ❌ 子任务名称验证失败，以下子任务不属于对应项目:`);
        invalidSubtasks.forEach(msg => console.error(`  - ${msg}`));
        // 构建完整的项目和子任务列表
        const projectDetails = userProjects
            .map(p => {
            const subtaskList = (p.subtasks?.length ?? 0) > 0
                ? p.subtasks?.map(s => `  · ${s.name}`).join('\n')
                : '  （无子任务）';
            return `- ${p.name}\n${subtaskList}`;
        })
            .join('\n\n');
        return {
            valid: false,
            error: `子任务名称错误！以下子任务不存在于对应项目的子任务列表中：

${invalidSubtasks.map(msg => `❌ ${msg}`).join('\n\n')}

所有可用的项目和子任务列表：
${projectDetails}

请使用上述项目下的子任务名称重新填写时间表。
注意：子任务名称必须完全匹配，不区分大小写。`,
        };
    }
    console.log(`[subtask-validator] ✅ 子任务名称验证通过`);
    return { valid: true };
}
