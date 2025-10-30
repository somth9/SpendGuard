"use client";

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardHome from '@/components/dashboard/DashboardHome';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardHome />
    </ProtectedRoute>
  );
}


