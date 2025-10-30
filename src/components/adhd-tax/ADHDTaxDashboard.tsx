"use client";

import React, { useState } from 'react';
import ProfileHeader from '../layout/ProfileHeader';
import { useSpendGuard } from '@/lib/contexts/SpendGuardContext';
import type { ADHDTaxType } from '@/lib/types/models';
import ADHDTaxCalendar from './ADHDTaxCalendar';
import { FileText, Clock, Smartphone, RotateCcw, Package, Users, Building2, Search, Calendar, Lightbulb, X } from 'lucide-react';

export default function ADHDTaxDashboard() {
  const { adhdTaxItems, userStats, addADHDTaxItem, loading } = useSpendGuard();
  const [view, setView] = useState<'month' | 'year'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Calculate current month's items
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyItems = adhdTaxItems.filter(item => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
  });
  
  const monthlyTotal = monthlyItems.reduce((sum, item) => sum + item.amount, 0);
  const yearlyTotal = userStats.adhdTaxTotal; // Total from all time

  const taxByType = monthlyItems.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <ProfileHeader />
      
      <div className="p-4 pb-24">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            ADHD Tax Calculator
          </h1>
          <p className="text-gray-400 text-sm">
            Understanding your extra costs
          </p>
        </header>

      {/* Total Card */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-lg mb-6 border border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={() => setView('month')}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  view === 'month' 
                    ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white' 
                    : 'bg-[#2A2A2A] text-gray-400'
                }`}
              >
                This Month
              </button>
              <button 
                onClick={() => setView('year')}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                  view === 'year' 
                    ? 'bg-gradient-to-br from-coffee-400 to-coffee-500 text-white' 
                    : 'bg-[#2A2A2A] text-gray-400'
                }`}
              >
                This Year
              </button>
            </div>
            <p className="text-6xl font-bold text-coffee-400 mb-2">
              ${view === 'month' ? monthlyTotal.toFixed(2) : yearlyTotal.toFixed(2)}
            </p>
            <p className="text-gray-400">
              in ADHD tax {view === 'month' ? 'this month' : 'this year'}
            </p>
          </div>
          <div className="w-20 h-20 bg-coffee-500/20 rounded-2xl flex items-center justify-center border border-coffee-500/30">
            <FileText className="w-10 h-10 text-coffee-400" strokeWidth={2} />
          </div>
        </div>

        {/* Insight Box */}
        <div className="bg-coffee-500/10 border border-coffee-500/30 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-coffee-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-sm text-gray-300">
              <span className="font-bold text-white">Good news:</span> Most of this is preventable! 
              Small changes like autopay and subscription audits could save you ~${(monthlyTotal * 0.7).toFixed(0)}/month.
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown by Category */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-md mb-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4">
          Breakdown by Type
        </h3>
        <div className="space-y-3">
          {Object.entries(taxByType).map(([type, amount]) => (
            <TaxTypeRow key={type} type={type} amount={amount} />
          ))}
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-[#1A1A1A] rounded-3xl p-6 shadow-md border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            Recent Items
          </h3>
          <button 
            onClick={() => setShowAddModal(true)}
            className="text-sm text-white bg-gradient-to-br from-coffee-400 to-coffee-500 px-4 py-2 rounded-xl font-medium hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            + Add Item
          </button>
        </div>
        
        {/* Calendar View */}
        {!loading && (
          <div className="mb-6 p-4 bg-[#2A2A2A] rounded-2xl border border-gray-800">
            <ADHDTaxCalendar items={adhdTaxItems} />
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-500 mx-auto"></div>
          </div>
        ) : monthlyItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No ADHD tax items this month. Great!</p>
          </div>
        ) : (
          <>
            <h4 className="text-lg font-bold text-white mb-3">Item List</h4>
            <div className="space-y-3">
              {monthlyItems.slice(0, 5).map(item => (
                <TaxItemRow key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Add ADHD Tax Modal */}
      {showAddModal && (
        <AddADHDTaxModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (type, amount, description) => {
            await addADHDTaxItem({ type, amount, description });
            setShowAddModal(false);
          }}
        />
      )}
      </div>
    </div>
  );
}

function TaxTypeRow({ type, amount }: { type: string; amount: number }) {
  const typeInfo: Record<string, { label: string; IconComponent: React.ComponentType<{ className?: string; strokeWidth?: number }>; color: string }> = {
    late_fee: { label: 'Late Fees', IconComponent: Clock, color: 'bg-red-900/30 text-red-400 border border-red-800/50' },
    unused_subscription: { label: 'Unused Subscriptions', IconComponent: Smartphone, color: 'bg-purple-900/30 text-purple-400 border border-purple-800/50' },
    impulse_return: { label: 'Impulse Returns', IconComponent: RotateCcw, color: 'bg-orange-900/30 text-orange-400 border border-orange-800/50' },
    expedited_shipping: { label: 'Rush Shipping', IconComponent: Package, color: 'bg-blue-900/30 text-blue-400 border border-blue-800/50' },
    duplicate: { label: 'Duplicate Purchases', IconComponent: Users, color: 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' },
    overdraft: { label: 'Overdraft Fees', IconComponent: Building2, color: 'bg-pink-900/30 text-pink-400 border border-pink-800/50' },
    lost_item: { label: 'Lost Item Replacement', IconComponent: Search, color: 'bg-indigo-900/30 text-indigo-400 border border-indigo-800/50' },
    forgotten_appointment: { label: 'Missed Appointments', IconComponent: Calendar, color: 'bg-teal-900/30 text-teal-400 border border-teal-800/50' }
  };

  const info = typeInfo[type] || { label: 'Other', IconComponent: FileText, color: 'bg-gray-800 text-gray-400 border border-gray-700' };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center`}>
          <info.IconComponent className="w-6 h-6" strokeWidth={2} />
        </div>
        <span className="font-medium text-white">{info.label}</span>
      </div>
      <span className="text-xl font-bold text-coffee-400">${amount.toFixed(2)}</span>
    </div>
  );
}

interface TaxItem {
  id: string;
  type: ADHDTaxType;
  amount: number;
  description: string;
  date: Date;
}

function TaxItemRow({ item }: { item: TaxItem }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-800 last:border-0">
      <div>
        <p className="font-medium text-white">{item.description}</p>
        <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
      </div>
      <span className="font-bold text-coffee-400">${item.amount.toFixed(2)}</span>
    </div>
  );
}

// Add ADHD Tax Modal Component
interface AddADHDTaxModalProps {
  onClose: () => void;
  onAdd: (type: ADHDTaxType, amount: number, description: string) => Promise<void>;
}

function AddADHDTaxModal({ onClose, onAdd }: AddADHDTaxModalProps) {
  const [formData, setFormData] = useState({
    type: 'late_fee' as ADHDTaxType,
    amount: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(formData.type, amount, formData.description);
      alert('ADHD Tax item added');
    } catch (error) {
      console.error('Error adding ADHD tax item:', error);
      alert('Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#1A1A1A] rounded-t-3xl shadow-2xl animate-slide-up border-t border-gray-800" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Add ADHD Tax Item</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#2A2A2A] transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type of ADHD Tax
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ADHDTaxType })}
              className="w-full px-4 py-3 border border-gray-700 bg-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-white"
            >
              <option value="late_fee">Late Fee</option>
              <option value="unused_subscription">Unused Subscription</option>
              <option value="impulse_return">Impulse Return Fee</option>
              <option value="overdraft">Overdraft Fee</option>
              <option value="duplicate">Duplicate Purchase</option>
              <option value="expedited_shipping">Rush Shipping</option>
              <option value="lost_item">Lost Item Replacement</option>
              <option value="forgotten_appointment">Missed Appointment Fee</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 border border-gray-700 bg-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-white"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Netflix subscription I forgot to cancel"
              className="w-full px-4 py-3 border border-gray-700 bg-[#2A2A2A] rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-white"
              required
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-br from-coffee-400 to-coffee-500 text-white font-semibold py-4 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-md"
          >
            {isSubmitting ? 'Adding...' : 'Add ADHD Tax Item'}
          </button>
        </form>
      </div>
    </div>
  );
}

