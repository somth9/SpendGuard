"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [debugMessage, setDebugMessage] = useState('Checking authentication...');

  useEffect(() => {
    console.log('ProtectedRoute: user =', user?.email || 'null', ', loading =', loading);
    
    // Update debug message
    if (loading) {
      setDebugMessage('Waiting for Firebase auth...');
    }
    
    // Timeout to show content after 2 seconds even if still loading (dev mode)
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ Auth taking too long (2s timeout), proceeding to sign-in page');
        setDebugMessage('Auth timeout - redirecting...');
        setShowContent(true);
        // Force redirect to signin after timeout
        router.push('/signin');
      }
    }, 2000);

    if (!loading) {
      clearTimeout(timeout);
      console.log('ProtectedRoute: Auth loaded. User:', user ? 'exists' : 'null');
      
      if (!user) {
        // Redirect to sign in if not authenticated
        console.log('ProtectedRoute: No user, redirecting to /signin');
        router.push('/signin');
      } else {
        console.log('ProtectedRoute: User authenticated, showing content');
        setShowContent(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [user, loading, router]);

  // Show loading state while checking authentication (with timeout)
  if (loading && !showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-900 text-lg font-semibold mb-2">Loading SpendGuard...</p>
          <p className="text-gray-500 text-sm">{debugMessage}</p>
          <p className="text-gray-400 text-xs mt-4">
            Check the browser console (F12) for details
          </p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated (unless dev mode timeout)
  if (!user && !showContent) {
    return null;
  }

  // User is authenticated or dev mode timeout, render the protected content
  return <>{children}</>;
}


