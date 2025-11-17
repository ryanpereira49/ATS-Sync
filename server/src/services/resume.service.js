import fs from "fs";
import mammoth from "mammoth";
import { PDFParse } from 'pdf-parse';
import {ExtractRawJSON} from "../utils/ai.gemini.js";
import { cleanRawJSON } from "../utils/text.processing.js";


export const processResumeFile = async (file) => {
  const filePath = file.path;
  let parsedResumeText = "";

  try {
    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({data: dataBuffer});
      const data = await  parser.getText();
      await parser.destroy();

      parsedResumeText = data.text;
    } else {
      const result = await mammoth.extractRawText({ path: filePath });
      parsedResumeText = result.value;
    }

    const RawJSON = await ExtractRawJSON(parsedResumeText);

    const cleanedJSON = cleanRawJSON(RawJSON);
    return cleanedJSON;
    

  } finally {
    fs.unlinkSync(filePath); // cleanup after processing
  }
};
