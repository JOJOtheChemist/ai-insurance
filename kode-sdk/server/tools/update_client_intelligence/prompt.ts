export const DESCRIPTION = '同步更新客户全景档案信息 (Update Intelligence)';

export const PROMPT = `Use this tool to update the customer's permanent profile based on new information gathered during the conversation.

CORE CAPABILITY: Multi-Client Support
- This tool allows you to manage MULTIPLE clients within a single chat session.
- You MUST specify 'targetClient' (e.g., "王总", "李女士", "The Husband") to tell the backend which customer profile you are updating.
- If the conversation switches focus to another person, call this tool again with a different 'targetClient'.

When to use:
- The customer clarifies their age, budget, or role.
- You identify new risks or needs.
- You learn about their family structure.
- At the end of a meaningful turn, to save a summary.

Parameters:
- targetClient: Critical! The name or identifier of the person you are updating.
- profileUpdates: The specific fields changing for THIS person.
- familyMembers: Family members relative to THIS person.
`;
