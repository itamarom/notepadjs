if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const f=e=>s(e,o),d={module:{uri:o},exports:t,require:f};i[o]=Promise.all(n.map((e=>d[e]||f(e)))).then((e=>(r(...e),t)))}}define(["./workbox-27b29e6f"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index-51c14e30.js",revision:null},{url:"assets/index-e34a69e1.css",revision:null},{url:"index.html",revision:"32cd4bf7e9db88bbeb3fd8067fbb014c"},{url:"registerSW.js",revision:"f1231081738126de0de0570ee1561d77"},{url:"favicon.ico",revision:"59215e07deefa552ee9758b0bc4aa11c"},{url:"pwa-192x192.png",revision:"826ddc6bf738bbd1eb9c42df97eaf20a"},{url:"pwa-512x512.png",revision:"b35e110bbb341bd65debe4ce06009675"},{url:"manifest.webmanifest",revision:"fe1eefd410fa99fa8c70c1abf69f988a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));