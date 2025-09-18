import React from 'react';
import { Target, Sparkles } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                SkillSync.io
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </h1>
              <p className="text-blue-100 text-sm md:text-base">
                Find internships that match your skills perfectly
              </p>
            </div>
          </div>
          
          <LanguageSwitcher 
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;