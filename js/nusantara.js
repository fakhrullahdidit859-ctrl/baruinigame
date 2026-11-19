/* =========================================================
   DUNIA NUSANTARA — soal Pythagoras berkonteks bangunan dan budaya Indonesia.
   Semua soal memakai tripel Pythagoras (jawaban bulat) dan DIVERIFIKASI saat dimuat:
   a² + b² = c² dan kunci jawaban = nilai hitung. Bila ada yang tidak cocok -> console.error.
   Angka pada soal adalah ILUSTRASI, bukan ukuran bangunan asli.
   ========================================================= */
(function () {
  'use strict';
  const O = n => '../lomba/dunia/objek/' + n;               // jalur relatif terhadap assets/img/
  const note = '<br><small>(Angka hanya ilustrasi.)</small>';
  /* kasus: a = sisi tegak, b = sisi alas (mendatar), c = sisi miring. cari: 'c' atau 'a' atau 'b' */
  // Jalur aset Nusantara baru (crop dari Lembar Aset Budaya)
  const N = n => n;  // aset di assets/img/ langsung
  const CASES = [
    { who: ['Pak Bayu', 'nusa_laki_0', 330, 840, 'bl,ba'], obj: 'nusa_rumah_gadang', ow: 200, ox: 500, oy: 600, t: 'Atap Rumah Gadang', a: 6, b: 8, c: 10, find: 'c', unit: 'm', fact: 'Rumah Gadang adalah rumah adat Minangkabau dari Sumatera Barat. Atapnya bergonjong dan melengkung ke atas.',
      q: 'Kerangka atap sebuah rumah adat bergonjong memakai tiang tegak setinggi 6 m. Jarak mendatar dari kaki tiang ke ujung atap 8 m. Berapa panjang balok miring penghubungnya?',
      s: { a: 9, b: 12, c: 15 } },
    { who: ['Bu Laras', 'nusa_cewek_0', 470, 760, 'ke,se'], obj: 'nusa_pura_bali', ow: 140, ox: 930, oy: 520, t: 'Atap Pura Bali', a: 12, b: 5, c: 13, find: 'a', unit: 'm', fact: 'Pura adalah tempat ibadah umat Hindu di Bali. Menaranya bertingkat-tingkat disebut meru.',
      q: 'Sebuah balok miring pada atap meru panjangnya 13 m. Jarak mendatarnya 5 m. Berapa tinggi tegaknya?',
      s: { a: 15, b: 20, c: 25 } },
    { who: ['Kak Tegar', 'nusa_batik_0', 620, 850, 'pe'], obj: 'nusa_borobudur', ow: 150, ox: 1290, oy: 360, t: 'Tangga Borobudur', a: 8, b: 15, c: 17, find: 'c', unit: 'dm', fact: 'Borobudur adalah candi Buddha terbesar di dunia yang terletak di Jawa Tengah, dibangun abad ke-8.',
      q: 'Tangga candi naik 8 dm secara tegak dengan jarak mendatar 15 dm. Berapa panjang lintasan miring tangganya?',
      s: { a: 5, b: 12, c: 13 } },
    { who: ['Pak Wayan', 'nusa_laki_0', 800, 720, 'ik'], obj: 'nusa_gapura_bali', ow: 120, ox: 700, oy: 1010, t: 'Gapura Bali', a: 7, b: 24, c: 25, find: 'c', unit: 'm', fact: 'Gapura candi bentar adalah pintu masuk khas Bali yang terbelah dua. Tingginya bervariasi dari 3 sampai 15 meter.',
      q: 'Tali diagonal gapura dipasang dari puncak setinggi 7 m ke titik mendatar sejauh 24 m. Berapa panjang tali itu?',
      s: { a: 8, b: 15, c: 17 } },
    { who: ['Bu Sekar', 'nusa_hijab_0', 970, 790, 'ke'], obj: 'nusa_jembatan', ow: 120, ox: 1250, oy: 900, t: 'Jembatan Bambu', a: 20, b: 21, c: 29, find: 'c', unit: 'm', fact: 'Jembatan bambu adalah jembatan tradisional yang masih dipakai di pedesaan Indonesia karena kuat dan tahan lama.',
      q: 'Sebuah jembatan bambu menanjak setinggi 20 m dengan jarak mendatar 21 m. Berapa panjang lintasan miring jembatan itu?',
      s: { a: 7, b: 24, c: 25 } },
    { who: ['Mbak Intan', 'nusa_cewek_0', 1110, 650, 'se,ke'], obj: O('perahu_jukung'), ow: 150, ox: 360, oy: 1020, t: 'Perahu Jukung', a: 3, b: 4, c: 5, find: 'b', unit: 'm', fact: 'Jukung adalah perahu tradisional berukuran kecil yang dipakai di perairan beberapa daerah di Nusantara.',
      q: 'Tali pengikat layar sebuah perahu panjangnya 5 m dan terikat pada ujung tiang setinggi 3 m. Berapa jarak titik ikat tali di dek ke kaki tiang?',
      s: { a: 6, b: 8, c: 10 } },
    { who: ['Pak Sapto', 'nusa_laki_0', 1220, 530, 'ca'], obj: 'nusa_sumur', ow: 70, ox: 1070, oy: 890, t: 'Sumur Tradisional', a: 12, b: 9, c: 15, find: 'a', unit: 'm', fact: 'Sumur tradisional ditemukan di hampir setiap desa di Nusantara sebagai sumber air bersih bagi warga.',
      q: 'Sebuah tali timba panjangnya 15 m dipasang miring dari bibir sumur ke katrol. Jarak mendatarnya 9 m. Berapa dalam sumur itu?',
      s: { a: 3, b: 4, c: 5 } },
    { who: ['Dek Rahmat', 'nusa_batik_0', 1140, 400, 'pe,ba'], obj: 'nusa_sawah', ow: 160, ox: 820, oy: 330, t: 'Sawah Terasering', a: 10, b: 24, c: 26, find: 'c', unit: 'm', fact: 'Sawah terasering dibuat bertingkat di lereng bukit supaya air dan tanah tertahan dan padi dapat ditanam.',
      q: 'Sebuah jalan setapak di lereng sawah terasering naik 10 m dengan jarak mendatar 24 m. Berapa panjang jalan setapak itu?',
      s: { a: 20, b: 21, c: 29, find: 'a' } }
  ];
  const fmtU = (v, u) => v + ' ' + u;
  /* soal pilihan ganda dari kasus */
  const Q = CASES.map((k, i) => {
    const ans = k.find === 'c' ? k.c : k.find === 'a' ? k.a : k.b, other = [ans + 1, ans > 2 ? ans - 1 : ans + 2, k.find === 'c' ? k.a + k.b : ans + 2, ans + 3];
    const uniq = []; [ans].concat(other).forEach(v => { if (uniq.indexOf(v) < 0 && v > 0) uniq.push(v); }); while (uniq.length < 4) uniq.push(uniq[uniq.length - 1] + 2);
    const opts = uniq.slice(0, 4), pos = (i * 3 + 1) % 4, ordered = opts.slice(1); ordered.splice(pos, 0, opts[0]);
    return { lv: i < 3 ? 'Mudah' : i < 6 ? 'Sedang' : 'Sulit', q: k.q + note, o: ordered.map(v => fmtU(v, k.unit)), a: pos, _ans: ans, _k: k,
      e: (k.find === 'c' ? `c² = a² + b² = ${k.a}² + ${k.b}² = ${k.a * k.a} + ${k.b * k.b} = ${k.c * k.c}, jadi c = √${k.c * k.c} = ${k.c} ${k.unit}.` : k.find === 'a' ? `a² = c² − b² = ${k.c}² − ${k.b}² = ${k.c * k.c} − ${k.b * k.b} = ${k.a * k.a}, jadi a = √${k.a * k.a} = ${k.a} ${k.unit}.` : `b² = c² − a² = ${k.c}² − ${k.a}² = ${k.c * k.c} − ${k.a * k.a} = ${k.b * k.b}, jadi b = √${k.b * k.b} = ${k.b} ${k.unit}.`) + '<br><b>Tahukah kamu?</b> ' + k.fact };
  });
  /* kartu studi kasus (stasiun): ilustrasi + hitungan bertahap */
  function studiHtml(k) {
    const s = k.s, find = s.find || 'c', a = s.a, b = s.b, c = s.c, u = k.unit;
    const lab = (v, f) => f ? '?' : v + ' ' + u;
    const svg = `<svg viewBox="0 0 220 150" role="img" aria-label="Segitiga siku-siku: tegak ${a}, alas ${b}, miring ${c}" style="width:100%;max-width:260px;display:block;margin:0 auto"><polygon points="30,125 190,125 30,25" fill="#ffe08a" stroke="#3b2412" stroke-width="3" stroke-linejoin="round"/><path d="M30,111 h14 v14" fill="none" stroke="#3b2412" stroke-width="2.5"/><text x="18" y="80" text-anchor="end" font-size="15" font-weight="800" fill="#3b2412">${lab(a, find === 'a')}</text><text x="110" y="144" text-anchor="middle" font-size="15" font-weight="800" fill="#3b2412">${lab(b, find === 'b')}</text><text x="124" y="66" font-size="15" font-weight="800" fill="#c44d3f">${lab(c, find === 'c')}</text></svg>`;
    const steps = find === 'c' ? [`Sisi miring dicari: c² = a² + b²`, `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}`, `c = √${c * c} = <b>${c} ${u}</b>`] : find === 'a' ? [`Sisi tegak dicari: a² = c² − b²`, `a² = ${c}² − ${b}² = ${c * c} − ${b * b} = ${a * a}`, `a = √${a * a} = <b>${a} ${u}</b>`] : [`Sisi alas dicari: b² = c² − a²`, `b² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}`, `b = √${b * b} = <b>${b} ${u}</b>`];
    return `<h3>${k.t}</h3>${svg}<p class="small" style="margin:4px 0">Studi kasus: sisi tegak <b>${find === 'a' ? '?' : a + ' ' + u}</b>, alas <b>${find === 'b' ? '?' : b + ' ' + u}</b>, miring <b>${find === 'c' ? '?' : c + ' ' + u}</b>.</p><ol class="small" style="margin:0 0 4px 1.2em">${steps.map(x => `<li>${x}</li>`).join('')}</ol><p class="small" style="margin:4px 0"><b>Tahukah kamu?</b> ${k.fact}</p><p class="small muted" style="margin:0">Angka pada kartu ini adalah ilustrasi, bukan ukuran bangunan asli.</p>`;
  }
  const trip = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
  const isTrip = (a, b, c) => a * a + b * b === c * c && a > 0 && b > 0;
  const world = {
    name: 'Nusantara', short: 'Nusantara', kind: 'grass', base: '#86b04a', alt: '#79a43f', spawn: [160, 940], after: 2, q: CASES.map((k, i) => 300 + i),
    trees: ['nusa_pohon', 'nusa_palem', 'nusa_bambu', 'nusa_palem_buah'], pond: [720, 300, 180, 120],
    npcs: CASES.map(k => k.who),
    build: [
      ...CASES.map(k => [k.obj, k.ox, k.oy, k.ow]),
      // Dekorasi budaya tambahan
      ['nusa_warung',   200, 400, 90],
      ['nusa_gong',     1050, 750, 90],
      ['nusa_angklung', 850,  600, 70],
      ['nusa_arca',     420,  500, 70],
      ['nusa_gapura_bunga', 980, 420, 90],
      ['nusa_rumah_melayu', 1300, 700, 160],
    ],
    studi: CASES.map(k => ({ title: k.t, cx: k.ox, cy: k.oy + 16, R: Math.max(70, k.ow * 0.55), html: studiHtml(k) })),
    shapes: [], portals: [{ x: 70, y: 1040, to: 2, label: 'Kembali ke Kota' }], birds: 6, butterflies: 8, animals: {},
    welcome: 'Selamat datang di Nusantara! Temui warga berpakaian daerah dan pelajari bangunan tradisional lewat Teorema Pythagoras.'
  };
  /* verifikasi seluruh soal dan kartu saat dimuat */
  function verify() {
    let bad = 0;
    CASES.forEach((k, i) => {
      [[k.a, k.b, k.c], [k.s.a, k.s.b, k.s.c]].forEach(t => { if (!isTrip(t[0], t[1], t[2])) { bad++; console.error('Nusantara: bukan tripel', i, t); } });
      const q = Q[i], calc = Math.sqrt(k.find === 'c' ? k.a * k.a + k.b * k.b : k.find === 'a' ? k.c * k.c - k.b * k.b : k.c * k.c - k.a * k.a);
      if (calc !== Math.round(calc) || parseInt(q.o[q.a], 10) !== calc) { bad++; console.error('Nusantara: kunci jawaban salah', i); }
      if (new Set(q.o).size !== 4) { bad++; console.error('Nusantara: pilihan kembar', i); }
    });
    return bad === 0;
  }
  PP.NUSA = { world, Q, CASES, verify, TRIPEL: trip };
  PP.NUSA.ok = verify();
})();
