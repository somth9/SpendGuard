"use client";

import React from 'react';

interface WishlistSummaryProps {
  activeItems: number;
  readyToReview: number;
}

export function WishlistSummary({ activeItems, readyToReview }: WishlistSummaryProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Wishlist ⏰
          </h3>
          <p className="text-gray-600 text-sm">
            Items cooling down
          </p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold text-2xl">
          {activeItems}
        </div>
      </div>

      {readyToReview > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⏱️</span>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {readyToReview} {readyToReview === 1 ? 'item' : 'items'} ready!
              </p>
              <p className="text-sm text-gray-600">
                Time to review your choices
              </p>
            </div>
          </div>
        </div>
      )}

      <button className="w-full bg-amber-500 text-white font-semibold py-3 rounded-xl hover:bg-amber-600 active:scale-98 transition-all">
        Open Wishlist
      </button>
    </div>
  );
}

