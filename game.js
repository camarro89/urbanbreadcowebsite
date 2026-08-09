/* ============================================================
   URBAN BREAD CO — game.js
   Booty Bread Memory Match · Slot Machine · Bread Run
   Web Audio API (no audio files needed)
   ============================================================ */
(function () {
  'use strict';

  /* ── AUDIO SYNTH ── */
  let audioCtx;
  function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }
  function playTone(freq, type, duration, vol) {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol || 0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 0.15));
      osc.start(); osc.stop(ctx.currentTime + (duration || 0.15));
    } catch (e) {}
  }
  function sfxFlip()   { playTone(520, 'sine', 0.10, 0.12); }
  function sfxMatch()  { playTone(880, 'triangle', 0.25, 0.18); setTimeout(function(){playTone(1100,'triangle',0.2,0.14);},100); }
  function sfxWin()    { [440,550,660,880].forEach(function(f,i){setTimeout(function(){playTone(f,'triangle',0.3,0.2);},i*100);}); }
  function sfxFail()   { playTone(220, 'sawtooth', 0.3, 0.15); }
  function sfxSpin()   { playTone(660, 'square', 0.08, 0.10); }

  /* ── GAME STATE ── */
  const CARD_TYPES = [
    { id:'logo',    emoji:'🍞', label:'Logo',     prize:'coupon10' },
    { id:'hidden',  emoji:'🤫', label:'Hidden',   prize:'hidden_menu' },
    { id:'bonus',   emoji:'🎰', label:'Bonus',    prize:'slot_machine' },
    { id:'breadrun',emoji:'🛵', label:'Run!',     prize:'bread_run' },
    { id:'banana',  emoji:'🍌', label:'Banana',   prize:'coupon5' },
    { id:'blue',    emoji:'💙', label:'Blue',     prize:'coupon5' },
    { id:'pineapple',emoji:'🍍',label:'Pineapple',prize:'coupon3' },
    { id:'caramel', emoji:'🍬', label:'Caramel',  prize:'coupon3' },
    { id:'pistachio',emoji:'🟢',label:'Pistachio',prize:'coupon3' },
  ];

  const PRIZES = {
    coupon3:    { emoji:'🎉', title:'3% Off!',  desc:'Nice! You earned a 3% discount on your next order.', code:'BOOTY3', pct:3 },
    coupon5:    { emoji:'🎊', title:'5% Off!',  desc:'Sweet! 5% off your next order.', code:'BOOTY5', pct:5 },
    coupon10:   { emoji:'🔥', title:'10% Off!', desc:'You matched the Logo! 10% off your order.', code:'BOOTY10', pct:10 },
    slot_machine:{ emoji:'🎰', title:'Slot Machine Bonus!', desc:'You hit the Bonus pair! Spin the slot machine for an extra prize.', code:'', pct:0 },
    bread_run:  { emoji:'🛵', title:'Bread Run!', desc:'You unlocked Bread Run! Deliver bread to earn up to 5% extra off.', code:'', pct:0 },
    hidden_menu:{ emoji:'🤫', title:'Secret Menu Unlocked!', desc:'You found the hidden pair! Here are 10 exclusive breads not on the public menu.', code:'HIDDEN', pct:0 },
  };

  const DIFF = {
    rose:    { maxFlips:4,  time:90 },
    classic: { maxFlips:6,  time:75 },
    golden:  { maxFlips:8,  time:60 },
    fire:    { maxFlips:10, time:50 },
  };

  let mgState = {
    unlocked: false,
    difficulty: null,
    cards: [],
    flipped: [],
    matched: [],
    flips: 0,
    timer: null,
    timeLeft: 0,
    active: false,
  };

  /* ── YOUTUBE GATE ── */
  let ytPlayer;
  let watchedSeconds = 0;
  let watchTimer;

  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('mg-yt-player', {
      height: '315', width: '100%',
      videoId: 'jMaMcpcsWBg',
      playerVars: { rel:0, modestbranding:1 },
      events: {
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) {
            watchTimer = setInterval(function () {
              watchedSeconds++;
              const pct = Math.min((watchedSeconds / 30) * 100, 100);
              const fill = document.getElementById('mg-timer-fill');
              if (fill) fill.style.width = pct + '%';
              const status = document.getElementById('mg-watch-status');
              if (status) status.textContent = Math.min(watchedSeconds, 30) + ' / 30 seconds watched';
              if (watchedSeconds >= 30 && !mgState.unlocked) {
                mgState.unlocked = true;
                clearInterval(watchTimer);
                document.getElementById('mg-unlock-area').classList.add('is-visible');
                if (status) status.textContent = '✅ Unlocked! Choose your difficulty below.';
              }
            }, 1000);
          } else {
            clearInterval(watchTimer);
          }
        }
      }
    });
  };

  // Load YouTube IFrame API
  (function loadYT() {
    if (document.getElementById('yt-api-script')) return;
    const tag = document.createElement('script');
    tag.id = 'yt-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }());

  /* ── MANUAL TIMER FALLBACK (for when YouTube doesn't load) ── */
  (function () {
    var btn = document.getElementById('mg-manual-timer-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (mgState.unlocked) return;
      btn.disabled = true;
      btn.textContent = '30s...';
      var secs = 0;
      var interval = setInterval(function () {
        secs++;
        var pct = Math.min((secs / 30) * 100, 100);
        var fill = document.getElementById('mg-timer-fill');
        if (fill) fill.style.width = pct + '%';
        var status = document.getElementById('mg-watch-status');
        if (status) status.textContent = secs + ' / 30 seconds';
        btn.textContent = (30 - secs) + 's...';
        if (secs >= 30 && !mgState.unlocked) {
          mgState.unlocked = true;
          clearInterval(interval);
          var unlockArea = document.getElementById('mg-unlock-area');
          if (unlockArea) unlockArea.classList.add('is-visible');
          if (status) status.textContent = '✅ Unlocked! Choose your difficulty below.';
          var fallback = document.getElementById('mg-yt-fallback');
          if (fallback) fallback.style.display = 'none';
        }
      }, 1000);
    });
  }());

  /* ── DIFFICULTY SELECT ── */
  let selectedDiff = null;
  document.querySelectorAll('.mg-diff-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.mg-diff-btn').forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      selectedDiff = btn.dataset.diff;
      document.getElementById('mg-start-btn').disabled = false;
    });
  });

  document.getElementById('mg-start-btn').addEventListener('click', function () {
    if (!selectedDiff) return;
    mgState.difficulty = selectedDiff;
    document.getElementById('mg-gate').style.display = 'none';
    document.getElementById('mg-board-area').classList.add('is-active');
    mgInit(selectedDiff);
  });

  /* ── GAME INIT ── */
  function mgInit(diff) {
    const cfg = DIFF[diff] || DIFF.classic;
    mgState = {
      unlocked: true,
      difficulty: diff,
      cards: [],
      flipped: [],
      matched: [],
      flips: 0,
      maxFlips: cfg.maxFlips,
      timeLeft: cfg.time,
      active: true,
      timer: null,
    };

    // Build deck: 9 pairs = 18 cards
    const deck = [];
    CARD_TYPES.forEach(function (c) { deck.push({...c, uid: c.id+'_a'}, {...c, uid: c.id+'_b'}); });
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    mgState.cards = deck;

    document.getElementById('mg-max-flips').textContent = cfg.maxFlips;
    document.getElementById('mg-flips').textContent = 0;
    document.getElementById('mg-matches').textContent = 0;
    renderMGBoard();
    startMGTimer();
  }

  function renderMGBoard() {
    const grid = document.getElementById('mg-grid');
    grid.innerHTML = '';
    mgState.cards.forEach(function (card, i) {
      const el = document.createElement('div');
      el.className = 'mg-card';
      el.dataset.index = i;
      el.innerHTML = '<div class="mg-card-inner">'
        + '<div class="mg-card-front">🎴</div>'
        + '<div class="mg-card-back"><div class="mg-card-back-icon">' + card.emoji + '</div>' + card.label + '</div>'
        + '</div>';
      el.addEventListener('click', function () { mgFlipCard(i, el); });
      grid.appendChild(el);
    });
  }

  function startMGTimer() {
    clearInterval(mgState.timer);
    mgState.timer = setInterval(function () {
      mgState.timeLeft--;
      const m = Math.floor(mgState.timeLeft / 60);
      const s = mgState.timeLeft % 60;
      document.getElementById('mg-timer-display').textContent = m + ':' + (s < 10 ? '0' : '') + s;
      if (mgState.timeLeft <= 0) { clearInterval(mgState.timer); mgEndGame(false); }
    }, 1000);
  }

  let flipLock = false;
  function mgFlipCard(idx, el) {
    if (!mgState.active) return;
    if (flipLock) return;
    if (mgState.flipped.includes(idx)) return;
    if (mgState.matched.includes(mgState.cards[idx].id)) return;
    if (el.classList.contains('is-flipped')) return;

    sfxFlip();
    el.classList.add('is-flipped');
    mgState.flipped.push(idx);

    if (mgState.flipped.length === 2) {
      mgState.flips++;
      document.getElementById('mg-flips').textContent = mgState.flips;
      flipLock = true;

      const [a, b] = mgState.flipped;
      const cardA = mgState.cards[a];
      const cardB = mgState.cards[b];

      if (cardA.id === cardB.id) {
        // Match!
        sfxMatch();
        mgState.matched.push(cardA.id);
        document.getElementById('mg-matches').textContent = mgState.matched.length;
        document.querySelectorAll('.mg-card').forEach(function (c) {
          if (c.dataset.index == a || c.dataset.index == b) c.classList.add('is-matched');
        });
        mgState.flipped = [];
        flipLock = false;

        // Trigger prize
        setTimeout(function () { mgTriggerPrize(cardA.prize); }, 400);

        if (mgState.matched.length === 9) {
          clearInterval(mgState.timer);
          setTimeout(function () { mgEndGame(true); }, 800);
        }
      } else {
        // No match
        if (mgState.flips >= mgState.maxFlips) {
          setTimeout(function () {
            mgFlipBack(a, b);
            mgState.flipped = [];
            flipLock = false;
            sfxFail();
            document.getElementById('mg-flip-msg').textContent = 'Out of flips! Game over.';
            clearInterval(mgState.timer);
            setTimeout(function () { mgEndGame(false); }, 1200);
          }, 800);
        } else {
          setTimeout(function () {
            mgFlipBack(a, b);
            mgState.flipped = [];
            flipLock = false;
            const left = mgState.maxFlips - mgState.flips;
            document.getElementById('mg-flip-msg').textContent = left + ' flip' + (left === 1 ? '' : 's') + ' remaining';
          }, 900);
        }
      }
    }
  }

  function mgFlipBack(a, b) {
    document.querySelectorAll('.mg-card').forEach(function (c) {
      if (c.dataset.index == a || c.dataset.index == b) c.classList.remove('is-flipped');
    });
  }

  function mgTriggerPrize(prizeId) {
    if (prizeId === 'slot_machine') { openSlotMachine(); return; }
    if (prizeId === 'bread_run')   { openBreadRun(); return; }
    if (prizeId === 'hidden_menu') { openHiddenMenu(); return; }
    showPrizeModal(prizeId);
  }

  function mgEndGame(won) {
    mgState.active = false;
    if (won) { sfxWin(); }
    else { sfxFail(); }
    setTimeout(function () {
      document.getElementById('mg-flip-msg').textContent = won ? '🎉 You matched them all!' : '⏰ Game over — try again!';
    }, 300);
  }

  window.mgRestart = function () {
    clearInterval(mgState.timer);
    if (selectedDiff) mgInit(selectedDiff);
  };

  /* ── PRIZE MODAL ── */
  function showPrizeModal(prizeId) {
    const prize = PRIZES[prizeId];
    if (!prize) return;
    document.getElementById('mg-prize-emoji').textContent = prize.emoji;
    document.getElementById('mg-prize-title').textContent = prize.title;
    document.getElementById('mg-prize-desc').textContent = prize.desc;
    const codeEl = document.getElementById('mg-prize-code');
    if (prize.code) {
      codeEl.textContent = prize.code;
      codeEl.style.display = 'block';
    } else {
      codeEl.style.display = 'none';
    }
    document.getElementById('mg-prize-modal').classList.add('is-open');
    sfxWin();
    if (prize.pct > 0 && typeof window.applyDiscount === 'function') {
      window.applyDiscount(prize.pct);
    }
  }

  window.mgUsePrize = function () {
    document.getElementById('mg-prize-modal').classList.remove('is-open');
    window.location.href = 'menu.html#browse-menu';
  };

  /* ── HIDDEN MENU ── */
  const hiddenBreads = [
    { name:'Blue Velvet Lagniappe', desc:'The original. Blueberry cream cheese, blue velvet crumb.', price:'$13 mini / $23 full' },
    { name:'Piña Colada Dream', desc:'Pineapple, coconut cream, rum glaze.', price:'$15 mini / $25 full' },
    { name:'Strawberry Kiwi Wave', desc:'Macerated strawberries, fresh kiwi, honey.', price:'$13 mini / $23 full' },
    { name:'Mango Tajín Fire', desc:'Honey mango, Tajín rim, lime zest.', price:'$13 mini / $23 full' },
    { name:'Dragon Fruit Black Sesame', desc:'Dragon fruit swirl, black sesame crumb.', price:'$15 mini / $25 full' },
    { name:'Passion Fruit Coconut', desc:'Tart passion fruit curd, coconut interior.', price:'$15 mini / $25 full' },
    { name:'Black Forest Rye', desc:'Dark cherries, bittersweet chocolate, dark rye.', price:'$13 mini / $23 full' },
    { name:'Lychee Rose Gold', desc:'Lychee pearls, rosewater glaze, gold dust.', price:'$15 mini / $25 full' },
    { name:'Guava Cream Swirl', desc:'Guava paste ribbon, cream cheese center.', price:'$13 mini / $23 full' },
    { name:'The Midnight Special', desc:'Dark chocolate, espresso, activated charcoal crust.', price:'$15 mini / $25 full' },
  ];

  function openHiddenMenu() {
    const list = document.getElementById('hidden-menu-list');
    list.innerHTML = hiddenBreads.map(function (b) {
      return '<div style="border-bottom:1px solid var(--rule-lt);padding:14px 0;">'
        + '<div style="font-family:\'Syne\',sans-serif;font-weight:700;font-size:0.95rem;color:var(--white);margin-bottom:4px;">' + b.name + '</div>'
        + '<div style="font-size:0.82rem;color:rgba(250,250,248,0.50);margin-bottom:6px;">' + b.desc + '</div>'
        + '<div style="font-size:0.80rem;color:var(--amber);font-weight:500;">' + b.price + '</div>'
        + '</div>';
    }).join('');
    const modal = document.getElementById('hidden-menu-modal');
    modal.style.display = 'flex';
  }

  /* ── SLOT MACHINE ── */
  const SYMBOLS = ['SEVEN','BAR','UBC','BELL','STAR','LOAF','WILD'];
  const SLOT_PRIZES = {
    'SEVEN': { label:'🎰 SEVEN!', pct:15, flips:5 },
    'BAR':   { label:'📊 BAR!',   pct:12, flips:4 },
    'UBC':   { label:'🍞 UBC!',   pct:10, flips:3 },
    'BELL':  { label:'🔔 BELL!',  pct:7,  flips:2 },
    'STAR':  { label:'⭐ STAR!',  pct:5,  flips:2 },
    'LOAF':  { label:'🍞 LOAF!',  pct:3,  flips:1 },
  };

  let slotSpins = 3;
  let isSpinning = false;

  function openSlotMachine() {
    slotSpins = 3;
    isSpinning = false;
    document.getElementById('slot-spins-left').textContent = slotSpins;
    document.getElementById('slot-result').textContent = '';
    document.getElementById('slot-spin-btn').disabled = false;
    ['sr-1','sr-2','sr-3'].forEach(function (id) {
      document.getElementById(id).textContent = 'UBC';
    });
    document.getElementById('slot-modal').classList.add('is-open');
  }

  document.getElementById('slot-spin-btn').addEventListener('click', function () {
    if (isSpinning || slotSpins <= 0) return;
    isSpinning = true;
    this.disabled = true;
    sfxSpin();

    const reels = ['sr-1','sr-2','sr-3'];
    const results = [];
    let spinCount = 0;
    const totalTicks = 18;

    reels.forEach(function (id, ri) {
      const el = document.getElementById(id);
      el.classList.add('is-spinning');
      let tick = 0;
      const delay = ri * 250;
      setTimeout(function () {
        const interval = setInterval(function () {
          el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          sfxSpin();
          tick++;
          if (tick >= totalTicks) {
            clearInterval(interval);
            el.classList.remove('is-spinning');
            // Near miss: 30% chance on last reel
            let sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            if (ri === 2 && Math.random() < 0.30 && results[0] === results[1]) {
              // Near miss — pick different
              do { sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]; } while (sym === results[0]);
            }
            el.textContent = sym;
            results[ri] = sym;
            spinCount++;
            if (spinCount === 3) {
              isSpinning = false;
              slotSpins--;
              document.getElementById('slot-spins-left').textContent = slotSpins;
              evaluateSlot(results);
              if (slotSpins > 0) {
                document.getElementById('slot-spin-btn').disabled = false;
              }
            }
          }
        }, 80);
      }, delay);
    });
  });

  function evaluateSlot(results) {
    const resultEl = document.getElementById('slot-result');
    if (results[0] === results[1] && results[1] === results[2]) {
      // Jackpot
      const prize = SLOT_PRIZES[results[0]] || SLOT_PRIZES.LOAF;
      resultEl.textContent = prize.label + ' ' + prize.pct + '% OFF!';
      sfxWin();
      if (typeof window.applyDiscount === 'function') window.applyDiscount(prize.pct);
      setTimeout(function () {
        document.getElementById('slot-modal').classList.remove('is-open');
        showPrizeModal('coupon' + prize.pct);
      }, 1500);
    } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
      resultEl.textContent = '⚡ Close! Try again.';
      sfxFail();
    } else {
      resultEl.textContent = 'No match — spin again!';
      sfxFail();
    }
  }

  /* ── BREAD RUN GAME ── */
  let brAnimFrame;
  let brRunning = false;
  let brScore = 0;
  let brLives = 3;
  let brTimeLeft = 35;
  let brTimer;
  const LANES = [80, 240, 400];
  let brLane = 1;
  let brObstacles = [];
  let brBonusItems = [];
  let brPlayerY = 220;

  function openBreadRun() {
    document.getElementById('bread-run-modal').classList.add('is-open');
    brReset();
  }

  function brReset() {
    brRunning = false;
    brScore = 0; brLives = 3; brTimeLeft = 35; brLane = 1;
    brObstacles = []; brBonusItems = [];
    cancelAnimationFrame(brAnimFrame);
    clearInterval(brTimer);
    document.getElementById('br-score').textContent = 0;
    document.getElementById('br-lives').textContent = 3;
    document.getElementById('br-time').textContent = 35;
    document.getElementById('br-start-btn').style.display = 'inline-flex';
    brDraw();
  }

  function brDraw() {
    const canvas = document.getElementById('bread-run-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    // Background
    ctx.fillStyle = '#0E0D0B';
    ctx.fillRect(0, 0, W, H);

    // Road
    ctx.fillStyle = '#1a1a18';
    ctx.fillRect(40, 0, W - 80, H);
    // Lane lines
    ctx.strokeStyle = 'rgba(201,94,24,0.20)';
    ctx.setLineDash([20, 15]);
    ctx.lineWidth = 2;
    [160, 320].forEach(function (x) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Player (scooter)
    const px = LANES[brLane];
    ctx.fillStyle = '#C95E18';
    ctx.fillRect(px - 18, brPlayerY - 10, 36, 22);
    ctx.fillStyle = '#FAFAF8';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🛵', px, brPlayerY + 8);

    // Obstacles
    brObstacles.forEach(function (o) {
      ctx.font = '22px sans-serif';
      ctx.fillText(o.emoji, LANES[o.lane], o.y);
    });

    // Bonus items
    brBonusItems.forEach(function (b) {
      ctx.font = '18px sans-serif';
      ctx.fillText('🍞', LANES[b.lane], b.y);
    });

    if (!brRunning) {
      ctx.fillStyle = 'rgba(14,13,11,0.65)';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#FAFAF8';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Press Start to Deliver!', W / 2, H / 2);
    }
  }

  document.getElementById('br-start-btn').addEventListener('click', function () {
    this.style.display = 'none';
    brStart();
  });

  function brStart() {
    brRunning = true;
    brTimer = setInterval(function () {
      brTimeLeft--;
      document.getElementById('br-time').textContent = brTimeLeft;
      if (brTimeLeft <= 0) { brEndGame(); }
    }, 1000);

    let lastObstacle = 0;
    let lastBonus = 0;
    let frame = 0;

    function loop(ts) {
      if (!brRunning) return;
      frame++;

      // Spawn obstacles
      if (frame - lastObstacle > 45) {
        brObstacles.push({ lane: Math.floor(Math.random() * 3), y: -30, emoji: ['🚗','🐦','🐕'][Math.floor(Math.random()*3)] });
        lastObstacle = frame;
      }
      // Spawn bonus bread
      if (frame - lastBonus > 70) {
        brBonusItems.push({ lane: Math.floor(Math.random() * 3), y: -30 });
        lastBonus = frame;
      }

      // Move obstacles
      brObstacles = brObstacles.filter(function (o) { o.y += 5; return o.y < 330; });
      brBonusItems = brBonusItems.filter(function (b) { b.y += 4; return b.y < 330; });

      // Collision
      const px = LANES[brLane];
      brObstacles = brObstacles.filter(function (o) {
        if (o.lane === brLane && Math.abs(o.y - brPlayerY) < 28) {
          brLives--;
          document.getElementById('br-lives').textContent = brLives;
          playTone(200, 'sawtooth', 0.2, 0.15);
          if (brLives <= 0) { brEndGame(); return false; }
          return false;
        }
        return true;
      });
      brBonusItems = brBonusItems.filter(function (b) {
        if (b.lane === brLane && Math.abs(b.y - brPlayerY) < 24) {
          brScore += 10;
          document.getElementById('br-score').textContent = brScore;
          playTone(660, 'triangle', 0.1, 0.12);
          return false;
        }
        return true;
      });

      brDraw();
      brAnimFrame = requestAnimationFrame(loop);
    }
    brAnimFrame = requestAnimationFrame(loop);
  }

  function brEndGame() {
    brRunning = false;
    clearInterval(brTimer);
    cancelAnimationFrame(brAnimFrame);
    const bonusPct = Math.min(Math.floor(brScore / 20), 5);
    setTimeout(function () {
      document.getElementById('bread-run-modal').classList.remove('is-open');
      if (bonusPct > 0) {
        showPrizeModal('coupon' + bonusPct);
        if (typeof window.applyDiscount === 'function') window.applyDiscount(bonusPct);
      } else {
        document.getElementById('mg-flip-msg').textContent = 'Bread Run complete! Score: ' + brScore;
      }
    }, 600);
  }

  window.brStop = function () {
    brRunning = false;
    clearInterval(brTimer);
    cancelAnimationFrame(brAnimFrame);
  };

  window.brReset = function () {
    brReset();
  };

  // Keyboard controls for Bread Run
  document.addEventListener('keydown', function (e) {
    if (!brRunning) return;
    if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { brLane = Math.max(0, brLane - 1); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { brLane = Math.min(2, brLane + 1); }
  });

  // Touch/swipe for Bread Run
  let touchStartX = 0;
  document.getElementById('bread-run-canvas').addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.getElementById('bread-run-canvas').addEventListener('touchend', function (e) {
    if (!brRunning) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 30)  brLane = Math.min(2, brLane + 1);
    if (dx < -30) brLane = Math.max(0, brLane - 1);
  }, { passive: true });

  // Initial draw
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(brDraw, 200);
  });

}());
