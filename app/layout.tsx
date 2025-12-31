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
  title: "DurianCare",
  description: "Hybrid CNN-ViT Ripeness Assessment",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DurianCare",
    // Adding apple-touch-icon link logic internally
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Essential for full-screen PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Forces the iPhone icon if the manifest is slow to load */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}>
        
        {/* TOP NAV: With padding-top for the iOS Notch */}
        <header className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)] bg-white/60 backdrop-blur-xl border-b border-white/20">
          <div className="max-w-md mx-auto h-16">
            <TopNav />
          </div>
        </header>
        
        {/* MAIN AREA: min-h-dvh handles the mobile browser toolbars dynamically */}
        <main className="relative flex flex-col min-h-dvh max-w-md mx-auto bg-white shadow-2xl overflow-x-hidden">
          {/* pt-20 (TopNav height + status bar)
              pb-32 (BottomNav height + safe area)
          */}
          <div className="flex-1 mt-16 pt-[env(safe-area-inset-top)] mb-28 pb-[env(safe-area-inset-bottom)]">
            {children}
          </div>
        </main>

        {/* BOTTOM NAV: With padding-bottom for the Home Indicator bar */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)] bg-white/60 backdrop-blur-xl border-t border-white/20">
          <div className="max-w-md mx-auto h-20">
            <BottomNav />
          </div>
        </footer>

      </body>
    </html>
  );
}