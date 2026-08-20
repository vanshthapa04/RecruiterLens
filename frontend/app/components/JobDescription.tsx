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
    <div className="bg-surface border-2 border-border rounded-[28px] p-7 h-full flex flex-col shadow-[0_2px_0_0_var(--color-border)]">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-display font-bold text-ink text-xl">
          The Job Post
        </h2>
        <span className="font-mono text-[11px] px-2 py-1 rounded-full bg-coral/10 text-coral">
          02
        </span>
      </div>

      <p className="text-ink-muted text-sm mb-6">
        Paste the full posting so we catch every requirement.
      </p>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the complete job description here..."
        className="
        flex-1 w-full resize-none
        bg-panel
        rounded-2xl border-2 border-border
        p-4
        text-ink text-sm leading-relaxed
        placeholder:text-ink-faint
        focus:outline-none focus:border-violet focus:bg-panel
        transition-colors
        "
      />

      <div className="flex justify-between mt-3 font-mono text-xs text-ink-faint">
        <span>Requirements, responsibilities, all of it</span>
        <span>{jobDescription.length} chars</span>
      </div>
    </div>
  );
}