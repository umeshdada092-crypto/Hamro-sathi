import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { NEPALI_MONTHS, NEPALI_DAYS } from '../types';
import { getNepaliCalendarData } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(10); // Falgun (0-indexed is 10)
  const [currentYear, setCurrentYear] = useState(2081);
  const [calendarData, setCalendarData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getNepaliCalendarData(currentYear, currentMonth);
      setCalendarData(data);
      setLoading(false);
    }
    fetchData();
  }, [currentMonth, currentYear]);

  const handlePrev = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const daysInMonth = calendarData?.daysInMonth || 30;
  const startDay = calendarData?.startDay || 0;
  const holidays = calendarData?.holidays || [];
  const adMonth = calendarData?.adMonth || 'Mar';
  const adStartDay = calendarData?.adStartDay || 13;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-medium text-stone-800">
            {NEPALI_MONTHS[currentMonth]} {currentYear}
          </h2>
          <p className="text-stone-500 mt-1">Bikram Sambat Calendar</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handlePrev}
            disabled={loading}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNext}
            disabled={loading}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-600" size={32} />
          </div>
        )}
        
        <div className="grid grid-cols-7 border-b border-stone-100">
          {NEPALI_DAYS.map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-bold uppercase tracking-widest text-stone-400">
              {day.substring(0, 3)}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {blanks.map(i => (
            <div key={`blank-${i}`} className="h-24 md:h-32 border-r border-b border-stone-50 bg-stone-50/30" />
          ))}
          {days.map(day => {
            const holiday = holidays.find((h: any) => h.day === day);
            const isToday = currentYear === 2081 && currentMonth === 10 && day === 23;
            return (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={day} 
                className={`h-24 md:h-32 border-r border-b border-stone-50 p-2 md:p-4 transition-colors hover:bg-stone-50 relative ${isToday ? 'bg-emerald-50/50' : ''}`}
              >
                <span className={`text-sm md:text-lg font-medium ${isToday ? 'text-emerald-700' : 'text-stone-700'}`}>
                  {day}
                </span>
                {isToday && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
                )}
                {holiday && (
                  <div className="mt-1">
                    <p className="text-[8px] md:text-[10px] font-bold text-red-500 leading-tight uppercase">
                      {holiday.name}
                    </p>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 text-[8px] md:text-[10px] text-stone-300 font-medium">
                  {day + adStartDay - 1} {adMonth}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-200">
          <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">Major Festivals</h4>
          <div className="space-y-4">
            {holidays.length > 0 ? holidays.map((h: any) => (
              <div key={h.name} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  {h.day}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">{h.name}</p>
                  <p className="text-xs text-stone-500">{NEPALI_MONTHS[currentMonth]} {h.day}, {currentYear}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-stone-400 italic">No major festivals this month.</p>
            )}
          </div>
        </div>
        <div className="bg-emerald-900 text-white p-6 rounded-3xl overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">Calendar Info</h4>
            <p className="text-2xl font-serif italic">{NEPALI_MONTHS[currentMonth]}</p>
            <p className="text-xs text-emerald-200/60 mt-2">
              Bikram Sambat is the historical Hindu calendar used in Nepal. 
              It is approximately 56 years and 8 months ahead of the Gregorian calendar.
            </p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
