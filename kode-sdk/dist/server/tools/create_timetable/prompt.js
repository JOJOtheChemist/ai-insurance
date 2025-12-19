"use strict";
/**
 * Create timetable tool prompts and descriptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '将用户的自然语言时间描述转换为结构化时间表。支持时间段格式，自动匹配项目和子任务。⚠️ 重要：1) 必须使用用户已有的项目名称 2) 必须为每个任务指定对应的子任务，如果填错或遗漏会返回可用的项目/子任务列表。';
exports.PROMPT = `【工具功能】将自然语言的时间描述转换为结构化时间表
此工具能够理解用户的自然语言时间安排描述（如"上午9点到12点学习数据结构"），并自动转换为结构化的时间表数据，智能匹配到用户的项目和子任务。

参数说明:
- schedule (必填): 时间表对象，日期作为key，时间槽数组作为value
  - 日期格式: YYYY-MM-DD（如 "2025-11-04"）
  - 时间槽数组: 包含多个时间槽对象

时间槽对象字段:
- time_slot (必填): 时间或时间段
  * 单点格式: "09:00" - 表示单个时间点
  * 时间段格式: "09:00-17:00" - 表示连续时间段（会自动拆分为多个30分钟的时间块）
  * ⚠️ **重要**：时间必须是整半小时！只能是 XX:00 或 XX:30，不能是 XX:20、XX:15 等
  * 例如：
    - ✅ 正确：4:00, 4:30, 6:00, 6:30
    - ❌ 错误：4:20（应改为 4:00 或 4:30）、6:15（应改为 6:00）
  * 如果输入了非整半小时的时间，系统会自动向下取整，但建议直接使用整半小时时间
  
- planned_task (可选): 计划要做的任务名称 - 必须使用用户已有的项目名称（精确匹配）
- planned_subtask (⚠️ 如果有 planned_task 则必填): 计划任务的子任务名称 - 必须是该项目下的子任务
- planned_notes (可选): 计划任务的详细说明

- actual_task (可选): 实际完成的任务名称 - 必须使用用户已有的项目名称（精确匹配）
- actual_subtask (⚠️ 如果有 actual_task 则必填): 实际任务的子任务名称 - 必须是该项目下的子任务
- actual_notes (可选): 实际任务的详细说明

⚠️ 重要验证规则:
1. planned_task 和 actual_task 必须是用户已有的项目名称
2. 如果提供了 planned_task，必须同时提供 planned_subtask
3. 如果提供了 actual_task，必须同时提供 actual_subtask
4. 子任务必须属于对应的项目
5. 如果验证失败，工具会返回错误和完整的项目/子任务列表
6. 看到错误后，根据返回的列表重新填写
- mood (可选): 心情状态（英文）
  * 英文: happy, sad, angry, anxious, calm, tired, excited, focused, stressed, neutral, relaxed

⚠️ 重要：planned 和 actual 的时间判断规则：

【核心判断逻辑】
必须根据当前时间和时间段来判断：

1. **只有actual**：时间段在当前时间之前（已经过去的事情）
   - 判断方法：如果时间段的结束时间 < 当前时间 → 使用 actual_task
   - 示例：当前时间 22:00，用户说"今天上午10点到12点学习了" → 12:00 < 22:00，是过去的事，用 actual_task
   - 示例：当前时间 22:00，用户说"今天下午2点到4点练习了" → 16:00 < 22:00，是过去的事，用 actual_task
   - 示例：当前时间 22:00，用户说"今天晚上8点到10点练习了" → 如果22:00 > 20:00，说明这个时间段刚结束，用 actual_task

2. **只有planned**：时间段在当前时间之后（未来计划）
   - 判断方法：如果时间段的开始时间 > 当前时间 → 使用 planned_task
   - 示例：当前时间 08:00，用户说"今天下午2点到4点要开会" → 14:00 > 08:00，是未来的计划，用 planned_task
   - 示例：当前时间 13:00，用户说"明天上午9点到12点开会" → 是明天，未来的计划，用 planned_task

3. **两者并存**：计划与实际不同时
   - 示例：本来计划写代码（planned_task），实际在开会（actual_task）
   - 这种情况通常发生在计划时间段已经过去，但实际做了不同的事情

【特殊情况】
- 如果用户明确说了"已经做了"、"完成了" → 用 actual_task（即使时间段还未结束）
- 如果用户明确说了"要"、"打算"、"计划" → 用 planned_task（即使时间段已经过去）
- 如果时间段部分重叠当前时间：
  - 开始时间 < 当前时间 < 结束时间 → 建议用 actual_task（正在进行中，视为实际发生的事情）
  - 或者根据用户语气判断（"正在做"→actual，"计划做"→planned）

自然语言 → 结构化转换:
- 工具理解自然语言时间描述，自动提取项目、子任务、时间段等信息
- 自动将任务名称（如"学习数据结构"）匹配到用户的项目和子任务
- 匹配规则: 精确匹配 > 模糊匹配（包含关系）
- 如果匹配不到，任务名称会保留在备注中

时间段自动拆分:
- "03:00-12:00"（9小时）会自动拆分为18个30分钟的时间块
- 每个时间块都会创建独立的记录
- time_block编号: 0-47（一天48个30分钟块）
  * 00:00 = 0, 03:00 = 6, 09:00 = 18, 12:00 = 24, 23:30 = 47

返回结果:
- ok: 操作是否成功
- data: 创建结果
  - success: 是否成功
  - message: 操作消息
  - timetable: 时间表信息
    - created_count: 创建的时间段数量
    - created_ids: 创建的时间段ID列表
    - dates: 覆盖的日期列表
- error: 错误信息（如果失败）

使用示例:

1. 记录过去的事情（只有actual）:
create_timetable({
  schedule: {
    "2025-11-04": [
      {
        "time_slot": "09:00-12:00",
        "actual_task": "计算机基础",
        "actual_subtask": "数据结构与算法",
        "actual_notes": "学习二叉树和排序算法"
      },
      {
        "time_slot": "13:00-14:00",
        "actual_task": "法语学习",
        "actual_subtask": "词汇记忆",
        "actual_notes": "背了50个新单词"
      },
      {
        "time_slot": "15:00-17:00",
        "actual_task": "唱歌练习",
        "actual_subtask": "声乐基础",
        "actual_notes": "看源码学习tools，设计agent",
        "mood": "专注"
      }
    ]
  }
})

2. 安排未来计划（只有planned）:
create_timetable({
  schedule: {
    "2025-11-05": [
      {
        "time_slot": "09:00-12:00",
        "planned_task": "工作项目",
        "planned_subtask": "团队会议",
        "planned_notes": "讨论项目进度"
      },
      {
        "time_slot": "14:00-17:00",
        "planned_task": "工作项目",
        "planned_subtask": "写代码",
        "planned_notes": "完成新功能开发"
      }
    ]
  }
})

3. 计划与实际对比（两者都有）:
create_timetable({
  schedule: {
    "2025-11-04": [
      {
        "time_slot": "09:00-17:00",
        "planned_task": "工作项目",
        "planned_subtask": "写代码",
        "planned_notes": "计划写一整天代码",
        "actual_task": "工作项目",
        "actual_subtask": "开会",
        "actual_notes": "实际一整天都在开会",
        "mood": "压力"
      }
    ]
  }
})

4. 跨天安排（需要分成两个日期）:
create_timetable({
  schedule: {
    "2025-11-04": [
      {
        "time_slot": "22:00-23:59",
        "actual_task": "生活日常",
        "actual_subtask": "睡觉",
        "actual_notes": "晚上睡觉"
      }
    ],
    "2025-11-05": [
      {
        "time_slot": "00:00-06:00",
        "actual_task": "生活日常",
        "actual_subtask": "睡觉",
        "actual_notes": "睡觉到早上6点"
      }
    ]
  }
})

5. 混合单点和时间段:
create_timetable({
  schedule: {
    "2025-11-04": [
      {
        "time_slot": "09:00-12:00",
        "actual_task": "工作项目",
        "actual_subtask": "写代码",
        "mood": "专注"
      },
      {
        "time_slot": "12:30",
        "actual_task": "生活日常",
        "actual_subtask": "吃饭"
      },
      {
        "time_slot": "14:00",
        "actual_task": "工作项目",
        "actual_subtask": "开会"
      },
      {
        "time_slot": "15:00-18:00",
        "actual_task": "工作项目",
        "actual_subtask": "写代码"
      }
    ]
  }
})

注意事项:
1. 时间格式必须正确: HH:MM 或 HH:MM-HH:MM
   - ⚠️ **必须是整半小时**：只能是 XX:00 或 XX:30
   - ❌ 错误示例：4:20, 6:15, 9:45
   - ✅ 正确示例：4:00, 4:30, 6:00, 6:30
   - 如果输入非整半小时时间，系统会自动向下取整（如 4:20 → 4:00），但会导致时间不准确
2. 日期格式必须为: YYYY-MM-DD
3. 每个时间槽至少需要 planned_task, actual_task 或 mood 其中之一
4. 跨天的任务需要拆分为两个日期（如晚上10点到次日早上6点的睡觉）
5. mood值支持中文，会自动转换为英文
6. 任务名称会智能匹配到用户的项目/子任务，找不到也会保留在备注中
7. 时间段会自动拆分：1小时 = 2个时间块，每个块30分钟

错误处理:
- 如果日期格式错误，会提示正确格式
- 如果时间格式错误，会提示正确格式
- ⚠️ 如果时间不是整半小时（如 4:20），会返回错误提示，要求改为 4:00 或 4:30
- 如果mood值无效，会提示有效值列表
- 如果数据验证失败（如project_id和subtask_id不匹配），会返回详细错误信息

应用场景:
- 将用户口述的时间安排转换为结构化数据（如"上午学了3小时编程"）
- 快速记录一天的时间安排，自动识别项目和子任务
- 回顾过去某段时间做了什么
- 规划未来的时间计划
- 对比计划与实际执行情况
- 记录工作/学习时的心情状态

核心优势：自动将自然语言转换为结构化、可查询、可统计的时间表数据`;
