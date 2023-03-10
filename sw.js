importScripts('./js/sw-utils.js');

const STATIC_CACHE = "static-v3";
const DYNAMIC_CACHE = "dynamic-v2";
const INMUTABLE_CACHE = "inmutable-v1";

const APP_SHELL = [
  // "/",
  "/twittor/index.html",
  "/twittor/css/style.css",
  "/twittor/img/favicon.ico",
  "/twittor/img/avatars/spiderman.jpg",
  "/twittor/img/avatars/hulk.jpg",
  "/twittor/img/avatars/ironman.jpg",
  "/twittor/img/avatars/thor.jpg",
  "/twittor/img/avatars/wolverine.jpg",
  "/twittor/js/app.js",
  '/twittor/js/sw-utils.js'
];
const APP_SHELL_INMUTABLE = [
  "https://fonts.googleapis.com/css?family=Quicksand:300,400",
  "https://fonts.googleapis.com/css?family=Lato:400,300",
  "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
  "/twittor/css/animate.css",
  "/twittor/js/libs/jquery.js",
];

self.addEventListener("install", (e) => {
  const cacheStatic = caches.open(STATIC_CACHE).then((cache) => {
    return cache.addAll(APP_SHELL);
  });
  const cacheInmutable = caches.open(INMUTABLE_CACHE).then((cacheInmutable) => {
    for (let index = 0; index < APP_SHELL_INMUTABLE.length; index++) {
      const element = APP_SHELL_INMUTABLE[index];
      console.log(fetch(element).then(resp => console.log(resp)));
      
    }
    return cacheInmutable.addAll(APP_SHELL_INMUTABLE);
  });

  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== STATIC_CACHE && key.includes("static")) {
        return caches.delete(key);
      }
      if (key !== DYNAMIC_CACHE && key.includes("dynamic")) {
        return caches.delete(key);
      }
    });
  });
  e.waitUntil(respuesta);
});

self.addEventListener("fetch", (e) => {
  const respuesta = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    }else{
        return fetch(e.request).then( newResponse =>{
            return actualizaCacheDinamico(DYNAMIC_CACHE,e.request,newResponse);
        })
    }
  });
  e.respondWith(respuesta);
});
