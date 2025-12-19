"use strict";
/**
 * 主后端 API 格式 ↔ MCP 格式转换器
 *
 * 将主后端的项目列表格式转换为 MCP 工具返回格式
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainAPIToMCP = mainAPIToMCP;
exports.printConversionSummary = printConversionSummary;
exports.validateMainAPIResponse = validateMainAPIResponse;
// ============ 转换函数 ============
/**
 * 将完成状态转换为任务状态字符串
 */
function convertStatus(isCompleted) {
    return isCompleted ? '已完成' : '进行中';
}
/**
 * 计算分类统计
 */
function calculateCategoryStats(projects) {
    const stats = {};
    for (const project of projects) {
        const category = project.category;
        if (!stats[category]) {
            stats[category] = {
                projectCount: 0,
                subtaskCount: 0,
            };
        }
        stats[category].projectCount++;
        stats[category].subtaskCount += project.subtasks.length;
    }
    return stats;
}
/**
 * 计算项目汇总信息
 */
function calculateSummary(projects) {
    const totalSubtasks = projects.reduce((sum, p) => sum + p.subtasks.length, 0);
    const categories = new Set(projects.map(p => p.category));
    return {
        totalProjects: projects.length,
        totalSubtasks,
        categoriesCount: categories.size,
    };
}
/**
 * 主后端 API 格式 → MCP 格式
 *
 * @param apiResponse 主后端 API 响应
 * @returns MCP 格式的项目数据
 */
function mainAPIToMCP(apiResponse) {
    console.log('[格式转换] 主后端 API → MCP 格式');
    console.log(`[格式转换] 输入: ${apiResponse.tasks?.length || 0} 个项目`);
    // 转换项目列表
    const mcpProjects = [];
    for (const apiProject of apiResponse.tasks || []) {
        // 转换子任务
        const mcpSubtasks = apiProject.subtasks.map(apiSubtask => ({
            id: apiSubtask.id,
            name: apiSubtask.name,
            status: convertStatus(apiSubtask.is_completed),
            project_id: apiProject.id,
        }));
        // 转换项目
        const mcpProject = {
            id: apiProject.id,
            name: apiProject.name,
            category: apiProject.category,
            subtasks: mcpSubtasks,
        };
        mcpProjects.push(mcpProject);
    }
    // 计算统计信息
    const categories = calculateCategoryStats(mcpProjects);
    const summary = calculateSummary(mcpProjects);
    console.log(`[格式转换] 输出: ${mcpProjects.length} 个项目, ${summary.totalSubtasks} 个子任务`);
    console.log(`[格式转换] 分类: ${Object.keys(categories).join(', ')}`);
    return {
        projects: mcpProjects,
        categories,
        summary,
    };
}
/**
 * 打印转换结果摘要
 */
function printConversionSummary(data) {
    console.log('\n========== 项目列表摘要 ==========');
    console.log(`📊 总计: ${data.summary?.totalProjects || 0} 个项目, ${data.summary?.totalSubtasks || 0} 个子任务`);
    if (data.categories) {
        console.log('\n📂 分类统计:');
        for (const [category, stats] of Object.entries(data.categories)) {
            console.log(`   ${category}: ${stats.projectCount} 个项目, ${stats.subtaskCount} 个子任务`);
        }
    }
    console.log('\n📋 项目列表:');
    for (const project of data.projects) {
        console.log(`   [${project.category}] ${project.name} (${project.subtasks.length} 个子任务)`);
        for (const subtask of project.subtasks) {
            console.log(`      ├─ ${subtask.name} [${subtask.status}]`);
        }
    }
    console.log('=================================\n');
}
/**
 * 验证主后端 API 响应格式
 */
function validateMainAPIResponse(response) {
    const errors = [];
    if (!response) {
        errors.push('响应为空');
        return { valid: false, errors };
    }
    if (!Array.isArray(response.tasks)) {
        errors.push('tasks 字段必须是数组');
    }
    if (typeof response.total !== 'number') {
        errors.push('total 字段必须是数字');
    }
    // 验证每个项目的格式
    if (Array.isArray(response.tasks)) {
        for (let i = 0; i < response.tasks.length; i++) {
            const project = response.tasks[i];
            if (typeof project.id !== 'number') {
                errors.push(`项目 #${i + 1}: id 必须是数字`);
            }
            if (typeof project.name !== 'string') {
                errors.push(`项目 #${i + 1}: name 必须是字符串`);
            }
            if (typeof project.category !== 'string') {
                errors.push(`项目 #${i + 1}: category 必须是字符串`);
            }
            if (!Array.isArray(project.subtasks)) {
                errors.push(`项目 #${i + 1}: subtasks 必须是数组`);
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
