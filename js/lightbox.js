/* ============================================================
   IMAGE LIGHTBOX VIEWER
   Developed by Pardon Katsande (BL@CKN1TE)
   ============================================================ */

(function () {
  'use strict';

  let images = [];
  let currentIndex = 0;
  let isOpen = false;

  function injectStyles() {
    if (document.getElementById('lightboxStyles')) return;
    const css = `
      .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.95); backdrop-filter: blur(12px); z-index: 99999; display: none; align-items: center; justify-content: center; padding: 2rem; opacity: 0; transition: opacity 0.3s ease; cursor: zoom-out; }
      .lightbox.open { display: flex; opacity: 1; }
      .lightbox-img { max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.6); cursor: default; user-select: none; }
      .lightbox-btn { position: absolute; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; background: var(--accent, #d4a373); color: var(--primary-dark, #0b2b1e); transition: transform 0.3s ease; z-index: 2; }
      .lightbox-btn:hover { transform: scale(1.1); }
      .lightbox-close { top: 1.5rem; right: 1.5rem; width: 50px; height: 50px; border-radius: 50%; font-size: 1.3rem; }
      .lightbox-nav { top: 50%; transform: translateY(-50%); width: 55px; height: 55px; border-radius: 50%; font-size: 1.2rem; }
      .lightbox-prev { left: 1.5rem; } .lightbox-next { right: 1.5rem; }
      .lightbox-caption { position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); background: var(--primary-dark, rgba(11,43,30,0.9)); color: var(--accent-light, #f9e6b3); padding: 0.7rem 1.5rem; border-radius: 50px; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 0.85rem; max-width: 90%; text-align: center; pointer-events: none; }
      .lightbox-counter { position: absolute; top: 1.5rem; left: 1.5rem; background: var(--accent, #d4a373); color: var(--primary-dark, #0b2b1e); padding: 0.5rem 1rem; border-radius: 50px; font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 0.8rem; }
      img[data-lightbox] { cursor: zoom-in; transition: transform 0.3s ease; }
      img[data-lightbox]:hover { transform: scale(1.02); }
    `;
    const style = document.createElement('style');
    style.id = 'lightboxStyles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createLightbox() {
    if (document.getElementById('lightbox')) return;
    const html = `
      <div class="lightbox" id="lightbox" role="dialog" aria-hidden="true">
        <button class="lightbox-btn lightbox-close" id="lightboxClose" aria-label="Close"><i class="fas fa-times"></i></button>
        <button class="lightbox-btn lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
        <button class="lightbox-btn lightbox-nav lightbox-next" id="lightboxNext" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
        <img class="lightbox-img" id="lightboxImg" src="" alt="" draggable="false">
        <div class="lightbox-caption" id="lightboxCaption"></div>
        <div class="lightbox-counter" id="lightboxCounter"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  function collectImages() {
    const imgs = document.querySelectorAll('img');
    images = [];
    const seen = new Set();
    imgs.forEach(img => {
      if (img.id === 'lightboxImg') return;
      const src = img.getAttribute('src');
      if (!src || src.length < 3) return;
      if (img.naturalWidth && img.naturalWidth < 40) return;
      if (seen.has(src)) return;
      seen.add(src);
      img.setAttribute('data-lightbox', 'true');
      if (!img.dataset.lightboxBound) {
        img.dataset.lightboxBound = 'true';
        img.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const idx = images.findIndex(item => item.element === img);
          if (idx >= 0) openLightbox(idx);
        });
      }
      images.push({ src, alt: img.getAttribute('alt') || '', element: img });
    });
  }

  function openLightbox(index) {
    if (index < 0 || index >= images.length) return;
    currentIndex = index;
    const item = images[index];
    const lightbox = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightboxImg');
    const caption = document.getElementById('lightboxCaption');
    const counter = document.getElementById('lightboxCounter');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    imgEl.src = item.src;
    imgEl.alt = item.alt;

    if (item.alt) {
      caption.textContent = item.alt;
      caption.style.display = 'block';
    } else {
      caption.style.display = 'none';
    }

    if (images.length > 1) {
      counter.textContent = (index + 1) + ' / ' + images.length;
      counter.style.display = 'block';
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    } else {
      counter.style.display = 'none';
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    isOpen = true;
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    isOpen = false;
    setTimeout(() => {
      if (!isOpen) {
        const imgEl = document.getElementById('lightboxImg');
        if (imgEl) imgEl.src = '';
      }
    }, 300);
  }

  function nextImage() {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
  }

  function prevImage() {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
  }

  function initLightbox() {
    injectStyles();
    createLightbox();

    document.getElementById('lightboxClose').addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    document.getElementById('lightboxNext').addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    document.getElementById('lightboxPrev').addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

    document.getElementById('lightbox').addEventListener('click', (e) => {
      if (e.target.id === 'lightbox') closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    let touchStartX = 0;
    const lb = document.getElementById('lightbox');
    lb.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) nextImage();
        else prevImage();
      }
    }, { passive: true });

    collectImages();
    window.addEventListener('load', collectImages);
    window.addEventListener('dataChanged', () => setTimeout(collectImages, 500));
    setTimeout(collectImages, 1000);
    setTimeout(collectImages, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();