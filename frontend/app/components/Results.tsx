import { motion } from "framer-motion";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

interface RequirementBreakdownItem {
  requirement: string;
  similarity: number;
  matched: boolean;
}

interface ResultsProps {
  atsScore: number;
  keywordScore?: number;
  semanticScore?: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  requirementBreakdown?: RequirementBreakdownItem[];
  recommendations: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const BAND = {
  strong: {
    label: "Strong Match",
    stamp: "CLEARED",
    hex: "#12b76a",
    chip: "bg-emerald/10 text-emerald border-emerald/25",
    stampColor: "border-emerald text-emerald",
  },
  moderate: {
    label: "Moderate Match",
    stamp: "REVIEW",
    hex: "#ffb020",
    chip: "bg-amber/15 text-amber-700 border-amber/30",
    stampColor: "border-amber text-amber-600",
  },
  low: {
    label: "Needs Work",
    stamp: "RESUBMIT",
    hex: "#f04438",
    chip: "bg-rose/10 text-rose border-rose/25",
    stampColor: "border-rose text-rose",
  },
};

export default function Results({
  atsScore,
  keywordScore,
  semanticScore,
  matchedKeywords,
  missingKeywords,
  requirementBreakdown,
  recommendations,
}: ResultsProps) {
  const band =
    atsScore >= 80 ? BAND.strong : atsScore >= 60 ? BAND.moderate : BAND.low;

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
      className="mt-16"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Score card */}

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="relative bg-surface border-2 border-border rounded-[28px] p-8 overflow-visible"
      >
        <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <div className="relative w-52 h-52 mx-auto">
            <CircularProgressbar
              value={atsScore}
              text={`${atsScore}%`}
              styles={buildStyles({
                pathColor: band.hex,
                textColor: "#1c1730",
                trailColor: "#f3f0ff",
                textSize: "17px",
              })}
            />

            <div
              className={`stamp-in absolute -top-3 -right-3 w-20 h-20 rounded-full border-4 border-dashed flex items-center justify-center bg-white/90 backdrop-blur-sm rotate-[-8deg] ${band.stampColor}`}
            >
              <span className="font-display font-extrabold text-[11px] tracking-wide text-center leading-tight">
                {band.stamp}
              </span>
            </div>
          </div>

          <div>
            <span className="font-mono text-xs text-ink-faint uppercase tracking-wide">
              ATS Compatibility
            </span>

            <h2 className="font-display text-3xl font-bold text-ink mt-1">
              {band.label}
            </h2>

            <p className="text-ink-muted text-sm mt-3 leading-relaxed max-w-md">
              This score reflects keyword coverage and semantic
              alignment between your resume and the job post.
            </p>

            {(keywordScore !== undefined || semanticScore !== undefined) && (
              <div className="flex gap-4 mt-6">
                {keywordScore !== undefined && (
                  <div className="bg-panel rounded-2xl px-5 py-3">
                    <p className="font-mono text-[10px] text-ink-faint uppercase tracking-wide">
                      Keyword
                    </p>
                    <p className="font-display text-2xl font-bold text-ink">
                      {keywordScore}%
                    </p>
                  </div>
                )}

                {semanticScore !== undefined && (
                  <div className="bg-panel rounded-2xl px-5 py-3">
                    <p className="font-mono text-[10px] text-ink-faint uppercase tracking-wide">
                      Semantic
                    </p>
                    <p className="font-display text-2xl font-bold text-ink">
                      {semanticScore}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Summary */}

      <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="perforate">
        <span className="font-mono text-xs text-ink-faint uppercase tracking-wide">
          The Verdict
        </span>
        <p className="text-ink text-base mt-2 leading-relaxed max-w-2xl">
          {summary}
        </p>
      </motion.div>

      {/* Skills */}

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="perforate grid md:grid-cols-2 gap-6"
      >
        <div className="bg-surface border-2 border-border rounded-[24px] p-6">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="font-display font-bold text-ink">
              ✅ Matched
            </h3>
            <span className="font-mono text-xs text-ink-faint ml-auto">
              {matchedKeywords.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="font-mono text-xs px-3 py-1.5 rounded-full bg-emerald/10 text-emerald border border-emerald/25"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-surface border-2 border-border rounded-[24px] p-6">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="font-display font-bold text-ink">
              ❌ Missing
            </h3>
            <span className="font-mono text-xs text-ink-faint ml-auto">
              {missingKeywords.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="font-mono text-xs px-3 py-1.5 rounded-full bg-rose/10 text-rose border border-rose/25"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Requirement breakdown */}

      {requirementBreakdown && requirementBreakdown.length > 0 && (
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="perforate bg-surface border-2 border-border rounded-[24px] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-ink">
              Line-by-Line Breakdown
            </h3>
            <span className="font-mono text-xs text-ink-faint">
              {requirementBreakdown.length} requirements
            </span>
          </div>

          <div className="space-y-2">
            {requirementBreakdown.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 rounded-2xl pl-4 pr-4 py-3 ${
                  item.matched ? "bg-emerald/5" : "bg-rose/5"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    item.matched ? "bg-emerald" : "bg-rose"
                  }`}
                />
                <p className="text-sm text-ink-muted flex-1">
                  {item.requirement}
                </p>
                <span
                  className={`font-mono text-sm font-semibold shrink-0 ${
                    item.matched ? "text-emerald" : "text-rose"
                  }`}
                >
                  {(item.similarity / 10).toFixed(1)}/10
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5 }}
        className="perforate bg-violet/5 border-2 border-violet/20 rounded-[24px] p-6"
      >
        <h3 className="font-display font-bold text-ink mb-5">
          🎯 What To Fix
        </h3>

        <div className="space-y-3">
          {recommendationList.map((recommendation, index) => (
            <div
              key={index}
              className="flex gap-4 bg-white border border-violet/15 rounded-2xl p-4"
            >
              <span className="font-display font-bold text-violet shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-ink-muted text-sm leading-relaxed">
                {recommendation}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}