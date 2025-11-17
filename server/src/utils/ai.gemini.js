import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


async function ExtractRawJSON (resumeText) {
  try {
    const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: resumeExtractionPrompt.replace("[INSERT RAW RESUME TEXT HERE]", resumeText),
  });
    const text = response.text;
    return text;
  } catch (err) {
    console.error("Error initializing Gemini API:", err);
  }
}

export { ExtractRawJSON };

const resumeExtractionPrompt = `Execute a two-step process on the following raw resume text:

// === STEP 1: DATA CLEANING (PRE-PROCESSING) ===
// Before attempting to parse the data, clean the raw input text by removing all non-essential formatting characters. 
// This includes replacing all instances of newlines (\\n), carriage returns (\\r), tabs (\\t), and excessive whitespace 
// (reducing multiple spaces to a single space). This ensures the text is a single, clean block for reliable parsing.

// === STEP 2: JSON STRUCTURE CONVERSION ===
// Structure the cleaned text into a single, valid JSON object. The JSON object MUST adhere strictly to the schema below. 
// If data for a top-level field cannot be found, use null. If data for an array field cannot be found, use an empty array ([]).

{
  "fullName": "string",
  "email": "string",
  "phoneNumber": "string",
  "summary": "string",

  "skills": [
    {
      "type": "string (e.g., 'Technical', 'Soft')",
      "list": ["string"]
    }
  ],

  "workExperience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM or 'Present'",
      "responsibilities": ["string (quantified accomplishments)"]
    }
  ],

  "education": [
    {
      "institution": "string",
      "degree": "string",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "gpa": "string or null",
      "honors": ["string (e.g., 'Magna Cum Laude')"]
    }
  ],

  "projects": [
    {
      "name": "string",
      "description": "string",
      "technologiesUsed": ["string"],
      "url": "string or null"
    }
  ],

  "certifications": ["string"],

  "awards": [
    {
      "name": "string",
      "organization": "string",
      "date": "YYYY-MM"
    }
  ],

  "languages": [
    {
      "language": "string",
      "proficiency": "string (e.g., 'Native', 'Fluent')"
    }
  ]
}

// END OF SCHEMA. The final output must be only the requested JSON object.
// Input Resume Text: [INSERT RAW RESUME TEXT HERE]
`;