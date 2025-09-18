import { Internship, InternshipMatch, UserProfile } from '../types/Internship';

export const findMatchingInternships = (
  internships: Internship[], 
  userProfile: UserProfile
): InternshipMatch[] => {
  if (!internships.length || !userProfile.skills.length) {
    return [];
  }

  // Convert user skills to lowercase for case-insensitive matching
  const userSkillsLower = userProfile.skills.map(skill => skill.toLowerCase());

  // Calculate skill matches for each internship
  const internshipMatches = internships.map(internship => {
    const requiredSkills = internship.skills_required;
    const matchedSkills: string[] = [];
    let matchCount = 0;

    requiredSkills.forEach(skill => {
      if (userSkillsLower.includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
        matchCount++;
      }
    });

    const matchPercentage = requiredSkills.length > 0 
      ? Math.round((matchCount / requiredSkills.length) * 100) 
      : 0;

    return {
      ...internship,
      matchedSkills,
      matchCount,
      totalSkills: requiredSkills.length,
      matchPercentage
    } as InternshipMatch;
  });

  // Filter internships with at least one skill match and sort by match quality
  return internshipMatches
    .filter(internship => internship.matchCount > 0)
    .sort((a, b) => {
      // Primary sort: by match count (descending)
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      // Secondary sort: by match percentage (descending)
      return b.matchPercentage - a.matchPercentage;
    });
};

export const getSuggestedSkills = (
  internships: Internship[], 
  userProfile: UserProfile
): Array<{ skill: string; count: number }> => {
  if (!internships.length) {
    return [];
  }

  const userSkillsLower = new Set(
    userProfile.skills.map(skill => skill.toLowerCase())
  );
  
  // Count how many internships require each skill
  const skillCounts: Record<string, number> = {};

  internships.forEach(internship => {
    internship.skills_required.forEach(skill => {
      const skillLower = skill.toLowerCase();
      
      // Only count skills the user doesn't have
      if (!userSkillsLower.has(skillLower)) {
        if (!skillCounts[skill]) {
          skillCounts[skill] = 0;
        }
        skillCounts[skill]++;
      }
    });
  });

  // Return top skills sorted by demand
  return Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
};