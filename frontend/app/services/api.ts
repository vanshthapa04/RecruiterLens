const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://recruiter-lens-backend.onrender.com/api";

export const analyzeResume = async (
  file: File,
  jobDescription: string
) => {
  const formData = new FormData();

  formData.append("resume", file);
  formData.append(
    "jobDescription",
    jobDescription
  );

  const response = await fetch(
    `${API_URL}/analyze`,
    {
      method: "POST",
      body: formData,
    }
  );

  return response.json();
};

export const rewriteResume = async (
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[]
) => {
  const response = await fetch(
    `${API_URL}/rewrite`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeText,
        jobDescription,
        missingKeywords,
      }),
    }
  );

  return response.json();
};