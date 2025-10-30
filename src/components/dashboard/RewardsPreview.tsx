"use client";

import React from 'react';

interface RewardsPreviewProps {
  points: number;
  level: number;
}

export function RewardsPreview({ points, level }: RewardsPreviewProps) {
  const pointsToNextLevel = 300;
  const progress = (points / pointsToNextLevel) * 100;
  
  return (
    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl p-6 shadow-md text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Rewards 🎉
        </h3>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="font-bold text-xl">Level {level}</span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-4xl font-bold mb-1">
          {points}
        </p>
        <p className="text-green-100 text-sm">
          points earned
        </p>
      </div>

      {/* Level Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-green-100">Progress to Level {level + 1}</span>
          <span className="font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button className="mt-4 w-full bg-white text-green-600 font-semibold py-3 rounded-xl hover:bg-green-50 active:scale-98 transition-all">
        View All Rewards
      </button>
    </div>
  );
}

