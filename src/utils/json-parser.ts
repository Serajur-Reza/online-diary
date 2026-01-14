export function parseJsonResponse(rawString: string): any {
  try {
    // 1. Try a direct parse (in case the model didn't use backticks)
    return JSON.parse(rawString.trim());
  } catch (e) {
    // 2. If direct parse fails, use Regex to find the JSON block
    // This looks for anything between ```json and ``` or just between { and }
    const jsonRegex = /({[\s\S]*})/;
    const match = rawString.match(jsonRegex);

    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim());
      } catch (innerError) {
        throw new Error('Found JSON block but it contains syntax errors.');
      }
    }

    throw new Error('No valid JSON found in the AI response.');
  }
}
