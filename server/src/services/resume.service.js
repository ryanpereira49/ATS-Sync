import fs from "fs";
import mammoth from "mammoth";
import { PDFParse } from 'pdf-parse';
import { text } from "stream/consumers";


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

    //const extractedData = extractCandidateData(textContent);
    //return extractedData;
    return {
        text: textContent
    }

  } finally {
    fs.unlinkSync(filePath); // cleanup after processing
  }
};

function extractCandidateData(text) {
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0];
  const phone = text.match(/\+?\d[\d\s()-]{8,}\d/g)?.[0];
  const name = text.split("\n")[0].trim();

  return {
    name: name || "Unknown",
    email: email || "Not found",
    phone: phone || "Not found",
    summary: text.substring(0, 500) + "...",
  };
}
