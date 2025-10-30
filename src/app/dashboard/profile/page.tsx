"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileHeader from '@/components/layout/ProfileHeader';
import { useAuth } from '@/lib/hooks/useAuth';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { userStats } = useSpendGuard();

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', path: '/dashboard/settings' },
        { icon: Bell, label: 'Notifications', path: '/dashboard/settings' },
        { icon: Shield, label: 'Privacy & Security', path: '/dashboard/settings' }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', path: '/dashboard/settings' }
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/signin');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0D0D0D] pb-24">
        <ProfileHeader />
        
        <div className="p-4">
          {/* Profile Info Card */}
          <div className="bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-coffee-400 to-coffee-500 flex items-center justify-center text-white font-bold text-2xl">
                    {user?.displayName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.displayName || 'User'}</h2>
                <p className="text-sm text-white/80">{user?.email}</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{userStats.currentStreak}</p>
                <p className="text-xs text-white/80">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">${userStats.totalSaved.toFixed(2)}</p>
                <p className="text-xs text-white/80">Saved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">Level {userStats.currentLevel}</p>
                <p className="text-xs text-white/80">Progress</p>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 px-2">
                {section.title}
              </h3>
              <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={() => router.push(item.path)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#2A2A2A] transition-colors border-b border-gray-800 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/30 transition-colors border border-red-500/30"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

