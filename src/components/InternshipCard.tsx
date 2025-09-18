import React from 'react';
import { Building2, MapPin, Target, CheckCircle2 } from 'lucide-react';
import { InternshipMatch } from '../types/Internship';

interface InternshipCardProps {
  internship: InternshipMatch;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 bg-green-100';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Frontend Development': 'bg-blue-100 text-blue-800',
      'Backend Development': 'bg-green-100 text-green-800',
      'Fullstack Development': 'bg-purple-100 text-purple-800',
      'Mobile Development': 'bg-pink-100 text-pink-800',
      'AI / ML / NLP': 'bg-indigo-100 text-indigo-800',
      'Data Engineering': 'bg-cyan-100 text-cyan-800',
      'Cybersecurity / InfoSec': 'bg-red-100 text-red-800',
      'Blockchain': 'bg-yellow-100 text-yellow-800',
      'Cloud / DevOps': 'bg-gray-100 text-gray-800',
      'AI / Computer Vision': 'bg-violet-100 text-violet-800',
      'DevOps / SRE': 'bg-teal-100 text-teal-800',
      'Cybersecurity / Ethical Hacking': 'bg-rose-100 text-rose-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
              {internship.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-600 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="font-medium">{internship.company}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{internship.location}</span>
            </div>
          </div>
          
          {/* Match Percentage Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${getMatchColor(internship.matchPercentage)}`}>
            {internship.matchPercentage}% match
          </div>
        </div>

        {/* Category Badge */}
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(internship.category)}`}>
          {internship.category}
        </span>
      </div>

      {/* Skills Section */}
      <div className="px-6 pb-4">
        {/* Matched Skills */}
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            Your Matching Skills ({internship.matchCount})
          </h4>
          <div className="flex flex-wrap gap-1">
            {internship.matchedSkills.map(skill => (
              <span
                key={skill}
                className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* All Required Skills */}
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <Target className="w-4 h-4" />
            All Required Skills
          </h4>
          <div className="flex flex-wrap gap-1">
            {internship.skills_required.map(skill => {
              const isMatched = internship.matchedSkills.includes(skill);
              return (
                <span
                  key={skill}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    isMatched
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 pb-6">
        <p className="text-sm text-gray-600 leading-relaxed">
          {internship.description}
        </p>
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-xs text-gray-500">
        <span>Skills match: {internship.matchCount}/{internship.totalSkills}</span>
        <span>Score range: {internship.score_range[0]}-{internship.score_range[1]}</span>
      </div>
    </div>
  );
};

export default InternshipCard;