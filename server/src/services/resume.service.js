import fs from "fs";
import mammoth from "mammoth";
import { PDFParse } from 'pdf-parse';
import {ExtractDataFromResume} from "../utils/ai.gemini.js";


export const processResumeFile = async (file) => {
  const filePath = file.path;
  let textContent = "";

  try {
    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({data: dataBuffer});
      const data = await  parser.getText();
      await parser.destroy();

      textContent = data.text;
    } else {
      const result = await mammoth.extractRawText({ path: filePath });
      textContent = result.value;
    }

    const resumeData = extractCandidateData(textContent);
    return resumeData;
    

  } finally {
    fs.unlinkSync(filePath); // cleanup after processing
  }
};

async function extractCandidateData(text) {
    return await ExtractDataFromResume(text);
}
