'use client';

import { useState } from 'react';

interface AuthButtonProps {
  onSignIn: (email: string) => void;
  isLoading?: boolean;
}

// Pixelated Composio Logo Component
const ComposioLogo = () => (
  <div className="relative w-16 h-16 bg-white" style={{ imageRendering: 'pixelated' }}>
    <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-0">
      {/* Top row */}
      <div className="col-start-2 col-span-3 bg-white"></div>
      {/* Second row */}
      <div className="row-start-2 col-start-1 col-span-5 bg-white"></div>
      {/* Third row - center square */}
      <div className="row-start-3 col-start-1 bg-white"></div>
      <div className="row-start-3 col-start-2 col-span-3 bg-black"></div>
      <div className="row-start-3 col-start-5 bg-white"></div>
      {/* Fourth row */}
      <div className="row-start-4 col-start-1 col-span-5 bg-white"></div>
      {/* Fifth row */}
      <div className="row-start-5 col-start-2 col-span-3 bg-white"></div>
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="max-w-md w-full px-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-8">
              <ComposioLogo />
            </div>
            <h1 className="text-3xl font-normal text-white mb-3">Open Email Agent</h1>
            <p className="text-[#888888] mb-8">Sign in with Gmail to get started</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#2a2a2a] text-white py-4 px-6 rounded-lg hover:bg-[#333333] transition-colors"
          >
            Sign in with Gmail
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a]">
      <div className="max-w-md w-full px-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-8">
            <ComposioLogo />
          </div>
          <h1 className="text-3xl font-normal text-white mb-3">Enter Your Email</h1>
          <p className="text-[#888888] mb-8">We&apos;ll create a secure connection to your Gmail account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg focus:outline-none focus:border-[#555555] text-white placeholder-[#888888] transition-colors"
              placeholder="Enter your Gmail address"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-[#2a2a2a] text-white py-4 px-6 rounded-lg hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating connection...' : 'Continue'}
          </button>
          
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="w-full text-[#888888] py-2 hover:text-white transition-colors"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}