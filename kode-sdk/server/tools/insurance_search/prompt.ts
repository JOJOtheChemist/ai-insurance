export const DESCRIPTION = '语义搜索保险产品 (Search)';

export const PROMPT = `Use this tool to search/retrieve products by keywords.
This tool searches effectively across:
- Product Name
- Description
- Extended Info (JSON tables, highlights)
- Coverage (Detailed terms) [Optimization: Coverage is fully indexed]

Supported parameters:
- keyword: The search term (e.g. "猝死", "牙科", "满期金").
- limit: Number of top results to return (default: 5).

Best Practice:
- Use this when the user has a specific "need" or "scenario" (e.g. "I want coverage for sudden death").
- If the first broad search yields too many results, refine the keyword.`;
