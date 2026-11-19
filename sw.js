/* Service worker Petualangan Pythagoras — membuat game bisa dipakai tanpa internet.
   Daftar berkas dibaca dari precache.json (dibuat oleh tools_build_pwa.py).
   Jangan diubah tiap rilis: cukup jalankan ulang tools_build_pwa.py. */
const PREFIX = 'pp-offline-';
const VERSION = 'b9b27e390442';   // diisi otomatis oleh tools_build_pwa.py (membuat sw.js berubah => peramban tahu ada pembaruan)
const CACHE = PREFIX + VERSION;
const sendAll = async msg => { for (const c of await self.clients.matchAll({ includeUncontrolled: true })) c.postMessage(msg); };

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const man = await (await fetch('precache.json', { cache: 'no-store' })).json();
    const cache = await caches.open(CACHE);
    const files = man.files; let done = 0, i = 0;
    const one = async u => {
      for (let t = 0; t < 3; t++) {
        try { const r = await fetch(u, { cache: 'reload' }); if (r.ok) { await cache.put(u, r); return; } if (r.status === 404 || r.status === 410) return; /* berkas sudah tidak ada di repo: lewati */ } catch (_) {}
      }
      throw new Error('gagal unduh ' + u);
    };
    const worker = async () => { while (i < files.length) { const u = files[i++]; await one(u); done++; if (done % 8 === 0 || done === files.length) sendAll({ type: 'pp-progress', done, total: files.length }); } };
    await Promise.all([worker(), worker(), worker(), worker()]);
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith(PREFIX) && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
    sendAll({ type: 'pp-ready' });
  })());
});

self.addEventListener('message', e => { if (e.data === 'pp-skip') self.skipWaiting(); });

/* Layani permintaan Range (video/audio) dari cache agar bisa diputar dan digeser */
async function ranged(req, res) {
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  if (!m || res.status !== 200) return res;
  const buf = await res.arrayBuffer(), n = buf.byteLength;
  let s = m[1] === '' ? n - parseInt(m[2], 10) : parseInt(m[1], 10);
  let t = m[1] === '' || m[2] === '' ? n - 1 : Math.min(parseInt(m[2], 10), n - 1);
  if (s > t || s >= n) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + n } });
  return new Response(buf.slice(s, t + 1), { status: 206, headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream', 'Content-Length': String(t - s + 1), 'Content-Range': `bytes ${s}-${t}/${n}`, 'Accept-Ranges': 'bytes' } });
}

/* File kode (html/js/css/json) = JARINGAN DULU, simpanan hanya cadangan saat offline/lambat.
   Jadi bila guru mengganti file di GitHub, siswa yang online langsung mendapat versi terbaru,
   walaupun nomor versi lupa dinaikkan. Aset berat (gambar, suara, video, font) = simpanan dulu. */
const CODE = /\.(?:js|css|html|json|webmanifest)$/i, SLOW_MS = 4000;
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;       // Firebase, YouTube, dll. lewat jaringan
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const nav = req.mode === 'navigate';
    const key = nav ? 'index.html' : req;
    const offlineRes = () => new Response('Tidak ada koneksi dan berkas ini belum tersimpan.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    if ((nav || CODE.test(url.pathname) || url.pathname.endsWith('/')) && !req.headers.has('range')) {
      const net = fetch(url.href, { cache: 'no-cache', credentials: 'same-origin' }).then(r => { if (r.ok && r.status === 200) cache.put(key, r.clone()); return r; });
      net.catch(() => {});
      try { return await Promise.race([net, new Promise((_, rej) => setTimeout(rej, SLOW_MS))]); }
      catch (_) {
        const hit = await cache.match(key, { ignoreSearch: true });
        if (hit) return hit;
        try { return await net; } catch (__) { return offlineRes(); }
      }
    }
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return req.headers.has('range') ? ranged(req, hit) : hit;
    try {
      const r = await fetch(req);
      if (r.ok && r.status === 200 && !req.headers.has('range')) cache.put(req, r.clone());
      return r;
    } catch (err) { return offlineRes(); }
  })());
});
