import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Brain, Target, Languages } from 'lucide-react';
import { translations, Language, TranslationKey } from './translations';

interface Internship {
  id: number;
  title: string;
  company: string;
  location: string;
  skills_required: string[];
  score_range: [number, number];
  category: string;
  description: string;
}

interface InternshipMatch extends Internship {
  matchedSkills: string[];
  matchCount: number;
  totalSkills: number;
  matchPercentage: number;
}

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<InternshipMatch[]>([]);
  const [skillsToGain, setSkillsToGain] = useState<Array<{ skill: string; count: number }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: TranslationKey): string => translations[language][key];

  // Load internships data
  useEffect(() => {
    fetch('/thing.json')
      .then(res => res.json())
      .then(data => setInternships(data))
      .catch(err => console.error('Error loading internships:', err));
  }, []);

  // Configure PDF.js worker
  useEffect(() => {
    if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.13.216/pdf.worker.min.js';
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    setRecommendations([]);
    setSkillsToGain([]);

    try {
      // Extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
      
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ');
      }
      
      setResumeText(text);
      
      // Send to Gemini AI
      await sendToGemini(text);
      
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Failed to process PDF file');
      setIsAnalyzing(false);
    }
  };

  const sendToGemini = async (resumeText: string) => {
    const apiKey = "AIzaSyBpl2jIVgdaKfHM6Hzniwr_HTVhX2_bD5A";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const promptText = `You are a professional resume expert. Analyze the following resume text carefully and provide specific, personalized feedback based on the actual content.

Respond with a JSON object ONLY (no additional commentary or text) that follows this structure:

{
  "overall_rating": number,  // Rate 0-10 based on actual resume content, experience level, skills mentioned
  "strengths": [
    "Specific strength based on resume content",
    "Another specific strength from the resume"
  ],
  "weaknesses": [
    "Specific weakness identified in the resume",
    "Another area for improvement"
  ],
  "suggestions": [
    "Specific actionable suggestion based on resume analysis",
    "Another specific suggestion for improvement"
  ],
  "raw_analysis": "Detailed analysis of the resume content, highlighting specific experiences, projects, and skills mentioned"
}

Rules:  
- Do NOT output anything outside the JSON object.  
- Each bullet point in strengths, weaknesses, and suggestions MUST start with two leading spaces (e.g., " Strong in JavaScript").  
- Ensure clean spacing between strengths, weaknesses, and suggestions blocks (two blank lines).  
- "raw_analysis" should be a plain, unformatted text (no bullet points, no special characters).  

Resume:
${resumeText}`;

    const requestBody = {
      contents: [{ parts: [{ text: promptText }] }]
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        let parsed = null;
        try {
          parsed = JSON.parse(aiText);
        } catch (e) {
          const jsonMatch = aiText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try { 
              parsed = JSON.parse(jsonMatch[0]); 
            } catch (e2) { 
              parsed = null; 
            }
          }
        }

        if (parsed && typeof parsed === 'object') {
          setAnalysis(parsed);
          
          // Generate recommendations
          generateRecommendations(resumeText);
        }
      } else {
        console.warn('Failed to parse AI response as JSON');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateRecommendations = (resumeText: string) => {
    if (!internships.length || !resumeText) return;

    const resumeLower = resumeText.toLowerCase();

    // Calculate skill matches for each internship
    const internshipMatches = internships.map(intern => {
      const requiredSkills = intern.skills_required || [];
      const matchedSkills: string[] = [];
      let matchCount = 0;

      requiredSkills.forEach(skill => {
        if (resumeLower.includes(skill.toLowerCase())) {
          matchedSkills.push(skill);
          matchCount++;
        }
      });

      const matchPercentage = requiredSkills.length > 0 
        ? Math.round((matchCount / requiredSkills.length) * 100) 
        : 0;

      return {
        ...intern,
        matchedSkills,
        matchCount,
        totalSkills: requiredSkills.length,
        matchPercentage
      } as InternshipMatch;
    });

    // Filter and sort matches
    const matchedInternships = internshipMatches
      .filter(intern => intern.matchCount > 0)
      .sort((a, b) => {
        if (b.matchCount !== a.matchCount) {
          return b.matchCount - a.matchCount;
        }
        return b.matchPercentage - a.matchPercentage;
      });

    setRecommendations(matchedInternships.slice(0, 5));

    // Generate skills to gain
    const skillCounts: Record<string, number> = {};
    const userSkills = new Set<string>();

    internships.forEach(intern => {
      intern.skills_required.forEach(skill => {
        if (!skillCounts[skill]) {
          skillCounts[skill] = 0;
        }
        skillCounts[skill]++;
        
        if (resumeLower.includes(skill.toLowerCase())) {
          userSkills.add(skill);
        }
      });
    });

    const skillsToGainList = Object.entries(skillCounts)
      .filter(([skill]) => !userSkills.has(skill))
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));

    setSkillsToGain(skillsToGainList);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('https://i.postimg.cc/MnjsXr2s/image.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background Overlay */}
      <div className="min-h-screen bg-black/30">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 text-white py-6 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-white drop-shadow-lg" />
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-lg">{t('title')}</h1>
                  <p className="text-white/80 mt-1 drop-shadow-md">{t('subtitle')}</p>
                </div>
              </div>
              
              {/* Language Switcher */}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                <Languages className="w-4 h-4" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent border-none text-white text-sm font-medium cursor-pointer outline-none"
                >
                  <option value="en" className="text-black">English</option>
                  <option value="hi" className="text-black">हिंदी</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Upload Section - Glass Morphism */}
          <div className="mb-8">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer backdrop-blur-lg ${
                isDragging 
                  ? 'border-blue-400/80 bg-blue-500/20 shadow-xl' 
                  : 'border-white/30 bg-white/10 hover:bg-white/20 hover:border-white/50'
              } shadow-2xl hover:shadow-3xl`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-white/80 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">
                {t('uploadTitle')}
              </h3>
              <p className="text-white/80 mb-4 drop-shadow-md">
                {t('uploadSubtitle')}
              </p>
              <button className="bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-blur-sm text-white px-6 py-2 rounded-lg hover:from-blue-600/90 hover:to-purple-700/90 transition-all border border-white/20 shadow-lg hover:shadow-xl">
                {t('chooseFile')}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Loading State */}
          {isAnalyzing && (
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-6 mb-8 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                <h3 className="text-lg font-semibold">{t('analyzing')}</h3>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-gray-600 mt-2">{t('analyzingDesc')}</p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-6 mb-8 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">{t('analysisTitle')}</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {analysis.overall_rating}/10
                    </span>
                    <span className="text-gray-600 ml-2">{t('overallRating')}</span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-700 mb-2">{t('strengths')}</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {Array.isArray(analysis.strengths) ? analysis.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      )) : null}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h4 className="font-semibold text-orange-700 mb-2">{t('weaknesses')}</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {Array.isArray(analysis.weaknesses) ? analysis.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          {weakness}
                        </li>
                      )) : null}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">{t('suggestions')}</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {Array.isArray(analysis.suggestions) ? analysis.suggestions.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {suggestion}
                        </li>
                      )) : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-6 mb-8 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">{t('recommendedTitle')}</h3>
              <div className="space-y-4">
                {recommendations.map(intern => (
                  <div key={intern.id} className="border border-gray-200/50 bg-white/50 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{intern.title}</h4>
                        <p className="text-gray-600">{intern.company} • {intern.location}</p>
                      </div>
                      <span className="bg-green-100/80 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {intern.matchPercentage}% {t('matchPercentage')}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{intern.description}</p>
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium text-green-700">{t('yourMatchingSkills')} </span>
                      <span className="text-sm text-gray-600">{intern.matchedSkills.join(', ')}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700">{t('allRequiredSkills')} </span>
                      <span className="text-sm text-gray-600">{intern.skills_required.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills to Gain */}
          {skillsToGain.length > 0 && (
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-white drop-shadow-lg">{t('skillsToBoostTitle')}</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {skillsToGain.map(({ skill, count }) => (
                  <div key={skill} className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                    <span className="font-medium text-gray-900">{skill}</span>
                    <span className="text-sm text-blue-600 font-semibold">
                      +{count} {count > 1 ? t('internships') : t('internship')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-blue-100/80 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                <p className="text-sm text-blue-800">
                  <strong>{t('proTip')}:</strong> {t('proTipDesc')}
                </p>
              </div>
            </div>
          )}
        </main>
        
        <footer className="bg-white/10 backdrop-blur-md text-center py-4 mt-8 border-t border-white/20">
          <p className="text-sm text-white/80">
            Built with TeamWork By{" "}
            <a
              href="https://credits-seven.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-blue-100 hover:underline font-medium"
            >
              CodexCrew 🔥
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Add PDF.js types to window
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default App;
