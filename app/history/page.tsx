"use client";

import { useEffect, useState } from "react";
import { Calendar, Search, Trash2, X, Image as ImageIcon, Check, ListChecks, Target, Cpu, ThermometerSun, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Update interface to include more mock details if needed
interface Assessment {
  id: number;
  date: string;
  time: string;
  result: string;
  confidence: number;
  image: string;
  variety: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Now storing the full object instead of just the image string
  const [selectedEntry, setSelectedEntry] = useState<Assessment | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("durian_history") || "[]");
    setHistory(data);
  }, []);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedIds.length} selected scans?`)) {
      const updatedHistory = history.filter(item => !selectedIds.includes(item.id));
      setHistory(updatedHistory);
      localStorage.setItem("durian_history", JSON.stringify(updatedHistory));
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "Ripe": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Unripe": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Overripe": return "bg-rose-50 text-rose-700 border-rose-100";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filteredHistory = history.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.result.toLowerCase().includes(searchLower) ||
      item.date.toLowerCase().includes(searchLower) ||
      item.variety.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white min-h-screen pb-32">
      
      {/* FIXED SEARCH HEADER (Same as before) */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
         <div className="px-6 py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full pl-11 pr-11 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center px-1">
            <div className="flex flex-col">
              <h3 className="font-black text-slate-900 text-lg tracking-tight leading-none">
                {isSelectionMode ? `${selectedIds.length} Selected` : 'History'}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {filteredHistory.length} Total Scans
              </span>
            </div>
            
            <button 
              onClick={() => {
                setIsSelectionMode(!isSelectionMode);
                setSelectedIds([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                isSelectionMode 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}
            >
              {isSelectionMode ? <><X size={14}/> Cancel</> : <><ListChecks size={16}/> Select</>}
            </button>
          </div>
        </div>
      </div>

      {/* LIST CONTENT */}
      <div className="p-6 relative z-10">
        <div className="space-y-4">
          {filteredHistory.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              onClick={() => isSelectionMode ? toggleSelection(item.id) : setSelectedEntry(item)}
              className={`relative group bg-white rounded-[28px] border p-4 transition-all cursor-pointer shadow-sm active:scale-[0.98] ${
                selectedIds.includes(item.id) 
                  ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' 
                  : 'border-slate-100 hover:border-emerald-100'
              }`}
            >
              <div className="flex items-center gap-4">
                {isSelectionMode && (
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedIds.includes(item.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'
                  }`}>
                    {selectedIds.includes(item.id) && <Check size={14} className="text-white" />}
                  </div>
                )}

                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-50">
                  <img src={item.image} alt="Scan" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-slate-900 text-sm truncate">{item.variety}</p>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${getResultColor(item.result)}`}>
                      {item.result}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={12} />
                    <span className="text-[11px] font-bold">{item.date} • {item.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ENHANCED DETAIL MODAL */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md overflow-y-auto"
          >
            <div className="min-h-screen flex flex-col p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="p-3 bg-white/10 rounded-2xl text-white backdrop-blur-md"
                >
                  <X size={20} />
                </button>
                <div className="text-right">
                  <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Assessment ID</p>
                  <p className="text-white text-xs font-mono font-bold">#{selectedEntry.id.toString().slice(-6)}</p>
                </div>
              </div>

              {/* Image Preview */}
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="w-full aspect-square rounded-[40px] overflow-hidden border-2 border-white/20 shadow-2xl mb-8"
              >
                <img src={selectedEntry.image} className="w-full h-full object-cover" alt="Detail" />
              </motion.div>

              {/* Info Cards */}
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
                    <span className="text-[10px] font-black uppercase tracking-widest">Accuracy</span>
                  </div>
                  <p className="text-2xl font-black text-white">98.2%</p>
                </div>
              </div>

              {/* Full Details Section */}
              <div className="bg-white rounded-[32px] p-8 space-y-6 flex-1">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-1">{selectedEntry.result}</h2>
                  <p className="text-slate-500 font-bold text-sm">Variety: <span className="text-emerald-600">{selectedEntry.variety}</span></p>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Analysis Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ripeness Factors</h4>
                  
                  {/* Visual Progress Bars */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>CNN (Thorn Texture)</span>
                        <span>89%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '89%' }} className="h-full bg-emerald-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span>ViT (Color Spatial)</span>
                        <span>94%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta Details */}
                <div className="pt-4 grid grid-cols-2 gap-y-4">
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
                      <p className="text-xs font-bold text-slate-700">Optimal Light</p>
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

      {/* ... (Keep Bulk Delete Action Bar same) */}
    </div>
  );
}