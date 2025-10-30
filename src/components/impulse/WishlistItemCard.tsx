"use client";

import React, { useState } from 'react';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';
import type { WishlistItem } from '@/lib/types/models';
import { CheckCircle2, Trash2, Smartphone, Shirt, Pizza, Gamepad2, Home, Car, Heart, Tv, Sparkles, Smile, Frown, Meh, Zap, Annoyed } from 'lucide-react';

interface WishlistItemCardProps {
  item: WishlistItem;
}

export function WishlistItemCard({ item }: WishlistItemCardProps) {
  const { purchaseWishlistItem, dismissWishlistItem } = useSpendGuard();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const isReady = item.status === 'ready_to_review';
  const timeRemaining = calculateTimeRemaining(item.cooldownEndsAt);

  const handlePurchase = async () => {
    if (isProcessing) return;
    
    const confirmed = confirm(`Are you sure you still want to buy "${item.name}" for $${item.price}?`);
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await purchaseWishlistItem(item.id);
      alert('Item purchased and added to history!');
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert('Failed to process purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDismiss = async () => {
    if (isProcessing) return;
    
    const reason = prompt(`Why are you removing "${item.name}"?\n\n(This helps track your savings!)`);
    if (reason === null) return; // User cancelled

    setIsProcessing(true);
    try {
      await dismissWishlistItem(item.id, reason || 'No reason provided');
      alert(`Great job! You saved $${item.price}! 🎉`);
    } catch (error) {
      console.error('Error dismissing item:', error);
      alert('Failed to dismiss item. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const CategoryIcon = getCategoryIcon(item.category);
  const MoodIcon = item.moodTag ? getMoodIcon(item.moodTag) : null;

  return (
    <div className={`bg-[#1A1A1A] rounded-3xl p-5 shadow-md border-2 transition-all ${
      isReady ? 'border-coffee-500 shadow-coffee-500/20' : 'border-gray-800'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">
            {item.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm text-gray-400 capitalize bg-[#2A2A2A] px-2 py-1 rounded-lg">
              <CategoryIcon className="w-4 h-4" strokeWidth={2} />
              {item.category}
            </span>
            {item.moodTag && MoodIcon && (
              <span className="flex items-center gap-1.5 text-sm bg-coffee-500/20 text-coffee-400 px-2 py-1 rounded-lg capitalize">
                <MoodIcon className="w-4 h-4" strokeWidth={2} />
                {item.moodTag}
              </span>
            )}
          </div>
          {item.notes && (
            <div className="mt-2 pt-2 border-t border-gray-800">
              <p className="text-xs text-gray-500 font-medium mb-1">Additional Information:</p>
              <p className="text-sm text-gray-300">{item.notes}</p>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-coffee-400">
            ${item.price}
          </p>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className={`rounded-2xl p-4 mb-3 ${
        isReady ? 'bg-coffee-500/20 border border-coffee-500' : 'bg-[#2A2A2A] border border-gray-800'
      }`}>
        {isReady ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-coffee-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="font-bold text-white text-lg">
                Ready to review!
              </p>
              <p className="text-sm text-gray-400">
                Cooldown period complete
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-400">Time remaining:</span>
              <span className="text-lg font-bold text-white">
                {timeRemaining}
              </span>
            </div>
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-coffee-500 h-full rounded-full transition-all"
                style={{ width: `${calculateProgress(item.addedAt, item.cooldownEndsAt)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isReady ? (
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handlePurchase}
            disabled={isProcessing}
            className="bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-2"
          >
            {isProcessing ? '...' : (
              <>
                <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                Still Want It
              </>
            )}
          </button>
          <button 
            onClick={handleDismiss}
            disabled={isProcessing}
            className="bg-[#2A2A2A] text-gray-300 font-semibold py-3 rounded-xl hover:bg-[#3A3A3A] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? '...' : (
              <>
                <Trash2 className="w-5 h-5" strokeWidth={2} />
                Remove
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="w-full bg-[#2A2A2A] text-gray-400 font-semibold py-3 rounded-xl text-center border border-gray-800">
          Cooling down...
        </div>
      )}

      {/* Added Date */}
      <p className="text-xs text-gray-500 text-center mt-3">
        Added {formatDate(item.addedAt)}
      </p>
    </div>
  );
}

// Helper Functions
function calculateTimeRemaining(endDate: Date): string {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Complete!';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  
  return `${hours}h ${minutes}m`;
}

function calculateProgress(startDate: Date, endDate: Date): number {
  const now = new Date();
  const total = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  return Math.min((elapsed / total) * 100, 100);
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

function getCategoryIcon(category: string): React.ComponentType<{ className?: string; strokeWidth?: number }> {
  const icons: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
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
  return icons[category] || Sparkles;
}

function getMoodIcon(mood: string): React.ComponentType<{ className?: string; strokeWidth?: number }> {
  const icons: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
    happy: Smile,
    stressed: Zap,
    bored: Meh,
    sad: Frown,
    frustrated: Annoyed,
    excited: Sparkles,
    anxious: Zap,
    neutral: Meh
  };
  return icons[mood] || Meh;
}

