"use strict";
/**
 * Create subtask tool prompts and descriptions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROMPT = exports.DESCRIPTION = void 0;
exports.DESCRIPTION = '创建新的子任务，支持项目ID或项目名称。自动智能匹配现有项目或创建新项目。可以指定优先级、紧急程度、难度等属性';
exports.PROMPT = `使用此工具创建新的子任务。智能项目管理系统：支持项目ID或项目名称，自动模糊匹配现有项目，找不到则创建新项目。

参数说明:
- project (必填): 所属项目（可以是项目ID或项目名称）
  * 如果是数字（如 1, 2, 3），作为项目ID使用
  * 如果是字符串（如 "工作"、"学习"），会智能匹配项目名称
  * 如果匹配不到，会自动创建新项目
- category (必填): 项目分类，必须是以下四种之一：
  * "学习" - 学习相关的项目
  * "生活" - 生活相关的项目
  * "工作" - 工作相关的项目
  * "娱乐" - 娱乐相关的项目
  ⚠️ 注意：category 必须是上述四个中文词之一，不能是其他值！
- name (必填): 子任务名称（字符串）
- priority (可选): 优先级，如"高"、"中"、"低"
- urgency_importance (可选): 紧急重要程度，如"紧急且重要"、"重要不紧急"、"紧急不重要"、"不紧急不重要"
- difficulty (可选): 难度级别，如"简单"、"中级"、"困难"
- color (可选): 颜色标识（HEX格式），如"#ff5733"

智能项目匹配逻辑（参考 create_schedules 工具）:
1. 如果 project 是数字，直接作为项目ID使用
2. 如果 project 是字符串数字（如 "1"），解析为项目ID
3. 如果 project 是项目名称，按以下顺序匹配：
   a. 完全匹配（不区分大小写）
   b. 包含匹配（项目名包含输入，或输入包含项目名）
   c. 去除空格后匹配
4. 如果没有匹配到任何项目，自动创建新项目

返回结果包含:
- ok: 操作是否成功
- data: 创建结果对象
  - success: 是否创建成功
  - message: 操作消息
  - subtask: 新创建的子任务信息
    - id: 子任务ID
    - project_id: 所属项目ID
    - name: 子任务名称
    - priority: 优先级
    - urgency_importance: 紧急重要程度
    - difficulty: 难度级别
    - difficulty_class: 难度分类
    - color: 颜色标识
- error: 错误信息（如果失败）

使用示例:

1. 使用项目ID创建（最直接）:
create_subtask({ project: 1, category: "工作", name: "完成产品设计" })
create_subtask({ project: "1", category: "学习", name: "编写文档" })

2. 使用项目名称创建（智能匹配）:
create_subtask({ project: "工作任务", category: "工作", name: "完成周报" })
create_subtask({ project: "英语学习", category: "学习", name: "背单词" })

3. 模糊匹配示例:
create_subtask({ project: "工作", category: "工作", name: "任务1" })
create_subtask({ project: "工作项目", category: "工作", name: "任务2" })  // 会匹配"工作"项目
create_subtask({ project: "gongzuo", category: "工作", name: "任务3" })  // 不区分大小写

4. 自动创建新项目（项目不存在时）:
create_subtask({ 
  project: "健身计划", 
  category: "生活",  // ⚠️ 必须指定分类
  name: "每天跑步30分钟",
  priority: "高"
})

5. 完整参数示例:
create_subtask({ 
  project: "个人成长", 
  category: "学习",  // ⚠️ 必须是：学习/生活/工作/娱乐 之一
  name: "学习TypeScript", 
  priority: "高",
  urgency_importance: "紧急且重要",
  difficulty: "中级",
  color: "#ff5733"
})

6. 批量创建（同一项目下多个任务）:
create_subtask({ project: "工作", category: "工作", name: "任务1" })
create_subtask({ project: "工作", category: "工作", name: "任务2" })
create_subtask({ project: "工作", category: "工作", name: "任务3" })
// 三个任务都会在"工作"项目下（智能匹配同一项目）

7. 不同分类的示例:
create_subtask({ project: "数学作业", category: "学习", name: "微积分习题" })
create_subtask({ project: "买菜做饭", category: "生活", name: "买蔬菜" })
create_subtask({ project: "项目开发", category: "工作", name: "写代码" })
create_subtask({ project: "看电影", category: "娱乐", name: "看复仇者联盟" })

注意事项:
- project、category 和 name 都是必填字段
- project 可以是数字（项目ID）或字符串（项目名称）
- category 必须是以下四个中文词之一："学习"、"生活"、"工作"、"娱乐"
- ⚠️ 如果 category 不是这四个词，会返回错误！
- 工具会智能处理项目的查找和创建，无需手动创建项目
- 项目名称支持模糊匹配（不区分大小写、包含匹配、去除空格匹配）
- 创建成功后会返回新子任务的完整信息，包括自动生成的ID
- 如果需要查看现有项目，可以先使用 get_projects 工具

匹配优先级:
1. 项目ID（最精确）
2. 完全匹配项目名称
3. 包含匹配
4. 去除空格后匹配
5. 创建新项目（都不匹配时）

应用场景:
- 快速创建新的待办任务（无需事先创建项目）
- 为项目添加子任务
- 规划和分解大型任务
- 建立任务清单
- 灵活管理多个项目的任务`;
