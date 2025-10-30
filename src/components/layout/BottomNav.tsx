"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, History, User } from 'lucide-react';
import AddPurchaseModal from '../impulse/AddPurchaseModal';

type NavItem = 'dashboard' | 'search' | 'history' | 'profile';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);

  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Home', Icon: Home, path: '/dashboard' },
    { id: 'search' as NavItem, label: 'Search', Icon: Search, path: '/dashboard/search' },
    { id: 'history' as NavItem, label: 'History', Icon: History, path: '/dashboard/history' },
    { id: 'profile' as NavItem, label: 'Profile', Icon: User, path: '/dashboard/profile' }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] border-t border-gray-800 z-50 rounded-t-3xl">
        <div className="relative flex items-end h-20 px-4">
          {/* Left Nav Items */}
          <div className="flex-1 flex justify-around items-center pb-2">
            {navItems.slice(0, 2).map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.Icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="relative flex flex-col items-center justify-center gap-1 transition-all group"
                >
                  {isActive && (
                    <div className="absolute inset-0 -top-1 bg-gradient-to-br from-coffee-400/20 to-coffee-500/20 rounded-2xl scale-110 -z-10" />
                  )}
                  <div className={`p-3 rounded-2xl transition-all ${
                    isActive ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 shadow-lg scale-105' : ''
                  }`}>
                    <Icon 
                      className={`w-6 h-6 transition-all ${
                        isActive 
                          ? 'text-white stroke-[2.5]' 
                          : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  {!isActive && (
                    <span className="text-[10px] font-medium text-gray-400">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Center Plus Button */}
          <div className="flex-shrink-0 -mt-20 px-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="w-16 h-16 bg-gradient-to-br from-coffee-400 to-coffee-500 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:shadow-2xl"
              aria-label="Add Purchase"
            >
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
            </button>
          </div>

          {/* Right Nav Items */}
          <div className="flex-1 flex justify-around items-center pb-2">
            {navItems.slice(2).map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.Icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="relative flex flex-col items-center justify-center gap-1 transition-all group"
                >
                  {isActive && (
                    <div className="absolute inset-0 -top-1 bg-gradient-to-br from-coffee-400/20 to-coffee-500/20 rounded-2xl scale-110 -z-10" />
                  )}
                  <div className={`p-3 rounded-2xl transition-all ${
                    isActive ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 shadow-lg scale-105' : ''
                  }`}>
                    <Icon 
                      className={`w-6 h-6 transition-all ${
                        isActive 
                          ? 'text-white stroke-[2.5]' 
                          : 'text-gray-500 group-hover:text-gray-300'
                      }`}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  {!isActive && (
                    <span className="text-[10px] font-medium text-gray-400">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Add Purchase Modal */}
      {showAddModal && (
        <AddPurchaseModal onClose={() => setShowAddModal(false)} />
      )}
    </>
  );
}
