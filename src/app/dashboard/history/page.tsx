"use client";

import React, { useMemo } from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileHeader from '@/components/layout/ProfileHeader';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';

export default function HistoryPage() {
  const { purchases, wishlistItems, userStats, loading } = useSpendGuard();

  // Group activities by date
  const groupedHistory = useMemo(() => {
    const allActivities: Array<{
      date: Date;
      name: string;
      amount: number;
      type: 'spent' | 'saved' | 'wishlist';
    }> = [];

    // Add purchases
    purchases.forEach(purchase => {
      allActivities.push({
        date: new Date(purchase.date),
        name: purchase.name,
        amount: purchase.amount,
        type: 'spent'
      });
    });

    // Add wishlist additions
    wishlistItems.forEach(item => {
      allActivities.push({
        date: new Date(item.addedAt),
        name: `Added ${item.name} to wishlist`,
        amount: item.price,
        type: 'wishlist'
      });

      // Add dismissed items as "saved"
      if (item.status === 'dismissed' && item.dismissedAt) {
        allActivities.push({
          date: new Date(item.dismissedAt),
          name: `Saved by not buying ${item.name}`,
          amount: item.price,
          type: 'saved'
        });
      }
    });

    // Sort by date (newest first)
    allActivities.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Group by date
    const grouped: Record<string, typeof allActivities> = {};
    allActivities.forEach(activity => {
      const dateKey = formatDateKey(activity.date);
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });

    return Object.entries(grouped).map(([date, items]) => ({
      date,
      items: items.map(item => ({
        ...item,
        time: formatTime(item.date)
      }))
    }));
  }, [purchases, wishlistItems]);

  // Calculate monthly totals
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlySpent = purchases
    .filter(p => {
      const date = new Date(p.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const monthlySaved = wishlistItems
    .filter(item => {
      if (!item.dismissedAt) return false;
      const date = new Date(item.dismissedAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D0D0D] pb-24">
        <ProfileHeader />
        
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white mb-6">History</h1>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-green-400" />
                <p className="text-xs font-medium text-green-400 uppercase">Saved</p>
              </div>
              <p className="text-2xl font-bold text-green-400">${monthlySaved.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">This month</p>
            </div>
            
            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-coffee-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-coffee-400" />
                <p className="text-xs font-medium text-coffee-400 uppercase">Spent</p>
              </div>
              <p className="text-2xl font-bold text-coffee-400">${monthlySpent.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">This month</p>
            </div>
          </div>

          {/* Timeline */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading history...</p>
            </div>
          ) : groupedHistory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl font-semibold text-white mb-2">No activity yet</p>
              <p className="text-gray-400">Start tracking your spending to see your history!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedHistory.map((day, dayIndex) => (
                <div key={dayIndex}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                      {day.date}
                    </h2>
                  </div>
                  
                  <div className="space-y-2">
                    {day.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 hover:border-coffee-500/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-white mb-1">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.time}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              item.type === 'spent' ? 'text-red-400' :
                              item.type === 'saved' ? 'text-green-400' :
                              'text-coffee-400'
                            }`}>
                              {item.type === 'spent' ? '-' : item.type === 'saved' ? '+' : ''}
                              ${item.amount.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 capitalize mt-1">
                              {item.type}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Helper functions
function formatDateKey(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (compareDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

