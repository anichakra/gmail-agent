'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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

function AuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = () => {
      try {
        const connectionId = searchParams.get('connectionId') || searchParams.get('connected_account_id');
        const email = searchParams.get('email') || localStorage.getItem('pendingEmail');
        const error = searchParams.get('error');
        const status = searchParams.get('status');

        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          return;
        }

        if (status !== 'success' || !connectionId || !email) {
          setStatus('error');
          setMessage('Missing required authentication parameters');
          return;
        }

        // Store the email and redirect to main app
        localStorage.setItem('userEmail', email);
        localStorage.removeItem('pendingEmail');
        
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        
        // Redirect to main app with success parameters
        setTimeout(() => {
          window.location.href = `/?connectionId=${connectionId}&email=${encodeURIComponent(email)}`;
        }, 2000);

      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
        console.error('Auth callback error:', error);
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a]">
      <div className="max-w-md w-full px-8 text-center">
        <div className="flex justify-center mb-8">
          <ComposioLogo />
        </div>
        
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#3a3a3a] border-t-white mx-auto mb-6"></div>
            <h1 className="text-3xl font-normal text-white mb-3">Authenticating</h1>
            <p className="text-[#888888]">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-normal text-white mb-3">Success!</h1>
            <p className="text-[#888888]">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-normal text-white mb-3">Authentication Failed</h1>
            <p className="text-[#888888] mb-6">{message}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-[#2a2a2a] text-white py-4 px-6 rounded-lg hover:bg-[#333333] transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a]">
        <div className="max-w-md w-full px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#3a3a3a] border-t-white mx-auto mb-6"></div>
          <h1 className="text-3xl font-normal text-white mb-3">Loading</h1>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}