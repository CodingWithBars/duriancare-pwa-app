/// <reference lib="webworker" />

// Custom Service Worker extensions for DurianCare PWA
// This file is automatically merged into the generated sw.js by @ducanh2912/next-pwa

// Cache-First strategy for AI assets (WASM, TFLite models)
// This enables OFFLINE mode by storing these large files in a dedicated cache
// after the first successful download, bypassing the main PWA precache.
(self as unknown as ServiceWorkerGlobalScope).addEventListener("fetch", (event: FetchEvent) => {
  const url = event.request.url;
  const isAIAsset = url.endsWith(".wasm") || 
                    url.endsWith(".tflite") || 
                    url.includes("/tflite/") || 
                    url.includes("huggingface.co");

  if (isAIAsset) {
    event.respondWith(
      caches.open("ai-models-cache-v1").then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // If it's in the cache, serve it immediately (Offline Mode)
          if (cachedResponse) return cachedResponse;

          // If not, fetch from network and then cache it for next time
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Fallback if network fails and nothing is in cache
            return new Response("AI Model not available offline yet. Please load it once while online.", { status: 503 });
          });
        });
      })
    );
  }
});
