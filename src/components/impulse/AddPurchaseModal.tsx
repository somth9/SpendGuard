"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';
import type { PurchaseCategory, MoodTag } from '@/lib/types/models';

interface AddPurchaseModalProps {
  onClose: () => void;
}

export default function AddPurchaseModal({ onClose }: AddPurchaseModalProps) {
  const { addToWishlist, userSettings } = useSpendGuard();
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    category: 'other' as PurchaseCategory,
    notes: '',
    moodTag: undefined as MoodTag | undefined
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.price) return;

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if price exceeds impulse threshold
      if (price >= userSettings.impulseThreshold) {
        // Add to wishlist for cooldown
        await addToWishlist({
          name: formData.itemName,
          price,
          category: formData.category,
          notes: formData.notes,
          moodTag: formData.moodTag
        });
        alert(`Added to wishlist! This item will be in cooldown for ${userSettings.cooldownHours} hours.`);
      } else {
        // Under threshold - could add directly to purchases, but for now still add to wishlist
        await addToWishlist({
          name: formData.itemName,
          price,
          category: formData.category,
          notes: formData.notes,
          moodTag: formData.moodTag
        });
        alert('Added to wishlist!');
      }
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#1A1A1A] rounded-t-3xl shadow-2xl animate-slide-up border-t border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Add to Wishlist</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What do you want?
            </label>
            <input
              type="text"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              placeholder="e.g., New headphones"
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent text-white placeholder:text-gray-500"
              required
              autoComplete="off"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              How much is it?
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent text-white placeholder:text-gray-500"
                required
                autoComplete="off"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as PurchaseCategory })}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent text-white"
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="food">Food & Dining</option>
              <option value="entertainment">Entertainment</option>
              <option value="home">Home</option>
              <option value="transportation">Transportation</option>
              <option value="health">Health</option>
              <option value="subscription">Subscription</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Mood Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              How are you feeling? (Optional)
            </label>
            <select
              value={formData.moodTag || ''}
              onChange={(e) => setFormData({ ...formData, moodTag: e.target.value as MoodTag || undefined })}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent text-white"
            >
              <option value="">Select mood...</option>
              <option value="happy">Happy</option>
              <option value="stressed">Stressed</option>
              <option value="bored">Bored</option>
              <option value="sad">Sad</option>
              <option value="frustrated">Frustrated</option>
              <option value="excited">Excited</option>
              <option value="anxious">Anxious</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Why do you want this?"
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent text-white placeholder:text-gray-500"
              rows={3}
              autoComplete="off"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-br from-coffee-500 to-coffee-600 text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? 'Adding...' : 'Add to Wishlist'}
          </button>
        </form>
      </div>
    </div>
  );
}

