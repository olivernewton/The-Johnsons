/* ============================================================
   THE JOHNSON FAMILY WEBSITE — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* === Scroll: nav state === */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* === Mobile nav toggle === */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* === Scroll reveal (Intersection Observer) === */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* === Parallax: scripture section background === */
  const scriptureSection = document.querySelector('.scripture-section');
  const scriptureBg      = document.querySelector('.scripture-bg');
  if (scriptureSection && scriptureBg) {
    window.addEventListener('scroll', () => {
      const rect   = scriptureSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.15;
        scriptureBg.style.transform = `translateY(${offset}px)`;
      }
    }, { passive: true });
  }

  /* === Parallax: page hero background (inner pages) === */
  const pageHero   = document.querySelector('.page-hero');
  const pageHeroBg = document.querySelector('.page-hero-bg');
  if (pageHero && pageHeroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        pageHeroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
      }
    }, { passive: true });
  }

  /* === Magnetic buttons === */
  document.querySelectorAll('.btn-primary, .btn-secondary, .btn-light').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.18;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px, calc(${y}px - 2px))`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* === Animated counters === */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const target   = parseFloat(el.dataset.target);
        const suffix   = el.dataset.suffix || '';
        const duration = 1600;
        const start    = performance.now();

        const tick = (now) => {
          const elapsed  = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const value = target * eased;
          el.textContent = (Number.isInteger(target) ? Math.floor(value) : value.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cObs.observe(c));
  }

  /* === Subtle cursor glow (desktop only) === */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    Object.assign(glow.style, {
      position:       'fixed',
      width:          '320px',
      height:         '320px',
      borderRadius:   '50%',
      background:     'radial-gradient(circle, rgba(192,104,64,0.055) 0%, transparent 68%)',
      pointerEvents:  'none',
      transform:      'translate(-50%, -50%)',
      zIndex:         '0',
      opacity:        '0',
      transition:     'opacity 0.4s ease',
    });
    document.body.appendChild(glow);

    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; glow.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
      cx = lerp(cx, mx, 0.09);
      cy = lerp(cy, my, 0.09);
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* === Hashnode API integration (configure when blogs are live) ===
   *
   * Replace 'YOUR_HASHNODE_USERNAME' with Tyler's or Baleigh's Hashnode username.
   * Posts will automatically populate the .posts-grid via the public GraphQL API.
   *
   * fetch('https://api.hashnode.com/', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({
   *     query: `{
   *       user(username: "YOUR_HASHNODE_USERNAME") {
   *         publication {
   *           posts(page: 0) {
   *             title brief slug coverImage dateAdded
   *           }
   *         }
   *       }
   *     }`
   *   })
   * })
   * .then(r => r.json())
   * .then(data => renderPosts(data.data.user.publication.posts));
   *
   * ======================================================== */

});
