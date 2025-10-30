"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickPrompts = [
  "Show my spending this week",
  "How much have I saved?",
  "What's my ADHD tax?",
  "Am I on track with my budget?",
  "Show my wishlist items",
  "Give me a weekly recap"
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi there! 👋 I\'m your SpendGuard AI assistant. I can help you understand your spending patterns, review your progress, and answer questions about your finances. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI call later)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a placeholder response. In the full app, I\'ll provide real insights based on your data!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="bg-[#1A1A1A] shadow-sm p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <button className="text-coffee-400 flex items-center gap-2">
            <span>←</span> Back
          </button>
          <h1 className="text-xl font-bold text-white">
            AI Chat Assistant 🤖
          </h1>
          <button className="text-gray-400">
            <span className="text-xl">⋯</span>
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-400 mb-2 font-medium">Try asking:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleQuickPrompt(prompt)}
                className="flex-shrink-0 bg-[#1A1A1A] border-2 border-coffee-500/30 text-coffee-400 px-4 py-2 rounded-full text-sm font-medium hover:bg-coffee-500/10 active:scale-95 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-[#1A1A1A] border-t border-gray-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your finances..."
            className="flex-1 border-2 border-gray-700 bg-[#0D0D0D] rounded-2xl px-4 py-3 text-base focus:border-indigo-500 focus:outline-none text-white placeholder:text-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-to-br from-coffee-400 to-coffee-500 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-3xl px-5 py-3 ${
        isUser 
          ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white' 
          : 'bg-[#1A1A1A] text-gray-200 shadow-sm border border-gray-800'
      }`}>
        <p className="text-base leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-white/80' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[#1A1A1A] rounded-3xl px-5 py-4 shadow-sm border border-gray-800">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

