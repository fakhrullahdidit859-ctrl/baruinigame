/* =========================================================
   MATERI HUB — Halaman utama materi Teorema Pythagoras
   Menampilkan 6 bab + 3 cerita sebagai kartu bergambar yang jelas.
   PP.screens.materi_hub  →  masuk dari menu "Materi Pembelajaran"
   Made by Didit Fakhrullah
   ========================================================= */
(function () {
  'use strict';

  const BAB = [
    {
      id: 'bab1', label: 'BAB 1', title: 'Mengenal Segitiga Siku-Siku',
      desc: 'Sudut 90°, sisi tegak, alas, dan hipotenusa.',
      icon: '📐', color: '#3b82f6', lessons: ['1', '2'],
      btn: 'Pelajari Bab 1', route: 'materi/1'
    },
    {
      id: 'bab2', label: 'BAB 2', title: 'Rumus Teorema Pythagoras',
      desc: 'c² = a² + b². Simulasi persegi pada setiap sisi segitiga.',
      icon: '🔢', color: '#8b5cf6', lessons: ['3', '3b'],
      btn: 'Pelajari Bab 2', route: 'materi/3'
    },
    {
      id: 'bab3', label: 'BAB 3', title: 'Contoh Perhitungan',
      desc: 'Latihan mencari sisi yang belum diketahui. Tabel segitiga Pythagoras.',
      icon: '✏️', color: '#10b981', lessons: ['4'],
      btn: 'Pelajari Bab 3', route: 'materi/4'
    },
    {
      id: 'bab4', label: 'BAB 4', title: 'Penerapan & Soal Cerita',
      desc: 'Tali tiang, diagonal, trapesium, layang-layang, jembatan.',
      icon: '🏗️', color: '#f59e0b', lessons: ['5'],
      btn: 'Pelajari Bab 4', route: 'materi/5'
    },
    {
      id: 'bab5', label: 'BAB 5', title: 'Kebalikan Teorema Pythagoras',
      desc: 'Periksa apakah tiga sisi membentuk segitiga siku-siku.',
      icon: '🔄', color: '#ef4444', lessons: ['6'],
      btn: 'Pelajari Bab 5', route: 'materi/6'
    },
    {
      id: 'bab6', label: 'BONUS', title: 'Rangka Atap 3D Interaktif',
      desc: 'Model 3D miniatur rangka atap. Seret untuk memutar, zoom untuk memperbesar.',
      icon: '🏗', color: '#06b6d4', lessons: [],
      btn: 'Buka Model 3D', route: 'rangka3d'
    }
  ];

  const KELOMPOK = [
    {
      id: 'kd', label: 'Kelompok Dasar',
      title: 'Pembuktian Persegi Satuan',
      desc: 'a=3, b=4, c=5 → tempelkan tiga persegi. LKPD ukuran a=6, b=8, c=10.',
      icon: '🟩', color: '#16a34a', route: 'materi/3'
    },
    {
      id: 'ks', label: 'Kelompok Sedang',
      title: 'Miniatur Rangka Atap',
      desc: 'a=5, b=12, c=13 → hitung kayu miring. LKPD ukuran a=8, b=15, c=17.',
      icon: '🏠', color: '#d97706', route: 'rangka3d'
    },
    {
      id: 'km', label: 'Kelompok Mahir',
      title: 'Jalur Landai (Ramp)',
      desc: 'a=12, b=16, c=20 → prisma segitiga ramah disabilitas.',
      icon: '♿', color: '#7c3aed', route: 'materi/6'
    }
  ];

  /* ── Progress badge per bab ── */
  function progress(lessons) {
    if (!lessons || !lessons.length) return '';
    const S = window.PPStore;
    if (!S) return '';
    const done = lessons.filter(l => S.data.materiSeen && S.data.materiSeen[l]).length;
    if (!done) return '';
    const pct = Math.round(done / lessons.length * 100);
    return `<span class="mh-prog" style="background:rgba(255,255,255,.25);border-radius:20px;padding:2px 8px;font-size:11px;">✓ ${pct}%</span>`;
  }

  PP.screens = PP.screens || {};

  PP.screens.materi_hub = function () {
    return {
      html: `<div class="wrap narrowish">
        <!-- Header -->
        <div class="panel fill pad lb" style="margin-bottom:8px;">
          <h2 class="h-title" style="margin:0">📚 Materi Teorema Pythagoras</h2>
          <p class="small" style="margin:4px 0 0;">Kelas VIII — SMP/MTs. Pilih bab yang ingin kamu pelajari.</p>
        </div>

        <!-- Grid bab materi -->
        <div class="mh-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:12px;">
          ${BAB.map(b => `
          <button class="mh-card" data-mh="${b.route}" style="
            background:${b.color};color:#fff;border:none;border-radius:14px;
            padding:16px 12px 14px;text-align:left;cursor:pointer;
            display:flex;flex-direction:column;gap:4px;
            box-shadow:0 3px 10px rgba(0,0,0,.2);transition:transform .15s;
            min-height:120px;">
            <span style="font-size:28px;line-height:1;">${b.icon}</span>
            <span style="font-size:10px;opacity:.8;font-weight:700;letter-spacing:.5px;">${b.label}</span>
            <b style="font-size:13px;line-height:1.3;">${b.title}</b>
            <span style="font-size:11px;opacity:.85;line-height:1.3;">${b.desc}</span>
            <span class="mh-progwrap" data-lessons="${b.lessons.join(',')}" style="margin-top:auto;"></span>
          </button>`).join('')}
        </div>

        <!-- Eksplorasi interaktif -->
        <div class="panel pad" style="margin-bottom:10px;">
          <h3 style="margin:0 0 8px;">🔍 Eksplorasi Interaktif</h3>
          <p class="small" style="margin:0 0 10px;">Geser slider a dan b — lihat bagaimana segitiga dan luas persegi berubah secara otomatis.</p>
          <div class="row" style="gap:8px;flex-wrap:wrap;">
            <button class="btn green sm" data-mh="eksplorasiSlider">▶ Buka Eksplorasi Slider</button>
            <button class="btn blue sm" data-mh="eksplorasi">🌐 Eksplorasi 3D & QR</button>
          </div>
        </div>

        <!-- Kelompok belajar -->
        <div class="panel pad" style="margin-bottom:10px;">
          <h3 style="margin:0 0 10px;">👥 Panduan Per Kelompok</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;">
            ${KELOMPOK.map(k => `
            <button class="mh-card" data-mh="${k.route}" style="
              background:${k.color};color:#fff;border:none;border-radius:12px;
              padding:12px;text-align:left;cursor:pointer;
              box-shadow:0 2px 8px rgba(0,0,0,.2);min-height:100px;">
              <span style="font-size:22px;">${k.icon}</span>
              <div style="font-size:10px;opacity:.8;font-weight:700;margin:4px 0 2px;">${k.label}</div>
              <b style="font-size:12px;display:block;line-height:1.3;">${k.title}</b>
              <span style="font-size:10px;opacity:.85;display:block;margin-top:4px;line-height:1.3;">${k.desc}</span>
            </button>`).join('')}
          </div>
        </div>

        <!-- Shortcut ke fitur lain -->
        <div class="panel pad" style="margin-bottom:10px;">
          <h3 style="margin:0 0 8px;">🎮 Latihan & Evaluasi</h3>
          <div class="row" style="gap:8px;flex-wrap:wrap;">
            <button class="btn purple sm" data-mh="kuis">📝 Kuis Interaktif</button>
            <button class="btn gold sm" data-mh="games">🎯 Game & Tantangan</button>
            <button class="btn sm" data-mh="jelajah">🗺 Jelajah Dunia</button>
            <button class="btn sm" data-mh="lkpd">📋 LKPD Proyek</button>
          </div>
        </div>

        <div style="text-align:right;color:var(--muted,#888);font-size:11px;padding-bottom:8px;">
          Made by Didit Fakhrullah
        </div>
      </div>`,

      mount(root) {
        /* Navigasi semua tombol kartu */
        root.querySelectorAll('[data-mh]').forEach(btn => {
          btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-2px)');
          btn.addEventListener('mouseleave', () => btn.style.transform = '');
          btn.addEventListener('click', () => {
            const r = btn.dataset.mh;
            if (r.startsWith('materi/')) {
              PP.go('materi', r.split('/')[1]);
            } else {
              PP.go(r);
            }
          });
        });

        /* Render badge progres per kartu */
        root.querySelectorAll('[data-lessons]').forEach(el => {
          const ls = el.dataset.lessons ? el.dataset.lessons.split(',').filter(Boolean) : [];
          el.innerHTML = progress(ls);
        });
      }
    };
  };

  /* Daftarkan ke TITLES */
  if (window.PP && PP.TITLES) PP.TITLES.materi_hub = 'Materi Pembelajaran';
  document.addEventListener('pp-ready', () => {
    if (window.PP && PP.TITLES) PP.TITLES.materi_hub = 'Materi Pembelajaran';
  });

})();
