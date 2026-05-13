"use client";

import { useState, useEffect } from "react";
import { Cpu, Settings, Trash2, Smartphone, ShieldCheck, Info, Leaf, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PWAInstall from "@/components/PWAInstall";
import { RESTRICTION_DATE, SUPPORT_CONTACT, SYSTEM_ID } from "@/lib/constants";

function CountdownDisplay({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hrs", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes },
        { label: "Sec", value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-lg font-black tabular-nums">{item.value.toString().padStart(2, '0')}</span>
          <span className="text-[7px] font-black uppercase text-slate-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function InfoPage() {
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [showLicenseModal, setShowLicenseModal] = useState(false);

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
        
        <PWAInstall variant="button" />

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

      <section className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
          <ShieldCheck size={14} />
          System Status & License
        </h3>
        
        <button 
          onClick={() => setShowLicenseModal(true)}
          className="w-full bg-slate-900 text-white p-5 rounded-[24px] font-black text-lg active:scale-95 transition-all flex items-center justify-between shadow-xl shadow-slate-200"
        >
          <div className="flex items-center gap-3">
             <ShieldCheck size={20} className="text-emerald-400" />
             <span>License</span>
          </div>
          <span className="text-[10px] font-black text-emerald-500 uppercase">View Status</span>
        </button>
      </section>

      <AnimatePresence>
        {showLicenseModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowLicenseModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 w-full max-w-sm rounded-[32px] p-6 text-white shadow-xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowLicenseModal(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <ShieldCheck size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">System Active</p>
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">ID: {SYSTEM_ID}</p>
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Expiry Date</p>
                    <p className="text-xs font-bold text-amber-400">
                      {new Date(RESTRICTION_DATE).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Limit</p>
                    <p className="text-xs font-bold text-slate-200">
                      {new Date(RESTRICTION_DATE).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* LIVE COUNTDOWN */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mt-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 text-center">Remaining Access Time</p>
                  <CountdownDisplay targetDate={RESTRICTION_DATE} />
                </div>

                <div className="pt-2">
                  <p className="text-slate-400 text-[10px] leading-relaxed italic text-center">
                    For renewals or balance inquiries, please contact: <span className="text-white font-bold">{SUPPORT_CONTACT}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-6 text-emerald-800">
        <div className="flex items-center gap-3 mb-2">
          <Leaf size={18} className="text-emerald-600" />
          <p className="font-bold text-sm">Offline First Architecture</p>
        </div>
        <p className="text-emerald-700/70 text-xs leading-relaxed">
          To protect farmer data and ensure speed in remote Davao orchards, all AI inference happens locally. Your privacy is our priority.
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