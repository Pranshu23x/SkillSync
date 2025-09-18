export interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  skills_required: string[];
  score_range: [number, number];
  category: string;
  description: string;
}

export interface InternshipMatch extends Internship {
  matchedSkills: string[];
  matchCount: number;
  totalSkills: number;
  matchPercentage: number;
}

export interface UserProfile {
  education: string;
  skills: string[];
  sectorInterests: string[];
  location: string;
}