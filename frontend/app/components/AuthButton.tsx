
'use client';

import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface AuthButtonProps {
  onSignIn: (email: string) => void;
  isLoading?: boolean;
}

// Pixelated Composio Logo Component
const ComposioLogo = () => (
  <div className="relative w-16 h-16 bg-white" style={{ imageRendering: 'pixelated' }}>
    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-0">
      {/* Top left - Red */}
      <div className="row-start-1 col-start-1 bg-red-500"></div>
      <div className="row-start-1 col-start-2 bg-red-500"></div>
      <div className="row-start-2 col-start-1 bg-red-500"></div>
      
      {/* Top right - Blue */}
      <div className="row-start-1 col-start-3 bg-blue-500"></div>
      <div className="row-start-1 col-start-4 bg-blue-500"></div>
      <div className="row-start-2 col-start-4 bg-blue-500"></div>
      
      {/* Bottom left - Yellow */}
      <div className="row-start-3 col-start-1 bg-yellow-400"></div>
      <div className="row-start-4 col-start-1 bg-yellow-400"></div>
      <div className="row-start-4 col-start-2 bg-yellow-400"></div>
      
      {/* Bottom right - Green */}
      <div className="row-start-4 col-start-3 bg-green-500"></div>
      <div className="row-start-4 col-start-4 bg-green-500"></div>
      <div className="row-start-3 col-start-4 bg-green-500"></div>
      
      {/* Center - White */}
      <div className="row-start-2 col-start-2 bg-white"></div>
      <div className="row-start-2 col-start-3 bg-white"></div>
      <div className="row-start-3 col-start-2 bg-white"></div>
      <div className="row-start-3 col-start-3 bg-white"></div>
    </div>
  </div>
);

export default function AuthButton({ onSignIn, isLoading }: AuthButtonProps) {
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSignIn(email);
    }
  };

  if (!showForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background relative">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <ThemeToggle />
      </div>
        <div className="max-w-md w-full px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-8">
              <ComposioLogo />
            </div>
            <h1 className="text-3xl font-normal text-foreground mb-3">Gmail Agent</h1>
            <p className="text-muted-foreground mb-8">Sign in with Gmail to get started</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-card text-foreground py-4 px-6 rounded-lg hover:bg-accent border border-border transition-colors shadow-sm"
          >
            Sign in with Gmail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-8">
            <ComposioLogo />
          </div>
          <h1 className="text-3xl font-normal text-foreground mb-3">Enter Your Email</h1>
          <p className="text-muted-foreground mb-8">We&apos;ll create a secure connection to your Gmail account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-card border border-border rounded-lg focus:outline-none focus:border-blue-500 text-foreground placeholder-muted-foreground transition-colors"
              placeholder="Enter your Gmail address"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-card text-foreground py-4 px-6 rounded-lg hover:bg-accent border border-border transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? 'Creating connection...' : 'Continue'}
          </button>
          
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="w-full text-muted-foreground py-2 hover:text-foreground transition-colors"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}