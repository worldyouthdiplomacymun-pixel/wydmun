/* ============================================================
   WYD MUN — Shared Navbar Logic
   Used on all pages: index.html, secretariat.html, register.html
   ============================================================ */
(function () {
  var navbar     = document.getElementById('navbar');
  var navToggle  = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  /* ============================================================
     1. SECTION-AWARE NAVBAR THEMING
     ─────────────────────────────────────────────────────────────
     Each section in the HTML carries a data-nav-theme attribute:
       data-nav-theme="dark"   → navy/dark section  → light text
       data-nav-theme="light"  → cream/light section → dark text

     To change a section's theme later, just edit that attribute
     in index.html (or whichever page) — no JS changes needed.
     ============================================================ */
  var themeSections = document.querySelectorAll('[data-nav-theme]');

  function applyNavTheme() {
    if (!themeSections.length) return;

    /* Find which section's vertical range currently spans the
       bottom edge of the navbar (the "content-under-navbar" point) */
    var navBottom = navbar ? navbar.getBoundingClientRect().bottom : 72;
    var activeTheme = 'dark'; /* fallback — matches the hero default */

    themeSections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= navBottom && rect.bottom > navBottom) {
        activeTheme = section.dataset.navTheme || 'dark';
      }
    });

    /* Only update DOM when theme actually changes (avoids reflow spam) */
    if (navbar && navbar.dataset.activeTheme !== activeTheme) {
      navbar.dataset.activeTheme = activeTheme;
      navbar.classList.remove('theme-dark', 'theme-light');
      navbar.classList.add('theme-' + activeTheme);
    }
  }

  /* Run on scroll and on load */
  window.addEventListener('scroll', applyNavTheme, { passive: true });
  applyNavTheme();

  /* ============================================================
     2. AUTO-HIDE NAVBAR ON INACTIVITY
     ─────────────────────────────────────────────────────────────
     Hides navbar after 1.5s of no mouse/scroll/touch activity.
     Reappears immediately on any activity.
     ============================================================ */
  var inactivityTimer;
  var firstSection = document.querySelector('section');

  function isInFirstSection() {
    if (!firstSection) return false;
    return firstSection.getBoundingClientRect().bottom > 80;
  }

  function showNavbar() {
    if (!navbar) return;
    navbar.style.transition = 'transform 0.5s ease, opacity 0.4s ease';
    navbar.style.transform = 'translateY(0)';
    navbar.style.opacity = '1';
    navbar.style.pointerEvents = '';
  }

  function hideNavbar() {
    if (!navbar) return;
    if (isInFirstSection()) return;
    navbar.style.transition = 'transform 0.6s ease, opacity 0.5s ease';
    navbar.style.transform = 'translateY(-110%)';
    navbar.style.opacity = '0';
    navbar.style.pointerEvents = 'none';
  }

  function resetTimer() {
    showNavbar();
    clearTimeout(inactivityTimer);
    if (isInFirstSection()) return;
    inactivityTimer = setTimeout(hideNavbar, 1000);
  }

  window.addEventListener('mousemove', resetTimer, { passive: true });
  window.addEventListener('scroll', resetTimer, { passive: true });
  window.addEventListener('touchstart', resetTimer, { passive: true });

  window.addEventListener('scroll', function () {
    if (isInFirstSection()) {
      showNavbar();
      clearTimeout(inactivityTimer);
    }
  }, { passive: true });

  resetTimer();

  /* ============================================================
     3. MOBILE NAVBAR — keeps the solid background
     The .scrolled class is still toggled for any pages that use it,
     but the mobile solid background is handled purely in CSS via
     the @media (max-width: 768px) block in styles.css.
     ============================================================ */
  function updateScrollState() {
    if (!navbar) return;
    if (navbar.dataset.alwaysScrolled) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  }
  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  /* ============================================================
     4. MOBILE MENU — open / close
     ============================================================ */

  if (!navToggle || !mobileMenu) return;

  /* Close mobile menu */
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /* Toggle open/close */
  navToggle.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* Close on any link click inside mobile menu */
  mobileMenu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMobileMenu();
  });

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
      navToggle.focus();
    }
  });
})();
