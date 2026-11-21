/* O’ZONE ARENA · inner pages · one file · each block runs only on its own page (body data-page)
   zones · a sticky orbit index and a circle that opens into an arch per zone
   celebrations · a garland of arches · story · a horizontal journey through the building
   first circle · the family circle card · 404 · an orbit that has not closed */
(() => {
  'use strict';
  const OZ = window.OZ;
  const { $, $$, motion, clamp, lerp, easeOut, vh, ZONES, pad, CONFIG } = OZ;
  const page = document.body.dataset.page;
  const onFrame = (fn) => {
    let t = false;
    const go = () => { t = false; fn(); };
    const req = () => { if (!t) { t = true; requestAnimationFrame(go); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    window.addEventListener('load', req);
    if (document.fonts) document.fonts.ready.then(req);
    req();
    return req;
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
    onFrame(() => {
      const H = vh();
      let a = 0; let local = 0;
      secs.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top <= H * .45) { a = i; local = clamp((H * .45 - r.top) / Math.max(r.height, 1)); }
      });
      setActive(a);
      arc.style.strokeDashoffset = String(1 - clamp((a + local) / N));
      if (!motion) return;
      // a circle opens into an arch as the zone rises into view
      arches.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top > H * 1.2 || r.bottom < -H * .2) return;
        const p = easeOut(clamp((H * 1.02 - r.top) / (H * .72)));
        const w = el.offsetWidth; const h = el.offsetHeight;
        const d = w * .5; const cy = h * .42;
        const t = lerp(cy - d / 2, 0, p); const b = lerp(h - cy - d / 2, 0, p); const l = lerp((w - d) / 2, 0, p);
        const tr = lerp(d / 2, w / 2, p); const br = lerp(d / 2, 0, p);
        el.style.clipPath = p >= .999 ? 'none' : `inset(${t.toFixed(1)}px ${l.toFixed(1)}px ${b.toFixed(1)}px ${l.toFixed(1)}px round ${tr.toFixed(1)}px ${tr.toFixed(1)}px ${br.toFixed(1)}px ${br.toFixed(1)}px)`;
        const img = el.firstElementChild; img.style.transform = `scale(${lerp(1.16, 1, p).toFixed(3)})`;
        secs[i].classList.toggle('is-open', p > .8);
      });
    });
  }

  /* ================= CELEBRATIONS ================= */
  if (page === 'celebrations') {
    const g = $('.garland');
    const svg = $('.garland__line', g);
    const path = $('path', svg);
    const archs = $$('.oc__arch', g);
    let sig = '';
    const build = () => {
      const gr = g.getBoundingClientRect();
      const boxes = archs.map(c => { const r = c.getBoundingClientRect(); return { x0: r.left - gr.left - 12, x1: r.right - gr.left + 12, cy: r.top - gr.top + r.width / 2, h: r.height }; });
      const key = boxes.map(b => `${b.x0 | 0},${b.cy | 0}`).join('|') + gr.width;
      if (key === sig) return; sig = key;
      let d = ''; let prev = null;
      boxes.forEach(bx => {
        const rad = (bx.x1 - bx.x0) / 2;
        if (prev && bx.x0 > prev.x1 - 30 && Math.abs(prev.cy - bx.cy) < bx.h * .6) {
          const dip = Math.max(prev.cy, bx.cy) + 64;
          d += ` C ${(prev.x1 + 2).toFixed(1)} ${dip.toFixed(1)} ${(bx.x0 - 2).toFixed(1)} ${dip.toFixed(1)} ${bx.x0.toFixed(1)} ${bx.cy.toFixed(1)}`;
        } else d += ` M ${bx.x0.toFixed(1)} ${bx.cy.toFixed(1)}`;
        d += ` A ${rad.toFixed(1)} ${rad.toFixed(1)} 0 0 1 ${bx.x1.toFixed(1)} ${bx.cy.toFixed(1)}`;
        prev = bx;
      });
      svg.setAttribute('viewBox', `0 0 ${gr.width.toFixed(1)} ${gr.height.toFixed(1)}`);
      path.setAttribute('d', d.trim());
    };
    onFrame(() => {
      build();
      if (!motion) return;
      const r = g.getBoundingClientRect(); const H = vh();
      path.style.strokeDashoffset = String(1 - easeOut(clamp((H * .95 - r.top) / (Math.min(r.height, H) * .9))));
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
    const S = stops.length;
    if (motion) {
      jr.classList.add('is-pinned');
      let over = 0;
      const size = () => {
        track.style.transform = 'none';
        over = Math.max(0, track.scrollWidth - track.clientWidth);
        jr.style.height = `${Math.round(vh() + over * 1.1 + vh() * .25)}px`;
      };
      size();
      window.addEventListener('resize', size);
      window.addEventListener('load', size);
      const req = onFrame(() => {
        const r = jr.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(jr.offsetHeight - vh(), 1));
        track.style.transform = `translate3d(${(-p * over).toFixed(1)}px, 0, 0)`;
        draw.style.strokeDashoffset = String(1 - p);
        idx.textContent = pad(Math.min(S, Math.floor(p * S * .999) + 1));
      });
      // keyboard · arrows move between stops while the track is focused
      track.addEventListener('keydown', e => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const step = (jr.offsetHeight - vh()) / Math.max(S - 1, 1);
        window.scrollBy({ top: e.key === 'ArrowRight' ? step : -step, behavior: 'smooth' });
      });
      req();
    } else {
      track.addEventListener('scroll', () => {
        const p = clamp(track.scrollLeft / Math.max(track.scrollWidth - track.clientWidth, 1));
        idx.textContent = pad(Math.min(S, Math.floor(p * S * .999) + 1));
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
        off: svgImg(d.p, 'rgba(240,236,225,.42)')
      };
    });
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
        if (!on) { ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(240,236,225,.35)'; ctx.stroke(); }
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
    }
    picker.addEventListener('oz:picker', e => { who = e.detail.who.map(f => f.name); draw(); });
    form.addEventListener('change', draw);
    nameIn.addEventListener('input', draw);
    if (document.fonts) Promise.all(['600 78px Montserrat', '500 40px Montserrat'].map(f => document.fonts.load(f))).then(draw, draw);
    draw();
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
