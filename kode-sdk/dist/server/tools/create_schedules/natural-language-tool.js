"use strict";
/**
 * 自然语言日程记录工具
 *
 * 用户输入自然语言 → AI解析为exam.json格式 → 转换为MCP格式 → 调用API
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolMetadata = exports.naturalLanguageScheduleTool = exports.TOOL_INPUT_SCHEMA = exports.TOOL_PROMPT = exports.TOOL_DESCRIPTION = exports.TOOL_NAME = void 0;
exports.executeNaturalLanguageSchedule = executeNaturalLanguageSchedule;
exports.processAIParsedSchedule = processAIParsedSchedule;
const src_1 = require("../../../src");
/**
 * 工具名称
 */
exports.TOOL_NAME = 'record_schedule_naturally';
/**
 * 工具描述
 */
exports.TOOL_DESCRIPTION = `
使用自然语言记录日程。

用户可以用口语化的方式描述自己做了什么、计划做什么，系统自动解析并创建日程。

示例：
- "我三点睡到早上八点就起来了，因为奶奶把我叫醒了"
- "今天上午九点到十二点都在开会，下午写代码到五点"
- "明天下午两点有个会议，大概一小时"
`.trim();
/**
 * 工具提示词 - 教AI如何解析自然语言
 */
exports.TOOL_PROMPT = `
# 自然语言日程记录工具

## 你的任务

将用户的**自然语言描述**解析为**结构化的日程JSON**。

## 输出格式要求

你必须输出以下JSON格式（exam.json格式）：

\`\`\`json
{
  "YYYY-MM-DD": [
    {
      "time_slot": "HH:MM" 或 "HH:MM-HH:MM",
      "actual_task": "任务名",
      "actual_notes": "详细备注",
      "planned_task": "计划任务名（可选）",
      "planned_notes": "计划备注（可选）",
      "mood": "心情（可选）"
    }
  ]
}
\`\`\`

## 解析规则

### 1. 日期识别

- **"今天"/"今天上午"** → 当前日期
- **"明天"/"明天下午"** → 当前日期+1
- **"昨天"** → 当前日期-1
- **"本周五"** → 计算到本周五的日期
- **"10月19日"** → 2025-10-19
- **"19号"** → 2025-10-19（使用当前月份）
- **没提日期** → 使用当前日期

当前参考时间：{{current_time}}（你需要根据这个计算日期）

### 2. 时间识别

支持多种口语化表达：

**单点时间**：
- "三点" → "03:00"
- "下午两点" → "14:00"  
- "晚上八点半" → "20:30"
- "上午九点十分" → "09:10"

**时间段**：
- "三点到八点" → "03:00-08:00"
- "上午九点到十二点" → "09:00-12:00"
- "从两点半工作到五点" → "14:30-17:00"
- "整个上午" → "09:00-12:00"
- "整个下午" → "14:00-18:00"
- "一整天" → "09:00-18:00"

**跨天处理**：
如果时间跨天（如晚上10点睡到早上6点），拆分为两天：
\`\`\`json
{
  "2025-10-19": [
    {"time_slot": "22:00-23:59", "actual_task": "睡觉"}
  ],
  "2025-10-20": [
    {"time_slot": "00:00-06:00", "actual_task": "睡觉"}
  ]
}
\`\`\`

### 3. 任务识别

从用户描述中提取**核心动作**作为任务名：

- "睡觉"、"睡到" → 任务名：**"睡觉"**
- "开会"、"会议" → 任务名：**"开会"**
- "写代码"、"coding"、"编程" → 任务名：**"写代码"**
- "吃饭"、"午饭"、"晚餐" → 任务名：**"吃饭"**
- "看书"、"阅读" → 任务名：**"看书"**
- "看源码"、"学习tools" → 任务名：**"看源码学习tools"**

**任务名提取原则**：
- 尽量使用简短、常见的任务名（系统会自动匹配已有任务）
- 保留关键动作词（睡觉、吃饭、开会、写代码等）
- 技术类任务保留关键词（如"看源码学习tools"）

### 4. 备注提取

将用户描述中的**原因、细节、补充信息**放入备注：

示例：
- 输入："因为奶奶把我叫醒了" → \`actual_notes: "奶奶把我叫醒了"\`
- 输入："团队周会，讨论新功能" → \`actual_notes: "团队周会，讨论新功能"\`
- 输入："开发用户管理模块" → \`actual_notes: "开发用户管理模块"\`

### 5. planned vs actual

**判断规则**：
- 描述**过去发生的事** → 只填 \`actual_task\` 和 \`actual_notes\`
- 描述**未来计划** → 只填 \`planned_task\` 和 \`planned_notes\`
- 描述**计划变更**（本来计划A实际做了B） → 同时填写

**时间判断**：
- 过去时态（"我...了"、"已经..."） → actual
- 将来时态（"我要..."、"明天..."、"计划..."） → planned
- 对比表述（"本来...，实际..."） → planned + actual

### 6. 心情识别

如果用户明确表达了心情，提取到 \`mood\` 字段：
- "很开心"、"高兴" → \`mood: "开心"\`
- "累"、"疲惫"、"好累" → \`mood: "疲惫"\`
- "烦"、"无奈" → \`mood: "无奈"\`

## 解析示例

### 示例 1
**用户输入**：\`"我三点睡到早上八点就起来了，因为奶奶把我叫醒了"\`

**解析思路**：
- 时间：凌晨3点到早上8点（跨天？不跨天，同一天凌晨3点到8点）
- 任务：睡觉
- 备注：奶奶把我叫醒了
- 时态：过去时（"睡到...了"）→ actual

**输出**：
\`\`\`json
{
  "2025-10-19": [
    {
      "time_slot": "03:00-08:00",
      "actual_task": "睡觉",
      "actual_notes": "奶奶把我叫醒了"
    }
  ]
}
\`\`\`

### 示例 2
**用户输入**：\`"今天上午九点到十二点都在开会，下午写代码到五点"\`

**解析思路**：
- 两个时间段：09:00-12:00 和 14:00-17:00（下午默认从14:00开始）
- 两个任务：开会、写代码
- 时态：过去时 → actual

**输出**：
\`\`\`json
{
  "2025-10-19": [
    {
      "time_slot": "09:00-12:00",
      "actual_task": "开会",
      "actual_notes": "上午开会"
    },
    {
      "time_slot": "14:00-17:00",
      "actual_task": "写代码",
      "actual_notes": "下午写代码"
    }
  ]
}
\`\`\`

### 示例 3
**用户输入**：\`"明天下午两点有个会议，大概一小时"\`

**解析思路**：
- 日期：明天（2025-10-20）
- 时间：14:00-15:00（两点开始，一小时）
- 任务：开会
- 时态：将来时（"明天"、"有个"）→ planned

**输出**：
\`\`\`json
{
  "2025-10-20": [
    {
      "time_slot": "14:00-15:00",
      "planned_task": "开会",
      "planned_notes": "下午会议"
    }
  ]
}
\`\`\`

### 示例 4
**用户输入**：\`"本来计划写代码，结果一整天都在开会，好累"\`

**解析思路**：
- 时间：一整天（09:00-18:00）
- 计划任务：写代码
- 实际任务：开会
- 心情：疲惫
- 时态：计划 vs 实际 → planned + actual

**输出**：
\`\`\`json
{
  "2025-10-19": [
    {
      "time_slot": "09:00-18:00",
      "planned_task": "写代码",
      "planned_notes": "原计划写代码",
      "actual_task": "开会",
      "actual_notes": "实际一整天都在开会",
      "mood": "疲惫"
    }
  ]
}
\`\`\`

### 示例 5
**用户输入**：\`"昨晚十点睡到今早六点"\`

**解析思路**：
- 时间跨天：昨晚22:00到今早06:00
- 需要拆分为两天
- 任务：睡觉

**输出**：
\`\`\`json
{
  "2025-10-18": [
    {
      "time_slot": "22:00-23:59",
      "actual_task": "睡觉",
      "actual_notes": "晚上睡觉"
    }
  ],
  "2025-10-19": [
    {
      "time_slot": "00:00-06:00",
      "actual_task": "睡觉",
      "actual_notes": "睡到早上6点"
    }
  ]
}
\`\`\`

### 示例 6
**用户输入**：\`"今天凌晨三点到十二点都在睡觉，然后吃饭，然后午睡，然后到现在四点钟都在看tools，设计agent"\`

**解析思路**：
- 多个连续活动
- 凌晨3点-12点：睡觉（9小时）
- 12:30（推测）：吃饭
- 13:00（推测）：午睡
- 13:30-16:00：看tools，设计agent

**输出**：
\`\`\`json
{
  "2025-10-19": [
    {
      "time_slot": "03:00-12:00",
      "actual_task": "睡觉",
      "actual_notes": "凌晨睡觉（9小时）"
    },
    {
      "time_slot": "12:30",
      "actual_task": "吃饭",
      "actual_notes": "午饭"
    },
    {
      "time_slot": "13:00",
      "actual_task": "睡觉",
      "actual_notes": "午睡"
    },
    {
      "time_slot": "13:30-16:00",
      "actual_task": "看源码学习tools",
      "actual_notes": "看tools，设计agent"
    }
  ]
}
\`\`\`

## 注意事项

1. ✅ **只输出JSON**，不要添加任何解释性文字
2. ✅ **日期格式**必须是 \`YYYY-MM-DD\`
3. ✅ **时间格式**必须是 \`HH:MM\` 或 \`HH:MM-HH:MM\`（24小时制）
4. ✅ **任务名**尽量简短、常见（方便系统匹配）
5. ✅ **跨天时间**必须拆分为两天
6. ✅ 如果时间不明确，根据上下文**合理推测**
7. ✅ 如果没提到具体时间，可以**估算常见时间**（如"吃饭"推测12:30）

## 开始解析

现在，请解析用户的输入，直接输出JSON（不要添加任何其他文字）：
`;
/**
 * 工具输入参数 Schema
 */
exports.TOOL_INPUT_SCHEMA = {
    type: 'object',
    properties: {
        user_input: {
            type: 'string',
            description: '用户的自然语言描述',
        },
        current_date: {
            type: 'string',
            description: '当前日期 (YYYY-MM-DD)，用于解析相对时间（如"今天"、"明天"），默认使用系统时间',
        },
        slot_interval: {
            type: 'number',
            description: '时间槽间隔（分钟），默认30',
            default: 30,
        },
    },
    required: ['user_input'],
};
/**
 * 工具执行函数
 */
async function executeNaturalLanguageSchedule(args) {
    try {
        console.log('[Natural Language Schedule] 开始处理...');
        console.log('[Natural Language Schedule] 用户输入:', args.user_input);
        // 准备当前时间信息
        const currentDate = args.current_date || new Date().toISOString().split('T')[0];
        const currentTime = new Date().toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            weekday: 'long'
        });
        // 替换提示词中的变量
        const promptWithContext = exports.TOOL_PROMPT.replace('{{current_time}}', `${currentTime}（当前日期：${currentDate}）`);
        console.log('[Natural Language Schedule] 提示词已准备，等待AI解析...');
        console.log('[Natural Language Schedule] 当前参考时间:', currentTime);
        // 注意：这里返回的是提示词和用户输入
        // 实际的AI解析会由调用方（如Agent）完成
        return {
            ok: true,
            prompt: promptWithContext,
            user_input: args.user_input,
            next_step: 'AI需要解析user_input，输出exam.json格式的JSON',
            instruction: '请使用上述prompt作为系统提示词，解析user_input，直接输出JSON格式的结果',
        };
    }
    catch (error) {
        console.error('[Natural Language Schedule] 执行失败:', error);
        return {
            ok: false,
            error: error.message || String(error),
        };
    }
}
/**
 * 处理AI解析后的结果（完整流程）- 使用主后端 API
 */
async function processAIParsedSchedule(parsedExamFormat, options) {
    try {
        console.log('[Process AI Parsed] 开始处理AI解析结果...');
        console.log('[Process AI Parsed] 解析格式:', JSON.stringify(parsedExamFormat, null, 2));
        if (!options?.userToken) {
            return {
                ok: false,
                error: '缺少用户认证 token',
            };
        }
        // 导入主后端 API 相关函数
        const { examToMainAPI, printConversionSummary } = await Promise.resolve().then(() => __importStar(require('./format-converter-main-api')));
        const { createMainAPIClient } = await Promise.resolve().then(() => __importStar(require('./main-api-client')));
        // 创建主后端 API 客户端
        const mainAPIClient = createMainAPIClient(options.userToken);
        // 转换格式
        const conversionResult = await examToMainAPI(parsedExamFormat, {
            slot_interval: options?.slot_interval || 30,
            fuzzyMatch: options?.fuzzy_match !== false,
            userToken: options.userToken,
        });
        printConversionSummary(conversionResult);
        if (!conversionResult.ok || !conversionResult.data) {
            return {
                ok: false,
                error: conversionResult.error || '格式转换失败',
            };
        }
        // 调用主后端 API
        console.log('[Process AI Parsed] 正在调用主后端 API...');
        const result = await mainAPIClient.batchCreateTimeSlots(conversionResult.data);
        return {
            ok: true,
            created: conversionResult.data.time_slots.length,
            result,
            unmatchedTasks: conversionResult.unmatchedTasks,
            warnings: conversionResult.warnings,
            message: `成功创建 ${conversionResult.data.time_slots.length} 个时间槽`,
        };
    }
    catch (error) {
        console.error('[Process AI Parsed] 处理失败:', error);
        return {
            ok: false,
            error: error.message || String(error),
        };
    }
}
/**
 * 导出工具定义
 */
exports.naturalLanguageScheduleTool = (0, src_1.defineTool)({
    name: exports.TOOL_NAME,
    description: exports.TOOL_DESCRIPTION,
    params: {
        user_input: {
            type: 'string',
            description: '用户的自然语言描述',
        },
        current_date: {
            type: 'string',
            description: '当前日期 (YYYY-MM-DD)，默认使用系统时间',
        },
        slot_interval: {
            type: 'number',
            description: '时间槽间隔（分钟），默认30',
        },
    },
    attributes: { readonly: false },
    async exec(args) {
        return executeNaturalLanguageSchedule(args);
    },
});
// 附加提示信息
exports.naturalLanguageScheduleTool.prompt = exports.TOOL_PROMPT;
/**
 * 工具元数据
 */
exports.toolMetadata = {
    name: exports.TOOL_NAME,
    version: '1.0.0',
    category: 'schedule',
    tags: ['natural-language', 'schedule', 'ai-parsing'],
    prompt: exports.TOOL_PROMPT,
};
