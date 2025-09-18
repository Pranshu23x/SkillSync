import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Brain, Target } from 'lucide-react';

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
  const [internships, setInternships] = useState<Internship[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<InternshipMatch[]>([]);
  const [skillsToGain, setSkillsToGain] = useState<Array<{ skill: string; count: number }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const promptText = `You are a professional resume expert.  
Analyze the following resume carefully and respond with a JSON object ONLY (no additional commentary or text).  

The JSON must strictly follow this structure:  

{
  "overall_rating": number,         // 0–10 (can be decimal, e.g., 7.5)
  "strengths": [
    " Strong in <skill/area>",
    " Strong in <another skill>"
  ],
  "weaknesses": [
    " Weak in <skill/area>",
    " Needs improvement in <another skill>"
  ],
  "suggestions": [
    " Suggest adding <thing>",
    " Suggest improving <thing>"
  ],
  "raw_analysis": "Provide a detailed plain-text analysis here if needed."
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
          
          // Save score to localStorage
          const resumeScore = typeof parsed.overall_rating === 'number' ? parsed.overall_rating : parseFloat(parsed.overall_rating);
          if (!Number.isNaN(resumeScore)) {
            localStorage.setItem('findme_resume_score', JSON.stringify({ 
              score: resumeScore, 
              savedAt: new Date().toISOString(), 
              rawText: aiText 
            }));
          }

          // Generate recommendations
          generateRecommendations(resumeText);
        }
      }
    } catch (error) {
      console.error('Error calling Gemini:', error);
      alert('Failed to analyze resume');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8" />
            <h1 className="text-2xl font-bold">SkillSync ⚡</h1>
          </div>
          <p className="text-blue-100 mt-1"> An Al-Based Internship Recommendation Engine for PM Internship Scheme </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Upload Section */}
        <div className="mb-8">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Your Resume
            </h3>
            <p className="text-gray-600 mb-4">
             Drag it or drop it (Its too hot 🔥)
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Choose Resume (only PDF)
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
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
              <h3 className="text-lg font-semibold">Beep Boop Beep ⚙️</h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-gray-600 mt-2">Polishing your resume until it is fit for internships✨</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">Resume Analysis</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {analysis.overall_rating}/10
                  </span>
                  <span className="text-gray-600 ml-2">Overall Rating</span>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {Array.isArray(analysis.strengths) ? analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {strength.trim()}
                      </li>
                    )) : null}
                  </ul>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <h4 className="font-semibold text-orange-700 mb-2">Areas for Improvement</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {Array.isArray(analysis.weaknesses) ? analysis.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">•</span>
                        {weakness.trim()}
                      </li>
                    )) : null}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-700 mb-2">Suggestions</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {Array.isArray(analysis.suggestions) ? analysis.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        {suggestion.trim()}
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
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Recommended Internships</h3>
            <div className="space-y-4">
              {recommendations.map(intern => (
                <div key={intern.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{intern.title}</h4>
                      <p className="text-gray-600">{intern.company} • {intern.location}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {intern.matchPercentage}% match
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{intern.description}</p>
                  
                  <div className="mb-2">
                    <span className="text-sm font-medium text-green-700">Your matching skills: </span>
                    <span className="text-sm text-gray-600">{intern.matchedSkills.join(', ')}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">All required skills: </span>
                    <span className="text-sm text-gray-600">{intern.skills_required.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills to Gain */}
        {skillsToGain.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Skills to Boost Your Opportunities</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              {skillsToGain.map(({ skill, count }) => (
                <div key={skill} className="flex justify-between items-center bg-white rounded-lg p-3">
                  <span className="font-medium text-gray-900">{skill}</span>
                  <span className="text-sm text-blue-600 font-semibold">
                    +{count} internship{count > 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> Focus on learning the top 3-5 skills from this list to significantly increase your internship opportunities.
              </p>
            </div>
          </div>
        )}
      </main>
     <footer className="bg-gray-100 text-center py-4 mt-8 border-t">
  <p className="text-sm text-gray-600">
    Built with TeamWork By{" "}
    <a
      href="https://credits-seven.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline font-medium"
    >
      CodexCrew 🔥
    </a>
  </p>
</footer>

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
