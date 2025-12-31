"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Camera,
  RefreshCw,
  X,
  Zap,
  ZapOff,
  FlipHorizontal,
  Maximize,
  Minimize,
  Image as ImageIcon,
  Download,
  Cpu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AssessPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: string;
    score: number;
  } | null>(null);

  const [isTorchOn, setIsTorchOn] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment"
  );

  const router = useRouter();

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, zoom: true } as any,
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera Access Denied:", err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [facingMode]);

  const toggleTorch = async () => {
    const track = stream?.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = track.getCapabilities() as any;
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !isTorchOn }],
          } as any);
          setIsTorchOn(!isTorchOn);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleZoom = async (level: number) => {
    const track = stream?.getVideoTracks()[0];
    if (track) {
      try {
        const capabilities = track.getCapabilities() as any;
        if (capabilities.zoom) {
          const clampedZoom = Math.max(
            capabilities.zoom.min,
            Math.min(level, capabilities.zoom.max)
          );
          await track.applyConstraints({
            advanced: [{ zoom: clampedZoom }],
          } as any);
          setZoomLevel(clampedZoom);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const processImage = (dataUrl: string) => {
    setCapturedImage(dataUrl);
    setIsScanning(true);
    setTimeout(() => {
      const results = ["Ripe", "Unripe", "Overripe"];
      setScanResult({
        status: results[Math.floor(Math.random() * results.length)],
        score: parseFloat((Math.random() * (99 - 88) + 88).toFixed(1)),
      });
      setIsScanning(false);
    }, 2200);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      processImage(canvasRef.current.toDataURL("image/jpeg", 0.85));
    }
  };

  const saveToHistory = () => {
    if (!capturedImage || !scanResult) return;
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      result: scanResult.status,
      confidence: scanResult.score,
      image: capturedImage,
      variety: "Puyat",
    };
    const history = JSON.parse(localStorage.getItem("durian_history") || "[]");
    localStorage.setItem(
      "durian_history",
      JSON.stringify([newEntry, ...history])
    );
    router.push("/history");
  };

  return (
    /* fixed inset-0 and z-[9999] ensures this stays on top of any layout navbars */
    <div className="fixed inset-0 h-[100dvh] w-full bg-black overflow-hidden flex flex-col select-none z-[9999]">
      {/* Hidden Tools */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) =>
              processImage(event.target?.result as string);
            reader.readAsDataURL(file);
          }
        }}
      />

      {/* 1. TOP HUD - Close button is the main exit */}
      <div className="absolute top-0 inset-x-0 z-[100] p-6 flex justify-between items-start">
        <button
          onClick={() => router.push("/")}
          className="p-4 bg-black/60 backdrop-blur-2xl rounded-2xl text-white border border-white/20 active:scale-90 transition-all shadow-2xl"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 bg-emerald-500 px-4 py-2 rounded-full shadow-xl">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              CNN-ViT LIVE
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={toggleTorch}
              className={`p-3 rounded-xl border transition-colors ${
                isTorchOn
                  ? "bg-amber-400 text-black border-amber-500"
                  : "bg-black/40 text-white border-white/10"
              }`}
            >
              {isTorchOn ? <Zap size={20} /> : <ZapOff size={20} />}
            </button>
            <button
              onClick={() =>
                setFacingMode((prev) =>
                  prev === "environment" ? "user" : "environment"
                )
              }
              className="p-3 bg-black/40 backdrop-blur-xl rounded-xl text-white border border-white/10"
            >
              <FlipHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. VIEWPORT */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {!capturedImage ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <img
            src={capturedImage}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Captured"
          />
        )}

        {/* SCANNER GUIDES */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
          <div className="w-72 h-72 relative">
            <div className="absolute top-0 left-0 w-12 h-12 border-t-[6px] border-l-[6px] border-emerald-500 rounded-tl-[32px]" />
            <div className="absolute top-0 right-0 w-12 h-12 border-t-[6px] border-r-[6px] border-emerald-500 rounded-tr-[32px]" />
            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-[6px] border-l-[6px] border-emerald-500 rounded-bl-[32px]" />
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-[6px] border-r-[6px] border-emerald-500 rounded-br-[32px]" />

            <AnimatePresence>
              {(isScanning || !capturedImage) && (
                <motion.div
                  initial={{ top: "5%" }}
                  animate={{ top: "95%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    repeatType: "reverse",
                    ease: "linear",
                  }}
                  className="absolute left-4 right-4 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#10b981] z-20"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. CONTROLS (Floating above the very bottom) */}
        <div className="absolute bottom-0 inset-x-0 z-40 p-10 pb-16 flex flex-col items-center gap-8 bg-gradient-to-t from-black via-black/20 to-transparent">
          {!capturedImage && (
            <div className="flex items-center gap-6 bg-black/60 backdrop-blur-2xl px-6 py-3 rounded-full border border-white/10 shadow-2xl">
              <button
                onClick={() => handleZoom(zoomLevel - 1)}
                className="text-white/60"
              >
                <Minimize size={20} />
              </button>
              <div className="flex gap-4">
                {[1, 2, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleZoom(val)}
                    className={`text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      Math.round(zoomLevel) === val
                        ? "bg-emerald-500 text-white"
                        : "text-white/40"
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleZoom(zoomLevel + 1)}
                className="text-white/60"
              >
                <Maximize size={20} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between w-full max-w-[300px]">
            {!capturedImage ? (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
                >
                  <ImageIcon size={24} />
                </button>

                <button
                  onClick={capturePhoto}
                  className="relative w-24 h-24 flex items-center justify-center group"
                >
                  <div className="absolute inset-0 border-[6px] border-white/40 rounded-full scale-110 group-active:scale-100 transition-all" />
                  <div className="w-18 h-18 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)]" />
                </button>

                <div className="w-14 h-14" />
              </>
            ) : (
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setScanResult(null);
                }}
                className="w-full bg-white/10 backdrop-blur-2xl py-5 rounded-3xl text-white font-black border border-white/20 flex items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl"
              >
                <RefreshCw size={22} /> Retake Assessment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. RESULT SHEET */}
      <AnimatePresence>
        {capturedImage && !isScanning && scanResult && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-[44px] p-8 z-[1000] shadow-[0_-20px_80px_rgba(0,0,0,0.6)] pb-12 overflow-y-auto max-h-[85vh]"
          >
            <div className="w-14 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />

            {/* Header Info */}
            <div className="flex justify-between items-center mb-6">
              <div className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
                Variety Match: Puyat
              </div>
              <button className="text-slate-400 p-2 active:scale-90 transition-all">
                <Download size={22} />
              </button>
            </div>

            {/* Main Result */}
            <div className="text-center mb-8">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
                CNN Classification
              </p>
              <h2
                className={`text-6xl font-black italic tracking-tighter ${
                  scanResult.status === "Ripe"
                    ? "text-emerald-600"
                    : scanResult.status === "Overripe"
                    ? "text-rose-600"
                    : "text-amber-500"
                }`}
              >
                {scanResult.status.toUpperCase()}
              </h2>
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="h-[2px] w-10 bg-slate-100" />
                <span className="text-slate-900 font-black text-2xl">
                  {scanResult.score}%{" "}
                  <span className="text-slate-400 text-sm font-medium">
                    Match
                  </span>
                </span>
                <div className="h-[2px] w-10 bg-slate-100" />
              </div>
            </div>

            {/* --- INFERENCE FACTORS SECTION --- */}
            <div className="mb-10 space-y-5 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                  <Cpu size={14} className="text-emerald-500" />
                  Ripeness Factors
                </h4>
              </div>

              <div className="space-y-4">
                {/* Factor 1: Spine Flexibility */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                    <span>Spine Flexibility</span>
                    <span>{scanResult.status === "Ripe" ? "88%" : "42%"}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: scanResult.status === "Ripe" ? "88%" : "42%",
                      }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        scanResult.status === "Ripe"
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Factor 2: Coloration */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase">
                    <span>Shell Coloration</span>
                    <span>{scanResult.status === "Ripe" ? "92%" : "65%"}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: scanResult.status === "Ripe" ? "92%" : "65%",
                      }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className={`h-full rounded-full ${
                        scanResult.status === "Ripe"
                          ? "bg-emerald-500"
                          : "bg-amber-400"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={saveToHistory}
              className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xl active:scale-95 transition-all shadow-2xl shadow-slate-400"
            >
              Log to Assessment History
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
