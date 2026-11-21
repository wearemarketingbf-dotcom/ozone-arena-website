/* O’ZONE ARENA · shared core · loaded on every page
   config · data · icons · header · menu · dock · share · faq · chips · circle picker · WhatsApp forms · reveals
   page scripts (home.js · pages.js) read everything from window.OZ */
(() => {
  'use strict';

  /* ---------- H1 · one site root for canonical · og:url · og:image and share links ----------
     replace SITE_URL at deploy with the live root and keep the trailing slash · the same string sits in every page head */
  const SITE_URL = 'https://wearemarketingbf-dotcom.github.io/ozone-arena-website/';

  /* ---------- config · replace the bracketed placeholders when facts are confirmed ---------- */
  const CONFIG = {
    whatsappNumber: '[WhatsApp number]',            // international digits only when live · e.g. 92xxxxxxxxxx
    instagramHandle: '[handle]',                    // the handle without @ when live
    greeting: 'Hi O’ZONE ARENA · I would like to join the first circle',
    celebrateGreeting: 'Hi O’ZONE ARENA · I am interested in a celebration',
    shareText: 'O’ZONE ARENA is coming to Karachi · all your circles one zone'
  };

  /* ---------- zones · remove or reorder a zone here and every page follows ---------- */
  const ZONES = [
    { id: 'lounge', name: 'Lounge', line: 'Sink in and stay a while', img: 'assets/zone-lounge.webp', alt: 'A family reading and talking around a glowing round table in the lounge' },
    { id: 'cafe', name: 'Café', line: 'Long talks over a warm cup', img: 'assets/zone-cafe.webp', alt: 'Friends laughing over coffee and pastries at a marble café table' },
    { id: 'restaurant', name: 'Restaurant', line: 'Every generation at one table', img: 'assets/zone-restaurant.webp', alt: 'Three generations sharing a meal at one round restaurant table' },
    { id: 'gaming', name: 'Gaming', line: 'Bring your player two', img: 'assets/zone-gaming.webp', alt: 'Friends cheering together in front of gaming screens' },
    { id: 'kids', name: 'Kids', line: 'Little ones run the show', img: 'assets/zone-kids.webp', alt: 'Children climbing and playing on soft cream play shapes' },
    { id: 'wellness', name: 'Wellness', line: 'Slow down and breathe', img: 'assets/zone-wellness.webp', alt: 'Two women resting in calm meditation in a warm wood room' },
    { id: 'gym', name: 'Gym', line: 'Train with your people', img: 'assets/zone-gym.webp', alt: 'A coach guiding a member through a kettlebell lift' },
    { id: 'studio', name: 'Studio', line: 'Together on the mat', img: 'assets/zone-studio.webp', alt: 'A class lying in a circle on the studio floor seen from above' }
  ];
  // who is in your circle · each family member lights the zones they would most likely love · a suggestion only
  const FAMILY = [
    { id: 'mum', name: 'Mum', zones: ['cafe', 'wellness'] },
    { id: 'dad', name: 'Dad', zones: ['gym', 'restaurant'] },
    { id: 'teen', name: 'Teen', zones: ['gaming', 'studio'] },
    { id: 'little', name: 'Little one', zones: ['kids'] },
    { id: 'grand', name: 'Grandparents', zones: ['lounge', 'restaurant'] }
  ];
  const OCCASIONS = ['Birthday', 'School trip', 'Corporate', 'Family gathering'];

  /* zone icons · brand book 48 grid · kids and studio from the shared round 2 overrides */
  const ICONS = {"lounge": {"p": "<path d=\"M12 26.5V16.5a5.5 5.5 0 0 1 5.5-5.5h13a5.5 5.5 0 0 1 5.5 5.5v10\"></path><path d=\"M6.5 36.5v-9a3.5 3.5 0 0 1 7 0V30h21v-2.5a3.5 3.5 0 0 1 7 0v9z\"></path><path d=\"M11 36.5V40.5M37 36.5V40.5\"></path>", "c": [24, 26, 3]}, "cafe": {"p": "<path d=\"M12 19h20v8a10 10 0 0 1-20 0z\"></path><path d=\"M32 22h2.5a4.5 4.5 0 0 1 0 9H31.5\"></path><path d=\"M9 41h26\"></path>", "c": [22, 11.5, 3]}, "restaurant": {"p": "<path d=\"M11 33a13 13 0 0 1 26 0\"></path><path d=\"M6 33h36\"></path><path d=\"M13 38.5h22\"></path>", "c": [24, 14.5, 3]}, "gaming": {"p": "<g transform=\"translate(24 25) scale(.92) translate(-24 -25)\"><path d=\"M16 15h16a10 10 0 0 1 10 10v5a6 6 0 0 1-10.4 4.1L29 31H19l-2.6 3.1A6 6 0 0 1 6 30v-5a10 10 0 0 1 10-10z\"></path><path d=\"M16 21v7M12.5 24.5h7\"></path></g>", "c": [30.5, 24.6, 3]}, "kids": {"p": "<g transform=\"rotate(45 24 18)\"><path d=\"M24 18V6.5a6 6 0 0 1 6 6z\" transform=\"rotate(0 24 18)\"></path><path d=\"M24 18V6.5a6 6 0 0 1 6 6z\" transform=\"rotate(90 24 18)\"></path><path d=\"M24 18V6.5a6 6 0 0 1 6 6z\" transform=\"rotate(180 24 18)\"></path><path d=\"M24 18V6.5a6 6 0 0 1 6 6z\" transform=\"rotate(270 24 18)\"></path></g><path d=\"M24 32v9.5\"></path>", "c": [24, 18, 3]}, "wellness": {"p": "<path d=\"M24 16.5c4 4.3 4.6 11.3 0 18c-4.6-6.7-4-13.7 0-18z\"></path><path d=\"M24 34.5c-6.8 0-12.4-4-14-11c6.8 0 12 4 14 11z\"></path><path d=\"M24 34.5c6.8 0 12.4-4 14-11c-6.8 0-12 4-14 11z\"></path><path d=\"M13 40.5h22\"></path>", "c": [24, 10.5, 3]}, "gym": {"p": "<rect x=\"6\" y=\"19\" width=\"5\" height=\"10\" rx=\"2\"></rect><rect x=\"11\" y=\"14\" width=\"5\" height=\"20\" rx=\"2\"></rect><rect x=\"32\" y=\"14\" width=\"5\" height=\"20\" rx=\"2\"></rect><rect x=\"37\" y=\"19\" width=\"5\" height=\"10\" rx=\"2\"></rect><path d=\"M16 24h16\"></path>", "c": [24, 24, 3]}, "studio": {"p": "<circle cx=\"15.5\" cy=\"27.5\" r=\"10\"></circle><path d=\"M21.7 27.5A6.2 6.2 0 1 1 15.5 21.3\"></path><path d=\"M27.4 37.5H42.5V33.5H29.4\"></path>", "c": [15.5, 27.5, 3]}, "visit": {"p": "<path d=\"M24 41.5s-12-10.5-12-20a12 12 0 0 1 24 0c0 9.5-12 20-12 20z\"></path>", "c": [24, 21.5, 3]}};

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const motion = root.classList.contains('motion');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  const pad = n => String(n).padStart(2, '0');
  const vh = () => window.innerHeight;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const icon = (id) => { const d = ICONS[id]; return `<svg class="ic" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${d.p}<circle class="ic__core" cx="${d.c[0]}" cy="${d.c[1]}" r="${d.c[2]}"></circle></svg>`; };
  const zoneById = id => ZONES.find(z => z.id === id);
  const waDigits = CONFIG.whatsappNumber.replace(/\D/g, '');
  // while the number is a placeholder nothing opens WhatsApp · links stay visible placeholders
  const waUrl = (text) => waDigits ? `https://wa.me/${waDigits}?text=${encodeURIComponent(text)}` : '';
  const igLive = !/^\[/.test(CONFIG.instagramHandle);
  const zoneSentence = () => {
    const n = ZONES.map(z => z.name.toLowerCase());
    return n.length > 1 ? `${n.slice(0, -1).join(' · ')} and ${n[n.length - 1]}` : n.join('');
  };
  // the address people should share · the live page when served · otherwise the canonical root
  const pageUrl = () => /^https?:$/.test(location.protocol) ? location.href.split('#')[0] : ($('link[rel="canonical"]') || {}).href || SITE_URL;

  /* ================= one frame loop for the whole page · round 5 =================
     every scroll linked moment on every page registers here · one passive scroll listener · one requestAnimationFrame
     measure(s) · geometry is read only on load · resize · font load and body size changes · never per frame
     read(s) then write(s) · all reads of a frame happen before any write · writes are transform · opacity or a small svg stroke */
  const mq = { phone: matchMedia('(max-width: 759px)'), stack: matchMedia('(max-width: 899px)'), tab: matchMedia('(max-width: 1099px)') };
  const tasks = []; const measures = [];
  const S = { y: 0, H: 0, W: 0, docH: 0, now: 0 };
  let queued = false; let dirty = true; let alive = 0;
  const frame = (now) => {
    queued = false;
    S.now = now; S.H = window.innerHeight; S.W = window.innerWidth;
    if (dirty) { dirty = false; S.docH = root.scrollHeight; measures.forEach(f => f(S)); S.docH = root.scrollHeight; }
    S.y = window.scrollY;
    for (const t of tasks) if (t.read) t.read(S);
    for (const t of tasks) if (t.write) t.write(S);
    if (now < alive) kick();
  };
  const kick = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  const remeasure = () => { dirty = true; kick(); };
  const onFrame = (t) => { tasks.push(typeof t === 'function' ? { write: t } : t); kick(); };
  const onMeasure = (f) => { measures.push(f); remeasure(); };
  const keepAlive = (ms) => { alive = Math.max(alive, performance.now() + ms); kick(); };
  const docTop = el => el.getBoundingClientRect().top + window.scrollY;
  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', remeasure, { passive: true });
  window.addEventListener('load', remeasure);
  if (document.fonts) document.fonts.ready.then(remeasure);
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(document.body);
  // a style write only when the value changed · keeps the frame free of needless style work
  const set = (el, prop, v) => { if (el['_' + prop] !== v) { el['_' + prop] = v; el.style[prop] = v; } };

  /* ---------- data driven content ---------- */
  // a zone removed from ZONES disappears from every page
  $$('[data-zone-item]').forEach(el => { if (!zoneById(el.dataset.zoneItem)) el.remove(); });
  $$('.js-zone-list').forEach(el => { const s = zoneSentence(); el.textContent = s.charAt(0).toUpperCase() + s.slice(1) + ' under one roof'; });
  $$('.js-zone-list-lc').forEach(el => { el.textContent = zoneSentence(); });
  $$('.js-zone-count').forEach(el => { el.textContent = pad(ZONES.length); });

  // L1 · WhatsApp and Instagram stay visible placeholders and are not links until they are real
  $$('.js-wa').forEach(a => {
    if (waDigits) { a.href = waUrl(CONFIG.greeting); a.target = '_blank'; a.rel = 'noopener'; return; }
    a.removeAttribute('href'); a.removeAttribute('target'); a.removeAttribute('rel');
  });
  $$('.js-wa-num').forEach(el => { el.textContent = CONFIG.whatsappNumber; });
  $$('.js-ig').forEach(a => {
    if (igLive) { a.href = `https://www.instagram.com/${encodeURIComponent(CONFIG.instagramHandle)}/`; a.target = '_blank'; a.rel = 'noopener'; return; }
    a.removeAttribute('href'); a.removeAttribute('target'); a.removeAttribute('rel');
  });
  $$('.js-ig-handle').forEach(el => { el.textContent = igLive ? '@' + CONFIG.instagramHandle : CONFIG.instagramHandle; });

  /* ================= header · mobile menu ================= */
  const hdr = $('#hdr');
  const menuBtn = $('.menu-btn');
  const mnav = $('#mnav');
  const setSolid = () => { solid = null; kick(); };
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    $('.menu-btn__t', menuBtn).textContent = open ? 'Close' : 'Menu';
    mnav.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    setSolid();
    if (open) $('a', mnav).focus();
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  mnav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });
  const trap = e => {
    if (e.key !== 'Tab') return;
    const f = [menuBtn, ...$$('a', mnav)];
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 1 && i !== -1) { e.preventDefault(); (i === 0 ? f[f.length - 1] : menuBtn).focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); menuBtn.focus(); }
  };
  mnav.addEventListener('keydown', trap);
  menuBtn.addEventListener('keydown', e => { if (menuBtn.getAttribute('aria-expanded') === 'true') trap(e); });

  /* ================= mobile dock · after the first screen · hidden near a form and while a scene is pinned ================= */
  const dock = $('.dock');
  const stops = $$('[data-dock-stop]').map(el => ({ el, pin: false }));
  $$('[data-dock-pin]').forEach(el => stops.push({ el, pin: true }));
  // the orbit spine on phones and tablets · page progress drawn around the menu ring
  const prog = $('.menu-btn__prog circle');
  let solid = null; let docked = null;
  onMeasure(() => { stops.forEach(s => { s.top = docTop(s.el); s.h = s.el.offsetHeight; }); });
  onFrame({
    write: ({ y, H, docH }) => {
      const sol = menuBtn.getAttribute('aria-expanded') === 'true' || y > 24;
      if (sol !== solid) { solid = sol; hdr.classList.toggle('is-solid', sol); }
      if (prog) set(prog, 'strokeDashoffset', (1 - clamp(y / Math.max(docH - H, 1))).toFixed(4));
      if (!dock) return;
      const near = stops.some(s => s.pin ? (s.top - y < H * .5 && s.top + s.h - y > H * .5) : (s.top - y < H * .92 && s.top + s.h - y > 0));
      const on = y > H * .6 && !near;
      if (on !== docked) { docked = on; dock.classList.toggle('on', on); }
    }
  });

  /* ================= send it to your family circle · needs no brand number ================= */
  const shareMsg = () => `${CONFIG.shareText} · ${pageUrl()}`;
  $$('.js-share').forEach(a => { a.href = `https://wa.me/?text=${encodeURIComponent(shareMsg())}`; });
  $$('.js-copy').forEach(b => b.addEventListener('click', async () => {
    const out = $('.share__status', b.closest('.share'));
    const url = pageUrl();
    try { await navigator.clipboard.writeText(url); out.textContent = 'Link copied · paste it in your family group'; }
    catch (err) { out.textContent = `Copy this link · ${url}`; }
  }));

  /* ================= faq accordion ================= */
  $$('.qa button').forEach(b => {
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      b.closest('.qa').classList.toggle('open', open);
    });
  });

  /* ================= chips · zone checkboxes and occasion radios from the data ================= */
  $$('.chips[data-chips="zones"]').forEach(c => {
    c.innerHTML = ZONES.map(z => `<label class="chip"><input type="checkbox" name="zones" value="${z.name}" data-zone="${z.id}"><span>${icon(z.id)}${z.name}</span></label>`).join('');
  });
  $$('.chips[data-chips="occasion"]').forEach(c => {
    const type = c.dataset.type || 'radio';
    c.innerHTML = OCCASIONS.map(o => `<label class="chip chip--plain"><input type="${type}" name="occasion" value="${o}"><span>${o}</span></label>`).join('');
  });

  /* ================= who is in your circle? · lights zones on a mini orbit and pre ticks them in the form ================= */
  $$('.picker').forEach(p => {
    const form = document.getElementById(p.dataset.form);
    const orbitEl = $('.picker__orbit', p);
    const N = ZONES.length;
    orbitEl.insertAdjacentHTML('beforeend', `<svg class="picker__ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="39"></circle></svg><span class="picker__core" aria-hidden="true"></span>` +
      ZONES.map((z, i) => `<span class="picker__z" data-z="${z.id}" style="--a0:${(360 / N) * i}deg" title="${z.name}">${icon(z.id)}</span>`).join(''));
    const chipsEl = $('.picker__who', p);
    chipsEl.innerHTML = FAMILY.map(f => `<button type="button" class="who" aria-pressed="false" data-who="${f.id}">${f.name}</button>`).join('');
    const out = $('.picker__out', p);
    const hidden = form ? form.elements.family : null;
    let auto = new Set();
    const update = () => {
      const who = $$('.who[aria-pressed="true"]', p).map(b => FAMILY.find(f => f.id === b.dataset.who));
      const lit = new Set(who.flatMap(f => f.zones).filter(zoneById));
      $$('.picker__z', p).forEach(el => el.classList.toggle('lit', lit.has(el.dataset.z)));
      p.classList.toggle('has-lit', lit.size > 0);
      const names = ZONES.filter(z => lit.has(z.id)).map(z => z.name);
      out.textContent = who.length ? `${who.map(f => f.name).join(' · ')} · ${names.join(' · ')}` : 'Pick who is coming and we light their circles';
      if (form) {
        $$('input[name="zones"]', form).forEach(c => {
          const z = c.dataset.zone;
          if (lit.has(z) && !c.checked) { c.checked = true; auto.add(z); }
          else if (!lit.has(z) && auto.has(z)) { c.checked = false; auto.delete(z); }
        });
        if (hidden) hidden.value = who.map(f => f.name).join(' · ');
      }
      p.dispatchEvent(new CustomEvent('oz:picker', { bubbles: true, detail: { who, zones: [...lit] } }));
    };
    chipsEl.addEventListener('click', e => {
      const b = e.target.closest('.who'); if (!b) return;
      b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
      update();
    });
    if (form) form.addEventListener('change', e => { if (e.target.name === 'zones') auto.delete(e.target.dataset.zone); });
    update();
  });

  /* ================= WhatsApp forms · compose a message · no backend ================= */
  $$('form[data-wa]').forEach(form => {
    const status = $('.form__status', form);
    const setErr = (input, msg) => {
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      $('#' + input.getAttribute('aria-describedby')).textContent = msg || '';
    };
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.elements.name; const phone = form.elements.phone;
      const nOk = name.value.trim().length >= 2;
      const digits = phone.value.replace(/\D/g, '');
      const pOk = digits.length >= 10 && digits.length <= 15;
      setErr(name, nOk ? '' : 'Please add your name');
      setErr(phone, pOk ? '' : 'Please add a phone number we can reach on WhatsApp');
      if (!nOk) { name.focus(); return; }
      if (!pOk) { phone.focus(); return; }
      // every field or fieldset with data-line becomes one line of the message
      const lines = [form.dataset.wa === 'celebrate' ? CONFIG.celebrateGreeting : CONFIG.greeting];
      $$('[data-line]', form).forEach(f => {
        let v;
        if (f.tagName === 'FIELDSET') v = $$('input:checked', f).map(c => c.value).join(' · ');
        else v = f.value.trim();
        if (v || f.dataset.empty) lines.push(`${f.dataset.line} · ${v || f.dataset.empty}`);
      });
      const text = lines.join('\n');
      form.dataset.message = text;
      if (!waDigits) {
        status.innerHTML = `Your message is ready · WhatsApp opens here once <span class="ph">${esc(CONFIG.whatsappNumber)}</span> is set`;
        return;
      }
      window.open(waUrl(text), '_blank', 'noopener');
      status.textContent = 'Your WhatsApp message is ready · send it to us to finish';
    });
    $$('input[aria-describedby]', form).forEach(i => i.addEventListener('input', e => { if (e.target.getAttribute('aria-invalid') === 'true') setErr(e.target, ''); }));
  });

  /* ================= reveals · only with motion · without it everything is already visible ================= */
  let io = null;
  if (motion && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (!en.isIntersecting) return; en.target.classList.add('is-in'); io.unobserve(en.target); });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .12 });
    $$('.reveal, .pillar, .card, .orbit, [data-reveal]').forEach(el => io.observe(el));
  }

  window.OZ = { SITE_URL, CONFIG, ZONES, FAMILY, OCCASIONS, ICONS, $, $$, motion, clamp, lerp, easeOut, smooth, pad, vh, esc, icon, zoneById, waDigits, waUrl, pageUrl, io, mq, onFrame, onMeasure, keepAlive, kick, remeasure, docTop, set };
})();
