import React from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface SkillSuggestionsProps {
  suggestedSkills: Array<{ skill: string; count: number }>;
}

const SkillSuggestions: React.FC<SkillSuggestionsProps> = ({ suggestedSkills }) => {
  if (suggestedSkills.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Lightbulb className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Skills to Boost Your Opportunities
        </h3>
      </div>
      
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        Learning these in-demand skills could unlock more internship opportunities for you:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {suggestedSkills.map(({ skill, count }) => (
          <div
            key={skill}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-900">{skill}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="font-semibold text-blue-600">{count}</span>
              <span className="text-gray-500">
                internship{count > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-100 rounded-lg">
        <p className="text-sm text-blue-800 font-medium mb-1">
          💡 Pro Tip
        </p>
        <p className="text-xs text-blue-700 leading-relaxed">
          Focus on learning the top 3-5 skills from this list through online courses, 
          personal projects, or certifications to significantly increase your internship opportunities.
        </p>
      </div>
    </div>
  );
};

export default SkillSuggestions;