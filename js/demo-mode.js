// ===== SHAW'S BUTCHERS — Demo Mode System =====
// A floating panel for live-customising the site during client presentations.
// Uses sessionStorage so everything resets when the tab closes.

const DemoMode = (() => {
  'use strict';

  // ---------- Presets ----------

  const COLOR_SCHEMES = [
    {
      id: 'classic',
      name: 'Classic Butcher',
      primary: '#8B1A1A',
      primaryDark: '#5C1010',
      primaryLight: '#B33A3A',
      accent: '#D4A853',
      accentLight: '#E8C97A',
      bg: '#FAFAF7',
      bgAlt: '#F3F0EA',
      text: '#2D2D2D',
      textLight: '#6B6B6B',
      border: '#E0DDD5',
      heroBg1: '#1a0505',
      heroBg2: '#3d0f0f',
    },
    {
      id: 'modern',
      name: 'Modern Minimal',
      primary: '#2D2D2D',
      primaryDark: '#1a1a1a',
      primaryLight: '#555555',
      accent: '#7C9A6F',
      accentLight: '#A3C293',
      bg: '#FFFFFF',
      bgAlt: '#F5F5F5',
      text: '#2D2D2D',
      textLight: '#777777',
      border: '#E5E5E5',
      heroBg1: '#0f1115',
      heroBg2: '#1e222b',
    },
    {
      id: 'heritage',
      name: 'Heritage',
      primary: '#1B4332',
      primaryDark: '#0F2B20',
      primaryLight: '#2D6A4F',
      accent: '#C67C4E',
      accentLight: '#DDA47A',
      bg: '#F5F0E8',
      bgAlt: '#EDE6DA',
      text: '#2D2D2D',
      textLight: '#6B6B6B',
      border: '#D5CDBD',
      heroBg1: '#0c1d15',
      heroBg2: '#132f22',
    },
    {
      id: 'bold',
      name: 'Bold & Fresh',
      primary: '#1A2744',
      primaryDark: '#0E1829',
      primaryLight: '#2E4470',
      accent: '#E8635A',
      accentLight: '#F09590',
      bg: '#F8F9FC',
      bgAlt: '#EEF0F5',
      text: '#1A2744',
      textLight: '#6B7B95',
      border: '#DEE2EC',
      heroBg1: '#0d172a',
      heroBg2: '#1e293b',
    },
    {
      id: 'rustic',
      name: 'Rustic Warmth',
      primary: '#722F37',
      primaryDark: '#4E1F25',
      primaryLight: '#9B4049',
      accent: '#D4943A',
      accentLight: '#E8B96A',
      bg: '#F9F5F0',
      bgAlt: '#F0EAE0',
      text: '#3D2E2E',
      textLight: '#7A6B6B',
      border: '#DDD5CA',
      heroBg1: '#281114',
      heroBg2: '#461d22',
    },
    {
      id: 'royal',
      name: 'Royal Steakhouse',
      primary: '#D4A853',
      primaryDark: '#A77E33',
      primaryLight: '#E8C97A',
      accent: '#1A1A1A',
      accentLight: '#333333',
      bg: '#FDFDFB',
      bgAlt: '#F7F7F2',
      text: '#1A1A1A',
      textLight: '#5A5A5A',
      border: '#EAE8DF',
      heroBg1: '#0a0a0a',
      heroBg2: '#1a1a1a',
    },
    {
      id: 'sage',
      name: 'Organic Sage',
      primary: '#6B8E23',
      primaryDark: '#4B6619',
      primaryLight: '#8FBC8F',
      accent: '#C27D38',
      accentLight: '#DDA47A',
      bg: '#FAF9F6',
      bgAlt: '#F4F0EA',
      text: '#2E3B1E',
      textLight: '#697A5A',
      border: '#DDD9D0',
      heroBg1: '#1c2815',
      heroBg2: '#2e3b24',
    },
    {
      id: 'coastal',
      name: 'Ocean & Coastal',
      primary: '#008080',
      primaryDark: '#004D4D',
      primaryLight: '#20B2AA',
      accent: '#E07A5F',
      accentLight: '#F4A261',
      bg: '#F7F9FA',
      bgAlt: '#EEF2F4',
      text: '#1D3557',
      textLight: '#5E7A8A',
      border: '#D3E0E6',
      heroBg1: '#051b1b',
      heroBg2: '#0a2d2d',
    }
  ];

  const FONT_PAIRS = [
    {
      id: 'playfair-inter',
      name: 'Playfair + Inter',
      heading: "'Playfair Display', Georgia, serif",
      body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700;800&display=swap',
      previewHeading: 'Playfair Display',
      previewBody: 'Inter',
    },
    {
      id: 'baskerville-source',
      name: 'Baskerville + Source',
      heading: "'Libre Baskerville', Georgia, serif",
      body: "'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@400;500;600;700&display=swap',
      previewHeading: 'Libre Baskerville',
      previewBody: 'Source Sans 3',
    },
    {
      id: 'dm-serif-dm-sans',
      name: 'DM Serif + DM Sans',
      heading: "'DM Serif Display', Georgia, serif",
      body: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap',
      previewHeading: 'DM Serif Display',
      previewBody: 'DM Sans',
    },
    {
      id: 'cormorant-lato',
      name: 'Cormorant + Lato',
      heading: "'Cormorant Garamond', Georgia, serif",
      body: "'Lato', -apple-system, BlinkMacSystemFont, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;700&display=swap',
      previewHeading: 'Cormorant Garamond',
      previewBody: 'Lato',
    },
    {
      id: 'outfit',
      name: 'Outfit',
      heading: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
      previewHeading: 'Outfit',
      previewBody: 'Outfit',
    },
  ];

  const LAYOUTS = [
    { id: 'standard', name: 'Standard' },
    { id: 'magazine', name: 'Magazine' },
    { id: 'compact', name: 'Compact' },
  ];

  const STORAGE_KEY = 'shaws_demo_mode';

  // ---------- State ----------

  let state = {
    colorScheme: 'classic',
    fontPair: 'playfair-inter',
    layout: 'standard',
    shopName: "Shaw's",
    shopNameFull: "Shaw's Family Butchers",
    phone: '01928 561869',
    address: '39 Church Street, Runcorn, WA7 1LX',
    tagline: 'Quality Meats, Crafted With Care',
  };

  let panelOpen = false;

  // ---------- Load / Save ----------

  const loadState = () => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = { ...state, ...JSON.parse(saved) };
      }
    } catch { /* ignore */ }
  };

  const saveState = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  };

  // ---------- Apply Theme ----------

  const applyColorScheme = (id) => {
    const scheme = COLOR_SCHEMES.find(s => s.id === id);
    if (!scheme) return;

    state.colorScheme = id;
    const root = document.documentElement;
    const body = document.body;

    // Trigger smooth transition
    body.classList.add('demo-transitioning');
    setTimeout(() => body.classList.remove('demo-transitioning'), 600);

    if (id === 'classic') {
      // Remove inline CSS variables to let stylesheet defaults take over
      [
        '--color-primary', '--color-primary-dark', '--color-primary-light',
        '--color-accent', '--color-accent-light',
        '--color-bg', '--color-bg-alt', '--color-text', '--color-text-light', '--color-border',
        '--primary', '--accent', '--text-primary', '--text-secondary', '--bg-warm', '--border',
        '--color-hero-bg-1', '--color-hero-bg-2',
      ].forEach(prop => root.style.removeProperty(prop));

      // Restore dark mode if it was active
      const saved = localStorage.getItem('shaws-dark-mode');
      if (saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
    } else {
      // For custom schemes, remove dark-mode to ensure correct rendering of light-themed preset
      body.classList.remove('dark-mode');

      // Set inline custom properties
      root.style.setProperty('--color-primary', scheme.primary);
      root.style.setProperty('--color-primary-dark', scheme.primaryDark);
      root.style.setProperty('--color-primary-light', scheme.primaryLight);
      root.style.setProperty('--color-accent', scheme.accent);
      root.style.setProperty('--color-accent-light', scheme.accentLight);
      root.style.setProperty('--color-bg', scheme.bg);
      root.style.setProperty('--color-bg-alt', scheme.bgAlt);
      root.style.setProperty('--color-text', scheme.text);
      root.style.setProperty('--color-text-light', scheme.textLight);
      root.style.setProperty('--color-border', scheme.border);
      root.style.setProperty('--color-hero-bg-1', scheme.heroBg1);
      root.style.setProperty('--color-hero-bg-2', scheme.heroBg2);

      // Also update the alias variables
      root.style.setProperty('--primary', scheme.primary);
      root.style.setProperty('--accent', scheme.accent);
      root.style.setProperty('--text-primary', scheme.text);
      root.style.setProperty('--text-secondary', scheme.textLight);
      root.style.setProperty('--bg-warm', scheme.bgAlt);
      root.style.setProperty('--border', scheme.border);
    }

    saveState();
    updateActiveStates();
  };

  const applyFontPair = (id) => {
    const pair = FONT_PAIRS.find(p => p.id === id);
    if (!pair) return;

    state.fontPair = id;

    // Load the Google Font
    loadGoogleFont(pair.url);

    document.documentElement.style.setProperty('--font-heading', pair.heading);
    document.documentElement.style.setProperty('--font-body', pair.body);

    // Also apply body font directly (since some elements read from body)
    document.body.style.fontFamily = pair.body;

    saveState();
    updateActiveStates();
  };

  const applyLayout = (id) => {
    if (!LAYOUTS.find(l => l.id === id)) return;

    state.layout = id;

    // Remove all layout classes
    document.body.classList.remove('layout-magazine', 'layout-compact');

    // Add the new one (standard = no class)
    if (id !== 'standard') {
      document.body.classList.add(`layout-${id}`);
    }

    saveState();
    updateActiveStates();
  };

  const applyTextEdits = () => {
    // Update all elements with data-demo attributes
    document.querySelectorAll('[data-demo="shop-name"]').forEach(el => {
      el.textContent = state.shopName;
    });
    document.querySelectorAll('[data-demo="shop-name-full"]').forEach(el => {
      el.textContent = state.shopNameFull;
    });
    document.querySelectorAll('[data-demo="phone"]').forEach(el => {
      if (el.tagName === 'A') {
        el.href = 'tel:' + state.phone.replace(/\s/g, '');
      }
      el.textContent = state.phone;
    });
    document.querySelectorAll('[data-demo="address"]').forEach(el => {
      el.innerHTML = state.address.replace(',', '<br>');
    });
    document.querySelectorAll('[data-demo="tagline"]').forEach(el => {
      el.innerHTML = state.tagline;
    });

    // Update page title
    const titleEl = document.querySelector('title');
    if (titleEl) {
      const pageTitle = titleEl.textContent;
      const pipeIdx = pageTitle.indexOf('|');
      if (pipeIdx !== -1) {
        titleEl.textContent = pageTitle.substring(0, pipeIdx + 2) + state.shopNameFull;
      }
    }
  };

  // ---------- Google Fonts Loader ----------

  const loadedFonts = new Set();

  const loadGoogleFont = (url) => {
    if (loadedFonts.has(url)) return;
    loadedFonts.add(url);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  };

  // ---------- Build Panel UI ----------

  const buildPanel = () => {
    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'demo-backdrop';
    backdrop.addEventListener('click', togglePanel);
    document.body.appendChild(backdrop);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'demo-panel';
    panel.id = 'demoPanel';

    panel.innerHTML = `
      <div class="demo-panel-handle"></div>
      <div class="demo-panel-header">
        <div class="demo-panel-header-left">
          <h3 class="demo-panel-title">🎨 Demo Mode</h3>
          <span class="demo-panel-subtitle">Customise the look — tap to preview</span>
        </div>
      </div>
      <div class="demo-panel-body">

        <!-- Colour Schemes -->
        <div class="demo-section">
          <div class="demo-section-title">Colour Scheme</div>
          <div class="demo-swatches" id="demoSwatches"></div>
        </div>

        <!-- Font Pairs -->
        <div class="demo-section">
          <div class="demo-section-title">Font Pairing</div>
          <div class="demo-fonts" id="demoFonts"></div>
        </div>

        <!-- Layout -->
        <div class="demo-section">
          <div class="demo-section-title">Layout Style</div>
          <div class="demo-layouts" id="demoLayouts"></div>
        </div>

        <!-- Quick Edits -->
        <div class="demo-section">
          <div class="demo-section-title">Quick Edits</div>
          <div class="demo-edits">
            <div class="demo-input">
              <label for="demoShopName">Shop Name (short)</label>
              <input type="text" id="demoShopName" value="${escapeHtml(state.shopName)}" placeholder="e.g. Dave's">
            </div>
            <div class="demo-input">
              <label for="demoShopNameFull">Shop Name (full)</label>
              <input type="text" id="demoShopNameFull" value="${escapeHtml(state.shopNameFull)}" placeholder="e.g. Dave's Quality Meats">
            </div>
            <div class="demo-input">
              <label for="demoPhone">Phone Number</label>
              <input type="text" id="demoPhone" value="${escapeHtml(state.phone)}" placeholder="e.g. 01234 567890">
            </div>
            <div class="demo-input">
              <label for="demoAddress">Address</label>
              <input type="text" id="demoAddress" value="${escapeHtml(state.address)}" placeholder="e.g. 12 High Street, Manchester">
            </div>
            <div class="demo-input">
              <label for="demoTagline">Tagline</label>
              <input type="text" id="demoTagline" value="${escapeHtml(state.tagline)}" placeholder="e.g. Fresh Meat, Great Value">
            </div>
          </div>
        </div>

        <!-- Reset -->
        <button class="demo-reset-btn" id="demoResetBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
          Reset to Default
        </button>

      </div>
    `;

    document.body.appendChild(panel);

    // Populate swatches
    const swatchContainer = panel.querySelector('#demoSwatches');
    COLOR_SCHEMES.forEach(scheme => {
      const btn = document.createElement('button');
      btn.className = 'demo-swatch';
      btn.dataset.scheme = scheme.id;
      btn.innerHTML = `
        <div class="demo-swatch-colors">
          <span style="background:${scheme.primary}"></span>
          <span style="background:${scheme.accent}"></span>
          <span style="background:${scheme.bg}"></span>
        </div>
        <span class="demo-swatch-label">${scheme.name}</span>
      `;
      btn.addEventListener('click', () => applyColorScheme(scheme.id));
      swatchContainer.appendChild(btn);
    });

    // Populate fonts
    const fontContainer = panel.querySelector('#demoFonts');
    FONT_PAIRS.forEach(pair => {
      const btn = document.createElement('button');
      btn.className = 'demo-font-btn';
      btn.dataset.font = pair.id;
      btn.innerHTML = `
        <span class="demo-font-label">${pair.name}</span>
        <span class="demo-font-preview" style="font-family:${pair.heading}">Aa Bb</span>
      `;
      btn.addEventListener('click', () => applyFontPair(pair.id));
      fontContainer.appendChild(btn);
    });

    // Populate layouts
    const layoutContainer = panel.querySelector('#demoLayouts');
    LAYOUTS.forEach(layout => {
      const btn = document.createElement('button');
      btn.className = 'demo-layout-btn';
      btn.dataset.layout = layout.id;
      btn.innerHTML = `
        <div class="demo-layout-icon"></div>
        <span class="demo-layout-label">${layout.name}</span>
      `;
      btn.addEventListener('click', () => applyLayout(layout.id));
      layoutContainer.appendChild(btn);
    });

    // Quick edit listeners
    const debounce = (fn, delay) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
      };
    };

    const shopNameInput = panel.querySelector('#demoShopName');
    const shopNameFullInput = panel.querySelector('#demoShopNameFull');
    const phoneInput = panel.querySelector('#demoPhone');
    const addressInput = panel.querySelector('#demoAddress');
    const taglineInput = panel.querySelector('#demoTagline');

    shopNameInput.addEventListener('input', debounce(() => {
      state.shopName = shopNameInput.value || "Shaw's";
      saveState();
      applyTextEdits();
    }, 200));

    shopNameFullInput.addEventListener('input', debounce(() => {
      state.shopNameFull = shopNameFullInput.value || "Shaw's Family Butchers";
      saveState();
      applyTextEdits();
    }, 200));

    phoneInput.addEventListener('input', debounce(() => {
      state.phone = phoneInput.value || '01928 561869';
      saveState();
      applyTextEdits();
    }, 200));

    addressInput.addEventListener('input', debounce(() => {
      state.address = addressInput.value || '39 Church Street, Runcorn, WA7 1LX';
      saveState();
      applyTextEdits();
    }, 200));

    taglineInput.addEventListener('input', debounce(() => {
      state.tagline = taglineInput.value || 'Quality Meats, Crafted With Care';
      saveState();
      applyTextEdits();
    }, 200));

    // Reset button
    panel.querySelector('#demoResetBtn').addEventListener('click', resetAll);

    // Trigger button
    const trigger = document.createElement('button');
    trigger.className = 'demo-trigger';
    trigger.id = 'demoTrigger';
    trigger.setAttribute('aria-label', 'Toggle demo mode panel');
    trigger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
    trigger.addEventListener('click', togglePanel);
    document.body.appendChild(trigger);

    // Back to Top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.id = 'backToTop';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(backToTop);

    // Show/hide back to top on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });
  };

  // ---------- Toggle Panel ----------

  const togglePanel = () => {
    panelOpen = !panelOpen;
    const panel = document.getElementById('demoPanel');
    const trigger = document.getElementById('demoTrigger');
    const backdrop = document.querySelector('.demo-backdrop');

    if (panelOpen) {
      panel.classList.add('active');
      trigger.classList.add('active');
      backdrop.classList.add('active');
    } else {
      panel.classList.remove('active');
      trigger.classList.remove('active');
      backdrop.classList.remove('active');
    }
  };

  // ---------- Update Active States ----------

  const updateActiveStates = () => {
    // Swatches
    document.querySelectorAll('.demo-swatch').forEach(el => {
      el.classList.toggle('active', el.dataset.scheme === state.colorScheme);
    });

    // Fonts
    document.querySelectorAll('.demo-font-btn').forEach(el => {
      el.classList.toggle('active', el.dataset.font === state.fontPair);
    });

    // Layouts
    document.querySelectorAll('.demo-layout-btn').forEach(el => {
      el.classList.toggle('active', el.dataset.layout === state.layout);
    });
  };

  // ---------- Reset ----------

  const resetAll = () => {
    sessionStorage.removeItem(STORAGE_KEY);

    state = {
      colorScheme: 'classic',
      fontPair: 'playfair-inter',
      layout: 'standard',
      shopName: "Shaw's",
      shopNameFull: "Shaw's Family Butchers",
      phone: '01928 561869',
      address: '39 Church Street, Runcorn, WA7 1LX',
      tagline: 'Quality Meats, Crafted With Care',
    };

    // Clear inline CSS variables
    const root = document.documentElement;
    [
      '--color-primary', '--color-primary-dark', '--color-primary-light',
      '--color-accent', '--color-accent-light',
      '--color-bg', '--color-bg-alt', '--color-text', '--color-text-light', '--color-border',
      '--primary', '--accent', '--text-primary', '--text-secondary', '--bg-warm', '--border',
      '--font-heading', '--font-body',
      '--color-hero-bg-1', '--color-hero-bg-2',
    ].forEach(prop => root.style.removeProperty(prop));

    document.body.style.fontFamily = '';
    document.body.classList.remove('layout-magazine', 'layout-compact');

    // Restore dark mode if active
    const saved = localStorage.getItem('shaws-dark-mode');
    if (saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Reset inputs
    const panel = document.getElementById('demoPanel');
    if (panel) {
      panel.querySelector('#demoShopName').value = state.shopName;
      panel.querySelector('#demoShopNameFull').value = state.shopNameFull;
      panel.querySelector('#demoPhone').value = state.phone;
      panel.querySelector('#demoAddress').value = state.address;
      panel.querySelector('#demoTagline').value = state.tagline;
    }

    applyTextEdits();
    updateActiveStates();
  };

  // ---------- Helpers ----------

  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // ---------- Init ----------

  const init = () => {
    loadState();
    buildPanel();

    // Inject animated glow blobs in the homepage hero background dynamically
    const heroBg = document.querySelector('section.hero .hero-bg');
    if (heroBg && !heroBg.querySelector('.hero-glow-container')) {
      const glowContainer = document.createElement('div');
      glowContainer.className = 'hero-glow-container';
      glowContainer.innerHTML = `
        <div class="hero-glow-blob hero-glow-blob-1"></div>
        <div class="hero-glow-blob hero-glow-blob-2"></div>
        <div class="hero-glow-blob hero-glow-blob-3"></div>
      `;
      heroBg.appendChild(glowContainer);
    }

    // Apply saved state
    if (state.colorScheme !== 'classic') {
      applyColorScheme(state.colorScheme);
    }
    if (state.fontPair !== 'playfair-inter') {
      applyFontPair(state.fontPair);
    }
    if (state.layout !== 'standard') {
      applyLayout(state.layout);
    }

    // Listen to dark mode toggle to reset custom color scheme if enabled
    const darkToggle = document.getElementById('darkToggle');
    if (darkToggle) {
      darkToggle.addEventListener('click', () => {
        if (state.colorScheme !== 'classic') {
          // Reset scheme to classic since dark mode is being toggled
          state.colorScheme = 'classic';
          saveState();
          
          // Remove inline CSS variables to let dark/light styles apply correctly
          const root = document.documentElement;
          [
            '--color-primary', '--color-primary-dark', '--color-primary-light',
            '--color-accent', '--color-accent-light',
            '--color-bg', '--color-bg-alt', '--color-text', '--color-text-light', '--color-border',
            '--primary', '--accent', '--text-primary', '--text-secondary', '--bg-warm', '--border',
            '--color-hero-bg-1', '--color-hero-bg-2',
          ].forEach(prop => root.style.removeProperty(prop));
          
          updateActiveStates();
        }
      });
    }

    // Apply text edits if they differ from defaults
    applyTextEdits();
    updateActiveStates();
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API (for console debugging)
  return {
    applyColorScheme,
    applyFontPair,
    applyLayout,
    resetAll,
    getState: () => ({ ...state }),
  };
})();
