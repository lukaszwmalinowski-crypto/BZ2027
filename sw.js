/* Obserwatorium Slaskie 2027 — v122, zasoby offline */
const CACHE_NAME='obserwatorium-slaskie-v124';
const CORE=[
  './','./index.html','./manifest.webmanifest','./favicon.png','./apple-touch-icon.png',
  './assets/layout.css','./assets/pup.css','./assets/obserwatorium-v111.css',
  './assets/obserwatorium-v111.js','./assets/obserwatorium-v124.css','./assets/obserwatorium-v119.css','./assets/obserwatorium-v120.css','./assets/obserwatorium-presentations-v118.js','./assets/obserwatorium-v113.css','./assets/obserwatorium-v115.css',
  './assets/logo-obserwatorium.png','./assets/firmowka-blue.jpg','./assets/pptxgen.bundle.js',
  './icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png',
  './data/dane.json','./data/demografia_gzm_miasta_2014_2025.json','./data/gus_bdl_demografia.json',
  './js/bootstrap.js','./js/app.js','./js/layout.js','./js/pup.js','./js/gus.js','./js/county.js'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache=>Promise.all(CORE.map(path=>cache.add(path).catch(()=>null))))
    .then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys()
    .then(keys=>Promise.all(keys.filter(k=>k.startsWith('obserwatorium-slaskie-')&&k!==CACHE_NAME)
    .map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(res=>{
      if(res.ok){const copy=res.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy)));}
      return res;
    }).catch(async()=>await caches.match('./index.html')||Response.error()));
    return;
  }
  if(url.pathname.endsWith('/data/dane.json')){
    event.respondWith(fetch(req).then(res=>{
      if(res.ok){const copy=res.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)));}
      return res;
    }).catch(async()=>await caches.match(req)||Response.error()));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
    if(res.ok){const copy=res.clone();event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)));}
    return res;
  })));
});
