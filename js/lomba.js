/* Hub "Fitur Lomba": satu pintu ke fitur tambahan (rekap, misi, toko, lencana, buat soal, sertifikat, aksesibilitas). */
(function () {
  'use strict';
  const I = n => `<img class="px" src="assets/lomba/ikon/${n}.png" alt="" draggable="false">`;
  PP.ICONS = PP.ICONS || {};
  PP.ICONS.lomba = `<svg class="mic mic-lomba" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="26" r="20" fill="#ffd34d" stroke="#3b2412" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="32" cy="26" r="13" fill="#fff8e6" stroke="#3b2412" stroke-width="2.5"/><path d="M32 14 L35 22 L44 22 L37 27 L40 36 L32 31 L24 36 L27 27 L20 22 L29 22 Z" fill="#ffd34d" stroke="#3b2412" stroke-width="2" stroke-linejoin="round"/><path d="M22 44 L16 58 L32 51 L48 58 L42 44" fill="#e5484d" stroke="#3b2412" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const CARDS = [
    ['rekap', 'Rekap Nilai', 'Semua nilai, cetak, Excel, Word, PDF.', 'ikon_rapor', 'guru'],
    ['laporan', 'Sertifikat & Rapor', 'Sertifikat PNG dan rapor belajar.', 'ikon_sertifikat'],
    ['misi', 'Misi Harian', '3 misi tiap hari + streak.', 'ikon_misi_harian'],
    ['lencana', 'Koleksi Lencana', 'Lencana yang sudah kamu dapat.', 'ikon_koleksi_lencana'],
    ['toko', 'Toko Kostum', 'Tukar koin, pakai di karakter.', 'ikon_toko_kostum'],
    ['buatsoal', 'Buat Soal', 'Soal buatan jadi warga di Jelajah.', 'ikon_buat_soal'],
    ['a11y', 'Aksesibilitas', 'Suara, huruf, kontras, gerak.', 'ikon_aksesibilitas']
  ];
  PP.screens.lomba = function () {
    return {
      html: `<div class="wrap narrowish"><div class="panel fill pad lb"><h2 class="h-title" style="margin:0">Rekap dan Upload</h2><p class="small" style="margin:0">Fitur tambahan untuk belajar, mengajar, dan berbagi.</p>
        <div class="lb-grid">${CARDS.map(c => `<button class="lb-card" data-lb="${c[0]}"><span class="lb-ic">${I(c[3])}</span><b>${c[1]}</b><span class="lb-d">${c[2]}</span>${c[4] ? '<em class="lb-tag">Guru</em>' : ''}</button>`).join('')}</div></div></div>`,
      mount(root) {
        root.querySelectorAll('[data-lb]').forEach(b => b.onclick = () => {
          const k = b.dataset.lb;
          if (k === 'a11y') { if (window.PPA11y) PPA11y.open(); else PP.ui.toast('Panel aksesibilitas belum tersedia.'); }
          else if (PP.screens[k]) PP.go(k); else PP.ui.toast('Fitur ini belum tersedia.');
        });
      }
    };
  };
})();
