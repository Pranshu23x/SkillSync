import React, { useState } from 'react';
import { Search, GraduationCap, Code2, MapPin, Briefcase, X } from 'lucide-react';
import { UserProfile } from '../types/Internship';

interface UserProfileFormProps {
  onProfileSubmit: (profile: UserProfile) => void;
  loading?: boolean;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onProfileSubmit, loading }) => {
  const [profile, setProfile] = useState<UserProfile>({
    education: '',
    skills: [],
    sectorInterests: [],
    location: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const popularSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'TypeScript',
    'SQL', 'Docker', 'AWS', 'Git', 'HTML', 'CSS', 'MongoDB', 'Express'
  ];

  const sectorOptions = [
    'Frontend Development', 'Backend Development', 'Fullstack Development',
    'Mobile Development', 'AI / ML / NLP', 'Data Engineering', 
    'Cybersecurity / InfoSec', 'Blockchain', 'Cloud / DevOps', 
    'AI / Computer Vision', 'DevOps / SRE', 'Cybersecurity / Ethical Hacking'
  ];

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !profile.skills.includes(trimmedSkill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }));
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = (interest: string) => {
    const trimmedInterest = interest.trim();
    if (trimmedInterest && !profile.sectorInterests.includes(trimmedInterest)) {
      setProfile(prev => ({
        ...prev,
        sectorInterests: [...prev.sectorInterests, trimmedInterest]
      }));
    }
    setInterestInput('');
  };

  const removeInterest = (interestToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      sectorInterests: prev.sectorInterests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.skills.length > 0) {
      onProfileSubmit(profile);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Education */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          Education Level
        </label>
        <select
          value={profile.education}
          onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          required
        >
          <option value="">Select your education level</option>
          <option value="High School">High School</option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Graduate">Graduate</option>
          <option value="Postgraduate">Postgraduate</option>
        </select>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Code2 className="w-4 h-4 text-green-600" />
          Technical Skills
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill(skillInput);
              }
            }}
            placeholder="Type a skill and press Enter"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => addSkill(skillInput)}
            disabled={!skillInput.trim()}
            className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {/* Popular Skills */}
        <div className="flex flex-wrap gap-2">
          {popularSkills.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => addSkill(skill)}
              disabled={profile.skills.includes(skill)}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-green-100 disabled:bg-green-100 disabled:text-green-800 text-gray-600 rounded-full transition-colors"
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Selected Skills */}
        {profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map(skill => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-green-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Sector Interests */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Briefcase className="w-4 h-4 text-orange-600" />
          Sector Interests
        </label>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addInterest(interestInput);
              }
            }}
            placeholder="Type an interest and press Enter"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => addInterest(interestInput)}
            disabled={!interestInput.trim()}
            className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {/* Sector Options */}
        <div className="flex flex-wrap gap-2">
          {sectorOptions.map(sector => (
            <button
              key={sector}
              type="button"
              onClick={() => addInterest(sector)}
              disabled={profile.sectorInterests.includes(sector)}
              className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-orange-100 disabled:bg-orange-100 disabled:text-orange-800 text-gray-600 rounded-full transition-colors"
            >
              {sector}
            </button>
          ))}
        </div>

        {/* Selected Interests */}
        {profile.sectorInterests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.sectorInterests.map(interest => (
              <span
                key={interest}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="hover:text-orange-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MapPin className="w-4 h-4 text-purple-600" />
          Preferred Location
        </label>
        <input
          type="text"
          value={profile.location}
          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
          placeholder="e.g., Remote, Bangalore, Mumbai"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || profile.skills.length === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
      >
        <Search className="w-5 h-5" />
        {loading ? 'Searching...' : 'Find Matching Internships'}
      </button>

      {profile.skills.length === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Please add at least one skill to search for internships
        </p>
      )}
    </form>
  );
};

export default UserProfileForm;