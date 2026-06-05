const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);

  const data = await pdfParse(dataBuffer);

  return data.text;
};

module.exports = {
  extractTextFromPDF,
};