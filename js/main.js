(function () {
  'use strict';

  /* ── Nav scroll behaviour ── */
  const nav = document.getElementById('ubc-nav');
  if (nav) {
    function onScroll() {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('ubc-hamburger');
  const mobileNav = document.getElementById('ubc-mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const open = mobileNav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on backdrop click
    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
    // Close on nav link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active nav link by current page ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.ubc-nav-links a, .ubc-mobile-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Smooth anchor scroll (respects fixed nav height) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Lazy-load images with IntersectionObserver ── */
  if ('IntersectionObserver' in window) {
    const imgObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
        if (img.dataset.srcset) { img.srcset = img.dataset.srcset; delete img.dataset.srcset; }
        imgObs.unobserve(img);
      });
    }, { rootMargin: '200px' });
    document.querySelectorAll('img[data-src]').forEach(function (img) { imgObs.observe(img); });
  }

  /* ── Animate elements on scroll ── */
  if ('IntersectionObserver' in window) {
    const fadeObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-in').forEach(function (el) { fadeObs.observe(el); });
  }

})();
