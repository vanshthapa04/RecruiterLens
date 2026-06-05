const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generateRecommendations = async ({
  resumeText,
  jobDescription,
  matchedSkills,
  missingSkills,
}) => {
  try {
    const prompt = `
You are an ATS expert.

Matched Skills:
${matchedSkills.join(", ")}

Missing Skills:
${missingSkills.join(", ")}

Generate 5 concise ATS recommendations.

Rules:
- Do NOT use markdown.
- Do NOT use * or **.
- Do NOT use numbering.
- Return plain text recommendations.
- Each recommendation must be on a new line.
`;

console.log(
    "Resume length:",
    resumeText.length
  );
  
  console.log(
    "JD length:",
    jobDescription.length
  );    
const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    console.error(
        JSON.stringify(error, null, 2)
    );
    return `
• Add projects demonstrating the missing skills.
• Include measurable achievements in project descriptions.
• Tailor your resume keywords to the job description.
• Highlight technologies used in real-world projects.
• Quantify impact wherever possible.
`;
  }
};

module.exports = {
  generateRecommendations,
};