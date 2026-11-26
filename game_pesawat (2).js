/* =========================================================
   GAME PESAWAT PEMBURU — tembak jawaban Pythagoras yang benar
   Soal muncul di atas, musuh membawa pilihan jawaban melayang turun.
   Tembak jawaban BENAR → poin. Tembak salah / lolos → nyawa berkurang.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- soal Pythagoras ---------- */
  const SOAL = (() => {
    const tripel = [
      [3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],
      [9,12,15],[10,24,26],[20,21,29],[9,40,41],[12,35,37],
      [15,20,25],[5,10,11],[8,10,13],[6,9,11],[4,7,9],
    ];
    const soal = [];
    tripel.forEach(([a,b,c]) => {
      // cari c
      soal.push({ soal:`a=${a}, b=${b}, c=?`, jawab:c, salah:[c+1,c-1,c+2,Math.round(Math.sqrt(a*a+b*b+1))] });
      // cari a
      soal.push({ soal:`b=${b}, c=${c}, a=?`, jawab:a, salah:[a+1,a-1,a+3,Math.round(Math.sqrt(c*c-b*b+4))] });
      // benar/salah — apakah ini tripel Pythagoras?
      soal.push({ soal:`${a}²+${b}²=${c}²?`, jawab:'Ya', salah:['Tidak','Mungkin','Salah'] });
    });
    // tambah soal salah-benar palsu
    [[3,4,6],[5,12,14],[6,8,11]].forEach(([a,b,c]) => {
      soal.push({ soal:`${a}²+${b}²=${c}²?`, jawab:'Tidak', salah:['Ya','Mungkin','Benar'] });
    });
    return soal;
  })();

  function acak(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
  function shuffle(arr) { const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
  function unik(jawab, salah) {
    const pool = shuffle(salah.filter(s=>String(s)!==String(jawab))).slice(0,3);
    return shuffle([jawab, ...pool].slice(0,4));
  }

  PP.screens.game_pesawat = function () {
    return {
      html: `<div class="gp-wrap" id="gpWrap">
        <canvas id="gpCanvas" style="display:block;width:100%;height:100%;image-rendering:pixelated"></canvas>
        <div id="gpUI" style="position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none"></div>
      </div>`,
      mount(root) { startGame(root); }
    };
  };

  function startGame(root) {
    const wrap = root.querySelector('#gpWrap');
    const canvas = root.querySelector('#gpCanvas');
    const ui = root.querySelector('#gpUI');
    wrap.style.cssText = 'position:relative;width:100%;height:100%;background:#0a0e2e;overflow:hidden';

    let W, H;
    function resize() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    }
    resize();
    const obs = new ResizeObserver(resize); obs.observe(canvas);

    const ctx = canvas.getContext('2d');

    // State
    let poin = 0, nyawa = 3, combo = 0, maxCombo = 0;
    let running = true, soalIdx = 0;
    let pesawat = { x: 0.5, y: 0.85, w: 48, h: 40 };
    let peluru = [];
    let musuh = [];   // { x, y, label, benar, w, h, hp }
    let bintang = []; // background stars
    let ledakan = []; // efek
    let curSoal = null;
    let tick = 0;
    let spawnTimer = 0, spawnInterval = 120;
    let touch = { active: false, x: 0 };
    let gameOver = false;

    // Bintang latar
    for (let i=0; i<60; i++) bintang.push({ x: Math.random(), y: Math.random(), r: Math.random()*1.5+0.5, s: Math.random()*0.5+0.3 });

    function nextSoal() {
      curSoal = SOAL[soalIdx % SOAL.length];
      soalIdx = (soalIdx+1) % SOAL.length;
      if (soalIdx===0) soalIdx = Math.floor(Math.random()*SOAL.length);
      musuh = [];
      spawnTimer = 0;
      spawnInterval = Math.max(50, 120 - Math.floor(poin/5)*5);
    }

    function spawnMusuh() {
      if (!curSoal) return;
      const opts = unik(curSoal.jawab, curSoal.salah);
      const taken = [];
      opts.forEach((label, i) => {
        let x;
        do { x = 0.1 + Math.random()*0.8; } while (taken.some(t=>Math.abs(t-x)<0.22));
        taken.push(x);
        const benar = String(label)===String(curSoal.jawab);
        musuh.push({ x, y: -0.08, label, benar, w: 70, h: 36, speed: 0.0008+Math.random()*0.0004, hp:1 });
      });
    }

    function tembak() {
      peluru.push({ x: pesawat.x, y: pesawat.y - 0.04, speed: 0.018 });
    }

    function cekTumbukan() {
      peluru.forEach(p => {
        musuh.forEach(m => {
          const px = p.x*W, py = p.y*H, mx = m.x*W, my = m.y*H;
          if (Math.abs(px-mx)<m.w/2+4 && Math.abs(py-my)<m.h/2+6) {
            p.dead = true;
            if (m.benar) {
              m.dead = true;
              poin += (1 + combo);
              combo++;
              if (combo > maxCombo) maxCombo = combo;
              ledakan.push({ x: m.x, y: m.y, t: 1, benar: true, label: '+'+((1+combo-1)) });
              // hapus semua musuh dan minta soal baru
              musuh.forEach(z => z.dead = true);
              setTimeout(nextSoal, 400);
            } else {
              m.dead = true;
              combo = 0;
              nyawa--;
              ledakan.push({ x: m.x, y: m.y, t: 1, benar: false, label: '✗' });
              if (nyawa <= 0) { running = false; gameOver = true; showGameOver(); }
            }
          }
        });
      });
      // musuh lolos ke bawah
      musuh.forEach(m => {
        if (m.y > 1.1 && m.benar && !m.dead) {
          m.dead = true; combo = 0; nyawa--;
          if (nyawa <= 0) { running = false; gameOver = true; showGameOver(); }
        }
      });
      peluru = peluru.filter(p => !p.dead && p.y > -0.05);
      musuh = musuh.filter(m => !m.dead);
    }

    function update() {
      if (!running) return;
      tick++;
      // gerak bintang
      bintang.forEach(b => { b.y += b.s*0.0008; if(b.y>1) b.y=0; });
      // gerak peluru
      peluru.forEach(p => { p.y -= p.speed; });
      // gerak musuh
      musuh.forEach(m => { m.y += m.speed; });
      // ledakan
      ledakan.forEach(l => { l.t -= 0.04; }); ledakan = ledakan.filter(l=>l.t>0);
      // spawn
      if (!curSoal || musuh.length===0) {
        spawnTimer++;
        if (spawnTimer >= 30) { nextSoal(); spawnMusuh(); }
      }
      cekTumbukan();
      // auto tembak
      if (tick % 18 === 0) tembak();
    }

    function drawPesawat(x, y) {
      const px = x*W, py = y*H;
      ctx.save();
      ctx.translate(px, py);
      // body
      ctx.fillStyle = '#7ec8f7';
      ctx.beginPath();
      ctx.moveTo(0,-20); ctx.lineTo(14,10); ctx.lineTo(0,4); ctx.lineTo(-14,10); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='#2a5f8a'; ctx.lineWidth=1.5; ctx.stroke();
      // cockpit
      ctx.fillStyle='#b6eaff';
      ctx.beginPath(); ctx.ellipse(0,-6,5,8,0,0,Math.PI*2); ctx.fill();
      // sayap
      ctx.fillStyle='#4a9fd0';
      ctx.beginPath(); ctx.moveTo(-14,10); ctx.lineTo(-22,18); ctx.lineTo(-10,14); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(14,10); ctx.lineTo(22,18); ctx.lineTo(10,14); ctx.closePath(); ctx.fill();
      // api mesin
      if (tick%4<2) {
        ctx.fillStyle='#ff9933';
        ctx.beginPath(); ctx.moveTo(-4,10); ctx.lineTo(4,10); ctx.lineTo(0,20+Math.random()*6); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    function drawMusuh(m) {
      const mx = m.x*W, my = m.y*H;
      const benar = m.benar;
      ctx.save();
      ctx.translate(mx, my);
      // body UFO
      ctx.fillStyle = benar ? '#ff5252' : '#8b5cf6';
      ctx.beginPath(); ctx.ellipse(0,0,m.w/2,m.h/2,0,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = benar ? '#ff1744' : '#6d28d9'; ctx.lineWidth=2; ctx.stroke();
      // kubah
      ctx.fillStyle = benar ? '#ff867c' : '#a78bfa';
      ctx.beginPath(); ctx.ellipse(0,-4,m.w/3,m.h/2.5,0,Math.PI,0); ctx.fill();
      // label
      ctx.fillStyle='#fff';
      ctx.font = `bold ${Math.min(16, m.w/4.5)}px Nunito,sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(String(m.label), 0, 2);
      ctx.restore();
    }

    function drawPeluru(p) {
      const px = p.x*W, py = p.y*H;
      ctx.save();
      ctx.fillStyle='#ffe066';
      ctx.shadowColor='#ffd700'; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.ellipse(px,py,3,8,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    function drawLedakan(l) {
      const lx = l.x*W, ly = l.y*H, r = (1-l.t)*50;
      ctx.save(); ctx.globalAlpha = l.t;
      ctx.fillStyle = l.benar ? '#4ade80' : '#f87171';
      ctx.beginPath(); ctx.arc(lx,ly,r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff';
      ctx.font='bold 20px Nunito,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(l.label, lx, ly-20);
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0,0,W,H);
      // latar
      const grad = ctx.createLinearGradient(0,0,0,H);
      grad.addColorStop(0,'#0a0e2e'); grad.addColorStop(1,'#1a1050');
      ctx.fillStyle=grad; ctx.fillRect(0,0,W,H);
      // bintang
      bintang.forEach(b => {
        ctx.fillStyle=`rgba(255,255,255,${b.s})`;
        ctx.beginPath(); ctx.arc(b.x*W,b.y*H,b.r,0,Math.PI*2); ctx.fill();
      });
      // soal
      if (curSoal) {
        ctx.fillStyle='rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.roundRect(W/2-160,8,320,44,10); ctx.fill();
        ctx.fillStyle='#ffe066';
        ctx.font='bold 15px Nunito,sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('Jika '+curSoal.soal, W/2, 30);
      }
      // HUD
      ctx.fillStyle='#fff'; ctx.font='bold 14px Nunito,sans-serif';
      ctx.textAlign='left'; ctx.textBaseline='top';
      ctx.fillText('⭐ '+poin, 10, 10);
      ctx.textAlign='right';
      ctx.fillText('❤'.repeat(nyawa)+'🖤'.repeat(Math.max(0,3-nyawa)), W-10, 10);
      if (combo>1) {
        ctx.fillStyle='#ffd34d'; ctx.textAlign='center';
        ctx.font='bold 13px Nunito,sans-serif';
        ctx.fillText('COMBO x'+combo+'!', W/2, 56);
      }
      // musuh, peluru, pesawat, ledakan
      musuh.forEach(drawMusuh);
      peluru.forEach(drawPeluru);
      drawPesawat(pesawat.x, pesawat.y);
      ledakan.forEach(drawLedakan);
    }

    // Input
    function movePesawat(nx) { pesawat.x = Math.max(0.05, Math.min(0.95, nx)); }

    canvas.style.cursor = 'none';
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      movePesawat((e.clientX - r.left) / r.width);
    });
    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      movePesawat((e.touches[0].clientX - r.left) / r.width);
    }, { passive: false });
    canvas.addEventListener('click', tembak);

    function showGameOver() {
      obs.disconnect();
      ui.style.pointerEvents = 'auto';
      ui.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.7)">
        <div style="background:#1e1b4b;border:3px solid #7c3aed;border-radius:16px;padding:28px 36px;text-align:center;color:#fff;max-width:300px">
          <div style="font-size:48px">🚀</div>
          <h2 style="color:#ffe066;font-family:Nunito,sans-serif;margin:8px 0">Game Over!</h2>
          <p style="font-size:18px;margin:4px 0">Skor: <b style="color:#ffd34d">${poin}</b></p>
          <p style="font-size:14px;color:#a5b4fc">Combo tertinggi: ${maxCombo}</p>
          <div style="margin-top:16px;display:flex;gap:10px;justify-content:center">
            <button onclick="PP.go('game_pesawat')" style="background:#7c3aed;color:#fff;border:none;border-radius:8px;padding:10px 20px;font:bold 15px Nunito,sans-serif;cursor:pointer">Main Lagi</button>
            <button onclick="PP.go('lomba')" style="background:#334155;color:#fff;border:none;border-radius:8px;padding:10px 20px;font:bold 15px Nunito,sans-serif;cursor:pointer">Kembali</button>
          </div>
        </div>
      </div>`;
      try { PPStore.recordMiniGame('pesawat', poin, maxCombo); } catch(e){}
    }

    // Loop
    let raf;
    function loop() {
      update(); draw();
      if (running) raf = requestAnimationFrame(loop);
    }
    nextSoal(); spawnMusuh();
    raf = requestAnimationFrame(loop);

    // Cleanup saat pindah halaman
    const orig = PP.go.bind(PP);
    const cleanup = () => { running = false; obs.disconnect(); cancelAnimationFrame(raf); };
    root.addEventListener('pp-unmount', cleanup);
  }
})();
