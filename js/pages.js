/* O’ZONE ARENA · inner pages · one file · each block runs only on its own page (body data-page)
   zones · a sticky orbit index and a circle that opens into an arch per zone
   celebrations · a garland of arches · story · a horizontal journey through the building
   first circle · the family circle card · 404 · an orbit that has not closed
   round 5 · everything runs in the one frame loop of core.js · phones get their own version of each moment */
(() => {
  'use strict';
  const OZ = window.OZ;
  const { $, $$, motion, clamp, lerp, easeOut, smooth, ZONES, pad, CONFIG, mq, onFrame, onMeasure, docTop, set } = OZ;
  const page = document.body.dataset.page;
  // piecewise linear map · knots sorted by x
  const interp = (k, x) => {
    if (x <= k[0][0]) return k[0][1];
    for (let i = 1; i < k.length; i++) if (x <= k[i][0]) return lerp(k[i - 1][1], k[i][1], (x - k[i - 1][0]) / Math.max(k[i][0] - k[i - 1][0], 1));
    return k[k.length - 1][1];
  };

  /* ================= ZONES ================= */
  if (page === 'zones') {
    const secs = $$('.zs');
    const items = $$('.zx__list li');
    const N = secs.length;
    const idOf = s => s.dataset.zoneItem;
    // numbers · previous and next follow the zones that remain in the data
    secs.forEach((s, i) => {
      $('.js-zs-n', s).textContent = pad(i + 1);
      [['.zs__prev', secs[(i - 1 + N) % N]], ['.zs__next', secs[(i + 1) % N]]].forEach(([sel, t]) => {
        const a = $(sel, s); a.href = '#' + t.id; $('.zs__to', a).textContent = OZ.zoneById(idOf(t)).name;
      });
    });
    items.forEach((li, i) => li.style.setProperty('--a0', `${(360 / items.length) * i}deg`));
    const bar = $('.zx__list');
    const nowN = $('.js-zx-n');
    const nowName = $('.js-zx-name');
    const arc = $('.zx__arc');
    const prog = $('.zx__prog');
    let active = -1;
    const setActive = (i) => {
      if (i === active) return;
      active = i;
      items.forEach((li, j) => { li.classList.toggle('on', j === i); $('a', li).setAttribute('aria-current', j === i ? 'location' : 'false'); });
      nowN.textContent = pad(i + 1);
      nowName.textContent = OZ.zoneById(idOf(secs[i])).name;
      if (bar.scrollWidth > bar.clientWidth + 2) {
        const li = items[i];
        bar.scrollTo({ left: li.offsetLeft - bar.clientWidth / 2 + li.offsetWidth / 2, behavior: motion ? 'smooth' : 'auto' });
      }
    };
    const arches = secs.map(s => $('.zs__arch', s));
    const irises = arches.map(a => $('.zs__iris', a));
    const imgs = arches.map(a => $('img', a));
    const tags = arches.map(a => $('.vis-tag', a));
    const G = { secs: [], arches: [] };
    onMeasure(() => {
      G.iris = mq.tab.matches;
      G.secs = secs.map(s => ({ top: docTop(s), h: s.offsetHeight }));
      G.arches = arches.map(a => ({ top: docTop(a), w: a.offsetWidth, h: a.offsetHeight }));
      // phones and tablets · the circle opens into the arch with transforms only
      // the iris is a circle as wide as the arch diagonal · it starts scaled down to a circle half the arch wide
      arches.forEach((a, i) => {
        const g = G.arches[i];
        const D = Math.ceil(2 * Math.hypot(g.w / 2, g.h * .58)) + 4;
        g.s0 = (g.w * .5) / D;
        a.style.setProperty('--w', g.w + 'px'); a.style.setProperty('--h', g.h + 'px'); a.style.setProperty('--D', D + 'px'); a.style.setProperty('--s0', g.s0.toFixed(4));
        irises[i]._transform = null; imgs[i]._transform = null; tags[i]._opacity = null; a._clipPath = null;
        if (!G.iris) { irises[i].style.transform = ''; tags[i].style.opacity = ''; } else a.style.clipPath = '';
      });
    });
    onFrame({
      write: ({ y, H }) => {
        let a = 0; let local = 0;
        G.secs.forEach((s, i) => { const top = s.top - y; if (top <= H * .45) { a = i; local = clamp((H * .45 - top) / Math.max(s.h, 1)); } });
        setActive(a);
        const p = clamp((a + local) / N);
        if (G.iris) set(prog, 'transform', `scaleX(${p.toFixed(4)})`);
        else set(arc, 'strokeDashoffset', (1 - p).toFixed(4));
        if (!motion) return;
        // a circle opens into an arch as the zone rises into view
        arches.forEach((el, i) => {
          const g = G.arches[i]; const top = g.top - y;
          if (top > H * 1.2 || top + g.h < -H * .2) return;
          // phones open the circle a little later and slower so the whole move happens on screen
          const p = G.iris ? smooth(0, 1, (H * .98 - top) / (H * .74)) : easeOut(clamp((H * 1.02 - top) / (H * .72)));
          if (G.iris) {
            const s = lerp(g.s0, 1, p);
            set(irises[i], 'transform', `scale(${s.toFixed(4)})`);
            set(imgs[i], 'transform', `scale(${(lerp(1.16, 1, p) / s).toFixed(4)})`);
            set(tags[i], 'opacity', smooth(.5, .85, p).toFixed(3));
            const live = p > 0 && p < 1;
            if (secs[i]._live !== live) { secs[i]._live = live; secs[i].classList.toggle('is-live', live); }
          } else {
            const w = g.w; const h = g.h;
            const d = w * .5; const cy = h * .42;
            const t = lerp(cy - d / 2, 0, p); const b = lerp(h - cy - d / 2, 0, p); const l = lerp((w - d) / 2, 0, p);
            const tr = lerp(d / 2, w / 2, p); const br = lerp(d / 2, 0, p);
            set(el, 'clipPath', p >= .999 ? 'none' : `inset(${t.toFixed(1)}px ${l.toFixed(1)}px ${b.toFixed(1)}px ${l.toFixed(1)}px round ${tr.toFixed(1)}px ${tr.toFixed(1)}px ${br.toFixed(1)}px ${br.toFixed(1)}px)`);
            set(imgs[i], 'transform', `scale(${lerp(1.16, 1, p).toFixed(3)})`);
          }
          const open = p > .8;
          if (secs[i]._open !== open) { secs[i]._open = open; secs[i].classList.toggle('is-open', open); }
        });
      }
    });
  }

  /* ================= CELEBRATIONS ================= */
  if (page === 'celebrations') {
    const g = $('.garland');
    const svg = $('.garland__line', g);
    const path = $('path', svg);
    const archs = $$('.oc__arch', g);
    const ocs = $$('.oc', g);
    const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tmp.setAttribute('fill', 'none'); tmp.style.visibility = 'hidden';
    svg.appendChild(tmp);
    const G = { knots: null, lit: [] };
    let sig = '';
    // desktop · one row of arches · phones and tablets · the garland snakes through both rows and lights each arch it reaches
    const build = () => {
      const gr = g.getBoundingClientRect();
      const boxes = archs.map(c => { const r = c.getBoundingClientRect(); return { x0: r.left - gr.left - 12, x1: r.right - gr.left + 12, top: r.top - gr.top, cy: r.top - gr.top + r.width / 2, h: r.height }; });
      G.top = gr.top + window.scrollY; G.h = gr.height;
      const key = boxes.map(b => `${b.x0 | 0},${b.cy | 0}`).join('|') + gr.width;
      if (key === sig) return; sig = key;
      const rows = [];
      boxes.forEach((bx, i) => { const r = rows[rows.length - 1]; bx.i = i; if (r && Math.abs(r[0].cy - bx.cy) < bx.h * .6) r.push(bx); else rows.push([bx]); });
      const snake = rows.length > 1;
      g.classList.toggle('is-snake', snake);
      let d = ''; let prev = null; const at = []; const knots = [];
      const len = () => { tmp.setAttribute('d', d.trim()); return tmp.getTotalLength(); };
      rows.forEach((row, r) => {
        const rtl = snake && r % 2 === 1;
        const seq = rtl ? row.slice().reverse() : row;
        const rowTop = Math.min(...row.map(b => b.top));
        seq.forEach((bx, j) => {
          const rad = (bx.x1 - bx.x0) / 2;
          const sx = rtl ? bx.x1 : bx.x0; const ex = rtl ? bx.x0 : bx.x1;
          if (!prev) d += ` M ${sx.toFixed(1)} ${bx.cy.toFixed(1)}`;
          else if (j > 0) {
            // a dip between two arches of the same row
            const dip = Math.max(prev.cy, bx.cy) + 64; const px = rtl ? prev.x0 - 2 : prev.x1 + 2; const qx = rtl ? sx + 2 : sx - 2;
            d += ` C ${px.toFixed(1)} ${dip.toFixed(1)} ${qx.toFixed(1)} ${dip.toFixed(1)} ${sx.toFixed(1)} ${bx.cy.toFixed(1)}`;
          } else if (snake) {
            // the garland hangs down the outer margin to the next row
            const ox = rtl ? Math.max(prev.x1, sx) + 4 : Math.min(prev.x0, sx) - 4; const span = bx.cy - prev.cy;
            d += ` C ${ox.toFixed(1)} ${(prev.cy + span * .4).toFixed(1)} ${ox.toFixed(1)} ${(bx.cy - span * .4).toFixed(1)} ${sx.toFixed(1)} ${bx.cy.toFixed(1)}`;
          } else d += ` M ${sx.toFixed(1)} ${bx.cy.toFixed(1)}`;
          const L0 = snake ? len() : 0;
          d += ` A ${rad.toFixed(1)} ${rad.toFixed(1)} 0 0 ${rtl ? 0 : 1} ${ex.toFixed(1)} ${bx.cy.toFixed(1)}`;
          if (snake) at[bx.i] = L0 + Math.PI * rad * .5;
          if (snake && j === 0) knots.push([rowTop, L0]);
          prev = bx;
        });
        if (snake) knots.push([rowTop + Math.max(...row.map(b => b.h)) * .5, len()]);
      });
      svg.setAttribute('viewBox', `0 0 ${gr.width.toFixed(1)} ${gr.height.toFixed(1)}`);
      path.setAttribute('d', d.trim());
      if (snake) {
        const T = path.getTotalLength() || 1;
        G.lit = at.map(v => v / T);
        G.knots = knots.map(([yy, L]) => [yy, L / T]);
        G.knots[G.knots.length - 1][1] = 1;
      } else { G.knots = null; G.lit = []; }
      ocs.forEach(o => { o._lit = null; });
    };
    onMeasure(build);
    onFrame({
      write: ({ y, H }) => {
        if (!motion) return;
        const top = G.top - y;
        if (top > H * 1.2 || top + G.h < -H * .2) return;
        let f;
        if (G.knots) f = clamp(interp(G.knots, y + H * .66 - G.top));
        else f = easeOut(clamp((H * .95 - top) / (Math.min(G.h, H) * .9)));
        set(path, 'strokeDashoffset', (1 - f).toFixed(4));
        if (G.knots) ocs.forEach((o, i) => { const on = f >= G.lit[i] - .01; if (o._lit !== on) { o._lit = on; o.classList.toggle('lit', on); } });
      }
    });
    // plan a birthday · school trip · picks the occasion and moves to the form
    $$('.oc__go').forEach(b => b.addEventListener('click', () => {
      const r = $(`#celForm input[name="occasion"][value="${b.dataset.occ}"]`);
      if (r) r.checked = true;
      $('#plan').scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
      setTimeout(() => $('#c-name').focus({ preventScroll: true }), motion ? 700 : 0);
    }));
  }

  /* ================= STORY ================= */
  if (page === 'story') {
    const jr = $('.jr');
    const track = $('.jr__track', jr);
    const draw = $('.jr__draw', jr);
    const idx = $('.js-jr-i', jr);
    const stops = $$('.jr__stop', track);
    const archs = stops.map(s => $('.jr__arch', s));
    const pics = stops.map(s => $('.jr__arch img', s));
    const S = stops.length;
    let shown = '01';
    const show = (v) => { if (v !== shown) { shown = v; idx.textContent = v; } };
    if (motion) {
      jr.classList.add('is-pinned');
      let over = 0; let tx = null;
      const G = {};
      onMeasure(() => {
        track.style.transform = 'none'; tx = null;
        over = Math.max(0, track.scrollWidth - track.clientWidth);
        // phones get a little more runway per stop so each arch has a beat in front · about 1.8 screens in all at 390 × 844
        const h = Math.round(window.innerHeight + over * (mq.phone.matches ? 1.7 : 1.1) + window.innerHeight * .25);
        if (jr._h !== h) { jr._h = h; jr.style.height = `${h}px`; }
        G.top = docTop(jr); G.h = h; G.phone = mq.phone.matches;
        archs.forEach(a => { a._transform = null; a._opacity = null; });
        pics.forEach(im => { im._transform = null; });
      });
      onFrame({
        write: ({ y, H }) => {
          const top = G.top - y;
          if (top > H || top + G.h < 0) return;
          const p = clamp(-top / Math.max(G.h - H, 1));
          const t = `translate3d(${(-p * over).toFixed(1)}px, 0, 0)`;
          if (t !== tx) { tx = t; track.style.transform = t; }
          set(draw, 'strokeDashoffset', (1 - p).toFixed(4));
          if (!G.phone) { show(pad(Math.min(S, Math.floor(p * S * .999) + 1))); return; }
          // phones · the arch in front stands tall and lit · the others wait smaller and dim · each view drifts inside its arch
          const at = p * (S - 1);
          show(pad(Math.round(at) + 1));
          archs.forEach((a, i) => {
            const e = 1 - clamp(Math.abs(i - at));
            set(a, 'transform', `scale(${(.88 + .12 * e).toFixed(3)})`);
            set(a, 'opacity', (.5 + .5 * e).toFixed(3));
            set(pics[i], 'transform', `translate3d(${clamp((i - at) * 7, -8, 8).toFixed(2)}%, 0, 0) scale(1.18)`);
          });
        }
      });
      // keyboard · arrows move between stops while the track is focused
      track.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const step = (jr.offsetHeight - window.innerHeight) / Math.max(S - 1, 1);
        window.scrollBy({ top: e.key === 'ArrowRight' ? step : -step, behavior: 'smooth' });
      });
    } else {
      track.addEventListener('scroll', () => {
        const p = clamp(track.scrollLeft / Math.max(track.scrollWidth - track.clientWidth, 1));
        show(pad(Math.min(S, Math.floor(p * S * .999) + 1)));
      }, { passive: true });
    }
  }

  /* ================= FIRST CIRCLE · family circle card ================= */
  if (page === 'first-circle') {
    const canvas = $('.cardgen__canvas');
    const ctx = canvas.getContext('2d');
    const form = $('#fcForm');
    const picker = $('.picker');
    const nameIn = $('#card-name');
    const status = $('.cardgen__status');
    const dlBtn = $('.js-card-dl');
    const shareBtn = $('.js-card-share');
    const cardFig = $('.cardgen');
    const NAVY = '#031749'; const GOLD = '#C6A073'; const LINEN = '#F0ECE1';
    const W = 1080; const H = 1350;
    let who = [];
    const svgImg = (inner, stroke) => {
      const im = new Image();
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="192" height="192" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`);
      im.onload = () => draw();
      return im;
    };
    const ICON = {};
    ZONES.forEach(z => {
      const d = OZ.ICONS[z.id];
      ICON[z.id] = {
        on: svgImg(d.p + `<circle cx="${d.c[0]}" cy="${d.c[1]}" r="${d.c[2]}" fill="${GOLD}" stroke="none"/>`, NAVY),
        // W5 · unlit circles stay readable on a phone status screen
        off: svgImg(d.p, 'rgba(240,236,225,.62)')
      };
    });

    /* phones · the card builds where you can see it · a live mini card rises beside your thumb while you pick
       a tap brings the full card into view · it is a visual shortcut only · the full card stays in the page for everyone */
    const peek = document.createElement('button');
    peek.type = 'button'; peek.className = 'cardpeek'; peek.tabIndex = -1; peek.setAttribute('aria-hidden', 'true');
    peek.innerHTML = '<canvas class="cardpeek__c" width="216" height="270"></canvas><span class="cardpeek__k">Your card</span>';
    document.body.appendChild(peek);
    const pctx = $('canvas', peek).getContext('2d');
    peek.addEventListener('click', () => cardFig.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' }));
    let touched = false; let peekOn = null;
    const pop = () => { if (motion && peekOn && peek.animate) peek.animate([{ transform: 'scale(1.12)' }, { transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.22,.61,.36,1)' }); };

    const logo = new Image(); logo.onload = () => draw(); logo.src = 'assets/full-whitegold.svg';
    const fit = (text, weight, size, max) => { let s = size; ctx.font = `${weight} ${s}px Montserrat`; while (ctx.measureText(text).width > max && s > 28) { s -= 2; ctx.font = `${weight} ${s}px Montserrat`; } return s; };
    function draw() {
      const lit = new Set($$('input[name="zones"]:checked', form).map(c => c.dataset.zone));
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, H);
      // real logo file · stacked lockup
      if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, W / 2 - 55, 64, 110, 120);
      // eyebrow · name
      ctx.fillStyle = GOLD; ctx.font = '600 26px Montserrat';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '7px';
      ctx.fillText('OUR FAMILY CIRCLE', W / 2 + 3.5, 262);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
      const title = nameIn.value.trim() || 'Our family';
      fit(title, 600, 78, 900); ctx.fillStyle = LINEN; ctx.fillText(title, W / 2, 352);
      // orbit · ripples · zones · one core
      const cx = W / 2; const cy = 716; const R = 278;
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(240,236,225,.08)';
      [96, 170].forEach(r => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });
      ctx.lineWidth = 3; ctx.strokeStyle = GOLD; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
      ZONES.forEach((z, i) => {
        const a = (Math.PI * 2 * i) / ZONES.length;
        const x = cx + Math.sin(a) * R; const y = cy - Math.cos(a) * R; const on = lit.has(z.id);
        ctx.beginPath(); ctx.arc(x, y, 62, 0, Math.PI * 2);
        ctx.fillStyle = on ? LINEN : NAVY; ctx.fill();
        if (!on) { ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(240,236,225,.55)'; ctx.stroke(); }
        const im = ICON[z.id][on ? 'on' : 'off'];
        if (im.complete && im.naturalWidth) ctx.drawImage(im, x - 42, y - 42, 84, 84);
      });
      ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fill();
      // who · which circles
      const names = who.length ? who.join(' · ') : 'Pick who is coming';
      fit(names, 500, 40, 940); ctx.fillStyle = who.length ? LINEN : 'rgba(240,236,225,.5)'; ctx.fillText(names, W / 2, 1140);
      const zn = ZONES.filter(z => lit.has(z.id)).map(z => z.name).join(' · ');
      if (zn) { fit(zn, 500, 28, 960); ctx.fillStyle = GOLD; ctx.fillText(zn, W / 2, 1192); }
      // tagline
      ctx.font = '600 44px Montserrat';
      const a1 = 'all your circles '; const a2 = 'one zone';
      const w1 = ctx.measureText(a1).width; const w2 = ctx.measureText(a2).width; const x0 = W / 2 - (w1 + w2) / 2;
      ctx.textAlign = 'left'; ctx.fillStyle = LINEN; ctx.fillText(a1, x0, 1284); ctx.fillStyle = GOLD; ctx.fillText(a2, x0 + w1, 1284);
      // the mini card mirrors the full one
      pctx.drawImage(canvas, 0, 0, 216, 270);
    }
    const changed = () => { touched = true; draw(); OZ.kick(); pop(); };
    picker.addEventListener('oz:picker', e => { who = e.detail.who.map(f => f.name); changed(); });
    form.addEventListener('change', changed);
    nameIn.addEventListener('input', changed);
    if (document.fonts) Promise.all(['600 78px Montserrat', '500 40px Montserrat'].map(f => document.fonts.load(f))).then(draw, draw);
    draw();

    const G = {};
    const textCol = $('.fc__text');
    onMeasure(() => { G.stack = mq.stack.matches; G.pickTop = docTop(textCol); G.pickH = textCol.offsetHeight; G.cardTop = docTop(cardFig); });
    onFrame({
      write: ({ y, H }) => {
        const on = G.stack && touched && G.pickTop - y < H * .7 && G.pickTop + G.pickH - y > H * .25 && G.cardTop - y > H * .82 && document.activeElement !== nameIn;
        if (on !== peekOn) { peekOn = on; peek.classList.toggle('on', on); }
      }
    });

    const blob = () => new Promise((res, rej) => { try { canvas.toBlob(b => b ? res(b) : rej(new Error('empty')), 'image/png'); } catch (err) { rej(err); } });
    const offline = 'The card downloads once the site is online · this preview runs from a local file';
    dlBtn.addEventListener('click', async () => {
      try {
        const b = await blob(); const a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = 'ozone-family-circle.png'; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        status.textContent = 'Your card is saved · share it with your family group';
      } catch (err) { status.textContent = offline; }
    });
    const probe = typeof File === 'function' ? new File([new Blob(['x'], { type: 'image/png' })], 'x.png', { type: 'image/png' }) : null;
    if (probe && navigator.canShare && navigator.canShare({ files: [probe] })) {
      shareBtn.hidden = false;
      shareBtn.addEventListener('click', async () => {
        try {
          const b = await blob();
          await navigator.share({ files: [new File([b], 'ozone-family-circle.png', { type: 'image/png' })], title: 'Our family circle', text: `${CONFIG.shareText} · ${OZ.pageUrl()}` });
        } catch (err) { if (err && err.name !== 'AbortError') status.textContent = offline; }
      });
    }
  }

  /* ================= 404 ================= */
  if (page === '404') {
    const g = $('.nf__dots');
    ZONES.forEach((z, i) => {
      const a = (Math.PI * 2 * i) / ZONES.length;
      g.insertAdjacentHTML('beforeend', `<circle cx="${(200 + Math.sin(a) * 170).toFixed(1)}" cy="${(200 - Math.cos(a) * 170).toFixed(1)}" r="6"></circle>`);
    });
  }
})();
