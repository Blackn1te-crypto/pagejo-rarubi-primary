/* ============================================================
   MOBILE DRAWER & HAMBURGER MENU
   Pagejo Rarubi Primary School
   Developed by Pardon Katsande (BL@CKN1TE)
   ============================================================ */

(function () {
  'use strict';

  // Inject the drawer CSS dynamically (just in case it's not in drawer.css)
  function injectDrawerStyles() {
    if (document.getElementById('pagejo-drawer-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'pagejo-drawer-styles';
    style.textContent = `
      /* ---- Drawer Overlay ---- */
      .drawer-overlay {
        position: fixed;
        inset: 0;
        background: rgba(11, 43, 30, 0.6);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.35s ease;
      }
      .drawer-overlay.open {
        opacity: 1;
        visibility: visible;
      }

      /* ---- Drawer Panel ---- */
      .drawer {
        position: fixed;
        top: 0;
        right: -320px;
        width: 300px;
        max-width: 85vw;
        height: 100vh;
        background: linear-gradient(180deg, #1e4b3a 0%, #0b2b1e 100%);
        z-index: 1001;
        box-shadow: -10px 0 40px rgba(0,0,0,0.3);
        transition: right 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 0;
      }
      .drawer.open {
        right: 0;
      }

      /* ---- Drawer Header ---- */
      .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 1.5rem;
        border-bottom: 1px solid rgba(212, 163, 115, 0.2);
      }
      .drawer-brand {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        color: #f9e6b3;
        font-family: 'Montserrat', sans-serif;
        font-weight: 800;
        font-size: 1rem;
        letter-spacing: -0.5px;
      }
      .drawer-brand-logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #fff;
        padding: 3px;
        object-fit: contain;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }
      .drawer-close {
        background: rgba(255,255,255,0.1);
        border: none;
        color: #f9e6b3;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      .drawer-close:hover {
        background: rgba(212, 163, 115, 0.3);
        transform: rotate(90deg);
      }

      /* ---- Drawer Links ---- */
      .drawer-nav {
        display: flex;
        flex-direction: column;
        padding: 1rem 0;
        flex: 1;
      }
      .drawer-nav a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 1rem 1.8rem;
        color: rgba(255,255,255,0.85);
        text-decoration: none;
        font-family: 'Montserrat', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.25s ease;
        border-left: 3px solid transparent;
      }
      .drawer-nav a i {
        color: #d4a373;
        width: 20px;
        text-align: center;
        font-size: 1rem;
        transition: all 0.25s ease;
      }
      .drawer-nav a:hover,
      .drawer-nav a.active {
        background: rgba(255,255,255,0.06);
        color: #f9e6b3;
        border-left-color: #d4a373;
        padding-left: 2rem;
      }
      .drawer-nav a:hover i,
      .drawer-nav a.active i {
        color: #f9e6b3;
        transform: translateX(3px);
      }

      /* ---- Drawer Footer ---- */
      .drawer-footer {
        padding: 1.2rem 1.5rem;
        border-top: 1px solid rgba(212, 163, 115, 0.2);
        text-align: center;
        color: rgba(255,255,255,0.5);
        font-size: 0.72rem;
        font-family: 'Open Sans', sans-serif;
      }
      .drawer-footer strong {
        color: #d4a373;
        display: block;
        margin-top: 4px;
        font-size: 0.75rem;
      }

      /* ---- Hamburger Button ---- */
      .hamburger-btn {
        display: none;
        position: relative;
        width: 50px;
        height: 50px;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 999;
        padding: 0;
        margin-left: auto;
      }

      @media (max-width: 1024px) {
        .hamburger-btn {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .navbar {
          display: none !important;
        }
      }

      /* ---- Spinning Rings Logo Wrapper ---- */
      .hamburger-logo-wrap {
        position: relative;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .hamburger-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        border: 2px solid transparent;
        box-sizing: border-box;
      }

      .hamburger-ring.r1 {
        width: 100%;
        height: 100%;
        border-top-color: #d4a373;
        border-right-color: #d4a373;
        animation: hamburgerSpinCW 3s linear infinite;
      }

      .hamburger-ring.r2 {
        width: 85%;
        height: 85%;
        border-bottom-color: #2e7d5e;
        border-left-color: #2e7d5e;
        animation: hamburgerSpinCCW 4s linear infinite;
      }

      .hamburger-logo-img {
        position: relative;
        z-index: 2;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: contain;
        background: #fff;
        padding: 2px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }

      .hamburger-fallback-icon {
        position: relative;
        z-index: 2;
        font-size: 1.2rem;
        color: #1e4b3a;
        background: #fff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      @keyframes hamburgerSpinCW {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(360deg); }
      }
      @keyframes hamburgerSpinCCW {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(-360deg); }
      }

      /* Body lock */
      body.drawer-open {
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
  }

  function buildDrawer() {
    // 1. Check if drawer already exists in HTML
    let drawer = document.getElementById('drawer');
    
    // If not, build it dynamically
    if (!drawer) {
      // Build Overlay
      if (!document.getElementById('drawerOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'drawerOverlay';
        overlay.className = 'drawer-overlay';
        document.body.appendChild(overlay);
      }

      // Build Drawer
      drawer = document.createElement('aside');
      drawer.id = 'drawer';
      drawer.className = 'drawer';
      drawer.setAttribute('aria-hidden', 'true');

      // Header
      const headerHTML = `
        <div class="drawer-header">
          <div class="drawer-brand">
            <img src="images/logo.png" alt="Logo" class="drawer-brand-logo" 
                 onerror="this.style.display='none'; this.parentElement.insertAdjacentHTML('afterbegin', '<i class=\\'fas fa-graduation-cap\\' style=\\'color:#f9e6b3; font-size:1.2rem;\\'></i>');">
            <span>Pagejo Rarubi</span>
          </div>
          <button class="drawer-close" id="drawerClose" aria-label="Close menu">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;

      // Links (copy from navbar)
      const navLinks = document.querySelectorAll('.navbar a');
      let linksHTML = '<nav class="drawer-nav">';
      if (navLinks.length > 0) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href') || '#';
          const isActive = link.classList.contains('active');
          const icon = link.querySelector('i') ? link.querySelector('i').outerHTML : '';
          const text = link.textContent.trim();
          linksHTML += `<a href="${href}" class="${isActive ? 'active' : ''}">
            ${icon} <span>${text}</span>
          </a>`;
        });
      }
      linksHTML += '</nav>';

      // Footer
      const footerHTML = `
        <div class="drawer-footer">
          &copy; ${new Date().getFullYear()} Pagejo Rarubi Primary
          <strong>Knowledge · Integrity · Service</strong>
        </div>
      `;

      drawer.innerHTML = headerHTML + linksHTML + footerHTML;
      document.body.appendChild(drawer);
    }

    // 2. Ensure Hamburger exists
    let hamburger = document.getElementById('hamburgerBtn');
    
    if (!hamburger) {
      hamburger = document.createElement('button');
      hamburger.id = 'hamburgerBtn';
      hamburger.className = 'hamburger-btn';
      hamburger.setAttribute('aria-label', 'Open menu');
      hamburger.setAttribute('aria-expanded', 'false');
      
      hamburger.innerHTML = `
        <div class="hamburger-logo-wrap">
          <span class="hamburger-ring r1"></span>
          <span class="hamburger-ring r2"></span>
          <img src="images/logo.png" alt="Menu" class="hamburger-logo-img" 
               onerror="this.style.display='none'; this.parentElement.insertAdjacentHTML('afterbegin', '<i class=\\'fas fa-bars hamburger-fallback-icon\\'></i>');">
        </div>
      `;

      // Try to attach to header logo area
      const mainHeader = document.getElementById('mainHeader');
      const logoArea = document.querySelector('.logo-area');
      
      if (mainHeader) {
        mainHeader.appendChild(hamburger);
        hamburger.style.marginLeft = 'auto';
      } else if (logoArea) {
        logoArea.appendChild(hamburger);
      } else {
        document.body.appendChild(hamburger);
        hamburger.style.position = 'fixed';
        hamburger.style.top = '15px';
        hamburger.style.right = '15px';
        hamburger.style.background = 'rgba(255,255,255,0.95)';
        hamburger.style.borderRadius = '50%';
        hamburger.style.padding = '3px';
        hamburger.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }
    }
  }

  function setupDrawerEvents() {
    const drawer = document.getElementById('drawer');
    const hamburger = document.getElementById('hamburgerBtn');
    const closeBtn = document.getElementById('drawerClose');
    const overlay = document.getElementById('drawerOverlay');

    if (!drawer || !hamburger) return;

    function openDrawer() {
      drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.classList.add('drawer-open');
      hamburger.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.classList.remove('drawer-open');
      hamburger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }

    // Clean up existing listeners by replacing the button node if needed
    // Wait, replacing the node breaks the spinning rings if they rely on CSS? No, CSS is fine.
    // But it's safer to just add a new listener and remove the old one by cloning if we know it's there.
    // Let's just add the listener directly. If the script is loaded twice, it will double fire.
    // We'll add a data-attribute to prevent double binding.
    if (hamburger.dataset.bound !== 'true') {
      hamburger.dataset.bound = 'true';
      hamburger.addEventListener('click', function (e) {
        e.preventDefault();
        if (drawer.classList.contains('open')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (closeBtn && closeBtn.dataset.bound !== 'true') {
      closeBtn.dataset.bound = 'true';
      closeBtn.addEventListener('click', closeDrawer);
    }

    if (overlay && overlay.dataset.bound !== 'true') {
      overlay.dataset.bound = 'true';
      overlay.addEventListener('click', closeDrawer);
    }

    if (!window._drawerEscBound) {
      window._drawerEscBound = true;
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
          closeDrawer();
        }
      });
    }

    // Bind links to close
    drawer.querySelectorAll('a').forEach(a => {
      if (a.dataset.bound !== 'true') {
        a.dataset.bound = 'true';
        a.addEventListener('click', closeDrawer);
      }
    });
  }

  // Init
  document.addEventListener('DOMContentLoaded', function () {
    injectDrawerStyles();
    buildDrawer();
    setupDrawerEvents();
  });

})();
