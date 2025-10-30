"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ADHDTaxDashboard from '@/components/adhd-tax/ADHDTaxDashboard';

export default function ADHDTaxPage() {
  return (
    <ProtectedRoute>
      <ADHDTaxDashboard />
    </ProtectedRoute>
  );
}

