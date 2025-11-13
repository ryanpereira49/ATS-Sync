import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const processResumeFile = async (file) => {
  const filePath = file.path;
  let textContent = "";

  try {
    if (file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      textContent = data.text;
    } else {
      const result = await mammoth.extractRawText({ path: filePath });
      textContent = result.value;
    }

    const extractedData = extractCandidateData(textContent);
    return extractedData;
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
