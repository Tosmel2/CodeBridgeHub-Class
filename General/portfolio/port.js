/* ============================================================
   Portfolio — script.js
   Handles: cursor, nav scroll, typed text, scroll reveals,
            skill bars, stat counters, mobile menu, contact form
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────
  // 1. CUSTOM CURSOR
  // ─────────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  (function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  })();

  const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category, .testimonial');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Hide cursor on mobile
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
  }


  // ─────────────────────────────────────────────
  // 2. NAVBAR SCROLL EFFECT
  // ─────────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });


  // ─────────────────────────────────────────────
  // 3. MOBILE MENU
  // ─────────────────────────────────────────────
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  toggle.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const spans = toggle.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
      toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });


  // ─────────────────────────────────────────────
  // 4. TYPED TEXT ANIMATION
  // ─────────────────────────────────────────────
  const roles = [
    'Full Stack Developer',
    'React & Node.js Expert',
    'API Architect',
    'Open Source Contributor',
    'UI/UX Enthusiast'
  ];
  let roleIndex = 0, charIndex = 0, deleting = false;
  const typedEl = document.getElementById('typed');

  function createCursor() {
    const cur = document.createElement('span');
    cur.className = 'typed-cursor';
    return cur;
  }
  if (typedEl) typedEl.appendChild(createCursor());

  function typeRole() {
    if (!typedEl) return;
    const currentRole = roles[roleIndex];
    const cursorEl = typedEl.querySelector('.typed-cursor');
    const textNode = typedEl.firstChild;

    if (!deleting) {
      if (charIndex < currentRole.length) {
        if (textNode && textNode.nodeType === 3) {
          textNode.textContent = currentRole.slice(0, charIndex + 1);
        } else {
          typedEl.insertBefore(document.createTextNode(currentRole.slice(0, charIndex + 1)), cursorEl);
        }
        charIndex++;
        setTimeout(typeRole, 70);
      } else {
        setTimeout(() => { deleting = true; typeRole(); }, 2000);
      }
    } else {
      if (charIndex > 0) {
        if (textNode && textNode.nodeType === 3) {
          textNode.textContent = currentRole.slice(0, charIndex - 1);
        }
        charIndex--;
        setTimeout(typeRole, 40);
      } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 300);
      }
    }
  }
  setTimeout(typeRole, 800);


  // ─────────────────────────────────────────────
  // 5. SCROLL REVEAL
  // ─────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  // ─────────────────────────────────────────────
  // 6. SKILL BARS
  // ─────────────────────────────────────────────
  const barFills = document.querySelectorAll('.bar-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        setTimeout(() => {
          entry.target.style.width = width + '%';
        }, 200);
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  barFills.forEach(bar => barObserver.observe(bar));


  // ─────────────────────────────────────────────
  // 7. STAT COUNTERS
  // ─────────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));


  // ─────────────────────────────────────────────
  // 8. CONTACT FORM
  // ─────────────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
      btn.disabled = true;

      setTimeout(() => {
        btn.style.display = 'none';
        formSuccess.classList.add('show');
        contactForm.reset();
      }, 1200);
    });
  }


  // ─────────────────────────────────────────────
  // 9. SMOOTH ACTIVE NAV LINKS
  // ─────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--accent)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  // ─────────────────────────────────────────────
  // 10. PROJECT CARD TILT EFFECT
  // ─────────────────────────────────────────────
  const cards = document.querySelectorAll('.project-card, .skill-category');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -5;
      const rotateY = ((x - cx) / cx) * 5;
      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.35s ease';
    });
  });

});