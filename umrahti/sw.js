/* Umrahti service worker — © Prof Irhuma (Abu Abdurrahman). Bump VERSION on every update. */
var VERSION='umrahti-v1.0.0';
var SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var r=e.request; if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(r.mode==='navigate'){ // network first, offline fallback
    e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(VERSION).then(function(c){c.put('./index.html',cp)});return res}).catch(function(){return caches.match('./index.html')}));return}
  if(u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){ // cache first + refresh
    e.respondWith(caches.match(r).then(function(hit){var net=fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(VERSION).then(function(c){c.put(r,cp)})}return res}).catch(function(){return hit});return hit||net}))}
});
