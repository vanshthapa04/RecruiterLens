const generateRecommendations = (matchedSkills,missingSkills) => {
  
    const recommendations = [];
    if (missingSkills.includes("aws")) {
      recommendations.push(
        "Consider adding cloud projects using AWS."
      );
    }
    if (missingSkills.includes("docker")) {
      recommendations.push(
        "Learn Docker and mention containerization experience."
      );
    }
    if (missingSkills.includes("kubernetes")) {
      recommendations.push(
        "Understanding Kubernetes can strengthen DevOps skills."
      );
    }
    if (missingSkills.includes("react")) {
      recommendations.push(
        "Add React projects to improve frontend profile."
      );
    }
    if (missingSkills.includes("node.js")) {
      recommendations.push(
        "Add backend projects using Node.js and Express."
      );
    }
    if (recommendations.length === 0) {
      recommendations.push(
        "Your resume aligns well with the job description."
      );
    }
  
    return recommendations;
  };
  
module.exports = {
    generateRecommendations,
};