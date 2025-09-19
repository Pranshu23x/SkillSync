export type Language = 'en' | 'hi';

export type TranslationKey = 
  | 'title'
  | 'subtitle'
  | 'uploadTitle'
  | 'uploadSubtitle'
  | 'chooseFile'
  | 'analyzing'
  | 'analyzingDesc'
  | 'analysisTitle'
  | 'overallRating'
  | 'strengths'
  | 'weaknesses'
  | 'suggestions'
  | 'recommendedTitle'
  | 'matchPercentage'
  | 'yourMatchingSkills'
  | 'allRequiredSkills'
  | 'skillsToBoostTitle'
  | 'internships'
  | 'internship'
  | 'proTip'
  | 'proTipDesc';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en: {
    title: 'SkillSync ⚡',
    subtitle: 'Al-Based Internship Recommendation Engine for PM Internship Scheme',
    uploadTitle: 'Upload Your Resume',
    uploadSubtitle: 'Drag it or drop it (Cuz its the best 🔥)',
    chooseFile: "Choose Your Resume (ONLY PDF)",
    analyzing: 'Analyzing Resume...',
    analyzingDesc: 'Our system is analyzing your resume and finding best matches for PM Internship Scheme..',
    analysisTitle: 'Resume Analysis',
    overallRating: 'Overall Rating',
    strengths: 'Strengths',
    weaknesses: 'Areas for Improvement',
    suggestions: 'Suggestions',
    recommendedTitle: 'Recommended Internships',
    matchPercentage: 'Match',
    yourMatchingSkills: 'Your matching skills:',
    allRequiredSkills: 'All required skills:',
    skillsToBoostTitle: 'Skills to Boost Your Profile',
    internships: 'internships',
    internship: 'internship',
    proTip: 'Pro Tip',
    proTipDesc: 'Learning these skills will significantly increase your internship opportunities!'
  },
  hi: {
    title: 'रिज्यूमे विश्लेषक',
    subtitle: 'AI-संचालित रिज्यूमे विश्लेषण और इंटर्नशिप मैचिंग',
    uploadTitle: 'अपना रिज्यूमे अपलोड करें',
    uploadSubtitle: 'अपना PDF रिज्यूमे यहाँ खींचें और छोड़ें या ब्राउज़ करने के लिए क्लिक करें',
    chooseFile: 'फ़ाइल चुनें',
    analyzing: 'रिज्यूमे का विश्लेषण कर रहे हैं...',
    analyzingDesc: 'हमारा AI आपके रिज्यूमे का विश्लेषण कर रहा है और सबसे अच्छे मैच खोज रहा है',
    analysisTitle: 'रिज्यूमे विश्लेषण',
    overallRating: 'समग्र रेटिंग',
    strengths: 'शक्तियाँ',
    weaknesses: 'सुधार के क्षेत्र',
    suggestions: 'सुझाव',
    recommendedTitle: 'अनुशंसित इंटर्नशिप',
    matchPercentage: 'मैच',
    yourMatchingSkills: 'आपके मैचिंग कौशल:',
    allRequiredSkills: 'सभी आवश्यक कौशल:',
    skillsToBoostTitle: 'आपकी प्रोफ़ाइल को बढ़ावा देने के लिए कौशल',
    internships: 'इंटर्नशिप',
    internship: 'इंटर्नशिप',
    proTip: 'प्रो टिप',
    proTipDesc: 'इन कौशलों को सीखना आपके इंटर्नशिप के अवसरों को काफी बढ़ाएगा!'
  }
};
