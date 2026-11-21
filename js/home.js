/* O’ZONE ARENA · home page · zones orbit · mobile deck · family story · closing orbit · spine
   scroll is read with requestAnimationFrame only · the page is never hijacked */
(() => {
  'use strict';
  const { ZONES, $, $$, motion, clamp, lerp, easeOut, smooth, pad, vh, icon } = window.OZ;

  // optional muted loops · cropped to the same 3:4 frame as the stills · the still is the poster
  // delete a line here (or the file) and that zone simply shows its still
  const VIDEOS = {
    lounge: { src: 'assets/video/zone-lounge.mp4' },
    cafe: { src: 'assets/video/zone-cafe.mp4' },
    gaming: { src: 'assets/video/zone-gaming.mp4' }
  };

  /* ================= zones · orbit tabs + mobile deck ================= */
  const orbit = $('.orbit');
  const list = $('.orbit__list');
  const layers = $('.orbit__layers');
  const panel = $('.orbit__panel');
  const track = $('.deck__track');
  const N = ZONES.length;
  // M1 · posters and video sources wait in data attributes until the orbit or deck comes near
  const media = (z, eager) => {
    const v = VIDEOS[z.id];
    if (v && motion) return `<video muted loop playsinline preload="none" data-poster="${z.img}" data-src="${v.src}" aria-label="${z.alt}"></video>`;
    return `<img src="${z.img}" width="720" height="960" alt="${z.alt}" loading="lazy" decoding="async"${eager ? ' data-prefetch' : ''}>`;
  };
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', 'Zones');
  panel.id = 'zpanel';
  panel.setAttribute('role', 'tabpanel');
  panel.tabIndex = 0;
  ZONES.forEach((z, i) => {
    list.insertAdjacentHTML('beforeend',
      `<li role="presentation" style="--a0:${(360 / N) * i}deg;--d:${300 + i * 90}ms">` +
      `<button class="zb" type="button" role="tab" id="zt-${z.id}" aria-controls="zpanel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">` +
      `<span class="zb__c">${icon(z.id)}</span><span class="zb__l">${z.name}</span></button></li>`);
    layers.insertAdjacentHTML('beforeend', `<div class="zl${i === 0 ? ' on' : ''}">${media(z, true)}</div>`);
    track.insertAdjacentHTML('beforeend',
      `<article class="card" aria-label="${z.name}"><div class="card__arch arch arch--rise">${media(z, false)}<p class="vis-tag">Visualisation</p></div>` +
      `<div class="card__body"><span class="card__ic">${icon(z.id)}</span><h3 class="card__n">${z.name}</h3><p class="card__l">${z.line}</p></div></article>`);
  });
  $$('.js-zn, .js-dn').forEach(el => { el.textContent = pad(N); });
  const tabs = $$('.zb', list);
  const zls = $$('.zl', layers);
  let cur = 0;
  const capIcon = $('.orbit__icon');
  const cap = $('.orbit__cap');
  const setCaption = (i) => {
    capIcon.innerHTML = icon(ZONES[i].id);
    $('.js-pname').textContent = ZONES[i].name;
    $('.js-pline').textContent = ZONES[i].line;
    $('.js-zi').textContent = pad(i + 1);
    panel.setAttribute('aria-labelledby', tabs[i].id);
    cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap');
  };
  setCaption(0);
  const selectZone = (i, focus) => {
    i = (i + N) % N;
    if (focus) tabs[i].focus();
    if (i === cur) return;
    tabs[cur].setAttribute('aria-selected', 'false'); tabs[cur].tabIndex = -1;
    tabs[i].setAttribute('aria-selected', 'true'); tabs[i].tabIndex = 0;
    zls.forEach(l => l.classList.remove('was'));
    zls[cur].classList.remove('on'); zls[cur].classList.add('was');
    zls[i].classList.add('on');
    cur = i;
    setCaption(i);
    syncVideos();
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => selectZone(i));
    t.addEventListener('focus', () => selectZone(i));
    t.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') selectZone(i); });
    t.addEventListener('keydown', e => {
      const k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); selectZone(cur + 1, true); }
      else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); selectZone(cur - 1, true); }
      else if (k === 'Home') { e.preventDefault(); selectZone(0, true); }
      else if (k === 'End') { e.preventDefault(); selectZone(N - 1, true); }
    });
  });

  // deck · prev next and the visible counter
  const cards = $$('.card', track);
  const cardStep = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
  const deckIndex = () => Math.round(track.scrollLeft / cardStep());
  $('.js-prev').addEventListener('click', () => track.scrollBy({ left: -cardStep(), behavior: motion ? 'smooth' : 'auto' }));
  $('.js-next').addEventListener('click', () => track.scrollBy({ left: cardStep(), behavior: motion ? 'smooth' : 'auto' }));
  track.addEventListener('scroll', () => { $('.js-di').textContent = pad(clamp(deckIndex(), 0, N - 1) + 1); syncVideos(); }, { passive: true });

  // optional zone videos · play only when visible
  let orbitVisible = false;
  let deckVisible = false;
  function syncVideos() {
    if (!motion) return;
    zls.forEach((l, i) => { const v = $('video', l); if (!v || !v.dataset.ready) return; (orbitVisible && i === cur) ? v.play().catch(() => {}) : v.pause(); });
    const di = deckIndex();
    cards.forEach((c, i) => { const v = $('video', c); if (!v || !v.dataset.ready) return; (deckVisible && i === di) ? v.play().catch(() => {}) : v.pause(); });
  }
  // M1 + M2 · when the orbit or deck is about 600 px away · posters and sources attach and every zone still is fetched once
  const arm = (scope) => {
    $$('video[data-poster]', scope).forEach(v => {
      // a direct src with preload none fetches nothing until the clip actually plays
      v.poster = v.dataset.poster; v.removeAttribute('data-poster');
      v.src = v.dataset.src; v.removeAttribute('data-src'); v.dataset.ready = '1';
    });
    $$('img[data-prefetch]', scope).forEach(im => { im.loading = 'eager'; im.removeAttribute('data-prefetch'); });
    syncVideos();
  };
  if ('IntersectionObserver' in window) {
    const near = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      arm(en.target); near.unobserve(en.target);
    }), { rootMargin: '600px 0px' });
    near.observe(orbit); near.observe(track);
  } else { arm(orbit); arm(track); }

  /* ================= family story · chapter buttons work in every mode ================= */
  const story = $('.story');
  const pcs = $$('.pc', story);
  const chs = $$('.ch', story);
  const steps = $$('.steps button', story);
  const storyArc = $('.story__arc', story);
  const CH = chs.length;
  const storyTotal = () => story.offsetHeight - vh();
  steps.forEach((b, i) => b.addEventListener('click', () => {
    window.scrollTo({ top: story.offsetTop + storyTotal() * ((i + .5) / CH), behavior: 'smooth' });
  }));

  /* ================= closing orbit dots ================= */
  const closeEl = $('.close');
  const dotList = $('.close__dots');
  ZONES.forEach((z, i) => dotList.insertAdjacentHTML('beforeend', `<li style="--a0:${(360 / N) * i}deg"></li>`));
  const dots = $$('li', dotList);

  /* ================= drawn rings ================= */
  const ripple = $('.ripple');
  const rcs = $$('.rc', ripple);
  const ringsG = $('.ripple__rings', ripple);
  for (let r = 34; r <= 280; r += 24) ringsG.insertAdjacentHTML('beforeend', `<circle cx="280" cy="280" r="${r}"></circle>`);

  /* ================= spine · page progress and chapter name ================= */
  const spine = $('.spine');
  const spineArc = $('.spine__arc');
  const spineLabel = $('.spine__label');
  const tracked = $$('[data-spine]');
  const LIGHT = new Set(['circles', 'family', 'celebrate', 'visit']);
  function ui(y, H, docH) {
    spineArc.style.strokeDashoffset = String(1 - clamp(y / Math.max(docH - H, 1)));
    let active = tracked[0];
    for (const s of tracked) { if (s.getBoundingClientRect().top <= H * .5) active = s; }
    spineLabel.textContent = active.dataset.spine;
    spine.classList.toggle('is-ink', LIGHT.has(active.id));
    spine.classList.toggle('is-off', active === tracked[0] || active.id === 'join' || active.tagName === 'FOOTER');
  }

  /* ---------- static mode stops here · everything is already visible ---------- */
  if (!motion) {
    dots.forEach(d => d.classList.add('lit'));
    story.classList.add('is-end');
    let pending = false;
    const tick = () => { pending = false; ui(window.scrollY, vh(), document.documentElement.scrollHeight); };
    const req = () => { if (!pending) { pending = true; requestAnimationFrame(tick); } };
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    req();
    return;
  }

  $$('.pillar').forEach((p, i) => { const d = `${i * .16}s`; p.style.setProperty('--d', d); $('.arch--rise', p).style.setProperty('--d', d); });
  $$('.card').forEach(c => $('.arch--rise', c).style.setProperty('--d', '0s'));

  const vio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.target === orbit) orbitVisible = en.isIntersecting;
      else deckVisible = en.isIntersecting;
    });
    syncVideos();
  }, { threshold: .3 });
  vio.observe(orbit); vio.observe(track);

  /* ================= hero intro ================= */
  const hero = $('.hero');
  const heroBox = $('.hero__box');
  const arcs = $$('.orbit-arc');
  let introT0 = 0;
  const startHero = () => { requestAnimationFrame(() => { hero.classList.add('is-in'); introT0 = performance.now(); loop(); }); };
  const heroImg = $('.hero__img');
  if (heroImg.complete) startHero(); else { heroImg.addEventListener('load', startHero, { once: true }); setTimeout(() => { if (!hero.classList.contains('is-in')) startHero(); }, 1400); }

  /* ================= scroll driven frame ================= */
  const rCore = $('.ripple__core', ripple);
  const pimgs = $$('.pillar .arch img');
  const ANG = [-45, 45, 135, -135];
  let chapter = -1;
  let closed = false;

  function layoutStory(c) {
    pcs.forEach((el, i) => {
      let t; let o = 1;
      if (i === CH - 1) { t = c === CH - 1 ? 'none' : 'scale(.6)'; o = c === CH - 1 ? 1 : 0; }
      else if (i === c) t = 'none';
      else { const a = ANG[i] * Math.PI / 180; t = `translate(${(Math.sin(a) * 75).toFixed(2)}%, ${(-Math.cos(a) * 75).toFixed(2)}%) scale(${c === CH - 1 ? .36 : .34})`; }
      el.style.transform = t; el.style.opacity = o;
      el.classList.toggle('is-focus', i === c);
    });
    chs.forEach((el, i) => el.classList.toggle('on', i === c));
    steps.forEach((b, i) => b.setAttribute('aria-current', i === c ? 'step' : 'false'));
    story.classList.toggle('is-end', c === CH - 1);
  }

  let ticking = false;
  function loop() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function frame(now) {
    ticking = false;
    const H = vh();
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight;

    // hero · the bright arc orbits the building as you scroll · slow depth on the render
    const hp = clamp(y / Math.max(hero.offsetHeight, 1));
    const intro = introT0 ? easeOut(clamp((now - introT0) / 3000)) : 0;
    const off = String(-(150 + intro * 260 + hp * 620));
    arcs.forEach(a => { a.style.strokeDashoffset = off; });
    heroBox.style.transform = `translate3d(0, ${(hp * 9).toFixed(2)}%, 0)`;
    if (introT0 && now - introT0 < 3100) loop();

    // many circles · four circles drift in from across the city and meet at one core
    const mr = ripple.getBoundingClientRect();
    const mp = clamp((H * .95 - mr.top) / (H * .55));
    const me = easeOut(mp);
    const spread = lerp(188, 66, me);
    rcs.forEach(g => {
      const dx = +g.dataset.x; const dy = +g.dataset.y;
      g.setAttribute('transform', `translate(${(280 + dx * spread).toFixed(1)} ${(280 + dy * spread).toFixed(1)})`);
      g.style.opacity = (.35 + .65 * me).toFixed(3);
    });
    rCore.style.transform = `scale(${smooth(.72, 1, mp).toFixed(3)})`;

    // family story · chapter from pinned progress · the orbit arc fills as the family gathers
    const sr = story.getBoundingClientRect();
    const sp = clamp(-sr.top / Math.max(story.offsetHeight - H, 1));
    storyArc.style.strokeDashoffset = String(1 - sp);
    const c = Math.min(CH - 1, Math.floor(sp * CH));
    if (c !== chapter) { chapter = c; layoutStory(c); }

    // building · the render drifts slowly inside each arch
    pimgs.forEach(im => {
      const r = im.parentNode.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H) return;
      im.style.translate = `0 ${((.5 - (r.top + r.height / 2) / H) * 6).toFixed(2)}%`;
    });

    // closing orbit · draws with scroll and closes into the core
    if (!closed) {
      const cr = closeEl.getBoundingClientRect();
      let cp = clamp((H * .95 - cr.top) / (H * .45));
      if (y + H >= docH - 4) cp = 1;
      $('.close__arc').style.strokeDashoffset = String(1 - cp);
      dots.forEach((d, i) => d.classList.toggle('lit', cp >= i / N + .015));
      if (cp >= .999) { closed = true; closeEl.classList.add('is-closed'); }
    }

    ui(y, H, docH);
  }
  window.addEventListener('scroll', loop, { passive: true });
  window.addEventListener('resize', loop);
  loop();
})();
