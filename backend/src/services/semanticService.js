const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const getEmbedding = async (text) => {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
};

const cosineSimilarity = (vecA, vecB) => {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

// Splits JD into individual requirement-ish lines
const splitIntoLines = (text) => {
  return text
    .split(/\n|•|-\s/)
    .map((line) => line.trim())
    .filter((line) => line.length > 15); // drop short/empty fragments
};

const calculateSemanticScore = async (resumeText, jobDescription) => {
  const jdLines = splitIntoLines(jobDescription);
  const resumeLines = splitIntoLines(resumeText);

  if (jdLines.length === 0 || resumeLines.length === 0) {
    return { semanticScore: 0, requirementBreakdown: [] };
  }

  // Embed all resume lines once
  const resumeEmbeddings = await Promise.all(
    resumeLines.map((line) => getEmbedding(line))
  );

  const requirementBreakdown = [];

  for (const jdLine of jdLines) {
    const jdEmbedding = await getEmbedding(jdLine);

    let maxSimilarity = 0;
    resumeEmbeddings.forEach((resumeEmbedding) => {
      const sim = cosineSimilarity(jdEmbedding, resumeEmbedding);
      if (sim > maxSimilarity) maxSimilarity = sim;
    });

    requirementBreakdown.push({
      requirement: jdLine,
      similarity: Math.round(maxSimilarity * 100),
      matched: maxSimilarity >= 0.7, // threshold, tune later
    });
  }

  const avgSimilarity =
    requirementBreakdown.reduce((sum, r) => sum + r.similarity, 0) /
    requirementBreakdown.length;

  return {
    semanticScore: Math.round(avgSimilarity),
    requirementBreakdown,
  };
};

module.exports = { calculateSemanticScore };