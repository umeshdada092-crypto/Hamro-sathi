import React, { useState } from 'react';
import { Scale, RefreshCw } from 'lucide-react';

const UNITS = {
  land: [
    { name: 'Ropani', toSqFt: 5476 },
    { name: 'Aana', toSqFt: 342.25 },
    { name: 'Paisa', toSqFt: 85.56 },
    { name: 'Daam', toSqFt: 21.39 },
    { name: 'Bigha', toSqFt: 72900 },
    { name: 'Kattha', toSqFt: 3645 },
    { name: 'Dhur', toSqFt: 182.25 },
  ],
  weight: [
    { name: 'Tola', toGram: 11.66 },
    { name: 'Lal', toGram: 0.1166 },
  ]
};

export default function UnitConverter() {
  const [type, setType] = useState<'land' | 'weight'>('land');
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState(UNITS.land[0].name);

  const currentUnits = type === 'land' ? UNITS.land : UNITS.weight;
  const selectedUnit = currentUnits.find(u => u.name === fromUnit) || currentUnits[0];

  const calculateResults = () => {
    const val = parseFloat(value) || 0;
    if (type === 'land') {
      const sqFt = val * (selectedUnit as any).toSqFt;
      return UNITS.land.map(u => ({
        name: u.name,
        value: (sqFt / u.toSqFt).toFixed(4)
      }));
    } else {
      const grams = val * (selectedUnit as any).toGram;
      return UNITS.weight.map(u => ({
        name: u.name,
        value: (grams / u.toGram).toFixed(4)
      }));
    }
  };

  const results = calculateResults();

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-medium text-stone-800">Unit Converter</h2>
        <p className="text-stone-500 mt-1">Convert traditional Nepali units easily.</p>
      </header>

      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => { setType('land'); setFromUnit(UNITS.land[0].name); }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${type === 'land' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}
          >
            Land (Ropani/Bigha)
          </button>
          <button 
            onClick={() => { setType('weight'); setFromUnit(UNITS.weight[0].name); }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${type === 'weight' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'}`}
          >
            Gold/Silver (Tola)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Amount</label>
            <input 
              type="number" 
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">From Unit</label>
            <select 
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg font-medium appearance-none"
            >
              {currentUnits.map(u => (
                <option key={u.name} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-12">
          <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-6">Conversions</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {results.map(res => (
              <div key={res.name} className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                <p className="text-xs text-stone-500 font-medium">{res.name}</p>
                <p className="text-xl font-bold text-stone-800 mt-1">{res.value}</p>
              </div>
            ))}
            {type === 'land' && (
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <p className="text-xs text-emerald-600 font-bold">Square Feet</p>
                <p className="text-xl font-bold text-emerald-700 mt-1">
                  {(parseFloat(value) * (selectedUnit as any).toSqFt).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex gap-4 items-start">
        <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
          <RefreshCw size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900">Note on Land Units</p>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            In Nepal, land is measured in Ropani-Aana-Paisa-Daam (Hilly regions) or Bigha-Kattha-Dhur (Terai regions). 
            1 Ropani = 16 Aana, 1 Aana = 4 Paisa, 1 Paisa = 4 Daam.
          </p>
        </div>
      </div>
    </div>
  );
}
