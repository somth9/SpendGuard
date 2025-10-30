"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Settings } from 'lucide-react';

export default function ProfileHeader() {
  const { user } = useAuth();
  const router = useRouter();

  // Extract first name from display name
  const getFirstName = () => {
    if (!user?.displayName) return 'Friend';
    return user.displayName.split(' ')[0];
  };

  return (
    <header className="bg-[#0D0D0D] px-4 py-5 border-b border-gray-800">
      <div className="flex items-center justify-between">
        {/* Greeting */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white">
            Hello, {getFirstName()}
          </h1>
        </div>

        {/* Profile Picture */}
        <button 
          onClick={() => router.push('/dashboard/settings')}
          className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-gray-700 hover:border-coffee-500 transition-colors shadow-sm"
        >
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-coffee-400 to-coffee-500 flex items-center justify-center text-white font-semibold text-xl">
              {getFirstName()[0]}
            </div>
          )}
        </button>
      </div>
    </header>
  );
}

