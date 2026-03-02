'use client';

import { useState, useEffect } from 'react';
import AuthButton from './components/AuthButton';
import AgentInterface from './components/AgentInterface';
import { apiService } from './lib/api';

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (from localStorage or URL params)
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      checkUserConnection(storedEmail);
    }
    
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const connectionId = urlParams.get('connectionId');
    const email = urlParams.get('email');
    
    if (connectionId && email) {
      setUserEmail(email);
      setIsAuthenticated(true);
      localStorage.setItem('userEmail', email);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkUserConnection = async (email: string) => {
    try {
      const status = await apiService.getUserConnectionStatus(email);
      if (status.is_connected) {
        setUserEmail(email);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking user connection:', error);
      localStorage.removeItem('userEmail');
    }
  };

  const handleSignIn = async (email: string) => {
    setIsLoading(true);
    try {
      // Check if user is already connected
      const status = await apiService.getUserConnectionStatus(email);
      if (status.is_connected) {
        // If already connected, just set authenticated state and continue
        setUserEmail(email);
        setIsAuthenticated(true);
        localStorage.setItem('userEmail', email);
        return;
      }

      // Create sign-in link
      const response = await apiService.createSignInLink({
        email,
        callback_url: `${window.location.origin}/auth/callback?email=${encodeURIComponent(email)}`
      });

      // Store email for later use
      localStorage.setItem('pendingEmail', email);
      
      // Redirect to Composio auth
      window.location.href = response.connection_url;
    } catch (err) {
      const error = err as { message?: string };
      alert(error.message || 'Failed to create sign-in link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    setUserEmail(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('pendingEmail');
  };

  if (!isAuthenticated || !userEmail) {
    return <AuthButton onSignIn={handleSignIn} isLoading={isLoading} />;
  }

  return (
    <div className="relative">
      {/* Sign Out Button */}
      <button
        onClick={handleSignOut}
        className="fixed top-4 right-4 z-50 px-4 py-2 bg-[#2a2a2a] text-[#cccccc] text-sm rounded-full hover:bg-[#333333] transition-colors"
      >
        Sign Out
      </button>

      <AgentInterface userEmail={userEmail} />
    </div>
  );
}
