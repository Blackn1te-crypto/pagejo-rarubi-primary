/* ============================================================
   MAIN JAVASCRIPT & INLINE EDITING ENGINE
   Pagejo Rarubi Primary School
   Developed by Pardon Katsande (BL@CKN1TE)
   ============================================================ */

(function () {
  'use strict';

  let observer = null;
  let typingTimeout = null;
  const EDIT_PREFIX = 'pagejo_live_edit_v3_'; // Fresh cache namespace

  /* ============================================================
     TYPING ANIMATION MESSAGES
     ============================================================ */
  window.TYPING_MESSAGES = [
    'Welcome to Pagejo Rarubi Primary School',
    'Excellence in Education Since 1998',
    'A Heritage-Driven Education',
    'Knowledge · Integrity · Service'
  ];

  /* ============================================================
     INLINE EDITING ENGINE
     ============================================================ */
  
  // Create and manage the toast notification
  let bannerTimer = null;
  function showToast(msg) {
    let banner = document.getElementById('saveBanner');
    
    // If the HTML doesn't have a banner, create one dynamically
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'saveBanner';
      banner.className = 'edit-save-banner';
      banner.setAttribute('aria-live', 'polite');
      banner.innerHTML = '<i class="fas fa-check-circle"></i> <span id="saveBannerText"></span>';
      document.body.appendChild(banner);
    }

    const textSpan = banner.querySelector('#saveBannerText') || banner;
    if (textSpan !== banner) textSpan.textContent = msg;
    else banner.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;

    banner.classList.add('show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => {
      banner.classList.remove('show');
    }, 2500);
  }

  // Save to localStorage
  function saveEdit(key, value) {
    try {
      localStorage.setItem(EDIT_PREFIX + key, value);
      return true;
    } catch (e) {
      console.error('Storage failed', e);
      showToast('Error: Could not save changes');
      return false;
    }
  }

  // Restore all saved edits on page load
  function restoreEdits() {
    const nodes = document.querySelectorAll('[data-edit-key]');
    nodes.forEach(node => {
      const key = node.getAttribute('data-edit-key');
      if (!key) return;
      
      const savedValue = localStorage.getItem(EDIT_PREFIX + key);
      if (savedValue !== null) {
        if (node.classList.contains('number') && node.hasAttribute('data-count')) {
          node.textContent = savedValue;
          node.setAttribute('data-counted', 'true'); // Prevent from re-animating
        } else {
          node.innerHTML = savedValue;
        }
      }
    });
  }

  // Setup toggles and listeners
  function setupEditEngine() {
    // 1. Restore any previously saved edits
    restoreEdits();

    // 2. Initialize input listeners for all editable nodes
    const editableNodes = document.querySelectorAll('[data-edit-key]');
    editableNodes.forEach(node => {
      const key = node.getAttribute('data-edit-key');
      
      // Auto-save on blur
      node.addEventListener('blur', function() {
        if (this.getAttribute('contenteditable') === 'true') {
          saveEdit(key, this.innerHTML);
        }
      });

      // Auto-save on typing (debounced to prevent spamming storage)
      let debounce;
      node.addEventListener('input', function() {
        if (this.getAttribute('contenteditable') !== 'true') return;
        clearTimeout(debounce);
        const self = this;
        debounce = setTimeout(() => {
          saveEdit(key, self.innerHTML);
        }, 600);
      });
    });

    // 3. Bind all Edit buttons using data-target
    const editButtons = document.querySelectorAll('.edit-toggle-btn');
    editButtons.forEach(btn => {
      if (btn.dataset.editBound === 'true') return;
      btn.dataset.editBound = 'true';

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('data-target');
        if (!targetId) return;

        const section = document.getElementById(targetId);
        if (!section) return;

        const editables = section.querySelectorAll('[data-edit-key]');
        if (!editables.length) return;

        // Check current state
        const isEditing = editables[0].getAttribute('contenteditable') === 'true';
        const newState = isEditing ? 'false' : 'true';

        // Apply new state
        editables.forEach(el => {
          el.setAttribute('contenteditable', newState);
        });

        // Update button UI and trigger actions
        if (newState === 'true') {
          // Entering Edit Mode
          this.innerHTML = '<i class="fas fa-save"></i> Save Changes';
          this.classList.add('is-saving');
          if (editables[0]) editables[0].focus();
          showToast('Editing enabled. Tap Save when done.');
        } else {
          // Saving Mode
          let savedCount = 0;
          editables.forEach(el => {
            const key = el.getAttribute('data-edit-key');
            if (key && saveEdit(key, el.innerHTML)) savedCount++;
          });
          this.innerHTML = '<i class="fas fa-pen"></i> Edit';
          this.classList.remove('is-saving');
          showToast(`Saved ${savedCount} field${savedCount === 1 ? '' : 's'} ✓`);
          
          // Trigger custom event for other scripts (like typing animation)
          window.dispatchEvent(new Event('dataChanged'));
        }
      });
    });
  }

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
     STICKY HEADER & NAVIGATION
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
     BACK TO TOP & SMOOTH SCROLL
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
      const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
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
     THEME FALLBACK & APPLY
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
     MOBILE DRAWER
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
    // Core UI
    setupScrollAnimations();
    setupStickyHeader();
    setupBackToTop();
    highlightCurrentNav();
    setupSmoothHashScroll();
    setupCounters();
    setupDrawer();
    updateYear();
    window.applyTheme();

    // Animations
    startTypingLoop();

    // INLINE EDITING ENGINE
    setupEditEngine();
  });

  /* Re-run animations after edits are saved */
  window.addEventListener('dataChanged', function () {
    setTimeout(function () {
      setupScrollAnimations();
      highlightCurrentNav();
      setupCounters();
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

  /* Expose for admin */
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
