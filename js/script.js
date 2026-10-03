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
     AUTO-UPDATE YEAR
     ============================================================ */
  function updateYear() {
    const el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
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
    updateYear();
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
