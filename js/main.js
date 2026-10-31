document.addEventListener('DOMContentLoaded', () => {
  // 1. Splash Screen Dismissal
  const splash = document.getElementById('splash-screen');
  if (splash) {
    const dismissSplash = () => {
      splash.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      setTimeout(() => splash.remove(), 450);
    };

    setTimeout(dismissSplash, 2700);
    splash.addEventListener('click', dismissSplash);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') dismissSplash();
    }, { once: true });
  }

  // 2. Multi-Page View Router (#home, #about, #case-studies, #playground, #contact)
  const views = {
    home: document.getElementById('view-home'),
    about: document.getElementById('view-about'),
    'case-studies': document.getElementById('view-case-studies'),
    playground: document.getElementById('view-playground'),
    contact: document.getElementById('view-contact')
  };

  const navLinks = document.querySelectorAll('[data-route]');
  const leftNavBtns = document.querySelectorAll('.ca-left-nav-btn');

  function switchView(routeKey, scrollTarget) {
    if (!views[routeKey]) routeKey = 'home';

    // Update active view
    Object.keys(views).forEach(key => {
      if (views[key]) {
        if (key === routeKey) {
          views[key].classList.add('active-view');
        } else {
          views[key].classList.remove('active-view');
        }
      }
    });

    // Update header nav active state
    navLinks.forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      if (linkRoute === routeKey) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Handle scroll target if provided
    if (scrollTarget) {
      setTimeout(() => {
        const targetEl = document.getElementById(scrollTarget);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.remove('open');
  }

  // Hash-based routing
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const [route, target] = hash.split('/');
    switchView(route, target);
  }

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // Init on load

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      window.location.hash = route;
    });
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // 3. Hero Black Invert Panel Interactive Motion & Orbit
  const heroSection = document.getElementById('hero');
  const invertPanel = document.getElementById('hero-invert-panel');

  if (heroSection && invertPanel) {
    let isMouseOver = false;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let animFrame = null;

    heroSection.addEventListener('mouseenter', () => {
      isMouseOver = true;
      invertPanel.classList.add('manual-move');
    });

    heroSection.addEventListener('mousemove', (e) => {
      const nameBox = document.querySelector('.ca-name-wrap');
      if (!nameBox) return;
      const rect = nameBox.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      targetX = e.clientX - centerX;
      targetY = e.clientY - centerY;
    });

    heroSection.addEventListener('mouseleave', () => {
      isMouseOver = false;
      invertPanel.classList.remove('manual-move');
      invertPanel.style.transform = '';
    });

    // Spring damping interpolation loop
    function updatePanelPosition() {
      if (isMouseOver) {
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;
        invertPanel.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      animFrame = requestAnimationFrame(updatePanelPosition);
    }
    animFrame = requestAnimationFrame(updatePanelPosition);
  }

  // 4. Case Study Details Data & Modal (User Projects)
  const caseStudiesData = {
    univent: {
      number: '01',
      title: 'Univent',
      category: 'Campus Event & Student Community Platform',
      date: 'March 19, 2026',
      color: 'var(--ca-blue)',
      textColor: '#ffffff',
      img: 'assets/images/wayline.jpg',
      headline: 'Transforming chaotic campus event flyers into a vibrant, verified student discovery ecosystem.',
      overview: 'College campuses produce hundreds of club activities, speaker sessions, hackathons, and social events every week, yet students consistently report feeling disconnected. Univent consolidates event RSVPs, verified attendee rosters, and real-time campus crowd maps into a tactile mobile interface with zero friction.',
      stats: [
        { label: 'Campus Engagement', value: '+74%' },
        { label: 'Weekly Active Students', value: '42,000+' },
        { label: 'Event Discovery Time', value: '< 15 sec' },
        { label: 'RSVP Conversion', value: '88%' }
      ],
      deliverables: ['Real-time campus radar map', 'Tactile digital ticket passes', 'Club leader admin console', 'Instant peer group sync']
    },
    eventora: {
      number: '02',
      title: 'EVENTORA',
      category: 'Ticketing & Festival Experience System',
      date: 'March 2, 2026',
      color: 'var(--ca-ink)',
      textColor: '#ffffff',
      img: 'assets/images/tandem.png',
      headline: 'Eliminating ticket scalping and venue entry queues through high-trust sensory checkout.',
      overview: 'Music festivals and large conventions often suffer from predatory reseller bots, confusing tiered badge structures, and miserable gate wait times. EVENTORA introduced cryptographic offline-verified QR passes, transparent multi-tier bundle selectors, and animated venue arrival dashboards.',
      stats: [
        { label: 'Gate Scan Latency', value: '0.4s' },
        { label: 'Tickets Processed', value: '$120M+' },
        { label: 'Checkout Drop-off', value: '-62%' },
        { label: 'Organizer Trust Rating', value: '99.4%' }
      ],
      deliverables: ['Offline-resilient dynamic QR badge', 'Multi-tier bundle builder', 'Rapid contactless entrance app', 'Live venue capacity telemetry']
    },
    yesstyle: {
      number: '03',
      title: 'YesStyle UX Redesign',
      category: 'E-Commerce Navigation & Checkout Experience',
      date: 'January 2, 2026',
      color: 'var(--ca-yellow)',
      textColor: 'var(--ca-ink)',
      img: 'assets/images/forge.jpg',
      headline: 'Streamlining cross-border beauty & fashion commerce for millions of global shoppers.',
      overview: 'International shoppers loved YesStyle’s catalog breadth but struggled with dense typography, confusing sizing conversion charts, and a checkout flow cluttered with disparate coupons. This end-to-end UX redesign restructured global sizing recommendations, personalized curated editorial reels, and trimmed cart completion down to three intuitive steps.',
      stats: [
        { label: 'Cart Abandonment', value: '-38%' },
        { label: 'Mobile Checkout Speed', value: '2.1x' },
        { label: 'Size Return Reduction', value: '-47%' },
        { label: 'Net Promoter Score', value: '+32' }
      ],
      deliverables: ['Predictive smart size visualizer', 'Sticky one-tap payment drawer', 'Micro-editorial lookbook feeds', 'Multi-currency duty estimator']
    },
    graphic: {
      number: '04',
      title: 'Visual & Graphic Design',
      category: 'Editorial Typography, Brand Identities & Posters',
      date: 'March 16, 2026',
      color: 'var(--ca-magenta)',
      textColor: 'var(--ca-ink)',
      img: 'assets/images/volt.png',
      headline: 'Explorations in brutalist print aesthetics, Swiss grid systems, and tactile digital publishing.',
      overview: 'A collection of self-initiated and commissioned graphic explorations spanning risograph posters, custom variable typography specimens, spatial zines, and tactile 3D brand identities. Each piece investigates how physical paper artifacts, halftone textures, and kinetic type can inform modern user interface design.',
      stats: [
        { label: 'Identity Systems', value: '18+' },
        { label: 'Featured Exhibitions', value: '6' },
        { label: 'Custom Type Specimens', value: '4' },
        { label: 'Print Runs', value: '10,000+' }
      ],
      deliverables: ['Brutalist identity brand books', 'Kinetic variable type specimen', 'Silk-screen & riso poster series', 'Interactive web editorial layout']
    }
  };

  const modalBackdrop = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openProjectModal(key) {
    const data = caseStudiesData[key];
    if (!data || !modalBackdrop || !modalContent) return;

    modalContent.innerHTML = `
      <div style="border-bottom: 2.5px solid var(--ca-ink); padding-bottom: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <span class="ca-mono" style="background: ${data.color}; color: ${data.textColor}; padding: 0.4rem 1rem; font-weight: 700; font-size: 0.875rem; border: 2px solid var(--ca-ink); box-shadow: 2px 2px 0 var(--ca-ink);">
            PROJECT ${data.number} • ${data.category}
          </span>
          <span class="ca-mono" style="font-size: 0.8125rem; font-weight: 700; color: rgba(25,21,16,0.65);">
            ${data.date}
          </span>
        </div>
        <h2 class="ca-display" style="font-size: clamp(2.5rem, 6vw, 4.5rem); margin-top: 1rem; color: var(--ca-ink); line-height: 1;">
          ${data.title}
        </h2>
        <p class="ca-hand" style="font-size: 1.85rem; color: var(--ca-ink); margin-top: 0.5rem; line-height: 1.3;">
          "${data.headline}"
        </p>
      </div>

      <div style="position: relative; margin-bottom: 2.5rem;">
        <span class="ca-mockup-tape-l"></span>
        <span class="ca-mockup-tape-r"></span>
        <div class="ca-mockup-img-wrap" style="aspect-ratio: 16/9; max-height: 420px;">
          <img src="${data.img}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      </div>

      <div style="margin-bottom: 2.5rem;">
        <h3 class="ca-mono" style="font-size: 1.15rem; font-weight: 700; margin-bottom: 0.75rem; border-left: 4px solid var(--ca-yellow); padding-left: 0.75rem;">
          The Design Story & Approach
        </h3>
        <p style="font-size: 1.125rem; line-height: 1.7; color: rgba(25,21,16,0.9);">
          ${data.overview}
        </p>
      </div>

      <div style="background: var(--ca-chrome); border: 2px solid var(--ca-ink); padding: 1.5rem; box-shadow: 4px 4px 0 var(--ca-ink); margin-bottom: 2.5rem;">
        <h4 class="ca-mono" style="font-size: 0.875rem; font-weight: 700; letter-spacing: 0.15em; margin-bottom: 1rem; color: var(--ca-ink);">
          KEY IMPACT & MEASURABLE OUTCOMES
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; text-align: center;">
          ${data.stats.map(s => `
            <div style="background: white; border: 1.5px solid var(--ca-ink); padding: 1rem 0.5rem; box-shadow: 2px 2px 0 var(--ca-ink);">
              <div class="ca-display" style="font-size: 2.25rem; color: var(--ca-blue); line-height: 1;">${s.value}</div>
              <div class="ca-mono" style="font-size: 0.7rem; font-weight: 700; margin-top: 0.4rem; color: rgba(25,21,16,0.75);">${s.label}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div>
        <h4 class="ca-mono" style="font-size: 0.875rem; font-weight: 700; letter-spacing: 0.15em; margin-bottom: 0.75rem;">
          SYSTEM DELIVERABLES
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.deliverables.map(d => `
            <span class="ca-mono" style="background: white; border: 1.5px solid var(--ca-ink); padding: 0.4rem 0.85rem; font-size: 0.8125rem; font-weight: 700; box-shadow: 2px 2px 0 var(--ca-ink);">
              ✦ ${d}
            </span>
          `).join('')}
        </div>
      </div>
    `;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-case]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-open-case');
      openProjectModal(key);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // 5. Playground Freeform Collage Dragging & Zoom System
  const playgroundStage = document.getElementById('playground-stage');
  const collageItems = document.querySelectorAll('.ca-collage-item');
  let currentZoom = 1;

  if (playgroundStage && collageItems.length > 0) {
    let activeDrag = null;
    let initialX = 0, initialY = 0;
    let currentX = 0, currentY = 0;
    let maxZ = 20;

    collageItems.forEach(item => {
      const startDrag = (e) => {
        activeDrag = item;
        item.style.zIndex = (++maxZ).toString();

        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

        const rect = item.getBoundingClientRect();
        const stageRect = playgroundStage.getBoundingClientRect();

        initialX = (clientX - rect.left) / currentZoom;
        initialY = (clientY - rect.top) / currentZoom;
      };

      item.addEventListener('mousedown', startDrag);
      item.addEventListener('touchstart', startDrag, { passive: true });
    });

    const moveDrag = (e) => {
      if (!activeDrag) return;
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

      const stageRect = playgroundStage.getBoundingClientRect();
      currentX = (clientX - stageRect.left) / currentZoom - initialX;
      currentY = (clientY - stageRect.top) / currentZoom - initialY;

      activeDrag.style.left = `${currentX}px`;
      activeDrag.style.top = `${currentY}px`;
      activeDrag.style.bottom = 'auto';
      activeDrag.style.right = 'auto';
    };

    const stopDrag = () => {
      activeDrag = null;
    };

    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('touchmove', moveDrag, { passive: true });
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    // Zoom In / Out Buttons
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        currentZoom = Math.min(1.5, currentZoom + 0.15);
        playgroundStage.style.transform = `scale(${currentZoom})`;
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        currentZoom = Math.max(0.65, currentZoom - 0.15);
        playgroundStage.style.transform = `scale(${currentZoom})`;
      });
    }
  }

  // 6. Interactive Reaction & Contact Form Handler
  const reactionPill = document.getElementById('comment-reaction-pill');
  const reactionCount = document.getElementById('reaction-count');
  if (reactionPill && reactionCount) {
    let count = 1;
    reactionPill.addEventListener('click', () => {
      count++;
      reactionCount.textContent = count;
      reactionPill.style.transform = 'scale(1.25) rotate(6deg)';
      setTimeout(() => { reactionPill.style.transform = ''; }, 200);
    });
  }

  const contactForm = document.getElementById('interactive-contact-form');
  const formSuccessBanner = document.getElementById('form-success-banner');
  if (contactForm && formSuccessBanner) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      formSuccessBanner.style.display = 'block';
    });
  }

  // Copy Email Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('nandini@design.studio').then(() => {
        const originalText = copyEmailBtn.innerText;
        copyEmailBtn.innerText = 'COPIED TO CLIPBOARD! ✨';
        setTimeout(() => { copyEmailBtn.innerText = originalText; }, 2200);
      });
    });
  }

  // 6. About Page Section Navigation Smooth Scrolling
  document.querySelectorAll('.ca-about-side-btn, .ca-about-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

