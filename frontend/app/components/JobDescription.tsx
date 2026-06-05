"use client";

interface JobDescriptionProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
}

export default function JobDescription({
  jobDescription,
  setJobDescription,
}: JobDescriptionProps) {
  return (
<div
  className="
  bg-white/90
  backdrop-blur-sm
  border
  border-blue-100
  rounded-2xl
  p-8
  h-full
  shadow-lg
  "
>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        💼 Job Description
      </h2>

      <p className="text-gray-500 mb-6">
        Paste the job description to compare it
        with your resume.
      </p>

      <textarea
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
        placeholder="Paste the complete job description here..."
        className="
        w-full
        h-72
        resize-none
        rounded-2xl
        border
        border-gray-200
        p-4
        text-gray-700
        bg-white
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:border-blue-500
        transition-all
        "
      />

      <div className="flex justify-between mt-4 text-sm text-gray-500">
        <span>
          Paste complete job requirements
        </span>

        <span>
          {jobDescription.length} characters
        </span>
      </div>
    </div>
  );
}