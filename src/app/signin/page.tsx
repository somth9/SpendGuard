"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import { Shield, Clock, Trophy, DollarSign, AlertCircle } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Redirect if already signed in
  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      console.log('User signed in:', result.user);
      
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
      
      if (isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      setError(error.message || 'Failed to sign in. Please try again.');
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coffee-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-coffee-400 to-coffee-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to SpendGuard
          </h1>
          <p className="text-lg text-gray-400">
            Mindful spending for ADHD adults
          </p>
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-lg border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Sign in to continue
          </h2>

          {error && (
            <div className="mb-6 bg-red-900/20 border border-red-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full bg-[#2A2A2A] border-2 border-gray-700 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-[#3A3A3A] hover:border-gray-600 active:scale-98 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            We&apos;ll never share your data without permission.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          <FeaturePoint 
            IconComponent={Clock}
            text="24-72hr cooldown prevents impulse purchases"
          />
          <FeaturePoint 
            IconComponent={Trophy}
            text="Earn rewards for mindful spending choices"
          />
          <FeaturePoint 
            IconComponent={DollarSign}
            text="Track your ADHD tax and save money"
          />
        </div>
      </div>
    </main>
  );
}

interface FeaturePointProps {
  IconComponent: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
}

function FeaturePoint({ IconComponent, text }: FeaturePointProps) {
  return (
    <div className="flex items-center gap-3 text-gray-300">
      <div className="w-8 h-8 bg-coffee-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <IconComponent className="w-5 h-5 text-black" strokeWidth={2} />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}


