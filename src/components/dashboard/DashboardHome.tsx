"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ChevronDown, Target, Brain, DollarSign, Trophy, Clock, TrendingUp, Award, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import AnalyticsChatBot from '../chat/AnalyticsChatBot';

export default function DashboardHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const getFirstName = () => {
    if (!user?.displayName) return 'Friend';
    return user.displayName.split(' ')[0];
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Custom Header */}
      <div className="px-4 pt-8 pb-4">
        {/* User Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/dashboard/settings')}
              className="w-12 h-12 rounded-full overflow-hidden border-2 border-coffee-400"
            >
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-coffee-400 to-coffee-500 flex items-center justify-center text-white font-semibold text-lg">
                  {getFirstName()[0]}
                </div>
              )}
            </button>
            <div>
              <p className="text-xs text-gray-400">Welcome back</p>
              <button 
                onClick={() => router.push('/dashboard/settings')}
                className="flex items-center gap-1 text-white font-semibold hover:text-coffee-400 transition-colors"
              >
                {getFirstName()}
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="AI powered questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsChatBotOpen(true)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#1A1A1A] border-none focus:outline-none text-white placeholder:text-gray-500"
              />
            </div>
            <button
              onClick={() => setIsChatBotOpen(true)}
              className="bg-gradient-to-br from-coffee-400 to-coffee-500 p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-md"
            >
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content with Promo Banner */}
      <div className="px-4 pb-28 relative">
        {/* Promo Banner with Category Icons Overlay */}
        <div className="relative mb-20">
          {/* Promo Banner */}
          <div className="bg-gradient-to-br from-coffee-400 to-coffee-500 rounded-3xl p-6 h-48 overflow-hidden shadow-xl relative">
            <div className="relative z-10 h-full flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                Track your
              </h2>
              <h2 className="text-3xl font-bold drop-shadow-lg">
                <span className="text-black">future!</span>
              </h2>
            </div>
            <div className="absolute right-4 bottom-4 w-32 h-32 opacity-30">
              <Sparkles className="w-32 h-32 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Category Icons - Overlaid on bottom half of banner */}
          <div className="absolute -bottom-16 left-0 right-0 px-4">
            <div className="grid grid-cols-4 gap-3">
              <CategoryButton
                IconComponent={Target}
                label="Wishlist"
                onClick={() => router.push('/dashboard/wishlist')}
              />
              <CategoryButton
                IconComponent={Brain}
                label="Patterns"
                onClick={() => router.push('/dashboard/patterns')}
              />
              <CategoryButton
                IconComponent={DollarSign}
                label="ADHD Tax"
                onClick={() => router.push('/dashboard/adhd-tax')}
              />
              <CategoryButton
                IconComponent={Trophy}
                label="Rewards"
                onClick={() => router.push('/dashboard/rewards')}
              />
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Your Progress
          </h2>
          <button
            onClick={() => router.push('/dashboard/history')}
            className="text-coffee-400 font-semibold text-sm"
          >
            See all
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4">
          <FeatureCard
            title="Impulse Control"
            subtitle="24-72hr cooldown active"
            IconComponent={Clock}
            time="15 min"
            onClick={() => router.push('/dashboard/wishlist')}
          />
          <FeatureCard
            title="Spending Insights"
            subtitle="AI-powered analysis"
            IconComponent={TrendingUp}
            time="10 min"
            onClick={() => router.push('/dashboard/patterns')}
          />
          <FeatureCard
            title="Rewards & Badges"
            subtitle="Earn points for saving"
            IconComponent={Award}
            time="5 min"
            onClick={() => router.push('/dashboard/rewards')}
          />
        </div>
      </div>

      {/* Analytics ChatBot */}
      <AnalyticsChatBot
        isOpen={isChatBotOpen}
        onClose={() => {
          setIsChatBotOpen(false);
          setSearchQuery('');
        }}
      />
    </div>
  );
}

// Category Button Component
interface CategoryButtonProps {
  IconComponent: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  onClick: () => void;
}

function CategoryButton({ IconComponent, label, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
    >
      <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all border border-gray-800 hover:border-coffee-500/50">
        <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
      </div>
      <span className="text-xs font-medium text-white text-center leading-tight">
        {label}
      </span>
    </button>
  );
}

// Feature Card Component
interface FeatureCardProps {
  title: string;
  subtitle: string;
  IconComponent: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  time: string;
  onClick: () => void;
}

function FeatureCard({ title, subtitle, IconComponent, time, onClick }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className="relative bg-[#1A1A1A] rounded-3xl p-6 h-48 overflow-hidden hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg text-left border border-gray-800 hover:border-coffee-500/50"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <IconComponent className="w-40 h-40" strokeWidth={1.5} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">
            {subtitle}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-coffee-400 to-coffee-500 p-2.5 rounded-xl">
            <IconComponent className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-1 bg-coffee-400/20 px-3 py-1.5 rounded-full">
            <span className="text-sm font-medium text-coffee-400">{time}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
