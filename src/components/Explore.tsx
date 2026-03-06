import React, { useState, useEffect } from 'react';
import { MapPin, Search, Navigation, ExternalLink, Loader2, Compass } from 'lucide-react';
import { searchNearbyPlaces } from '../services/gemini';
import { motion } from 'motion/react';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => console.log('Geolocation failed')
      );
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchNearbyPlaces(query, coords?.lat, coords?.lng);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const quickSearches = [
    'Temples near me',
    'Best Momo places',
    'Hospitals in Kathmandu',
    'Banks in Pokhara',
    'Tourist spots'
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-medium text-stone-800 dark:text-stone-100">Explore Nepal</h2>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Find places, services, and landmarks with AI-powered Maps search.</p>
      </header>

      <div className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 p-8 shadow-sm">
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="What are you looking for?"
              className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-stone-100"
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-600 text-white px-8 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Navigation size={20} />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickSearches.map(s => (
            <button 
              key={s}
              onClick={() => { setQuery(s); }}
              className="px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">Results</h3>
            {results.places.length > 0 ? results.places.map((place: any, i: number) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-stone-800 dark:text-stone-100 group-hover:text-emerald-600 transition-colors">{place.title}</h4>
                      <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{place.uri}</p>
                    </div>
                  </div>
                  <a 
                    href={place.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-400 hover:text-emerald-600 transition-colors"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </motion.div>
            )) : (
              <div className="bg-white dark:bg-stone-900 p-12 rounded-3xl border border-stone-200 dark:border-stone-800 text-center">
                <Compass className="mx-auto text-stone-300 mb-4" size={48} />
                <p className="text-stone-500">No specific places found. Try a different query.</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4">AI Summary</h3>
            <div className="bg-emerald-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm leading-relaxed text-emerald-100 italic">
                  "{results.text}"
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
