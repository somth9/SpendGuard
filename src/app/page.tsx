"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Shield, Clock, Trophy, DollarSign, TrendingUp, FileText } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect all users: authenticated to dashboard, unauthenticated to sign-in
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/signin');
      }
    }
  }, [user, loading, router]);

  // Show loading while checking auth
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
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-coffee-400 to-coffee-500 rounded-2xl flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            SpendGuard
          </h1>
          <p className="text-2xl text-gray-300 mb-2">
            Mindful spending for ADHD adults
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Reduce impulsive spending through gentle intervention, gamification, and AI-powered insights—all without shame or judgment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FeatureCard 
            IconComponent={Clock}
            title="Impulse Interrupt"
            description="24-72hr cooldown for purchases above your threshold"
          />
          <FeatureCard 
            IconComponent={Trophy}
            title="Dopamine Rewards"
            description="Earn points, badges, and levels for smart choices"
          />
          <FeatureCard 
            IconComponent={DollarSign}
            title="ADHD Tax Calculator"
            description="Track late fees, unused subscriptions, and more"
          />
          <FeatureCard 
            IconComponent={TrendingUp}
            title="Pattern Recognition"
            description="AI-powered insights into your spending triggers"
          />
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-lg text-center border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-400 mb-6">
            Sign in with Google to access SpendGuard and start building better spending habits today.
          </p>
          <div className="flex gap-3 justify-center">
            <Link 
              href="/signin"
              className="inline-block bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              Sign In with Google →
            </Link>
            <Link 
              href="/demo"
              className="inline-block bg-[#2A2A2A] text-gray-300 font-semibold text-lg px-8 py-4 rounded-2xl hover:bg-[#3A3A3A] active:scale-95 transition-all"
            >
              View Demo
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-coffee-400" />
            <h3 className="text-lg font-semibold text-white">
              Documentation
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <DocLink 
              href="/SPENDGUARD_ARCHITECTURE.md"
              title="Architecture"
              description="Complete system design & data models"
            />
            <DocLink 
              href="/SPENDGUARD_UI_GUIDE.md"
              title="UI/UX Guide"
              description="Design system & accessibility"
            />
            <DocLink 
              href="/IMPLEMENTATION_ROADMAP.md"
              title="Roadmap"
              description="14-week development plan"
            />
            <DocLink 
              href="/QUICK_START.md"
              title="Quick Start"
              description="Get started building today"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-coffee-500/20 text-coffee-400 px-4 py-2 rounded-full text-sm font-medium border border-coffee-500/30">
            <span className="w-2 h-2 bg-coffee-500 rounded-full animate-pulse"></span>
            Phase 1 Complete: Architecture & UI Components
          </div>
        </div>
      </div>
    </main>
  );
}

interface FeatureCardProps {
  IconComponent: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

function FeatureCard({ IconComponent, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 shadow-sm border border-gray-800 hover:border-coffee-500/50 transition-all">
      <div className="w-12 h-12 bg-coffee-500/20 rounded-xl flex items-center justify-center mb-3">
        <IconComponent className="w-6 h-6 text-black" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

interface DocLinkProps {
  href: string;
  title: string;
  description: string;
}

function DocLink({ href, title, description }: DocLinkProps) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 hover:bg-[#2A2A2A] rounded-xl transition-all"
    >
      <div className="font-semibold text-coffee-400 mb-1">{title}</div>
      <div className="text-sm text-gray-400">{description}</div>
    </a>
  );
}
