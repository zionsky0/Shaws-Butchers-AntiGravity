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
    },
    // ——— NEW SCHEMES ———
    {
      id: 'midnight',
      name: 'Midnight Luxe',
      primary: '#1E1B4B',
      primaryDark: '#0F0D2E',
      primaryLight: '#3730A3',
      accent: '#F59E0B',
      accentLight: '#FCD34D',
      bg: '#0F172A',
      bgAlt: '#1E293B',
      text: '#E2E8F0',
      textLight: '#94A3B8',
      border: '#334155',
      heroBg1: '#020617',
      heroBg2: '#0F172A',
      isDark: true,
    },
    {
      id: 'neon-night',
      name: 'Neon Night',
      primary: '#7C3AED',
      primaryDark: '#5B21B6',
      primaryLight: '#A78BFA',
      accent: '#06D6A0',
      accentLight: '#34D399',
      bg: '#0A0A0F',
      bgAlt: '#141420',
      text: '#E4E4F0',
      textLight: '#9898B0',
      border: '#2A2A3D',
      heroBg1: '#050510',
      heroBg2: '#0F0F2B',
      isDark: true,
    },
    {
      id: 'sunset',
      name: 'Golden Sunset',
      primary: '#DC2626',
      primaryDark: '#991B1B',
      primaryLight: '#EF4444',
      accent: '#F97316',
      accentLight: '#FB923C',
      bg: '#FFFBEB',
      bgAlt: '#FEF3C7',
      text: '#451A03',
      textLight: '#92400E',
      border: '#FDE68A',
      heroBg1: '#1C0505',
      heroBg2: '#3B0D0D',
    },
    {
      id: 'arctic',
      name: 'Arctic Frost',
      primary: '#0EA5E9',
      primaryDark: '#0369A1',
      primaryLight: '#38BDF8',
      accent: '#F43F5E',
      accentLight: '#FB7185',
      bg: '#F0F9FF',
      bgAlt: '#E0F2FE',
      text: '#0C4A6E',
      textLight: '#0284C7',
      border: '#BAE6FD',
      heroBg1: '#031525',
      heroBg2: '#082F49',
    },
    {
      id: 'rose-gold',
      name: 'Rosé Gold',
      primary: '#BE185D',
      primaryDark: '#9D174D',
      primaryLight: '#EC4899',
      accent: '#D4A853',
      accentLight: '#E8C97A',
      bg: '#FFF1F2',
      bgAlt: '#FFE4E6',
      text: '#4C0519',
      textLight: '#9F1239',
      border: '#FECDD3',
      heroBg1: '#1A0510',
      heroBg2: '#350A1F',
    },
    {
      id: 'forest',
      name: 'Deep Forest',
      primary: '#166534',
      primaryDark: '#14532D',
      primaryLight: '#22C55E',
      accent: '#CA8A04',
      accentLight: '#FACC15',
      bg: '#052E16',
      bgAlt: '#14532D',
      text: '#DCFCE7',
      textLight: '#86EFAC',
      border: '#166534',
      heroBg1: '#022C22',
      heroBg2: '#052E16',
      isDark: true,
    },
    {
      id: 'ember',
      name: 'Ember & Smoke',
      primary: '#EA580C',
      primaryDark: '#C2410C',
      primaryLight: '#F97316',
      accent: '#78350F',
      accentLight: '#92400E',
      bg: '#1C1917',
      bgAlt: '#292524',
      text: '#FED7AA',
      textLight: '#FDBA74',
      border: '#44403C',
      heroBg1: '#0C0A09',
      heroBg2: '#1C1917',
      isDark: true,
    },
    {
      id: 'lavender',
      name: 'Lavender Dream',
      primary: '#7E22CE',
      primaryDark: '#6B21A8',
      primaryLight: '#A855F7',
      accent: '#EC4899',
      accentLight: '#F472B6',
      bg: '#FAF5FF',
      bgAlt: '#F3E8FF',
      text: '#3B0764',
      textLight: '#6B21A8',
      border: '#E9D5FF',
      heroBg1: '#1E0338',
      heroBg2: '#2E1065',
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      primary: '#171717',
      primaryDark: '#0A0A0A',
      primaryLight: '#404040',
      accent: '#D4D4D4',
      accentLight: '#E5E5E5',
      bg: '#FAFAFA',
      bgAlt: '#F5F5F5',
      text: '#171717',
      textLight: '#737373',
      border: '#D4D4D4',
      heroBg1: '#0A0A0A',
      heroBg2: '#171717',
    },
    {
      id: 'copper',
      name: 'Aged Copper',
      primary: '#B45309',
      primaryDark: '#92400E',
      primaryLight: '#D97706',
      accent: '#365314',
      accentLight: '#4D7C0F',
      bg: '#FFFBEB',
      bgAlt: '#FEF3C7',
      text: '#422006',
      textLight: '#854D0E',
      border: '#FDE68A',
      heroBg1: '#1C1205',
      heroBg2: '#362107',
    },
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
    // ——— NEW FONT PAIRS ———
    {
      id: 'clash-satoshi',
      name: 'Clash + Satoshi',
      heading: "'Sora', -apple-system, BlinkMacSystemFont, sans-serif",
      body: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap',
      previewHeading: 'Sora',
      previewBody: 'Space Grotesk',
    },
    {
      id: 'fraunces-cabinet',
      name: 'Fraunces + Cabinet',
      heading: "'Fraunces', Georgia, serif",
      body: "'Cabinet Grotesk', 'Plus Jakarta Sans', -apple-system, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
      previewHeading: 'Fraunces',
      previewBody: 'Plus Jakarta Sans',
    },
    {
      id: 'crimson-manrope',
      name: 'Crimson + Manrope',
      heading: "'Crimson Pro', Georgia, serif",
      body: "'Manrope', -apple-system, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap',
      previewHeading: 'Crimson Pro',
      previewBody: 'Manrope',
    },
    {
      id: 'bebas-poppins',
      name: 'Bebas + Poppins',
      heading: "'Bebas Neue', Impact, sans-serif",
      body: "'Poppins', -apple-system, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;500;600;700&display=swap',
      previewHeading: 'Bebas Neue',
      previewBody: 'Poppins',
    },
    {
      id: 'merriweather-nunito',
      name: 'Merriweather + Nunito',
      heading: "'Merriweather', Georgia, serif",
      body: "'Nunito Sans', -apple-system, sans-serif",
      url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Nunito+Sans:wght@400;500;600;700&display=swap',
      previewHeading: 'Merriweather',
      previewBody: 'Nunito Sans',
    },
  ];

  const LAYOUTS = [
    { id: 'standard', name: 'Standard', icon: 'standard' },
    { id: 'magazine', name: 'Magazine', icon: 'magazine' },
    { id: 'compact', name: 'Compact', icon: 'compact' },
    // ——— NEW LAYOUTS ———
    { id: 'editorial', name: 'Editorial', icon: 'editorial' },
    { id: 'cinematic', name: 'Cinematic', icon: 'cinematic' },
    { id: 'brutalist', name: 'Brutalist', icon: 'brutalist' },
    { id: 'elegant', name: 'Elegant', icon: 'elegant' },
    { id: 'grid-heavy', name: 'Grid Heavy', icon: 'grid-heavy' },
  ];

  // ——— NEW: Design Styles ———
  const DESIGN_STYLES = [
    { id: 'none', name: 'Default', emoji: '✨' },
    { id: 'glassmorphism', name: 'Glassmorphism', emoji: '🪟' },
    { id: 'neon-glow', name: 'Neon Glow', emoji: '💡' },
    { id: 'retro-grain', name: 'Retro Grain', emoji: '📺' },
    { id: 'floating-cards', name: 'Float Cards', emoji: '🎈' },
    { id: 'soft-shadows', name: 'Soft Shadows', emoji: '☁️' },
    { id: 'morphism-3d', name: '3D Depth', emoji: '🧊' },
    { id: 'gradient-mesh', name: 'Gradient Mesh', emoji: '🌈' },
    { id: 'paper-cut', name: 'Paper Cut', emoji: '✂️' },
    { id: 'aurora', name: 'Aurora', emoji: '🌌' },
  ];

  const STORAGE_KEY = 'shaws_demo_mode';

  // ---------- State ----------

  let state = {
    colorScheme: 'classic',
    fontPair: 'playfair-inter',
    layout: 'standard',
    designStyle: 'none',
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
        '--color-white', '--color-text-inv',
      ].forEach(prop => root.style.removeProperty(prop));

      // Restore dark mode if it was active
      const saved = localStorage.getItem('shaws-dark-mode');
      if (saved === 'true' || (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
      body.classList.remove('demo-dark-scheme');
    } else {
      // For custom schemes, remove dark-mode to ensure correct rendering of light-themed preset
      body.classList.remove('dark-mode');

      // If scheme is inherently dark, add a helper class
      if (scheme.isDark) {
        body.classList.add('demo-dark-scheme');
      } else {
        body.classList.remove('demo-dark-scheme');
      }

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

      if (scheme.isDark) {
        root.style.setProperty('--color-white', scheme.bgAlt);
        root.style.setProperty('--color-text-inv', '#f5f5f5');
      }

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
    document.body.classList.remove(
      'layout-magazine', 'layout-compact', 'layout-editorial',
      'layout-cinematic', 'layout-brutalist', 'layout-elegant', 'layout-grid-heavy'
    );

    // Add the new one (standard = no class)
    if (id !== 'standard') {
      document.body.classList.add(`layout-${id}`);
    }

    saveState();
    updateActiveStates();
  };

  const applyDesignStyle = (id) => {
    if (!DESIGN_STYLES.find(d => d.id === id)) return;

    state.designStyle = id;

    // Remove all design style classes
    document.body.classList.remove(
      'design-glassmorphism', 'design-neon-glow', 'design-retro-grain',
      'design-floating-cards', 'design-soft-shadows', 'design-morphism-3d',
      'design-gradient-mesh', 'design-paper-cut', 'design-aurora'
    );

    // Add the new one (none = no class)
    if (id !== 'none') {
      document.body.classList.add(`design-${id}`);
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
          <div class="demo-section-title">Colour Scheme <span class="demo-section-count">${COLOR_SCHEMES.length}</span></div>
          <div class="demo-swatches" id="demoSwatches"></div>
        </div>

        <!-- Design Styles -->
        <div class="demo-section">
          <div class="demo-section-title">Design Style <span class="demo-section-count">${DESIGN_STYLES.length}</span></div>
          <div class="demo-design-styles" id="demoDesignStyles"></div>
        </div>

        <!-- Layout -->
        <div class="demo-section">
          <div class="demo-section-title">Layout Style <span class="demo-section-count">${LAYOUTS.length}</span></div>
          <div class="demo-layouts" id="demoLayouts"></div>
        </div>

        <!-- Font Pairs -->
        <div class="demo-section">
          <div class="demo-section-title">Font Pairing <span class="demo-section-count">${FONT_PAIRS.length}</span></div>
          <div class="demo-fonts" id="demoFonts"></div>
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

    // Populate design styles
    const designContainer = panel.querySelector('#demoDesignStyles');
    DESIGN_STYLES.forEach(ds => {
      const btn = document.createElement('button');
      btn.className = 'demo-design-btn';
      btn.dataset.design = ds.id;
      btn.innerHTML = `
        <span class="demo-design-emoji">${ds.emoji}</span>
        <span class="demo-design-label">${ds.name}</span>
      `;
      btn.addEventListener('click', () => applyDesignStyle(ds.id));
      designContainer.appendChild(btn);
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

    // Design styles
    document.querySelectorAll('.demo-design-btn').forEach(el => {
      el.classList.toggle('active', el.dataset.design === state.designStyle);
    });
  };

  // ---------- Reset ----------

  const resetAll = () => {
    sessionStorage.removeItem(STORAGE_KEY);

    state = {
      colorScheme: 'classic',
      fontPair: 'playfair-inter',
      layout: 'standard',
      designStyle: 'none',
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
      '--color-white', '--color-text-inv',
    ].forEach(prop => root.style.removeProperty(prop));

    document.body.style.fontFamily = '';
    document.body.classList.remove(
      'layout-magazine', 'layout-compact', 'layout-editorial',
      'layout-cinematic', 'layout-brutalist', 'layout-elegant', 'layout-grid-heavy',
      'design-glassmorphism', 'design-neon-glow', 'design-retro-grain',
      'design-floating-cards', 'design-soft-shadows', 'design-morphism-3d',
      'design-gradient-mesh', 'design-paper-cut', 'design-aurora',
      'demo-dark-scheme'
    );

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
    if (state.designStyle !== 'none') {
      applyDesignStyle(state.designStyle);
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
            '--color-white', '--color-text-inv',
          ].forEach(prop => root.style.removeProperty(prop));

          document.body.classList.remove('demo-dark-scheme');
          
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
    applyDesignStyle,
    resetAll,
    getState: () => ({ ...state }),
  };
})();
