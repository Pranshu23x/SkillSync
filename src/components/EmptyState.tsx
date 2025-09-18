import React from 'react';
import { Search, Users } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-matches' | 'no-search' | 'error';
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, title, description }) => {
  const getContent = () => {
    switch (type) {
      case 'no-matches':
        return {
          icon: <Search className="w-16 h-16 text-gray-400" />,
          title: title || 'No matching internships found',
          description: description || 'Try adding more skills or adjusting your preferences to find more opportunities.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-100'
        };
      case 'no-search':
        return {
          icon: <Users className="w-16 h-16 text-gray-400" />,
          title: title || 'Ready to find your perfect internship?',
          description: description || 'Fill out your profile above to get personalized internship recommendations.',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100'
        };
      case 'error':
        return {
          icon: <Search className="w-16 h-16 text-red-400" />,
          title: title || 'Something went wrong',
          description: description || 'Please try again later or refresh the page.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100'
        };
      default:
        return {
          icon: <Search className="w-16 h-16 text-gray-400" />,
          title: 'No results',
          description: 'No data to display.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-100'
        };
    }
  };

  const content = getContent();

  return (
    <div className={`${content.bgColor} ${content.borderColor} border rounded-xl p-8 text-center`}>
      <div className="flex justify-center mb-4">
        {content.icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {content.title}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {content.description}
      </p>
    </div>
  );
};

export default EmptyState;