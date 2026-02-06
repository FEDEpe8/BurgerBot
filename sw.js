const CACHE_NAME = 'chasburger-v7';
// Eliminamos './BurgerBot' para evitar errores de carga
const assets = [
  './', 
  './index.html', 
  './styles.css', 
  './script.js', 
  './manifest.json', // Asegurate que termine en .json
  './img/logo-app.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(assets))
  );
});
