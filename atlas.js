/* ── URBAN BREAD CO · BREAD ATLAS ─────────────────────────────
   Interactive world map of bread origins: projection, star pins,
   flavour-route arcs, passport progress and procedural loaf art.
   ------------------------------------------------------------ */
(function () {
  'use strict';

  var MAP = window.ATLAS_MAP;
  var PINS = window.ATLAS_PINS;
  var BREADS = window.ATLAS_BREADS;
  if (!MAP || !PINS || !BREADS) return;

  var SVGNS = 'http://www.w3.org/2000/svg';
  var HOME = PINS.filter(function (p) { return p.home; })[0];
  var STORE_KEY = 'ubc-atlas-passport';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var byName = {};
  BREADS.forEach(function (b) { byName[b.name] = b; });

  /* ── Robinson projection (mirrors the build script) ── */
  var ROBINSON = [
    [1.0000, 0.0000], [0.9986, 0.0620], [0.9954, 0.1240], [0.9900, 0.1860],
    [0.9822, 0.2480], [0.9730, 0.3100], [0.9600, 0.3720], [0.9427, 0.4340],
    [0.9216, 0.4958], [0.8962, 0.5571], [0.8679, 0.6176], [0.8350, 0.6769],
    [0.7986, 0.7346], [0.7597, 0.7903], [0.7186, 0.8435], [0.6732, 0.8936],
    [0.6213, 0.9394], [0.5722, 0.9761], [0.5322, 1.0000]
  ];

  function project(lon, lat) {
    var clamped = Math.max(-89.9, Math.min(89.9, lat));
    var alat = Math.abs(clamped) / 5;
    var i = Math.min(Math.floor(alat), ROBINSON.length - 2);
    var f = alat - i;
    var pr = ROBINSON[i][0] + (ROBINSON[i + 1][0] - ROBINSON[i][0]) * f;
    var pd = ROBINSON[i][1] + (ROBINSON[i + 1][1] - ROBINSON[i][1]) * f;
    var scale = MAP.width / (2 * 0.8487 * Math.PI);
    var x = 0.8487 * pr * (lon * Math.PI / 180) * scale + MAP.width / 2;
    var y = -1.3523 * pd * (clamped >= 0 ? 1 : -1) * scale + 1.3523 * scale;
    return { x: x, y: y };
  }

  PINS.forEach(function (p) {
    var xy = project(p.lon, p.lat);
    p.x = xy.x;
    p.y = xy.y;
  });

  /* ── Procedural loaf art ──────────────────────────────────── */
  var PALETTES = [
    { k: ['chocolate', 'oreo', 'tuxedo', 'midnight', 'zebra', 'brownie', "s'mores", 'smores'], crumb: '#4A2A18', crust: '#2E1508', glaze: '#3A1D0C', accent: '#8B5A2B' },
    { k: ['lemon', 'poppy'], crumb: '#F3E1A8', crust: '#D9AE55', glaze: '#FFE45E', accent: '#FFF3B0' },
    { k: ['strawberry', 'red velvet', 'cherry', 'raspberry', 'berry', 'cranberry', 'pink'], crumb: '#E8B7A8', crust: '#B5563F', glaze: '#E8506B', accent: '#FF8FA3' },
    { k: ['blueberry'], crumb: '#C9B6CF', crust: '#6E4F7B', glaze: '#7A5AA8', accent: '#A98CD8' },
    { k: ['mint', 'peppermint', 'candy cane', 'lavender', 'lime'], crumb: '#CFE7CE', crust: '#7C9A72', glaze: '#8FD9A8', accent: '#EAF7EA' },
    { k: ['banana', 'vanilla', 'custard', 'advocaat', 'eggnog', 'cream pie', 'chantilly'], crumb: '#EBCE95', crust: '#B57B36', glaze: '#F6E2A9', accent: '#FFF6DC' },
    { k: ['pumpkin', 'sweet potato', 'carrot', 'mango', 'peach', 'apricot'], crumb: '#E8A45C', crust: '#A65420', glaze: '#F3B463', accent: '#FFD79A' },
    { k: ['caramel', 'pretzel', 'stroopwafel', 'toffee', 'butterscotch', 'snickers', 'butterfinger', 'pecan', 'maple', 'coffee', 'tiramisu', 'foster', 'brown butter'], crumb: '#D8A46A', crust: '#8A4B17', glaze: '#C67B20', accent: '#F0C48A' },
    { k: ['pistachio', 'matcha'], crumb: '#CBD99A', crust: '#7C8B4A', glaze: '#A8C256', accent: '#E4EFC1' },
    { k: ['coconut', 'almond', 'marshmallow', 'rice krispies', 'oatmeal', 'cookie dough', 'confetti', 'cinnamon', 'gingerbread', 'cornbread', 'irish cream', 'hazelnut', 'tres leches', 'zucchini'], crumb: '#E4C79A', crust: '#A9702F', glaze: '#F4E6CB', accent: '#FFF1D9' },
    { k: ['pineapple', 'fruity', 'rainbow', 'birthday'], crumb: '#F2D98A', crust: '#C08A2E', glaze: '#FFC94A', accent: '#FF7BAC' }
  ];

  function paletteFor(name) {
    var n = name.toLowerCase();
    for (var i = 0; i < PALETTES.length; i++) {
      for (var j = 0; j < PALETTES[i].k.length; j++) {
        if (n.indexOf(PALETTES[i].k[j]) !== -1) return PALETTES[i];
      }
    }
    return { crumb: '#DFB57C', crust: '#95591F', glaze: '#F0D8AE', accent: '#FFE9C4' };
  }

  function toppingFor(name) {
    var n = name.toLowerCase();
    if (/confetti|rainbow|hagelslag|birthday|fruity/.test(n)) return 'sprinkles';
    if (/pecan|almond|pistachio|hazelnut|peanut|walnut|nut/.test(n)) return 'nuts';
    if (/berry|cherry|strawberry|blueberry|cranberry|raspberry|peach|apple|mango|pineapple/.test(n)) return 'fruit';
    if (/marble|zebra|swirl|marbl|tuxedo|roll/.test(n)) return 'swirl';
    if (/crumb|crisp|cobbler|streusel|coffee cake|oatmeal/.test(n)) return 'crumble';
    return 'drizzle';
  }

  var artSeed = 0;
  function rand(seedRef) {
    seedRef.s = (seedRef.s * 9301 + 49297) % 233280;
    return seedRef.s / 233280;
  }

  function loafArt(name) {
    var p = paletteFor(name);
    var top = toppingFor(name);
    var uid = 'la' + (artSeed++);
    var seed = { s: 0 };
    for (var c = 0; c < name.length; c++) seed.s = (seed.s + name.charCodeAt(c) * (c + 7)) % 233280;

    var parts = [];
    parts.push('<defs>' +
      '<linearGradient id="' + uid + 'c" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + p.crust + '"/><stop offset="1" stop-color="' + p.crumb + '"/></linearGradient>' +
      '<linearGradient id="' + uid + 'g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + p.accent + '"/><stop offset="1" stop-color="' + p.glaze + '"/></linearGradient>' +
      '<radialGradient id="' + uid + 'h" cx="0.3" cy="0.15" r="0.8">' +
      '<stop offset="0" stop-color="#fff" stop-opacity="0.35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '</defs>');

    // board shadow
    parts.push('<ellipse cx="100" cy="112" rx="76" ry="9" fill="rgba(0,0,0,0.45)"/>');
    // loaf body
    parts.push('<path d="M26 108 C22 66 40 34 100 32 C160 34 178 66 174 108 Z" fill="url(#' + uid + 'c)"/>');
    // crumb speckle
    var speckle = '';
    for (var i = 0; i < 26; i++) {
      var sx = 34 + rand(seed) * 132;
      var sy = 52 + rand(seed) * 52;
      var sr = 1 + rand(seed) * 2.4;
      speckle += '<circle cx="' + sx.toFixed(1) + '" cy="' + sy.toFixed(1) + '" r="' + sr.toFixed(1) + '" fill="' + p.crust + '" opacity="0.35"/>';
    }
    parts.push(speckle);
    // glaze cap with drips
    var drips = '';
    var dx = 34;
    while (dx < 168) {
      var depth = 6 + rand(seed) * 20;
      var w = 8 + rand(seed) * 12;
      drips += 'C' + (dx + w * 0.2).toFixed(0) + ' ' + (52 + depth).toFixed(0) + ' ' +
               (dx + w * 0.8).toFixed(0) + ' ' + (52 + depth).toFixed(0) + ' ' +
               (dx + w).toFixed(0) + ' 52 ';
      dx += w;
    }
    parts.push('<path d="M26 60 C22 40 44 30 100 30 C156 30 178 40 174 60 L174 52 ' +
      drips + 'Z" fill="url(#' + uid + 'g)"/>');
    parts.push('<path d="M26 60 C22 40 44 30 100 30 C156 30 178 40 174 60 Z" fill="url(#' + uid + 'h)"/>');

    if (top === 'sprinkles') {
      var sp = '';
      for (var s = 0; s < 18; s++) {
        var cx = 36 + rand(seed) * 128, cy = 34 + rand(seed) * 22;
        var rot = rand(seed) * 180;
        var hues = ['#FF6B35', '#FFD166', '#06D6A0', '#EF476F', '#4CC9F0', '#F72585'];
        sp += '<rect x="' + cx.toFixed(0) + '" y="' + cy.toFixed(0) + '" width="9" height="3.2" rx="1.6" fill="' +
          hues[Math.floor(rand(seed) * hues.length)] + '" transform="rotate(' + rot.toFixed(0) + ' ' + cx.toFixed(0) + ' ' + cy.toFixed(0) + ')"/>';
      }
      parts.push(sp);
    } else if (top === 'nuts') {
      var nt = '';
      for (var n2 = 0; n2 < 7; n2++) {
        var nx = 42 + n2 * 19 + rand(seed) * 6, ny = 36 + rand(seed) * 14;
        nt += '<ellipse cx="' + nx.toFixed(0) + '" cy="' + ny.toFixed(0) + '" rx="8" ry="5.5" fill="' + p.crust + '" opacity="0.9"/>' +
              '<path d="M' + (nx - 6).toFixed(0) + ' ' + ny.toFixed(0) + ' q6 -4 12 0" stroke="' + p.accent + '" stroke-width="1.2" fill="none" opacity="0.7"/>';
      }
      parts.push(nt);
    } else if (top === 'fruit') {
      var fr = '';
      for (var f = 0; f < 6; f++) {
        var fx = 44 + f * 22 + rand(seed) * 4, fy = 34 + rand(seed) * 12;
        fr += '<circle cx="' + fx.toFixed(0) + '" cy="' + fy.toFixed(0) + '" r="' + (5 + rand(seed) * 2.5).toFixed(1) + '" fill="' + p.glaze + '" stroke="rgba(0,0,0,0.25)" stroke-width="0.8"/>';
      }
      parts.push(fr);
    } else if (top === 'swirl') {
      parts.push('<path d="M40 84 q30 -26 60 0 t60 0" stroke="' + p.crust + '" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round"/>' +
        '<path d="M40 98 q30 -26 60 0 t60 0" stroke="' + p.accent + '" stroke-width="5" fill="none" opacity="0.5" stroke-linecap="round"/>');
    } else if (top === 'crumble') {
      var cr = '';
      for (var q = 0; q < 22; q++) {
        var qx = 34 + rand(seed) * 132, qy = 30 + rand(seed) * 22;
        cr += '<rect x="' + qx.toFixed(0) + '" y="' + qy.toFixed(0) + '" width="' + (4 + rand(seed) * 5).toFixed(1) + '" height="' + (4 + rand(seed) * 4).toFixed(1) + '" rx="2" fill="' + p.crust + '" opacity="0.8"/>';
      }
      parts.push(cr);
    } else {
      parts.push('<path d="M38 44 q22 16 44 0 t44 0 q14 8 26 -2" stroke="' + p.accent + '" stroke-width="4" fill="none" opacity="0.85" stroke-linecap="round"/>');
    }

    // slice mark + steam
    parts.push('<path d="M64 108 L64 60" stroke="rgba(0,0,0,0.18)" stroke-width="2"/>');
    return '<svg class="loaf-art" viewBox="0 0 200 124" role="img" aria-label="Illustration of ' + esc(name) + '">' + parts.join('') + '</svg>';
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Map rendering ────────────────────────────────────────── */
  var svg = document.getElementById('atlas-svg');
  var gWorld = document.getElementById('atlas-world');
  var gLand = document.getElementById('atlas-land');
  var gGrat = document.getElementById('atlas-graticule');
  var gRoutes = document.getElementById('atlas-routes');
  var gStars = document.getElementById('atlas-stars');
  var tooltip = document.getElementById('atlas-tooltip');

  svg.setAttribute('viewBox', '0 0 ' + MAP.width + ' ' + MAP.height);

  var sphere = document.createElementNS(SVGNS, 'path');
  sphere.setAttribute('d', MAP.sphere);
  sphere.setAttribute('class', 'atlas-sphere');
  gWorld.insertBefore(sphere, gGrat);

  MAP.graticule.forEach(function (d) {
    var p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', d);
    p.setAttribute('class', 'atlas-grat');
    gGrat.appendChild(p);
  });

  var countryEls = [];
  MAP.countries.forEach(function (c) {
    var p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', c.d);
    p.setAttribute('class', 'atlas-country');
    p.setAttribute('data-id', c.id);
    gLand.appendChild(p);
    countryEls.push(p);
  });

  /* Highlight the landmass under every star (geometry hit test). */
  (function highlightOrigins() {
    if (!countryEls.length || !countryEls[0].isPointInFill) return;
    PINS.forEach(function (pin) {
      var pt = svg.createSVGPoint ? svg.createSVGPoint() : null;
      for (var i = 0; i < countryEls.length; i++) {
        var hit = false;
        try {
          if (window.DOMPoint) {
            hit = countryEls[i].isPointInFill(new DOMPoint(pin.x, pin.y));
          } else if (pt) {
            pt.x = pin.x; pt.y = pin.y;
            hit = countryEls[i].isPointInFill(pt);
          }
        } catch (e) { hit = false; }
        if (hit) {
          countryEls[i].classList.add('has-origin');
          pin.countryEl = countryEls[i];
          break;
        }
      }
    });
  })();

  /* ── Stars ────────────────────────────────────────────────── */
  function starPath(r) {
    var pts = [];
    for (var i = 0; i < 8; i++) {
      var ang = (Math.PI / 4) * i - Math.PI / 2;
      var rad = i % 2 === 0 ? r : r * 0.36;
      pts.push((Math.cos(ang) * rad).toFixed(2) + ' ' + (Math.sin(ang) * rad).toFixed(2));
    }
    return 'M' + pts.join('L') + 'Z';
  }

  var starEls = {};
  PINS.forEach(function (pin, idx) {
    var g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'atlas-star' + (pin.home ? ' is-home' : ''));
    g.setAttribute('transform', 'translate(' + pin.x + ',' + pin.y + ')');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', pin.name + ' — ' + pin.breads.length + ' breads');
    g.setAttribute('data-id', pin.id);
    g.style.setProperty('--delay', (idx % 12) * 0.28 + 's');

    var halo = document.createElementNS(SVGNS, 'circle');
    halo.setAttribute('r', '13');
    halo.setAttribute('class', 'star-halo');
    g.appendChild(halo);

    var pulse = document.createElementNS(SVGNS, 'circle');
    pulse.setAttribute('r', '7');
    pulse.setAttribute('class', 'star-pulse');
    g.appendChild(pulse);

    var star = document.createElementNS(SVGNS, 'path');
    star.setAttribute('d', starPath(pin.home ? 11 : 8.5));
    star.setAttribute('class', 'star-shape');
    g.appendChild(star);

    var hit = document.createElementNS(SVGNS, 'circle');
    hit.setAttribute('r', '16');
    hit.setAttribute('class', 'star-hit');
    g.appendChild(hit);

    gStars.appendChild(g);
    starEls[pin.id] = g;

    g.addEventListener('click', function () { selectPin(pin.id); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPin(pin.id); }
    });
    g.addEventListener('mouseenter', function (e) { showTip(pin, e); });
    g.addEventListener('focus', function () { showTip(pin, null); });
    g.addEventListener('mousemove', function (e) { moveTip(e); });
    g.addEventListener('mouseleave', hideTip);
    g.addEventListener('blur', hideTip);
  });

  function showTip(pin, e) {
    tooltip.innerHTML = '<span class="tip-flag">' + pin.flag + '</span>' +
      '<span class="tip-name">' + esc(pin.name) + '</span>' +
      '<span class="tip-count">' + pin.breads.length + (pin.breads.length === 1 ? ' loaf' : ' loaves') + '</span>';
    tooltip.classList.add('is-on');
    if (e) moveTip(e);
    else {
      var r = starEls[pin.id].getBoundingClientRect();
      var host = svg.parentElement.getBoundingClientRect();
      tooltip.style.left = (r.left - host.left + r.width / 2) + 'px';
      tooltip.style.top = (r.top - host.top - 12) + 'px';
    }
  }
  function moveTip(e) {
    var host = svg.parentElement.getBoundingClientRect();
    tooltip.style.left = (e.clientX - host.left) + 'px';
    tooltip.style.top = (e.clientY - host.top - 14) + 'px';
  }
  function hideTip() { tooltip.classList.remove('is-on'); }

  /* ── Camera (pan + zoom) ──────────────────────────────────── */
  var cam = { x: 0, y: 0, k: 1 };
  var minK = 1, maxK = 7;

  function applyCam(animate) {
    gWorld.style.transition = animate && !reduceMotion ? 'transform 0.85s cubic-bezier(.22,.9,.24,1)' : 'none';
    gWorld.setAttribute('transform', 'translate(' + cam.x + ',' + cam.y + ') scale(' + cam.k + ')');
    gStars.style.setProperty('--star-k', cam.k);
    svg.classList.toggle('is-zoomed', cam.k > 1.05);
  }

  function clampCam() {
    var maxX = MAP.width * (cam.k - 1);
    var maxY = MAP.height * (cam.k - 1);
    cam.x = Math.min(0, Math.max(-maxX, cam.x));
    cam.y = Math.min(0, Math.max(-maxY, cam.y));
  }

  function zoomTo(k, cx, cy, animate) {
    k = Math.max(minK, Math.min(maxK, k));
    cam.x = cx - (cx - cam.x) * (k / cam.k);
    cam.y = cy - (cy - cam.y) * (k / cam.k);
    cam.k = k;
    clampCam();
    applyCam(animate !== false);
  }

  function flyTo(pin) {
    var k = 3.1;
    cam.k = k;
    cam.x = MAP.width / 2 - pin.x * k;
    cam.y = MAP.height / 2 - pin.y * k;
    clampCam();
    applyCam(true);
  }

  function resetView() {
    cam = { x: 0, y: 0, k: 1 };
    applyCam(true);
  }

  function svgPoint(evt) {
    var r = svg.getBoundingClientRect();
    return {
      x: (evt.clientX - r.left) / r.width * MAP.width,
      y: (evt.clientY - r.top) / r.height * MAP.height
    };
  }

  svg.addEventListener('wheel', function (e) {
    if (!(e.ctrlKey || e.metaKey)) {
      hint.classList.add('is-on');
      clearTimeout(hintTimer);
      hintTimer = setTimeout(function () { hint.classList.remove('is-on'); }, 1400);
      return;
    }
    e.preventDefault();
    var p = svgPoint(e);
    zoomTo(cam.k * (e.deltaY < 0 ? 1.18 : 1 / 1.18), p.x, p.y, false);
  }, { passive: false });

  var hint = document.getElementById('atlas-hint');
  var hintTimer;

  var drag = null;
  svg.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.atlas-star')) return;
    drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false };
    svg.setPointerCapture(e.pointerId);
    svg.classList.add('is-dragging');
  });
  svg.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var r = svg.getBoundingClientRect();
    var scale = MAP.width / r.width;
    cam.x = drag.cx + (e.clientX - drag.x) * scale;
    cam.y = drag.cy + (e.clientY - drag.y) * scale;
    if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 4) drag.moved = true;
    clampCam();
    applyCam(false);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (evt) {
    svg.addEventListener(evt, function () {
      drag = null;
      svg.classList.remove('is-dragging');
    });
  });

  document.getElementById('atlas-zoom-in').addEventListener('click', function () {
    zoomTo(cam.k * 1.5, MAP.width / 2 - cam.x / cam.k, MAP.height / 2 - cam.y / cam.k);
  });
  document.getElementById('atlas-zoom-out').addEventListener('click', function () {
    zoomTo(cam.k / 1.5, MAP.width / 2 - cam.x / cam.k, MAP.height / 2 - cam.y / cam.k);
  });
  document.getElementById('atlas-reset').addEventListener('click', function () {
    resetView();
    closePanel();
  });

  /* ── Flavour routes ───────────────────────────────────────── */
  function drawRoute(pin) {
    gRoutes.innerHTML = '';
    if (!pin || pin.home) return;
    var mx = (pin.x + HOME.x) / 2;
    var my = (pin.y + HOME.y) / 2 - Math.abs(pin.x - HOME.x) * 0.22 - 24;
    var d = 'M' + pin.x + ' ' + pin.y + ' Q' + mx + ' ' + my + ' ' + HOME.x + ' ' + HOME.y;
    var glow = document.createElementNS(SVGNS, 'path');
    glow.setAttribute('d', d);
    glow.setAttribute('class', 'atlas-route-glow');
    var path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('class', 'atlas-route');
    gRoutes.appendChild(glow);
    gRoutes.appendChild(path);
    var dot = document.createElementNS(SVGNS, 'circle');
    dot.setAttribute('r', '3.4');
    dot.setAttribute('class', 'atlas-route-dot');
    gRoutes.appendChild(dot);
    if (!reduceMotion) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      requestAnimationFrame(function () {
        path.style.transition = 'stroke-dashoffset 1.1s ease-out';
        path.style.strokeDashoffset = '0';
      });
      var start = null;
      (function step(ts) {
        if (!gRoutes.contains(dot)) return;
        if (!start) start = ts;
        var t = ((ts - start) % 2600) / 2600;
        var pt = path.getPointAtLength(len * t);
        dot.setAttribute('cx', pt.x);
        dot.setAttribute('cy', pt.y);
        requestAnimationFrame(step);
      })(performance.now());
    }
  }

  /* ── Passport ─────────────────────────────────────────────── */
  var visited = load();
  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(visited)); } catch (e) { /* private mode */ }
  }
  function markVisited(id) {
    if (visited.indexOf(id) === -1) {
      visited.push(id);
      save();
      if (starEls[id]) starEls[id].classList.add('is-visited');
      renderPassport(true);
    }
  }

  var BADGES = [
    { at: 1, name: 'First Bite', icon: '🥖' },
    { at: 5, name: 'Curious Baker', icon: '🧭' },
    { at: 12, name: 'Continental', icon: '🌍' },
    { at: 24, name: 'Globetrotter', icon: '✈️' },
    { at: 999, name: 'Master of the Atlas', icon: '👑' }
  ];
  BADGES[BADGES.length - 1].at = PINS.length;

  var progressFill = document.getElementById('passport-fill');
  var progressLabel = document.getElementById('passport-count');
  var badgeWrap = document.getElementById('passport-badges');

  function renderPassport(celebrate) {
    var pct = Math.round(visited.length / PINS.length * 100);
    progressFill.style.width = pct + '%';
    progressLabel.textContent = visited.length + ' / ' + PINS.length;
    badgeWrap.innerHTML = BADGES.map(function (b) {
      var earned = visited.length >= b.at;
      return '<span class="badge' + (earned ? ' is-earned' : '') + '" title="' + esc(b.name) +
        (earned ? '' : ' — visit ' + b.at + ' regions') + '"><i>' + b.icon + '</i>' + esc(b.name) + '</span>';
    }).join('');
    if (celebrate) {
      var earnedNow = BADGES.filter(function (b) { return b.at === visited.length; })[0];
      if (earnedNow) toast(earnedNow.icon + ' Badge unlocked — ' + earnedNow.name);
    }
  }

  document.getElementById('passport-reset').addEventListener('click', function () {
    visited = [];
    save();
    Object.keys(starEls).forEach(function (id) { starEls[id].classList.remove('is-visited'); });
    renderPassport(false);
    toast('Passport cleared — start exploring again');
  });

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('atlas-toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 3200);
  }

  visited.forEach(function (id) { if (starEls[id]) starEls[id].classList.add('is-visited'); });
  renderPassport(false);

  /* ── Detail panel ─────────────────────────────────────────── */
  var panel = document.getElementById('atlas-panel');
  var panelBody = document.getElementById('atlas-panel-body');
  var current = null;

  function breadCard(name) {
    var b = byName[name];
    if (!b) return '';
    return '<article class="bread-card">' +
      '<div class="bread-art">' + loafArt(b.name) + '</div>' +
      '<div class="bread-meta">' +
        '<h4>' + esc(b.name) + '</h4>' +
        '<p>' + esc(b.description) + '</p>' +
        '<div class="bread-tags">' + (b.features || []).map(function (f) {
          return '<span>' + esc(f) + '</span>';
        }).join('') + '<span class="bread-cat">' + esc(b.category) + '</span></div>' +
        '<div class="bread-price">Mini $' + b.miniPrice + ' · Full $' + b.fullPrice + '</div>' +
      '</div></article>';
  }

  function renderPanel(pin) {
    panelBody.innerHTML =
      '<header class="panel-head">' +
        '<span class="panel-flag" aria-hidden="true">' + pin.flag + '</span>' +
        '<div><p class="panel-kicker">A taste of</p><h2>' + esc(pin.name) + '</h2>' +
        '<p class="panel-sub">' + esc(pin.sub) + '</p></div>' +
      '</header>' +
      '<p class="panel-tagline">' + esc(pin.tagline) + '</p>' +
      '<section class="fact-card fact-spotlight">' +
        '<span class="fact-label">Fun fact</span>' +
        '<h3>' + esc(pin.spotlight.title) + '</h3><p>' + esc(pin.spotlight.text) + '</p>' +
      '</section>' +
      '<section class="fact-card fact-ingredient">' +
        '<span class="fact-label">Ingredient science · ' + esc(pin.ingredient.name) + '</span>' +
        '<p>' + esc(pin.ingredient.text) + '</p>' +
      '</section>' +
      '<section class="fact-card fact-tradition">' +
        '<span class="fact-label">Baking tradition</span>' +
        '<h3>' + esc(pin.tradition.title) + '</h3><p>' + esc(pin.tradition.text) + '</p>' +
      '</section>' +
      '<section class="panel-breads">' +
        '<h3 class="panel-breads-title">' + pin.breads.length + ' loaves from ' + esc(pin.name.split(',')[0]) + '</h3>' +
        pin.breads.map(breadCard).join('') +
      '</section>' +
      '<a class="panel-cta" href="menu#browse-menu">Order these loaves →</a>';
    panelBody.scrollTop = 0;
  }

  function selectPin(id, opts) {
    var pin = PINS.filter(function (p) { return p.id === id; })[0];
    if (!pin) return;
    current = pin;
    Object.keys(starEls).forEach(function (k) { starEls[k].classList.toggle('is-active', k === id); });
    if (pin.countryEl) {
      countryEls.forEach(function (c) { c.classList.remove('is-active'); });
      pin.countryEl.classList.add('is-active');
    }
    renderPanel(pin);
    document.getElementById('atlas-stage').classList.add('has-panel');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    drawRoute(pin);
    if (!opts || opts.fly !== false) flyTo(pin);
    markVisited(id);
    document.getElementById('atlas-panel-close').focus({ preventScroll: true });
  }

  function closePanel() {
    document.getElementById('atlas-stage').classList.remove('has-panel');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    gRoutes.innerHTML = '';
    countryEls.forEach(function (c) { c.classList.remove('is-active'); });
    Object.keys(starEls).forEach(function (k) { starEls[k].classList.remove('is-active'); });
    current = null;
  }

  document.getElementById('atlas-panel-close').addEventListener('click', closePanel);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });

  /* ── Region filter + search ───────────────────────────────── */
  var activeRegion = 'all';
  var query = '';

  function matches(pin) {
    if (activeRegion !== 'all' && pin.region !== activeRegion) return false;
    if (!query) return true;
    var hay = (pin.name + ' ' + pin.sub + ' ' + pin.region + ' ' + pin.tagline + ' ' +
      pin.ingredient.name + ' ' + pin.breads.join(' ')).toLowerCase();
    return hay.indexOf(query) !== -1;
  }

  var resultsEl = document.getElementById('atlas-results');

  function applyFilters() {
    var shown = [];
    PINS.forEach(function (pin) {
      var ok = matches(pin);
      starEls[pin.id].classList.toggle('is-dim', !ok);
      if (ok) shown.push(pin);
    });
    document.getElementById('atlas-shown').textContent = shown.length;
    if (query) {
      resultsEl.innerHTML = shown.slice(0, 8).map(function (p) {
        var hits = p.breads.filter(function (b) { return b.toLowerCase().indexOf(query) !== -1; });
        return '<button type="button" class="result" data-id="' + p.id + '">' +
          '<span class="result-flag">' + p.flag + '</span>' +
          '<span class="result-name">' + esc(p.name) + '</span>' +
          '<span class="result-hit">' + esc(hits[0] || p.ingredient.name) + '</span></button>';
      }).join('') || '<p class="result-empty">No origins match that yet.</p>';
      resultsEl.classList.add('is-on');
    } else {
      resultsEl.classList.remove('is-on');
      resultsEl.innerHTML = '';
    }
  }

  resultsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.result');
    if (btn) selectPin(btn.getAttribute('data-id'));
  });

  document.querySelectorAll('.region-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.region-chip').forEach(function (c) { c.classList.remove('is-on'); });
      chip.classList.add('is-on');
      activeRegion = chip.getAttribute('data-region');
      applyFilters();
    });
  });

  var searchInput = document.getElementById('atlas-search');
  searchInput.addEventListener('input', function () {
    query = searchInput.value.trim().toLowerCase();
    applyFilters();
  });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var first = resultsEl.querySelector('.result');
      if (first) selectPin(first.getAttribute('data-id'));
    }
  });

  document.getElementById('atlas-surprise').addEventListener('click', function () {
    var pool = PINS.filter(function (p) { return visited.indexOf(p.id) === -1; });
    if (!pool.length) pool = PINS;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    selectPin(pick.id);
  });

  document.getElementById('atlas-total').textContent = PINS.length;
  document.getElementById('atlas-shown').textContent = PINS.length;
  document.getElementById('atlas-bread-total').textContent = BREADS.length;

  /* ── Origin strip (quick jump) ────────────────────────────── */
  var strip = document.getElementById('atlas-strip');
  strip.innerHTML = PINS.map(function (p) {
    return '<button type="button" class="strip-item" data-id="' + p.id + '">' +
      '<span class="strip-flag">' + p.flag + '</span><span>' + esc(p.name) + '</span></button>';
  }).join('');
  strip.addEventListener('click', function (e) {
    var btn = e.target.closest('.strip-item');
    if (btn) selectPin(btn.getAttribute('data-id'));
  });

  /* ── Deep link (#origin=netherlands) ──────────────────────── */
  var hash = /origin=([\w-]+)/.exec(window.location.hash);
  if (hash) selectPin(hash[1]);

  applyCam(false);
})();
