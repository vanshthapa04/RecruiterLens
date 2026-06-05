const pool = require('../../config/db');
const path = require('path');

const { extractTextFromPDF } = require('../services/pdfService');

const {
  calculateAtsScore,
} = require('../services/atsService');

const {
  generateRecommendations,
} = require('../services/aiService');

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

    const jobDescription =
      req.body.jobDescription || '';

    const atsResult =
      calculateAtsScore(
        extractedText,
        jobDescription
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
        atsResult.score,
        atsResult.missingKeywords.join(', '),
      ]
    );

    res.status(201).json({
      success: true,

      atsScore:
        atsResult.score,

      matchedKeywords:
        atsResult.matchedKeywords,

      missingKeywords:
        atsResult.missingKeywords,

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

module.exports = {
  uploadResume,
};