"use client";

import React, { useMemo } from 'react';
import ProfileHeader from '../layout/ProfileHeader';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';
import type { PurchaseCategory, MoodTag } from '@/lib/types/models';
import { Bot, Search, Clock, Lightbulb, Smartphone, Shirt, Pizza, Gamepad2, Home, Car, Heart, Tv, Sparkles } from 'lucide-react';

export default function PatternsDashboard() {
  const { purchases, wishlistItems, loading } = useSpendGuard();

  // Calculate patterns from actual data
  const patterns = useMemo(() => {
    const byDay: Record<string, number> = {
      'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0
    };
    const byHour: Record<string, number> = {
      'Morning (6-12)': 0,
      'Afternoon (12-18)': 0,
      'Evening (18-24)': 0,
      'Night (0-6)': 0
    };
    const byCategory: Record<string, number> = {};
    const byMood: Record<string, number> = {};

    purchases.forEach(purchase => {
      const date = new Date(purchase.date);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      byDay[dayName] = (byDay[dayName] || 0) + purchase.amount;

      const hour = date.getHours();
      if (hour >= 6 && hour < 12) byHour['Morning (6-12)'] += purchase.amount;
      else if (hour >= 12 && hour < 18) byHour['Afternoon (12-18)'] += purchase.amount;
      else if (hour >= 18 && hour < 24) byHour['Evening (18-24)'] += purchase.amount;
      else byHour['Night (0-6)'] += purchase.amount;

      byCategory[purchase.category] = (byCategory[purchase.category] || 0) + purchase.amount;

      if (purchase.moodTag) {
        byMood[purchase.moodTag] = (byMood[purchase.moodTag] || 0) + purchase.amount;
      }
    });

    const getCategoryIcon = (category: PurchaseCategory) => {
      const iconMap: Record<PurchaseCategory, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
        electronics: Smartphone,
        clothing: Shirt,
        food: Pizza,
        entertainment: Gamepad2,
        home: Home,
        transportation: Car,
        health: Heart,
        subscription: Tv,
        other: Sparkles
      };
      return iconMap[category] || Sparkles;
    };

    const topCategories = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, amount]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        amount,
        IconComponent: getCategoryIcon(name as PurchaseCategory)
      }));

    return { byDay, byHour, topCategories, byMood };
  }, [purchases]);

  // Generate AI insights based on real data
  const aiInsights = useMemo(() => {
    const insights = [];
    
    // Find day with highest spending
    const maxDay = Object.entries(patterns.byDay).reduce((a, b) => b[1] > a[1] ? b : a);
    if (maxDay[1] > 0) {
      insights.push({
        id: '1',
        insight: `You tend to spend more on ${maxDay[0]}s with $${maxDay[1].toFixed(2)} on average.`,
        suggestion: 'Try planning ahead for this day to reduce impulse spending!',
        IconComponent: Search
      });
    }

    // Find time with highest spending
    const maxTime = Object.entries(patterns.byHour).reduce((a, b) => b[1] > a[1] ? b : a);
    if (maxTime[1] > 0) {
      insights.push({
        id: '2',
        insight: `Most of your spending happens in the ${maxTime[0].split('(')[0].trim()} timeframe.`,
        suggestion: 'Consider setting spending alerts during these hours.',
        IconComponent: Clock
      });
    }

    // Mood-based insight
    if (Object.keys(patterns.byMood).length > 0) {
      const maxMood = Object.entries(patterns.byMood).reduce((a, b) => b[1] > a[1] ? b : a);
      insights.push({
        id: '3',
        insight: `You spend more when feeling ${maxMood[0]} ($${maxMood[1].toFixed(2)} total).`,
        suggestion: 'Try non-shopping activities when experiencing this mood!',
        IconComponent: Heart
      });
    }

    // If no data yet, show encouraging message
    if (insights.length === 0) {
      insights.push({
        id: '1',
        insight: 'Not enough data yet to generate insights.',
        suggestion: 'Keep tracking your purchases to see your spending patterns!',
        IconComponent: Lightbulb
      });
    }

    return insights;
  }, [patterns]);

  const maxSpending = Math.max(...Object.values(patterns.byDay));

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <ProfileHeader />
      
      <div className="p-4 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Spending Patterns
          </h1>
          <p className="text-gray-400 text-sm">
            Understanding your triggers and habits
          </p>
        </header>

      {/* AI Insights Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bot className="w-6 h-6 text-coffee-400" strokeWidth={2} />
          <h2 className="text-xl font-bold text-white">
            AI-Powered Insights
          </h2>
        </div>
        <div className="space-y-3">
          {aiInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-500 mx-auto mb-4"></div>
          <p className="text-coffee-600">Analyzing your patterns...</p>
        </div>
      ) : (
        <>
          {/* Spending by Day Chart */}
          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-md mb-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">
              Spending by Day of Week
            </h3>
            {maxSpending === 0 ? (
              <p className="text-center text-gray-500 py-4">No spending data yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(patterns.byDay).map(([day, amount]) => (
                  <BarChartRow 
                    key={day} 
                    label={day} 
                    value={amount} 
                    maxValue={maxSpending}
                    color="bg-coffee-500"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Spending by Time of Day */}
          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-md mb-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">
              Spending by Time of Day
            </h3>
            {Object.values(patterns.byHour).every(v => v === 0) ? (
              <p className="text-center text-gray-500 py-4">No spending data yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(patterns.byHour).map(([time, amount]) => (
                  <BarChartRow 
                    key={time} 
                    label={time} 
                    value={amount} 
                    maxValue={Math.max(...Object.values(patterns.byHour))}
                    color="bg-coffee-400"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Top Categories */}
          <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-md border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">
              Top Spending Categories
            </h3>
            {patterns.topCategories.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No spending data yet</p>
            ) : (
              <div className="space-y-3">
                {patterns.topCategories.map((category, index) => (
                  <CategoryRow key={category.name} category={category} rank={index + 1} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
      </div>
    </div>
  );
}

interface InsightCardProps {
  insight: {
    insight: string;
    suggestion: string;
    IconComponent: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  };
}

function InsightCard({ insight }: InsightCardProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-md border border-gray-800">
      <div className="flex gap-3">
        <div className="w-12 h-12 bg-coffee-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <insight.IconComponent className="w-6 h-6 text-black" strokeWidth={2} />
        </div>
        <div className="flex-1">
          <p className="text-white font-medium mb-2">
            {insight.insight}
          </p>
          <div className="bg-coffee-500/10 border border-coffee-500/30 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-black flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">Suggestion:</span> {insight.suggestion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BarChartRowProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

function BarChartRow({ label, value, maxValue, color }: BarChartRowProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-300">{label}</span>
        <span className="font-bold text-white">${value}</span>
      </div>
      <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
        <div 
          className={`${color} h-full rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CategoryRowProps {
  category: {
    name: string;
    amount: number;
    IconComponent: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  };
  rank: number;
}

function CategoryRow({ category, rank }: CategoryRowProps) {
  const medalColors = ['bg-coffee-500/20 text-coffee-400', 'bg-coffee-500/10 text-coffee-400', 'bg-gray-800 text-gray-400'];
  const medalColor = medalColors[rank - 1] || 'bg-gray-800 text-gray-400';

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${medalColor} flex items-center justify-center font-bold`}>
          #{rank}
        </div>
        <div className="flex items-center gap-2">
          <category.IconComponent className="w-5 h-5 text-coffee-400" strokeWidth={2} />
          <p className="font-medium text-white">
            {category.name}
          </p>
        </div>
      </div>
      <span className="text-xl font-bold text-coffee-400">${category.amount}</span>
    </div>
  );
}

