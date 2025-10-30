"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SettingsScreen from '@/components/settings/SettingsScreen';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsScreen />
    </ProtectedRoute>
  );
}

