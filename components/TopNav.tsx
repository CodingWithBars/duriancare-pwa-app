"use client";

import { Info, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Function to get the title based on the path
  const getTitle = (path: string) => {
    if (path === "/") return "DurianCare";
    if (path === "/assess") return "Ripeness Scan";
    if (path === "/history") return "Past Records";
    if (path === "/info") return "About System";
    return "DurianCare";
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 max-w-md mx-auto right-0">
      <div className="flex items-center gap-2">
        {pathname !== "/" && (
          <button onClick={() => router.back()} className="mr-2 text-slate-600">
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          {getTitle(pathname)}
        </h1>
      </div>

      <Link href="/info" className="text-slate-500 hover:text-green-600 transition-colors">
        <Info size={22} />
    </Link>
    </header>
  );
}