const CACHE_NAME = 'pwa-cache-v3';
const ASSETS = [
  'index.html',
  'manifest.json',
  'style.css',
  'audio.js',
  'alliance.js',
  'script.js',
  'uiux.js',
  'audio/CavalryCharge.wav',
  'audio/Buzzer.wav',
  'audio/ThreeBells.wav',
  'audio/Shift.wav',
  'audio/Sonar.wav',
  'audio/EndGame.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
