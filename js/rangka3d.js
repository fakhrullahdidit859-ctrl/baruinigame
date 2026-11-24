/* =========================================================
   RANGKA ATAP 3D — Miniatur rangka atap segitiga siku-siku
   Menggunakan Three.js (dimuat dari CDN saat screen dibuka)
   Dimensi: a=5, b=12, c=13 (tripel Pythagoras)
   PP.screens.rangka3d  — bisa dipanggil dari mana saja
   PP.rangka3d.embed(container, opts) — embed ke halaman lain
   Made by Didit Fakhrullah
   ========================================================= */
(function () {
  'use strict';

  const THREE_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  let threeLoaded = false;
  let threeLoading = false;
  const threeCallbacks = [];

  function loadThree(cb) {
    if (threeLoaded) { cb(); return; }
    threeCallbacks.push(cb);
    if (threeLoading) return;
    threeLoading = true;
    const s = document.createElement('script');
    s.src = THREE_CDN;
    s.onload = () => { threeLoaded = true; threeCallbacks.forEach(f => f()); threeCallbacks.length = 0; };
    s.onerror = () => { threeCallbacks.forEach(f => f(new Error('Three.js gagal dimuat'))); threeCallbacks.length = 0; };
    document.head.appendChild(s);
  }

  /* ── Skala visual: 1 cm = 0.4 unit Three.js ── */
  const SC = 0.4;
  const A = 5 * SC, B = 12 * SC, C = 13 * SC;  /* sisi segitiga */
  const W = 6 * SC;   /* lebar rangka (kedalaman Z) */
  const R = 0.12;     /* radius silinder kayu */

  /* Warna */
  const COL_WOOD  = 0xb5651d;
  const COL_WOOD2 = 0x8B4513;
  const COL_A     = 0x2563eb;   /* tiang tegak — biru */
  const COL_B     = 0x16a34a;   /* alas — hijau */
  const COL_C     = 0xdc2626;   /* miring — merah */
  const COL_CONN  = 0x6b3a1f;   /* sambungan */

  function makeMat(hex, rough) {
    return new THREE.MeshLambertMaterial({ color: hex });
  }

  /* Buat silinder antara dua titik */
  function beam(scene, p1, p2, color, r) {
    r = r || R;
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    const geo = new THREE.CylinderGeometry(r, r, len, 10);
    const mat = makeMat(color);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    scene.add(mesh);
    return mesh;
  }

  /* Bola sambungan di titik */
  function joint(scene, pos, r) {
    r = r || R * 1.4;
    const geo = new THREE.SphereGeometry(r, 10, 10);
    const mat = makeMat(COL_CONN);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
  }

  /* Papan alas (platform) */
  function platform(scene) {
    const geo = new THREE.BoxGeometry(B + 1.2, 0.08, W + 0.6);
    const mat = makeMat(COL_WOOD2);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(B / 2 - 0.1, -0.04, W / 2);
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  /* Bangun satu panel rangka segitiga pada z tertentu */
  function panel(scene, z) {
    const O  = new THREE.Vector3(0,  0,  z);   /* sudut siku-siku */
    const T  = new THREE.Vector3(0,  A,  z);   /* puncak (atas tiang) */
    const BR = new THREE.Vector3(B,  0,  z);   /* sudut kanan bawah */

    beam(scene, O, T,  COL_A);        /* tiang a */
    beam(scene, O, BR, COL_B);        /* alas  b */
    beam(scene, T, BR, COL_C, R*1.1); /* miring c */

    joint(scene, O);
    joint(scene, T);
    joint(scene, BR);
    return { O, T, BR };
  }

  /* Bangun model lengkap */
  function buildModel(scene) {
    platform(scene);

    const p0 = panel(scene, 0);
    const p1 = panel(scene, W);

    /* balok penghubung antar panel (alas, tiang, puncak, tengah miring) */
    beam(scene, p0.O,  p1.O,  COL_WOOD);
    beam(scene, p0.T,  p1.T,  COL_WOOD);
    beam(scene, p0.BR, p1.BR, COL_WOOD);

    /* penyangga diagonal silang tengah */
    const midA0 = p0.O.clone().lerp(p0.T, 0.5);
    const midA1 = p1.O.clone().lerp(p1.T, 0.5);
    beam(scene, midA0, midA1, COL_WOOD, R * 0.8);

    const midC0 = p0.T.clone().lerp(p0.BR, 0.5);
    const midC1 = p1.T.clone().lerp(p1.BR, 0.5);
    beam(scene, midC0, midC1, COL_WOOD, R * 0.8);

    /* penyangga diagonal silang tengah bawah */
    const midB0 = p0.O.clone().lerp(p0.BR, 0.5);
    const midB1 = p1.O.clone().lerp(p1.BR, 0.5);
    beam(scene, midB0, midB1, COL_WOOD, R * 0.8);
  }

  /* ── Label HTML di atas canvas ── */
  function makeLabel(container, text, color, x, y) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `position:absolute;left:${x}px;top:${y}px;background:${color};color:#fff;
      font:bold 13px/1 sans-serif;padding:3px 8px;border-radius:20px;pointer-events:none;
      white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,.4);`;
    container.appendChild(el);
    return el;
  }

  /* ── Inisialisasi Three.js scene ── */
  function initScene(canvas, container, opts) {
    opts = opts || {};
    const W_px = container.clientWidth  || 400;
    const H_px = opts.height || 320;
    canvas.width  = W_px;
    canvas.height = H_px;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W_px, H_px);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    /* Kamera */
    const cam = new THREE.PerspectiveCamera(45, W_px / H_px, 0.1, 100);
    cam.position.set(B * 0.9, A * 1.6, W * 2.8);
    cam.lookAt(B / 2, A / 2, W / 2);

    /* Cahaya */
    const amb = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(amb);
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(5, 8, 5);
    dir.castShadow = true;
    scene.add(dir);
    const pt = new THREE.PointLight(0xffe0b2, 0.5, 20);
    pt.position.set(-2, 4, 4);
    scene.add(pt);

    buildModel(scene);

    /* Pivot untuk orbit manual */
    const pivot = new THREE.Object3D();
    pivot.position.set(B / 2, A / 2, W / 2);
    scene.add(pivot);
    cam.lookAt(pivot.position);

    /* ── Kontrol orbit manual (mouse + touch) ── */
    let isDrag = false, lastX = 0, lastY = 0;
    let rotX = 0.3, rotY = -0.4, zoom = 1;

    function applyOrbit() {
      const r = 5.5 / zoom;
      cam.position.set(
        pivot.position.x + r * Math.sin(rotY) * Math.cos(rotX),
        pivot.position.y + r * Math.sin(rotX),
        pivot.position.z + r * Math.cos(rotY) * Math.cos(rotX)
      );
      cam.lookAt(pivot.position);
    }
    applyOrbit();

    canvas.addEventListener('mousedown',  e => { isDrag = true; lastX = e.clientX; lastY = e.clientY; });
    canvas.addEventListener('mouseup',    () => isDrag = false);
    canvas.addEventListener('mouseleave', () => isDrag = false);
    canvas.addEventListener('mousemove',  e => {
      if (!isDrag) return;
      rotY += (e.clientX - lastX) * 0.01;
      rotX += (e.clientY - lastY) * 0.01;
      rotX = Math.max(-1.3, Math.min(1.3, rotX));
      lastX = e.clientX; lastY = e.clientY;
      applyOrbit();
    });
    canvas.addEventListener('wheel', e => {
      zoom = Math.max(0.4, Math.min(3, zoom - e.deltaY * 0.001));
      applyOrbit(); e.preventDefault();
    }, { passive: false });

    let t0 = 0, t1 = 0;
    canvas.addEventListener('touchstart',  e => { if (e.touches.length === 1) { isDrag = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; } if (e.touches.length === 2) { t0 = 0; t1 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); } }, { passive: true });
    canvas.addEventListener('touchend',    () => isDrag = false, { passive: true });
    canvas.addEventListener('touchmove',   e => {
      if (e.touches.length === 1 && isDrag) {
        rotY += (e.touches[0].clientX - lastX) * 0.012;
        rotX += (e.touches[0].clientY - lastY) * 0.012;
        rotX = Math.max(-1.3, Math.min(1.3, rotX));
        lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
        applyOrbit();
      } else if (e.touches.length === 2) {
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (t1 > 0) { zoom = Math.max(0.4, Math.min(3, zoom * (d / t1))); applyOrbit(); }
        t1 = d;
      }
    }, { passive: true });

    /* Tombol reset */
    if (opts.showReset !== false) {
      const btn = document.createElement('button');
      btn.textContent = '⟳ Reset';
      btn.style.cssText = 'position:absolute;bottom:10px;right:10px;background:rgba(0,0,0,.55);color:#fff;border:none;border-radius:8px;padding:5px 12px;cursor:pointer;font-size:12px;';
      btn.onclick = () => { rotX = 0.3; rotY = -0.4; zoom = 1; applyOrbit(); };
      container.appendChild(btn);
    }

    /* Loop render */
    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      renderer.render(scene, cam);
    }
    animate();

    /* Resize */
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth;
      if (!nw) return;
      renderer.setSize(nw, opts.height || 320);
      cam.aspect = nw / (opts.height || 320);
      cam.updateProjectionMatrix();
    });
    ro.observe(container);

    return { renderer, scene, cam, destroy() { cancelAnimationFrame(raf); renderer.dispose(); ro.disconnect(); } };
  }

  /* ── Embed API — untuk digunakan dari halaman lain ── */
  function embed(container, opts) {
    opts = opts || {};
    container.style.position = 'relative';
    const h = opts.height || 320;
    container.style.height = h + 'px';

    /* Label informasi */
    const info = document.createElement('div');
    info.style.cssText = 'position:absolute;top:8px;left:10px;color:#fff;font:bold 12px sans-serif;z-index:1;pointer-events:none;';
    info.innerHTML = '<span style="color:#60a5fa">a=5 cm</span> &nbsp;<span style="color:#4ade80">b=12 cm</span> &nbsp;<span style="color:#f87171">c=13 cm</span>';
    container.appendChild(info);

    const hint = document.createElement('div');
    hint.style.cssText = 'position:absolute;bottom:38px;left:10px;color:rgba(255,255,255,.5);font:11px sans-serif;pointer-events:none;';
    hint.textContent = 'Seret untuk memutar · Scroll/cubit untuk zoom';
    container.appendChild(hint);

    const wm = document.createElement('div');
    wm.style.cssText = 'position:absolute;bottom:10px;left:10px;color:rgba(255,255,255,.3);font:10px sans-serif;pointer-events:none;';
    wm.textContent = 'Made by Didit Fakhrullah';
    container.appendChild(wm);

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'display:block;width:100%;height:100%;border-radius:12px;cursor:grab;';
    container.insertBefore(canvas, container.firstChild);

    const inst = initScene(canvas, container, opts);
    return inst;
  }

  /* ── Screen PP.screens.rangka3d ── */
  PP.screens = PP.screens || {};
  PP.screens.rangka3d = function () {
    return {
      html: `<div class="wrap narrowish">
        <div class="panel fill pad lb" style="padding-bottom:8px">
          <h2 class="h-title" style="margin:0">Miniatur Rangka Atap 3D</h2>
          <p class="small" style="margin:4px 0 10px">Kelompok Sedang — Teorema Pythagoras</p>
        </div>
        <div class="panel pad" style="margin-top:8px">
          <!-- Canvas Three.js -->
          <div id="r3d-canvas-wrap" style="position:relative;border-radius:12px;overflow:hidden;background:#1a1a2e;min-height:320px;">
            <div id="r3d-loading" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;">
              ⏳ Memuat model 3D…
            </div>
          </div>
          <!-- Info sisi -->
          <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
            <div class="r3d-tag" style="background:#1d4ed8;color:#fff;border-radius:8px;padding:6px 14px;font:bold 13px sans-serif;">
              🔵 a = 5 cm (tegak)
            </div>
            <div class="r3d-tag" style="background:#15803d;color:#fff;border-radius:8px;padding:6px 14px;font:bold 13px sans-serif;">
              🟢 b = 12 cm (alas)
            </div>
            <div class="r3d-tag" style="background:#b91c1c;color:#fff;border-radius:8px;padding:6px 14px;font:bold 13px sans-serif;">
              🔴 c = 13 cm (miring)
            </div>
          </div>
          <!-- Langkah perhitungan -->
          <div class="panel" style="margin-top:10px;background:var(--bg2,#f8fafc);border-radius:10px;padding:12px 16px;">
            <b>Perhitungan Teorema Pythagoras:</b>
            <div style="margin-top:8px;line-height:2;font-size:14px;">
              c² = a² + b²<br>
              c² = 5² + 12²<br>
              c² = 25 + 144<br>
              c² = 169<br>
              c = √169<br>
              <b>c = 13 cm ✓</b>
            </div>
          </div>
          <!-- Tombol navigasi -->
          <div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap;">
            <button class="btn green sm" data-go="materi">📖 Materi</button>
            <button class="btn blue sm" data-go="eksplorasi">🔍 Eksplorasi</button>
            <button class="btn" data-go="lomba">🏆 Rekap</button>
            <button class="btn" data-act="back">← Kembali</button>
          </div>
          <div style="text-align:right;margin-top:8px;color:var(--muted,#888);font-size:11px;">
            Made by Didit Fakhrullah
          </div>
        </div>
      </div>`,
      mount(root) {
        const wrap = root.querySelector('#r3d-canvas-wrap');
        const loading = root.querySelector('#r3d-loading');
        loadThree(function (err) {
          if (err) { loading.textContent = '⚠ Model 3D tidak dapat dimuat. Periksa koneksi internet.'; return; }
          loading.remove();
          embed(wrap, { height: 340, showReset: true });
        });
      }
    };
  };

  /* ── Tambah ke menu Eksplorasi & menu Lomba (opsional, lewat kartu) ── */
  PP.rangka3d = { embed, loadThree };

  /* ── Daftarkan ke TITLES app.js ── */
  if (window.PP && PP.TITLES) PP.TITLES.rangka3d = 'Rangka Atap 3D';
  document.addEventListener('pp-ready', () => {
    if (window.PP && PP.TITLES) PP.TITLES.rangka3d = 'Rangka Atap 3D';
  });

})();
