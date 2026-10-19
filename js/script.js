/* ============================================================
   MAIN JAVASCRIPT
   Pagejo Rarubi Primary School
   Developed by Pardon Katsande (BL@CKN1TE)
   ============================================================ */

(function () {
  'use strict';

  let observer = null;
  let typingTimeout = null;

  /* ============================================================
     TYPING ANIMATION MESSAGES
     First message is overridden by admin's Hero Title if set.
     ============================================================ */
  window.TYPING_MESSAGES = [
    'Welcome to Pagejo Rarubi Primary School',
    'Excellence in Education Since 1998',
    'A Heritage-Driven Education',
    'Knowledge · Integrity · Service'
  ];

  /* ============================================================
     SCROLL ANIMATIONS
     ============================================================ */
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

  /* ============================================================
     TYPING ANIMATION
     ============================================================ */
  function typeWriter(el, text, speed, callback) {
    let i = 0;
    el.textContent = '';

    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        typingTimeout = setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  function deleteWriter(el, speed, callback) {
    function del() {
      const text = el.textContent;
      if (text.length > 0) {
        el.textContent = text.substring(0, text.length - 1);
        typingTimeout = setTimeout(del, speed);
      } else if (callback) {
        callback();
      }
    }
    del();
  }

  function startTypingLoop() {
    const el = document.getElementById('typingText');
    if (!el) return;

    // Reset any previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }

    let messageIndex = 0;

    function nextMessage() {
      const messages = window.TYPING_MESSAGES || [];
      if (!messages.length) return;

      const message = messages[messageIndex % messages.length];
      const typeSpeed = 55;
      const deleteSpeed = 25;
      const holdTime = 2200;

      typeWriter(el, message, typeSpeed, () => {
        typingTimeout = setTimeout(() => {
          deleteWriter(el, deleteSpeed, () => {
            messageIndex++;
            typingTimeout = setTimeout(nextMessage, 400);
          });
        }, holdTime);
      });
    }

    nextMessage();
  }

  function stopTyping() {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
    const el = document.getElementById('typingText');
    if (el) el.textContent = '';
  }

  /* ============================================================
     STICKY HEADER
     ============================================================ */
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

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    const onScroll = () => {
      if (window.scrollY > 500) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    backToTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
    onScroll();
  }

  /* ============================================================
     NAV HIGHLIGHTING
     ============================================================ */
  function highlightCurrentNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar a, .drawer-nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const cleanHref = href.split('#')[0].split('?')[0];
      link.classList.remove('active');

      if (
        cleanHref === path ||
        (path === '' && cleanHref === 'index.html') ||
        (path === 'index.html' && cleanHref === 'index.html')
      ) {
        link.classList.add('active');
      }
    });
  }

  /* ============================================================
     SMOOTH SCROLL FOR HASH LINKS
     ============================================================ */
  function setupSmoothHashScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 100;
      const targetY =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  }

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (isNaN(target)) return;

    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function setupCounters() {
    const counters = document.querySelectorAll('[data-count]:not([data-counted])');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(el => {
        el.setAttribute('data-counted', 'true');
        animateCounter(el);
      });
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-counted', 'true');
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => io.observe(c));
  }

  /* ============================================================
     THEME FALLBACK
     ============================================================ */
  function ensureThemeFallback() {
    const root = document.documentElement;
    const fallbacks = {
      '--primary-dark':  '#0b2b1e',
      '--primary':       '#1e4b3a',
      '--primary-light': '#2e7d5e',
      '--accent':        '#d4a373',
      '--accent-light':  '#f9e6b3'
    };
    for (const [key, value] of Object.entries(fallbacks)) {
      const current = getComputedStyle(root).getPropertyValue(key).trim();
      if (!current) root.style.setProperty(key, value);
    }
  }

  /* ============================================================
     APPLY THEME (reads from CMS data in localStorage)
     ============================================================ */
  window.applyTheme = function () {
    try {
      let cmsData = null;
      const v2 = localStorage.getItem('pagejo_rarubi_cms_data_v2');
      const v1 = localStorage.getItem('pagejo_rarubi_cms_data');
      if (v2) cmsData = JSON.parse(v2);
      else if (v1) cmsData = JSON.parse(v1);

      if (!cmsData) return;

      const theme = cmsData.theme || cmsData.colors;
      if (theme && typeof theme === 'object') {
        const map = {
          primary:      theme.primary,
          primaryDark:  theme.primaryDark || theme['primary-dark'],
          primaryLight: theme.primaryLight || theme['primary-light'],
          accent:       theme.accent,
          accentLight:  theme.accentLight || theme['accent-light']
        };
        const root = document.documentElement;
        if (map.primary)      root.style.setProperty('--primary', map.primary);
        if (map.primaryDark)  root.style.setProperty('--primary-dark', map.primaryDark);
        if (map.primaryLight) root.style.setProperty('--primary-light', map.primaryLight);
        if (map.accent)       root.style.setProperty('--accent', map.accent);
        if (map.accentLight)  root.style.setProperty('--accent-light', map.accentLight);
      }
    } catch (err) {
      console.warn('Theme apply skipped:', err);
    }
  };

  /* ============================================================
     AUTO-UPDATE YEAR
     ============================================================ */
  function updateYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ============================================================
     MOBILE DRAWER / HAMBURGER MENU
     ============================================================ */
  function setupDrawer() {
    const drawer = document.getElementById('drawer');
    const hamburger = document.getElementById('hamburgerBtn');
    const closeBtn = document.getElementById('drawerClose');
    const overlay = document.getElementById('drawerOverlay');

    if (!hamburger) return;

    function openDrawer() {
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.classList.add('drawer-open');
      hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.classList.remove('drawer-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function (e) {
      e.preventDefault();
      if (drawer && drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Close drawer when a link inside is clicked
    if (drawer) {
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeDrawer);
      });
    }
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    setupScrollAnimations();
    setupStickyHeader();
    setupBackToTop();
    highlightCurrentNav();
    setupSmoothHashScroll();
    setupCounters();
    setupDrawer();
    updateYear();
    window.applyTheme();
    startTypingLoop();
  });

  /* Re-run animations after CMS updates */
  window.addEventListener('dataChanged', function () {
    setTimeout(function () {
      setupScrollAnimations();
      highlightCurrentNav();
      setupCounters();
      // Restart typing in case hero title changed
      stopTyping();
      startTypingLoop();
    }, 80);
  });

  /* Re-apply theme if another tab changed it */
  window.addEventListener('storage', function (e) {
    if (
      e.key === 'pagejo_rarubi_cms_data' ||
      e.key === 'pagejo_rarubi_cms_data_v2'
    ) {
      if (typeof window.applyTheme === 'function') window.applyTheme();
    }
  });

  /* Safety net */
  window.addEventListener('load', ensureThemeFallback);

  /* Expose for admin to trigger */
  window.__restartTyping = function () {
    stopTyping();
    startTypingLoop();
  };

  /* ============================================================
     BRANDING LOGS
     ============================================================ */
  console.log(
    '%c Pagejo Rarubi Primary School ',
    'background: #1e4b3a; color: #f9e6b3; font-size: 18px; font-weight: bold; padding: 8px; border-radius: 8px;'
  );
  console.log(
    '%c Developed by Pardon Katsande (BL@CKN1TE) ',
    'background: #d4a373; color: #0b2b1e; font-size: 12px; font-weight: bold; padding: 5px; border-radius: 8px;'
  );
})();
