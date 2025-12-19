/**
 * 会话管理模块 - 自动命名逻辑
 */

/**
 * 自动生成会话标题
 * 基于第一条用户消息的内容
 */
export function generateSessionTitle(messages: any[]): string {
  // 找到第一条用户消息
  const firstUserMessage = messages.find((msg: any) => msg.role === 'user');
  
  if (!firstUserMessage) {
    return '新对话';
  }

  // 提取用户消息的文本内容
  let userText = extractUserText(firstUserMessage.content);

  if (!userText || userText.trim().length === 0) {
    return '新对话';
  }

  // 清理文本
  userText = cleanText(userText);

  if (userText.length === 0) {
    return '打招呼';
  }

  // 智能提取关键词
  return extractSmartTitle(userText);
}

/**
 * 提取用户消息文本
 */
function extractUserText(content: any): string {
  if (typeof content === 'string') {
    return content;
  }
  
  if (Array.isArray(content)) {
    return content
      .filter((item: any) => item.type === 'text')
      .map((item: any) => item.text)
      .join(' ');
  }
  
  return '';
}

/**
 * 清理文本（移除问候语）
 */
function cleanText(text: string): string {
  let cleaned = text.trim();

  // 移除常见的问候语
  const greetings = ['你好', 'hello', 'hi', '您好', '早上好', '下午好', '晚上好'];
  for (const greeting of greetings) {
    const regex = new RegExp(`^${greeting}[！!，,。.\\s]*`, 'i');
    cleaned = cleaned.replace(regex, '');
  }

  return cleaned.trim();
}

/**
 * 智能提取标题
 */
function extractSmartTitle(userText: string): string {
  let title = '';

  // 1. 检测问题类型
  if (userText.includes('怎么') || userText.includes('如何') || userText.includes('怎样')) {
    title = extractKeyPhrase(userText, ['怎么', '如何', '怎样']);
  }
  // 2. 检测计算请求
  else if (userText.includes('计算') || /\d+\s*[+\-*/]\s*\d+/.test(userText)) {
    const mathMatch = userText.match(/(\d+\s*[+\-*/]\s*\d+)/);
    if (mathMatch) {
      title = `计算${mathMatch[1].replace(/\s/g, '')}`;
    } else {
      title = userText.substring(0, 15);
    }
  }
  // 3. 检测时间/日程相关
  else if (userText.includes('时间') || userText.includes('日程') || userText.includes('提醒') || 
           userText.includes('午休') || userText.includes('会议') || /\d+[点时]/.test(userText)) {
    // 提取关键活动
    const keywords = ['午休', '会议', '培训', '上课', '下班', '吃饭', '开会', '学习', '工作', '休息'];
    for (const keyword of keywords) {
      if (userText.includes(keyword)) {
        title = `${keyword}安排`;
        break;
      }
    }
    if (!title) {
      title = userText.substring(0, 15);
    }
  }
  // 4. 检测疑问句
  else if (userText.includes('什么') || userText.includes('为什么') || userText.includes('哪里') || 
           userText.includes('谁') || userText.endsWith('?') || userText.endsWith('？')) {
    title = userText.substring(0, 20);
  }
  // 5. 默认：取前20个字符
  else {
    title = userText.substring(0, 20);
  }

  // 确保标题不会太长
  if (title.length > 20) {
    title = title.substring(0, 20) + '...';
  }

  return title;
}

/**
 * 提取关键短语
 */
function extractKeyPhrase(text: string, triggers: string[]): string {
  for (const trigger of triggers) {
    const index = text.indexOf(trigger);
    if (index !== -1) {
      // 提取触发词后的内容
      const afterTrigger = text.substring(index + trigger.length).trim();
      if (afterTrigger.length > 0) {
        return afterTrigger.substring(0, 20);
      }
    }
  }
  return text.substring(0, 20);
}

/**
 * 提取消息内容文本（用于列表显示）
 */
export function extractMessageContent(content: any): string {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .filter((item: any) => item.type === 'text')
      .map((item: any) => item.text)
      .join('\n')
      .substring(0, 200); // 限制长度
  }

  return JSON.stringify(content).substring(0, 200);
}

