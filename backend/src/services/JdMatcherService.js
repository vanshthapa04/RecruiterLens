const skills = require('../constants/skills')
const compareResumeWithJD = (
    resumeText,
    jobDescription
  ) => {
  
    const resume = resumeText.toLowerCase();
    const jd = jobDescription.toLowerCase();
    const jdSkills = skills.filter(skill => jd.includes(skill.toLowerCase()));
    const matchedSkills = [];
    const missingSkills = [];
    jdSkills.forEach(skill => {
  
      if (resume.includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
  
    });
    const score = jdSkills.length === 0 ? 0 : Math.round(
        (matchedSkills.length / jdSkills.length) * 100
        );
  
    return {
      score,
      matchedSkills,
      missingSkills
    };
};
  
module.exports = {compareResumeWithJD}