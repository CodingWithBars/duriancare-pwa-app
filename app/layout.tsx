import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "../components/BottomNav";
import TopNav from "../components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Durian Care",
  description: "Assessment System for Puyat Durian",
  manifest: "/manifest.json", 
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}>
        
        {/* TOP NAV: Fixed at the top of the screen */}
        <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-md mx-auto h-full">
            <TopNav />
          </div>
        </header>
        
        {/* MAIN SCROLLABLE AREA */}
        <main className="relative flex flex-col min-h-dvh max-w-md mx-auto bg-white shadow-xl">
          {/* Margin Top (mt-20) ensures content starts AFTER TopNav.
            Margin Bottom (mb-28) ensures the last item is visible ABOVE BottomNav.
            This prevents content from ever being "trapped" or hidden.
          */}
          <div className="flex-1 mt-20 mb-28">
            {children}
          </div>
        </main>

        {/* BOTTOM NAV: Fixed at the bottom of the screen */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 h-28 bg-white/80 backdrop-blur-md border-t border-slate-100 pb-safe">
          <div className="max-w-md mx-auto h-full">
            <BottomNav />
          </div>
        </footer>

      </body>
    </html>
  );
}