const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildPrompt = ({ resumeText, jobDescription, missingKeywords }) => `
You are an expert resume writer helping a candidate improve their resume for a specific job application.

ORIGINAL RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

SKILLS THE JOB WANTS THAT AREN'T CLEARLY PRESENT:
${missingKeywords.join(", ")}

Your task: rewrite this resume to be more compelling and better aligned with the job description, then return it as STRUCTURED JSON matching this exact schema:

{
  "name": string,
  "title": string,
  "contact": string,
  "summary": string,
  "skills": [ { "category": string, "items": [string] } ],
  "projects": [ { "title": string, "meta": string, "bullets": [string] } ],
  "experience": [ { "title": string, "company": string, "dates": string, "bullets": [string] } ],
  "education": [ { "degree": string, "institution": string, "dates": string, "details": string } ],
  "certifications": [string]
}

STRICT RULES — DO NOT BREAK THESE:
- Do NOT invent, add, or imply any company, job title, project, degree, certification, date, or skill that is not already present in the original resume.
- Do NOT fabricate metrics, numbers, or achievements that aren't in the original text.
- Do NOT claim experience with any of the missing skills listed above unless the original resume already provides clear evidence of it.
- You MAY rephrase, restructure, and strengthen wording of existing content using stronger action verbs and clearer impact framing.
- You MAY reprioritize which existing experience is emphasized based on relevance to this job.
- Keep the person's real career history, job titles, dates, and companies exactly as given.
- "meta" for projects should contain the tech stack and any links/dates from the original, formatted as a single line.
- If a section (e.g. certifications) doesn't exist in the original resume, return it as an empty array.
- Return ONLY valid JSON matching the schema above — no markdown code fences, no commentary.
`;

const rewriteResume = async ({
  resumeText,
  jobDescription,
  missingKeywords,
}) => {
  const prompt = buildPrompt({ resumeText, jobDescription, missingKeywords });

  const maxAttempts = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const raw = result.response.text();
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (error) {
      lastError = error;

      const isOverloaded = error?.status === 503;
      const isParseError = error instanceof SyntaxError;

      console.error(
        `Resume rewrite attempt ${attempt} failed${
          isOverloaded ? " (model overloaded)" : isParseError ? " (bad JSON returned)" : ""
        }:`,
        error?.status || error.message
      );

      if ((isOverloaded || isParseError) && attempt < maxAttempts) {
        await sleep(attempt * 1500);
        continue;
      }

      break;
    }
  }

  throw lastError;
};

module.exports = { rewriteResume };