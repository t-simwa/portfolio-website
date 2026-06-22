/* ===================================================================
 * Gilded Editorial Portfolio — Main JavaScript
 * Author: Ted Simwa
 * =================================================================== */

(function () {
  'use strict';

  /* # PRELOADER
   * =================================================================== */
  const preloader = document.getElementById('preloader');

  function dismissPreloader() {
    if (!preloader) return;
    const text = preloader.querySelector('.preloader__text');

    if (text) {
      text.style.opacity = '0';
      text.style.transform = 'translateY(-40px)';
    }

    setTimeout(function () {
      preloader.style.transform = 'translateY(-100%)';
      preloader.style.transition = 'transform 0.8s cubic-bezier(0.77, 0, 0.175, 1)';
      preloader.style.pointerEvents = 'none';
    }, 400);

    setTimeout(function () {
      document.body.classList.add('loaded');
    }, 1200);
  }

  window.addEventListener('load', function () {
    setTimeout(dismissPreloader, 800);
  });

  /* # CUSTOM CURSOR
   * =================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId = null;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      if (!rafId) {
        rafId = requestAnimationFrame(animateRing);
      }
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      rafId = null;
    }

    // Hover states
    document.querySelectorAll('a, button, .hover-target').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorRing.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', function () {
        cursorRing.classList.remove('is-hovering');
      });
    });

    document.querySelectorAll('.project-frame__cta-btn').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorRing.classList.add('is-project');
      });
      el.addEventListener('mouseleave', function () {
        cursorRing.classList.remove('is-project');
      });
    });

    document.querySelectorAll('.magnetic-target').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursorRing.classList.add('is-magnetic');
      });
      el.addEventListener('mouseleave', function () {
        cursorRing.classList.remove('is-magnetic');
      });
    });

    // Trail effect
    const trailDots = document.querySelectorAll('.cursor__trail-dot');
    const trailPositions = [];
    const TRAIL_LENGTH = 10;

    document.addEventListener('mousemove', function (e) {
      trailPositions.unshift({ x: e.clientX, y: e.clientY });
      if (trailPositions.length > TRAIL_LENGTH) trailPositions.pop();
      trailDots.forEach(function (dot, i) {
        const idx = Math.min(i * 3, trailPositions.length - 1);
        if (trailPositions[idx]) {
          dot.style.left = trailPositions[idx].x + 'px';
          dot.style.top = trailPositions[idx].y + 'px';
          dot.classList.add('is-visible');
        }
      });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', function () {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });

    document.addEventListener('mouseenter', function () {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    });
  } else if (cursorDot && cursorRing) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* # NAVIGATION SCROLL STATE
   * =================================================================== */
  const nav = document.getElementById('nav');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const heroContent = document.querySelector('.hero__content');
  const hero = document.getElementById('hero');
  let scrollTicking = false;
  const navLinks = document.querySelectorAll('.nav__link');

  function updateNavScrollState() {
    const scrollY = window.scrollY || window.pageYOffset;

    // At top of page (subtle fade)
    nav.dataset.atTop = scrollY < 120 ? 'true' : 'false';

    scrollTicking = false;

    // Scroll indicator
    if (scrollIndicator) {
      if (scrollY > 100) {
        scrollIndicator.classList.add('is-hidden');
      } else {
        scrollIndicator.classList.remove('is-hidden');
      }
    }

    // Hero parallax
    if (heroContent && hero) {
      const heroHeight = hero.offsetHeight;
      const heroTop = hero.offsetTop;
      const scrollInHero = Math.max(0, Math.min(scrollY - heroTop, heroHeight));
      const progressInHero = scrollInHero / heroHeight;
      const parallaxOffset = progressInHero * 40;
      heroContent.style.transform = 'translateY(' + parallaxOffset + 'px)';
    }

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollY / docHeight) * 100;
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
      progressBar.style.width = progress + '%';
      if (scrollY > 50) {
        progressBar.classList.add('is-visible');
      } else {
        progressBar.classList.remove('is-visible');
      }
    }
  }

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(updateNavScrollState);
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* # ACTIVE SECTION TRACKING
   * =================================================================== */
  const sections = document.querySelectorAll('section[id]');
  if (navLinks.length && sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* # NAIROBI CLOCK
   * =================================================================== */
  function updateClock() {
    const el = document.getElementById('navClockTime');
    if (!el) return;
    try {
      const now = new Date();
      const time = now.toLocaleTimeString('en-KE', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const parts = time.split(':');
      el.innerHTML = parts[0] + '<span class="nav__clock-colon">:</span>' + parts[1] + '<span class="nav__clock-colon">:</span>' + parts[2];
    } catch (e) {
      el.innerHTML = '--<span class="nav__clock-colon">:</span>--<span class="nav__clock-colon">:</span>--';
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

  /* # THEME TOGGLE
   * =================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light');
      if (themeIcon) {
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
      }
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light');
      if (themeIcon) {
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
      localStorage.setItem('theme', 'dark');
    }
  }

  // Check system preference and saved preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    setTheme(savedTheme);
  } else if (!systemPrefersDark) {
    setTheme('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isLight = document.body.classList.contains('light');
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  /* # RECRUITER MODE TOGGLE
   * =================================================================== */
  const recruiterToggle = document.getElementById('recruiterToggle');

  function setRecruiterMode(active) {
    if (active) {
      document.body.classList.add('recruiter-mode');
    } else {
      document.body.classList.remove('recruiter-mode');
    }
    localStorage.setItem('recruiter-mode', active ? 'true' : 'false');
  }

  const savedRecruiterMode = localStorage.getItem('recruiter-mode');
  if (savedRecruiterMode === 'true') {
    setRecruiterMode(true);
  }

  if (recruiterToggle) {
    recruiterToggle.addEventListener('click', function () {
      const isActive = document.body.classList.contains('recruiter-mode');
      setRecruiterMode(!isActive);
    });
  }

  /* # MOBILE NAV + BODY SCROLL LOCK
   * =================================================================== */
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');

  function toggleMobileMenu(open) {
    if (open) {
      hamburger.classList.add('is-active');
      navOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      hamburger.classList.remove('is-active');
      navOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }

  if (hamburger && navOverlay) {
    hamburger.addEventListener('click', function () {
      var isOpen = navOverlay.classList.contains('is-open');
      toggleMobileMenu(!isOpen);
    });

    navOverlay.querySelectorAll('.nav__overlay-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMobileMenu(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navOverlay.classList.contains('is-open')) {
        toggleMobileMenu(false);
      }
    });
  }

  /* # MAGNETIC BUTTONS
   * =================================================================== */
  document.querySelectorAll('.btn, .project-card__cta').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.25) + 'px, ' + (y * 0.25) + 'px)';
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });

  /* # VIEW TRANSITION API
   * =================================================================== */
  function isReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || link.hasAttribute('download') || link.getAttribute('target') === '_blank') return;
    if (typeof document.startViewTransition === 'function' && !isReducedMotion()) {
      e.preventDefault();
      document.startViewTransition(function () {
        window.location.href = href;
      });
    }
  });

  /* # ABOUT SECTION OBSERVERS
   * =================================================================== */

  // Photo diagonal clip-path reveal
  const aboutPhoto = document.getElementById('aboutPhoto');
  if (aboutPhoto && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          aboutPhoto.classList.add('is-revealed');
          observer.unobserve(aboutPhoto);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(aboutPhoto);
  }

  // Animated stat counters + accent bars
  var aboutStats = document.querySelector('.about__stats');
  if (aboutStats && 'IntersectionObserver' in window) {
    var animated = false;
    var statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          // Accent bars
          var stats = aboutStats.querySelectorAll('.about__stat');
          stats.forEach(function (stat, i) {
            setTimeout(function () {
              stat.classList.add('is-visible');
            }, i * 120);
          });
          // Counters
          var numbers = aboutStats.querySelectorAll('[data-count]');
          numbers.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = 1200;
            var start = performance.now();
            function update(now) {
              var elapsed = now - start;
              var progress = Math.min(elapsed / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.floor(eased * target);
              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
          });
          statsObserver.unobserve(aboutStats);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(aboutStats);
  }

  // Manifesto strip reveal
  var aboutManifesto = document.querySelector('.about__manifesto');
  if (aboutManifesto && 'IntersectionObserver' in window) {
    var manifestoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          aboutManifesto.classList.add('is-revealed');
          manifestoObserver.unobserve(aboutManifesto);
        }
      });
    }, { threshold: 0.4 });
    manifestoObserver.observe(aboutManifesto);
  }

  /* # PROJECT FRAMES — SCROLL REVEAL (staggered fade-in)
   * =================================================================== */
  const projectFrames = document.querySelectorAll('.project-frame');
  if (projectFrames.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    projectFrames.forEach(function (frame, i) {
      frame.style.transitionDelay = (i * 0.15) + 's';
      observer.observe(frame);
    });
  }

  /* # MARQUEE — SCROLL REVEAL
   * =================================================================== */
  const marquee = document.getElementById('marquee');
  if (marquee && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    observer.observe(marquee);
  }

  /* # GENERIC DATA-ENTRANCE OBSERVER (fade + slide up)
   * =================================================================== */
  var entranceElements = document.querySelectorAll('[data-entrance]');
  if (entranceElements.length && 'IntersectionObserver' in window) {
    var entranceObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entranceObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    entranceElements.forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.12) + 's';
      entranceObserver.observe(el);
    });
  }

  console.log('Ted Simwa — Gilded Editorial Portfolio');
  console.log('Designed & Built from scratch with vanilla JS');
})();
