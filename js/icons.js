/* =========================================================
   IKON MENU (SVG vektor) — utuh, tajam, konsisten di semua ukuran
   PP.ICONS[nama] -> string <svg>. viewBox 64x64, garis tepi cokelat tua.
   ========================================================= */
(function () {
  const O = '#3b2412', S = `stroke="${O}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const svg = (name, body) => `<svg class="mic mic-${name}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${body}</svg>`;
  PP.ICONS = {
    /* ---- Tujuan Pembelajaran: target/sasaran ---- */
    tujuan: svg('tujuan', `
      <circle cx="32" cy="32" r="26" fill="#fff" ${S}/>
      <circle cx="32" cy="32" r="19" fill="#e5484d" ${S}/>
      <circle cx="32" cy="32" r="12" fill="#fff" ${S}/>
      <circle cx="32" cy="32" r="5" fill="#e5484d" ${S}/>
      <path d="M33 31 L54 10" ${S} fill="none"/>
      <path d="M48 8 L56 8 L56 16 L52 14 L50 12 Z" fill="#ffd34d" ${S}/>`),

    /* ---- Peta Petualangan: peta lipat ---- */
    peta: svg('peta', `
      <path d="M5 15 L22 10 L22 52 L5 57 Z" fill="#a8dc78" ${S}/>
      <path d="M22 10 L42 16 L42 58 L22 52 Z" fill="#f8e6ae" ${S}/>
      <path d="M42 16 L59 10 L59 52 L42 58 Z" fill="#8fd0f0" ${S}/>
      <path d="M10 44 Q18 30 28 38 T46 28" fill="none" stroke="#e5484d" stroke-width="2.5" stroke-dasharray="2 5" stroke-linecap="round"/>
      <path d="M44 20 L52 30 M52 20 L44 30" stroke="#e5484d" stroke-width="4" stroke-linecap="round"/>`),

    /* ---- Materi Pembelajaran: buku terbuka ---- */
    materi: svg('materi', `
      <path d="M4 18 L4 54 Q18 48 32 56 Q46 48 60 54 L60 18 Z" fill="#3d78c4" ${S}/>
      <path d="M32 16 Q19 8 6 12 L6 50 Q19 46 32 53 Z" fill="#fff8e6" ${S}/>
      <path d="M32 16 Q45 8 58 12 L58 50 Q45 46 32 53 Z" fill="#fff8e6" ${S}/>
      <path d="M11 22 Q19 20 26 24 M11 30 Q19 28 26 32 M11 38 Q19 36 26 40" fill="none" stroke="#b9a77a" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M38 24 Q45 20 53 22 M38 32 Q45 28 53 30" fill="none" stroke="#b9a77a" stroke-width="2.4" stroke-linecap="round"/>`),

    /* ---- Buku Digital: buku dengan layar ---- */
    buku: svg('buku', `
      <rect x="8" y="8" width="48" height="40" rx="5" fill="#3d78c4" ${S}/>
      <rect x="13" y="13" width="38" height="30" rx="3" fill="#e8f4ff" stroke="${O}" stroke-width="2"/>
      <path d="M32 13 V43" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M17 20 H29 M17 26 H29 M17 32 H26" stroke="#3d78c4" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M35 20 H47 M35 26 H47 M35 32 H44" stroke="#3d78c4" stroke-width="2.2" stroke-linecap="round"/>
      <rect x="20" y="48" width="24" height="8" rx="3" fill="#c07a2a" ${S}/>
      <rect x="28" y="43" width="8" height="6" fill="#8a5a1e" stroke="${O}" stroke-width="2"/>`),

    /* ---- Video Animasi: layar play ---- */
    video: svg('video', `
      <rect x="4" y="8" width="56" height="38" rx="7" fill="#3a4a8a" ${S}/>
      <rect x="9" y="13" width="46" height="28" rx="3" fill="#86d0ff" stroke="${O}" stroke-width="2"/>
      <path d="M26 19 L26 35 L44 27 Z" fill="#ffd34d" ${S}/>
      <path d="M18 56 H46 M32 46 V56" ${S} fill="none"/>`),

    /* ---- Eksplorasi Pythagoras: kompas ---- */
    eksplorasi: svg('eksplorasi', `
      <circle cx="32" cy="32" r="27" fill="#d9a441" ${S}/>
      <circle cx="32" cy="32" r="20" fill="#fff8e6" ${S}/>
      <path d="M32 10 V16 M32 48 V54 M10 32 H16 M48 32 H54" stroke="${O}" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M32 12 L38 32 L26 32 Z" fill="#e5484d" ${S}/>
      <path d="M32 52 L38 32 L26 32 Z" fill="#5a7fb8" ${S}/>
      <circle cx="32" cy="32" r="4" fill="#ffd34d" stroke="${O}" stroke-width="2"/>`),

    /* ---- Game dan Tantangan: gamepad ---- */
    games: svg('games', `
      <path d="M13 18 H51 Q61 18 62 34 Q63 52 52 52 Q46 52 42 44 H22 Q18 52 12 52 Q2 52 3 34 Q4 18 13 18 Z" fill="#7b5cd6" ${S}/>
      <path d="M15 32 H23 M19 28 V36" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="43" cy="30" r="4" fill="#ffd34d" ${S}/>
      <circle cx="52" cy="37" r="4" fill="#ff6b6b" ${S}/>
      <path d="M28 29 H38" stroke="#c9b8ff" stroke-width="3" stroke-linecap="round"/>`),

    /* ---- Kuis Interaktif: balon tanya ---- */
    kuis: svg('kuis', `
      <path d="M12 7 H52 Q59 7 59 14 V40 Q59 47 52 47 H34 L20 58 L22 47 H12 Q5 47 5 40 V14 Q5 7 12 7 Z" fill="#fff8e6" ${S}/>
      <text x="32" y="40" text-anchor="middle" font-family="Nunito,Arial Rounded MT Bold,sans-serif" font-weight="900" font-size="34" fill="#3d78c4" stroke="${O}" stroke-width="1.6" paint-order="stroke">?</text>`),

    /* ---- Refleksi: bola lampu ---- */
    refleksi: svg('refleksi', `
      <path d="M32 6 C19 6 11 15 11 26 C11 34 16 38 20 43 V47 H44 V43 C48 38 53 34 53 26 C53 15 45 6 32 6 Z" fill="#ffe066" ${S}/>
      <path d="M25 38 Q32 28 39 38" fill="none" stroke="#d98a1c" stroke-width="2.6" stroke-linecap="round"/>
      <rect x="22" y="47" width="20" height="6" rx="3" fill="#b9bccf" ${S}/>
      <rect x="26" y="53" width="12" height="6" rx="3" fill="#8c90a8" ${S}/>
      <path d="M18 15 Q21 11 25 10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`),

    /* ---- Program Penilaian: piala ---- */
    nilai: svg('nilai', `
      <path d="M20 10 H8 Q6 26 20 30" fill="none" ${S}/>
      <path d="M44 10 H56 Q58 26 44 30" fill="none" ${S}/>
      <path d="M18 5 H46 V24 Q46 38 32 42 Q18 38 18 24 Z" fill="#ffcf3d" ${S}/>
      <path d="M32 12 L35 20 L44 20 L37 25 L40 34 L32 29 L24 34 L27 25 L20 20 L29 20 Z" fill="#fff6c8" stroke="${O}" stroke-width="2" stroke-linejoin="round"/>
      <rect x="29" y="42" width="6" height="9" fill="#e0a21f" ${S}/>
      <rect x="18" y="51" width="28" height="9" rx="3" fill="#c07a2a" ${S}/>`),

    /* ---- Absen Kehadiran: papan ceklis ---- */
    absen: svg('absen', `
      <rect x="9" y="10" width="46" height="50" rx="6" fill="#c98b4a" ${S}/>
      <rect x="14" y="16" width="36" height="40" rx="3" fill="#fff8e6" ${S}/>
      <rect x="22" y="6" width="20" height="12" rx="4" fill="#7b5cd6" ${S}/>
      <path d="M20 28 L26 34 L38 22" fill="none" stroke="#43b33f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 40 L26 46 L38 34" fill="none" stroke="#43b33f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 50 H38" stroke="#c98b4a" stroke-width="2.5" stroke-linecap="round"/>`),

    /* ---- Planning Pembelajaran: buku catatan ---- */
    planning: svg('planning', `
      <rect x="10" y="6" width="44" height="52" rx="5" fill="#ffd34d" ${S}/>
      <rect x="16" y="12" width="32" height="40" rx="3" fill="#fff8e6" stroke="${O}" stroke-width="2"/>
      <path d="M16 20 H48 M16 28 H48 M16 36 H38" stroke="#c98b4a" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M34 44 L38 48 L46 38" fill="none" stroke="#43b33f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="24" y="2" width="16" height="10" rx="3" fill="#c07a2a" ${S}/>`),

    /* ---- LKPD Proyek: clipboard proyek ---- */
    m_lkpd: svg('lkpd', `
      <rect x="10" y="8" width="44" height="52" rx="6" fill="#2f6fd0" ${S}/>
      <rect x="16" y="16" width="32" height="38" rx="3" fill="#fff8e6" stroke="${O}" stroke-width="2"/>
      <rect x="22" y="4" width="20" height="10" rx="4" fill="#7fc4ff" ${S}/>
      <circle cx="32" cy="30" r="8" fill="none" stroke="#2f6fd0" stroke-width="3"/>
      <path d="M28 30 L31 33 L36 27" fill="none" stroke="#2f6fd0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 44 H44 M20 50 H36" stroke="#c98b4a" stroke-width="2.5" stroke-linecap="round"/>`),

    /* ---- Integrasi Platform: titik terhubung ---- */
    m_integrasi: svg('integrasi2', `
      <circle cx="32" cy="32" r="9" fill="#ffd54a" ${S}/>
      <path d="M32 23 V12 M32 41 V52 M23 32 H12 M41 32 H52" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="32" cy="9" r="6" fill="#00c4cc" ${S}/>
      <circle cx="32" cy="55" r="6" fill="#ef5350" ${S}/>
      <circle cx="9" cy="32" r="6" fill="#9b72cb" ${S}/>
      <circle cx="55" cy="32" r="6" fill="#66bb6a" ${S}/>`),

    /* ---- Mode Offline: awan unduh ---- */
    m_offline: svg('offline', `
      <path d="M48 32 C50 23 44 14 34 13 C30 7 20 7 16 14 C8 15 4 22 6 30 C4 38 10 44 18 44 H48 C54 44 58 39 56 33 C55 28 51 25 48 32 Z" fill="#8fe0ff" ${S}/>
      <path d="M32 50 V35 M25 43 L32 50 L39 43" fill="none" stroke="#2f6fd0" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 56 H44" stroke="#2f6fd0" stroke-width="3" stroke-linecap="round"/>`),

    /* ---- Fitur Lomba: medali bintang ---- */
    lomba: svg('lomba', `
      <circle cx="32" cy="28" r="20" fill="#ffd34d" ${S}/>
      <circle cx="32" cy="28" r="14" fill="#fff8e6" ${S}/>
      <path d="M32 16 L35 24 L44 24 L37 29 L40 38 L32 33 L24 38 L27 29 L20 24 L29 24 Z" fill="#ffd34d" stroke="${O}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M24 46 L18 58 L32 52 L46 58 L40 46" fill="#e5484d" ${S}/>
      <path d="M24 46 H40" stroke="${O}" stroke-width="2.5" stroke-linecap="round"/>`),

    /* ---- Pengaturan Akun: roda gigi ---- */
    pengaturan: svg('pengaturan', `
      <path d="M32 6 L36 14 Q40 13 43 16 L51 12 L52 16 L48 23 Q51 27 51 32 L59 35 L59 39 L51 42 Q51 47 48 50 L52 57 L49 59 L41 55 Q38 58 34 58 L32 64 L30 64 L28 58 Q24 57 21 55 L13 59 L10 57 L14 50 Q11 47 11 42 L3 39 L3 35 L11 32 Q11 27 14 23 L10 16 L11 12 L19 16 Q22 13 26 14 Z" fill="#8b5cf6" ${S}/>
      <circle cx="32" cy="32" r="10" fill="#fff8e6" ${S}/>
      <circle cx="32" cy="32" r="5" fill="#c4b5fd" ${S}/>`),

    /* ---- Kegiatan Pendahuluan: masjid/mushala ---- */
    pendahuluan: svg('pendahuluan', `
      <path d="M8 58 V34 H56 V58 Z" fill="#f2e3be" ${S}/>
      <path d="M14 34 Q32 2 50 34 Z" fill="#1b8f6f" ${S}/>
      <path d="M28 58 V46 Q32 38 36 46 V58 Z" fill="#0f6b53" ${S}/>
      <path d="M32 6 V2" stroke="${O}" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 2 Q36 2 36 6 Q36 10 32 10 Q28 10 28 6 Z" fill="#ffd34d" ${S}/>
      <circle cx="14" cy="46" r="3" fill="#ffd34d" stroke="${O}" stroke-width="2"/>
      <circle cx="50" cy="46" r="3" fill="#ffd34d" stroke="${O}" stroke-width="2"/>`)
  };
})();
