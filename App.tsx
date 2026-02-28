
import React, { useState, useMemo, useEffect } from 'react';
import { IPHONE_MODELS, STORAGE_OPTIONS, FUNCTIONAL_CHECKS, COSMETIC_CHECKS } from './constants';
import { EvaluationState } from './types';
import { MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<EvaluationState>({
    model: IPHONE_MODELS[0].name,
    storage: STORAGE_OPTIONS[2].label,
    batteryHealth: 100,
    checks: {
      faceId: true,
      speaker: true,
      frontCamera: true,
      backCamera: true,
      cellular: true,
      displayFunctional: true,
      simReader: true,
      chargingPort: true,
      wifi: true,
      bluetooth: true,
      screenCracked: false,
      frontWear: false,
      backWear: false,
      backCracked: false,
    },
  });

  const [isPriceChanging, setIsPriceChanging] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const storageRestrictions = useMemo(() => {
    const m = state.model;
    const no64No128 = ['iPhone 15 Pro Max', 'iPhone 16 Pro Max', 'iPhone 17 Pro Max', 'iPhone 17 Pro'].includes(m);
    const no64Only = [
      'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15',
      'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro',
      'iPhone 13', 'iPhone 12 Pro Max', 'iPhone 17 Air', 'iPhone 17 Plus', 'iPhone 17'
    ].includes(m);
    return { no64No128, no64Only };
  }, [state.model]);

  const availableStorageOptions = useMemo(() => {
    return STORAGE_OPTIONS.filter(opt => {
      if (storageRestrictions.no64No128) return opt.label !== '64 GB' && opt.label !== '128 GB';
      if (storageRestrictions.no64Only) return opt.label !== '64 GB';
      return true;
    });
  }, [storageRestrictions]);

  useEffect(() => {
    const isStillAvailable = availableStorageOptions.find(opt => opt.label === state.storage);
    if (!isStillAvailable) {
      setState(prev => ({ ...prev, storage: availableStorageOptions[0].label }));
    }
  }, [availableStorageOptions, state.storage]);

  useEffect(() => {
    setIsPriceChanging(true);
    const timer = setTimeout(() => setIsPriceChanging(false), 300);
    return () => clearTimeout(timer);
  }, [state]);

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(prev => ({ ...prev, model: e.target.value }));
  };

  const handleStorageChange = (storageLabel: string) => {
    setState(prev => ({ ...prev, storage: storageLabel }));
  };

  const handleBatteryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, batteryHealth: parseInt(e.target.value) }));
  };

  const setCheck = (id: string, value: boolean) => {
    setState(prev => ({
      ...prev,
      checks: { ...prev.checks, [id]: value },
    }));
  };

  const evaluationResult = useMemo(() => {
    const selectedModel = IPHONE_MODELS.find(m => m.name === state.model);
    const selectedStorage = STORAGE_OPTIONS.find(s => s.label === state.storage);
    if (!selectedModel || !selectedStorage) return 0;

    const isFixedPriceModel = ['iPhone X', 'iPhone XS', 'iPhone XR', 'iPhone XS Max'].includes(state.model);
    if (isFixedPriceModel) return 50;

    if (!state.checks.faceId) {
      const isRecentSeries = state.model.includes('15') || state.model.includes('16') || state.model.includes('17');
      return isRecentSeries ? 100 : 50;
    }

    const estimatedMarketValue = selectedModel.baseMarketValue * selectedStorage.multiplier;
    let finalValue = estimatedMarketValue * 0.45;

    if (state.batteryHealth < 80) finalValue *= 0.70;
    else if (state.batteryHealth < 85) finalValue *= 0.90;

    FUNCTIONAL_CHECKS.forEach(check => {
      if (check.id !== 'faceId' && !state.checks[check.id]) {
        finalValue *= (1 - (check.penaltyPercent / 100));
      }
    });

    COSMETIC_CHECKS.forEach(check => {
      if (state.checks[check.id]) {
        if (check.id === 'backCracked' && /iPhone (14|15|16|17)/.test(state.model)) {
          finalValue -= 180;
        } else {
          finalValue *= (1 - (check.penaltyPercent / 100));
        }
      }
    });

    return Math.max(0, Math.round(finalValue));
  }, [state]);

  const isFixedPriceModel = ['iPhone X', 'iPhone XS', 'iPhone XR', 'iPhone XS Max'].includes(state.model);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
              <span className="text-tiffany-500 font-black text-2xl">iL</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">iPhoneLab</h1>
              <span className="text-[10px] font-bold text-tiffany-600 uppercase tracking-widest">Expert Valuation</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <button 
                onClick={() => setShowHowItWorks(!showHowItWorks)}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Come Funziona
              </button>
            </nav>
            <div className="h-10 w-[1px] bg-slate-100 hidden md:block"></div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase text-slate-500">Live Market Data</span>
            </div>
          </div>
        </div>
      </header>

      {showHowItWorks && (
        <div className="bg-tiffany-500 text-black py-4 px-6 text-center animate-in slide-in-from-top duration-300">
          <p className="text-xs font-black uppercase tracking-widest">
            Il software in base ai dati inseriti elaborerà la valutazione del telefono
          </p>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Colonna Sinistra */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
              <h2 className="serif text-4xl md:text-5xl font-black text-black mb-6 leading-tight">
                Vendi il tuo iPhone al <span className="text-tiffany-600 italic">giusto valore.</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-tiffany-100 text-tiffany-700 flex items-center justify-center font-black flex-shrink-0">1</div>
                  <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed">Seleziona il tuo modello e la memoria</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-tiffany-100 text-tiffany-700 flex items-center justify-center font-black flex-shrink-0">2</div>
                  <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed">Indica lo stato della batteria e difetti</p>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-tiffany-100 text-tiffany-700 flex items-center justify-center font-black flex-shrink-0">3</div>
                  <p className="text-xs font-bold text-slate-500 uppercase leading-relaxed">Ricevi la quotazione immediata AI</p>
                </div>
              </div>
            </div>

            {/* Configurazione */}
            <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-12">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Configurazione Modello</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Modello</span>
                    <select 
                      value={state.model}
                      onChange={handleModelChange}
                      className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-tiffany-500 outline-none transition-all font-bold text-lg cursor-pointer"
                    >
                      {IPHONE_MODELS.map(m => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Capacità</span>
                    <div className="grid grid-cols-3 gap-2">
                      {availableStorageOptions.map(opt => (
                        <button
                          key={opt.label}
                          onClick={() => handleStorageChange(opt.label)}
                          className={`py-4 rounded-xl text-xs font-black border-2 transition-all ${
                            state.storage === opt.label
                              ? 'bg-black border-black text-white'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-black'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                <div className="flex justify-between items-center mb-8">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Salute Batteria</label>
                  <span className={`text-xl font-black px-4 py-1 rounded-full ${state.batteryHealth >= 85 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {state.batteryHealth}%
                  </span>
                </div>
                <input 
                  type="range" min="50" max="100" 
                  value={state.batteryHealth}
                  onChange={handleBatteryChange}
                  disabled={isFixedPriceModel}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-tiffany-500"
                />
              </div>
            </section>

            {/* Checkbox Sezioni */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isFixedPriceModel ? 'opacity-20 pointer-events-none' : ''}`}>
              <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Funzionalità</h3>
                <div className="space-y-3">
                  {FUNCTIONAL_CHECKS.map(check => (
                    <button
                      key={check.id}
                      onClick={() => setCheck(check.id, !state.checks[check.id])}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        state.checks[check.id] ? 'bg-white border-slate-100' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-600 uppercase text-left leading-tight pr-4">{check.label}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${state.checks[check.id] ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {state.checks[check.id] ? '✓' : '✕'}
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Estetica</h3>
                <div className="space-y-3">
                  {COSMETIC_CHECKS.map(check => (
                    <button
                      key={check.id}
                      onClick={() => setCheck(check.id, !state.checks[check.id])}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        !state.checks[check.id] ? 'bg-white border-slate-100' : 'bg-amber-50 border-amber-200'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-600 uppercase text-left leading-tight pr-4">{check.label}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${!state.checks[check.id] ? 'bg-slate-100 text-slate-400' : 'bg-amber-500 text-white'}`}>
                        {state.checks[check.id] ? '!' : '✓'}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Colonna Destra */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-tiffany-500"></div>
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 text-center">Quotazione Finale</h3>
                
                <div className="text-center mb-10">
                  <div className={`text-7xl font-black italic transition-all duration-300 ${isPriceChanging ? 'scale-110 text-tiffany-600' : 'scale-100 text-black'}`}>
                    €{evaluationResult}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4">Prezzo stimato per ritiro immediato</p>
                </div>

                <div className="space-y-4">
                  <a 
                    href="https://wa.me/393489123708" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white font-black py-6 rounded-2xl hover:bg-[#20ba5a] transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-100 uppercase text-sm tracking-widest"
                  >
                    <MessageCircle size={22} />
                    CONTATTA PER IL RITIRO
                  </a>
                </div>

                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-tiffany-500 rounded-full"></div>
                    <span className="text-[9px] font-black uppercase text-slate-400">Lab Insight</span>
                  </div>
                  <p className="text-xs font-bold leading-relaxed text-slate-700 italic">"Ottieni la valutazione migliore per il tuo iPhone. Contattaci per fissare un appuntamento per il ritiro."</p>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-lg">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Perché iPhoneLab?</h4>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-center">
                    <div className="w-5 h-5 rounded-full bg-tiffany-500/20 text-tiffany-500 flex items-center justify-center text-[10px]">✓</div>
                    <span className="text-[11px] font-bold uppercase">Pagamento in 24 ore</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <div className="w-5 h-5 rounded-full bg-tiffany-500/20 text-tiffany-500 flex items-center justify-center text-[10px]">✓</div>
                    <span className="text-[11px] font-bold uppercase">Corriere gratuito a casa</span>
                  </li>
                  <li className="flex gap-3 items-center">
                    <div className="w-5 h-5 rounded-full bg-tiffany-500/20 text-tiffany-500 flex items-center justify-center text-[10px]">✓</div>
                    <span className="text-[11px] font-bold uppercase">Nessuna commissione</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-xl font-black italic uppercase tracking-tighter">iPhoneLab</div>
          <p className="text-[10px] font-bold text-slate-400 uppercase text-center">© 2025 iPhoneLab Italia - Valutazioni certificate AI</p>
          <div className="flex gap-8 text-[10px] font-black uppercase text-slate-400">
            <a href="#" className="hover:text-tiffany-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-tiffany-600 transition-colors">Termini</a>
            <a href="#" className="hover:text-tiffany-600 transition-colors">Lavora con noi</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
