"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import WishlistGrid from '@/components/impulse/WishlistGrid';

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistGrid />
    </ProtectedRoute>
  );
}

