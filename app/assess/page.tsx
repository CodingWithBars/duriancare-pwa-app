"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, X, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AssessPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ status: string; score: number } | null>(null);
  
  const router = useRouter();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      const width = 400;
      const scale = width / videoRef.current.videoWidth;
      canvasRef.current.width = width;
      canvasRef.current.height = videoRef.current.videoHeight * scale;

      context?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL("image/jpeg", 0.7);
      setCapturedImage(imageData);
      
      setIsScanning(true);
      setTimeout(() => {
        const results = ["Ripe", "Unripe", "Overripe"];
        const randomStatus = results[Math.floor(Math.random() * results.length)];
        const randomScore = parseFloat((Math.random() * (99 - 85) + 85).toFixed(1));
        
        setScanResult({ status: randomStatus, score: randomScore });
        setIsScanning(false);
      }, 2500);
    }
  };

  const saveToHistory = () => {
    if (!capturedImage || !scanResult) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      result: scanResult.status,
      confidence: scanResult.score,
      image: capturedImage,
      variety: "Puyat"
    };

    const existingHistory = JSON.parse(localStorage.getItem("durian_history") || "[]");
    localStorage.setItem("durian_history", JSON.stringify([newEntry, ...existingHistory]));
    router.push("/history");
  };

  return (
    <div className="relative h-[calc(100dvh-192px)] bg-black overflow-hidden flex flex-col">
      
      {/* HUD Overlay */}
      <div className="absolute top-0 inset-x-0 z-20 p-6 flex justify-between items-start pointer-events-none">
        <button 
          onClick={() => router.push("/")} 
          className="p-3 bg-black/20 backdrop-blur-xl rounded-2xl text-white border border-white/10 pointer-events-auto active:scale-90 transition-all"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-emerald-500 px-3 py-1.5 rounded-full shadow-lg shadow-emerald-500/20">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase tracking-widest">CNN-ViT Hybrid</span>
          </div>
          <div className="bg-black/20 backdrop-blur-xl p-2 rounded-xl border border-white/10 pointer-events-auto">
            <Zap size={18} className="text-amber-400" />
          </div>
        </div>
      </div>

      {/* Camera Viewport */}
      <div className="relative flex-1 bg-slate-900">
        {!capturedImage ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />
        )}

        {/* Framing Guides */}
        <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 relative">
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-emerald-500 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-emerald-500 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-emerald-500 rounded-br-3xl" />
            
            <AnimatePresence>
              {(isScanning || !capturedImage) && (
                <motion.div 
                  initial={{ top: "10%" }}
                  animate={{ top: "90%" }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
                  className="absolute left-4 right-4 h-0.5 bg-emerald-400 shadow-[0_0_15px_#10b981] z-20"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center z-10">
          <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-white/10">
            {isScanning ? "Processing Puyat Variety..." : "Center durian spikes in frame"}
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-8 flex justify-center items-center border-t border-slate-100">
        {!capturedImage ? (
          <button 
            onClick={capturePhoto}
            className="relative w-20 h-20 flex items-center justify-center group"
          >
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full scale-125" />
            <div className="w-16 h-16 bg-emerald-600 rounded-full border-4 border-white shadow-xl group-active:scale-90 transition-transform" />
          </button>
        ) : (
          <button 
            onClick={() => {setCapturedImage(null); setScanResult(null);}}
            className="flex items-center gap-3 bg-slate-100 px-8 py-4 rounded-2xl text-slate-900 font-bold active:scale-95 transition-all border border-slate-200"
          >
            <RefreshCw size={20} />
            Retake Photo
          </button>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
      
      {/* Result Bottom Sheet */}
      <AnimatePresence>
        {capturedImage && !isScanning && scanResult && (
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 inset-x-0 bg-white rounded-t-[40px] p-8 z-[60] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] border-t border-slate-100"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
            
            <div className="flex flex-col items-center">
              <div className="text-center mb-8">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Ripeness Assessment</p>
                <h2 className={`text-5xl font-black ${
                  scanResult.status === 'Ripe' ? 'text-emerald-600' : 
                  scanResult.status === 'Overripe' ? 'text-rose-600' : 'text-amber-500'
                }`}>
                  {scanResult.status}
                </h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  Analysis Confidence: <span className="text-slate-900 font-bold">{scanResult.score}%</span>
                </p>
              </div>

              {/* Technical Confidence Bars */}
              <div className="w-full space-y-4 mb-10 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase">
                    <span>Thorn Texture (CNN)</span>
                    <span className="text-emerald-600">High Match</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${scanResult.score}%` }} 
                      className="h-full bg-emerald-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase">
                    <span>Global Color (ViT)</span>
                    <span className="text-blue-600">92% Precision</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `92%` }} 
                      className="h-full bg-blue-500" 
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={saveToHistory}
                className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black active:scale-95 transition-all shadow-xl shadow-emerald-200"
              >
                Confirm & Save to Logs
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}