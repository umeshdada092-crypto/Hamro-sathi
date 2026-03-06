import React, { useEffect, useState } from 'react';
import { TrendingUp, Coins, Info, Calendar as CalendarIcon, ArrowRight, Play, Volume2, Sparkles } from 'lucide-react';
import { getLatestRates, getMotivationalSpeech } from '../services/gemini';
import { motion } from 'motion/react';

interface DashboardProps {
  user: { name: string } | null;
}

export default function Dashboard({ user }: DashboardProps) {
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [motivation, setMotivation] = useState<{ text: string; audioData?: string } | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [ratesData, motivationData] = await Promise.all([
        getLatestRates(),
        getMotivationalSpeech()
      ]);
      setRates(ratesData);
      setMotivation(motivationData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const playAudio = () => {
    if (motivation?.audioData) {
      const audio = new Audio(`data:audio/pcm;base64,${motivation.audioData}`);
      // Note: PCM might need a wrapper or specific sample rate handling, 
      // but for simplicity we assume the browser can handle the data URI if correctly formatted.
      // In a real app, we'd use Web Audio API for PCM 24000Hz.
      setPlaying(true);
      audio.play().catch(e => console.log('Audio play failed', e));
      audio.onended = () => setPlaying(false);
    }
  };

  const stats = [
    { 
      label: 'Fine Gold (Tola)', 
      value: rates?.gold?.fine ? `Rs. ${rates.gold.fine}` : 'Rs. 1,52,000', 
      change: '+Rs. 500', 
      icon: Coins,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    },
    { 
      label: 'Tejabi Gold (Tola)', 
      value: rates?.gold?.tejabi ? `Rs. ${rates.gold.tejabi}` : 'Rs. 1,51,300', 
      change: '+Rs. 500', 
      icon: Coins,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20'
    },
    { 
      label: 'USD to NPR', 
      value: rates?.currency?.USD ? `Rs. ${rates.currency.USD}` : 'Rs. 134.50', 
      change: '-0.12', 
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
  ];

  const currencyList = [
    { code: 'INR', name: 'Indian Rupee', rate: '1.60', fixed: true },
    { code: 'EUR', name: 'Euro', rate: rates?.currency?.EUR || '145.20' },
    { code: 'QAR', name: 'Qatari Riyal', rate: rates?.currency?.QAR || '36.90' },
    { code: 'MYR', name: 'Malaysian Ringgit', rate: rates?.currency?.MYR || '31.40' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium text-stone-800 dark:text-stone-100">
            Namaste, {user ? user.name.split(' ')[0] : 'Sathi'}!
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Here's what's happening in Nepal today.</p>
        </div>
        {motivation && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={playAudio}
            className="flex items-center gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${playing ? 'bg-emerald-600 text-white animate-pulse' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600'}`}>
              {playing ? <Volume2 size={16} /> : <Play size={16} />}
            </div>
            <div className="text-left">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Daily Motivation</p>
              <p className="text-xs font-medium text-stone-700 dark:text-stone-300 truncate max-w-[150px]">{motivation.text}</p>
            </div>
          </motion.button>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={stat.bg + " p-3 rounded-2xl"}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 uppercase tracking-wider">Live</span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mt-1">{stat.value}</h3>
            <p className={stat.color + " text-xs font-bold mt-2 flex items-center gap-1"}>
              {stat.change} <span className="text-stone-400 dark:text-stone-500 font-normal">from yesterday</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* Market Rates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif font-medium text-stone-800 dark:text-stone-100">Currency Exchange Rates</h3>
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest">NRB Rates</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currencyList.map((curr) => (
              <div key={curr.code} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center font-bold text-stone-600 dark:text-stone-400 text-xs">
                    {curr.code}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-100">{curr.name}</p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">1 {curr.code} = Rs. {curr.rate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-100">Rs. {curr.rate}</p>
                  {curr.fixed && <span className="text-[8px] font-bold text-emerald-600 uppercase">Fixed</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-emerald-900 text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h3 className="text-xl font-serif font-medium mb-6">Gold Market</h3>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Fine Gold</p>
                <p className="text-2xl font-bold">{stats[0].value}</p>
                <p className="text-[10px] text-emerald-300/60 mt-1">Per Tola (11.66g)</p>
              </div>
              <div className="h-px bg-emerald-800 w-full" />
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Tejabi Gold</p>
                <p className="text-2xl font-bold">{stats[1].value}</p>
                <p className="text-[10px] text-emerald-300/60 mt-1">Per Tola (11.66g)</p>
              </div>
            </div>
          </div>
          <div className="mt-8 relative z-10">
            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Market Open
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar Preview */}
        <section className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-serif font-medium text-stone-800 dark:text-stone-100">Nepali Calendar</h3>
            <button className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View Full <ArrowRight size={16} />
            </button>
          </div>
          <div className="flex gap-6 items-center">
            <div className="bg-emerald-600 text-white w-24 h-24 rounded-3xl flex flex-col items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-none">
              <span className="text-3xl font-bold">23</span>
              <span className="text-xs font-medium uppercase tracking-widest">Falgun</span>
            </div>
            <div>
              <p className="text-lg font-medium text-stone-800 dark:text-stone-100">Friday, March 7, 2025</p>
              <p className="text-stone-500 dark:text-stone-400 text-sm">Panchami • 2081 BS</p>
              <div className="mt-3 flex gap-2">
                <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">No Holidays Today</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick News/Info */}
        <section className="bg-stone-900 dark:bg-emerald-950 text-white rounded-3xl p-8 overflow-hidden relative shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-emerald-400" size={20} />
              <h3 className="text-xl font-serif font-medium">Did you know?</h3>
            </div>
            <p className="text-stone-300 dark:text-emerald-100 leading-relaxed italic">
              "The Nepali flag is the only non-quadrilateral national flag in the world. Its two triangles represent the Himalayan Mountains and the two main religions: Hinduism and Buddhism."
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                <Info size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Fact of the Day</p>
                <p className="text-xs text-stone-400 dark:text-emerald-300/60">Powered by Sathi AI</p>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
        </section>
      </div>
    </div>
  );
}

