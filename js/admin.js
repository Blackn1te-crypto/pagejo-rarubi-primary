/* ============================================================
   FULL CMS ADMIN SYSTEM
   Developed by Pardon Katsande (BL@CKN1TE)
   ============================================================ */

const ADMIN_KEY = 'pagejorarubiprischadmin';
const DATA_KEY  = 'pagejo_rarubi_cms_data_v2';
const SESSION_KEY = 'pagejo_admin_session';

/* ============================================================
   DEFAULT DATA
   ============================================================ */
const DEFAULT_DATA = {
  school: {
    name: 'Pagejo Rarubi',
    fullName: 'Pagejo Rarubi Primary School',
    tagline: 'Primary School',
    motto: 'Knowledge · Integrity · Service',
    established: '1998',
    phone: '0781521551',
    headPhone: '0714168885',
    email: 'pagejorarubiprisch@gmail.com',
    address: 'P.O. Box CH 202, Chisipite, Ward 13, Goromonzi District'
  },

  hero: {
    badge: 'Excellence in Education',
    title: 'Welcome to Pagejo Rarubi Primary School',
    subtitle: 'A heritage-driven education for a society where life skills, God-given talents, and character building are nurtured.',
    stats: [
      { number: '25+', label: 'Years of Excellence' },
      { number: '446', label: 'Happy Learners' },
      { number: '13',  label: 'Dedicated Staff' },
      { number: '80%', label: 'Pass Rate' }
    ]
  },

  welcome: {
    title: 'Welcome to Our School Family',
    paragraph1: 'At Pagejo Rarubi Primary School, we believe every child is a unique gift with boundless potential. Our dedicated team of educators works tirelessly to nurture not just academic excellence, but also strong moral values, life skills, and God-given talents.',
    paragraph2: 'We are guided by our Vision 2030 — towards a prosperous upper middle-income society — and our mission to provide a heritage-driven education where character building is paramount.',
    quote: '"In Pursuit of Excellence for Holistic Development"'
  },

  results: {
    grade7: {
      title: 'Grade 7 Examination Results',
      year: '2024',
      passRate: 80,
      students: [
        { name: 'Tendai Moyo',    english: 85, maths: 90, science: 88, shona: 82, social: 86 },
        { name: 'Rudo Chikafu',   english: 78, maths: 82, science: 80, shona: 88, social: 84 },
        { name: 'Tafadzwa Ncube', english: 92, maths: 95, science: 91, shona: 89, social: 93 },
        { name: 'Nyasha Dube',    english: 70, maths: 75, science: 72, shona: 80, social: 78 },
        { name: 'Chipo Mutasa',   english: 88, maths: 84, science: 86, shona: 90, social: 87 }
      ]
    }
  },

  staff: [
    { position: 'SCHOOL HEAD',    name: 'HORIRO R.',       phone: '+263 714 168 885', category: 'head' },
    { position: 'DEPUTY HEAD',    name: 'CHIBWE C.',       phone: '+263 785 028 599', category: 'deputy' },
    { position: 'T.I.C',          name: 'MUZHIZHIZHI P.',  phone: '+263 779 762 195', category: 'tic' },
    { position: 'SENIOR TEACHER', name: 'DEHWA N.',        phone: '+263 772 382 569', category: 'senior' },
    { position: 'SENIOR TEACHER', name: 'MATINYARARE J.',  phone: '+263 773 162 854', category: 'senior' },
    { position: 'TEACHER',        name: 'MOYO T.',         phone: '+263 771 000 001', category: 'senior' },
    { position: 'TEACHER',        name: 'NCUBE S.',        phone: '+263 771 000 002', category: 'senior' },
    { position: 'TEACHER',        name: 'DUBE M.',         phone: '+263 771 000 003', category: 'senior' },
    { position: 'TEACHER',        name: 'SIBANDA L.',      phone: '+263 771 000 004', category: 'senior' },
    { position: 'TEACHER',        name: 'CHIRWA K.',       phone: '+263 771 000 005', category: 'senior' },
    { position: 'TEACHER',        name: 'MUTARE B.',       phone: '+263 771 000 006', category: 'senior' },
    { position: 'TEACHER',        name: 'GONDO P.',        phone: '+263 771 000 007', category: 'senior' },
    { position: 'TEACHER',        name: 'MLAMBO R.',       phone: '+263 771 000 008', category: 'senior' }
  ],

  photos: {
    logo: 'images/logo.png',
    headHoriro: 'images/head-horiro.jpg',
    deputyChibwe: 'images/deputy-chibwe.jpg',
    prefects: 'images/prefects.jpg',
    uniform: 'images/uniform.jpg',
    peUniform: 'images/pe-uniform.jpg',
    mushroom: 'images/mushroom.jpg',
    pumpkin: 'images/pumpkin.jpg',
    roadrunners: 'images/roadrunners.jpg'
  },

  announcements: [
    { id: 1, title: 'Term 2 Enrollment Now Open', date: '2025-05-01', content: 'Enrollment for Term 2 is now open. Please visit the school office with the required documents.' },
    { id: 2, title: 'Prize Giving Day',           date: '2025-06-15', content: 'Annual Prize Giving Day will be held on 15 June 2025. All parents are invited.' }
  ],

  updates: [
    { id: 1, title: 'New School Uniform Launched', date: '2025-04-10', content: 'We are excited to announce the launch of our new school uniform.' }
  ],

  theme: {
    primaryDark:    '#0b2b1e',
    primary:        '#1e4b3a',
    primaryLight:   '#2e7d5e',
    accent:         '#d4a373',
    accentLight:    '#f9e6b3',
    bgGradientTop:  '#f8faf9',
    bgGradientMid:  '#eaf5ef',
    bgGradientBot:  '#d0e8dc',
    textDark:       '#1a1a1a'
  },

  sections: {
    hero: true,
    welcome: true,
    quickLinks: true,
    whyChooseUs: true,
    projects: true,
    cta: true
  }
};

/* ============================================================
   DATA MANAGEMENT
   ============================================================ */
function getData() {
  try {
    const stored = localStorage.getItem(DATA_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), parsed);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('dataChanged'));
  } catch (e) {
    console.error('Failed to save data:', e);
    alert('⚠️ Could not save. Your browser storage may be full or blocked.');
  }
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

function resetData() {
  localStorage.removeItem(DATA_KEY);
  window.dispatchEvent(new CustomEvent('dataChanged'));
}

/* ============================================================
   AUTH
   ============================================================ */
function isLoggedIn() { return sessionStorage.getItem(SESSION_KEY) === 'yes'; }
function login(key) {
  if (key === ADMIN_KEY) { sessionStorage.setItem(SESSION_KEY, 'yes'); return true; }
  return false;
}
function logout() { sessionStorage.removeItem(SESSION_KEY); }

/* ============================================================
   RESULT CALCULATIONS
   ============================================================ */
function calcPassRate(students) {
  if (!students || students.length === 0) return 0;
  const passed = students.filter(s => {
    const avg = (s.english + s.maths + s.science + s.shona + s.social) / 5;
    return avg >= 50;
  }).length;
  return Math.round((passed / students.length) * 100);
}

/* ============================================================
   RENDER PUBLIC RESULTS TABLE
   ============================================================ */
function renderPublicResults() {
  const tbody  = document.getElementById('resultsBody');
  const footer = document.getElementById('resultsFooter');
  if (!tbody) return;

  const data = getData();
  const students = data.results.grade7.students;
  tbody.innerHTML = '';

  if (!students || students.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; padding:2rem; color:#6b7d75;">No results available yet.</td></tr>';
    if (footer) footer.innerHTML = '<i class="fas fa-info-circle"></i> No results published yet';
    return;
  }

  students.forEach((s, i) => {
    const avg = Math.round((s.english + s.maths + s.science + s.shona + s.social) / 5);
    const passed = avg >= 50;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td style="text-align:left; font-weight:800;">${s.name}</td>
      <td>${s.english}</td>
      <td>${s.maths}</td>
      <td>${s.science}</td>
      <td>${s.shona}</td>
      <td>${s.social}</td>
      <td><strong>${avg}%</strong></td>
      <td style="color:${passed ? '#2e7d32' : '#d32f2f'}; font-weight:800;">
        ${passed ? '<i class="fas fa-check-circle"></i> Pass' : '<i class="fas fa-times-circle"></i> Fail'}
      </td>`;
    tbody.appendChild(row);
  });

  const passRate = calcPassRate(students);
  if (footer) footer.innerHTML = `<i class="fas fa-info-circle"></i> Pass Rate: ${passRate}% · ${data.results.grade7.year}`;

  const avgRateEl = document.getElementById('avgPassRate');
  if (avgRateEl) avgRateEl.textContent = passRate + '%';
}

/* ============================================================
   APPLY THEME
   ============================================================ */
function applyTheme() {
  const data = getData();
  const t = data.theme || DEFAULT_DATA.theme;
  const root = document.documentElement;
  root.style.setProperty('--primary-dark',  t.primaryDark);
  root.style.setProperty('--primary',       t.primary);
  root.style.setProperty('--primary-light', t.primaryLight);
  root.style.setProperty('--accent',        t.accent);
  root.style.setProperty('--accent-light',  t.accentLight);
  root.style.setProperty('--bg-grad-top',   t.bgGradientTop);
  root.style.setProperty('--bg-grad-mid',   t.bgGradientMid);
  root.style.setProperty('--bg-grad-bot',   t.bgGradientBot);
  root.style.setProperty('--text-dark',     t.textDark);
}

/* ============================================================
   APPLY ALL DYNAMIC CONTENT
   ============================================================ */
function applyContent() {
  const data = getData();

  applyTheme();

  /* ============================================================
     TOP BAR
     ============================================================ */
  const topBar = document.querySelector('.top-bar .contact-info');
  if (topBar) {
    topBar.innerHTML = `
      <span><i class="fas fa-phone-alt"></i> School: ${data.school.phone}</span>
      <span><i class="fas fa-phone-alt"></i> Head: ${data.school.headPhone}</span>
      <span><i class="fas fa-envelope"></i> ${data.school.email}</span>
    `;
  }

  const mottoEls = document.querySelectorAll('.motto');
  mottoEls.forEach(el => el.innerHTML = '<i class="fas fa-star"></i> ' + data.school.motto);

  /* ============================================================
     HEADER
     ============================================================ */
  const schoolNameEls = document.querySelectorAll('.school-name h1');
  schoolNameEls.forEach(el => el.textContent = data.school.name);

  const subheadEls = document.querySelectorAll('.school-name .subhead');
  subheadEls.forEach(el => el.innerHTML = '<i class="fas fa-graduation-cap"></i> ' + data.school.tagline);

  const badgeEls = document.querySelectorAll('.header-badge');
  badgeEls.forEach(el => el.innerHTML = '<i class="fas fa-calendar-alt"></i> Est. ' + data.school.established);

  /* ============================================================
     HERO BADGE
     ============================================================ */
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) heroBadge.innerHTML = '<i class="fas fa-award"></i> ' + data.hero.badge;

  /* HERO TITLE — update typing messages with admin's title */
  if (window.TYPING_MESSAGES && data.hero.title) {
    window.TYPING_MESSAGES[0] = data.hero.title;
  }

  const heroSubtitle = document.querySelector('.hero p');
  if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;

  /* HERO STATS — with data-count so counters animate */
  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer && data.hero.stats) {
    statsContainer.innerHTML = data.hero.stats.map(s => {
      const match = String(s.number).match(/^(\d+)(.*)$/);
      const count = match ? match[1] : '';
      const suffix = match ? match[2] : '';
      return `
        <div class="hero-stat animate-on-scroll">
          <div class="number"${count ? ` data-count="${count}" data-suffix="${suffix}"` : ''}>${s.number}</div>
          <div class="label">${s.label}</div>
        </div>
      `;
    }).join('');

    setTimeout(() => {
      if (typeof window.__rebuildCounters === 'function') {
        window.__rebuildCounters();
      }
    }, 100);
  }

  /* ============================================================
     WELCOME
     ============================================================ */
  const welcomeTitle = document.querySelector('.welcome-text h3');
  if (welcomeTitle) welcomeTitle.textContent = data.welcome.title;

  const welcomeParas = document.querySelectorAll('.welcome-text p');
  if (welcomeParas[0]) welcomeParas[0].textContent = data.welcome.paragraph1;
  if (welcomeParas[1]) welcomeParas[1].textContent = data.welcome.paragraph2;
  const welcomeQuote = document.querySelector('.welcome-text em');
  if (welcomeQuote) welcomeQuote.textContent = data.welcome.quote;

  /* ============================================================
     PHOTOS
     ============================================================ */
  const photoMap = {
    'images/head-horiro.jpg':   data.photos.headHoriro,
    'images/deputy-chibwe.jpg': data.photos.deputyChibwe,
    'images/prefects.jpg':      data.photos.prefects,
    'images/uniform.jpg':       data.photos.uniform,
    'images/pe-uniform.jpg':    data.photos.peUniform,
    'images/mushroom.jpg':      data.photos.mushroom,
    'images/pumpkin.jpg':       data.photos.pumpkin,
    'images/roadrunners.jpg':   data.photos.roadrunners,
    'images/logo.png':          data.photos.logo
  };
  document.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (photoMap[src] && photoMap[src] !== src) {
      img.setAttribute('src', photoMap[src]);
    }
  });

  /* ============================================================
     FOOTER
     ============================================================ */
  const footerBottom = document.querySelectorAll('.footer-bottom p');
  if (footerBottom[1]) {
    footerBottom[1].innerHTML = `<i class="fas fa-envelope"></i> ${data.school.email} &nbsp; | &nbsp; <i class="fas fa-phone"></i> ${data.school.phone} / ${data.school.headPhone}`;
  }

  /* ============================================================
     CONTACT PAGE — Contact Cards
     ============================================================ */
  const contactSchoolPhone = document.getElementById('contactSchoolPhone');
  if (contactSchoolPhone) {
    contactSchoolPhone.href = 'tel:' + data.school.phone.replace(/\s/g, '');
    contactSchoolPhone.textContent = data.school.phone;
  }

  const contactHeadPhone = document.getElementById('contactHeadPhone');
  if (contactHeadPhone) {
    contactHeadPhone.href = 'tel:' + data.school.headPhone.replace(/\s/g, '');
    contactHeadPhone.textContent = data.school.headPhone;
  }

  const contactEmail = document.getElementById('contactEmail');
  if (contactEmail) {
    contactEmail.href = 'mailto:' + data.school.email;
    contactEmail.textContent = data.school.email;
  }

  const contactAddress = document.getElementById('contactAddress');
  if (contactAddress) {
    // Format: "P.O. Box CH 202, Chisipite, Ward 13, Goromonzi District"
    const parts = data.school.address.split(',').map(p => p.trim());
    if (parts.length >= 2) {
      const first = parts.slice(0, parts.length - 1).join(', ');
      const last = parts[parts.length - 1];
      contactAddress.innerHTML = `${first}<br>${last}`;
    } else {
      contactAddress.textContent = data.school.address;
    }
  }

  /* ============================================================
     CONTACT PAGE — School Database Table
     ============================================================ */
  const dbSchoolPhone = document.getElementById('dbSchoolPhone');
  if (dbSchoolPhone) {
    dbSchoolPhone.href = 'tel:' + data.school.phone.replace(/\s/g, '');
    dbSchoolPhone.textContent = data.school.phone;
  }

  const dbHeadPhone = document.getElementById('dbHeadPhone');
  if (dbHeadPhone) {
    dbHeadPhone.href = 'tel:' + data.school.headPhone.replace(/\s/g, '');
    dbHeadPhone.textContent = data.school.headPhone;
  }

  const dbEmail = document.getElementById('dbEmail');
  if (dbEmail) {
    dbEmail.href = 'mailto:' + data.school.email;
    dbEmail.textContent = data.school.email;
  }

  const dbAddress = document.getElementById('dbAddress');
  if (dbAddress) {
    // Format: "P.O. Box CH 202, Chisipite, Ward 13, Goromonzi District"
    const parts = data.school.address.split(',').map(p => p.trim());
    const lines = [
      'PAGEJO RARUBI PRIMARY SCHOOL',
      parts[0] ? parts[0].toUpperCase() : '',
      parts[1] ? parts[1].toUpperCase() : ''
    ].filter(Boolean);
    dbAddress.innerHTML = lines.join('<br>');
  }

  const dbLocation = document.getElementById('dbLocation');
  if (dbLocation) {
    const parts = data.school.address.split(',').map(p => p.trim());
    const ward = parts.find(p => p.toLowerCase().includes('ward')) || 'Ward 13, Goromonzi District';
    dbLocation.innerHTML = `PAGEJO RARUBI FARM @ 32KM PEG MUTOKO ROAD<br>${ward.toUpperCase()}`;
  }

  /* ============================================================
     CONTACT PAGE — Enrollment Fees Phone
     ============================================================ */
  const enrollPhone = document.getElementById('enrollPhone');
  if (enrollPhone) {
    enrollPhone.href = 'tel:' + data.school.phone.replace(/\s/g, '');
    enrollPhone.textContent = data.school.phone;
  }

  /* ============================================================
     STAFF DIRECTORY
     ============================================================ */
  const staffTable = document.querySelector('.admin-table tbody');
  if (staffTable && data.staff) {
    staffTable.innerHTML = data.staff.map(s => `
      <tr>
        <td class="position-${s.category}">${s.position}</td>
        <td>${s.name}</td>
        <td><a href="tel:${s.phone.replace(/\s/g, '')}" class="contact-link"><i class="fas fa-phone"></i> ${s.phone}</a></td>
      </tr>
    `).join('');
  }

  /* ============================================================
     ANNOUNCEMENTS
     ============================================================ */
  const annContainer = document.getElementById('announcementsContainer');
  if (annContainer && data.announcements) {
    if (data.announcements.length === 0) {
      annContainer.innerHTML = '<p style="color:#6b7d75; text-align:center; padding:1rem;">No announcements at this time.</p>';
    } else {
      annContainer.innerHTML = data.announcements.map(a => `
        <div class="item-card animate-on-scroll">
          <div class="item-card-content">
            <span class="item-date"><i class="far fa-calendar"></i> ${a.date}</span>
            <h4>${a.title}</h4>
            <p>${a.content}</p>
          </div>
        </div>
      `).join('');
    }
  }

  /* ============================================================
     CTA PHONE BUTTON
     ============================================================ */
  const ctaPhoneBtn = document.querySelector('.cta-actions a[href^="tel:"]');
  if (ctaPhoneBtn) {
    ctaPhoneBtn.href = 'tel:' + data.school.phone.replace(/\s/g, '');
    ctaPhoneBtn.innerHTML = '<i class="fas fa-phone"></i> Call: ' + data.school.phone;
  }

  /* ============================================================
     SECTION VISIBILITY
     ============================================================ */
  const sectionMap = [
    ['hero',              data.sections.hero],
    ['welcome-section',   data.sections.welcome],
    ['quick-links',       data.sections.quickLinks],
    ['why-choose',        data.sections.whyChooseUs],
    ['projects-preview',  data.sections.projects],
    ['cta-banner',        data.sections.cta]
  ];
  sectionMap.forEach(([id, visible]) => {
    const el = document.getElementById(id);
    if (el) el.style.display = visible ? '' : 'none';
  });
}

/* ============================================================
   AUTO-RUN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyContent();
  renderPublicResults();
});

window.addEventListener('dataChanged', () => {
  applyContent();
  renderPublicResults();
});

window.addEventListener('storage', (e) => {
  if (e.key === DATA_KEY) {
    applyContent();
    renderPublicResults();
  }
});

/* ============================================================
   GLOBAL EXPORTS
   ============================================================ */
window.getData = getData;
window.saveData = saveData;
window.resetData = resetData;
window.login = login;
window.logout = logout;
window.isLoggedIn = isLoggedIn;
window.calcPassRate = calcPassRate;
window.applyContent = applyContent;
window.applyTheme = applyTheme;
window.renderPublicResults = renderPublicResults;

/* ============================================================
   COUNTER REBUILD HOOK
   ============================================================ */
window.__rebuildCounters = function () {
  const counters = document.querySelectorAll('[data-count]:not([data-counted])');
  counters.forEach(el => {
    el.setAttribute('data-counted', 'true');
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
  });
};

/* ============================================================
   BRANDING LOGS
   ============================================================ */
console.log(
  '%c Pagejo Rarubi CMS Loaded ',
  'background: #1e4b3a; color: #f9e6b3; font-size: 14px; font-weight: bold; padding: 6px; border-radius: 6px;'
);
console.log(
  '%c Admin Key: pagejorarubiprischadmin ',
  'background: #d4a373; color: #0b2b1e; font-size: 11px; padding: 4px 8px; border-radius: 4px;'
);
