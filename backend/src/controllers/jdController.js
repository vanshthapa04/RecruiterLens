const pool = require("../../config/db");

const {
  compareResumeWithJD,
} = require("../services/JdMatcherService");

const {
  generateRecommendations,
} = require("../services/aiService");

const analyzeJobDescription = async (
  req,
  res
) => {
  try {

    const {
      resumeId,
      jobDescription,
    } = req.body;

    const resumeResult =
      await pool.query(
        `
        SELECT *
        FROM analyses
        WHERE id = $1
        `,
        [resumeId]
      );

    if (
      resumeResult.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const resume =
      resumeResult.rows[0];

    const analysis =
      compareResumeWithJD(
        resume.extracted_text,
        jobDescription
      );

      const recommendations =
      await generateRecommendations({
        resumeText:
          resume.extracted_text,
    
        jobDescription,
    
        matchedSkills:
          analysis.matchedSkills,
    
        missingSkills:
          analysis.missingSkills,
      });
      console.log("Recommendations:");
      console.log(recommendations);
      console.log(typeof recommendations);

    res.status(200).json({
      success: true,

      resumeId,

      matchScore:
        analysis.score,

      matchedSkills:
        analysis.matchedSkills,

      missingSkills:
        analysis.missingSkills,

      recommendations,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Analysis failed",
    });

  }
};

module.exports = {
  analyzeJobDescription,
};