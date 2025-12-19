"use strict";
/**
 * 子任务处理器 - 处理未匹配的子任务，尝试自动创建
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMissingSubtasks = createMissingSubtasks;
exports.generateUserPrompt = generateUserPrompt;
/**
 * 从任务名称推断项目名称
 * 例如: "工作-写代码" -> "工作"
 *       "学习Python" -> "学习"
 */
function inferProjectName(taskName) {
    // 检查是否有项目分隔符（-、:、/等）
    const separators = ['-', ':', '/', '｜', '|'];
    for (const sep of separators) {
        if (taskName.includes(sep)) {
            const parts = taskName.split(sep);
            return parts[0].trim();
        }
    }
    // 如果没有分隔符，尝试提取前几个字作为项目名
    // 例如: "写代码" -> "工作", "学习Python" -> "学习"
    const commonProjectKeywords = [
        '工作', '学习', '生活', '运动', '娱乐', '社交',
        '开发', '设计', '会议', '阅读', '写作', '健身'
    ];
    for (const keyword of commonProjectKeywords) {
        if (taskName.includes(keyword)) {
            return keyword;
        }
    }
    // 默认返回"未分类"
    return '未分类';
}
/**
 * 创建单个子任务（使用主后端 API）
 */
async function createSingleSubtask(taskName, mainAPIClient) {
    try {
        console.log(`   [创建子任务] 正在创建: ${taskName}`);
        // 推断项目名称
        const projectName = inferProjectName(taskName);
        console.log(`   [创建子任务] 推断项目: ${projectName}`);
        // 1. 先尝试查找匹配的项目
        const projects = await mainAPIClient.getProjects();
        let matchedProject = projects.tasks.find(p => p.name.toLowerCase() === projectName.toLowerCase());
        // 2. 如果项目不存在，先创建项目
        if (!matchedProject) {
            console.log(`   [创建子任务] 项目不存在，先创建项目: ${projectName}`);
            matchedProject = await mainAPIClient.createProject(projectName, '学习');
        }
        // 3. 在该项目下创建子任务
        const subtask = await mainAPIClient.createSubtask(matchedProject.id, taskName);
        console.log(`   ✅ 创建成功: ${taskName} (ID: ${subtask.id})`);
        return {
            ok: true,
            taskName,
            subtaskId: subtask.id,
            projectName: matchedProject.name,
        };
    }
    catch (error) {
        console.error(`   ❌ 创建失败: ${taskName}`, error);
        return {
            ok: false,
            taskName,
            error: error.message || String(error),
        };
    }
}
/**
 * 去重任务列表（按任务名称）
 */
function deduplicateTasks(tasks) {
    const seen = new Set();
    const unique = [];
    for (const task of tasks) {
        const key = task.task_name.toLowerCase().trim();
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(task);
        }
    }
    return unique;
}
/**
 * 批量创建未匹配的子任务
 */
async function createMissingSubtasks(unmatchedTasks, mainAPIClient) {
    console.log('\n========== 🔧 智能子任务创建 ==========');
    console.log(`发现 ${unmatchedTasks.length} 个未匹配的任务`);
    // 去重
    const uniqueTasks = deduplicateTasks(unmatchedTasks);
    console.log(`去重后：${uniqueTasks.length} 个唯一任务\n`);
    if (uniqueTasks.length === 0) {
        return {
            success: [],
            failed: [],
            totalCount: 0,
            successCount: 0,
            failedCount: 0,
        };
    }
    // 批量创建
    const results = [];
    for (const task of uniqueTasks) {
        const result = await createSingleSubtask(task.task_name, mainAPIClient);
        results.push(result);
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    // 统计结果
    const success = results.filter(r => r.ok);
    const failed = results.filter(r => !r.ok);
    console.log('\n========== 创建结果摘要 ==========');
    console.log(`✅ 成功: ${success.length}/${uniqueTasks.length}`);
    console.log(`❌ 失败: ${failed.length}/${uniqueTasks.length}`);
    if (success.length > 0) {
        console.log('\n成功创建的子任务:');
        for (const s of success) {
            console.log(`   ✓ ${s.taskName} (ID: ${s.subtaskId}, 项目: ${s.projectName})`);
        }
    }
    if (failed.length > 0) {
        console.log('\n创建失败的子任务:');
        for (const f of failed) {
            console.log(`   ✗ ${f.taskName}: ${f.error}`);
        }
    }
    console.log('=====================================\n');
    return {
        success,
        failed,
        totalCount: uniqueTasks.length,
        successCount: success.length,
        failedCount: failed.length,
    };
}
/**
 * 生成友好的提示消息给用户
 */
function generateUserPrompt(result) {
    if (result.successCount === 0) {
        return `❌ 所有子任务创建失败，无法继续创建日程。请检查任务名称或手动创建子任务。`;
    }
    if (result.failedCount === 0) {
        return `✅ 已自动创建 ${result.successCount} 个新的子任务！\n\n是否需要重新尝试创建日程？（之前因缺少子任务而失败的日程将被创建）`;
    }
    return `⚠️ 已创建 ${result.successCount} 个子任务，${result.failedCount} 个失败。\n\n成功创建的子任务:\n${result.success.map(s => `  • ${s.taskName}`).join('\n')}\n\n是否需要重新尝试创建日程？（只会创建成功的子任务对应的日程）`;
}
