"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RewardsHub from '@/components/rewards/RewardsHub';

export default function RewardsPage() {
  return (
    <ProtectedRoute>
      <RewardsHub />
    </ProtectedRoute>
  );
}

