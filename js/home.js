/* O’ZONE ARENA · home page · zones orbit · phone halo dial · family story · closing orbit · spine
   every scroll linked moment runs inside the one frame loop in core.js · the page is never hijacked
   round 5 · each moment has a phone version of the same idea · geometry is cached and only re-read on resize */
(() => {
  'use strict';
  const OZ = window.OZ;
  const { ZONES, $, $$, motion, clamp, lerp, easeOut, smooth, pad, icon, mq, onFrame, onMeasure, keepAlive, kick, docTop, set } = OZ;

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
  const deck = $('.deck');
  const track = $('.deck__track');
  const N = ZONES.length;
  const STEP = 360 / N;
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
      `<li role="presentation" style="--a0:${STEP * i}deg;--d:${300 + i * 90}ms">` +
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

  // deck · prev next and the visible counter · the swipe position is read once per frame
  const cards = $$('.card', track);
  let cardStep = 1;
  let deckK = 0; let deckI = 0;
  const di = $('.js-di');
  const goCard = (i) => track.scrollTo({ left: clamp(i, 0, N - 1) * cardStep, behavior: motion ? 'smooth' : 'auto' });
  $('.js-prev').addEventListener('click', () => goCard(deckI - 1));
  $('.js-next').addEventListener('click', () => goCard(deckI + 1));
  track.addEventListener('scroll', kick, { passive: true });

  /* ---------- phones · the orbit becomes a halo dial around the swipe deck ----------
     the eight zone circles ride a gold halo that hugs the arch of the card in front · swiping turns the halo
     so the next circle rises to the top · the gold arc grows with every zone met and closes on the last one */
  const dial = document.createElement('div');
  dial.className = 'dial';
  dial.setAttribute('aria-hidden', 'true');
  dial.innerHTML = `<div class="dial__spin"><svg class="dial__ring" viewBox="0 0 100 100" focusable="false"><circle class="dial__track" cx="50" cy="50" r="49.4" pathLength="1" transform="rotate(-90 50 50)"/><circle class="dial__arc" cx="50" cy="50" r="49.4" pathLength="1" transform="rotate(${-90 - STEP / 2} 50 50)"/></svg></div>` +
    `<ul class="dial__list">${ZONES.map((z, i) => `<li class="dial__z" data-i="${i}"><span class="dial__c">${icon(z.id)}</span></li>`).join('')}</ul>`;
  deck.prepend(dial);
  const dialSpin = $('.dial__spin', dial);
  const dialTrack = $('.dial__track', dial);
  const dialArc = $('.dial__arc', dial);
  const dialZ = $$('.dial__z', dial);
  dial.addEventListener('click', e => { const z = e.target.closest('.dial__z'); if (z) goCard(+z.dataset.i); });

  // optional zone videos · play only when visible
  let orbitVisible = false;
  let deckVisible = false;
  function syncVideos() {
    if (!motion) return;
    zls.forEach((l, i) => { const v = $('video', l); if (!v || !v.dataset.ready) return; (orbitVisible && i === cur) ? v.play().catch(() => {}) : v.pause(); });
    cards.forEach((c, i) => { const v = $('video', c); if (!v || !v.dataset.ready) return; (deckVisible && i === deckI) ? v.play().catch(() => {}) : v.pause(); });
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
  const G = {};   // cached geometry · document coordinates
  steps.forEach((b, i) => b.addEventListener('click', () => {
    window.scrollTo({ top: G.storyTop + (G.storyH - window.innerHeight) * ((i + .5) / CH), behavior: motion ? 'smooth' : 'auto' });
  }));

  /* ================= closing orbit dots ================= */
  const closeEl = $('.close');
  const closeRun = $('.close-run');
  const closeArc = $('.close__arc');
  const dotList = $('.close__dots');
  ZONES.forEach((z, i) => dotList.insertAdjacentHTML('beforeend', `<li style="--a0:${STEP * i}deg"></li>`));
  const dots = $$('li', dotList);

  /* ================= drawn rings ================= */
  const ripple = $('.ripple');
  const rcs = $$('.rc', ripple);
  const ringsG = $('.ripple__rings', ripple);
  for (let r = 34; r <= 280; r += 24) ringsG.insertAdjacentHTML('beforeend', `<circle cx="280" cy="280" r="${r}"></circle>`);

  /* ================= spine · page progress and chapter name (desktop) ================= */
  const spine = $('.spine');
  const spineArc = $('.spine__arc');
  const spineLabel = $('.spine__label');
  const tracked = $$('[data-spine]');
  const LIGHT = new Set(['circles', 'family', 'celebrate', 'visit']);
  let spineKey = '';

  const hero = $('.hero');
  const pimgs = $$('.pillar .arch img');
  onMeasure(() => {
    G.phone = mq.phone.matches; G.stack = mq.stack.matches; G.desk = !mq.tab.matches;
    G.heroH = hero.offsetHeight;
    // phones · the render is only the top 56 percent of the hero so the gold segment makes its lap while the render is still on screen
    G.heroRun = G.phone ? Math.max($('.hero__media').offsetHeight, 1) : G.heroH;
    G.rippleTop = docTop(ripple);
    G.storyTop = docTop(story); G.storyH = story.offsetHeight;
    G.deckTop = docTop(deck); G.deckH = deck.offsetHeight;
    cardStep = cards.length > 1 ? (cards[1].offsetLeft - cards[0].offsetLeft) || 1 : track.clientWidth || 1;
    G.tracked = tracked.map(s => docTop(s));
    G.pillars = pimgs.map(im => { const a = im.parentNode; return { top: docTop(a), h: a.offsetHeight }; });
    G.joinGridTop = docTop($('.join__grid'));
    G.runTop = closeRun ? docTop(closeRun) : 0; G.runH = closeRun ? closeRun.offsetHeight : 0;
    G.closeS = closeEl.offsetHeight;
  });

  // shared reads · the deck position is the only live read (its own horizontal scroll)
  onFrame({ read: () => { if (G.phone) deckK = track.scrollLeft / cardStep; } });

  // spine and deck counter run in every mode
  onFrame({
    write: ({ y, H, docH }) => {
      if (G.desk) {
        set(spineArc, 'strokeDashoffset', (1 - clamp(y / Math.max(docH - H, 1))).toFixed(4));
        let a = 0;
        G.tracked.forEach((t, i) => { if (t - y <= H * .5) a = i; });
        const s = tracked[a];
        const key = s.dataset.spine + (LIGHT.has(s.id) ? 1 : 0) + (a === 0 || s.id === 'join' || s.tagName === 'FOOTER' ? 1 : 0);
        if (key !== spineKey) {
          spineKey = key;
          spineLabel.textContent = s.dataset.spine;
          spine.classList.toggle('is-ink', LIGHT.has(s.id));
          spine.classList.toggle('is-off', a === 0 || s.id === 'join' || s.tagName === 'FOOTER');
        }
      }
      if (G.phone) {
        const i = clamp(Math.round(deckK), 0, N - 1);
        if (i !== deckI) { deckI = i; di.textContent = pad(i + 1); syncVideos(); }
        // the halo dial · reduced motion turns it in whole steps without gliding
        const k = motion ? deckK : deckI;
        const near = G.deckTop - y < H * 1.4 && G.deckTop + G.deckH - y > -H * .4;
        if (!near) return;
        const e = motion ? clamp((y + H * .94 - G.deckTop) / (H * .52)) : 1;
        set(dialSpin, 'transform', `rotate(${(-k * STEP).toFixed(2)}deg)`);
        set(dialTrack, 'strokeDashoffset', (1 - easeOut(e)).toFixed(4));
        set(dialArc, 'strokeDashoffset', (1 - ((k + 1) / N) * smooth(.55, 1, e)).toFixed(4));
        dialZ.forEach((z, i) => {
          const ei = motion ? smooth(i * .045, i * .045 + .55, e) : 1;
          const th = (i - k) * STEP - (1 - ei) * 75;
          const ab = Math.abs(th);
          const s = .84 + .38 * Math.max(0, 1 - ab / STEP);
          const o = (1 - smooth(STEP * 1.05, STEP * 1.55, ab)) * ei;
          set(z, 'transform', `rotate(${th.toFixed(2)}deg) translateY(calc(var(--R) * -1)) rotate(${(-th).toFixed(2)}deg) scale(${s.toFixed(3)})`);
          set(z, 'opacity', o.toFixed(3));
          const on = ab < STEP / 2; const off = o < .2;
          if (z._on !== on) { z._on = on; z.classList.toggle('on', on); }
          if (z._off !== off) { z._off = off; z.classList.toggle('off', off); }
        });
      }
    }
  });

  /* ---------- static mode stops here · everything is already visible ---------- */
  if (!motion) {
    dots.forEach(d => d.classList.add('lit'));
    story.classList.add('is-end');
    return;
  }

  $$('.pillar').forEach((p, i) => { const d = `${i * .16}s`; p.style.setProperty('--d', d); $('.arch--rise', p).style.setProperty('--d', d); });
  $$('.card').forEach(c => $('.arch--rise', c).style.setProperty('--d', '0s'));
  // round 5 fix · the deck cards are built here after core.js started its reveal observer · without this their arches never rose on phones
  if (OZ.io) cards.forEach(c => OZ.io.observe(c)); else cards.forEach(c => c.classList.add('is-in'));

  const vio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.target === orbit) orbitVisible = en.isIntersecting;
      else deckVisible = en.isIntersecting;
    });
    syncVideos();
  }, { threshold: .3 });
  vio.observe(orbit); vio.observe(track);

  /* ================= hero intro ================= */
  const heroBox = $('.hero__box');
  const arcs = $$('.orbit-arc');
  let introT0 = 0;
  const startHero = () => { requestAnimationFrame(() => { hero.classList.add('is-in'); introT0 = performance.now(); keepAlive(3100); }); };
  const heroImg = $('.hero__img');
  if (heroImg.complete) startHero(); else { heroImg.addEventListener('load', startHero, { once: true }); setTimeout(() => { if (!hero.classList.contains('is-in')) startHero(); }, 1400); }

  /* ================= scroll driven frame ================= */
  const rCore = $('.ripple__core', ripple);
  const ANG = [-45, 45, 135, -135];
  let chapter = -1;
  let closed = false;
  let litN = -1;

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

  onFrame({
    write: ({ y, H, docH, now }) => {
      // hero · the bright arc orbits the building as you scroll · slow depth on the render
      if (y < G.heroH * 1.2) {
        const hp = clamp(y / Math.max(G.heroH, 1));
        const intro = introT0 ? easeOut(clamp((now - introT0) / 3000)) : 0;
        const off = (-(150 + intro * 260 + clamp(y / G.heroRun) * 620)).toFixed(1);
        arcs.forEach(a => set(a, 'strokeDashoffset', off));
        set(heroBox, 'transform', `translate3d(0, ${(hp * 9).toFixed(2)}%, 0)`);
      }

      // many circles · four circles drift in from across the city and meet at one core
      const mTop = G.rippleTop - y;
      if (mTop < H * 1.1 && mTop > -H) {
        const mp = clamp((H * .95 - mTop) / (H * .55));
        const me = easeOut(mp);
        const spread = lerp(188, 66, me);
        rcs.forEach(g => {
          // a css transform on the svg group · no svg relayout per frame
          set(g, 'transform', `translate(${(280 + +g.dataset.x * spread).toFixed(1)}px, ${(280 + +g.dataset.y * spread).toFixed(1)}px)`);
          set(g, 'opacity', (.35 + .65 * me).toFixed(3));
        });
        set(rCore, 'transform', `scale(${smooth(.72, 1, mp).toFixed(3)})`);
      }

      // family story · chapter from pinned progress · the orbit arc fills as the family gathers
      const sp = clamp((y - G.storyTop) / Math.max(G.storyH - H, 1));
      set(storyArc, 'strokeDashoffset', (1 - sp).toFixed(4));
      const c = Math.min(CH - 1, Math.floor(sp * CH));
      if (c !== chapter) { chapter = c; layoutStory(c); }

      // building · the render drifts slowly inside each arch
      pimgs.forEach((im, i) => {
        const g = G.pillars[i]; const top = g.top - y;
        if (top + g.h < 0 || top > H) return;
        set(im, 'translate', `0 ${((.5 - (top + g.h / 2) / H) * 6).toFixed(2)}%`);
      });

      // closing orbit · draws with scroll and closes into the core
      // desktop · the ring sticks beside the form · phones and tablets · the ring pins for a short run of its own then lets go
      if (!closed) {
        let cp;
        if (G.stack && G.runH > G.closeS) {
          const T = (H - G.closeS) / 2 + (G.phone ? 64 : 76) / 2;   // the sticky top in css · header plus centred ring
          const start = G.runTop - T - H * .4;
          const end = G.runTop - T + (G.runH - G.closeS) * .62;
          cp = clamp((y - start) / Math.max(end - start, 1));
        } else {
          cp = clamp((H * .95 - (G.joinGridTop - y)) / (H * .45));
        }
        if (y + H >= docH - 4) cp = 1;
        set(closeArc, 'strokeDashoffset', (1 - cp).toFixed(4));
        const n = dots.filter((d, i) => cp >= i / N + .015).length;
        if (n !== litN) { litN = n; dots.forEach((d, i) => d.classList.toggle('lit', i < n)); }
        if (cp >= .999) { closed = true; closeEl.classList.add('is-closed'); }
      }
    }
  });
})();
