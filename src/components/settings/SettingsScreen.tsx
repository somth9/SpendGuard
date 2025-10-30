"use client";

import React, { useState, useEffect } from 'react';
import ProfileHeader from '../layout/ProfileHeader';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';
import { useAuth } from '@/lib/hooks/useAuth';

export default function SettingsScreen() {
  const { userSettings, userStats, updateUserSettings } = useSpendGuard();
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState(userSettings);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when userSettings changes
  useEffect(() => {
    setSettings(userSettings);
  }, [userSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <ProfileHeader />
      
      <div className="p-4 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Settings
          </h1>
          <p className="text-gray-400 text-sm">
            Customize your SpendGuard experience
          </p>
        </header>

      {/* Profile Section */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-gray-800 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-coffee-400 to-coffee-500 rounded-full flex items-center justify-center text-4xl">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full" />
            ) : (
              '👤'
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.displayName || 'User'}</h2>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-700">
          <StatBox label="Level" value={userStats.currentLevel.toString()} icon="🏅" />
          <StatBox label="Streak" value={`${userStats.currentStreak}d`} icon="🔥" />
          <StatBox label="Saved" value={`$${userStats.totalSaved.toFixed(0)}`} icon="💰" />
        </div>
      </div>

      {/* Impulse Settings */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-gray-800 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Impulse Interrupt Settings
        </h3>
        
        {/* Threshold Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-300 font-medium">
              Impulse Threshold
            </label>
            <span className="text-2xl font-bold text-coffee-400">
              ${settings.impulseThreshold}
            </span>
          </div>
          <input
            type="range"
            min="25"
            max="200"
            step="5"
            value={settings.impulseThreshold}
            onChange={(e) => setSettings({ ...settings, impulseThreshold: parseInt(e.target.value) })}
            className="w-full h-3 bg-gray-700 rounded-full appearance-none cursor-pointer accent-coffee-500"
          />
          <p className="text-sm text-gray-400 mt-2">
            Purchases above this amount will enter cooldown
          </p>
        </div>

        {/* Cooldown Duration */}
        <div>
          <label className="block text-gray-300 font-medium mb-3">
            Cooldown Duration
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[24, 48, 72].map((hours) => (
              <button
                key={hours}
                onClick={() => setSettings({ ...settings, cooldownHours: hours as 24 | 48 | 72 })}
                className={`py-3 px-4 rounded-xl font-semibold border-2 transition-all ${
                  settings.cooldownHours === hours
                    ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white border-coffee-400'
                    : 'bg-[#0D0D0D] text-gray-300 border-gray-700 hover:border-coffee-500/50'
                }`}
              >
                {hours}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Settings */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-gray-800 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Budget & Goals
        </h3>
        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Monthly Budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-xl text-gray-400">$</span>
            <input
              type="number"
              value={settings.monthlyBudget}
              onChange={(e) => setSettings({ ...settings, monthlyBudget: parseInt(e.target.value) })}
              className="w-full text-lg bg-[#0D0D0D] border-2 border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:border-coffee-500 focus:outline-none text-white"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* App Preferences */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-gray-800 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">
          App Preferences
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Push Notifications"
            description="Get reminders and updates"
            enabled={settings.notificationsEnabled}
            onChange={(enabled) => setSettings({ ...settings, notificationsEnabled: enabled })}
          />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-bold py-4 rounded-2xl mb-6 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving...' : 'Save Settings'}
      </button>

      {/* Account Actions */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">
          Account
        </h3>
        <div className="space-y-3">
          <ActionButton 
            label="Sign Out" 
            icon="🚪" 
            color="text-red-400" 
            onClick={handleLogout}
          />
        </div>
      </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-[#0D0D0D] rounded-xl p-3 text-center border border-gray-800">
      <span className="text-2xl block mb-1">{icon}</span>
      <p className="text-lg font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

interface ToggleSettingProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSetting({ label, description, enabled, onChange }: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`w-14 h-8 rounded-full transition-all ${
          enabled ? 'bg-gradient-to-br from-coffee-400 to-coffee-500' : 'bg-gray-700'
        }`}
      >
        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`} />
      </button>
    </div>
  );
}

function ActionButton({ label, icon, color, onClick }: { label: string; icon: string; color: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3 px-4 hover:bg-[#2A2A2A] rounded-xl transition-all ${color}`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

