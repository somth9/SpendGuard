"use client";

import React from 'react';
import ProfileHeader from '../layout/ProfileHeader';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';
import { BADGE_DEFINITIONS } from '@/lib/types/models';
import { Crown, Medal, Star, Clock, CheckCircle, Flame, Target, FileText, Lightbulb } from 'lucide-react';

export default function RewardsHub() {
  const { userStats, badges: earnedBadges, loading } = useSpendGuard();
  
  const pointsPerLevel = 300;
  const currentLevel = userStats.currentLevel;
  const currentPoints = userStats.totalPointsEarned;
  const pointsInCurrentLevel = currentPoints % pointsPerLevel;
  const pointsToNextLevel = pointsPerLevel;
  const progress = (pointsInCurrentLevel / pointsToNextLevel) * 100;

  // Map badge definitions with earned status
  const allBadges = BADGE_DEFINITIONS.map(badge => ({
    ...badge,
    earned: earnedBadges.includes(badge.id)
  }));

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <ProfileHeader />
      
      <div className="p-4 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Your Rewards
          </h1>
          <p className="text-gray-400 text-sm">
            Celebrating your smart choices!
          </p>
        </header>

      {/* Level Progress Card */}
      <div className="bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-3xl p-6 shadow-lg mb-6 text-white">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading rewards...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-cream-100 text-sm mb-1">Current Level</p>
                <h2 className="text-5xl font-bold">Level {currentLevel}</h2>
                <p className="text-cream-100 mt-1">
                  {currentLevel >= 5 ? 'Savings Champion' : 
                   currentLevel >= 3 ? 'Budget Warrior' : 'Getting Started'}
                </p>
              </div>
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                {currentLevel >= 5 ? <Crown className="w-12 h-12 text-white" strokeWidth={2} /> : 
                 currentLevel >= 3 ? <Medal className="w-12 h-12 text-white" strokeWidth={2} /> : 
                 <Star className="w-12 h-12 text-white" strokeWidth={2} />}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-cream-100">Progress to Level {currentLevel + 1}</span>
                <span className="font-semibold">{pointsInCurrentLevel} / {pointsToNextLevel}</span>
              </div>
              <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-white flex-shrink-0 mt-0.5" strokeWidth={2} />
                <p className="text-sm text-cream-50">
                  Earn {pointsToNextLevel - pointsInCurrentLevel} more points to reach <span className="font-bold">Level {currentLevel + 1}</span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Points Breakdown */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-md mb-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">
          Ways to Earn Points
        </h3>
        <div className="space-y-3">
          <PointsActivity 
            IconComponent={Clock}
            activity="Item in cooldown (per day)"
            points={10}
          />
          <PointsActivity 
            IconComponent={CheckCircle}
            activity="Dismiss wishlist item"
            points={50}
          />
          <PointsActivity 
            IconComponent={Flame}
            activity="Daily streak bonus"
            points={20}
          />
          <PointsActivity 
            IconComponent={Target}
            activity="Stay under budget"
            points={100}
          />
          <PointsActivity 
            IconComponent={FileText}
            activity="Log expense consistently"
            points={5}
          />
        </div>
      </div>

      {/* Badges Gallery */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-md border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            Badges Earned
          </h3>
          <span className="text-sm text-gray-400">
            {allBadges.filter(b => b.earned).length} / {allBadges.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {allBadges.map(badge => (
            <BadgeCard key={badge.id} badge={{
              id: badge.id,
              name: badge.name,
              icon: badge.iconEmoji,
              earned: badge.earned
            }} />
          ))}
        </div>
        {allBadges.filter(b => b.earned).length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">
              Start earning badges by using the app!
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

interface PointsActivityProps {
  IconComponent: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  activity: string;
  points: number;
}

function PointsActivity({ IconComponent, activity, points }: PointsActivityProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-coffee-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-black" strokeWidth={2} />
        </div>
        <span className="text-gray-300">{activity}</span>
      </div>
      <span className="font-bold text-coffee-400">+{points}</span>
    </div>
  );
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
}

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-3 border-2 transition-all ${
      badge.earned 
        ? 'bg-gradient-to-br from-coffee-400/20 to-coffee-500/20 border-coffee-500' 
        : 'bg-[#2A2A2A] border-gray-700 opacity-50'
    }`}>
      <span className="text-4xl mb-2">{badge.icon}</span>
      <p className={`text-xs font-semibold text-center ${
        badge.earned ? 'text-coffee-400' : 'text-gray-500'
      }`}>
        {badge.name}
      </p>
    </div>
  );
}

