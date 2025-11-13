import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function ExtractDataFromResume (resumeText) {
  try {
    const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: resumeText+'Structure the above resume text into a JSON object with the following fields: fullName, email, phoneNumber, skills (as an array), workExperience (as an array of objects with company, role, startDate, endDate, and responsibilities), education (as an array of objects with institution, degree, startDate, endDate), and certifications (as an array). Ensure the JSON is properly formatted and remove and "\n".',
  });
    const text = response.text;
    return text;
  } catch (err) {
    console.error("Error initializing Gemini API:", err);
  }
}

export { ExtractDataFromResume };