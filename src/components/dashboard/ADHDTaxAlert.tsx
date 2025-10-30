"use client";

import React from 'react';

interface ADHDTaxAlertProps {
  monthlyTotal: number;
}

export function ADHDTaxAlert({ monthlyTotal }: ADHDTaxAlertProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-red-100">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            ADHD Tax 📊
          </h3>
          <p className="text-gray-600 text-sm">
            This month&apos;s extra costs
          </p>
        </div>
        <span className="text-3xl">🧾</span>
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className="text-4xl font-bold text-red-500">
          ${monthlyTotal}
        </span>
        <span className="text-gray-500 text-sm mb-1">
          in fees & forgotten items
        </span>
      </div>

      <div className="bg-red-50 rounded-xl p-3 mb-3">
        <p className="text-sm text-gray-700">
          💡 <span className="font-medium">Tip:</span> Most of these are late fees. 
          Setting up autopay could save you ~$30/month.
        </p>
      </div>

      <button className="w-full bg-red-100 text-red-700 font-semibold py-3 rounded-xl hover:bg-red-200 active:scale-98 transition-all">
        View Breakdown
      </button>
    </div>
  );
}

