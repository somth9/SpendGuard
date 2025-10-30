"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AnalyticsChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsChatBot({ isOpen, onClose }: AnalyticsChatBotProps) {
  // Get all SpendGuard data
  const {
    wishlistItems,
    purchases,
    adhdTaxItems,
    userStats,
    userSettings,
    rewards,
    badges
  } = useSpendGuard();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your SpendGuard assistant. I can help you understand your spending patterns, analyze your progress, and answer any questions about your financial journey. What would you like to know?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare comprehensive SpendGuard data for the API
      const spendGuardData = {
        userStats: {
          currentLevel: userStats.currentLevel,
          currentStreak: userStats.currentStreak,
          longestStreak: userStats.longestStreak,
          totalPointsEarned: userStats.totalPointsEarned,
          totalSaved: userStats.totalSaved,
          totalSpent: userStats.totalSpent,
          adhdTaxTotal: userStats.adhdTaxTotal
        },
        userSettings: {
          impulseThreshold: userSettings.impulseThreshold,
          cooldownHours: userSettings.cooldownHours,
          monthlyBudget: userSettings.monthlyBudget,
          currency: userSettings.currency
        },
        badges: badges,
        wishlistItems: wishlistItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          status: item.status,
          moodTag: item.moodTag,
          contextTag: item.contextTag,
          notes: item.notes,
          addedAt: item.addedAt.toISOString(),
          cooldownEndsAt: item.cooldownEndsAt.toISOString()
        })),
        recentPurchases: purchases.map(purchase => ({
          id: purchase.id,
          name: purchase.name,
          amount: purchase.amount,
          category: purchase.category,
          date: purchase.date.toISOString(),
          wasImpulse: purchase.wasImpulse,
          moodTag: purchase.moodTag,
          contextTag: purchase.contextTag,
          notes: purchase.notes
        })),
        adhdTaxItems: adhdTaxItems.map(item => ({
          id: item.id,
          type: item.type,
          amount: item.amount,
          description: item.description,
          date: item.date.toISOString(),
          notes: item.notes
        })),
        recentRewards: rewards.map(reward => ({
          id: reward.id,
          type: reward.type,
          points: reward.points,
          badgeId: reward.badgeId,
          description: reward.description,
          earnedAt: reward.earnedAt.toISOString(),
          source: reward.source
        }))
      };

      const response = await fetch('/api/perplexity/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          spendGuardData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Response Error:', response.status, errorData);
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response Success:', data);

      if (!data.message) {
        throw new Error('No message in response');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check the console for details and try again.`
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0D0D0D] shadow-2xl z-50 flex flex-col animate-slide-in-right border-l border-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-br from-coffee-400 to-coffee-500 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Analytics Assistant</h2>
            <p className="text-sm text-white/90">Powered by AI</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
            aria-label="Close chat"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User Stats Summary */}
        <div className="bg-[#1A1A1A] px-6 py-3 border-b border-gray-800">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-bold text-coffee-400">{userStats.currentStreak}</div>
              <div className="text-gray-400">Day Streak</div>
            </div>
            <div>
              <div className="font-bold text-coffee-400">{userStats.totalPointsEarned}</div>
              <div className="text-gray-400">Points</div>
            </div>
            <div>
              <div className="font-bold text-green-400">${userStats.totalSaved.toFixed(0)}</div>
              <div className="text-gray-400">Saved</div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0D0D0D]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white'
                    : 'bg-[#1A1A1A] text-gray-200 border border-gray-800'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-coffee-400" />
                <span className="text-sm text-gray-400">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-4 bg-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your spending..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-[#0D0D0D] border-2 border-gray-700 focus:border-coffee-500 focus:outline-none text-white placeholder:text-gray-500 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="p-3 bg-gradient-to-br from-coffee-400 to-coffee-500 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Send message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Quick Questions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <QuickQuestion
              text="How am I doing?"
              onClick={() => setInputValue("How am I doing with my spending this month?")}
            />
            <QuickQuestion
              text="What's my ADHD tax?"
              onClick={() => setInputValue("Tell me about my ADHD tax and how to reduce it")}
            />
            <QuickQuestion
              text="Tips to save more"
              onClick={() => setInputValue("Give me tips to save more money")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Quick Question Button
interface QuickQuestionProps {
  text: string;
  onClick: () => void;
}

function QuickQuestion({ text, onClick }: QuickQuestionProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 bg-coffee-500/20 hover:bg-coffee-500/30 border border-coffee-500/30 rounded-full text-xs text-coffee-400 font-medium transition-all active:scale-95"
    >
      {text}
    </button>
  );
}

