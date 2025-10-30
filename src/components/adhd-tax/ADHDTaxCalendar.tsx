"use client";

import React, { useState } from 'react';
import type { ADHDTaxItem, ADHDTaxType } from '@/lib/types/models';

interface ADHDTaxCalendarProps {
  items: ADHDTaxItem[];
}

// Color scheme for different ADHD tax types
const taxTypeColors: Record<ADHDTaxType, { bg: string; border: string; label: string }> = {
  late_fee: { 
    bg: 'bg-red-900/30', 
    border: 'border-red-800/50', 
    label: 'Late Fees'
  },
  unused_subscription: { 
    bg: 'bg-purple-900/30', 
    border: 'border-purple-800/50', 
    label: 'Unused Subscriptions'
  },
  impulse_return: { 
    bg: 'bg-orange-900/30', 
    border: 'border-orange-800/50', 
    label: 'Impulse Returns'
  },
  expedited_shipping: { 
    bg: 'bg-blue-900/30', 
    border: 'border-blue-800/50', 
    label: 'Rush Shipping'
  },
  duplicate: { 
    bg: 'bg-yellow-900/30', 
    border: 'border-yellow-800/50', 
    label: 'Duplicate Purchases'
  },
  overdraft: { 
    bg: 'bg-pink-900/30', 
    border: 'border-pink-800/50', 
    label: 'Overdraft Fees'
  },
  lost_item: { 
    bg: 'bg-indigo-900/30', 
    border: 'border-indigo-800/50', 
    label: 'Lost Item Replacement'
  },
  forgotten_appointment: { 
    bg: 'bg-teal-900/30', 
    border: 'border-teal-800/50', 
    label: 'Missed Appointments'
  },
  other: { 
    bg: 'bg-gray-800', 
    border: 'border-gray-700', 
    label: 'Other'
  }
};

export default function ADHDTaxCalendar({ items }: ADHDTaxCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Get calendar information
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  
  // Group items by day
  const itemsByDay: Record<number, ADHDTaxItem[]> = {};
  items.forEach(item => {
    const itemDate = new Date(item.date);
    if (itemDate.getMonth() === month && itemDate.getFullYear() === year) {
      const day = itemDate.getDate();
      if (!itemsByDay[day]) {
        itemsByDay[day] = [];
      }
      itemsByDay[day].push(item);
    }
  });
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayItems = itemsByDay[day] || [];
    const isToday = 
      new Date().getDate() === day && 
      new Date().getMonth() === month && 
      new Date().getFullYear() === year;
    
    calendarDays.push(
      <DayCell 
        key={day}
        day={day}
        items={dayItems}
        isToday={isToday}
        isSelected={selectedDay === day}
        onClick={() => setSelectedDay(selectedDay === day ? null : day)}
      />
    );
  }
  
  // Get selected day items
  const selectedDayItems = selectedDay ? itemsByDay[selectedDay] || [] : [];
  
  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };
  
  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <span className="text-xl text-gray-400">←</span>
        </button>
        
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-bold text-white">{monthName}</h4>
          <button
            onClick={goToToday}
            className="text-xs px-3 py-1 bg-gradient-to-br from-coffee-400 to-coffee-500 text-white rounded-lg hover:scale-105 active:scale-95 transition-all font-medium shadow-md"
          >
            Today
          </button>
        </div>
        
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-[#1A1A1A] rounded-lg transition-colors"
          aria-label="Next month"
        >
          <span className="text-xl text-gray-400">→</span>
        </button>
      </div>
      
      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays}
      </div>
      
      {/* Color Key/Legend */}
      <div className="pt-4 border-t border-gray-800">
        <h5 className="text-sm font-bold text-white mb-3">Color Key</h5>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(taxTypeColors).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${config.bg} border ${config.border}`} />
              <span className="text-xs text-gray-300">
                {config.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Selected Day Details */}
      {selectedDay && selectedDayItems.length > 0 && (
        <div className="mt-4 p-4 bg-[#1A1A1A] rounded-2xl border border-gray-800">
          <h5 className="font-bold text-white mb-3">
            {monthName.split(' ')[0]} {selectedDay} - {selectedDayItems.length} item(s)
          </h5>
          <div className="space-y-2">
            {selectedDayItems.map(item => (
              <div key={item.id} className="flex items-start justify-between p-3 bg-[#2A2A2A] rounded-lg border border-gray-800">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {taxTypeColors[item.type].label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
                <span className="text-sm font-bold text-coffee-400 ml-2">
                  ${item.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-400">Day Total:</span>
              <span className="text-lg font-bold text-coffee-400">
                ${selectedDayItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface DayCellProps {
  day: number;
  items: ADHDTaxItem[];
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function DayCell({ day, items, isToday, isSelected, onClick }: DayCellProps) {
  // Get unique types for this day
  const types = [...new Set(items.map(item => item.type))];
  const hasItems = items.length > 0;
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <button
      onClick={onClick}
      className={`
        aspect-square p-1 rounded-lg border-2 transition-all relative
        ${hasItems ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
        ${isSelected ? 'ring-2 ring-coffee-500 scale-105' : ''}
        ${isToday ? 'border-coffee-400' : 'border-gray-800'}
        ${hasItems ? 'font-semibold' : ''}
      `}
    >
      {/* Day number */}
      <div className={`text-xs ${isToday ? 'text-coffee-400' : 'text-gray-400'}`}>
        {day}
      </div>
      
      {/* Color indicators for tax types */}
      {hasItems && (
        <div className="mt-0.5 space-y-0.5">
          {/* Show up to 3 color dots for different types */}
          <div className="flex gap-0.5 justify-center flex-wrap">
            {types.slice(0, 3).map(type => (
              <div
                key={type}
                className={`w-2 h-2 rounded-full ${taxTypeColors[type].bg} border ${taxTypeColors[type].border}`}
              />
            ))}
            {types.length > 3 && (
              <div className="w-2 h-2 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center">
                <span className="text-[6px] font-bold text-gray-400">+</span>
              </div>
            )}
          </div>
          
          {/* Amount */}
          <div className="text-[8px] font-bold text-coffee-400 leading-none">
            ${totalAmount > 999 ? '999+' : totalAmount.toFixed(0)}
          </div>
        </div>
      )}
      
      {/* Today indicator */}
      {isToday && !hasItems && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-coffee-500" />
      )}
    </button>
  );
}

