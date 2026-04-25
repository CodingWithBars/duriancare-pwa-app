"use client";

import { Info, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  const getTitle = (path: string) => {
    if (path === "/") return "DurianCare";
    if (path === "/assess") return "Ripeness Scan";
    if (path === "/history") return "Past Records";
    if (path === "/info") return "About System";
    return "DurianCare";
  };

  return (
    <header 
      className="relative w-full h-16 
                 bg-white/80 backdrop-blur-2xl saturate-150
                 border-b border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                 flex items-center justify-between px-6 
                 shrink-0 z-50 pt-[env(safe-area-inset-top)]"
    >
      <div className="flex items-center gap-3">
        {pathname !== "/" && (
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 text-slate-900 transition-all active:scale-90"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-slate-900 tracking-tighter italic leading-none">
            {getTitle(pathname).toUpperCase()}
          </h1>
          {pathname === "/" && (
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-0.5">
              Hybrid CNN-ViT PRO
            </span>
          )}
        </div>
      </div>

      <Link 
        href="/info" 
        className={`p-2.5 rounded-2xl transition-all active:scale-90 ${
          pathname === "/info" 
            ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
            : "bg-slate-50 text-slate-400 border border-slate-100"
        }`}
      >
        <Info size={20} strokeWidth={2.5} />
      </Link>
    </header>
  );
}