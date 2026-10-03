/* ============================================================
   NAVIGATION DRAWER
   Developed by Pardon Katsande (BL@CKN1TE)
   ============================================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // Create hamburger button if it doesn't exist
    if (!document.querySelector('.hamburger-btn')) {
      const btn = document.createElement('button');
      btn.className = 'hamburger-btn';
      btn.innerHTML = '<i class="fas fa-bars"></i>';
      btn.setAttribute('aria-label', 'Open navigation menu');
      document.body.appendChild(btn);
    }

    // Create drawer if it doesn't exist
    if (!document.getElementById('navDrawer')) {
      const drawerHTML = `
        <div class="drawer-overlay" id="drawerOverlay"></div>
        <aside class="drawer" id="navDrawer" aria-hidden="true">
          <div class="drawer-header">
            <div class="drawer-brand">
              <img src="images/logo.png" alt="Logo" style="width:48px;height:48px;object-fit:contain;" onerror="this.style.display='none';">
              <div class="drawer-brand-text">
                <h3>Pagejo Rarubi</h3>
                <span>Primary School</span>
              </div>
            </div>
            <button class="drawer-close" id="drawerClose" aria-label="Close menu">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <nav class="drawer-nav">
            <div class="drawer-section-title">Main Menu</div>
            <a href="index.html"><i class="fas fa-home"></i> Home</a>
            <a href="about.html"><i class="fas fa-users"></i> About Us</a>
            <a href="academics.html"><i class="fas fa-book-open"></i> Academics</a>
            <a href="results.html"><i class="fas fa-chart-line"></i> Results</a>
            <a href="projects.html"><i class="fas fa-seedling"></i> Projects</a>
            <a href="gallery.html"><i class="fas fa-images"></i> Gallery</a>
            <a href="contact.html"><i class="fas fa-address-card"></i> Contact</a>
          </nav>
          <div class="drawer-admin">
            <a href="admin.html" class="drawer-admin-btn">
              <i class="fas fa-shield-alt"></i> Admin Panel
            </a>
          </div>
          <div class="drawer-developer">
            Developed by <strong>Pardon Katsande</strong><br>aka BL@CKN1TE
          </div>
        </aside>
      `;
      document.body.insertAdjacentHTML('beforeend', drawerHTML);
    }

    const hamburger = document.querySelector('.hamburger-btn');
    const drawer = document.getElementById('navDrawer');
    const overlay = document.getElementById('drawerOverlay');
    const closeBtn = document.getElementById('drawerClose');

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
  });
})();