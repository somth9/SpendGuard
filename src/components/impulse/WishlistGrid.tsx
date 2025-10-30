"use client";

import React, { useState } from 'react';
import { WishlistItemCard } from './WishlistItemCard';
import ProfileHeader from '../layout/ProfileHeader';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';
import type { WishlistStatus } from '@/lib/types/models';
import { PartyPopper } from 'lucide-react';

export default function WishlistGrid() {
  const { wishlistItems, loading } = useSpendGuard();
  const [filter, setFilter] = useState<'all' | 'cooling_down' | 'ready_to_review'>('all');

  // Filter to only show active items (not purchased or dismissed)
  const activeItems = wishlistItems.filter(item => 
    item.status === 'cooling_down' || item.status === 'ready_to_review'
  );

  const filteredItems = filter === 'all' 
    ? activeItems 
    : activeItems.filter(item => item.status === filter);

  const readyCount = activeItems.filter(i => i.status === 'ready_to_review').length;
  const coolingCount = activeItems.filter(i => i.status === 'cooling_down').length;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <ProfileHeader />
      
      <div className="p-4 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Your Wishlist
          </h1>
          <p className="text-gray-400 text-sm">
            Items taking a breather before purchase
          </p>
        </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#1A1A1A] rounded-2xl p-4 shadow-sm border border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Cooling Down</p>
          <p className="text-3xl font-bold text-coffee-400">{coolingCount}</p>
        </div>
        <div className="bg-[#1A1A1A] rounded-2xl p-4 shadow-sm border border-coffee-500/50">
          <p className="text-sm text-gray-400 mb-1">Ready to Review</p>
          <p className="text-3xl font-bold text-coffee-400">{readyCount}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 bg-[#1A1A1A] rounded-2xl p-2 shadow-sm border border-gray-800">
        <FilterTab 
          label="All" 
          count={activeItems.length}
          active={filter === 'all'} 
          onClick={() => setFilter('all')} 
        />
        <FilterTab 
          label="Cooling" 
          count={coolingCount}
          active={filter === 'cooling_down'} 
          onClick={() => setFilter('cooling_down')} 
        />
        <FilterTab 
          label="Ready" 
          count={readyCount}
          active={filter === 'ready_to_review'} 
          onClick={() => setFilter('ready_to_review')} 
        />
      </div>

      {/* Wishlist Items */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-500 mx-auto mb-4"></div>
            <p className="text-coffee-600">Loading your wishlist...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-coffee-500/20 rounded-2xl flex items-center justify-center">
                <PartyPopper className="w-12 h-12 text-black" strokeWidth={2} />
              </div>
            </div>
            <p className="text-xl font-semibold text-white mb-2">
              Nothing here!
            </p>
            <p className="text-gray-400">
              {filter === 'all' 
                ? "Your wishlist is empty. Great job resisting impulses!" 
                : filter === 'ready_to_review'
                ? "No items ready for review yet."
                : "No items currently cooling down."}
            </p>
          </div>
        ) : (
          filteredItems.map(item => (
            <WishlistItemCard key={item.id} item={item} />
          ))
        )}
      </div>

      </div>
    </div>
  );
}

interface FilterTabProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

function FilterTab({ label, count, active, onClick }: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-xl font-semibold text-sm transition-all ${
        active 
          ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white' 
          : 'bg-transparent text-gray-400 hover:bg-[#2A2A2A]'
      }`}
    >
      {label} ({count})
    </button>
  );
}

