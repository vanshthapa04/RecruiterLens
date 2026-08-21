"use client";

import { useState } from "react";

import ResumeUpload from "./components/ResumeUpload";
import JobDescription from "./components/JobDescription";
import Results from "./components/Results";

import { analyzeResume } from "./services/api";

interface RequirementBreakdownItem {
  requirement: string;
  similarity: number;
  matched: boolean;
}

interface AnalysisResult {
  atsScore: number;
  keywordScore: number;
  semanticScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  requirementBreakdown: RequirementBreakdownItem[];
  recommendations: string;
  data: any;
}

export default function Home() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload a resume");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please paste a job description");
      return;
    }

    try {
      setLoading(true);

      const data = await analyzeResume(
        selectedFile,
        jobDescription
      );

      setResult(data);

    } catch (error) {

      console.error(error);

      alert("Analysis failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="min-h-screen bg-canvas">
      <header className="border-b-2 border-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet rotate-[-6deg] flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm rotate-[6deg]">
                R
              </span>
            </div>
            <span className="font-display font-bold text-ink">
              RecruiterLens
            </span>
          </div>

          <span className="font-mono text-[11px] text-ink-faint hidden sm:block">
            your resume, screened before they see it
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">

        <section className="pt-16 pb-12 text-center">
          <span className="inline-block font-mono text-xs px-3 py-1.5 rounded-full bg-amber/15 text-amber-700 mb-5">
            🎟️ every application is a ticket — let's punch it
          </span>

          <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-[1.1] max-w-3xl mx-auto">
            Will your resume make it{" "}
            <span className="text-violet">past the bot?</span>
          </h1>

          <p className="text-ink-muted text-lg mt-5 max-w-xl mx-auto leading-relaxed">
            Upload your resume and the job post — get a
            requirement-by-requirement breakdown, not just a score.
          </p>
        </section>

        <div className="grid lg:grid-cols-2 gap-6">
          <ResumeUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />

          <JobDescription
            jobDescription={jobDescription}
            setJobDescription={
              setJobDescription
            }
          />
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="
            group inline-flex items-center gap-3
            bg-violet text-white
            disabled:bg-ink-faint disabled:cursor-not-allowed
            font-display font-semibold
            px-9 py-4 rounded-2xl
            shadow-[0_4px_0_0_var(--color-violet-dark)]
            enabled:hover:translate-y-[2px] enabled:hover:shadow-[0_2px_0_0_var(--color-violet-dark)]
            active:translate-y-[4px] active:shadow-none
            transition-all duration-150
            focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet/30
            "
          >
            {loading ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Scanning your resume
              </>
            ) : (
              <>
                Punch My Ticket
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </>
            )}
          </button>
        </div>

        {result && (
          <Results
          resumeText={result.data.extracted_text}
          jobDescription={jobDescription}
            atsScore={result.atsScore}
            keywordScore={result.keywordScore}
            semanticScore={result.semanticScore}
            matchedKeywords={
              result.matchedKeywords
            }
            missingKeywords={
              result.missingKeywords
            }
            requirementBreakdown={
              result.requirementBreakdown
            }
            recommendations={
              result.recommendations
            }
          />
        )}

        <footer className="py-16 mt-10 text-center">
          <p className="font-mono text-xs text-ink-faint">
            RecruiterLens — built by Vansh Thapa
          </p>
        </footer>

      </div>
    </main>
  );
}