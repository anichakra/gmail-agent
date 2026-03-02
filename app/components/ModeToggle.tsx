'use client';

import { Mail, Bot } from 'lucide-react';

interface ModeToggleProps {
  currentMode: 'email' | 'agent';
  onModeChange: (mode: 'email' | 'agent') => void;
}

export default function ModeToggle({ currentMode, onModeChange }: ModeToggleProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white shadow-lg rounded-lg p-1 border border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => onModeChange('email')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              currentMode === 'email'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium">Email</span>
          </button>
          
          <button
            onClick={() => onModeChange('agent')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              currentMode === 'agent'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="text-sm font-medium">AI Agent</span>
          </button>
        </div>
      </div>
    </div>
  );
}