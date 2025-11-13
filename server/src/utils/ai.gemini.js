const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ExtractDataFromResume = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(resumeText + "\n Structure the key candidate information in JSON format.");
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (err) {
    console.error("Error initializing Gemini API:", err);
  }
};

module.exports = {
  ExtractDataFromResume,
};