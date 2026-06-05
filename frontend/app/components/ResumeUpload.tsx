"use client";

interface ResumeUploadProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}

export default function ResumeUpload({
  selectedFile,
  setSelectedFile,
}: ResumeUploadProps) {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div
  className="
  bg-white/90
  backdrop-blur-sm
  border-2
  border-dashed
  border-blue-200
  rounded-2xl
  p-8
  h-full
  shadow-lg
  "
>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        📄 Upload Resume
      </h2>

      <p className="text-gray-500 mb-8">
        Upload your resume in PDF format for ATS analysis.
      </p>

      <label
        htmlFor="resume-upload"
        className="
        flex
        flex-col
        items-center
        justify-center
        cursor-pointer
        bg-white
        rounded-2xl
        border
        border-gray-200
        p-10
        hover:border-blue-400
        hover:shadow-md
        transition-all
        "
      >
        <div className="text-6xl mb-4">
          📄
        </div>

        <p className="text-lg font-semibold text-gray-700">
          Click to Upload
        </p>

        <p className="text-sm text-gray-500 mt-2">
          PDF files only
        </p>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {selectedFile && (
        <div
          className="
          mt-6
          bg-green-50
          border
          border-green-200
          rounded-xl
          p-4
          "
        >
          <p className="text-green-700 font-medium">
            ✅ {selectedFile.name}
          </p>
        </div>
      )}

    </div>
  );
}