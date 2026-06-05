import { motion } from "framer-motion";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

interface ResultsProps {
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendations: string;
}

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function Results({
  atsScore,
  matchedKeywords,
  missingKeywords,
  recommendations,
}: ResultsProps) {
  const scoreColor =
    atsScore >= 80
      ? "text-green-600"
      : atsScore >= 60
      ? "text-yellow-500"
      : "text-red-500";

  const scoreLabel =
    atsScore >= 80
      ? "Strong Match"
      : atsScore >= 60
      ? "Moderate Match"
      : "Needs Improvement";

  const riskLabel =
    atsScore >= 80
      ? "ATS Friendly"
      : atsScore >= 60
      ? "Moderate Risk"
      : "High Risk";

  const riskColor =
    atsScore >= 80
      ? "bg-green-100 text-green-700"
      : atsScore >= 60
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  const summary =
    atsScore >= 80
      ? "Your resume aligns strongly with the job description."
      : atsScore >= 60
      ? "Your resume matches several key requirements but still has room for improvement."
      : "Your resume is missing several important keywords from the job description.";

  const recommendationList = recommendations
    .split("\n")
    .filter((item) => item.trim() !== "");

  return (
    <motion.div
      className="mt-10 space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* ATS Score */}

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="
        bg-white/90
        backdrop-blur-sm
        rounded-3xl
        shadow-lg
        p-8
        "
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <div className="w-64 h-64">
              <CircularProgressbar
                value={atsScore}
                text={`${atsScore}%`}
                styles={buildStyles({
                  pathColor:
                    atsScore >= 80
                      ? "#16a34a"
                      : atsScore >= 60
                      ? "#f59e0b"
                      : "#ef4444",

                  textColor: "#111827",

                  trailColor: "#e5e7eb",

                  textSize: "16px",
                })}
              />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              ATS Compatibility Score
            </h2>

            <p
              className={`text-xl font-semibold ${scoreColor}`}
            >
              {scoreLabel}
            </p>

            <div className="mt-4">
              <span
                className={`
                px-3
                py-1
                rounded-full
                text-sm
                font-medium
                ${riskColor}
                `}
              >
                {riskLabel}
              </span>
            </div>

            <p className="text-gray-600 mt-4 leading-relaxed">
              This score indicates how closely
              your resume matches the job
              description based on keywords,
              skills, and ATS relevance.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary */}

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="
        bg-white/90
        backdrop-blur-sm
        rounded-2xl
        shadow-lg
        p-6
        "
      >
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Resume Analysis Summary
        </h3>

        <p className="text-gray-700">
          {summary}
        </p>
      </motion.div>

      {/* Skills */}

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Matched */}

        <div
          className="
          bg-white/90
          backdrop-blur-sm
          rounded-2xl
          shadow-lg
          p-6
          "
        >
          <h3 className="text-xl font-bold text-green-600 mb-4">
            ✅ Matched Skills ({matchedKeywords.length})
          </h3>

          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map(
              (keyword, index) => (
                <span
                  key={index}
                  className="
                  bg-green-100
                  text-green-800
                  px-3
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                  "
                >
                  {keyword}
                </span>
              )
            )}
          </div>
        </div>

        {/* Missing */}

        <div
          className="
          bg-white/90
          backdrop-blur-sm
          rounded-2xl
          shadow-lg
          p-6
          "
        >
          <h3 className="text-xl font-bold text-red-600 mb-4">
            ❌ Missing Skills ({missingKeywords.length})
          </h3>

          <div className="flex flex-wrap gap-2">
            {missingKeywords.map(
              (keyword, index) => (
                <span
                  key={index}
                  className="
                  bg-red-100
                  text-red-800
                  px-3
                  py-2
                  rounded-full
                  text-sm
                  font-medium
                  "
                >
                  {keyword}
                </span>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="
        bg-white/90
        backdrop-blur-sm
        rounded-2xl
        shadow-lg
        p-6
        "
      >
        <h3 className="text-xl font-bold text-blue-600 mb-6">
          🤖 AI Recommendations
        </h3>

        <div className="grid gap-4">
          {recommendationList.map(
            (recommendation, index) => (
              <div
                key={index}
                className="
                flex
                items-start
                gap-3
                bg-blue-50
                border
                border-blue-200
                rounded-xl
                p-4
                hover:shadow-md
                transition-all
                "
              >
                <div
                  className="
                  min-w-8
                  w-8
                  h-8
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  items-center
                  justify-center
                  font-bold
                  "
                >
                  ✓
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {recommendation}
                </p>
              </div>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}