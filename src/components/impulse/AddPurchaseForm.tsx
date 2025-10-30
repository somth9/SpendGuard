"use client";

import React, { useState } from 'react';

export default function AddPurchaseForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    url: '',
    notes: '',
    mood: '',
    context: ''
  });

  const threshold = 50; // Example threshold

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic will be added later
    console.log('Purchase intent:', formData);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] p-4 pb-24">
      <header className="mb-6 mt-4">
        <button className="text-coffee-400 mb-4 flex items-center gap-2">
          <span>←</span> Back
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">
          Let&apos;s think about this 🤔
        </h1>
        <p className="text-gray-400 text-lg">
          Tell me about what you want to buy
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Name */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-sm border border-gray-800">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            What is it? *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Wireless headphones"
            className="w-full text-lg border-2 border-gray-700 bg-[#0D0D0D] rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-white placeholder:text-gray-500"
          />
        </div>

        {/* Price */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-sm border border-gray-800">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            How much? * 💰
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-2xl text-gray-400">$</span>
            <input
              type="number"
              required
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className="w-full text-lg border-2 border-gray-700 bg-[#0D0D0D] rounded-xl pl-10 pr-4 py-3 focus:border-indigo-500 focus:outline-none text-white placeholder:text-gray-500"
            />
          </div>
          {parseFloat(formData.price) > threshold && (
            <div className="mt-3 bg-coffee-500/10 border-2 border-coffee-500/30 rounded-xl p-3">
              <p className="text-sm text-coffee-400">
                ⏰ This is over your ${threshold} threshold. It&apos;ll go to your wishlist for a cooldown period.
              </p>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-sm border border-gray-800">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full text-lg border-2 border-gray-700 bg-[#0D0D0D] rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-white"
          >
            <option value="">Choose one...</option>
            <option value="electronics">📱 Electronics</option>
            <option value="clothing">👕 Clothing</option>
            <option value="food">🍕 Food & Dining</option>
            <option value="entertainment">🎮 Entertainment</option>
            <option value="home">🏠 Home & Garden</option>
            <option value="other">✨ Other</option>
          </select>
        </div>

        {/* Optional: URL */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-sm border border-gray-800">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Link (optional)
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://..."
            className="w-full text-lg border-2 border-gray-700 bg-[#0D0D0D] rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none text-white placeholder:text-gray-500"
          />
        </div>

        {/* Optional: Mood */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-sm border border-gray-800">
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            How are you feeling right now? (optional)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['😊 Happy', '😰 Stressed', '😴 Bored', '😢 Sad', '😤 Frustrated', '🤩 Excited'].map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => setFormData({ ...formData, mood })}
                className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
                  formData.mood === mood 
                    ? 'bg-coffee-500/20 border-coffee-500 text-coffee-400' 
                    : 'bg-[#0D0D0D] border-gray-700 text-gray-300 hover:border-gray-600'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Optional: Notes */}
        <div className="bg-[#1A1A1A] rounded-2xl p-5 shadow-sm border border-gray-800">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Any notes? (optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Why do you want this? What will you use it for?"
            rows={3}
            className="w-full text-lg border-2 border-gray-700 bg-[#0D0D0D] rounded-xl px-4 py-3 focus:border-indigo-500 focus:outline-none resize-none text-white placeholder:text-gray-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-bold text-lg py-4 rounded-2xl hover:opacity-90 active:scale-98 transition-all shadow-md"
        >
          {parseFloat(formData.price) > threshold ? 'Add to Wishlist ⏰' : 'Log Purchase ✓'}
        </button>
      </form>
    </div>
  );
}

