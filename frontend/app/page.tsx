"use client";

import { useState } from "react";

import ResumeUpload from "./components/ResumeUpload";
import JobDescription from "./components/JobDescription";
import Results from "./components/Results";

import { analyzeResume } from "./services/api";

export default function Home() {
  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [result, setResult] = useState<any>(null);

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
    <main
      className="
      relative
      overflow-hidden
      min-h-screen
      bg-gradient-to-br
      from-sky-50
      via-indigo-50
      to-purple-100
      p-6
      md:p-10
      "
    >

      {/* Background Blobs */}

      <div
        className="
        absolute
        top-[-120px]
        left-[-120px]
        w-[400px]
        h-[400px]
        bg-blue-400/20
        rounded-full
        blur-3xl
        "
      />

      <div
        className="
        absolute
        top-[150px]
        right-[-100px]
        w-[350px]
        h-[350px]
        bg-purple-400/20
        rounded-full
        blur-3xl
        "
      />

      <div
        className="
        absolute
        bottom-[-100px]
        left-[30%]
        w-[350px]
        h-[350px]
        bg-cyan-400/20
        rounded-full
        blur-3xl
        "
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Hero */}

        <div className="text-center mb-12">

          <div
            className="
            inline-flex
            items-center
            px-5
            py-2
            rounded-full
            bg-white/80
            backdrop-blur-sm
            shadow-md
            text-blue-700
            font-medium
            mb-6
            "
          >
            🚀 AI-Powered ATS Resume Analyzer
          </div>

          <h1
            className="
            text-5xl
            md:text-6xl
            font-extrabold
            text-gray-900
            "
          >
            RecruiterLens
          </h1>

          <p
            className="
            text-lg
            md:text-xl
            text-gray-600
            mt-4
            max-w-3xl
            mx-auto
            "
          >
            Optimize your resume for ATS systems,
            identify missing skills, and improve
            your chances of landing interviews.
          </p>

        </div>

        {/* Feature Pills */}

        <div
          className="
          flex
          flex-wrap
          justify-center
          gap-4
          mb-12
          "
        >

          {[
            "✅ ATS Scoring",
            "🎯 Skill Matching",
            "📄 Resume Parsing",
            "🤖 AI Feedback",
          ].map((item) => (
            <div
              key={item}
              className="
              bg-white/80
              backdrop-blur-sm
              px-5
              py-3
              rounded-full
              shadow-md
              font-medium
              text-gray-700
              "
            >
              {item}
            </div>
          ))}

        </div>

        {/* Input Section */}

        <div className="grid lg:grid-cols-2 gap-8">

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

        {/* Analyze Button */}

        <div className="mt-10 text-center">

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            hover:from-blue-700
            hover:to-indigo-700
            disabled:bg-gray-400
            text-white
            font-semibold
            px-12
            py-4
            rounded-2xl
            shadow-lg
            transition-all
            duration-300
            hover:scale-105
            "
          >
            {loading
              ? "Analyzing..."
              : "Analyze Resume"}
          </button>

        </div>

        {/* Results */}

        {result && (
          <Results
            atsScore={result.atsScore}
            matchedKeywords={
              result.matchedKeywords
            }
            missingKeywords={
              result.missingKeywords
            }
            recommendations={
              result.recommendations
            }
          />
        )}

      </div>

    </main>
  );
}