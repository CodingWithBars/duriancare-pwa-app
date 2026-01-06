"use client";

import { useState } from "react";
import { Cpu, Settings, Trash2, Smartphone, ShieldCheck, Info } from "lucide-react";

export default function InfoPage() {
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleResetApp = () => {
    if (confirm("This will delete all your scan history. Continue?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-white">
      
      <section className="space-y-3">
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-sm shadow-emerald-100">
          <Info size={24} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Information</h2>
        <p className="text-slate-600 leading-relaxed text-sm">
          DurianCare is a specialized mobile assessment tool designed specifically for the 
          <span className="font-bold text-emerald-600"> Puyat Durian</span> variety in the Davao Region.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
          <Settings size={14} />
          App Preferences
        </h3>
        
        <div className="bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white rounded-2xl text-slate-600 border border-slate-100 shadow-sm">
                <Smartphone size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Haptic Feedback</p>
                <p className="text-[11px] text-slate-400 font-medium">Vibration on interactions</p>
              </div>
            </div>
            <button 
              onClick={() => setHapticFeedback(!hapticFeedback)}
              className={`w-12 h-6 rounded-full transition-all relative ${hapticFeedback ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${hapticFeedback ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <button 
            onClick={handleResetApp}
            className="w-full flex items-center gap-4 p-5 text-rose-500 active:bg-rose-50 transition-all"
          >
            <div className="p-2.5 bg-white rounded-2xl border border-rose-100 text-rose-500 shadow-sm">
              <Trash2 size={20} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Factory Reset</p>
              <p className="text-[11px] opacity-70 font-medium">Wipe all local records</p>
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
          <Cpu size={14} />
          Model Architecture
        </h3>
        
        <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 shadow-sm">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-emerald-100">
                CNN
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Local Feature Analysis</p>
                <p className="text-xs text-slate-500 leading-relaxed">Extracts thorn density and microscopic surface patterns unique to Puyat.</p>
              </div>
            </div>

            <div className="h-px bg-slate-200/50 ml-14" />

            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-blue-100">
                ViT
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Global Context Analysis</p>
                <p className="text-xs text-slate-500 leading-relaxed">Uses self-attention to assess the overall fruit shape and color maturity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl shadow-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <p className="font-bold text-sm">On-Device Processing</p>
        </div>
        <p className="text-slate-400 text-xs leading-relaxed ml-1">
          To protect farmer data and ensure speed in remote Davao orchards, all AI inference happens locally. No internet required for assessment.
        </p>
      </section>

      <footer className="pt-8 pb-4">
        <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          Durian Care • v1.0
        </p>
      </footer>
    </div>
  );
}