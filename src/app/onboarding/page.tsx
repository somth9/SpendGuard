"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { HandWave, DollarSign, Clock, Target, Lightbulb, CheckCircle } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingFlow />
    </ProtectedRoute>
  );
}

function OnboardingFlow() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState({
    impulseThreshold: 50,
    cooldownHours: 48 as 24 | 48 | 72,
    monthlyBudget: 1000,
    notificationsEnabled: true
  });

  const handleComplete = async () => {
    console.log('Saving user settings:', settings);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full mx-1 transition-all ${
                  s <= step ? 'bg-coffee-500' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-400 text-center">
            Step {step} of 4
          </p>
        </div>

        <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-lg border border-gray-800">
          {step === 1 && (
            <WelcomeStep 
              userName={user?.displayName || 'there'}
              onNext={() => setStep(2)} 
            />
          )}
          
          {step === 2 && (
            <ThresholdStep
              threshold={settings.impulseThreshold}
              onChange={(val) => setSettings({ ...settings, impulseThreshold: val })}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          
          {step === 3 && (
            <CooldownStep
              cooldownHours={settings.cooldownHours}
              onChange={(val) => setSettings({ ...settings, cooldownHours: val })}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}
          
          {step === 4 && (
            <BudgetStep
              budget={settings.monthlyBudget}
              onChange={(val) => setSettings({ ...settings, monthlyBudget: val })}
              onComplete={handleComplete}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function WelcomeStep({ userName, onNext }: { userName: string; onNext: () => void }) {
  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 bg-coffee-500/20 rounded-2xl flex items-center justify-center">
          <HandWave className="w-12 h-12 text-black" strokeWidth={2} />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">
        Welcome, {userName}!
      </h1>
      <p className="text-lg text-gray-400 mb-8">
        Let&apos;s set up SpendGuard to work best for you. This will only take a minute.
      </p>
      <button
        onClick={onNext}
        className="bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-bold text-lg px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-md"
      >
        Get Started →
      </button>
    </div>
  );
}

function ThresholdStep({ 
  threshold, 
  onChange, 
  onNext, 
  onBack 
}: { 
  threshold: number; 
  onChange: (val: number) => void; 
  onNext: () => void; 
  onBack: () => void; 
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-coffee-500/20 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-10 h-10 text-black" strokeWidth={2} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Set Your Impulse Threshold
        </h2>
        <p className="text-gray-400">
          Purchases above this amount will go into a cooldown period
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300 font-medium">Threshold Amount</span>
          <span className="text-4xl font-bold text-coffee-400">${threshold}</span>
        </div>
        <input
          type="range"
          min="25"
          max="200"
          step="5"
          value={threshold}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 bg-gray-800 rounded-full appearance-none cursor-pointer accent-coffee-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>$25</span>
          <span>$200</span>
        </div>
      </div>

      <div className="bg-coffee-500/10 border border-coffee-500/30 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-5 h-5 text-black flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Tip:</span> Start with ${threshold}. You can always adjust this later in settings.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-[#2A2A2A] text-gray-300 font-semibold py-3 rounded-xl hover:bg-[#3A3A3A] active:scale-98 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function CooldownStep({ 
  cooldownHours, 
  onChange, 
  onNext, 
  onBack 
}: { 
  cooldownHours: 24 | 48 | 72; 
  onChange: (val: 24 | 48 | 72) => void; 
  onNext: () => void; 
  onBack: () => void; 
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-coffee-500/20 rounded-2xl flex items-center justify-center">
            <Clock className="w-10 h-10 text-black" strokeWidth={2} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Your Cooldown Period
        </h2>
        <p className="text-gray-400">
          How long should items wait in your wishlist?
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[24, 48, 72].map((hours) => (
          <button
            key={hours}
            onClick={() => onChange(hours as 24 | 48 | 72)}
            className={`py-6 px-4 rounded-2xl font-semibold border-2 transition-all ${
              cooldownHours === hours
                ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white border-coffee-500 shadow-md'
                : 'bg-[#2A2A2A] text-gray-300 border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="text-3xl font-bold mb-1">{hours}</div>
            <div className="text-sm">hours</div>
          </button>
        ))}
      </div>

      <div className="bg-coffee-500/10 border border-coffee-500/30 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-2">
          <Clock className="w-5 h-5 text-black flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Recommended:</span> 48 hours gives you time to think without feeling too restrictive.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-[#2A2A2A] text-gray-300 font-semibold py-3 rounded-xl hover:bg-[#3A3A3A] active:scale-98 transition-all"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function BudgetStep({ 
  budget, 
  onChange, 
  onComplete, 
  onBack 
}: { 
  budget: number; 
  onChange: (val: number) => void; 
  onComplete: () => void; 
  onBack: () => void; 
}) {
  return (
    <div>
      <div className="text-center mb-8">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-coffee-500/20 rounded-2xl flex items-center justify-center">
            <Target className="w-10 h-10 text-black" strokeWidth={2} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Set Your Monthly Budget
        </h2>
        <p className="text-gray-400">
          Optional: Track your spending against a budget
        </p>
      </div>

      <div className="mb-8">
        <label className="block text-gray-300 font-medium mb-3">
          Monthly Spending Limit
        </label>
        <div className="relative">
          <span className="absolute left-4 top-4 text-2xl text-gray-400">$</span>
          <input
            type="number"
            value={budget}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            className="w-full text-2xl border-2 border-gray-700 bg-[#2A2A2A] rounded-xl pl-12 pr-4 py-4 focus:border-coffee-500 focus:outline-none text-white"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          You can skip this or change it later in settings
        </p>
      </div>

      <div className="bg-coffee-500/10 border border-coffee-500/30 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-2">
          <CheckCircle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">All set!</span> You can adjust these settings anytime in your profile.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 bg-[#2A2A2A] text-gray-300 font-semibold py-3 rounded-xl hover:bg-[#3A3A3A] active:scale-98 transition-all"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          className="flex-1 bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-semibold py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
}


