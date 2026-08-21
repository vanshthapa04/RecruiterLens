const pool = require('../../config/db');
const path = require('path');
const fs = require("fs");

const { extractTextFromPDF } = require('../services/pdfService');

const {
  calculateAtsScore,
  combineScores,
} = require('../services/atsService');

const {
  generateRecommendations,
} = require('../services/aiService');

const {
  calculateSemanticScore,
} = require('../services/semanticService');

const {
  rewriteResume,
} = require('../services/resumeRewriteService');

const uploadResume = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'File upload failed',
      });
    }

    const filePath = path.join(
      process.cwd(),
      'uploads',
      file.filename
    );

    const extractedText =
  await extractTextFromPDF(filePath);


fs.unlink(filePath, (err) => {
  if (err) {
    console.error(
      "File delete error:",
      err
    );
  }
});

const jobDescription =
  req.body.jobDescription || '';

    const atsResult =
      calculateAtsScore(
        extractedText,
        jobDescription
      );

    let semanticScore = null;
    let requirementBreakdown = [];

    try {
      const semanticResult =
        await calculateSemanticScore(
          extractedText,
          jobDescription
        );

      semanticScore = semanticResult.semanticScore;
      requirementBreakdown = semanticResult.requirementBreakdown;
    } catch (semanticError) {
      console.error(
        'Semantic scoring failed, falling back to keyword score only:',
        semanticError
      );

      semanticScore = atsResult.score;
      requirementBreakdown = [];
    }

    const finalScore = combineScores(
      atsResult.score,
      semanticScore
    );

    const recommendations =
      await generateRecommendations({
        resumeText: extractedText,
        jobDescription,
        matchedSkills:
          atsResult.matchedKeywords,
        missingSkills:
          atsResult.missingKeywords,
      });

    console.log(
      'AI Recommendations:',
      recommendations
    );

    const result = await pool.query(
      `
      INSERT INTO analyses
      (
        file_name,
        extracted_text,
        ats_score,
        missing_keywords
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        file.filename,
        extractedText,
        finalScore,
        atsResult.missingKeywords.join(', '),
      ]
    );

    res.status(201).json({
      success: true,

      atsScore:
        finalScore,

      keywordScore:
        atsResult.score,

      semanticScore,

      matchedKeywords:
        atsResult.matchedKeywords,

      missingKeywords:
        atsResult.missingKeywords,

      requirementBreakdown,

      recommendations,

      data:
        result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Upload failed',
    });

  }
};

const rewriteResumeHandler = async (req, res) => {
  try {
    const { resumeText, jobDescription, missingKeywords } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'resumeText and jobDescription are required',
      });
    }

    const resume = await rewriteResume({
      resumeText,
      jobDescription,
      missingKeywords: missingKeywords || [],
    });

    res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Resume rewrite failed',
    });

  }
};

module.exports = {
  uploadResume,
  rewriteResumeHandler,
};