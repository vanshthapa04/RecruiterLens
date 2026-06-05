interface ResultsProps {
    atsScore: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    recommendations: string;
  }
  
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
  
    const summary =
      atsScore >= 80
        ? "Your resume aligns strongly with the job description."
        : atsScore >= 60
        ? "Your resume matches several key requirements but still has room for improvement."
        : "Your resume is missing several important keywords from the job description.";
  
    return (
      <div className="mt-10 space-y-8">
  
        {/* ATS Score */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">
  
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ATS Compatibility Score
          </h2>
  
          <div
            className={`text-7xl font-extrabold ${scoreColor}`}
          >
            {atsScore}%
          </div>
  
          <p
            className={`mt-3 text-lg font-semibold ${scoreColor}`}
          >
            {scoreLabel}
          </p>
  
          <div className="w-full bg-gray-200 rounded-full h-4 mt-6">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-700"
              style={{
                width: `${atsScore}%`,
              }}
            />
          </div>
  
        </div>
  
        {/* Summary */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
  
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Resume Analysis Summary
          </h3>
  
          <p className="text-gray-700">
            {summary}
          </p>
  
        </div>
  
        {/* Skills */}
        <div className="grid md:grid-cols-2 gap-6">
  
          {/* Matched */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
  
            <h3 className="text-xl font-bold text-green-600 mb-4">
              ✅ Matched Skills
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
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
  
            <h3 className="text-xl font-bold text-red-600 mb-4">
              ❌ Missing Skills
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
  
        </div>
  
        {/* Recommendations */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6">
  
          <h3 className="text-xl font-bold text-blue-600 mb-4">
            🤖 AI Recommendations
          </h3>
  
          <div
            className="
            bg-blue-50
            border
            border-blue-200
            rounded-xl
            p-5
            whitespace-pre-wrap
            text-gray-700
            leading-relaxed
            "
          >
            {recommendations}
          </div>
  
        </div>
  
      </div>
    );
  }