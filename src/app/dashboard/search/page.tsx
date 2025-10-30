"use client";

import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, ShoppingBag, Clock, AlertCircle, X } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileHeader from '@/components/layout/ProfileHeader';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';
import type { Purchase, WishlistItem, ADHDTaxItem } from '@/lib/types/models';

type SearchResult = {
  id: string;
  type: 'purchase' | 'wishlist' | 'adhd-tax';
  name: string;
  amount: number;
  category?: string;
  date: Date;
  notes?: string;
  status?: string;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { purchases, wishlistItems, adhdTaxItems } = useSpendGuard();

  // Combine all data into searchable results
  const allResults = useMemo(() => {
    const results: SearchResult[] = [];

    // Add purchases
    purchases.forEach(p => {
      results.push({
        id: p.id,
        type: 'purchase',
        name: p.name,
        amount: p.amount,
        category: p.category,
        date: p.date,
        notes: p.notes
      });
    });

    // Add wishlist items
    wishlistItems.forEach(w => {
      results.push({
        id: w.id,
        type: 'wishlist',
        name: w.name,
        amount: w.price,
        category: w.category,
        date: w.addedAt,
        notes: w.notes,
        status: w.status
      });
    });

    // Add ADHD tax items
    adhdTaxItems.forEach(a => {
      results.push({
        id: a.id,
        type: 'adhd-tax',
        name: a.description,
        amount: a.amount,
        category: a.type,
        date: a.date,
        notes: a.notes
      });
    });

    return results;
  }, [purchases, wishlistItems, adhdTaxItems]);

  // Filter results based on search query and category
  const filteredResults = useMemo(() => {
    let results = allResults;

    // Filter by category if selected
    if (selectedCategory) {
      results = results.filter(r => r.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(r => 
        r.name.toLowerCase().includes(query) ||
        r.category?.toLowerCase().includes(query) ||
        r.notes?.toLowerCase().includes(query)
      );
    }

    // Sort by date (most recent first)
    return results.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [allResults, searchQuery, selectedCategory]);

  // Get unique categories from all items
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allResults.forEach(r => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats);
  }, [allResults]);

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'electronics': '📱',
      'food': '🍕',
      'shopping': '🛍️',
      'entertainment': '🎮',
      'subscription': '📺',
      'coffee': '☕',
      'impulse': '⚡',
      'late-fees': '⏰',
      'duplicate-purchases': '📦',
      'forgotten-subscriptions': '💳',
      'rushed-shipping': '🚚'
    };
    return emojiMap[category.toLowerCase()] || '💰';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag className="w-4 h-4" />;
      case 'wishlist':
        return <Clock className="w-4 h-4" />;
      case 'adhd-tax':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <ShoppingBag className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'purchase':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'wishlist':
        return 'bg-coffee-500/20 text-coffee-400 border border-coffee-500/30';
      case 'adhd-tax':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
      default:
        return 'bg-gray-800 text-gray-400 border border-gray-700';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D0D0D] pb-24">
        <ProfileHeader />
        
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white mb-6">Search</h1>
          
          {/* Search Input */}
          <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search purchases, wishlist, ADHD tax..."
              className="w-full pl-12 pr-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent text-white placeholder:text-gray-500"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === null
                      ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white'
                      : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#2A2A2A] border border-gray-800'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white'
                        : 'bg-[#1A1A1A] text-gray-300 hover:bg-[#2A2A2A] border border-gray-800'
                    }`}
                  >
                    <span>{getCategoryEmoji(category)}</span>
                    {category}
                    {selectedCategory === category && (
                      <X className="w-3 h-3" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(null);
                      }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery.trim() || selectedCategory ? (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Results ({filteredResults.length})
              </h2>
              
              {filteredResults.length > 0 ? (
                <div className="space-y-3">
                  {filteredResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="bg-[#1A1A1A] rounded-xl p-4 border border-gray-800 hover:border-coffee-500/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${getTypeBadgeColor(result.type)}`}>
                              {getTypeIcon(result.type)}
                              {result.type === 'adhd-tax' ? 'ADHD Tax' : result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                            </span>
                            {result.status && (
                              <span className="text-xs text-gray-500 capitalize">
                                {result.status.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-white">{result.name}</h3>
                          {result.category && (
                            <p className="text-sm text-gray-400 mt-1">
                              {getCategoryEmoji(result.category)} {result.category}
                            </p>
                          )}
                          {result.notes && (
                            <p className="text-sm text-gray-500 mt-1">{result.notes}</p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">{formatDate(result.date)}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className={`text-lg font-bold ${
                            result.type === 'adhd-tax' ? 'text-red-400' : 'text-coffee-400'
                          }`}>
                            ${result.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <SearchIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No results found</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Quick Stats */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Quick Stats
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-blue-500/30">
                    <p className="text-2xl font-bold text-blue-400">{purchases.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Purchases</p>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-coffee-500/30">
                    <p className="text-2xl font-bold text-coffee-400">{wishlistItems.length}</p>
                    <p className="text-xs text-gray-400 mt-1">Wishlist</p>
                  </div>
                  <div className="bg-[#1A1A1A] rounded-xl p-4 text-center border border-orange-500/30">
                    <p className="text-2xl font-bold text-orange-400">{adhdTaxItems.length}</p>
                    <p className="text-xs text-gray-400 mt-1">ADHD Tax</p>
                  </div>
                </div>
              </div>

              {/* Popular Categories */}
              {categories.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Your Categories
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.slice(0, 6).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className="p-4 bg-[#1A1A1A] rounded-xl border border-gray-800 hover:border-coffee-500/50 transition-colors text-left"
                      >
                        <span className="text-2xl mb-2 block">{getCategoryEmoji(category)}</span>
                        <p className="text-sm font-medium text-white capitalize">{category}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {allResults.filter(r => r.category === category).length} items
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

