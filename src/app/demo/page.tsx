"use client";

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardHome from '@/components/dashboard/DashboardHome';
import WishlistGrid from '@/components/impulse/WishlistGrid';
import AddPurchaseForm from '@/components/impulse/AddPurchaseForm';
import RewardsHub from '@/components/rewards/RewardsHub';
import ADHDTaxDashboard from '@/components/adhd-tax/ADHDTaxDashboard';
import PatternsDashboard from '@/components/patterns/PatternsDashboard';
import ChatInterface from '@/components/chat/ChatInterface';
import SettingsScreen from '@/components/settings/SettingsScreen';
import BottomNav from '@/components/layout/BottomNav';

type Screen = 
  | 'dashboard' 
  | 'wishlist' 
  | 'add-purchase' 
  | 'rewards' 
  | 'adhd-tax' 
  | 'patterns' 
  | 'chat' 
  | 'settings';

export default function DemoPage() {
  return (
    <ProtectedRoute>
      <DemoContent />
    </ProtectedRoute>
  );
}

function DemoContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardHome />;
      case 'wishlist':
        return <WishlistGrid />;
      case 'add-purchase':
        return <AddPurchaseForm />;
      case 'rewards':
        return <RewardsHub />;
      case 'adhd-tax':
        return <ADHDTaxDashboard />;
      case 'patterns':
        return <PatternsDashboard />;
      case 'chat':
        return <ChatInterface />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="relative">
      {/* Screen Selector (for demo purposes only) */}
      <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-3 z-50 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <DemoButton 
            label="Dashboard" 
            active={currentScreen === 'dashboard'} 
            onClick={() => setCurrentScreen('dashboard')} 
          />
          <DemoButton 
            label="Wishlist" 
            active={currentScreen === 'wishlist'} 
            onClick={() => setCurrentScreen('wishlist')} 
          />
          <DemoButton 
            label="Add Purchase" 
            active={currentScreen === 'add-purchase'} 
            onClick={() => setCurrentScreen('add-purchase')} 
          />
          <DemoButton 
            label="Rewards" 
            active={currentScreen === 'rewards'} 
            onClick={() => setCurrentScreen('rewards')} 
          />
          <DemoButton 
            label="ADHD Tax" 
            active={currentScreen === 'adhd-tax'} 
            onClick={() => setCurrentScreen('adhd-tax')} 
          />
          <DemoButton 
            label="Patterns" 
            active={currentScreen === 'patterns'} 
            onClick={() => setCurrentScreen('patterns')} 
          />
          <DemoButton 
            label="AI Chat" 
            active={currentScreen === 'chat'} 
            onClick={() => setCurrentScreen('chat')} 
          />
          <DemoButton 
            label="Settings" 
            active={currentScreen === 'settings'} 
            onClick={() => setCurrentScreen('settings')} 
          />
        </div>
      </div>

      {/* Main Content (with top padding to account for demo nav) */}
      <div className="pt-16">
        {renderScreen()}
      </div>

      {/* Bottom Navigation (in actual app, this would be in layout) */}
      <BottomNav />

      {/* Demo Instructions */}
      <div className="fixed bottom-20 left-4 bg-black/80 text-white text-xs p-3 rounded-lg max-w-xs z-40">
        <p className="font-bold mb-1">🎨 Demo Mode</p>
        <p>Use the top navigation to switch between screens. All components are UI-only skeletons with mock data.</p>
      </div>
    </div>
  );
}

interface DemoButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function DemoButton({ label, active, onClick }: DemoButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
        active 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );
}

