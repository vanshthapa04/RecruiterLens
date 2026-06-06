const API_URL = "https://recruiter-lens-backend.onrender.com/api";

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