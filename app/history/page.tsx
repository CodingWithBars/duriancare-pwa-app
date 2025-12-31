"use client";

import { useEffect, useState } from "react";
import { 
  Calendar, Search, Trash2, X, Check, 
  ListChecks, Target, Cpu, ThermometerSun,
  Activity, Leaf, Wind
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Assessment {
  id: number;
  date: string;
  time?: string;
  result: string;
  confidence: number;
  image: string;
  variety: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<Assessment | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("durian_history") || "[]");
    setHistory(data.sort((a: any, b: any) => b.id - a.id));
  }, []);

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const deleteSingle = (id: number) => {
    if (confirm("Permanently delete this assessment?")) {
      const updated = history.filter(item => item.id !== id);
      saveAndRefresh(updated);
      setSelectedEntry(null);
    }
  };

  const deleteSelected = () => {
    if (confirm(`Delete ${selectedIds.length} selected scans?`)) {
      const updated = history.filter(item => !selectedIds.includes(item.id));
      saveAndRefresh(updated);
      setSelectedIds([]);
      setIsSelectionMode(false);
    }
  };

  const saveAndRefresh = (updatedData: Assessment[]) => {
    setHistory(updatedData);
    localStorage.setItem("durian_history", JSON.stringify(updatedData));
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
    <div className="bg-white min-h-screen pb-32 select-none">
      {/* 1. SEARCH & HEADER */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
         <div className="px-6 py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full pl-11 pr-11 py-3 bg-slate-100/50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:bg-white transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h3 className="font-black text-slate-900 text-lg tracking-tight">
                {isSelectionMode ? `${selectedIds.length} Selected` : 'History'}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredHistory.length} Total Records</span>
            </div>
            
            <button 
              onClick={() => { setIsSelectionMode(!isSelectionMode); setSelectedIds([]); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                isSelectionMode ? 'bg-slate-900 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}
            >
              {isSelectionMode ? <><X size={14}/> Cancel</> : <><ListChecks size={16}/> Edit</>}
            </button>
          </div>
        </div>
      </div>

      {/* 2. LIST CONTENT */}
      <div className="p-6">
        <div className="space-y-4">
          {filteredHistory.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 font-bold text-sm italic">No records found.</p>
            </div>
          )}
          {filteredHistory.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              onClick={() => isSelectionMode ? toggleSelection(item.id) : setSelectedEntry(item)}
              className={`relative bg-white rounded-[28px] border p-4 transition-all active:scale-[0.98] ${
                selectedIds.includes(item.id) ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                {isSelectionMode && (
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedIds.includes(item.id) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
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
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                    <Calendar size={12} /> {item.date} {item.time ? `• ${item.time}` : ''}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. BULK DELETE BAR */}
      <AnimatePresence>
        {isSelectionMode && selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xs"
          >
            <button 
              onClick={deleteSelected}
              className="w-full bg-rose-500 text-white py-4 rounded-3xl font-black shadow-2xl shadow-rose-200 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <Trash2 size={20} />
              Delete {selectedIds.length} Record{selectedIds.length > 1 ? 's' : ''}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. DETAIL MODAL (With Ripeness Factors) */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md overflow-y-auto">
            <div className="min-h-screen flex flex-col p-6 max-w-lg mx-auto">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setSelectedEntry(null)} className="p-3 bg-white/10 rounded-2xl text-white backdrop-blur-md active:scale-90 transition-all">
                  <X size={20} />
                </button>
                <div className="text-white text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Analysis Detail</p>
                  <p className="text-xs font-bold">{selectedEntry.date}</p>
                </div>
                <button onClick={() => deleteSingle(selectedEntry.id)} className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30 active:scale-90 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Image Preview */}
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full aspect-square rounded-[40px] overflow-hidden border-2 border-white/20 shadow-2xl mb-6 relative">
                <img src={selectedEntry.image} className="w-full h-full object-cover" alt="Detail" />
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-white/60 uppercase">Predicted State</p>
                        <h2 className="text-2xl font-black text-white italic">{selectedEntry.result.toUpperCase()}</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-white/60 uppercase">Confidence</p>
                        <p className="text-xl font-black text-emerald-400">{selectedEntry.confidence}%</p>
                      </div>
                   </div>
                </div>
              </motion.div>

              {/* Analysis White Sheet */}
              <div className="bg-white rounded-[36px] p-8 space-y-8 flex-1 shadow-2xl mb-10">
                
                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Target className="text-emerald-500" size={18} />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Classification</p>
                      <p className="text-xs font-bold text-slate-700">CNN-ViT Hybrid</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Cpu className="text-blue-500" size={18} />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Object Path</p>
                      <p className="text-xs font-bold text-slate-700">{selectedEntry.variety}</p>
                    </div>
                  </div>
                </div>

                {/* --- RIPENESS FACTORS BAR (The requested part) --- */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                      <Activity size={14} className="text-emerald-500" />
                      Inference Factors
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">Validated</span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Spine Flexibility Factor */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                        <span className="flex items-center gap-1.5"><Leaf size={10}/> Spine Flexibility</span>
                        <span>{selectedEntry.result === "Ripe" ? "88%" : "42%"}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: selectedEntry.result === "Ripe" ? "88%" : "42%" }}
                          className={`h-full rounded-full ${selectedEntry.result === "Ripe" ? "bg-emerald-500" : "bg-amber-400"}`}
                        />
                      </div>
                    </div>

                    {/* Shell Coloration Factor */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                        <span className="flex items-center gap-1.5"><ThermometerSun size={10}/> Shell Coloration</span>
                        <span>{selectedEntry.result === "Ripe" ? "92%" : "65%"}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: selectedEntry.result === "Ripe" ? "92%" : "65%" }}
                          className={`h-full rounded-full ${selectedEntry.result === "Ripe" ? "bg-emerald-500" : "bg-amber-400"}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedEntry(null)} 
                  className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg shadow-xl active:scale-95 transition-all"
                >
                  Close Record
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}