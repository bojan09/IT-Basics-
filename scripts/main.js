/* ═══════════════════════════════════════════════════
   IT FUNDAMENTALS PLATFORM — MAIN.JS
   Handles: component loading, scroll animations,
   hamburger menu, expand/collapse, active nav
═══════════════════════════════════════════════════ */

'use strict';

/* ──────────────── COMPONENT LOADER ──────────────── */
async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = html;
      return true;
    }
  } catch (e) {
    // If fetch fails (e.g. file:// protocol), inject inline fallback
    injectFallbackNav(id);
  }
  return false;
}

function injectFallbackNav(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `
    <nav>
      <a class="nav-logo" href="index.html">
        <div class="logo-icon">⚡</div>IT<span class="logo-accent">Base</span>
      </a>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="osi-model.html">OSI Model</a></li>
        <li><a href="computer-components.html">Hardware</a></li>
        <li><a href="linux-basics.html">Linux</a></li>
        <li><a href="windows-basics.html">Windows</a></li>
        <li><a href="docker.html">Docker</a></li>
        <li><a href="kubernetes.html">Kubernetes</a></li>
        <li><a href="ubuntu-server.html">Ubuntu Server</a></li>
        <li><a href="windows-server.html">Win Server</a></li>
        <li><a href="powershell.html">PowerShell</a></li>
        <li><a href="unix.html">Unix</a></li>
      </ul>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div class="nav-drawer" id="nav-drawer">
      <a href="index.html">🏠 Home</a>
      <a href="osi-model.html">🌐 OSI Model</a>
      <a href="computer-components.html">🖥️ Computer Hardware</a>
      <a href="linux-basics.html">🐧 Linux Basics</a>
      <a href="windows-basics.html">🪟 Windows Basics</a>
      <a href="docker.html">🐳 Docker</a>
      <a href="kubernetes.html">☸️ Kubernetes</a>
      <a href="ubuntu-server.html">🖥️ Ubuntu Server</a>
      <a href="windows-server.html">🪟 Windows Server 2025</a>
      <a href="powershell.html">⚡ PowerShell</a>
      <a href="unix.html">🧑‍💻 Unix Fundamentals</a>
    </div>`;
}

function injectFallbackFooter(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `
    <footer>
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="footer-logo">⚡ IT<span class="text-cyan">Base</span></div>
          <p>A visual learning platform for IT fundamentals.</p>
        </div>
        <div class="footer-col">
          <h4>Topics</h4>
          <a href="osi-model.html">OSI Model</a>
          <a href="computer-components.html">Hardware</a>
          <a href="linux-basics.html">Linux</a>
          <a href="windows-basics.html">Windows</a>
          <a href="docker.html">Docker</a>
          <a href="kubernetes.html">Kubernetes</a>
        </div>
        <div class="footer-col">
          <h4>More</h4>
          <a href="ubuntu-server.html">Ubuntu Server</a>
          <a href="windows-server.html">Windows Server</a>
          <a href="powershell.html">PowerShell</a>
          <a href="unix.html">Unix</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2025 ITBase</span>
        <span>Built for learners</span>
      </div>
    </footer>`;
}

/* ──────────────── ACTIVE NAV LINK ──────────────── */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ──────────────── HAMBURGER MENU ──────────────── */
function initHamburger() {
  // Use event delegation since nav is injected
  document.addEventListener('click', (e) => {
    const burger = e.target.closest('#hamburger');
    if (burger) {
      const drawer = document.getElementById('nav-drawer');
      burger.classList.toggle('open');
      if (drawer) drawer.classList.toggle('open');
    }
    // Close when clicking outside
    if (!e.target.closest('nav') && !e.target.closest('.nav-drawer')) {
      const burger = document.getElementById('hamburger');
      const drawer = document.getElementById('nav-drawer');
      if (burger) burger.classList.remove('open');
      if (drawer) drawer.classList.remove('open');
    }
  });
}

/* ──────────────── SCROLL REVEAL (Intersection Observer) ──────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ──────────────── EXPAND / COLLAPSE ──────────────── */
function initExpanders() {
  document.querySelectorAll('.expand-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const body = trigger.nextElementSibling;
      const isOpen = trigger.classList.contains('open');

      if (isOpen) {
        body.style.maxHeight = '0';
        trigger.classList.remove('open');
      } else {
        body.style.maxHeight = body.scrollHeight + 'px';
        trigger.classList.add('open');
      }
    });
  });
}

/* ──────────────── TYPING ANIMATION ──────────────── */
function typeText(el, text, speed = 45) {
  el.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

function initTypingEffects() {
  const typeEls = document.querySelectorAll('[data-type]');
  if (!typeEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeText(entry.target, entry.target.dataset.type);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  typeEls.forEach(el => observer.observe(el));
}

/* ──────────────── ANIMATED COUNTERS ──────────────── */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(el => observer.observe(el));
}

/* ──────────────── FLOW DIAGRAM PULSE ANIMATION ──────────────── */
function initFlowAnimations() {
  const diagrams = document.querySelectorAll('.flow-diagram, .arch-diagram');
  diagrams.forEach(diagram => {
    const nodes = diagram.querySelectorAll('.flow-node, .arch-node');
    let current = 0;

    function pulseNext() {
      nodes.forEach(n => n.style.boxShadow = '');
      if (nodes[current]) {
        nodes[current].style.boxShadow = '0 0 16px 2px rgba(0,212,255,0.35)';
        nodes[current].style.borderColor = 'rgba(0,212,255,0.6)';
        setTimeout(() => {
          if (nodes[current]) {
            nodes[current].style.boxShadow = '';
            nodes[current].style.borderColor = '';
          }
        }, 700);
      }
      current = (current + 1) % nodes.length;
    }

    // Start animation when diagram is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const interval = setInterval(pulseNext, 900);
          // Stop after 6s to not be annoying
          setTimeout(() => clearInterval(interval), 6000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(diagram);
  });
}

/* ──────────────── OSI LAYER INTERACTION ──────────────── */
function initOsiLayers() {
  const layers = document.querySelectorAll('.osi-layer');
  layers.forEach(layer => {
    layer.addEventListener('click', () => {
      const wasActive = layer.classList.contains('osi-active');
      layers.forEach(l => l.classList.remove('osi-active'));
      if (!wasActive) layer.classList.add('osi-active');
    });
  });
}

/* ──────────────── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ──────────────── TOOLTIP SYSTEM ──────────────── */
function initTooltips() {
  document.querySelectorAll('[data-tip]').forEach(el => {
    let tip;
    el.addEventListener('mouseenter', () => {
      tip = document.createElement('div');
      tip.className = 'tooltip';
      tip.textContent = el.dataset.tip;
      tip.style.cssText = `
        position:fixed; background:#0f1c38; color:#dce6f5;
        border:1px solid #2a4880; border-radius:6px;
        padding:6px 10px; font-size:0.7rem; max-width:220px;
        z-index:99999; pointer-events:none; line-height:1.5;
        box-shadow:0 8px 24px rgba(0,0,0,0.4);
      `;
      document.body.appendChild(tip);
    });
    el.addEventListener('mousemove', (e) => {
      if (tip) {
        tip.style.left = (e.clientX + 12) + 'px';
        tip.style.top  = (e.clientY - 8) + 'px';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (tip) { tip.remove(); tip = null; }
    });
  });
}

/* ──────────────── COPY CODE BUTTON ──────────────── */
function initCodeCopy() {
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = document.createElement('button');
    btn.textContent = 'copy';
    btn.style.cssText = `
      position:absolute; top:8px; right:36px;
      background:transparent; border:1px solid #1e3562;
      color:#4a6490; border-radius:4px; padding:2px 8px;
      font-size:0.6rem; cursor:pointer; font-family:inherit;
      transition:all 0.2s;
    `;
    btn.addEventListener('click', () => {
      const text = block.innerText.replace(/^copy$/m, '').trim();
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'copied!';
        btn.style.color = '#22d3a1';
        setTimeout(() => { btn.textContent = 'copy'; btn.style.color = '#4a6490'; }, 2000);
      });
    });
    btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#22d3a1'; btn.style.color = '#22d3a1'; });
    btn.addEventListener('mouseleave', () => { btn.style.borderColor = '#1e3562'; btn.style.color = '#4a6490'; });
    block.appendChild(btn);
  });
}

/* ──────────────── INIT ──────────────── */
async function init() {
  // Load shared components
  const navLoaded = await loadComponent('navbar-placeholder', 'components/navbar.html');
  if (!navLoaded) {
    // fallback already injected
  }

  const footerEl = document.getElementById('footer-placeholder');
  if (footerEl) {
    try {
      const res = await fetch('components/footer.html');
      if (res.ok) footerEl.innerHTML = await res.text();
      else injectFallbackFooter('footer-placeholder');
    } catch {
      injectFallbackFooter('footer-placeholder');
    }
  }

  // Set active nav link after components load
  setTimeout(setActiveNavLink, 50);

  // Init all features
  initHamburger();
  initScrollReveal();
  initExpanders();
  initTypingEffects();
  initCounters();
  initFlowAnimations();
  initOsiLayers();
  initSmoothScroll();
  initTooltips();
  initCodeCopy();
}

document.addEventListener('DOMContentLoaded', init);
