
import React from 'react';

interface TypingIndicatorProps {
  isTyping: boolean;
  userName: string;
}

const TypingIndicator = ({ isTyping, userName }: TypingIndicatorProps) => {
  if (!isTyping) return null;

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white/20 text-white px-4 py-2 rounded-2xl rounded-bl-md">
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-300">{userName} is typing</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
