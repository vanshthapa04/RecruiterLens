const skillAliases = require('../constants/skillsAliases')
const containsSkill = (text, aliases) => {
    return aliases.some((alias) => {
      const escapedAlias = alias.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
  
      const pattern = new RegExp(
        `\\b${escapedAlias}\\b`,
        "i"
      );
  
      return pattern.test(text);
    });
  };
const calculateAtsScore = (
    resumeText,
    jobDescription
  ) => {
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
  
    const commonSkills = [
        
        "javascript",
        "typescript",
        "python",
        "java",
        "c",
        "c++",
        "c#",
        "go",
        "rust",
        "php",
        "ruby",
        "kotlin",
        "swift",
        "react",
        "next.js",
        "vue",
        "angular",
        "html",
        "css",
        "tailwind",
        "bootstrap",
        "redux",
        "material ui",
        "node.js",
        "express",
        "nestjs",
        "django",
        "flask",
        "spring boot",
        "laravel",
        "fastapi",
        "sql",
        "mysql",
        "postgresql",
        "mongodb",
        "redis",
        "sqlite",
        "oracle",
        "firebase",
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "jenkins",
        "terraform",
        "github actions",
        "ci/cd",
        "pandas",
        "numpy",
        "matplotlib",
        "seaborn",
        "scikit-learn",
        "tensorflow",
        "pytorch",
        "machine learning",
        "deep learning",
        "nlp",
        "computer vision",
        "statistics",
        "data analysis",
        "data visualization",
        "power bi",
        "tableau",
        "excel",
        "google sheets",
        "hadoop",
        "spark",
        "kafka",
        "airflow",
        "etl",
        "data warehousing",
        "rest api",
        "graphql",
        "git",
        "github",
        "gitlab",
        "bitbucket",
        "jest",
        "mocha",
        "chai",
        "cypress",
        "selenium",
        "react native",
        "flutter",
        "android",
        "ios",
        "oauth",
        "jwt",
        "cybersecurity",
        "problem solving",
        "communication",
        "teamwork",
        "leadership",
        "agile",
        "scrum",
    ];
    const jdKeywords = commonSkills.filter((skill) =>
      jd.includes(skill)
    );
  
    const matchedKeywords = [];
    const missingKeywords = [];
  
    jdKeywords.forEach((keyword) => {
        const aliases =
          skillAliases[keyword] || [keyword];
      
        if (containsSkill(resume, aliases)) {
          matchedKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      });
  
    const score =
      jdKeywords.length === 0
        ? 0
        : Math.round(
            (matchedKeywords.length /
              jdKeywords.length) *
              100
          );
  
    return {
      score,
      matchedKeywords,
      missingKeywords,
    };
  };
  
  const generateRecommendations = (
    matchedSkills,
    missingSkills
  ) => {
    const recommendations = [];
  
    missingSkills.forEach((skill) => {
      recommendations.push(
        `Consider adding projects or experience involving ${skill}.`
      );
    });
  
    if (recommendations.length === 0) {
      recommendations.push(
        "Your resume aligns very well with this job description."
      );
    }
  
    return recommendations;
  };
  const combineScores = (keywordScore, semanticScore) => {
    return Math.round(keywordScore * 0.4 + semanticScore * 0.6);
  };
  
  module.exports = {
    calculateAtsScore,
    generateRecommendations,
    combineScores,
};