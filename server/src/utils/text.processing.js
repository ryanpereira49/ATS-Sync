function cleanRawJSON(rawJSON) {
    let jsonString = rawJSON.trim();

    // 2. Remove the Markdown code block wrappers
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7); // Remove '```json'
    }
    if (jsonString.startsWith('```')) {
        jsonString = jsonString.substring(3); // Remove '```' (if language hint is missing)
    }
    if (jsonString.endsWith('```')) {
        jsonString = jsonString.slice(0, -3); // Remove trailing '```'
    }

    // 3. Remove escaped characters (like the \n shown in your output)
    // Replace escaped newlines, tabs, and carriage returns that the string might contain
    jsonString = jsonString.replace(/\\n/g, '')
                           .replace(/\\t/g, '')
                           .replace(/\\r/g, '');

    // 4. Remove any extra quotes that might accidentally wrap the whole JSON string
    if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
        jsonString = jsonString.substring(1, jsonString.length - 1);
    }
    
    // 5. Trim again after cleaning
    jsonString = jsonString.trim();

    try {
        // 6. Final Parsing
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing the cleaned JSON string:", error);
        return { error: "Error parsing the cleaned JSON string:" } // Return error with a message
    }
}

export { cleanRawJSON };