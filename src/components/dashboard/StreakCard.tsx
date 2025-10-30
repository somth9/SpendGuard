"use client";

import React from 'react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-indigo-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Your Streak 🔥
        </h3>
        <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
          Active
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-5xl font-bold text-indigo-600 mb-1">
            {currentStreak}
          </p>
          <p className="text-gray-600 text-sm">
            days without impulse buys
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">
            Personal best:
          </p>
          <p className="text-2xl font-bold text-gray-400">
            {longestStreak}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-green-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min((currentStreak / longestStreak) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

