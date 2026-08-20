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
    <div className="bg-surface border-2 border-border rounded-[28px] p-7 h-full flex flex-col shadow-[0_2px_0_0_var(--color-border)]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-bold text-ink text-xl">
          Your Resume
        </h2>
        <span className="font-mono text-[11px] px-2 py-1 rounded-full bg-violet/10 text-violet-dark">
          01
        </span>
      </div>

      <p className="text-ink-muted text-sm mb-6">
        Drop in your PDF — we'll read it like a recruiter would.
      </p>

      <label
        htmlFor="resume-upload"
        className="
        flex-1 flex flex-col items-center justify-center
        cursor-pointer
        bg-panel
        rounded-2xl
        border-2 border-dashed border-violet/30
        px-6 py-10
        transition-all
        hover:border-violet hover:bg-violet/5
        "
      >
        <div className="w-14 h-14 rounded-2xl bg-violet flex items-center justify-center rotate-[-6deg] mb-4">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12" />
            <path d="M7 8l5-5 5 5" />
            <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
        </div>

        <p className="font-display font-semibold text-ink">
          Click to upload
        </p>
        <p className="font-mono text-xs text-ink-faint mt-1">
          PDF · up to 5MB
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
        <div className="mt-4 flex items-center gap-3 bg-emerald/10 border border-emerald/30 rounded-xl px-4 py-3">
          <span className="text-emerald text-lg">✓</span>
          <p className="font-mono text-sm text-emerald truncate">
            {selectedFile.name}
          </p>
        </div>
      )}
    </div>
  );
}