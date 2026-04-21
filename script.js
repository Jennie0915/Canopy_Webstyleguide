/* ============================================================
   CANOPY — script.js  (interactive behaviour)
   ============================================================ */

/* ── Navbar scroll effect ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });



/* ── Mobile hamburger menu ───────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── Color Swatch tooltip ────────────────────────────────── */
const tooltip = document.getElementById('color-tooltip');
const swatches = document.querySelectorAll('.color-swatch');

swatches.forEach(swatch => {
  swatch.addEventListener('mouseenter', e => {
    tooltip.textContent = `${swatch.dataset.name}  ${swatch.dataset.hex}`;
    tooltip.classList.add('visible');
    positionTooltip(e);
  });

  swatch.addEventListener('mousemove', positionTooltip);

  swatch.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });

  // Click to copy hex
  swatch.addEventListener('click', () => {
    navigator.clipboard.writeText(swatch.dataset.hex).then(() => {
      const prev = tooltip.textContent;
      tooltip.textContent = '✓ Copied!';
      setTimeout(() => { tooltip.textContent = prev; }, 1200);
    }).catch(() => {});
  });
});

function positionTooltip(e) {
  const x = e.clientX + 14;
  const y = e.clientY - 36;
  tooltip.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
  tooltip.style.top  = `${Math.max(y, 8)}px`;
}

/* ── Scroll reveal ───────────────────────────────────────── */
const revealItems = document.querySelectorAll('.card, .hero-text, .hero-tree');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger cards slightly
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 60 * i);
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -80px 0px' });

revealItems.forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ── Hero title letter animation ─────────────────────────── */
(function animateHeroTitle() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  const parts = title.innerHTML.split(/(<br\/>|<br>)/);
  title.innerHTML = '';
  parts.forEach(part => {
    if (part === '<br/>' || part === '<br>') {
      title.appendChild(document.createElement('br'));
    } else {
      [...part].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: letterIn .5s ${.05 * i + .2}s var(--ease) forwards;
        `;
        title.appendChild(span);
      });
    }
  });

  // Inject animation keyframes once
  if (!document.getElementById('letter-kf')) {
    const style = document.createElement('style');
    style.id = 'letter-kf';
    style.textContent = `
      @keyframes letterIn {
        to { opacity: 1; transform: translateY(0); }
      }`;
    document.head.appendChild(style);
  }
})();

/* ── Icon pulse on click ─────────────────────────────────── */
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('click', () => {
    icon.style.transition = 'none';
    icon.style.transform = 'scale(1.4)';
    setTimeout(() => {
      icon.style.transition = 'transform .3s cubic-bezier(.4,0,.2,1)';
      icon.style.transform = '';
    }, 120);
  });
});
