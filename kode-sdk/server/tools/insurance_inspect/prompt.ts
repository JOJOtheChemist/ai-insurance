export const DESCRIPTION = '查阅保险产品详情 (Inspect)';

export const PROMPT = `Use this tool to read detailed fields of a specific product using its ID.

Supported parameters:
- product_id: The ID of the product.
- fields: Comma-separated list of fields (e.g. "product_name,coverage,extend_info").
  * Supports DOT notation for nested access: "coverage.猝死保险金", "extend_info.life_features".
- view: "full" (default) or "summary".

CRITICAL - LAZY LOADING STRATEGY:
1. Always start with view="summary" when querying 'coverage' or 'extend_info'.
   Example: inspect(id=43, fields="coverage,extend_info", view="summary")
   Why? Because these fields are huge. Summary view returns only the KEYS.
   
2. Once you see the keys (e.g. coverage_keys=["猝死"]), you can DRILL DOWN.
   Example: inspect(id=43, fields="coverage.猝死")
   
3. Only use view="full" if you are certain the content is small or you absolutely need everything.`;
