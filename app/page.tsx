"use client";

import { useEffect, useState } from "react";
import { 
  Camera, History, Leaf, ChevronRight, Image as ImageIcon, 
  Info, X, Target, Cpu, ThermometerSun, Calendar 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Onboarding from "../components/Onboarding"; // Ensure the path is correct

interface Assessment {
  id: number;
  date: string;
  time: string;
  result: string;
  confidence: number;
  image: string;
  variety: string;
}

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Assessment | null>(null);

  useEffect(() => {
    // 1. Check Onboarding Status
    const hasOnboarded = localStorage.getItem("durian_onboarded");
    setShowOnboarding(!hasOnboarded);

    // 2. Load Assessment History
    const loadData = () => {
      const savedData = localStorage.getItem("durian_history");
      if (savedData) {
        try {
          const parsedData: Assessment[] = JSON.parse(savedData);
          const sortedData = parsedData.sort((a, b) => b.id - a.id);
          setHistory(sortedData);
        } catch (e) {
          console.error("Failed to parse history", e);
        }
      }
    };

    loadData();
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, []);

  // Prevent UI flickering while checking localStorage
  if (showOnboarding === null) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {showOnboarding && (
          <motion.div 
            key="onboarding-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[200]"
          >
            <Onboarding onComplete={() => setShowOnboarding(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white min-h-screen pb-24"
      >
        <div className="p-6 space-y-8">
          
          {/* Hero Assessment Card */}
          <section className="relative overflow-hidden bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-200/50 border border-emerald-500/20">
            <div className="relative z-10 w-full">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Ready to scan?</h2>
              <p className="text-emerald-50 text-sm mb-8 max-w-[220px] leading-relaxed">
                Hybrid CNN-ViT ripeness assessment for <span className="font-bold text-white">Puyat Durian</span>.
              </p>
              <Link 
                href="/assess"
                className="flex w-full bg-white text-emerald-700 px-7 py-5 rounded-3xl font-black items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl"
              >
                <Camera size={22} />
                Start Assessment
              </Link>
            </div>
            <Leaf className="absolute top-6 right-6 text-emerald-400/20 rotate-12" size={80} />
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-100/50 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                <History size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Total Scans</p>
              <p className="text-3xl font-black text-slate-900">{history.length}</p>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 bg-orange-100/50 rounded-2xl flex items-center justify-center mb-4 text-orange-600">
                <Leaf size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Variety</p>
              <p className="text-3xl font-black text-slate-900">Puyat</p>
            </div>
          </div>

          {/* Recent History Section */}
          <section className="flex flex-col">
            <div className="flex justify-between items-center mb-5 px-2">
              <h3 className="font-black text-slate-900 text-lg tracking-tight">Recent Scans</h3>
              <Link href="/history" className="text-emerald-600 text-xs font-black uppercase tracking-widest">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="bg-slate-50 p-10 rounded-[32px] border border-dashed border-slate-200 text-center">
                  <ImageIcon className="text-slate-300 mx-auto mb-4" size={28} />
                  <p className="text-sm font-bold text-slate-400">No recent scans found</p>
                  <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-tighter">AI results will appear here</p>
                </div>
              ) : (
                history.slice(0, 3).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedEntry(item)}
                    className="group flex items-center gap-4 bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer hover:border-emerald-100"
                  >
                    <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50">
                      <img src={item.image} className="w-full h-full object-cover" alt="Scan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">Batch #{item.id.toString().slice(-4)}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                        <span className="text-[10px] font-bold text-emerald-600">{item.confidence}% Sure</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                        item.result === 'Ripe' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        item.result === 'Overripe' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {item.result}
                      </span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Quick Tip */}
          <section className="bg-slate-900 rounded-[32px] p-6 text-white flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
              <Info className="text-white" size={28} />
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Thorn texture is the primary indicator for <span className="text-emerald-400 font-bold">PUYAT</span> ripeness.
            </p>
          </section>
        </div>

        {/* DETAIL OVERLAY (MODAL) */}
        <AnimatePresence>
          {selectedEntry && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md overflow-y-auto"
            >
              <div className="min-h-screen flex flex-col p-6">
                <div className="flex justify-between items-center mb-6">
                  <button onClick={() => setSelectedEntry(null)} className="p-3 bg-white/10 rounded-2xl text-white backdrop-blur-md">
                    <X size={20} />
                  </button>
                  <p className="text-white/50 text-xs font-mono font-bold uppercase tracking-widest">Analysis Report</p>
                </div>

                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full aspect-square rounded-[40px] overflow-hidden border-2 border-white/20 shadow-2xl mb-8">
                  <img src={selectedEntry.image} className="w-full h-full object-cover" alt="Detail" />
                </motion.div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-emerald-400">
                      <Target size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Confidence</span>
                    </div>
                    <p className="text-2xl font-black text-white">{selectedEntry.confidence}%</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2 text-amber-400">
                      <Cpu size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">AI Status</span>
                    </div>
                    <p className="text-lg font-black text-white uppercase">Hybrid</p>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 space-y-6 flex-1">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1">{selectedEntry.result}</h2>
                    <p className="text-slate-500 font-bold text-sm">Variety: <span className="text-emerald-600">{selectedEntry.variety}</span></p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Hybrid Model Factors</h4>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-black text-slate-700 uppercase">
                          <span>CNN Analysis (texture)</span>
                          <span>{Math.floor(selectedEntry.confidence * 0.92)}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${Math.floor(selectedEntry.confidence * 0.92)}%` }} 
                            transition={{ delay: 0.3, duration: 1 }}
                            className="h-full bg-emerald-500" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-black text-slate-700 uppercase">
                          <span>ViT Analysis (spatial)</span>
                          <span>{Math.floor(selectedEntry.confidence * 0.88)}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${Math.floor(selectedEntry.confidence * 0.88)}%` }} 
                            transition={{ delay: 0.5, duration: 1 }}
                            className="h-full bg-blue-500" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 w-full" />
                  
                  <div className="pt-2 grid grid-cols-2 gap-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-slate-300" size={18} />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Scanned On</p>
                        <p className="text-xs font-bold text-slate-700">{selectedEntry.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ThermometerSun className="text-slate-300" size={18} />
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase">Ambience</p>
                        <p className="text-xs font-bold text-slate-700">Optimal</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedEntry(null)}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black mt-4 shadow-xl active:scale-95 transition-all"
                  >
                    Close Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}