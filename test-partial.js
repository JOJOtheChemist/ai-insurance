
function tryParsePartialJson(jsonStr) {
    if (!jsonStr) return null;
    try {
        return JSON.parse(jsonStr);
    } catch (e) {
        // Continue to repair
    }

    let repaired = jsonStr.trim();

    // 1. Find the first '{'
    const firstBrace = repaired.indexOf('{');
    if (firstBrace === -1) return null; // No JSON object start found

    // If there's garbage before '{', strip it (unless it looks like markdown code block start)
    // For now we assume the string passed in *starts* with JSON or is the JSON block

    // 2. Simple stack-based repair?
    // Actually, a simpler heuristic often works for simple append-only streams:
    // Just close open braces/quotes.

    // Check if we are inside a string
    let inString = false;
    let escape = false;
    let balance = []; // Stack for { and [

    for (let i = 0; i < repaired.length; i++) {
        const char = repaired[i];

        if (escape) {
            escape = false;
            continue;
        }

        if (char === '\\') {
            escape = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            continue;
        }

        if (!inString) {
            if (char === '{') balance.push('}');
            else if (char === '[') balance.push(']');
            else if (char === '}') {
                if (balance[balance.length - 1] === '}') balance.pop();
            }
            else if (char === ']') {
                if (balance[balance.length - 1] === ']') balance.pop();
            }
        }
    }

    // If in string, close it
    if (inString) {
        repaired += '"';
    }

    // Close remaining braces
    while (balance.length > 0) {
        repaired += balance.pop();
    }

    try {
        console.log("Original:", jsonStr);
        console.log("Repaired:", repaired);
        return JSON.parse(repaired);
    } catch (e) {
        // console.log("Repair failed:", e.message);
        return null; // Totally unrecoverable
    }
}

// Test Cases
const cases = [
    '{"content": "Hello',
    '{"content": "Hello world", "recommendations": ',
    '{"content": "Hello", "recommendations": [{"name": "Plan A"',
    '{"content": "He said \\"Hi\\""',
    '{"list": [1, 2, 3',
    '{"nested": {"a": 1',
];

cases.forEach(c => {
    const res = tryParsePartialJson(c);
    console.log("Parsed:", JSON.stringify(res));
    console.log("---");
});
