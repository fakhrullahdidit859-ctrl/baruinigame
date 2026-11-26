/* =========================================================
   TETRIS PYTHAGORAS — susun segitiga agar sisinya membentuk tripel Pythagoras
   Blok berbentuk segitiga siku-siku jatuh. Ketika 3 blok berdampingan membentuk
   tripel (a²+b²=c²) mereka meledak dan pemain dapat poin.
   Kontrol: ← → geser, ↑ putar, ↓ cepat, tap kiri/kanan layar.
   ========================================================= */
(function () {
  'use strict';

  const COLS = 7, ROWS = 14;
  const TRIPEL = [
    [3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],
    [9,12,15],[10,24,26],[20,21,29]
  ];
  // nilai sisi yang valid
  const VALID_SIDES = [...new Set(TRIPEL.flatMap(t=>t))];

  // Blok = segitiga dengan nilai sisi (a, b, hipotenusa)
  // Di grid kita simpan nilai sisi yang "menghadap atas"
  const PIECES = [
    { sides:[3,4,5], color:'#ff6b6b', dark:'#c0392b' },
    { sides:[5,12,13], color:'#ffd34d', dark:'#c0a000' },
    { sides:[6,8,10], color:'#4ade80', dark:'#1a7a3a' },
    { sides:[8,15,17], color:'#60a5fa', dark:'#1a4a9a' },
    { sides:[9,12,15], color:'#c084fc', dark:'#6b21a8' },
    { sides:[7,24,25], color:'#fb923c', dark:'#a0400a' },
    { sides:[9,40,41], color:'#2dd4bf', dark:'#0f6b60' },
  ];

  function acakPiece() { return { ...PIECES[Math.floor(Math.random()*PIECES.length)], rot:Math.floor(Math.random()*4) }; }

  PP.screens.game_tetris = function () {
    return {
      html: `<div id="gtWrap" style="position:relative;width:100%;height:100%;background:#0d1117;display:flex;align-items:center;justify-content:center;overflow:hidden">
        <canvas id="gtCanvas" style="display:block;image-rendering:pixelated"></canvas>
        <div id="gtUI" style="position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none"></div>
        <div id="gtBtns" style="position:absolute;bottom:16px;left:0;right:0;display:flex;justify-content:center;gap:12px;pointer-events:auto">
          <button id="gtBL" style="${BTN_STYLE}">◀</button>
          <button id="gtBD" style="${BTN_STYLE}">▼</button>
          <button id="gtBR" style="${BTN_STYLE}">▶</button>
          <button id="gtBU" style="${BTN_STYLE}↑ Putar">🔄</button>
        </div>
      </div>`,
      mount(root) { startTetris(root); }
    };
  };

  const BTN_STYLE = 'background:rgba(255,255,255,0.15);color:#fff;border:2px solid rgba(255,255,255,0.3);border-radius:12px;padding:12px 22px;font:bold 18px Nunito,sans-serif;cursor:pointer;touch-action:manipulation;';

  function startTetris(root) {
    const canvas = root.querySelector('#gtCanvas');
    const ui = root.querySelector('#gtUI');
    const wrap = root.querySelector('#gtWrap');
    const ctx = canvas.getContext('2d');

    let CW, CH, SZ; // cell size
    function resize() {
      const maxH = wrap.offsetHeight - 100;
      const maxW = wrap.offsetWidth - 20;
      SZ = Math.floor(Math.min(maxW/COLS, maxH/ROWS));
      CW = SZ*COLS; CH = SZ*ROWS;
      canvas.width = CW; canvas.height = CH;
      canvas.style.width = CW+'px'; canvas.style.height = CH+'px';
    }
    resize();
    const obs = new ResizeObserver(resize); obs.observe(wrap);

    // Grid: null atau { color, dark, val }
    let grid = Array.from({length:ROWS}, ()=>Array(COLS).fill(null));
    let cur = null, curX = 0, curY = 0;
    let next = acakPiece();
    let poin = 0, level = 1, lines = 0;
    let running = true, gameOver = false;
    let dropTimer = 0, dropInterval = 50;
    let flash = []; // { r, c, t }

    function newPiece() {
      cur = next; next = acakPiece();
      curX = Math.floor(COLS/2)-1; curY = 0;
      if (!canPlace(curX, curY, cur)) { running=false; gameOver=true; showGameOver(); }
    }

    // Footprint blok: 2×2 segitiga (4 sel, tapi kita pakai 1×2 = lebih sederhana)
    // Tiap blok = 1 sel lebar, label = nilai sisi sesuai orientasi
    function getLabelOf(piece, rot) {
      const s = piece.sides;
      return s[rot % s.length];
    }

    function canPlace(x, y, piece) {
      return x>=0 && x<COLS && y>=0 && y<ROWS && !grid[y][x];
    }

    function placePiece() {
      if (!cur) return;
      const val = getLabelOf(cur, cur.rot);
      grid[curY][curX] = { color: cur.color, dark: cur.dark, val };
      cekTripel();
      newPiece();
    }

    function cekTripel() {
      // cek semua kombinasi 3 sel berdekatan (horizontal)
      let found = false;
      for (let r=0; r<ROWS; r++) {
        for (let c=0; c<=COLS-3; c++) {
          const a=grid[r][c], b=grid[r][c+1], cc2=grid[r][c+2];
          if (a && b && cc2) {
            const vals = [a.val, b.val, cc2.val].sort((x,y)=>x-y);
            if (TRIPEL.some(t=>{
              const ts=[...t].sort((x,y)=>x-y);
              return ts[0]===vals[0]&&ts[1]===vals[1]&&ts[2]===vals[2];
            })) {
              flash.push({r,c,t:1},{r,c:c+1,t:1},{r,c:c+2,t:1});
              grid[r][c]=grid[r][c+1]=grid[r][c+2]=null;
              poin += 10*level; lines+=3; found=true;
            }
          }
        }
        // vertikal 3
        if (r<=ROWS-3) {
          for (let c=0; c<COLS; c++) {
            const a=grid[r][c], b=grid[r+1][c], cc2=grid[r+2][c];
            if (a && b && cc2) {
              const vals=[a.val,b.val,cc2.val].sort((x,y)=>x-y);
              if (TRIPEL.some(t=>{
                const ts=[...t].sort((x,y)=>x-y);
                return ts[0]===vals[0]&&ts[1]===vals[1]&&ts[2]===vals[2];
              })) {
                flash.push({r,c,t:1},{r:r+1,c,t:1},{r:r+2,c,t:1});
                grid[r][c]=grid[r+1][c]=grid[r+2][c]=null;
                poin+=10*level; lines+=3; found=true;
              }
            }
          }
        }
      }
      if (found) { level=Math.floor(lines/15)+1; dropInterval=Math.max(10,50-level*4); }
      // gravitasi sederhana: sel melayang jatuh
      for (let c=0; c<COLS; c++) {
        for (let r=ROWS-2; r>=0; r--) {
          if (grid[r][c] && !grid[r+1][c]) {
            let rr=r;
            while(rr<ROWS-1 && !grid[rr+1][c]) rr++;
            grid[rr][c]=grid[r][c]; grid[r][c]=null;
          }
        }
      }
    }

    function moveLeft() { if (canPlace(curX-1,curY,cur)) curX--; }
    function moveRight() { if (canPlace(curX+1,curY,cur)) curX++; }
    function rotate() { cur={...cur,rot:(cur.rot+1)%cur.sides.length}; }
    function drop() {
      if (canPlace(curX,curY+1,cur)) curY++;
      else placePiece();
    }
    function hardDrop() { while(canPlace(curX,curY+1,cur)) curY++; placePiece(); }

    function update() {
      if (!running) return;
      if (!cur) newPiece();
      dropTimer++;
      if (dropTimer>=dropInterval) { dropTimer=0; drop(); }
      flash.forEach(f=>f.t-=0.06); flash=flash.filter(f=>f.t>0);
    }

    function drawCell(r, c, cell, alpha=1) {
      const x=c*SZ, y=r*SZ;
      ctx.save(); ctx.globalAlpha=alpha;
      ctx.fillStyle=cell.color;
      ctx.fillRect(x+1,y+1,SZ-2,SZ-2);
      ctx.fillStyle=cell.dark;
      ctx.fillRect(x+1,y+1,SZ-2,4);
      ctx.fillRect(x+1,y+1,4,SZ-2);
      ctx.fillStyle='rgba(255,255,255,0.25)';
      ctx.fillRect(x+SZ-5,y+1,4,SZ-2);
      // nilai
      ctx.fillStyle='rgba(255,255,255,0.9)';
      ctx.font=`bold ${Math.max(10,SZ*0.38)}px Nunito,sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(String(cell.val), x+SZ/2, y+SZ/2);
      ctx.restore();
    }

    function draw() {
      ctx.clearRect(0,0,CW,CH);
      // latar grid
      ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,CW,CH);
      for (let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
        ctx.strokeStyle='rgba(255,255,255,0.05)';
        ctx.lineWidth=0.5;
        ctx.strokeRect(c*SZ,r*SZ,SZ,SZ);
      }
      // sel grid
      for (let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) {
        if (grid[r][c]) drawCell(r,c,grid[r][c]);
      }
      // flash
      flash.forEach(f => {
        ctx.save(); ctx.globalAlpha=f.t*0.7;
        ctx.fillStyle='#fff';
        ctx.fillRect(f.c*SZ,f.r*SZ,SZ,SZ);
        ctx.restore();
      });
      // shadow (ghost)
      if (cur) {
        let gy=curY;
        while(canPlace(curX,gy+1,cur)) gy++;
        if (gy!==curY) drawCell(gy,curX,{color:'rgba(255,255,255,0.1)',dark:'rgba(0,0,0,0)',val:getLabelOf(cur,cur.rot)},0.4);
      }
      // current piece
      if (cur) drawCell(curY,curX,{color:cur.color,dark:cur.dark,val:getLabelOf(cur,cur.rot)});
      // HUD
      ctx.fillStyle='rgba(0,0,0,0.5)';
      ctx.fillRect(0,0,CW,28);
      ctx.fillStyle='#ffe066'; ctx.font='bold 13px Nunito,sans-serif';
      ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.fillText('⭐ '+poin, 6, 14);
      ctx.textAlign='center';
      ctx.fillStyle='#a5f3fc';
      ctx.fillText('Level '+level, CW/2, 14);
      ctx.textAlign='right'; ctx.fillStyle='#86efac';
      ctx.fillText('Berikut: '+getLabelOf(next,next.rot), CW-6, 14);
    }

    // Keyboard
    const keys = {};
    function onKey(e) {
      if (!running) return;
      if (e.key==='ArrowLeft') { e.preventDefault(); moveLeft(); }
      if (e.key==='ArrowRight') { e.preventDefault(); moveRight(); }
      if (e.key==='ArrowDown') { e.preventDefault(); drop(); }
      if (e.key==='ArrowUp'||e.key===' ') { e.preventDefault(); rotate(); }
      if (e.key==='Enter') hardDrop();
    }
    document.addEventListener('keydown', onKey);

    // Tombol layar
    root.querySelector('#gtBL').addEventListener('touchstart', e=>{e.preventDefault();moveLeft();},{passive:false});
    root.querySelector('#gtBR').addEventListener('touchstart', e=>{e.preventDefault();moveRight();},{passive:false});
    root.querySelector('#gtBD').addEventListener('touchstart', e=>{e.preventDefault();drop();},{passive:false});
    root.querySelector('#gtBU').addEventListener('touchstart', e=>{e.preventDefault();rotate();},{passive:false});
    root.querySelector('#gtBL').onclick = moveLeft;
    root.querySelector('#gtBR').onclick = moveRight;
    root.querySelector('#gtBD').onclick = drop;
    root.querySelector('#gtBU').onclick = rotate;

    // Swipe
    let tx0=0, ty0=0;
    canvas.addEventListener('touchstart', e=>{tx0=e.touches[0].clientX;ty0=e.touches[0].clientY;},{passive:true});
    canvas.addEventListener('touchend', e=>{
      const dx=e.changedTouches[0].clientX-tx0, dy=e.changedTouches[0].clientY-ty0;
      if (Math.abs(dx)>Math.abs(dy)) { if(dx<-20)moveLeft(); else if(dx>20)moveRight(); }
      else { if(dy>20)drop(); else rotate(); }
    },{passive:true});

    function showGameOver() {
      obs.disconnect();
      document.removeEventListener('keydown', onKey);
      ui.style.pointerEvents='auto';
      ui.innerHTML=`<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.75)">
        <div style="background:#0f172a;border:3px solid #22c55e;border-radius:16px;padding:28px 36px;text-align:center;color:#fff;max-width:300px">
          <div style="font-size:48px">🧩</div>
          <h2 style="color:#ffe066;font-family:Nunito,sans-serif;margin:8px 0">Game Over!</h2>
          <p style="font-size:18px;margin:4px 0">Skor: <b style="color:#ffd34d">${poin}</b></p>
          <p style="font-size:14px;color:#86efac">Level: ${level} · Tripel: ${Math.floor(lines/3)}</p>
          <div style="margin-top:16px;display:flex;gap:10px;justify-content:center">
            <button onclick="PP.go('game_tetris')" style="background:#22c55e;color:#fff;border:none;border-radius:8px;padding:10px 20px;font:bold 15px Nunito,sans-serif;cursor:pointer">Main Lagi</button>
            <button onclick="PP.go('lomba')" style="background:#334155;color:#fff;border:none;border-radius:8px;padding:10px 20px;font:bold 15px Nunito,sans-serif;cursor:pointer">Kembali</button>
          </div>
        </div>
      </div>`;
      try { PPStore.recordMiniGame('tetris', poin, null); } catch(e){}
    }

    let raf;
    function loop() { update(); draw(); if(running) raf=requestAnimationFrame(loop); }
    newPiece(); raf=requestAnimationFrame(loop);
    root.addEventListener('pp-unmount', ()=>{ running=false; obs.disconnect(); document.removeEventListener('keydown',onKey); cancelAnimationFrame(raf); });
  }
})();
