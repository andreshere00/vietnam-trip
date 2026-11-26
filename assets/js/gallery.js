/* Fotos de cada lugar: ficha grande al pasar el ratón y galería de 2–4 fotos al pulsar.
   La usan index.html e itinerario.html; necesita data.js (VN.PH y VN.GAL). */
var VNG = (function () {
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* Fotos de una clave de assets/img: la principal (PH) y las de la galería (GAL) */
  var photos = function (img) {
    if (!img) return [];
    var ph = VN.PH[img] || {}, out = [{ src: 'assets/img/' + img + '.jpg', by: ph.by, lic: ph.lic }];
    (VN.GAL[img] || []).forEach(function (g) { out.push({ src: 'assets/img/' + g[0] + '.jpg', by: g[1], lic: g[2] }); });
    return out;
  };
  var credit = function (p) { return p && p.by ? 'Foto: ' + esc(p.by) + ' · ' + esc(p.lic) + ' (Wikimedia Commons)' : ''; };

  var css = [
    '.gpop { position: fixed; z-index: 1200; width: 25rem; max-width: calc(100vw - 16px); background: var(--surface); color: var(--fg); border: 1px solid var(--line); border-radius: 10px; box-shadow: 0 18px 40px -10px color-mix(in srgb, var(--fg) 45%, transparent); overflow: hidden; pointer-events: none; }',
    '.gpop .gp-main { display: block; width: 100%; height: 15rem; object-fit: cover; background: var(--line); }',
    '.gpop .gp-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; padding: 3px 3px 0; }',
    '.gpop .gp-strip img { display: block; width: 100%; height: 4.6rem; object-fit: cover; background: var(--line); border-radius: 3px; }',
    '.gpop .gp-b { padding: .7rem .9rem .85rem; }',
    '.gpop h5 { margin: 0 0 .3rem; font-family: var(--display); font-size: 1.02rem; line-height: 1.25; }',
    '.gpop p { margin: 0; font-size: .92rem; line-height: 1.45; }',
    '.gpop .gp-hint { display: flex; align-items: center; gap: .35rem; margin-top: .55rem; font-size: .8rem; font-weight: 700; color: var(--red); }',
    '.gpop .gp-hint .mi { font-size: 1.1rem; }',
    '.gpop small { display: block; margin-top: .4rem; color: var(--muted); font-size: .72rem; line-height: 1.3; }',
    '.gbox { position: fixed; inset: 0; z-index: 1300; display: grid; place-items: center; padding: 1rem; background: rgba(12, 6, 4, .82); }',
    '.gbox[hidden] { display: none !important; }',
    '.gb-in { position: relative; width: min(76rem, 100%); max-height: calc(100vh - 2rem); display: grid; grid-template-columns: minmax(0, 1fr) 20rem; background: var(--surface); color: var(--fg); border-radius: 12px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,.5); }',
    '.gb-media { display: grid; grid-template-rows: minmax(0, 1fr) auto; min-width: 0; background: #120b08; }',
    '.gb-fig { position: relative; margin: 0; min-height: 0; display: grid; place-items: center; height: min(72vh, 46rem); touch-action: pan-y; }',
    '.gb-img { display: block; max-width: 100%; max-height: 100%; width: 100%; height: 100%; object-fit: contain; }',
    '.gb-nav { position: absolute; top: 50%; transform: translateY(-50%); width: 2.9rem; height: 2.9rem; border-radius: 50%; border: 0; background: rgba(255,255,255,.88); color: #1f1f1f; display: grid; place-items: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,.35); }',
    '.gb-nav:hover, .gb-nav:focus-visible { background: #fff; outline: 2px solid var(--gold); }',
    '.gb-nav .mi { font-size: 1.8rem; }',
    '.gb-prev { left: .75rem; } .gb-next { right: .75rem; }',
    '.gb-cnt { position: absolute; left: .75rem; bottom: .75rem; background: rgba(0,0,0,.6); color: #fff; font: 700 .8rem/1 var(--body); padding: .35rem .55rem; border-radius: 999px; }',
    '.gb-th { display: flex; gap: 6px; padding: 8px; overflow-x: auto; background: #1d120d; }',
    '.gb-th button { flex: none; padding: 0; border: 2px solid transparent; border-radius: 6px; background: none; cursor: pointer; opacity: .65; overflow: hidden; }',
    '.gb-th button[aria-current="true"] { border-color: var(--yellow); opacity: 1; }',
    '.gb-th button:hover, .gb-th button:focus-visible { opacity: 1; outline: none; border-color: color-mix(in srgb, var(--yellow) 60%, transparent); }',
    '.gb-th img { display: block; width: 7.5rem; height: 5rem; object-fit: cover; }',
    '.gb-tx { padding: 1.4rem 1.3rem 1.2rem; overflow-y: auto; display: flex; flex-direction: column; gap: .75rem; }',
    '.gb-tx h2 { margin: 0 2.2rem 0 0; font: 700 1.35rem/1.2 var(--display); }',
    '.gb-tx .gb-why { margin: 0; font-size: .97rem; line-height: 1.55; }',
    '.gb-tx .gb-cr { color: var(--muted); font-size: .75rem; line-height: 1.35; }',
    '.gb-act { display: grid; gap: .5rem; margin-top: auto; }',
    '.gb-act a, .gb-act button { display: flex; align-items: center; justify-content: center; gap: .45rem; min-height: 2.75rem; padding: .5rem .9rem; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); color: var(--fg); font: 700 .92rem/1.2 var(--body); text-decoration: none; cursor: pointer; }',
    '.gb-act .gb-go { background: var(--red); border-color: var(--red); color: var(--on-red); }',
    '.gb-act a:hover, .gb-act button:hover, .gb-act a:focus-visible, .gb-act button:focus-visible { border-color: var(--gold); outline: none; filter: brightness(1.05); }',
    '.gb-x { position: absolute; top: .6rem; right: .6rem; z-index: 2; width: 2.6rem; height: 2.6rem; border-radius: 50%; border: 0; background: rgba(255,255,255,.9); color: #1f1f1f; display: grid; place-items: center; cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,.3); }',
    '.gb-x:focus-visible { outline: 2px solid var(--gold); }',
    '.gflash { animation: gflash 1.8s ease-out; }',
    '@keyframes gflash { 0%, 35% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--gold) 70%, transparent); } 100% { box-shadow: 0 0 0 4px transparent; } }',
    '@media (max-width: 860px) {',
    '  .gb-in { grid-template-columns: minmax(0, 1fr); overflow-y: auto; }',
    '  .gb-fig { height: min(56vh, 30rem); }',
    '  .gb-th img { width: 5.5rem; height: 3.8rem; }',
    '  .gb-tx { padding: 1rem; }',
    '  .gb-act { grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); }',
    '}',
    '@media (max-width: 520px) { .gbox { padding: 0; } .gb-in { border-radius: 0; max-height: 100vh; height: 100%; align-content: start; } .gb-nav { width: 2.4rem; height: 2.4rem; } }',
    '@media (prefers-reduced-motion: reduce) { .gflash { animation: none; } }'
  ].join('\n');

  var ready = false, pop, box, info = null, idx = 0, list = [], lastFocus = null;
  var setup = function () {
    if (ready) return; ready = true;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    pop = document.createElement('div'); pop.className = 'gpop'; pop.setAttribute('aria-hidden', 'true'); pop.hidden = true;
    document.body.appendChild(pop);
    box = document.createElement('div'); box.className = 'gbox'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'gbT');
    box.innerHTML = '<div class="gb-in"><button type="button" class="gb-x" aria-label="Cerrar la galería"><span class="mi" aria-hidden="true">close</span></button>' +
      '<div class="gb-media"><figure class="gb-fig"><img class="gb-img" alt=""><button type="button" class="gb-nav gb-prev" aria-label="Foto anterior"><span class="mi" aria-hidden="true">chevron_left</span></button>' +
      '<button type="button" class="gb-nav gb-next" aria-label="Foto siguiente"><span class="mi" aria-hidden="true">chevron_right</span></button><span class="gb-cnt"></span></figure>' +
      '<div class="gb-th" role="group" aria-label="Fotos"></div></div>' +
      '<div class="gb-tx"><h2 id="gbT"></h2><p class="gb-why"></p><small class="gb-cr"></small><div class="gb-act"></div></div></div>';
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('.gb-x')) { close(); return; }
      if (e.target.closest('.gb-prev')) { go(idx - 1); return; }
      if (e.target.closest('.gb-next')) { go(idx + 1); return; }
      var th = e.target.closest('.gb-th button'); if (th) { go(+th.dataset.i); return; }
      if (e.target.closest('.gb-go') && info && info.go) { var f = info.go; close(); f(); }
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') go(idx - 1);
      else if (e.key === 'ArrowRight') go(idx + 1);
      else if (e.key === 'Tab') {
        var f = [].filter.call(box.querySelectorAll('button, a[href]'), function (x) { return x.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    var x0 = null;
    box.querySelector('.gb-fig').addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.querySelector('.gb-fig').addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
    });
  };

  /* ---------- Ficha al pasar el ratón ---------- */
  var cur = null;
  var hideTip = function () { if (pop) pop.hidden = true; cur = null; };
  var placeTip = function (t) {
    var r = t.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    var left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    var top = r.top - h - 10;
    if (top < 8) top = r.bottom + 10;
    if (top + h > innerHeight - 8) top = Math.max(8, innerHeight - h - 8);
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  };
  var showTip = function (t, d) {
    var ps = photos(d.img);
    pop.innerHTML = (ps.length ? '<img class="gp-main" src="' + ps[0].src + '" alt="" width="400" height="240">' : '') +
      (ps.length > 1 ? '<div class="gp-strip">' + ps.slice(1, 4).map(function (p) { return '<img src="' + p.src + '" alt="" loading="lazy" decoding="async">'; }).join('') + '</div>' : '') +
      '<div class="gp-b"><h5>' + esc(d.title) + '</h5>' + (d.why ? '<p>' + d.why + '</p>' : '') +
      (ps.length ? '<span class="gp-hint"><span class="mi" aria-hidden="true">photo_library</span>Pulsa para ver ' + (ps.length > 1 ? 'las ' + ps.length + ' fotos' : 'la foto') + (d.go ? ' e ir al evento' : '') + '</span>' : '') +
      (ps.length ? '<small>' + credit(ps[0]) + '</small>' : '') + '</div>';
    cur = t; pop.hidden = false; placeTip(t);
    pop.querySelectorAll('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', function () { if (cur === t) placeTip(t); }, { once: true }); });
  };

  /* ---------- Galería ---------- */
  var go = function (i) {
    if (!list.length) return;
    idx = (i + list.length) % list.length;
    var p = list[idx], img = box.querySelector('.gb-img');
    img.src = p.src; img.alt = info.title + ' · foto ' + (idx + 1) + ' de ' + list.length;
    box.querySelector('.gb-cnt').textContent = (idx + 1) + ' / ' + list.length;
    box.querySelector('.gb-cr').innerHTML = credit(p);
    box.querySelectorAll('.gb-th button').forEach(function (b, k) { b.setAttribute('aria-current', String(k === idx)); });
    var th = box.querySelectorAll('.gb-th button')[idx]; if (th && th.scrollIntoView) th.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  var open = function (d, start) {
    setup(); hideTip();
    info = d; list = photos(d.img);
    if (!list.length) return false;
    lastFocus = document.activeElement;
    box.querySelector('#gbT').textContent = d.title;
    var why = box.querySelector('.gb-why'); why.innerHTML = d.why || ''; why.hidden = !d.why;
    var many = list.length > 1;
    box.querySelectorAll('.gb-nav').forEach(function (b) { b.hidden = !many; });
    box.querySelector('.gb-cnt').hidden = !many;
    box.querySelector('.gb-th').innerHTML = many ? list.map(function (p, k) { return '<button type="button" data-i="' + k + '" aria-label="Foto ' + (k + 1) + ' de ' + list.length + '"><img src="' + p.src + '" alt="" loading="lazy" decoding="async"></button>'; }).join('') : '';
    box.querySelector('.gb-th').hidden = !many;
    var q = d.lat != null ? d.lat + ',' + d.lon : d.title;
    box.querySelector('.gb-act').innerHTML = (d.go ? '<button type="button" class="gb-go"><span class="mi" aria-hidden="true">' + (d.goIcon || 'event') + '</span>' + esc(d.goLabel || 'Ir al evento') + '</button>' : '') +
      '<a href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q) + '" target="_blank" rel="noopener"><span class="mi" aria-hidden="true">map</span>Ver en Google Maps</a>';
    go(start || 0);
    box.hidden = false; document.documentElement.style.overflow = 'hidden';
    box.querySelector('.gb-x').focus();
    return true;
  };
  var close = function () {
    if (!box || box.hidden) return;
    box.hidden = true; document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  };

  /* Lleva la vista a un elemento y lo resalta un momento */
  var flash = function (el) {
    el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    el.classList.remove('gflash'); void el.offsetWidth; el.classList.add('gflash');
    setTimeout(function () { el.classList.remove('gflash'); }, 2000);
  };

  /* hover: selector de los elementos con ficha al pasar el ratón; click: los que abren la galería al pulsar;
     ignore: zonas interiores que conservan su propio clic; resolve(el) → { title, why, img, lat, lon, go, goLabel } */
  var bind = function (o) {
    setup();
    var hit = function (e, sel) { return sel && e.target.closest ? e.target.closest(sel) : null; };
    var data = function (t) { var d = o.resolve(t); return d && (d.img || d.why) ? d : null; };
    document.addEventListener('pointerover', function (e) {
      if (e.pointerType !== 'mouse') return;
      var t = hit(e, o.hover); if (!t || t === cur) return;
      var d = data(t); if (d) showTip(t, d);
    });
    document.addEventListener('pointerout', function (e) {
      if (e.pointerType !== 'mouse') return;
      var t = hit(e, o.hover);
      if (t && t === cur && !(e.relatedTarget && t.contains(e.relatedTarget))) hideTip();
    });
    document.addEventListener('focusin', function (e) {
      var t = hit(e, o.hover); if (!t || !box.hidden || t === cur) return;
      var d = data(t); if (d) showTip(t, d);
    });
    document.addEventListener('focusout', function (e) {
      var t = hit(e, o.hover);
      if (t && t === cur && !(e.relatedTarget && t.contains(e.relatedTarget))) hideTip();
    });
    document.addEventListener('click', function (e) {
      var t = hit(e, o.click); if (!t) return;
      if (o.ignore && e.target.closest(o.ignore) && !e.target.closest(o.force || '.__none')) return;
      var d = data(t); if (!d || !d.img) return;
      if (open(d)) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var t = e.target; if (!t.matches || !t.matches(o.keys || '.__none')) return;
      var d = data(t); if (d && d.img && open(d)) e.preventDefault();
    });
    window.addEventListener('scroll', function () { if (cur) hideTip(); }, { passive: true });
    window.addEventListener('resize', function () { if (cur) hideTip(); });
  };

  return { photos: photos, credit: credit, bind: bind, open: open, close: close, flash: flash };
})();
