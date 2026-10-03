/* ============================================================
   MAIN JAVASCRIPT
   Pagejo Rarubi Primary School
   Developed by Pardon Katsande (BL@CKN1TE)
   ============================================================ */

(function () {
  'use strict';

  let observer = null;

  function setupScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }
    if (observer) observer.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    elements.forEach(el => {
      if (!el.classList.contains('visible')) observer.observe(el);
    });
  }

  function setupStickyHeader() {
    const mainHeader = document.getElementById('mainHeader');
    if (!mainHeader) return;
    const onScroll = () => {
      if (window.scrollY > 50) mainHeader.classList.add('scrolled');
      else mainHeader.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    const onScroll = () => {
      if (window.scrollY > 500) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
  }

  function highlightCurrentNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar a, .drawer-nav a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.split('#')[0].split('?')[0];
      link.classList.remove('active');
      if (cleanHref === path || (path === '' && cleanHref === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupScrollAnimations();
    setupStickyHeader();
    setupBackToTop();
    highlightCurrentNav();
  });

  window.addEventListener('dataChanged', function () {
    setTimeout(function () {
      setupScrollAnimations();
      highlightCurrentNav();
    }, 60);
  });

  window.addEventListener('storage', function (e) {
    if (e.key === 'pagejo_rarubi_cms_data' && typeof window.applyTheme === 'function') {
      window.applyTheme();
    }
  });

  console.log('%c Pagejo Rarubi Primary School ', 'background: #1e4b3a; color: #f9e6b3; font-size: 18px; font-weight: bold; padding: 8px; border-radius: 8px;');
  console.log('%c Developed by Pardon Katsande (BL@CKN1TE) ', 'background: #d4a373; color: #0b2b1e; font-size: 12px; font-weight: bold; padding: 5px; border-radius: 8px;');
})();