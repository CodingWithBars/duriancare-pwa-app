/// <reference lib="webworker" />

// Custom Service Worker extensions for DurianCare PWA
// This file is automatically merged into the generated sw.js by @ducanh2912/next-pwa

// Suppress the "Cache.put() encountered a network error" for large AI binary files
// (WASM, TFLite models). These files work fine without caching — the browser's
// native disk cache handles them. This just prevents the ugly console error.
(self as unknown as ServiceWorkerGlobalScope).addEventListener("fetch", (event: FetchEvent) => {
  const url = event.request.url;
  if (url.endsWith(".wasm") || url.endsWith(".tflite") || url.includes("/tflite/")) {
    event.respondWith(fetch(event.request));
  }
});
