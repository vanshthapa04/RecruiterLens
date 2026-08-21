"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import { rewriteResume } from "../services/api";

interface SkillGroup {
  category: string;
  items: string[];
}

interface ProjectEntry {
  title: string;
  meta: string;
  bullets: string[];
}

interface ExperienceEntry {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
}

interface EducationEntry {
  degree: string;
  institution: string;
  dates: string;
  details: string;
}

interface StructuredResume {
  name: string;
  title: string;
  contact: string;
  summary: string;
  skills: SkillGroup[];
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: string[];
}

export default function RewritePage() {
  const router = useRouter();
  const [resume, setResume] = useState<StructuredResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const run = async () => {
      const stored = sessionStorage.getItem("rewriteInput");

      if (!stored) {
        setError(true);
        setLoading(false);
        return;
      }

      const { resumeText, jobDescription, missingKeywords } =
        JSON.parse(stored);

      try {
        const data = await rewriteResume(
          resumeText,
          jobDescription,
          missingKeywords
        );

        if (data.success) {
          setResume(data.resume);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const flattenToText = (r: StructuredResume) => {
    const lines: string[] = [];

    lines.push(r.name, r.title, r.contact, "");
    lines.push("PROFESSIONAL SUMMARY", r.summary, "");

    if (r.skills?.length) {
      lines.push("TECHNICAL SKILLS");
      r.skills.forEach((s) => lines.push(`${s.category}: ${s.items.join(", ")}`));
      lines.push("");
    }

    if (r.projects?.length) {
      lines.push("PROJECTS");
      r.projects.forEach((p) => {
        lines.push(`${p.title} — ${p.meta}`);
        p.bullets.forEach((b) => lines.push(`• ${b}`));
      });
      lines.push("");
    }

    if (r.experience?.length) {
      lines.push("EXPERIENCE");
      r.experience.forEach((e) => {
        lines.push(`${e.title}, ${e.company} — ${e.dates}`);
        e.bullets.forEach((b) => lines.push(`• ${b}`));
      });
      lines.push("");
    }

    if (r.education?.length) {
      lines.push("EDUCATION");
      r.education.forEach((ed) => {
        lines.push(`${ed.degree}, ${ed.institution} — ${ed.dates}`);
        if (ed.details) lines.push(ed.details);
      });
      lines.push("");
    }

    if (r.certifications?.length) {
      lines.push("CERTIFICATIONS");
      r.certifications.forEach((c) => lines.push(`• ${c}`));
    }

    return lines.join("\n");
  };

  const handleCopy = () => {
    if (!resume) return;
    navigator.clipboard.writeText(flattenToText(resume));
  };

  const handleDownload = () => {
    if (!resume) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const base = {
      margin: 46,
      nameSize: 18,
      titleSize: 11,
      contactSize: 9,
      sectionSize: 11,
      bodySize: 9.5,
      metaSize: 8.5,
      bulletSize: 9.5,
      lineGap: 3,
      sectionGapBefore: 10,
      sectionGapAfter: 14,
      blockGap: 4,
      bulletLineHeight: 13,
    };

    const runLayout = (scale: number, draw: boolean) => {
      const margin = base.margin;
      const usableWidth = pageWidth - margin * 2;
      let y = margin;
      let maxY = margin;

      const advance = (amount: number) => {
        y += amount;
        maxY = Math.max(maxY, y);
      };

      const setFont = (size: number, bold: boolean, color: number[]) => {
        if (!draw) return;
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size * scale);
        doc.setTextColor(color[0], color[1], color[2]);
      };

      const wrappedLineCount = (text: string, size: number, width: number) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(size * scale);
        return doc.splitTextToSize(text, width).length;
      };

      const addSectionHeader = (label: string) => {
        advance(base.sectionGapBefore * scale);
        setFont(base.sectionSize, true, [30, 30, 30]);
        if (draw) doc.text(label.toUpperCase(), margin, y);
        advance(4 * scale);
        if (draw) {
          doc.setDrawColor(180, 180, 180);
          doc.setLineWidth(0.75);
          doc.line(margin, y, pageWidth - margin, y);
        }
        advance(base.sectionGapAfter * scale);
      };

      const addWrapped = (
        text: string,
        size: number,
        bold: boolean,
        color: number[],
        gap: number
      ) => {
        const lineCount = wrappedLineCount(text, size, usableWidth);
        setFont(size, bold, color);
        const lines = draw ? doc.splitTextToSize(text, usableWidth) : [];
        for (let i = 0; i < lineCount; i++) {
          if (draw) doc.text(lines[i], margin, y);
          advance((size + base.lineGap) * scale);
        }
        advance(gap * scale);
      };

      const addBullets = (bullets: string[]) => {
        setFont(base.bulletSize, false, [60, 60, 60]);
        bullets.forEach((b) => {
          const lineCount = wrappedLineCount(b, base.bulletSize, usableWidth - 14);
          const lines = draw
            ? doc.splitTextToSize(b, usableWidth - 14)
            : [];
          for (let i = 0; i < lineCount; i++) {
            if (draw) {
              doc.text(
                i === 0 ? `•  ${lines[i]}` : `   ${lines[i]}`,
                margin,
                y
              );
            }
            advance(base.bulletLineHeight * scale);
          }
        });
        advance(4 * scale);
      };

      // Header
      setFont(base.nameSize, true, [20, 20, 20]);
      if (draw) doc.text(resume!.name, margin, y);
      advance(base.nameSize * scale + 2 * scale);

      setFont(base.titleSize, false, [90, 90, 90]);
      if (draw) doc.text(resume!.title, margin, y);
      advance(base.titleSize * scale + 5 * scale);

      addWrapped(resume!.contact, base.contactSize, false, [110, 110, 110], 6);

      if (draw) {
        doc.setDrawColor(140, 140, 140);
        doc.setLineWidth(1);
        doc.line(margin, y, pageWidth - margin, y);
      }
      advance(4 * scale);

      addSectionHeader("Professional Summary");
      addWrapped(resume!.summary, base.bodySize, false, [60, 60, 60], 4);

      if (resume!.skills?.length) {
        addSectionHeader("Technical Skills");
        resume!.skills.forEach((s) => {
          addWrapped(
            `${s.category}: ${s.items.join(", ")}`,
            base.bodySize,
            false,
            [60, 60, 60],
            2
          );
        });
      }

      if (resume!.projects?.length) {
        addSectionHeader("Projects");
        resume!.projects.forEach((p) => {
          setFont(10, true, [30, 30, 30]);
          if (draw) doc.text(p.title, margin, y);
          advance(12 * scale);
          addWrapped(p.meta, base.metaSize, false, [130, 130, 130], 4);
          addBullets(p.bullets);
        });
      }

      if (resume!.experience?.length) {
        addSectionHeader("Experience");
        resume!.experience.forEach((e) => {
          setFont(10, true, [30, 30, 30]);
          if (draw) doc.text(`${e.title} — ${e.company}`, margin, y);
          advance(12 * scale);
          addWrapped(e.dates, base.metaSize, false, [130, 130, 130], 4);
          addBullets(e.bullets);
        });
      }

      if (resume!.education?.length) {
        addSectionHeader("Education");
        resume!.education.forEach((ed) => {
          setFont(10, true, [30, 30, 30]);
          if (draw) doc.text(`${ed.degree} — ${ed.institution}`, margin, y);
          advance(12 * scale);
          addWrapped(ed.dates, base.metaSize, false, [130, 130, 130], 2);
          if (ed.details) {
            addWrapped(ed.details, base.bodySize, false, [60, 60, 60], 4);
          }
        });
      }

      if (resume!.certifications?.length) {
        addSectionHeader("Certifications");
        addBullets(resume!.certifications);
      }

      return maxY;
    };

    // --- Fit-to-one-page via binary search on scale ---
    const availableHeight = pageHeight - base.margin;
    const minScale = 0.62;

    const fits = (scale: number) => runLayout(scale, false) <= availableHeight;

    let finalScale: number;

    if (fits(1)) {
      finalScale = 1;
    } else if (!fits(minScale)) {
      // Even smallest allowed scale overflows — use the floor anyway
      finalScale = minScale;
    } else {
      let low = minScale;
      let high = 1;

      // 30 iterations gives ~1e-9 precision — far more than needed,
      // but cheap since each check is just a measure pass
      for (let i = 0; i < 30; i++) {
        const mid = (low + high) / 2;
        if (fits(mid)) {
          low = mid;
        } else {
          high = mid;
        }
      }

      finalScale = low;
    }

    runLayout(finalScale, true);

    doc.save(`${resume.name.replace(/\s+/g, "-")}-resume.pdf`);
  };

  return (
    <main className="min-h-screen bg-canvas">
      <header className="border-b-2 border-border">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="font-mono text-xs text-ink-faint hover:text-ink transition-colors"
          >
            ← Back
          </button>

          <span className="font-display font-bold text-ink">
            Rewritten Resume
          </span>

          <span className="w-12" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {loading && (
          <div className="text-center py-20">
            <span className="w-8 h-8 inline-block rounded-full border-2 border-violet/30 border-t-violet animate-spin mb-4" />
            <p className="font-mono text-sm text-ink-faint mt-4">
              Rewriting your resume against the job post...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-20">
            <p className="font-display text-xl text-ink mb-2">
              Something went wrong
            </p>
            <p className="text-ink-muted text-sm mb-6">
              The AI model is temporarily busy. This usually clears up in a
              minute — try again, or head back and re-run the analysis.
            </p>
            <button
              onClick={() => router.push("/")}
              className="font-mono text-xs px-5 py-2.5 rounded-lg bg-violet text-white"
            >
              Go back
            </button>
          </div>
        )}

        {!loading && !error && resume && (
          <>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <p className="text-ink-muted text-sm max-w-md">
                Rewritten using only what was already on your resume — nothing
                fabricated, just sharper wording and better alignment.
              </p>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleCopy}
                  className="font-mono text-xs px-4 py-2 rounded-lg border-2 border-border text-ink hover:border-violet/50 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="font-mono text-xs px-4 py-2 rounded-lg bg-violet text-white"
                >
                  Download PDF
                </button>
              </div>
            </div>

            <div className="bg-white text-[#1c1c1c] rounded-2xl shadow-2xl p-10 sm:p-14">
              <h1 className="text-2xl font-bold">{resume.name}</h1>
              <p className="text-[#555] mt-1">{resume.title}</p>
              <p className="text-[#777] text-xs mt-2 leading-relaxed">
                {resume.contact}
              </p>

              <hr className="my-5 border-[#ccc]" />

              <section className="mb-6">
                <h2 className="text-xs font-bold tracking-wide uppercase border-b border-[#ccc] pb-1 mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm leading-relaxed text-[#333]">
                  {resume.summary}
                </p>
              </section>

              {resume.skills?.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-xs font-bold tracking-wide uppercase border-b border-[#ccc] pb-1 mb-2">
                    Technical Skills
                  </h2>
                  {resume.skills.map((s, i) => (
                    <p key={i} className="text-sm text-[#333] mb-1">
                      <span className="font-semibold">{s.category}:</span>{" "}
                      {s.items.join(", ")}
                    </p>
                  ))}
                </section>
              )}

              {resume.projects?.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-xs font-bold tracking-wide uppercase border-b border-[#ccc] pb-1 mb-2">
                    Projects
                  </h2>
                  {resume.projects.map((p, i) => (
                    <div key={i} className="mb-4 last:mb-0">
                      <p className="text-sm font-semibold">{p.title}</p>
                      <p className="text-xs text-[#888] mb-1">{p.meta}</p>
                      <ul className="list-disc list-inside text-sm text-[#333] space-y-0.5">
                        {p.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {resume.experience?.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-xs font-bold tracking-wide uppercase border-b border-[#ccc] pb-1 mb-2">
                    Experience
                  </h2>
                  {resume.experience.map((e, i) => (
                    <div key={i} className="mb-4 last:mb-0">
                      <p className="text-sm font-semibold">
                        {e.title} — {e.company}
                      </p>
                      <p className="text-xs text-[#888] mb-1">{e.dates}</p>
                      <ul className="list-disc list-inside text-sm text-[#333] space-y-0.5">
                        {e.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {resume.education?.length > 0 && (
                <section className="mb-6">
                  <h2 className="text-xs font-bold tracking-wide uppercase border-b border-[#ccc] pb-1 mb-2">
                    Education
                  </h2>
                  {resume.education.map((ed, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <p className="text-sm font-semibold">
                        {ed.degree} — {ed.institution}
                      </p>
                      <p className="text-xs text-[#888]">{ed.dates}</p>
                      {ed.details && (
                        <p className="text-sm text-[#333] mt-0.5">
                          {ed.details}
                        </p>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {resume.certifications?.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold tracking-wide uppercase border-b border-[#ccc] pb-1 mb-2">
                    Certifications
                  </h2>
                  <ul className="list-disc list-inside text-sm text-[#333] space-y-0.5">
                    {resume.certifications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}