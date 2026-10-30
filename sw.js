const CACHE_NAME = 'obserwatorium-slaskie-v84';
const CORE = ['./','./index.html','./manifest.webmanifest','./favicon.png','./apple-touch-icon.png','./assets/logo-obserwatorium.png',
  './icons/icon-192.png','./icons/icon-512.png',
  './icons/icon-maskable-192.png','./icons/icon-maskable-512.png',
  './data/dane.json','./data/demografia_gzm_miasta_2014_2025.json','./assets/layout.css','./assets/pup.css',
  './js/bootstrap.js','./js/app.js','./js/layout.js','./js/pup.js',
  './js/gus.js','./js/county.js','./assets/pptxgen.bundle.js'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
   await cache.addAll(['./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png']);
   await Promise.all(CORE.map(path => cache.add(path).catch(() => {})));
 }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(Promise.all([
   caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('obserwatorium-slaskie-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))),
   self.clients.claim()
 ]));
});
self.addEventListener('fetch', event => {
 const request=event.request;
 if(request.method!=='GET' || new URL(request.url).origin!==self.location.origin)return;
 if(new URL(request.url).pathname.endsWith('/data/dane.json')){
   event.respondWith(fetch(request).then(response=>{
     if(!response.ok) throw new Error('HTTP '+response.status);
     caches.open(CACHE_NAME).then(cache=>cache.put(request,response.clone()));
     return response;
   }).catch(()=>caches.match(request)));
   return;
 }
 if(request.mode==='navigate'){
   event.respondWith(fetch(request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy));}
      return response;
   }).catch(()=>caches.match('./index.html')));
   return;
 }
 event.respondWith(caches.match(request).then(cached=>cached || fetch(request).then(response=>{
   if(response.ok){let copy=response.clone();caches.open(CACHE_NAME).then(c=>c.put(request,copy));}
   return response;
 })));
});
