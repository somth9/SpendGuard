"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PatternsDashboard from '@/components/patterns/PatternsDashboard';

export default function PatternsPage() {
  return (
    <ProtectedRoute>
      <PatternsDashboard />
    </ProtectedRoute>
  );
}

