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
      className="fixed top-0 left-0 right-0 z-50 w-full h-16 max-w-md mx-auto 
                 bg-white/60 backdrop-blur-xl saturate-150
                 border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)]
                 flex items-center justify-between px-6 
                 transition-all duration-300"
    >
      <div className="flex items-center gap-2">
        {pathname !== "/" && (
          <button 
            onClick={() => router.back()} 
            className="mr-2 p-1.5 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          {getTitle(pathname)}
        </h1>
      </div>

      <Link 
        href="/info" 
        className={`p-2 rounded-xl transition-all ${
          pathname === "/info" 
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
            : "text-slate-500 hover:bg-slate-900/5"
        }`}
      >
        <Info size={20} />
      </Link>
    </header>
  );
}