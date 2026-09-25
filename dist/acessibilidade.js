/**
 * Allyada - Assistente Pessoal de Acessibilidade Digital & Tecnologia Assistiva
 * "Acessibilidade para você — Navegue com autonomia, conforto e clareza"
 * 
 * Versão 3.0 — Tecnologia Assistiva & Personalização da Experiência do Usuário
 * 
 * Focado exclusivamente em:
 * ✓ Acessibilidade real e autonomia do usuário
 * ✓ Tecnologia assistiva de ponta (Síntese de voz TTS, VLibras, Régua e Máscara)
 * ✓ Percepção visual (Contraste escuro/claro/mono/inversão e Daltonismo)
 * ✓ Leitura e cognição (Fonte amigável Lexend, entrelinhas, espaçamento e alinhamento)
 * ✓ Navegação segura por teclado, foco reforçado e varredura de títulos H1-H3
 * ✓ Estabilidade total: isolamento de cabeçalhos/menus e zero mutação do DOM do host
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exportsObj = factory();
    root.Allyada = exportsObj;
    root.AcessiWeb = exportsObj;
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const STORAGE_KEY = 'allyada_state_v1';
  const LEGACY_KEY = 'acessiweb_preferences';
  const REMEMBER_KEY = 'allyada_remember_prefs';

  const DEFAULT_CONFIG = {
    position: 'right',
    primaryColor: '#7956c2',
    accentColor: '#ffab00',
    shortcutKey: 'a',
    enableShortcut: true,
    enableSpeech: true,
    enableVLibras: true,
    speechLang: 'pt-BR',
    autoInit: true
  };

  const DEFAULT_STATE = {
    activeTab: 'foryou', // 'foryou', 'settings'
    activeProfile: null, // 'focus', 'zoom', 'reading', 'colors', 'motion'
    colorblindType: 'none', // 'none', 'deuteranopia', 'protanopia', 'tritanopia'
    fontSizeLevel: 0, // 0 a 6 (100%, 115%, 130%, 145%, 160%, 180%, 200%)
    lineHeightLevel: 0, // 0 a 2 (Normal, Confortável 1.9x, Amplo 2.3x)
    letterSpacingLevel: 0, // 0 a 2 (Normal, Médio +0.08em, Amplo +0.16em)
    wordSpacingLevel: 0, // 0 a 1 (Normal, Amplo +0.12em)
    wcagSpacing: false, // Espaçamento WCAG 1.4.12
    dyslexicFont: false, // Fonte Lexend
    textAlignLeft: false,
    contrast: 'normal', // 'normal', 'dark', 'light', 'monochrome', 'invert'
    highlightLinks: false,
    highlightColor: '#f59e0b',
    cursorSize: 'normal', // 'normal', 'large', 'xlarge'
    cursorColor: '#000000',
    stopAnimations: false,
    readingGuideMode: 'none', // 'none', 'ruler', 'mask'
    enhancedFocus: false,
    virtualKeyboard: false,
    speechRate: 1.0, // 0.75, 1.0, 1.25, 1.5, 2.0
    uiScale: '1',
    vlibrasActive: false,
    vlibrasAvatar: 'hosana', // 'hosana', 'icaro', 'guga'
    rememberPreferences: true,
    enableShortcut: true
  };

  // SVGs de Ícones Acessíveis
  const ICONS = {
    allyada: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4.8" stroke-linecap="butt" stroke-linejoin="round" aria-hidden="true"><path d="M13.8 30.2A40 40 0 0 1 86.2 30.2"/><path d="M9.3 47.4A40 40 0 0 0 20.2 77.5"/><path d="M90.7 47.4A40 40 0 0 1 79.8 77.5"/><path d="M35.5 88.2A40 40 0 0 0 64.5 88.2"/><path d="M15.8 40.5Q50 58 84.2 40.5"/><path d="M30.8 79.2L49.2 49.5L50.8 49.5L69.2 79.2"/><circle cx="50" cy="29.5" r="10.2" fill="rgba(255,255,255,0.35)"/><circle cx="11.5" cy="38.5" r="5.2" fill="rgba(255,255,255,0.35)"/><circle cx="88.5" cy="38.5" r="5.2" fill="rgba(255,255,255,0.35)"/><circle cx="28" cy="83.5" r="5.2" fill="rgba(255,255,255,0.35)"/><circle cx="72" cy="83.5" r="5.2" fill="rgba(255,255,255,0.35)"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`,
    sound: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    play: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    stop: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12"></rect></svg>`,
    brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"></path></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    glasses: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="15" r="4"></circle><circle cx="18" cy="15" r="4"></circle><path d="M14 15a2 2 0 0 0-4 0"></path><path d="M2.5 13 5 7c.7-1.3 1.9-2 3.5-2"></path><path d="M21.5 13 19 7c-.7-1.3-1.9-2-3.5-2"></path></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    type: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
    alignLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>`,
    contrast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"></path></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    rotate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 8.7 8.7 21.3c-1 1-2.6 1-3.6 0l-1.4-1.4c-1-1-1-2.6 0-3.6L16.3 3.7c1-1 2.6-1 3.6 0l1.4 1.4c1 1 1 2.6 0 3.6z"></path></svg>`,
    cursor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 7 18 3-7 7-3L3 3z"></path></svg>`,
    target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    headings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="18" y2="18"></line></svg>`,
    skip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 12 19 19 12"></polyline><line x1="12" y1="5" x2="12" y2="19"></line></svg>`,
    hands: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M7.34 1.23L7.74 1.39L7.92 1.66L8.79 6.93L8.92 7.29L9.19 7.50L9.42 7.42L9.56 7.12L10.56 2.03L10.75 1.82L11.12 1.80L11.57 2.15L11.25 8.46L9.41 9.11L8.04 9.38L7.51 9.90L7.34 10.48L7.41 11.01L7.66 11.46L8.50 12.11L9.64 12.42L11.35 12.46L10.51 13.95L8.76 16.29L6.86 16.34L5.93 15.63L5.22 14.14L4.41 10.71L1.87 6.67L1.61 6.04L1.80 5.69L2.29 5.70L4.83 8.64L5.15 8.83L5.50 8.74L5.42 8.00L3.46 3.42L3.57 2.97L4.07 2.82L4.44 3.15L6.51 7.17L6.80 7.57L7.07 7.62L7.18 6.89L6.79 1.75L6.95 1.41ZM15.84 7.75L16.81 7.74L17.35 7.90L18.50 8.94L19.84 9.74L20.24 10.59L20.30 11.32L20.05 12.56L18.82 15.93L18.64 21.18L18.22 21.47L17.95 21.41L17.80 21.17L17.35 17.42L17.14 16.99L16.91 16.87L16.68 17.03L16.52 17.42L15.71 21.94L15.43 22.66L14.89 22.73L14.62 22.40L15.12 17.51L14.95 16.98L14.59 17.18L12.21 21.39L11.83 22.06L11.47 22.20L11.03 22.05L10.88 21.46L13.10 16.49L13.17 16.12L13.02 15.87L12.56 16.00L8.96 19.64L8.47 19.72L8.11 19.16L8.27 18.75L11.86 13.95L12.53 12.53L12.62 11.68L12.38 11.37L12.02 11.23L9.29 11.22L8.77 10.99L8.46 10.55L8.64 10.34L9.62 10.22L11.61 9.56L14.50 8.17ZM20.69 9.56L20.88 9.56L21.03 9.75L21.35 10.83L21.34 11.61L21.08 12.50L20.83 12.37L21.00 10.88ZM21.93 9.76L22.18 9.95L22.40 10.98L22.24 12.12L21.97 12.74L21.76 12.62L22.05 11.27L21.82 9.92ZM4.37 15.25L4.55 15.31L5.41 16.70L6.33 17.37L6.26 17.58L5.61 17.29L4.98 16.72L4.33 15.63L4.26 15.38ZM3.51 15.60L3.70 15.71L4.43 17.17L5.24 17.86L5.17 18.13L4.58 17.77L3.81 16.84L3.42 15.90Z"/></svg>`,
    spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    tools: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    dock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    remove: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
    keyboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="6" y1="12" x2="6.01" y2="12"></line><line x1="10" y1="12" x2="10.01" y2="12"></line><line x1="14" y1="12" x2="14.01" y2="12"></line><line x1="18" y1="12" x2="18.01" y2="12"></line><line x1="7" y1="16" x2="17" y2="16"></line></svg>`
  };

  class AllyadaPlugin {
    constructor() {
      this.config = { ...DEFAULT_CONFIG };
      this.state = { ...DEFAULT_STATE };
      this.hostContainer = null;
      this.shadowRoot = null;
      this.readingGuideElement = null;
      this.readingMaskElement = null;
      this.svgFiltersContainer = null;
      this.speechSynthesizer = null;
      this.speechUtterance = null;
      this.currentSpeakingNode = null;
      this.isSpeaking = false;
      this.isSpeechPaused = false;
      this.isOpen = false;
      this.previousFocusedElement = null;
      this.guideRafId = null;
      this.mouseY = 0;
      this.panelKeyDownHandler = null;
    }

    init(options = {}) {
      if (this.hostContainer) return this;

      const normalizedOptions = { ...options };
      if (normalizedOptions.primaryColor && normalizedOptions.primaryColor.toLowerCase() === '#0052cc') {
        normalizedOptions.primaryColor = '#7956c2';
      }
      this.config = { ...this.config, ...normalizedOptions };
      this.loadState();
      this.injectHostStyles();
      this.injectSvgFilters();
      this.injectSkipLink();
      this.createReadingGuideDOM();
      this.createWidgetDOM();
      this.initSpeechSynthesis();
      this.setupGlobalShortcuts();
      this.setupIframeBridge();

      this.applyAllStateChanges();
      this.updatePanelUI();

      console.log('[Allyada v3.0] Assistente de Acessibilidade & Tecnologia Assistiva carregado com sucesso.');
      return this;
    }

    loadState() {
      try {
        // Impede que o VLibras abra sozinho ao carregar a página devido ao cache interno '@vlibras-widget'
        try {
          const vlStorage = localStorage.getItem('@vlibras-widget');
          if (vlStorage && vlStorage.includes('"isOpen":true')) {
            localStorage.setItem('@vlibras-widget', vlStorage.replace('"isOpen":true', '"isOpen":false'));
          }
        } catch (err) {}

        const rememberSetting = localStorage.getItem(REMEMBER_KEY);
        const shouldRemember = rememberSetting === null ? true : rememberSetting === 'true';
        if (!shouldRemember) {
          this.state.rememberPreferences = false;
          this.syncVLibrasAvatar(this.state.vlibrasAvatar);
          return;
        }

        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Migração de campos legados
          if (parsed.bigCursor && !parsed.cursorSize) parsed.cursorSize = 'large';
          if (parsed.readingRuler && !parsed.readingGuideMode) parsed.readingGuideMode = 'ruler';
          if (parsed.activeProfile === 'adhd' || parsed.activeProfile === 'concentration') parsed.activeProfile = 'focus';
          if (parsed.activeProfile === 'low-vision') parsed.activeProfile = 'zoom';
          if (parsed.activeProfile === 'dyslexia') parsed.activeProfile = 'reading';
          if (parsed.activeProfile === 'colorblind') parsed.activeProfile = 'colors';
          if (parsed.activeProfile === 'epilepsy') parsed.activeProfile = 'motion';
          
          delete parsed.autoRemediate;
          delete parsed.lastAuditScore;
          delete parsed.enableComplianceTab;
          delete parsed.autoRemediation;

          if (!['hosana', 'icaro', 'guga'].includes(parsed.vlibrasAvatar)) {
            parsed.vlibrasAvatar = 'hosana';
          }

          // Players ativos (TTS e VLibras) iniciam desativados ao abrir a página, abrindo apenas sob comando do usuário
          this.state = { ...DEFAULT_STATE, ...parsed, vlibrasActive: false, rememberPreferences: true };
        } else {
          // Detecção de prefers-reduced-motion no dispositivo
          if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.state.stopAnimations = true;
          }
        }
        this.syncVLibrasAvatar(this.state.vlibrasAvatar);
      } catch (e) {
        console.warn('[Allyada] Erro ao carregar preferências:', e);
      }
    }

    saveState() {
      try {
        if (this.state.rememberPreferences) {
          localStorage.setItem(REMEMBER_KEY, 'true');
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } else {
          localStorage.setItem(REMEMBER_KEY, 'false');
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(LEGACY_KEY);
        }
      } catch (e) {
        console.warn('[Allyada] Erro ao salvar preferências:', e);
      }
    }

    resetState() {
      this.stopSpeech();
      this.hideVLibras();
      const currentTab = this.state.activeTab;
      const remember = this.state.rememberPreferences;
      this.state = { ...DEFAULT_STATE, activeTab: currentTab, rememberPreferences: remember };
      this.saveState();
      this.applyAllStateChanges();
      this.updatePanelUI();
    }

    /**
     * WCAG 2.4.1 (Bypass Blocks): Injeta link de salto com foco suave e visível
     */
    injectSkipLink() {
      if (document.getElementById('allyada-skip-link')) return;

      const skip = document.createElement('a');
      skip.id = 'allyada-skip-link';
      skip.href = '#main-content';
      skip.textContent = 'Pular para o conteúdo principal';
      skip.setAttribute('data-allyada-ignore', 'true');
      skip.style.cssText = `
        position: fixed;
        top: -100px;
        left: 16px;
        padding: 12px 20px;
        background: #7956c2;
        color: #ffffff;
        font-weight: 700;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        text-decoration: none;
        border-radius: 8px;
        z-index: 2147483647;
        box-shadow: 0 4px 16px rgba(0,0,0,0.35);
        outline: 3px solid #ffab00;
        transition: top 0.2s ease;
      `;
      skip.addEventListener('focus', () => { skip.style.top = '16px'; });
      skip.addEventListener('blur', () => { skip.style.top = '-100px'; });
      skip.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToMainContent();
      });

      document.documentElement.appendChild(skip);

      const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('article');
      if (main && !main.id) {
        main.id = 'main-content';
      }
    }

    /**
     * Scroll suave e foco acessível para o conteúdo principal
     */
    scrollToMainContent() {
      const target = document.querySelector('#main-content') || 
                     document.querySelector('main') || 
                     document.querySelector('[role="main"]') || 
                     document.querySelector('#content') || 
                     document.querySelector('article') || 
                     document.querySelector('h1');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus();
      }
    }

    injectSvgFilters(targetDoc = document) {
      if (!targetDoc || !targetDoc.documentElement) return;
      if (targetDoc.getElementById('allyada-svg-filters')) return;

      const svg = targetDoc.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'allyada-svg-filters';
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('data-allyada-ignore', 'true');
      svg.style.cssText = 'position: absolute; width: 0; height: 0; pointer-events: none; overflow: hidden;';
      svg.innerHTML = `
        <defs>
          <filter id="allyada-filter-deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0"/>
          </filter>
          <filter id="allyada-filter-protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0"/>
          </filter>
          <filter id="allyada-filter-tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0"/>
          </filter>
        </defs>
      `;
      targetDoc.documentElement.appendChild(svg);
      if (targetDoc === document) {
        this.svgFiltersContainer = svg;
      }
    }

    injectHostStyles(targetDoc = document) {
      if (!targetDoc || !targetDoc.documentElement) return;
      if (targetDoc.getElementById('allyada-host-styles')) return;

      const style = targetDoc.createElement('style');
      style.id = 'allyada-host-styles';
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');

        /* Ocultação Acessível para Leitores de Tela (Screen Reader Only) */
        .allyada-sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        /* Espaçamento de Linhas (WCAG 1.4.12) com isolamento de headers/menus */
        html.ally-line-height-1 :is(p, article p, blockquote, dd, .article-text):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-line-height-1 :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          line-height: 1.9 !important;
        }

        html.ally-line-height-2 :is(p, article p, blockquote, dd, .article-text):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-line-height-2 :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          line-height: 2.3 !important;
        }

        /* Espaçamento de Letras (WCAG 1.4.12) */
        html.ally-letter-spacing-1 :is(p, article, blockquote, h1, h2, h3, h4):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-letter-spacing-1 :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          letter-spacing: 0.08em !important;
        }

        html.ally-letter-spacing-2 :is(p, article, blockquote, h1, h2, h3, h4):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-letter-spacing-2 :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          letter-spacing: 0.16em !important;
        }

        /* Espaçamento de Palavras (WCAG 1.4.12) */
        html.ally-word-spacing-1 :is(p, article, blockquote, h1, h2, h3, h4):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-word-spacing-1 :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          word-spacing: 0.12em !important;
        }

        /* Fonte para Dislexia (Lexend) */
        html.ally-dyslexic-font body,
        html.ally-dyslexic-font body *:not(#allyada-root):not(#allyada-root *) {
          font-family: 'Lexend', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        /* Alinhamento à Esquerda */
        html.ally-text-align-left :is(p, article p, blockquote, dd, .article-text):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-text-align-left :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          text-align: left !important;
        }

        /* Alto Contraste Escuro */
        html.ally-contrast-dark body,
        html.ally-contrast-dark body *:not(#allyada-root):not(#allyada-root *):not(.allyada-reading-ruler):not([vw]):not([vw] *),
        html.ally-contrast-dark body *[id]:not(#allyada-root):not(#allyada-root *):not(.allyada-reading-ruler):not([vw]):not([vw] *),
        html.ally-contrast-dark body *[class]:not(#allyada-root):not(#allyada-root *):not(.allyada-reading-ruler):not([vw]):not([vw] *) {
          background-color: #121212 !important;
          color: #ffffff !important;
          border-color: #333333 !important;
        }
        /* Preservar imagens no Modo Escuro */
        html.ally-contrast-dark body img:not([vw] *),
        html.ally-contrast-dark body video:not([vw] *),
        html.ally-contrast-dark body picture:not([vw] *) {
          filter: brightness(0.8) contrast(1.2) !important;
        }
        html.ally-contrast-dark header,
        html.ally-contrast-dark nav,
        html.ally-contrast-dark main,
        html.ally-contrast-dark article,
        html.ally-contrast-dark aside,
        html.ally-contrast-dark footer,
        html.ally-contrast-dark .article-card,
        html.ally-contrast-dark .sidebar-widget,
        html.ally-contrast-dark [class*="card"],
        html.ally-contrast-dark [class*="panel"],
        html.ally-contrast-dark [class*="widget"] {
          background-color: #1a1b20 !important;
          color: #f8fafc !important;
          border-color: #3f3f46 !important;
        }
        html.ally-contrast-dark .hero-banner {
          background: #18181b !important;
          color: #ffffff !important;
          border-bottom: 2px solid #3f3f46 !important;
        }
        html.ally-contrast-dark h1,
        html.ally-contrast-dark h2,
        html.ally-contrast-dark h3,
        html.ally-contrast-dark h4 {
          color: #fde047 !important;
        }
        html.ally-contrast-dark p,
        html.ally-contrast-dark li,
        html.ally-contrast-dark label {
          color: #f1f5f9 !important;
        }
        html.ally-contrast-dark a {
          color: #38bdf8 !important;
          text-decoration: underline !important;
        }
        html.ally-contrast-dark input,
        html.ally-contrast-dark textarea,
        html.ally-contrast-dark select {
          background-color: #27272a !important;
          color: #ffffff !important;
          border-color: #52525b !important;
        }

        /* Alto Contraste Claro */
        html.ally-contrast-light,
        html.ally-contrast-light body,
        html.ally-contrast-light body *:not(#allyada-root):not(#allyada-root *):not(.allyada-reading-ruler):not([vw]):not([vw] *),
        html.ally-contrast-light body *[id]:not(#allyada-root):not(#allyada-root *):not(.allyada-reading-ruler):not([vw]):not([vw] *),
        html.ally-contrast-light body *[class]:not(#allyada-root):not(#allyada-root *):not(.allyada-reading-ruler):not([vw]):not([vw] *) {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #000000 !important;
        }
        html.ally-contrast-light header,
        html.ally-contrast-light nav,
        html.ally-contrast-light main,
        html.ally-contrast-light article,
        html.ally-contrast-light aside,
        html.ally-contrast-light footer,
        html.ally-contrast-light section,
        html.ally-contrast-light [class*="card"],
        html.ally-contrast-light [class*="panel"] {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #000000 !important;
        }
        html.ally-contrast-light h1,
        html.ally-contrast-light h2,
        html.ally-contrast-light h3,
        html.ally-contrast-light h4,
        html.ally-contrast-light p,
        html.ally-contrast-light li,
        html.ally-contrast-light span {
          color: #000000 !important;
        }
        html.ally-contrast-light a {
          color: #0000ee !important;
          text-decoration: underline !important;
          font-weight: 700 !important;
        }

        /* Monocromático */
        html.ally-contrast-monochrome body {
          filter: grayscale(100%) !important;
        }

        /* Inversão Inteligente */
        html.ally-contrast-invert body {
          filter: invert(100%) hue-rotate(180deg) !important;
          background-color: #ffffff !important;
        }
        html.ally-contrast-invert body img,
        html.ally-contrast-invert body video,
        html.ally-contrast-invert body picture,
        html.ally-contrast-invert body canvas {
          filter: invert(100%) hue-rotate(180deg) !important;
        }

        /* Filtros de Daltonismo */
        html.ally-filter-deuteranopia body {
          filter: url('#allyada-filter-deuteranopia') !important;
        }
        html.ally-filter-protanopia body {
          filter: url('#allyada-filter-protanopia') !important;
        }
        html.ally-filter-tritanopia body {
          filter: url('#allyada-filter-tritanopia') !important;
        }

        /* Destaque de Links */
        html.ally-highlight-links a:not([data-allyada-ignore]):not(#allyada-root *),
        html.ally-highlight-links [role="button"]:not([data-allyada-ignore]):not(#allyada-root *) {
          outline: 3px solid var(--allyada-highlight-color, #f59e0b) !important;
          outline-offset: 3px !important;
          text-decoration: underline 3px var(--allyada-highlight-color, #f59e0b) !important;
          text-underline-offset: 4px !important;
          font-weight: 700 !important;
          border-radius: 3px !important;
        }

        /* Cursor Ampliado - Grande (64px, sem borda branca) */
        html.ally-cursor-large,
        html.ally-cursor-large * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M2 1.5V21.5L7.6 15.9L11.2 22.8L14.3 21.2L10.7 14.3H18.5L2 1.5Z'/%3E%3C/svg%3E") 5 3, auto !important;
        }

        /* Hover para Modo TTS (Point and Read) */
        .allyada-tts-hover-target {
          outline: 3px dashed #7956c2 !important;
          outline-offset: 2px !important;
          background-color: rgba(121, 86, 194, 0.1) !important;
          cursor: pointer !important;
        }

        /* Cursor Ampliado - Extra Grande (96px, sem borda branca) */
        html.ally-cursor-xlarge,
        html.ally-cursor-xlarge * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M2 1.5V21.5L7.6 15.9L11.2 22.8L14.3 21.2L10.7 14.3H18.5L2 1.5Z'/%3E%3C/svg%3E") 8 5, auto !important;
        }

        /* Foco Visual de Teclado Reforçado (WCAG 2.2 — 2.4.13 Focus Appearance / AAA) */
        html.ally-enhanced-focus *:focus,
        html.ally-enhanced-focus *:focus-visible {
          outline: 3px solid #000000 !important;
          outline-offset: 2px !important;
          box-shadow: 0 0 0 5px #ffffff, 0 0 10px rgba(0, 0, 0, 0.5) !important;
          border-radius: 4px !important;
        }

        /* Espaçamento Acessível WCAG 1.4.12 */
        html.ally-wcag-spacing :is(p, h1, h2, h3, h4, h5, h6, li, blockquote, dd, dt, a, span, label, input, textarea, button):not(#allyada-root *):not([vw] *) {
          line-height: 1.5 !important;
          letter-spacing: 0.12em !important;
          word-spacing: 0.16em !important;
        }
        html.ally-wcag-spacing p:not(#allyada-root *):not([vw] *) {
          margin-bottom: 2em !important;
        }

        /* Pausar Animações (WCAG 2.2.2) */
        html.ally-stop-animations *,
        html.ally-stop-animations *::before,
        html.ally-stop-animations *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          scroll-behavior: auto !important;
        }

        /* Destaque Visual Durante Leitura em Voz Alta (TTS) */
        .allyada-reading-highlight {
          background-color: #fef08a !important;
          color: #000000 !important;
          outline: 3px solid #f59e0b !important;
          outline-offset: 2px !important;
          border-radius: 4px !important;
          transition: background-color 0.2s ease !important;
        }

        /* Destaque Temporário de Navegação por Título */
        .allyada-heading-target-highlight {
          outline: 3px solid #2563eb !important;
          outline-offset: 4px !important;
          background: rgba(37, 99, 235, 0.12) !important;
          border-radius: 4px !important;
          transition: all 0.3s ease !important;
        }

        /* Posicionamento do VLibras */
        div[vw] [vw-access-button] {
          bottom: 96px !important;
          ${this.config.position === 'right' ? 'right: 24px !important; left: auto !important;' : 'left: 24px !important; right: auto !important;'}
          top: auto !important;
          z-index: 2147483644 !important;
          transition: transform 0.2s ease !important;
        }
        div[vw] [vw-access-button]:hover {
          transform: scale(1.08) !important;
        }
      `;
      (targetDoc.head || targetDoc.documentElement).appendChild(style);
    }

    /**
     * Descobre todos os iframes acessíveis (mesma origem ou srcdoc) na página,
     * ignorando containers internos do próprio Allyada ou do VLibras.
     */
    getAccessibleIframes() {
      const results = [];
      try {
        const iframes = Array.from(document.querySelectorAll('iframe'));
        for (const iframe of iframes) {
          if (
            iframe.closest('#allyada-root') ||
            iframe.closest('[data-allyada-ignore]') ||
            iframe.closest('[vw]')
          ) {
            continue;
          }
          try {
            const doc = iframe.contentDocument;
            const win = iframe.contentWindow;
            if (doc && doc.documentElement && win) {
              results.push({ iframe, doc, win });
            }
          } catch (err) {
            // Iframe cross-origin: tratado via postMessage bridge
          }
        }
      } catch (e) {}
      return results;
    }

    /**
     * Retorna o documento principal + todos os documentos de iframes acessíveis
     */
    getAllAccessibleDocuments() {
      return [{ iframe: null, doc: document, win: window }, ...this.getAccessibleIframes()];
    }

    /**
     * Configura sincronização automática com iframes (mesma origem, srcdoc e cross-origin via postMessage),
     * além de observar novos iframes inseridos dinamicamente no DOM.
     */
    setupIframeBridge() {
      const scanAndBindIframes = () => {
        const allIframes = Array.from(document.querySelectorAll('iframe'));
        allIframes.forEach(iframe => {
          if (
            iframe.closest('#allyada-root') ||
            iframe.closest('[data-allyada-ignore]') ||
            iframe.closest('[vw]')
          ) {
            return;
          }
          this.bindSingleIframe(iframe);
        });
      };

      scanAndBindIframes();

      // Observa iframes adicionados dinamicamente após o carregamento da página
      if (typeof MutationObserver !== 'undefined' && document.documentElement) {
        this.iframeObserver = new MutationObserver((mutations) => {
          let foundIframe = false;
          for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length > 0) {
              for (const node of m.addedNodes) {
                if (node.nodeType === 1 && (node.tagName === 'IFRAME' || (node.querySelector && node.querySelector('iframe')))) {
                  foundIframe = true;
                  break;
                }
              }
            }
            if (foundIframe) break;
          }
          if (foundIframe) {
            scanAndBindIframes();
          }
        });
        this.iframeObserver.observe(document.documentElement, { childList: true, subtree: true });
      }

      // Ponte postMessage para iframes Cross-Origin que também carreguem o Allyada
      window.addEventListener('message', (e) => {
        const data = e.data;
        if (!data || typeof data !== 'object') return;

        if (data.type === 'ALLYADA_SYNC_STATE' && window.self !== window.top) {
          // Quando rodando dentro de um iframe filho, oculta o FAB duplicado e aplica o estado do pai
          if (this.hostContainer) {
            this.hostContainer.style.display = 'none';
          }
          const prevFontLevel = this.state.fontSizeLevel;
          this.state = { ...this.state, ...data.state };
          if (prevFontLevel !== this.state.fontSizeLevel) {
            this.lastFontSizeLevel = -1;
          }
          this.applyAllStateChanges();
        } else if (data.type === 'ALLYADA_IFRAME_READY' && e.source) {
          try {
            e.source.postMessage({ type: 'ALLYADA_SYNC_STATE', state: this.state }, '*');
          } catch (err) {}
        }
      });

      if (window.self !== window.top) {
        try {
          window.parent.postMessage({ type: 'ALLYADA_IFRAME_READY' }, '*');
        } catch (err) {}
      }
    }

    /**
     * Vincula estilos, filtros SVG, eventos de régua/máscara, teclado virtual e atalhos a um iframe.
     */
    bindSingleIframe(iframe) {
      if (!iframe) return;

      const syncIframeContent = () => {
        try {
          const doc = iframe.contentDocument;
          const win = iframe.contentWindow;
          if (!doc || !doc.documentElement || !win) return;

          this.injectSvgFilters(doc);
          this.injectHostStyles(doc);

          if (!doc.documentElement.dataset.allyadaEventsBound) {
            doc.documentElement.dataset.allyadaEventsBound = 'true';

            // 1. Movimento do mouse/toque dentro do iframe atualiza a Régua de Leitura e Máscara na página pai
            win.addEventListener('mousemove', (e) => {
              if (this.updateReadingGuidePosition) {
                const rect = iframe.getBoundingClientRect();
                this.updateReadingGuidePosition(rect.top + e.clientY);
              }
            }, { passive: true });

            win.addEventListener('touchmove', (e) => {
              if (e.touches && e.touches[0] && this.updateReadingGuidePosition) {
                const rect = iframe.getBoundingClientRect();
                this.updateReadingGuidePosition(rect.top + e.touches[0].clientY);
              }
            }, { passive: true });

            // 2. Foco dentro do iframe: move a Régua e aciona o Teclado Virtual se for campo de texto
            doc.addEventListener('focusin', (e) => {
              if (this.state.readingGuideMode !== 'none' && e.target && typeof e.target.getBoundingClientRect === 'function' && this.updateReadingGuidePosition) {
                const iRect = iframe.getBoundingClientRect();
                const tRect = e.target.getBoundingClientRect();
                if (tRect.height > 0) {
                  this.updateReadingGuidePosition(iRect.top + tRect.top + (tRect.height / 2));
                }
              }
              if (this.virtualKeyboardActive && this.vkFocusHandler) {
                this.vkFocusHandler(e);
              }
            }, { passive: true });

            // 3. Atalhos globais (Alt + A e Escape) funcionando mesmo quando o foco está dentro do iframe
            win.addEventListener('keydown', (e) => {
              const isAltA = e.altKey && !e.ctrlKey && !e.metaKey && e.key && e.key.toLowerCase() === (this.config.shortcutKey || 'a').toLowerCase();
              if (isAltA && this.state.enableShortcut !== false) {
                const tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
                const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable);
                if (!isInput) {
                  e.preventDefault();
                  this.togglePanel();
                }
              } else if (e.key === 'Escape' && this.isOpen) {
                e.preventDefault();
                this.closePanel();
              }
            });
          }

          // Força reaplicação do estado e tamanho de fonte no iframe recém-carregado
          this.lastFontSizeLevel = -1;
          this.applyAllStateChanges();
        } catch (err) {
          // Se for cross-origin, tenta sincronizar via postMessage
          try {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'ALLYADA_SYNC_STATE', state: this.state }, '*');
            }
          } catch (e) {}
        }
      };

      if (!iframe.dataset.allyadaLoadBound) {
        iframe.dataset.allyadaLoadBound = 'true';
        iframe.addEventListener('load', syncIframeContent);
      }

      syncIframeContent();
    }

    createReadingGuideDOM() {
      if (document.getElementById('allyada-reading-ruler')) return;

      // 1. Régua de leitura (faixa horizontal com bordas âmbar)
      const ruler = document.createElement('div');
      ruler.id = 'allyada-reading-ruler';
      ruler.setAttribute('aria-hidden', 'true');
      ruler.setAttribute('data-allyada-ignore', 'true');
      ruler.style.cssText = `
        display: none;
        position: fixed;
        left: 0;
        right: 0;
        height: 42px;
        background: rgba(254, 240, 138, 0.38);
        border-top: 3px solid #f59e0b;
        border-bottom: 3px solid #f59e0b;
        box-shadow: 0 0 24px rgba(245, 158, 11, 0.3);
        pointer-events: none !important;
        z-index: 2147483640;
        transform: translateY(-50%);
        will-change: top;
      `;
      document.documentElement.appendChild(ruler);
      this.readingGuideElement = ruler;

      // 2. Máscara de foco na leitura (cortinas escuras superior e inferior, com vão central limpo)
      const mask = document.createElement('div');
      mask.id = 'allyada-reading-mask';
      mask.setAttribute('aria-hidden', 'true');
      mask.setAttribute('data-allyada-ignore', 'true');
      mask.style.cssText = `
        display: none;
        position: fixed;
        inset: 0;
        pointer-events: none !important;
        z-index: 2147483639;
        overflow: hidden;
      `;
      mask.innerHTML = `
        <div id="allyada-mask-top" style="position: absolute; top: 0; left: 0; right: 0; height: 50vh; background: rgba(0, 0, 0, 0.62); pointer-events: none !important;"></div>
        <div id="allyada-mask-window" style="position: absolute; top: 50vh; left: 0; right: 0; height: 56px; transform: translateY(-50%); border-top: 2px solid rgba(255,255,255,0.4); border-bottom: 2px solid rgba(255,255,255,0.4); box-shadow: 0 0 20px rgba(0,0,0,0.5); pointer-events: none !important;"></div>
        <div id="allyada-mask-bottom" style="position: absolute; bottom: 0; left: 0; right: 0; height: 50vh; background: rgba(0, 0, 0, 0.62); pointer-events: none !important;"></div>
      `;
      document.documentElement.appendChild(mask);
      this.readingMaskElement = mask;

      const onPointerMove = (clientY) => {
        this.mouseY = clientY;
        if (!this.guideRafId && this.state.readingGuideMode !== 'none') {
          this.guideRafId = requestAnimationFrame(() => {
            if (this.state.readingGuideMode === 'ruler' && this.readingGuideElement) {
              this.readingGuideElement.style.top = `${this.mouseY}px`;
            } else if (this.state.readingGuideMode === 'mask' && this.readingMaskElement) {
              const slitHeight = 56;
              const topCurtain = this.readingMaskElement.querySelector('#allyada-mask-top');
              const maskWindow = this.readingMaskElement.querySelector('#allyada-mask-window');
              const botCurtain = this.readingMaskElement.querySelector('#allyada-mask-bottom');

              if (topCurtain && maskWindow && botCurtain) {
                const topH = Math.max(0, this.mouseY - (slitHeight / 2));
                topCurtain.style.height = `${topH}px`;
                maskWindow.style.top = `${topH + (slitHeight / 2)}px`;
                botCurtain.style.top = `${topH + slitHeight}px`;
                botCurtain.style.height = `calc(100vh - ${topH + slitHeight}px)`;
              }
            }
            this.guideRafId = null;
          });
        }
      };
      this.updateReadingGuidePosition = onPointerMove;

      window.addEventListener('mousemove', (e) => onPointerMove(e.clientY), { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) onPointerMove(e.touches[0].clientY);
      }, { passive: true });
      // Acessibilidade por Teclado: move a régua suavemente para o elemento focado via Tab
      document.addEventListener('focusin', (e) => {
        if (this.state.readingGuideMode === 'none') return;
        if (e.target && typeof e.target.getBoundingClientRect === 'function') {
          const rect = e.target.getBoundingClientRect();
          if (rect.height > 0) {
            onPointerMove(rect.top + (rect.height / 2));
          }
        }
      }, { passive: true });
    }

    createWidgetDOM() {
      this.hostContainer = document.createElement('div');
      this.hostContainer.id = 'allyada-root';
      this.hostContainer.setAttribute('data-allyada-container', 'true');
      this.hostContainer.setAttribute('data-allyada-ignore', 'true');
      
      this.shadowRoot = this.hostContainer.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = this.getShadowStyles();
      this.shadowRoot.appendChild(style);

      const wrapper = document.createElement('div');
      wrapper.className = `allyada-wrapper pos-${this.config.position}`;
      wrapper.innerHTML = `
        <!-- Botão Flutuante de Abertura (WAI-ARIA APG Launcher) -->
        <button type="button" 
                class="allyada-fab" 
                id="allyada-trigger-btn"
                aria-label="Abrir painel de preferências de acessibilidade (Alt + A)"
                aria-haspopup="dialog"
                aria-controls="allyada-panel"
                aria-expanded="false"
                title="Allyada — Acessibilidade e Preferências (Alt + A)">
          <span class="fab-icon">${ICONS.allyada}</span>
          <span class="fab-badge" aria-hidden="true" id="allyada-active-count">0</span>
        </button>

        <!-- Região Live para Anúncios Acessíveis -->
        <div id="allyada-live-announcer" class="allyada-sr-only" aria-live="polite" aria-atomic="true"></div>

        <!-- Drawer Lateral Flutuante -->
        <div class="allyada-drawer" 
             id="allyada-panel" 
             role="dialog" 
             aria-modal="true" 
             aria-labelledby="allyada-title"
             aria-hidden="true">
          
          <!-- Header do Widget -->
          <div class="drawer-header">
            <div class="header-brand-group">
              <div class="brand-badge-icon" aria-hidden="true">${ICONS.allyada}</div>
              <div class="brand-text">
                <div class="title-row">
                  <h2 id="allyada-title">Allyada</h2>
                  <span class="active-badge-pill" id="header-active-badge" style="display:none;">0 ativos</span>
                </div>
                <span class="brand-sub">Acessibilidade para você</span>
              </div>
            </div>
            <div class="header-actions-group">
              <button type="button" class="btn-header-action" id="btn-header-vlibras" title="Ativar Tradutor de Libras (VLibras)" aria-label="Ativar Tradutor de Libras">
                ${ICONS.hands}
              </button>
              <button type="button" class="btn-header-action" id="btn-toggle-dock" title="Mover painel para esquerda/direita" aria-label="Mover painel para outro lado">
                ${ICONS.dock}
              </button>
              <button type="button" class="btn-icon-close" id="allyada-close-btn" aria-label="Fechar painel de acessibilidade (Esc)" title="Fechar (Esc)">
                ${ICONS.close}
              </button>
            </div>
          </div>

          <!-- Navegação por Abas (role="tablist") -->
          <div class="suite-tabs" role="tablist" aria-label="Abas de recursos de acessibilidade">
            <button type="button" class="suite-tab-btn active" id="tab-btn-foryou" role="tab" aria-selected="true" aria-controls="tab-content-foryou" title="Acesso rápido e recursos">
              <span class="tab-icon">${ICONS.spark}</span>
              <span>Início</span>
            </button>
            <button type="button" class="suite-tab-btn" id="tab-btn-settings" role="tab" aria-selected="false" aria-controls="tab-content-settings" title="Preferências e atalhos">
              <span class="tab-icon">${ICONS.settings}</span>
              <span>Configurações</span>
            </button>
          </div>

          <!-- ABA 1: PARA VOCÊ (ACESSO RÁPIDO & PERFIS HUMANOS) -->
          <div class="drawer-tab-content active" id="tab-content-foryou" role="tabpanel" aria-labelledby="tab-btn-foryou">
            <div class="tab-scroll-body">
              
              <!-- Acesso Rápido (Modo Simples) -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Acesso Rápido</h3>
                  <span class="pill-badge">Mais Usados</span>
                </div>

                <div class="quick-grid">
                  <button type="button" class="quick-tile" id="quick-font-size" aria-pressed="false" title="Aumenta o tamanho de todas as letras do site em até 60%">
                    <div class="tile-icon">${ICONS.type}</div>
                    <span class="tile-label">Texto Maior</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-contrast" aria-pressed="false" title="Aplica um fundo escuro e letras claras para não cansar a vista">
                    <div class="tile-icon">${ICONS.moon}</div>
                    <span class="tile-label">Alto Contraste</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-links" aria-pressed="false" title="Destaca todos os botões e links clicáveis com uma cor forte">
                    <div class="tile-icon">${ICONS.link}</div>
                    <span class="tile-label">Destacar Links</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-tts" aria-pressed="false" title="Leitura em voz alta da página">
                    <div class="tile-icon">${ICONS.sound}</div>
                    <span class="tile-label" id="quick-tts-label">Ouvir Página</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-motion" aria-pressed="false" title="Pausa animações, vídeos de fundo e transições que causam tontura">
                    <div class="tile-icon">${ICONS.zap}</div>
                    <span class="tile-label">Menos Movimento</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-cursor" aria-pressed="false" title="Troca o mouse por um cursor gigante e fácil de não perder de vista">
                    <div class="tile-icon">${ICONS.cursor}</div>
                    <span class="tile-label">Cursor Maior</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-dyslexic" aria-pressed="false" title="Aplica a família tipográfica Lexend, com maior espaçamento e legibilidade">
                    <div class="tile-icon">${ICONS.book}</div>
                    <span class="tile-label">Fonte Lexend</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-focus" aria-pressed="false" title="Destaca o elemento atual selecionado com o teclado, facilitando a navegação sem mouse">
                    <div class="tile-icon">${ICONS.target}</div>
                    <span class="tile-label">Foco Reforçado</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-vk" aria-pressed="false" title="Exibe um teclado virtual compacto na tela ao clicar em qualquer campo de texto">
                    <div class="tile-icon">${ICONS.keyboard}</div>
                    <span class="tile-label">Teclado Virtual</span>
                  </button>
                </div>

                <!-- Painel do Player TTS Rápido (Aparece SOMENTE ao ouvir a página) -->
                <div id="tts-quick-controls" class="tts-player-panel" style="display: none; margin-top: 8px;">
                  <div class="tts-status-row">
                    <span class="tts-pulse-indicator" aria-hidden="true"></span>
                    <span class="tts-status-text" id="q-tts-status-text">Lendo conteúdo em voz alta...</span>
                  </div>
                  <div class="tts-controls-row">
                    <button type="button" class="btn-tts-action primary" id="btn-q-tts-play-pause">
                      <span class="tts-icon" id="q-tts-play-icon">${ICONS.pause}</span>
                      <strong id="q-tts-play-label">Pausar</strong>
                    </button>
                    <button type="button" class="btn-tts-action stop" id="btn-q-tts-stop" aria-label="Parar Leitura">
                      <span class="tts-icon">${ICONS.stop}</span>
                      <strong>Parar</strong>
                    </button>
                  </div>
                  <div class="tts-speed-row">
                    <span class="speed-label">Velocidade da Leitura:</span>
                    <div class="segmented-control tts-rates">
                      <button type="button" class="seg-btn" data-rate="0.75" id="q-rate-075">0.75x</button>
                      <button type="button" class="seg-btn active" data-rate="1" id="q-rate-100">1.0x</button>
                      <button type="button" class="seg-btn" data-rate="1.25" id="q-rate-125">1.25x</button>
                      <button type="button" class="seg-btn" data-rate="1.5" id="q-rate-150">1.5x</button>
                      <button type="button" class="seg-btn" data-rate="2" id="q-rate-200">2.0x</button>
                    </div>
                  </div>
                </div>

                
              </section>

              <!-- Modos de Apresentação -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Modos de Apresentação</h3>
                  <span class="pill-badge">Ajustes Rápidos</span>
                </div>
                
                <div class="profiles-grid">
                  <button type="button" class="profile-card" id="profile-focus" aria-pressed="false" title="Modo Foco: Régua de leitura, redução de movimento e espaçamento confortável">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.brain}</div>
                      <span class="card-tag">Foco</span>
                    </div>
                    <strong class="card-heading">Modo Foco</strong>
                    <p class="card-subtext">Régua de leitura, redução de movimento e espaçamento confortável.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-zoom" aria-pressed="false" title="Modo Ampliação: Texto ampliado (130%), alto contraste escuro, links destacados e cursor grande">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.glasses}</div>
                      <span class="card-tag">Zoom</span>
                    </div>
                    <strong class="card-heading">Modo Ampliação</strong>
                    <p class="card-subtext">Texto ampliado (130%), alto contraste escuro, links e cursor grande.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-reading" aria-pressed="false" title="Modo Leitura: Tipografia Lexend, entrelinhas confortável e alinhamento à esquerda">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.book}</div>
                      <span class="card-tag">Leitura</span>
                    </div>
                    <strong class="card-heading">Modo Leitura</strong>
                    <p class="card-subtext">Tipografia aberta Lexend, entrelinhas 1.9x e alinhamento à esquerda.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-colors" aria-pressed="false" title="Modo Cores: Simulação de visão de cores para percepção cromática">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.eye}</div>
                      <span class="card-tag">Cores</span>
                    </div>
                    <strong class="card-heading">Modo Cores</strong>
                    <p class="card-subtext">Simulação de visão de cores (Deuteranopia, Protanopia e Tritanopia).</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-motion" aria-pressed="false" title="Reduzir Movimento: Pausa animações CSS, reduz transições e pausa vídeos">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.zap}</div>
                      <span class="card-tag">Calma</span>
                    </div>
                    <strong class="card-heading">Reduzir Movimento</strong>
                    <p class="card-subtext">Pausa animações CSS, reduz transições e pausa vídeos compatíveis.</p>
                  </button>
                </div>

                <!-- Seletor de Tipo de Daltonismo (quando o perfil de cores está ativo) -->
                <div class="sub-selector-box" id="colorblind-selector-box" style="display: none;">
                  <span class="sub-selector-title">Simulação de Visão de Cores:</span>
                  <div class="segmented-control">
                    <button type="button" class="seg-btn active" data-type="deuteranopia" id="cb-deuteranopia">Deuteranopia</button>
                    <button type="button" class="seg-btn" data-type="protanopia" id="cb-protanopia">Protanopia</button>
                    <button type="button" class="seg-btn" data-type="tritanopia" id="cb-tritanopia">Tritanopia</button>
                  </div>
                </div>
              </section>

              <!-- Botão de Redefinir Visível (Pedido do Usuário) -->
              <section class="menu-section mt-3">
                <button type="button" class="btn-reset-all-full" id="btn-reset-foryou">
                  ${ICONS.rotate}
                  <span>Redefinir Todos os Ajustes</span>
                </button>
              </section>

            
<!-- INJECTED FROM TOOLS TAB -->

              <!-- 1. TIPOGRAFIA & LEITURA -->
              <section class="menu-section" data-section="typography">
                <div class="section-heading">
                  <h3>Tipografia & Leitura</h3>
                </div>

                <div class="control-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Tamanho do Texto</strong>
                      <span class="control-val" id="font-size-indicator">Normal (100%)</span>
                    </div>
                    <div class="stepper-actions">
                      <button type="button" class="btn-step" id="btn-font-decrease" aria-label="Diminuir tamanho do texto">-</button>
                      <button type="button" class="btn-step" id="btn-font-increase" aria-label="Aumentar tamanho do texto">+</button>
                    </div>
                  </div>
                  
                  <!-- Seletor direto de porcentagem (WCAG 1.4.4 até 200%) -->
                  <div class="segmented-control mt-2" id="font-size-segmented" role="group" aria-label="Escolher tamanho do texto">
                    <button type="button" class="seg-btn active" id="btn-fs-0">100%</button>
                    <button type="button" class="seg-btn" id="btn-fs-1">115%</button>
                    <button type="button" class="seg-btn" id="btn-fs-2">130%</button>
                    <button type="button" class="seg-btn" id="btn-fs-3">145%</button>
                    <button type="button" class="seg-btn" id="btn-fs-4">160%</button>
                    <button type="button" class="seg-btn" id="btn-fs-5">180%</button>
                    <button type="button" class="seg-btn" id="btn-fs-6">200%</button>
                  </div>

                  <!-- Slider para ajuste livre até 200% -->
                  <div class="slider-control-row mt-2" style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 12px; color: #64748b; font-weight: 600;">100%</span>
                    <input type="range" class="font-size-slider" id="slider-font-size" min="0" max="6" step="1" value="0" aria-label="Ajustar tamanho do texto" style="flex: 1; accent-color: var(--primary); cursor: pointer;">
                    <span style="font-size: 12px; color: #64748b; font-weight: 600;">200%</span>
                  </div>
                </div>

                <div class="control-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Espaçamento de Linhas</strong>
                      <span class="control-val" id="line-height-indicator">Normal</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-lh-0">Normal</button>
                    <button type="button" class="seg-btn" id="btn-lh-1">1.9x</button>
                    <button type="button" class="seg-btn" id="btn-lh-2">2.3x</button>
                  </div>
                </div>
                
                <div class="control-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Espaçamento de Letras</strong>
                      <span class="control-val" id="letter-spacing-indicator">Normal</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-ls-0">Normal</button>
                    <button type="button" class="seg-btn" id="btn-ls-1">Médio</button>
                    <button type="button" class="seg-btn" id="btn-ls-2">Amplo</button>
                  </div>
                </div>

                <div class="tools-grid mt-3">
                  <!-- Espaçamento Acessível WCAG 1.4.12 -->
                  <button type="button" class="tool-card full-width" id="card-wcag-spacing" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.type}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Espaçamento WCAG 1.4.12</strong>
                      <span class="tool-desc">Entrelinhas 1.5, letras 0.12em, palavras 0.16em e parágrafos 2em</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-word-spacing" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.type}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Separar Palavras</strong>
                      <span class="tool-desc">Mais respiro entre termos</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-text-align-left" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.alignLeft}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Alinhar à Esquerda</strong>
                      <span class="tool-desc">Evita texto justificado</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-dyslexic-font" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.book}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Fonte Lexend</strong>
                      <span class="tool-desc">Tipografia aberta e espaçada para maior legibilidade</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>

                
              </section>

              <!-- 2. FOCO & NAVEGAÇÃO -->
              <section class="menu-section" data-section="navigation">
                <div class="section-heading">
                  <h3>Foco & Navegação</h3>
                </div>

                <div class="structure-nav-group">
                  <button type="button" class="btn-action-tile" id="btn-toggle-headings" aria-expanded="false">
                    <span class="tile-icon-action">${ICONS.headings}</span>
                    <div class="tile-info-action">
                      <strong>Navegar pelos Títulos</strong>
                      <span id="headings-count-summary">Ver índice de cabeçalhos</span>
                    </div>
                  </button>

                  <div class="headings-drawer" id="headings-list-container" style="display:none;">
                    <ul class="headings-list-items" id="headings-items-ul"></ul>
                  </div>

                  <button type="button" class="btn-action-tile" id="btn-skip-to-main">
                    <span class="tile-icon-action">${ICONS.skip}</span>
                    <div class="tile-info-action">
                      <strong>Ir para o Conteúdo</strong>
                      <span>Pula direto para o texto principal</span>
                    </div>
                  </button>
                </div>

                <div class="tools-grid mt-3">
                  <button type="button" class="tool-card full-width" id="card-enhanced-focus" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.target}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Foco Reforçado</strong>
                      <span class="tool-desc">Anel luminoso ao usar a tecla TAB</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-highlight-links" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.link}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Destacar Links</strong>
                      <span class="tool-desc">Borda amarela visível</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                  
                  <button type="button" class="tool-card full-width" id="card-virtual-keyboard" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.keyboard}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Teclado Virtual</strong>
                      <span class="tool-desc">Exibe teclado na tela ao digitar</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>

                <div class="control-box mt-3">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Tamanho do Cursor</strong>
                      <span class="control-val" id="cursor-size-label">Normal</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-cursor-normal">Normal</button>
                    <button type="button" class="seg-btn" id="btn-cursor-large">Grande</button>
                    <button type="button" class="seg-btn" id="btn-cursor-xlarge">Extra</button>
                  </div>
                  
                  <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
                    <div class="setting-text mb-2" style="display: flex; justify-content: space-between; align-items: center;">
                      <span class="control-val" style="display: block; font-size: 13px; font-weight: 600;">Cor do Cursor</span>
                      <span id="cursor-color-hex" style="font-size: 12px; color: #64748b; font-family: monospace;">#000000</span>
                    </div>
                    <div class="color-presets" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                      <button type="button" class="color-preset-btn" data-color="#000000" aria-label="Preto" title="Preto" style="width: 30px; height: 30px; border-radius: 50%; background: #000000; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#7956c2" aria-label="Roxo" title="Roxo" style="width: 30px; height: 30px; border-radius: 50%; background: #7956c2; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#ffffff" aria-label="Branco" title="Branco" style="width: 30px; height: 30px; border-radius: 50%; background: #ffffff; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#facc15" aria-label="Amarelo" title="Amarelo" style="width: 30px; height: 30px; border-radius: 50%; background: #facc15; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#ef4444" aria-label="Vermelho" title="Vermelho" style="width: 30px; height: 30px; border-radius: 50%; background: #ef4444; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#0284c7" aria-label="Azul" title="Azul" style="width: 30px; height: 30px; border-radius: 50%; background: #0284c7; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#16a34a" aria-label="Verde" title="Verde" style="width: 30px; height: 30px; border-radius: 50%; background: #16a34a; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      
                      <!-- Seletor Livre de Cores (EqualWeb style) -->
                      <label class="custom-color-picker-label" title="Escolher qualquer cor personalizada" style="position: relative; width: 30px; height: 30px; border-radius: 50%; background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                        <input type="color" id="input-cursor-custom-color" value="#000000" aria-label="Escolher qualquer cor personalizada para o cursor" style="opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer;">
                        <span style="font-size: 11px; font-weight: 900; color: #fff; text-shadow: 0 0 3px #000; pointer-events: none;">+</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 3. CORES & CONTRASTE -->
              <section class="menu-section" data-section="colors">
                <div class="section-heading">
                  <h3>Cores & Contraste</h3>
                </div>

                <div class="tools-grid">
                  <button type="button" class="tool-card full-width" id="card-contrast-dark" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.moon}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Modo Escuro</strong>
                      <span class="tool-desc">Fundo escuro suave</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-contrast-light" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.sun}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Modo Claro</strong>
                      <span class="tool-desc">Fundo branco nítido</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-contrast-monochrome" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.contrast}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Monocromático</strong>
                      <span class="tool-desc">Tons de cinza</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-contrast-invert" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.refresh}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Inverter Cores</strong>
                      <span class="tool-desc">Inversão de alto contraste</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>

                <div class="control-box mt-3">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Simulação de Visão de Cores</strong>
                      <span class="control-val" id="colorblind-active-label">Padrão</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-cb-none">Padrão</button>
                    <button type="button" class="seg-btn" id="btn-cb-deuteranopia">Deuteranopia</button>
                    <button type="button" class="seg-btn" id="btn-cb-protanopia">Protanopia</button>
                    <button type="button" class="seg-btn" id="btn-cb-tritanopia">Tritanopia</button>
                  </div>
                </div>
              </section>

              <!-- 4. ASSISTÊNCIA DE TELA -->
              <section class="menu-section" data-section="assistive">
                <div class="section-heading">
                  <h3>Assistência de Tela</h3>
                </div>

                <div class="tools-grid">
                  <button type="button" class="tool-card full-width" id="card-tts-toggle" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.sound}</div>
                    <div class="tool-info">
                      <strong class="tool-title" id="card-tts-title">Ouvir Página</strong>
                      <span class="tool-desc" id="card-tts-desc">Leitura do conteúdo em voz alta</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <!-- Painel do Player TTS (Aparece SOMENTE ao ouvir a página) -->
                  <div class="tts-player-panel full-width" id="tts-player-panel" style="display: none;">
                    <div class="tts-status-row">
                      <span class="tts-pulse-indicator" aria-hidden="true"></span>
                      <span class="tts-status-text" id="tts-status-text">Lendo conteúdo em voz alta...</span>
                    </div>
                    <div class="tts-controls-row">
                      <button type="button" class="btn-tts-action primary" id="btn-tts-play-pause">
                        <span class="tts-icon" id="tts-play-icon">${ICONS.pause}</span>
                        <strong id="tts-play-label">Pausar</strong>
                      </button>
                      <button type="button" class="btn-tts-action stop" id="btn-tts-stop" aria-label="Parar Leitura">
                        <span class="tts-icon">${ICONS.stop}</span>
                        <strong>Parar</strong>
                      </button>
                    </div>
                    <div class="tts-speed-row">
                      <span class="speed-label">Velocidade da Leitura:</span>
                      <div class="segmented-control tts-rates">
                        <button type="button" class="seg-btn" data-rate="0.75" id="rate-075">0.75x</button>
                        <button type="button" class="seg-btn active" data-rate="1" id="rate-100">1.0x</button>
                        <button type="button" class="seg-btn" data-rate="1.25" id="rate-125">1.25x</button>
                        <button type="button" class="seg-btn" data-rate="1.5" id="rate-150">1.5x</button>
                        <button type="button" class="seg-btn" data-rate="2" id="rate-200">2.0x</button>
                      </div>
                    </div>
                  </div>

                  <button type="button" class="tool-card full-width" id="card-reading-ruler" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.ruler}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Régua de Leitura</strong>
                      <span class="tool-desc">Faixa guia horizontal</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-reading-mask" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.eye}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Máscara de Foco</strong>
                      <span class="tool-desc">Escurece o restante</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                  
                  <button type="button" class="tool-card full-width" id="card-stop-animations" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.pause}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Reduzir Movimento</strong>
                      <span class="tool-desc">Pausa animações CSS, transições e vídeos</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="vlibras-banner-card mt-2" id="card-vlibras-toggle" aria-pressed="false" style="width: 100%;">
                    <div class="vlibras-icon-box">${ICONS.hands}</div>
                    <div class="vlibras-info">
                      <strong>Língua de Sinais (Libras)</strong>
                      <span id="card-vlibras-desc">Ativar tradutor 3D • Intérprete: Hosana</span>
                    </div>
                    <div class="vlibras-status-pill" id="vlibras-status-pill">Desativado</div>
                  </button>

                  <div class="control-box mt-2" id="vlibras-avatar-box">
                    <div class="control-box-header">
                      <div>
                        <strong class="control-title">Intérprete VLibras (3D)</strong>
                        <span class="control-val" id="vlibras-avatar-label">Hosana</span>
                      </div>
                    </div>
                    <div class="segmented-control mt-2" role="group" aria-label="Escolher intérprete 3D do VLibras">
                      <button type="button" class="seg-btn active" id="btn-vlibras-hosana" data-avatar="hosana">Hosana</button>
                      <button type="button" class="seg-btn" id="btn-vlibras-icaro" data-avatar="icaro">Ícaro</button>
                      <button type="button" class="seg-btn" id="btn-vlibras-guga" data-avatar="guga">Guga</button>
                    </div>
                  </div>
                </div>
              </section>


</div>
          </div>

          <!-- ABA 2: TODAS AS FERRAMENTAS ASSISTIVAS -->
          <div class="drawer-tab-content" id="tab-content-tools" role="tabpanel" aria-labelledby="tab-btn-tools" style="display:none;">
            
            <!-- Campo de Busca Rápida -->
            <div class="search-box-wrapper">
              <div class="search-input-box">
                <span class="search-icon-svg">${ICONS.search}</span>
                <input type="text" id="allyada-search-input" class="search-input-field" placeholder="Buscar ferramenta (ex: fonte, foco, cursor)..." aria-label="Filtrar ferramentas de acessibilidade">
                <button type="button" class="search-clear-btn" id="btn-search-clear" style="display:none;" aria-label="Limpar pesquisa">&times;</button>
              </div>
            </div>

            <div class="tab-scroll-body">
<!-- MOVED TO FORYOU -->
</div>
          </div>

          <!-- ABA 3: CONFIGURAÇÕES, ATALHOS & AJUSTES ATIVOS -->
          <div class="drawer-tab-content" id="tab-content-settings" role="tabpanel" aria-labelledby="tab-btn-settings" style="display:none;">
            <div class="tab-scroll-body">
              
              <!-- Persistência de Preferências -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Preferências no Navegador</h3>
                </div>

                <div class="setting-item-row">
                  <div class="setting-text">
                    <strong>Lembrar minhas preferências neste site</strong>
                    <span>Salva suas escolhas automaticamente para suas próximas visitas.</span>
                  </div>
                  <label class="switch-toggle" for="chk-remember-preferences">
                    <input type="checkbox" id="chk-remember-preferences" checked aria-label="Lembrar minhas preferências neste site">
                    <span class="switch-slider"></span>
                  </label>
                </div>
              </section>

              <!-- Aparência do Widget -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Aparência do Painel e Cursor</h3>
                </div>

                <div class="setting-item-row" style="flex-direction: column; align-items: stretch; gap: 10px;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
                    <div class="setting-text">
                      <strong>Tamanho do Painel</strong>
                      <span>Ajusta o tamanho do widget de forma responsiva à sua tela.</span>
                    </div>
                    <select id="select-ui-scale" class="allyada-select" aria-label="Tamanho do Painel">
                      <option value="0.9">Compacto (90%)</option>
                      <option value="1">Normal (100%)</option>
                      <option value="1.15">Grande (115%)</option>
                      <option value="1.3">Muito Grande (130%)</option>
                    </select>
                  </div>
                  <div class="segmented-control" role="group" aria-label="Seleção rápida de tamanho do painel">
                    <button type="button" class="seg-btn" id="btn-scale-090" data-scale="0.9">Compacto</button>
                    <button type="button" class="seg-btn active" id="btn-scale-100" data-scale="1">Normal</button>
                    <button type="button" class="seg-btn" id="btn-scale-115" data-scale="1.15">Grande</button>
                    <button type="button" class="seg-btn" id="btn-scale-130" data-scale="1.3">Muito Grande</button>
                  </div>
                </div>
              </section>

              <!-- Guia de Atalhos de Teclado -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Atalhos Rápidos de Teclado</h3>
                </div>

                <div class="setting-item-row mb-3" style="margin-bottom: 12px;">
                  <div class="setting-text">
                    <strong>Habilitar atalho global Alt + A</strong>
                    <span>Desative caso o atalho colida com seu leitor de tela ou sistema operacional.</span>
                  </div>
                  <label class="switch-toggle" for="chk-enable-shortcut">
                    <input type="checkbox" id="chk-enable-shortcut" checked aria-label="Habilitar atalho de teclado Alt + A">
                    <span class="switch-slider"></span>
                  </label>
                </div>

                <div class="shortcuts-list">
                  <div class="shortcut-item">
                    <span>Abrir ou fechar o Allyada</span>
                    <div class="kbd-combo"><kbd>Alt</kbd> + <kbd>A</kbd></div>
                  </div>
                  <div class="shortcut-item">
                    <span>Fechar o painel com foco seguro</span>
                    <div class="kbd-combo"><kbd>Esc</kbd></div>
                  </div>
                  <div class="shortcut-item">
                    <span>Navegar pelos controles com foco visível</span>
                    <div class="kbd-combo"><kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd></div>
                  </div>
                </div>
              </section>

              <!-- Painel de Ajustes Ativos em Tempo Real -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Ajustes Ativos Neste Momento</h3>
                  <span class="pill-badge" id="settings-active-count-badge">0 ativos</span>
                </div>

                <div class="active-adjustments-list" id="active-adjustments-chips">
                  <!-- Gerado dinamicamente via JS com botões individuais de fechar (✕) -->
                </div>

                <div class="reset-all-box mt-3">
                  <button type="button" class="btn-reset-all-full" id="btn-reset-all">
                    <span class="btn-icon">${ICONS.reset}</span>
                    <span>Redefinir Tudo e Restaurar Padrão</span>
                  </button>
                </div>
              </section>

            </div>
          </div>

                    <!-- Barra Fixa com Botão Vermelho de Desfazer Preferências -->
          <div class="drawer-fixed-action-bar" id="drawer-fixed-action-bar">
            <button type="button" class="btn-reset-preferences-fixed" id="btn-reset-fixed" aria-label="Redefinir todas as preferências de acessibilidade" title="Redefinir todas as preferências e restaurar o padrão">
              <span class="btn-icon" style="display: flex;">${ICONS.reset}</span>
              <span>Redefinir preferências</span>
            </button>
          </div>

          <!-- Rodapé do Widget -->
          <div class="drawer-footer">
            <span class="shortcut-tip">Atalho: <kbd>Alt</kbd> + <kbd>A</kbd></span>
            <span class="footer-brand-tag">Allyada &bull; Acessibilidade para você</span>
          </div>

        </div>

        <div class="allyada-backdrop" id="allyada-backdrop" aria-hidden="true"></div>
      `;

      this.shadowRoot.appendChild(wrapper);
      document.documentElement.appendChild(this.hostContainer);

      this.bindPanelEvents();
    }

    bindPanelEvents() {
      const root = this.shadowRoot;

      // 1. Abrir / Fechar Painel
      const triggerBtn = root.getElementById('allyada-trigger-btn');
      if (triggerBtn) triggerBtn.addEventListener('click', () => this.togglePanel());

      const closeBtn = root.getElementById('allyada-close-btn');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closePanel());

      const backdrop = root.getElementById('allyada-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => this.closePanel());
      }

      // Fechar ao clicar fora no documento (preservando seleção para o TTS)
      document.addEventListener('click', (e) => {
        if (!this.isOpen) return;
        const path = e.composedPath ? e.composedPath() : [];
        if (path.includes(this.hostContainer) || (this.shadowRoot && path.includes(this.shadowRoot))) {
          return;
        }
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          return;
        }
        this.closePanel();
      });

      // 2. Navegação por Abas (Para você | Ferramentas | Configurações)
      const tabs = ['foryou', 'tools', 'settings'];
      tabs.forEach(tabKey => {
        const btn = root.getElementById(`tab-btn-${tabKey}`);
        if (!btn) return;
        btn.addEventListener('click', () => this.switchTab(tabKey));
      });

      

      // 3. Mover Doca (Esquerda / Direita)
      const dockBtn = root.getElementById('btn-toggle-dock');
      if (dockBtn) {
        dockBtn.addEventListener('click', () => this.toggleDockPosition());
      }

      // 4. Busca Instantânea nas Ferramentas
      const searchInput = root.getElementById('allyada-search-input');
      const searchClearBtn = root.getElementById('btn-search-clear');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          if (searchClearBtn) searchClearBtn.style.display = query ? 'flex' : 'none';

          const cards = root.querySelectorAll('#tab-content-tools .tool-card, #tab-content-tools .control-box, #tab-content-tools .structure-nav-group, #tab-content-tools .tts-player-panel, #tab-content-tools .vlibras-banner-card');
          cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const match = !query || text.includes(query);
            card.style.display = match ? '' : 'none';
          });

          root.querySelectorAll('#tab-content-tools .menu-section').forEach(sec => {
            const visible = sec.querySelectorAll('.tool-card:not([style*="display: none"]), .control-box:not([style*="display: none"]), .structure-nav-group:not([style*="display: none"]), .tts-player-panel:not([style*="display: none"]), .vlibras-banner-card:not([style*="display: none"])');
            sec.style.display = (visible.length > 0 || !query) ? '' : 'none';
          });
        });

        if (searchClearBtn) {
          searchClearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
          });
        }
      }

      // 5. Ações Rápidas (Modo Simples - Aba "Para você")
      const qFont = root.getElementById('quick-font-size');
      if (qFont) {
        qFont.addEventListener('click', () => {
          this.state.fontSizeLevel = (this.state.fontSizeLevel === 0) ? 2 : 0;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const qContrast = root.getElementById('quick-contrast');
      if (qContrast) {
        qContrast.addEventListener('click', () => {
          this.state.contrast = (this.state.contrast === 'dark') ? 'normal' : 'dark';
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const qLinks = root.getElementById('quick-links');
      if (qLinks) {
        qLinks.addEventListener('click', () => {
          this.state.highlightLinks = !this.state.highlightLinks;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const qTts = root.getElementById('quick-tts');
      if (qTts) {
        qTts.addEventListener('click', () => this.handleSpeechClick());
      }

      const qMotion = root.getElementById('quick-motion');
      if (qMotion) {
        qMotion.addEventListener('click', () => {
          this.state.stopAnimations = !this.state.stopAnimations;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const qCursor = root.getElementById('quick-cursor');
      if (qCursor) {
        qCursor.addEventListener('click', () => {
          this.state.cursorSize = (this.state.cursorSize === 'large') ? 'normal' : 'large';
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const qDyslexic = root.getElementById('quick-dyslexic');
      if (qDyslexic) {
        qDyslexic.addEventListener('click', () => {
          this.state.dyslexicFont = !this.state.dyslexicFont;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const qFocus = root.getElementById('quick-focus');
      if (qFocus) {
        qFocus.addEventListener('click', () => {
          this.state.enhancedFocus = !this.state.enhancedFocus;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const qVk = root.getElementById('quick-vk');
      if (qVk) {
        qVk.addEventListener('click', () => {
          this.state.virtualKeyboard = !this.state.virtualKeyboard;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      // 6. Perfis Humanos
      const bindProfile = (btnId, profileKey, applyFn) => {
        const btn = root.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', () => {
          if (this.state.activeProfile === profileKey) {
            this.state.activeProfile = null;
            this.resetState();
          } else {
            this.state = { 
              ...DEFAULT_STATE, 
              activeTab: this.state.activeTab, 
              rememberPreferences: this.state.rememberPreferences,
              activeProfile: profileKey 
            };
            applyFn();
            this.syncStateAndUI();
          }
        });
      };

      const bindBoth = (id1, id2, key, fn) => {
        bindProfile(id1, key, fn);
        if (id2) bindProfile(id2, key, fn);
      };

      bindBoth('profile-focus', 'profile-concentration', 'focus', () => {
        this.state.readingGuideMode = 'ruler';
        this.state.stopAnimations = true;
        this.state.lineHeightLevel = 1;
      });

      bindBoth('profile-zoom', 'profile-low-vision', 'zoom', () => {
        this.state.fontSizeLevel = 2;
        this.state.contrast = 'dark';
        this.state.cursorSize = 'large';
        this.state.highlightLinks = true;
      });

      bindBoth('profile-reading', null, 'reading', () => {
        this.state.dyslexicFont = true;
        this.state.lineHeightLevel = 1;
        this.state.textAlignLeft = true;
      });

      bindBoth('profile-colors', 'profile-colorblind', 'colors', () => {
        this.state.highlightLinks = true;
        if (this.state.colorblindType === 'none') {
          this.state.colorblindType = 'deuteranopia';
        }
      });

      bindBoth('profile-motion', null, 'motion', () => {
        this.state.stopAnimations = true;
      });

      // Seletor de Daltonismo dentro do perfil
      ['deuteranopia', 'protanopia', 'tritanopia'].forEach(type => {
        const pill = root.getElementById(`cb-${type}`);
        if (!pill) return;
        pill.addEventListener('click', () => {
          this.state.colorblindType = type;
          this.syncStateAndUI();
        });
      });

      // 7. Tipografia (Aba Ferramentas)
      const btnFontIncrease = root.getElementById('btn-font-increase');
      if (btnFontIncrease) {
        btnFontIncrease.addEventListener('click', () => {
          if (this.state.fontSizeLevel < 6) {
            this.state.fontSizeLevel++;
            this.state.activeProfile = null;
            this.syncStateAndUI();
          }
        });
      }

      const btnFontDecrease = root.getElementById('btn-font-decrease');
      if (btnFontDecrease) {
        btnFontDecrease.addEventListener('click', () => {
          if (this.state.fontSizeLevel > 0) {
            this.state.fontSizeLevel--;
            this.state.activeProfile = null;
            this.syncStateAndUI();
          }
        });
      }

      [0, 1, 2].forEach(level => {
        const btn = root.getElementById(`btn-lh-${level}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          this.state.lineHeightLevel = level;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      });

      [0, 1, 2].forEach(level => {
        const btn = root.getElementById(`btn-ls-${level}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          this.state.letterSpacingLevel = level;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      });

      const bindToggle = (id, stateKey) => {
        const el = root.getElementById(id);
        if (!el) return;
        el.addEventListener('click', () => {
          this.state[stateKey] = !this.state[stateKey];
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      };

      bindToggle('card-word-spacing', 'wordSpacingLevel');
      bindToggle('card-text-align-left', 'textAlignLeft');
      bindToggle('card-dyslexic-font', 'dyslexicFont');

      // 8. Cores e Contraste
      ['dark', 'light', 'monochrome', 'invert'].forEach(opt => {
        const el = root.getElementById(`card-contrast-${opt}`);
        if (!el) return;
        el.addEventListener('click', () => {
          this.state.contrast = (this.state.contrast === opt) ? 'normal' : opt;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      });

      // Filtros de Daltonismo na aba Ferramentas
      ['none', 'deuteranopia', 'protanopia', 'tritanopia'].forEach(type => {
        const btn = root.getElementById(`btn-cb-${type}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          this.state.colorblindType = type;
          this.syncStateAndUI();
        });
      });

      // 9. Navegação & Foco
      bindToggle('card-highlight-links', 'highlightLinks');
      bindToggle('card-enhanced-focus', 'enhancedFocus');

      // Régua vs Máscara de Leitura
      const cardRuler = root.getElementById('card-reading-ruler');
      if (cardRuler) {
        cardRuler.addEventListener('click', () => {
          this.state.readingGuideMode = (this.state.readingGuideMode === 'ruler') ? 'none' : 'ruler';
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const cardMask = root.getElementById('card-reading-mask');
      if (cardMask) {
        cardMask.addEventListener('click', () => {
          this.state.readingGuideMode = (this.state.readingGuideMode === 'mask') ? 'none' : 'mask';
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      // Cursor: Normal, Large, Xlarge
      ['normal', 'large', 'xlarge'].forEach(size => {
        const btn = root.getElementById(`btn-cursor-${size}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          this.state.cursorSize = size;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      });

      // Pular para o Conteúdo Principal
      const btnSkip = root.getElementById('btn-skip-to-main');
      if (btnSkip) {
        btnSkip.addEventListener('click', () => {
          this.scrollToMainContent();
          this.closePanel();
        });
      }

      // Navegar pelos Títulos da Página
      const btnHeadings = root.getElementById('btn-toggle-headings');
      if (btnHeadings) {
        btnHeadings.addEventListener('click', () => this.toggleHeadingsList());
      }

      // 10. Leitura em Voz Alta (TTS)
      const cardTts = root.getElementById('card-tts-toggle');
      if (cardTts) {
        cardTts.addEventListener('click', () => this.handleSpeechClick());
      }

      ['btn-tts-play-pause', 'btn-q-tts-play-pause'].forEach(id => {
        const btn = root.getElementById(id);
        if (btn) btn.addEventListener('click', () => this.toggleSpeechPause());
      });

      ['btn-tts-stop', 'btn-q-tts-stop'].forEach(id => {
        const btn = root.getElementById(id);
        if (btn) btn.addEventListener('click', () => this.stopSpeech());
      });

      const bindRates = (prefix) => {
        const rates = { '075': 0.75, '100': 1.0, '125': 1.25, '150': 1.5, '200': 2.0 };
        Object.entries(rates).forEach(([idPart, r]) => {
          const btn = root.getElementById(`${prefix}rate-${idPart}`);
          if (btn) {
            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              this.changeSpeechRate(r);
            });
          }
        });
      };
      bindRates('');
      bindRates('q-');

      // 11. Movimento
      bindToggle('card-stop-animations', 'stopAnimations');

      // 12. VLibras
      const toggleVLibras = () => {
        this.state.vlibrasActive = !this.state.vlibrasActive;
        this.saveState();
        if (this.state.vlibrasActive) {
          this.loadVLibras();
          this.closePanel();
        } else {
          this.hideVLibras();
        }
        this.updatePanelUI();
      };

      const vlibrasBtn = root.getElementById('card-vlibras-toggle');
      if (vlibrasBtn) vlibrasBtn.addEventListener('click', toggleVLibras);

      const headerVlibrasBtn = root.getElementById('btn-header-vlibras');
      if (headerVlibrasBtn) headerVlibrasBtn.addEventListener('click', toggleVLibras);

      ['hosana', 'icaro', 'guga'].forEach(av => {
        const btnAv = root.getElementById(`btn-vlibras-${av}`);
        if (btnAv) {
          btnAv.addEventListener('click', () => {
            this.setVLibrasAvatar(av);
          });
        }
      });

      // 13. Configurações: Lembrar Preferências & Atalho Alt + A
      const chkRemember = root.getElementById('chk-remember-preferences');
      if (chkRemember) {
        chkRemember.checked = this.state.rememberPreferences;
        chkRemember.addEventListener('change', (e) => {
          this.state.rememberPreferences = e.target.checked;
          this.saveState();
        });
      }

      const chkShortcut = root.getElementById('chk-enable-shortcut');
      if (chkShortcut) {
        chkShortcut.checked = this.state.enableShortcut !== false;
        chkShortcut.addEventListener('change', (e) => {
          this.state.enableShortcut = e.target.checked;
          this.saveState();
        });
      }

      // 14. Redefinir Tudo
      const resetBtn = root.getElementById('btn-reset-all');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetState());
      }
      const resetBtnForyou = root.getElementById('btn-reset-foryou');
      if (resetBtnForyou) {
        resetBtnForyou.addEventListener('click', () => this.resetState());
      }

      // 15. Teclado Virtual
      bindToggle('card-virtual-keyboard', 'virtualKeyboard');
      // 16. Configurações de Aparência (Tamanho do Painel responsivo à tela)
      const setWidgetScale = (val) => {
        this.state.uiScale = String(val);
        this.syncStateAndUI();
      };
      const selectUiScale = root.getElementById('select-ui-scale');
      if (selectUiScale) {
        selectUiScale.addEventListener('change', (e) => setWidgetScale(e.target.value));
      }
      ['090', '100', '115', '130'].forEach(code => {
        const btnScale = root.getElementById(`btn-scale-${code}`);
        if (btnScale) {
          btnScale.addEventListener('click', () => setWidgetScale(btnScale.getAttribute('data-scale')));
        }
      });
      window.addEventListener('resize', () => {
        this.applyResponsiveWidgetSize();
      });

      // Cor do cursor através dos presets ou seletor livre (EqualWeb style)
      const setCursorColor = (col) => {
        this.state.cursorColor = col;
        if (this.state.cursorSize === 'normal') {
          this.state.cursorSize = 'large';
        }
        this.state.activeProfile = null;
        this.applyDynamicStyles();
        this.syncStateAndUI();
      };

      const cursorColorBtns = root.querySelectorAll('.color-preset-btn');
      cursorColorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          setCursorColor(e.target.dataset.color);
        });
      });

      const customColorInput = root.getElementById('input-cursor-custom-color');
      if (customColorInput) {
        customColorInput.addEventListener('input', (e) => {
          setCursorColor(e.target.value);
        });
      }

      // Barra Fixa: Desfazer preferências
      const resetBtnFixed = root.getElementById('btn-reset-fixed');
      if (resetBtnFixed) {
        resetBtnFixed.addEventListener('click', () => this.resetState());
      }

      // Seletor direto de porcentagem de fonte (WCAG 1.4.4 até 200%)
      [0, 1, 2, 3, 4, 5, 6].forEach(lvl => {
        const btn = root.getElementById(`btn-fs-${lvl}`);
        if (btn) {
          btn.addEventListener('click', () => {
            this.state.fontSizeLevel = lvl;
            this.state.activeProfile = null;
            this.syncStateAndUI();
          });
        }
      });

      // Card de Espaçamento WCAG 1.4.12
      const cardWcag = root.getElementById('card-wcag-spacing');
      if (cardWcag) {
        cardWcag.addEventListener('click', () => {
          this.state.wcagSpacing = !this.state.wcagSpacing;
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }

      const fontSlider = root.getElementById('slider-font-size');
      if (fontSlider) {
        fontSlider.addEventListener('input', (e) => {
          this.state.fontSizeLevel = parseInt(e.target.value, 10);
          this.state.activeProfile = null;
          this.syncStateAndUI();
        });
      }


    }

    announce(msg) {
      if (!this.shadowRoot) return;
      const announcer = this.shadowRoot.getElementById('allyada-live-announcer');
      if (announcer) {
        announcer.textContent = '';
        setTimeout(() => { announcer.textContent = msg; }, 60);
      }
    }

    getCursorCssObject() {
      const rawColor = (this.state.cursorColor || '#000000').trim();
      const cColor = encodeURIComponent(rawColor);
      const isWhite = rawColor.toLowerCase() === '#ffffff' || rawColor.toLowerCase() === '#fff';
      const strokeAttr = isWhite ? " stroke='%231e293b' stroke-width='0.8'" : '';
      const pathD = 'M2 1.5V21.5L7.6 15.9L11.2 22.8L14.3 21.2L10.7 14.3H18.5L2 1.5Z';

      if (this.state.cursorSize === 'large') {
        const uri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24'%3E%3Cpath fill='${cColor}'${strokeAttr} d='${pathD}'/%3E%3C/svg%3E") 5 3, auto`;
        return {
          hostCss: `html.ally-cursor-large, html.ally-cursor-large * { cursor: ${uri} !important; }`,
          shadowCss: `:host, :host * { cursor: ${uri} !important; }`
        };
      }
      if (this.state.cursorSize === 'xlarge') {
        const uri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24'%3E%3Cpath fill='${cColor}'${strokeAttr} d='${pathD}'/%3E%3C/svg%3E") 8 5, auto`;
        return {
          hostCss: `html.ally-cursor-xlarge, html.ally-cursor-xlarge * { cursor: ${uri} !important; }`,
          shadowCss: `:host, :host * { cursor: ${uri} !important; }`
        };
      }
      return { hostCss: '', shadowCss: '' };
    }

    applyDynamicStyles() {
      let dynStyle = document.getElementById('allyada-dynamic-styles');
      if (!dynStyle) {
        dynStyle = document.createElement('style');
        dynStyle.id = 'allyada-dynamic-styles';
        document.head.appendChild(dynStyle);
      }
      const { hostCss, shadowCss } = this.getCursorCssObject();
      dynStyle.textContent = hostCss;

      if (this.shadowRoot) {
        let shadowCursorStyle = this.shadowRoot.getElementById('allyada-shadow-cursor-styles');
        if (!shadowCursorStyle) {
          shadowCursorStyle = document.createElement('style');
          shadowCursorStyle.id = 'allyada-shadow-cursor-styles';
          this.shadowRoot.appendChild(shadowCursorStyle);
        }
        shadowCursorStyle.textContent = shadowCss;
      }
    }

    hideVLibras() {
      const vw = document.querySelector('[vw]');
      if (vw) vw.style.display = 'none';
      const wrapper = document.getElementById('vlibras-access-wrapper');
      if (wrapper) wrapper.style.display = 'none';
      const appRoot = document.getElementById('vlibras-app-root');
      if (appRoot) {
        appRoot.style.display = 'none';
        appRoot.dataset.active = 'false';
      }
      try {
        const vlStorage = localStorage.getItem('@vlibras-widget');
        if (vlStorage && vlStorage.includes('"isOpen":true')) {
          localStorage.setItem('@vlibras-widget', vlStorage.replace('"isOpen":true', '"isOpen":false'));
        }
      } catch (e) {}
      if (window.VLibrasWidget && typeof window.VLibrasWidget.close === 'function') {
        try { window.VLibrasWidget.close(); } catch(e) {}
      }
    }

    syncStateAndUI() {
      this.saveState();
      this.applyAllStateChanges();
      this.updatePanelUI();
    }

    switchTab(tabKey) {
      this.state.activeTab = tabKey;
      const root = this.shadowRoot;
      if (!root) return;

      const tabs = ['foryou', 'settings'];
      tabs.forEach(t => {
        const btn = root.getElementById(`tab-btn-${t}`);
        const content = root.getElementById(`tab-content-${t}`);
        const isActive = (t === tabKey);

        if (btn) {
          btn.classList.toggle('active', isActive);
          btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        }
        if (content) {
          content.classList.toggle('active', isActive);
          content.style.display = isActive ? 'flex' : 'none';
        }
      });
      this.saveState();
    }

    toggleHeadingsList() {
      const root = this.shadowRoot;
      const listContainer = root.getElementById('headings-list-container');
      const btnHeadings = root.getElementById('btn-toggle-headings');
      const ul = root.getElementById('headings-items-ul');
      if (!listContainer || !ul) return;

      const isHidden = listContainer.style.display === 'none';
      if (isHidden) {
        listContainer.style.display = 'block';
        btnHeadings.setAttribute('aria-expanded', 'true');
        ul.innerHTML = '';

        const headings = [];
        this.getAllAccessibleDocuments().forEach(({ iframe, doc, win }) => {
          if (!doc) return;
          const docHeadings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"][aria-level]')).filter(el => {
            if (el.closest('#allyada-root') || el.closest('[data-allyada-ignore]') || el.closest('[vw]')) return false;
            if (el.closest('[aria-hidden="true"], [hidden], [inert]')) return false;
            try {
              if (win.getComputedStyle(el).display === 'none') return false;
            } catch (err) {}
            return true;
          });
          docHeadings.forEach(h => headings.push({ el: h, iframe }));
        });

        if (headings.length === 0) {
          ul.innerHTML = `<li class="heading-empty-item">Nenhum cabeçalho estrutural (H1, H2, H3) foi encontrado nesta página.</li>`;
          return;
        }

        headings.forEach(({ el: h, iframe }, idx) => {
          const text = (h.textContent || '').trim();
          if (!text) return;
          let level = 'H2';
          if (/^H[1-6]$/i.test(h.tagName)) {
            level = h.tagName.toUpperCase();
          } else if (h.getAttribute('aria-level')) {
            level = 'H' + h.getAttribute('aria-level');
          }
          const prefix = iframe ? '[Quadro] ' : '';
          const li = document.createElement('li');
          li.className = 'heading-list-item';
          li.innerHTML = `
            <button type="button" class="btn-heading-target" data-heading-idx="${idx}">
              <span class="heading-level-pill ${level.toLowerCase()}">${level}</span>
              <span class="heading-text-label">${this.escapeHTML((prefix + text).slice(0, 80))}</span>
            </button>
          `;
          li.querySelector('button').addEventListener('click', () => {
            this.closePanel();
            if (iframe) {
              iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            h.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (!h.hasAttribute('tabindex')) {
              h.setAttribute('tabindex', '-1');
            }
            h.focus();
            h.classList.add('allyada-heading-target-highlight');
            setTimeout(() => {
              h.classList.remove('allyada-heading-target-highlight');
            }, 2500);
          });
          ul.appendChild(li);
        });
      } else {
        listContainer.style.display = 'none';
        btnHeadings.setAttribute('aria-expanded', 'false');
      }
    }

    escapeHTML(str) {
      return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag));
    }

    applyFontSize() {
      const factors = [1.0, 1.15, 1.30, 1.45, 1.60, 1.80, 2.0];
      const factor = factors[this.state.fontSizeLevel] || 1.0;
      const selectors = 'p, h1, h2, h3, h4, h5, h6, a, span, li, button, input, textarea, select, label, blockquote, figcaption, td, th, kbd, dt, dd';

      this.getAllAccessibleDocuments().forEach(({ doc, win }) => {
        if (!doc || !doc.documentElement || !doc.body) return;

        // Não modifica documentElement.style.fontSize para proteger unidades rem no header/topbar
        doc.documentElement.style.fontSize = '';

        const elements = doc.body.querySelectorAll(selectors);
        elements.forEach(el => {
          if (
            el.closest('#allyada-root') || 
            el.closest('[data-allyada-ignore]') || 
            el.closest('[vw]') ||
            el.closest('header, nav, [role="banner"], [role="navigation"], [class*="header"], [class*="navbar"], [class*="topbar"], [class*="menu"]')
          ) {
            if (el.dataset.allyOrigFont) {
              el.style.fontSize = el.dataset.allyInlineFont || '';
              delete el.dataset.allyOrigFont;
              delete el.dataset.allyInlineFont;
            }
            return;
          }

          if (this.state.fontSizeLevel === 0) {
            if (el.dataset.allyOrigFont) {
              el.style.fontSize = el.dataset.allyInlineFont || '';
              delete el.dataset.allyOrigFont;
              delete el.dataset.allyInlineFont;
            }
          } else {
            if (!el.dataset.allyOrigFont) {
              el.dataset.allyInlineFont = el.style.fontSize || '';
              const computed = win.getComputedStyle(el).fontSize;
              el.dataset.allyOrigFont = computed;
            }
            const origPx = parseFloat(el.dataset.allyOrigFont);
            if (!isNaN(origPx) && origPx > 0) {
              el.style.fontSize = `${(origPx * factor).toFixed(1)}px`;
            }
          }
        });
      });
    }

    applyAllStateChanges() {
      if (this.lastFontSizeLevel !== this.state.fontSizeLevel) {
        this.applyFontSize();
        this.lastFontSizeLevel = this.state.fontSizeLevel;
      }

      const { hostCss: dynCss, shadowCss } = this.getCursorCssObject();
      if (this.shadowRoot) {
        let shadowCursorStyle = this.shadowRoot.getElementById('allyada-shadow-cursor-styles');
        if (!shadowCursorStyle) {
          shadowCursorStyle = document.createElement('style');
          shadowCursorStyle.id = 'allyada-shadow-cursor-styles';
          this.shadowRoot.appendChild(shadowCursorStyle);
        }
        shadowCursorStyle.textContent = shadowCss;
      }

      this.getAllAccessibleDocuments().forEach(({ iframe, doc }) => {
        if (!doc || !doc.documentElement) return;
        const html = doc.documentElement;

        if (iframe) {
          this.injectSvgFilters(doc);
          this.injectHostStyles(doc);
        }

        // Linhas
        html.classList.remove('ally-line-height-1', 'ally-line-height-2');
        if (this.state.lineHeightLevel > 0) {
          html.classList.add(`ally-line-height-${this.state.lineHeightLevel}`);
        }

        // Letras
        html.classList.remove('ally-letter-spacing-1', 'ally-letter-spacing-2');
        if (this.state.letterSpacingLevel > 0) {
          html.classList.add(`ally-letter-spacing-${this.state.letterSpacingLevel}`);
        }

        // Palavras
        html.classList.toggle('ally-word-spacing-1', !!this.state.wordSpacingLevel);

        // Espaçamento WCAG 1.4.12
        html.classList.toggle('ally-wcag-spacing', !!this.state.wcagSpacing);

        // Fonte & Alinhamento
        html.classList.toggle('ally-dyslexic-font', this.state.dyslexicFont);
        html.classList.toggle('ally-text-align-left', this.state.textAlignLeft);

        // Contraste
        html.classList.remove('ally-contrast-dark', 'ally-contrast-light', 'ally-contrast-monochrome', 'ally-contrast-invert');
        if (this.state.contrast !== 'normal') {
          html.classList.add(`ally-contrast-${this.state.contrast}`);
        }

        // Daltonismo
        html.classList.remove('ally-filter-deuteranopia', 'ally-filter-protanopia', 'ally-filter-tritanopia');
        if (this.state.colorblindType && this.state.colorblindType !== 'none') {
          html.classList.add(`ally-filter-${this.state.colorblindType}`);
        }

        // Navegação & Foco
        html.classList.toggle('ally-highlight-links', this.state.highlightLinks);
        html.style.setProperty('--allyada-highlight-color', this.state.highlightColor || '#f59e0b');
        html.classList.toggle('ally-enhanced-focus', this.state.enhancedFocus);

        // Cursor
        html.classList.remove('ally-cursor-large', 'ally-cursor-xlarge');
        if (this.state.cursorSize === 'large') {
          html.classList.add('ally-cursor-large');
        } else if (this.state.cursorSize === 'xlarge') {
          html.classList.add('ally-cursor-xlarge');
        }

        // Estilos Dinâmicos (Cor do Cursor)
        let dynStyle = doc.getElementById('allyada-dynamic-styles');
        if (!dynStyle) {
          dynStyle = doc.createElement('style');
          dynStyle.id = 'allyada-dynamic-styles';
          (doc.head || doc.documentElement).appendChild(dynStyle);
        }
        dynStyle.textContent = dynCss;

        // Movimento (WCAG 2.2.2)
        html.classList.toggle('ally-stop-animations', this.state.stopAnimations);
        if (this.state.stopAnimations) {
          doc.querySelectorAll('video').forEach(v => {
            try { v.pause(); } catch (e) {}
          });
        }
      });

      // Transmite o estado via postMessage para quaisquer iframes Cross-Origin na página
      try {
        document.querySelectorAll('iframe').forEach(iframe => {
          if (iframe.closest('#allyada-root, [vw], [data-allyada-ignore]')) return;
          try {
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'ALLYADA_SYNC_STATE', state: this.state }, '*');
            }
          } catch (err) {}
        });
      } catch (e) {}

      // Tamanho da UI (Scale Responsivo à Tela)
      this.applyResponsiveWidgetSize();

      // Teclado Virtual
      if (this.state.virtualKeyboard) {
        this.enableVirtualKeyboard();
      } else {
        this.disableVirtualKeyboard();
      }

      // Guia de Leitura (Régua ou Máscara)
      if (this.readingGuideElement) {
        this.readingGuideElement.style.display = (this.state.readingGuideMode === 'ruler') ? 'block' : 'none';
      }
      if (this.readingMaskElement) {
        this.readingMaskElement.style.display = (this.state.readingGuideMode === 'mask') ? 'block' : 'none';
      }
    }

    /**
     * Calcula e aplica o tamanho do painel de forma responsiva à tela (viewport),
     * compensando o efeito multiplicativo do CSS zoom para nunca cortar topo, base ou laterais.
     */
    applyResponsiveWidgetSize() {
      if (!this.hostContainer) return;

      const requestedScale = parseFloat(this.state.uiScale || '1') || 1;
      const docEl = document.documentElement;
      const vw = (docEl && docEl.clientWidth) ? Math.min(window.innerWidth || docEl.clientWidth, docEl.clientWidth) : (window.innerWidth || 1024);
      const vh = (docEl && docEl.clientHeight) ? Math.min(window.innerHeight || docEl.clientHeight, docEl.clientHeight) : (window.innerHeight || 768);

      const isMobile = vw <= 480;
      const sideMargin = isMobile ? 12 : 24;
      const bottomOffset = isMobile ? 88 : 96;
      const topMargin = isMobile ? 16 : 20;

      const availWidth = Math.max(260, vw - sideMargin * 2);
      const availHeight = Math.max(300, vh - bottomOffset - topMargin);

      const minUnscaledWidth = isMobile ? 300 : 350;
      const minUnscaledHeight = vh <= 600 ? 340 : 420;

      const maxSafeScaleW = availWidth / minUnscaledWidth;
      const maxSafeScaleH = availHeight / minUnscaledHeight;

      const effectiveScale = Math.max(
        0.85,
        Math.min(requestedScale, maxSafeScaleW, maxSafeScaleH)
      );

      const baseWidth = 420;
      const baseMaxHeight = 680;

      const visualWidth = isMobile
        ? availWidth
        : Math.min(Math.round(baseWidth * effectiveScale), availWidth);
      const visualMaxHeight = Math.min(Math.round(baseMaxHeight * effectiveScale), availHeight);

      const unscaledWidth = visualWidth / effectiveScale;
      const unscaledMaxHeight = visualMaxHeight / effectiveScale;
      const unscaledBottom = bottomOffset / effectiveScale;
      const unscaledSide = sideMargin / effectiveScale;

      this.hostContainer.style.setProperty('--allyada-ui-scale', effectiveScale.toFixed(3));
      this.hostContainer.style.setProperty('--allyada-drawer-width', `${unscaledWidth.toFixed(2)}px`);
      this.hostContainer.style.setProperty('--allyada-drawer-max-height', `${unscaledMaxHeight.toFixed(2)}px`);
      this.hostContainer.style.setProperty('--allyada-drawer-bottom', `${unscaledBottom.toFixed(2)}px`);
      this.hostContainer.style.setProperty('--allyada-drawer-side', `${unscaledSide.toFixed(2)}px`);

      if (this.shadowRoot) {
        const panel = this.shadowRoot.getElementById('allyada-panel');
        if (panel) {
          panel.classList.toggle('ally-compact-grid', unscaledWidth <= 375);
        }
      }
    }

    enableVirtualKeyboard() {
      if (this.virtualKeyboardActive) return;
      this.virtualKeyboardActive = true;
      
      let vk = document.getElementById('allyada-vk-container');
      if (!vk) {
        vk = document.createElement('div');
        vk.id = 'allyada-vk-container';
        vk.setAttribute('data-allyada-ignore', 'true');
        vk.innerHTML = `
          <style>
            #allyada-vk-container { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 500px; background: #e2e8f0; border: 2px solid #cbd5e1; border-bottom: none; border-radius: 12px 12px 0 0; padding: 6px; box-shadow: 0 -4px 16px rgba(0,0,0,0.15); z-index: 2147483647; display: none; font-family: sans-serif; }
            .vk-row { display: flex; justify-content: center; gap: 4px; margin-bottom: 4px; }
            .vk-key { padding: 6px 4px; font-size: 14px; font-weight: 600; background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; cursor: pointer; box-shadow: 0 2px 0 #94a3b8; color: #333; user-select: none; flex: 1; max-width: 40px; text-align: center; }
            .vk-key:active { transform: translateY(2px); box-shadow: 0 0 0 #94a3b8; }
            .vk-key.vk-space { max-width: 200px; width: 100%; }
            .vk-key.vk-back { background: #f87171; color: #fff; border-color: #ef4444; }
            .vk-key.vk-close { background: #cbd5e1; font-size: 13px; max-width: 60px; }
          </style>
          <div class="vk-row">
            ${'1234567890'.split('').map(k => `<button type="button" class="vk-key">${k}</button>`).join('')}
            <button type="button" class="vk-key vk-back">⌫</button>
          </div>
          <div class="vk-row">
            ${'QWERTYUIOP'.split('').map(k => `<button type="button" class="vk-key">${k}</button>`).join('')}
          </div>
          <div class="vk-row">
            ${'ASDFGHJKL'.split('').map(k => `<button type="button" class="vk-key">${k}</button>`).join('')}
          </div>
          <div class="vk-row">
            ${'ZXCVBNM'.split('').map(k => `<button type="button" class="vk-key">${k}</button>`).join('')}
          </div>
          <div class="vk-row">
            <button type="button" class="vk-key vk-close">Fechar</button>
            <button type="button" class="vk-key vk-space">Espaço</button>
          </div>
        `;
        document.body.appendChild(vk);

        vk.style.display = 'block';

        vk.addEventListener('mousedown', (e) => {
          e.preventDefault(); 
          const btn = e.target.closest('.vk-key');
          if (!btn || !this.vkTargetInput) return;

          const val = btn.textContent;
          if (val === '⌫') {
            this.vkTargetInput.value = this.vkTargetInput.value.slice(0, -1);
          } else if (val === 'Espaço') {
            this.vkTargetInput.value += ' ';
          } else if (val === 'Fechar') {
            vk.style.display = 'none';
          } else {
            // Check if input uses standard value, or textContent
            this.vkTargetInput.value += val.toLowerCase();
          }
          this.vkTargetInput.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }

      vk.style.display = 'block';

      this.vkFocusHandler = (e) => {
        if (e.target.closest('#allyada-root') || e.target.closest('#allyada-vk-container')) return;
        const tag = e.target.tagName;
        const type = e.target.type;
        if ((tag === 'INPUT' && ['text', 'search', 'email', 'password', 'url', 'tel'].includes(type)) || tag === 'TEXTAREA') {
          this.vkTargetInput = e.target;
          vk.style.display = 'block';
        }
      };

      document.addEventListener('focusin', this.vkFocusHandler);
    }

    disableVirtualKeyboard() {
      this.virtualKeyboardActive = false;
      const vk = document.getElementById('allyada-vk-container');
      if (vk) vk.style.display = 'none';
      if (this.vkFocusHandler) {
        document.removeEventListener('focusin', this.vkFocusHandler);
        this.vkFocusHandler = null;
      }
    }

    /**
     * Calcula a lista de ajustes ativos para exibição e desativação individual
     */
    getActiveAdjustments() {
      const items = [];

      if (this.state.activeProfile) {
        const profileNames = {
          focus: 'Modo Foco',
          zoom: 'Modo Ampliação',
          reading: 'Modo Leitura',
          colors: 'Modo Cores',
          motion: 'Reduzir Movimento'
        };
        items.push({
          id: 'profile',
          label: `Perfil: ${profileNames[this.state.activeProfile] || this.state.activeProfile}`,
          reset: () => { this.state.activeProfile = null; }
        });
      }

      if (this.state.fontSizeLevel > 0) {
        const pcts = [0, 15, 30, 45, 60, 80, 100];
        items.push({
          id: 'font-size',
          label: `Texto (+${pcts[this.state.fontSizeLevel] || 0}%)`,
          reset: () => { this.state.fontSizeLevel = 0; }
        });
      }

      if (this.state.wcagSpacing) {
        items.push({
          id: 'wcag-spacing',
          label: 'Espaçamento WCAG 1.4.12',
          reset: () => { this.state.wcagSpacing = false; }
        });
      }

      if (this.state.lineHeightLevel > 0) {
        items.push({
          id: 'line-height',
          label: `Entrelinhas (${this.state.lineHeightLevel === 1 ? '1.9x' : '2.3x'})`,
          reset: () => { this.state.lineHeightLevel = 0; }
        });
      }

      if (this.state.letterSpacingLevel > 0) {
        items.push({
          id: 'letter-spacing',
          label: `Letras (${this.state.letterSpacingLevel === 1 ? 'Médio' : 'Amplo'})`,
          reset: () => { this.state.letterSpacingLevel = 0; }
        });
      }

      if (this.state.wordSpacingLevel) {
        items.push({
          id: 'word-spacing',
          label: 'Separar palavras',
          reset: () => { this.state.wordSpacingLevel = 0; }
        });
      }

      if (this.state.dyslexicFont) {
        items.push({
          id: 'dyslexic-font',
          label: 'Fonte Lexend',
          reset: () => { this.state.dyslexicFont = false; }
        });
      }

      if (this.state.textAlignLeft) {
        items.push({
          id: 'align-left',
          label: 'Alinhamento à esquerda',
          reset: () => { this.state.textAlignLeft = false; }
        });
      }

      if (this.state.contrast !== 'normal') {
        const cLabels = { dark: 'Escuro', light: 'Claro', monochrome: 'Monocromático', invert: 'Invertido' };
        items.push({
          id: 'contrast',
          label: `Contraste (${cLabels[this.state.contrast] || this.state.contrast})`,
          reset: () => { this.state.contrast = 'normal'; }
        });
      }

      if (this.state.colorblindType && this.state.colorblindType !== 'none') {
        items.push({
          id: 'colorblind',
          label: `Filtro: ${this.state.colorblindType}`,
          reset: () => { this.state.colorblindType = 'none'; }
        });
      }

      if (this.state.highlightLinks) {
        items.push({
          id: 'highlight-links',
          label: 'Destacar links',
          reset: () => { this.state.highlightLinks = false; }
        });
      }

      if (this.state.enhancedFocus) {
        items.push({
          id: 'enhanced-focus',
          label: 'Foco reforçado',
          reset: () => { this.state.enhancedFocus = false; }
        });
      }

      if (this.state.virtualKeyboard) {
        items.push({
          id: 'virtual-keyboard',
          label: 'Teclado Virtual',
          reset: () => { this.state.virtualKeyboard = false; }
        });
      }

      if (this.state.cursorSize !== 'normal') {
        items.push({
          id: 'cursor-size',
          label: `Cursor (${this.state.cursorSize === 'large' ? 'Grande' : 'Extra Grande'})`,
          reset: () => { this.state.cursorSize = 'normal'; }
        });
      }

      if (this.state.readingGuideMode !== 'none') {
        items.push({
          id: 'reading-guide',
          label: `Guia (${this.state.readingGuideMode === 'ruler' ? 'Régua' : 'Máscara'})`,
          reset: () => { this.state.readingGuideMode = 'none'; }
        });
      }

      if (this.state.stopAnimations) {
        items.push({
          id: 'stop-animations',
          label: 'Menos movimento',
          reset: () => { this.state.stopAnimations = false; }
        });
      }

      if (this.state.vlibrasActive) {
        items.push({
          id: 'vlibras',
          label: 'VLibras ativo',
          reset: () => { 
            this.state.vlibrasActive = false; 
            this.hideVLibras();
          }
        });
      }

      if (this.state.uiScale && this.state.uiScale !== '1') {
        const scaleNames = { '0.9': 'Compacto (90%)', '1.15': 'Grande (115%)', '1.3': 'Muito Grande (130%)' };
        items.push({
          id: 'ui-scale',
          label: `Painel: ${scaleNames[this.state.uiScale] || (Math.round(parseFloat(this.state.uiScale) * 100) + '%')}`,
          reset: () => { this.state.uiScale = '1'; }
        });
      }

      return items;
    }

    updatePanelUI() {
      const root = this.shadowRoot;
      if (!root) return;

      // 1. Perfis
      const profiles = ['focus', 'zoom', 'reading', 'colors', 'motion'];
      profiles.forEach(p => {
        const el = root.getElementById(`profile-${p}`);
        if (el) {
          const isActive = this.state.activeProfile === p;
          el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          el.classList.toggle('active', isActive);
        }
      });

      // Seletor de Daltonismo no Perfil
      const cbBox = root.getElementById('colorblind-selector-box');
      if (cbBox) {
        cbBox.style.display = (this.state.activeProfile === 'colors' || this.state.activeProfile === 'colorblind') ? 'block' : 'none';
      }
      ['deuteranopia', 'protanopia', 'tritanopia'].forEach(type => {
        const pill = root.getElementById(`cb-${type}`);
        if (pill) pill.classList.toggle('active', this.state.colorblindType === type);
      });

      // 2. Acesso Rápido (Modo Simples)
      const setQuick = (id, active) => {
        const el = root.getElementById(id);
        if (el) {
          el.setAttribute('aria-pressed', active ? 'true' : 'false');
          el.classList.toggle('active', !!active);
        }
      };
      setQuick('quick-font-size', this.state.fontSizeLevel > 0);
      setQuick('quick-contrast', this.state.contrast !== 'normal');
      setQuick('quick-links', this.state.highlightLinks);
      setQuick('quick-tts', this.isSpeaking || this.isTtsSelectionMode);
      setQuick('quick-motion', this.state.stopAnimations);
      setQuick('quick-cursor', this.state.cursorSize !== 'normal');
      setQuick('quick-dyslexic', this.state.dyslexicFont);
      setQuick('quick-focus', this.state.enhancedFocus);
      setQuick('quick-vk', this.state.virtualKeyboard);

      const isAudioActive = !!(this.isSpeaking || this.isTtsSelectionMode);
      const qTtsControls = root.getElementById('tts-quick-controls');
      if (qTtsControls) {
        qTtsControls.style.display = isAudioActive ? 'flex' : 'none';
      }
      const sTtsControls = root.getElementById('tts-player-panel');
      if (sTtsControls) {
        sTtsControls.style.display = isAudioActive ? 'flex' : 'none';
      }
      const cardTts = root.getElementById('card-tts-toggle');
      if (cardTts) {
        cardTts.classList.toggle('active', isAudioActive);
        cardTts.setAttribute('aria-pressed', isAudioActive ? 'true' : 'false');
      }

      // 3. Tipografia (WCAG 1.4.4 até 200%)
      const fontLabels = ['Normal (100%)', 'Médio (115%)', 'Grande (130%)', 'Extra (145%)', 'Muito Grande (160%)', 'Amplo (180%)', 'Máximo (200%)'];
      const fontIndicator = root.getElementById('font-size-indicator');
      if (fontIndicator) {
        fontIndicator.textContent = fontLabels[this.state.fontSizeLevel] || 'Normal (100%)';
      }

      const btnDec = root.getElementById('btn-font-decrease');
      const btnInc = root.getElementById('btn-font-increase');
      if (btnDec) btnDec.disabled = this.state.fontSizeLevel === 0;
      if (btnInc) btnInc.disabled = this.state.fontSizeLevel === 6;

      const fontSlider = root.getElementById('slider-font-size');
      if (fontSlider) fontSlider.value = this.state.fontSizeLevel;

      [0, 1, 2, 3, 4, 5, 6].forEach(lvl => {
        const btn = root.getElementById(`btn-fs-${lvl}`);
        if (btn) btn.classList.toggle('active', this.state.fontSizeLevel === lvl);
      });

      const lhLabels = ['Normal', 'Confortável (1.9x)', 'Amplo (2.3x)'];
      const lhInd = root.getElementById('line-height-indicator');
      if (lhInd) lhInd.textContent = lhLabels[this.state.lineHeightLevel] || 'Normal';
      [0, 1, 2].forEach(l => {
        const btn = root.getElementById(`btn-lh-${l}`);
        if (btn) btn.classList.toggle('active', this.state.lineHeightLevel === l);
      });

      const lsLabels = ['Normal', 'Médio (+0.08em)', 'Amplo (+0.16em)'];
      const lsInd = root.getElementById('letter-spacing-indicator');
      if (lsInd) lsInd.textContent = lsLabels[this.state.letterSpacingLevel] || 'Normal';
      [0, 1, 2].forEach(l => {
        const btn = root.getElementById(`btn-ls-${l}`);
        if (btn) btn.classList.toggle('active', this.state.letterSpacingLevel === l);
      });

      const updateTool = (id, active) => {
        const el = root.getElementById(id);
        if (el) {
          el.setAttribute('aria-pressed', active ? 'true' : 'false');
          el.classList.toggle('active', !!active);
        }
      };

      updateTool('card-word-spacing', !!this.state.wordSpacingLevel);
      updateTool('card-text-align-left', this.state.textAlignLeft);
      updateTool('card-wcag-spacing', this.state.wcagSpacing);
      updateTool('card-dyslexic-font', this.state.dyslexicFont);
      updateTool('card-virtual-keyboard', this.state.virtualKeyboard);

      

      // 4. Cores e Contraste
      ['dark', 'light', 'monochrome', 'invert'].forEach(opt => {
        updateTool(`card-contrast-${opt}`, this.state.contrast === opt);
      });

      const cbLabel = root.getElementById('colorblind-active-label');
      if (cbLabel) {
        const names = { none: 'Padrão', deuteranopia: 'Deuteranopia', protanopia: 'Protanopia', tritanopia: 'Tritanopia' };
        cbLabel.textContent = names[this.state.colorblindType] || 'Padrão';
      }
      ['none', 'deuteranopia', 'protanopia', 'tritanopia'].forEach(type => {
        const btn = root.getElementById(`btn-cb-${type}`);
        if (btn) btn.classList.toggle('active', this.state.colorblindType === type);
      });

      // 5. Navegação & Foco
      updateTool('card-highlight-links', this.state.highlightLinks);
      updateTool('card-enhanced-focus', this.state.enhancedFocus);
      updateTool('card-reading-ruler', this.state.readingGuideMode === 'ruler');
      updateTool('card-reading-mask', this.state.readingGuideMode === 'mask');

      const cSizeLabel = root.getElementById('cursor-size-label');
      if (cSizeLabel) {
        const cNames = { normal: 'Normal', large: 'Grande (36px)', xlarge: 'Extra Grande (48px)' };
        cSizeLabel.textContent = cNames[this.state.cursorSize] || 'Normal';
      }
      ['normal', 'large', 'xlarge'].forEach(size => {
        const btn = root.getElementById(`btn-cursor-${size}`);
        if (btn) btn.classList.toggle('active', this.state.cursorSize === size);
      });

      // 6. Movimento
      updateTool('card-stop-animations', this.state.stopAnimations);

      // 7. VLibras
      updateTool('card-vlibras-toggle', this.state.vlibrasActive);
      const vlibrasPill = root.getElementById('vlibras-status-pill') || root.getElementById('vlibras-pill');
      if (vlibrasPill) {
        vlibrasPill.textContent = this.state.vlibrasActive ? 'Ativado' : 'Desativado';
        vlibrasPill.classList.toggle('active', this.state.vlibrasActive);
      }
      const headerVlibras = root.getElementById('btn-header-vlibras');
      if (headerVlibras) {
        headerVlibras.classList.toggle('active', this.state.vlibrasActive);
        headerVlibras.setAttribute('aria-pressed', this.state.vlibrasActive ? 'true' : 'false');
      }

      const currentAvatar = ['hosana', 'icaro', 'guga'].includes(this.state.vlibrasAvatar) ? this.state.vlibrasAvatar : 'hosana';
      const avatarNames = { hosana: 'Hosana', icaro: 'Ícaro', guga: 'Guga' };
      const avatarLabel = root.getElementById('vlibras-avatar-label');
      if (avatarLabel) {
        avatarLabel.textContent = avatarNames[currentAvatar] || 'Hosana';
      }
      const vlibrasDesc = root.getElementById('card-vlibras-desc');
      if (vlibrasDesc) {
        vlibrasDesc.textContent = `Ativar tradutor 3D • Intérprete: ${avatarNames[currentAvatar] || 'Hosana'}`;
      }
      ['hosana', 'icaro', 'guga'].forEach(av => {
        const btnAv = root.getElementById(`btn-vlibras-${av}`);
        if (btnAv) {
          const isAv = (currentAvatar === av);
          btnAv.classList.toggle('active', isAv);
          btnAv.setAttribute('aria-pressed', isAv ? 'true' : 'false');
        }
      });

      // 8. Velocidade de Fala (TTS) em ambas as abas
      const updateRates = (prefix) => {
        const rates = { '075': 0.75, '100': 1, '125': 1.25, '150': 1.5, '200': 2 };
        Object.entries(rates).forEach(([idPart, r]) => {
          const btn = root.getElementById(`${prefix}rate-${idPart}`);
          if (btn) {
            btn.classList.toggle('active', this.state.speechRate === r);
          }
        });
      };
      updateRates('');
      updateRates('q-');

      // 9. Configurações: Switch de Lembrar, Atalho e Aparência
      const chkRem = root.getElementById('chk-remember-preferences');
      if (chkRem) chkRem.checked = !!this.state.rememberPreferences;

      const chkShort = root.getElementById('chk-enable-shortcut');
      if (chkShort) chkShort.checked = this.state.enableShortcut !== false;

      const currentScale = String(this.state.uiScale || '1');
      const selScale = root.getElementById('select-ui-scale');
      if (selScale) selScale.value = currentScale;
      [
        ['090', '0.9'],
        ['100', '1'],
        ['115', '1.15'],
        ['130', '1.3']
      ].forEach(([code, val]) => {
        const btnScale = root.getElementById(`btn-scale-${code}`);
        if (btnScale) {
          const isActive = currentScale === val;
          btnScale.classList.toggle('active', isActive);
          btnScale.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        }
      });

      const cursorColorBtns = root.querySelectorAll('.color-preset-btn');
      cursorColorBtns.forEach(btn => {
        if (btn.dataset.color.toLowerCase() === (this.state.cursorColor || '#000000').toLowerCase()) {
          btn.style.outline = '3px solid var(--primary)';
          btn.style.outlineOffset = '2px';
        } else {
          btn.style.outline = 'none';
        }
      });

      const customColorInput = root.getElementById('input-cursor-custom-color');
      if (customColorInput) customColorInput.value = this.state.cursorColor || '#000000';

      const hexTag = root.getElementById('cursor-color-hex');
      if (hexTag) hexTag.textContent = (this.state.cursorColor || '#000000').toUpperCase();

      // 10. Ajustes Ativos: Chips e Contadores
      const activeItems = this.getActiveAdjustments();
      const activeCount = activeItems.length;

      const fixedReset = root.getElementById('btn-reset-fixed');
      if (fixedReset) fixedReset.disabled = (activeCount === 0);

      const badge = root.getElementById('allyada-active-count');
      if (badge) {
        badge.textContent = activeCount;
        badge.style.display = activeCount > 0 ? 'flex' : 'none';
      }

      const headerBadge = root.getElementById('header-active-badge');
      if (headerBadge) {
        headerBadge.textContent = `${activeCount} ${activeCount === 1 ? 'ativo' : 'ativos'}`;
        headerBadge.style.display = activeCount > 0 ? 'inline-flex' : 'none';
      }

      const settingsBadge = root.getElementById('settings-active-count-badge');
      if (settingsBadge) {
        settingsBadge.textContent = `${activeCount} ${activeCount === 1 ? 'ativo' : 'ativos'}`;
      }

      const resetBtn = root.getElementById('btn-reset-all');
      if (resetBtn) {
        resetBtn.disabled = activeCount === 0;
        resetBtn.classList.toggle('has-active', activeCount > 0);
      }

      // Renderiza os Chips de Ajustes Ativos com botão ✕ individual
      const chipsContainer = root.getElementById('active-adjustments-chips');
      if (chipsContainer) {
        if (activeCount === 0) {
          chipsContainer.innerHTML = `<div class="active-none-msg">Nenhum ajuste ativo no momento. As configurações estão no padrão original.</div>`;
        } else {
          chipsContainer.innerHTML = '';
          activeItems.forEach(item => {
            const chip = document.createElement('div');
            chip.className = 'adjustment-chip';
            chip.innerHTML = `
              <span class="chip-text">${this.escapeHTML(item.label)}</span>
              <button type="button" class="btn-chip-remove" aria-label="Remover ajuste ${this.escapeHTML(item.label)}" title="Remover este ajuste">
                ${ICONS.remove}
              </button>
            `;
            chip.querySelector('.btn-chip-remove').addEventListener('click', () => {
              item.reset();
              this.syncStateAndUI();
            });
            chipsContainer.appendChild(chip);
          });
        }
      }
    }

    toggleDockPosition() {
      const newPos = (this.config.position === 'right') ? 'left' : 'right';
      this.config.position = newPos;
      const wrapper = this.shadowRoot.querySelector('.allyada-wrapper');
      if (wrapper) {
        wrapper.classList.remove('pos-right', 'pos-left');
        wrapper.classList.add(`pos-${newPos}`);
      }
      const vlibrasBtn = document.querySelector('div[vw] [vw-access-button]');
      if (vlibrasBtn) {
        if (newPos === 'right') {
          vlibrasBtn.style.right = '24px';
          vlibrasBtn.style.left = 'auto';
        } else {
          vlibrasBtn.style.left = '24px';
          vlibrasBtn.style.right = 'auto';
        }
      }
      this.applyVLibrasCustomTheme();
    }

    togglePanel() {
      if (this.isOpen) this.closePanel();
      else this.openPanel();
    }

    openPanel() {
      this.isOpen = true;
      this.previousFocusedElement = document.activeElement;

      this.applyResponsiveWidgetSize();

      const panel = this.shadowRoot.getElementById('allyada-panel');
      const backdrop = this.shadowRoot.getElementById('allyada-backdrop');
      const trigger = this.shadowRoot.getElementById('allyada-trigger-btn');

      panel.classList.add('open');
      backdrop.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      backdrop.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');

      this.updatePanelUI();

      // Ativa o Focus Trap no interior do painel
      this.setupFocusTrap();

      setTimeout(() => {
        const closeBtn = this.shadowRoot.getElementById('allyada-close-btn');
        if (closeBtn) closeBtn.focus();
      }, 60);
    }

    closePanel() {
      this.isOpen = false;
      const panel = this.shadowRoot.getElementById('allyada-panel');
      const backdrop = this.shadowRoot.getElementById('allyada-backdrop');
      const trigger = this.shadowRoot.getElementById('allyada-trigger-btn');

      // Remove o Focus Trap
      this.removeFocusTrap();

      // Desfoca o elemento interno antes de ocultar para eliminar qualquer warning no Chromium
      if (this.shadowRoot.activeElement && typeof this.shadowRoot.activeElement.blur === 'function') {
        this.shadowRoot.activeElement.blur();
      }

      // Restaura o foco para o elemento disparador ou o foco anterior
      if (this.previousFocusedElement && typeof this.previousFocusedElement.focus === 'function') {
        this.previousFocusedElement.focus();
      } else if (trigger && typeof trigger.focus === 'function') {
        trigger.focus();
      }

      if (panel) {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
      }
      if (backdrop) {
        backdrop.classList.remove('open');
        backdrop.setAttribute('aria-hidden', 'true');
      }
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    }

    /**
     * WCAG 2.1.2 (No Keyboard Trap) e Focus Trap Seguro
     * Garante que a navegação por Tab circule estritamente dentro do painel
     */
    setupFocusTrap() {
      this.removeFocusTrap();
      const panel = this.shadowRoot.getElementById('allyada-panel');
      if (!panel) return;

      this.panelKeyDownHandler = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closePanel();
          return;
        }

        if (e.key === 'Tab') {
          const focusableSelectors = 'button:not([disabled]):not([style*="display: none"]), [tabindex="0"], input:not([disabled]):not([style*="display: none"]), select:not([disabled]), textarea:not([disabled])';
          const focusables = Array.from(panel.querySelectorAll(focusableSelectors)).filter(el => {
            return el.offsetParent !== null || el === this.shadowRoot.getElementById('allyada-close-btn');
          });

          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];
          const currentEl = this.shadowRoot.activeElement;

          if (e.shiftKey) {
            if (currentEl === firstEl || !panel.contains(currentEl)) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (currentEl === lastEl || !panel.contains(currentEl)) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      };

      panel.addEventListener('keydown', this.panelKeyDownHandler);
    }

    removeFocusTrap() {
      if (this.panelKeyDownHandler) {
        const panel = this.shadowRoot ? this.shadowRoot.getElementById('allyada-panel') : null;
        if (panel) {
          panel.removeEventListener('keydown', this.panelKeyDownHandler);
        }
        this.panelKeyDownHandler = null;
      }
    }

    setupGlobalShortcuts() {
      window.addEventListener('keydown', (e) => {
        // Bloqueia Alt + A caso o usuário tenha desativado ou esteja digitando em um campo de texto
        if (this.state.enableShortcut !== false && e.altKey && e.key.toLowerCase() === this.config.shortcutKey) {
          const active = document.activeElement;
          const isInput = active && (
            active.tagName === 'INPUT' || 
            active.tagName === 'TEXTAREA' || 
            active.tagName === 'SELECT' || 
            active.isContentEditable
          );
          if (isInput) return;

          e.preventDefault();
          this.togglePanel();
        }

        if (e.key === 'Escape' && this.isOpen) {
          e.preventDefault();
          this.closePanel();
        }
      });
    }

    initSpeechSynthesis() {
      if (!('speechSynthesis' in window)) {
        console.warn('[Allyada] O navegador não suporta Web Speech API.');
        const ttsCard = this.shadowRoot ? this.shadowRoot.getElementById('card-tts-toggle') : null;
        if (ttsCard) ttsCard.style.display = 'none';
        const ttsQuick = this.shadowRoot ? this.shadowRoot.getElementById('quick-tts') : null;
        if (ttsQuick) ttsQuick.style.display = 'none';
        return;
      }
      this.speechSynthesizer = window.speechSynthesis;
    }

    toggleSpeechPause() {
      if (!this.speechSynthesizer || !this.isSpeaking) return;
      if (this.isSpeechPaused) {
        try { this.speechSynthesizer.resume(); } catch(e) {}
        if (this.utterancePauseStartedAt) {
          const pausedDelta = Math.max(0, Date.now() - this.utterancePauseStartedAt);
          this.utterancePausedMs = (this.utterancePausedMs || 0) + pausedDelta;
          if (this.lastBoundaryAt > 0) {
            this.lastBoundaryAt += pausedDelta;
          }
          this.utterancePauseStartedAt = null;
        }
        this.isSpeechPaused = false;
        this.updateSpeechButtons(true, false);
      } else {
        try { this.speechSynthesizer.pause(); } catch(e) {}
        this.utterancePauseStartedAt = Date.now();
        this.isSpeechPaused = true;
        this.updateSpeechButtons(true, true);
      }
    }

    /**
     * Calcula a posição exata (índice de caractere) onde a leitura está no momento,
     * combinando eventos nativos onboundary (precisão por palavra) com fallback temporal.
     */
    getCurrentReadingOffset() {
      if (!this.fullSpeakingText) return 0;
      const maxIdx = Math.max(0, this.fullSpeakingText.length - 1);
      const now = (this.isSpeechPaused && this.utterancePauseStartedAt)
        ? this.utterancePauseStartedAt
        : Date.now();

      // 1. Se a voz emitiu onboundary para palavras após o início (e.charIndex > 0)
      if (this.lastBoundaryAt > 0 && this.currentCharOffset > (this.utteranceBaseOffset || 0)) {
        const sinceBoundaryMs = Math.max(0, now - this.lastBoundaryAt);
        if (sinceBoundaryMs < 600) {
          return Math.min(this.currentCharOffset, maxIdx);
        }
        const extraChars = Math.floor((sinceBoundaryMs / 1000) * 14 * (this.activeUtteranceRate || 1.0));
        return Math.min(this.currentCharOffset + extraChars, maxIdx);
      }

      // 2. Fallback temporal contínuo caso a voz ativa não emita onboundary (ex.: vozes remotas Google)
      if (this.utteranceStartTime) {
        const elapsedActiveMs = Math.max(0, now - this.utteranceStartTime - (this.utterancePausedMs || 0));
        const estimatedChars = Math.floor((elapsedActiveMs / 1000) * 14 * (this.activeUtteranceRate || 1.0));
        return Math.min((this.utteranceBaseOffset || 0) + estimatedChars, maxIdx);
      }

      return Math.min(this.currentCharOffset || 0, maxIdx);
    }

    /**
     * Altera a velocidade da leitura continuando exatamente da palavra onde parou, sem voltar ao início.
     */
    changeSpeechRate(newRate) {
      const parsedRate = Number(newRate) || 1.0;
      if (Number(this.state.speechRate) === parsedRate && this.isSpeaking) {
        this.syncStateAndUI();
        return;
      }

      const wasSpeaking = !!(this.isSpeaking && this.speechSynthesizer && this.fullSpeakingText);
      const resumeOffset = wasSpeaking ? this.getCurrentReadingOffset() : 0;

      this.state.speechRate = parsedRate;
      this.saveState();

      if (wasSpeaking) {
        this.speakText(this.fullSpeakingText, this.currentSpeakingNode, resumeOffset);
      }
      this.syncStateAndUI();
    }

    handleSpeechClick() {
      if (!this.speechSynthesizer) {
        this.initSpeechSynthesis();
      }
      if (!this.speechSynthesizer) return;

      if (this.isSpeaking) {
        this.toggleSpeechPause();
        return;
      }

      for (const { win } of this.getAllAccessibleDocuments()) {
        try {
          const selection = win && win.getSelection ? win.getSelection() : null;
          if (selection && selection.toString().trim().length > 0) {
            const textToRead = selection.toString().trim();
            const targetNode = selection.anchorNode ? (selection.anchorNode.nodeType === 1 ? selection.anchorNode : selection.anchorNode.parentElement) : null;
            this.speakText(textToRead, targetNode, 0);
            return;
          }
        } catch (err) {}
      }

      const readable = this.extractReadableText(document.body);
      if (readable && readable.trim().length > 0) {
        this.speakText(readable.trim(), null, 0);
        return;
      }

      // Modo seletivo de leitura (apontar e clicar)
      this.isTtsSelectionMode = !this.isTtsSelectionMode;
      const statusText = this.shadowRoot ? this.shadowRoot.getElementById('tts-status-text') : null;
      const qStatusText = this.shadowRoot ? this.shadowRoot.getElementById('q-tts-status-text') : null;

      if (this.isTtsSelectionMode) {
        const msg = 'Modo de leitura ativo: clique em qualquer texto da página para ouvir.';
        if (statusText) statusText.textContent = msg;
        if (qStatusText) qStatusText.textContent = msg;
        this.enableTtsSelectionListeners();
      } else {
        this.disableTtsSelectionListeners();
      }
      this.updateSpeechButtons(this.isSpeaking, this.isSpeechPaused);
      this.updatePanelUI();
    }

    enableTtsSelectionListeners() {
      this.ttsHoverHandler = (e) => {
        if (e.target.closest && e.target.closest('#allyada-root')) return;
        if (e.target.classList) e.target.classList.add('allyada-tts-hover-target');
      };
      this.ttsOutHandler = (e) => {
        if (e.target.classList) e.target.classList.remove('allyada-tts-hover-target');
      };
      this.ttsClickHandler = (e) => {
        if (e.target.closest && e.target.closest('#allyada-root')) return;
        e.preventDefault();
        e.stopPropagation();
        
        const textToRead = e.target.innerText || e.target.textContent;
        if (textToRead && textToRead.trim().length > 0) {
          this.speakText(textToRead.trim(), e.target, 0);
          this.disableTtsSelectionListeners();
        }
      };

      this.getAllAccessibleDocuments().forEach(({ doc }) => {
        if (!doc || !doc.documentElement) return;
        doc.addEventListener('mouseover', this.ttsHoverHandler, true);
        doc.addEventListener('mouseout', this.ttsOutHandler, true);
        doc.addEventListener('click', this.ttsClickHandler, true);
        doc.documentElement.style.cursor = 'help';
      });
    }

    disableTtsSelectionListeners() {
      this.isTtsSelectionMode = false;
      this.getAllAccessibleDocuments().forEach(({ doc }) => {
        if (!doc || !doc.documentElement) return;
        if (this.ttsHoverHandler) {
          doc.removeEventListener('mouseover', this.ttsHoverHandler, true);
          doc.removeEventListener('mouseout', this.ttsOutHandler, true);
          doc.removeEventListener('click', this.ttsClickHandler, true);
        }
        doc.querySelectorAll('.allyada-tts-hover-target').forEach(el => el.classList.remove('allyada-tts-hover-target'));
        doc.documentElement.style.cursor = '';
      });
      this.ttsHoverHandler = null;
    }

    speakText(text, targetNode, startOffset = 0) {
      if (!this.speechSynthesizer) return;

      // Desvincula callbacks da utterance anterior antes do cancel() para evitar stopSpeech() assíncrono
      if (this.speechUtterance) {
        this.speechUtterance.onstart = null;
        this.speechUtterance.onend = null;
        this.speechUtterance.onerror = null;
        this.speechUtterance.onboundary = null;
      }

      // No Chromium, é obrigatório dar resume() antes de cancel() caso esteja pausado
      try { this.speechSynthesizer.resume(); } catch (e) {}
      try { this.speechSynthesizer.cancel(); } catch (e) {}
      if (!startOffset) {
        this.clearHighlight();
      }

      if (!text || !text.trim()) {
        this.stopSpeech();
        return;
      }

      if (startOffset === 0 || !this.fullSpeakingText) {
        this.fullSpeakingText = text;
      }

      // Ajusta o offset para o início da palavra atual para nunca cortar uma palavra ao meio
      let safeOffset = Math.max(0, Math.min(startOffset || 0, this.fullSpeakingText.length - 1));
      if (safeOffset > 0 && /\S/.test(this.fullSpeakingText[safeOffset]) && /\S/.test(this.fullSpeakingText[safeOffset - 1])) {
        while (safeOffset > 0 && /\S/.test(this.fullSpeakingText[safeOffset - 1])) {
          safeOffset--;
        }
      }

      const remainingText = this.fullSpeakingText.slice(safeOffset);
      if (!remainingText || !remainingText.trim()) {
        this.stopSpeech();
        return;
      }

      this.utteranceBaseOffset = safeOffset;
      this.currentCharOffset = safeOffset;
      this.currentSpeakingText = remainingText;
      this.currentSpeakingNode = targetNode;
      this.utteranceStartTime = Date.now();
      this.utterancePausedMs = 0;
      this.utterancePauseStartedAt = null;
      this.lastBoundaryAt = 0;
      this.activeUtteranceRate = Number(this.state.speechRate) || 1.0;
      this.isSpeaking = true;
      this.isSpeechPaused = false;
      this.updateSpeechButtons(true, false);

      const utterance = new SpeechSynthesisUtterance(remainingText);
      // Mantém referência forte no window para contornar o bug de Garbage Collection do Chrome
      window._allyada_active_utterance = utterance;
      this.speechUtterance = utterance;

      utterance.lang = this.config.speechLang || 'pt-BR';
      utterance.rate = this.activeUtteranceRate;
      utterance.pitch = 1.0;

      const voices = this.speechSynthesizer.getVoices();
      const ptVoice =
        voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt_BR')) && v.localService) ||
        voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt_BR')) ||
        voices.find(v => v.lang.includes('pt'));
      if (ptVoice) utterance.voice = ptVoice;

      utterance.onboundary = (e) => {
        if (this.speechUtterance !== utterance) return;
        if (typeof e.charIndex === 'number' && e.charIndex > 0) {
          this.currentCharOffset = this.utteranceBaseOffset + e.charIndex;
          this.lastBoundaryAt = Date.now();
        }
      };

      utterance.onstart = () => {
        if (this.speechUtterance !== utterance) return;
        if (this.isSpeechPaused) {
          try { this.speechSynthesizer.pause(); } catch (e) {}
          this.updateSpeechButtons(true, true);
          return;
        }
        if (!this.utterancePausedMs) {
          this.utteranceStartTime = Date.now();
        }
        this.isSpeaking = true;
        this.updateSpeechButtons(true, false);
        if (targetNode && targetNode.classList) {
          targetNode.classList.add('allyada-reading-highlight');
          this.currentSpeakingNode = targetNode;
        }
      };

      utterance.onend = () => {
        if (this.speechUtterance !== utterance) return;
        this.stopSpeech();
      };

      utterance.onerror = (e) => {
        if (this.speechUtterance !== utterance) return;
        if (e.error === 'canceled' || e.error === 'interrupted') {
          return; // Esperado ao pausar, trocar de velocidade ou interromper
        }
        console.warn('[Allyada] Erro na síntese de voz:', e);
        this.stopSpeech();
      };

      // Heartbeat para contornar o bug de pausa involuntária aos 14 segundos no Chromium
      if (this.ttsHeartbeat) clearInterval(this.ttsHeartbeat);
      this.ttsHeartbeat = setInterval(() => {
        if (this.isSpeaking && !this.isSpeechPaused && this.speechSynthesizer && this.speechSynthesizer.speaking) {
          try {
            this.speechSynthesizer.pause();
            this.speechSynthesizer.resume();
          } catch (err) {}
        } else if (!this.isSpeaking) {
          clearInterval(this.ttsHeartbeat);
          this.ttsHeartbeat = null;
        }
      }, 10000);

      this.speechSynthesizer.speak(utterance);
    }

    clearHighlight() {
      if (this.currentSpeakingNode) {
        this.currentSpeakingNode.classList.remove('allyada-reading-highlight');
        this.currentSpeakingNode = null;
      }
    }

    stopSpeech() {
      if (this.speechUtterance) {
        this.speechUtterance.onstart = null;
        this.speechUtterance.onend = null;
        this.speechUtterance.onerror = null;
        this.speechUtterance.onboundary = null;
      }
      if (this.speechSynthesizer) {
        try { this.speechSynthesizer.resume(); } catch (e) {}
        try { this.speechSynthesizer.cancel(); } catch (e) {}
      }
      if (this.ttsHeartbeat) {
        clearInterval(this.ttsHeartbeat);
        this.ttsHeartbeat = null;
      }
      window._allyada_active_utterance = null;
      this.speechUtterance = null;
      this.isSpeaking = false;
      this.isSpeechPaused = false;
      this.isTtsSelectionMode = false;
      this.fullSpeakingText = null;
      this.currentSpeakingText = null;
      this.currentSpeakingNode = null;
      this.utteranceBaseOffset = 0;
      this.currentCharOffset = 0;
      this.utteranceStartTime = null;
      this.utterancePausedMs = 0;
      this.utterancePauseStartedAt = null;
      this.lastBoundaryAt = 0;
      this.disableTtsSelectionListeners();
      this.clearHighlight();
      this.updateSpeechButtons(false, false);
    }

    updateSpeechButtons(speaking, paused) {
      const root = this.shadowRoot;
      if (!root) return;

      const isAudioActive = !!(speaking || this.isTtsSelectionMode);

      // Exibe ou oculta os painéis de player apenas quando a leitura estiver ativa
      const qControls = root.getElementById('tts-quick-controls');
      if (qControls) {
        qControls.style.display = isAudioActive ? 'flex' : 'none';
      }

      const sControls = root.getElementById('tts-player-panel');
      if (sControls) {
        sControls.style.display = isAudioActive ? 'flex' : 'none';
      }

      // Card em Assistência de Tela
      const cardTts = root.getElementById('card-tts-toggle');
      if (cardTts) {
        cardTts.classList.toggle('active', isAudioActive);
        cardTts.setAttribute('aria-pressed', isAudioActive ? 'true' : 'false');
        const desc = root.getElementById('card-tts-desc');
        if (desc) {
          desc.textContent = speaking 
            ? (paused ? 'Leitura pausada — clique para continuar' : 'Lendo conteúdo em voz alta...') 
            : 'Leitura do conteúdo em voz alta';
        }
      }

      // Tile em Acesso Rápido
      const quickTile = root.getElementById('quick-tts');
      if (quickTile) {
        quickTile.setAttribute('aria-pressed', isAudioActive ? 'true' : 'false');
        quickTile.classList.toggle('active', isAudioActive);
        const quickLabel = root.getElementById('quick-tts-label');
        if (quickLabel) {
          quickLabel.textContent = speaking ? (paused ? 'Continuar' : 'Pausar') : 'Ouvir Página';
        }
      }

      // Atualiza botões de Play/Pausa e status nos dois painéis
      const updateControls = (prefix) => {
        const playLabel = root.getElementById(`${prefix}tts-play-label`);
        const playIcon = root.getElementById(`${prefix}tts-play-icon`);
        const statusText = root.getElementById(`${prefix}tts-status-text`);

        if (playLabel) playLabel.textContent = paused ? 'Continuar' : 'Pausar';
        if (playIcon) playIcon.innerHTML = paused ? ICONS.play : ICONS.pause;
        if (statusText) {
          statusText.textContent = paused 
            ? 'Leitura pausada. Clique em continuar para prosseguir.' 
            : 'Lendo conteúdo em voz alta...';
        }
      };

      updateControls('');
      updateControls('q-');

      // Atualiza destaques nas taxas de velocidade (0.75x a 2.0x)
      const updateRates = (prefix) => {
        const rates = { '075': 0.75, '100': 1, '125': 1.25, '150': 1.5, '200': 2 };
        Object.entries(rates).forEach(([idPart, r]) => {
          const btn = root.getElementById(`${prefix}rate-${idPart}`);
          if (btn) {
            btn.classList.toggle('active', this.state.speechRate === r);
          }
        });
      };
      updateRates('');
      updateRates('q-');

      this.updatePanelUI();
    }

    extractReadableText(el) {
      if (!el) return '';
      const removeSelectors = [
        'script', 'style', 'noscript', 'iframe', 'svg', 'canvas',
        '#allyada-root', '#allyada-reading-ruler', '#allyada-reading-mask', '#allyada-svg-filters',
        '[data-allyada-ignore]', '[vw]', '[aria-hidden="true"]', '[hidden]', '[inert]'
      ];

      const cleanElementText = (rootNode, ownerDoc) => {
        if (!rootNode) return '';
        const clone = rootNode.cloneNode(true);
        removeSelectors.forEach(sel => {
          clone.querySelectorAll(sel).forEach(node => node.remove());
        });
        clone.querySelectorAll('img[alt]').forEach(img => {
          const alt = (img.getAttribute('alt') || '').trim();
          if (alt) {
            const span = (ownerDoc || document).createElement('span');
            span.textContent = ` Imagem: ${alt}. `;
            img.replaceWith(span);
          } else {
            img.remove();
          }
        });
        return (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim();
      };

      const mainEl = document.querySelector('main, [role="main"]') || el;
      const chunks = [];
      const hostText = cleanElementText(mainEl, document);
      if (hostText) chunks.push(hostText);

      // Inclui também o conteúdo textual dos iframes acessíveis na página
      this.getAccessibleIframes().forEach(({ doc }) => {
        if (!doc || !doc.body) return;
        const iframeText = cleanElementText(doc.body, doc);
        if (iframeText) chunks.push(iframeText);
      });

      return chunks.join('. ').replace(/\s+/g, ' ').trim().slice(0, 4000);
    }

    /**
     * Sincroniza o intérprete escolhido (Hosana por padrão, Ícaro ou Guga) no storage do VLibras,
     * no objeto global window.VLibrasWidget e no player 3D ativo em tempo real.
     */
    syncVLibrasAvatar(avatar) {
      const VLIBRAS_APP_URL = 'https://vlibras.gov.br/app';
      const validAvatar = ['hosana', 'icaro', 'guga'].includes(avatar) ? avatar : 'hosana';
      const posCode = (this.config && this.config.position === 'left') ? 'L' : 'R';

      try {
        let playerStore = {
          state: {
            speed: 1,
            showSubtitles: true,
            avatar: validAvatar,
            config: { baseUrl: '', personalizationUrl: '' }
          },
          version: 1
        };
        const existing = localStorage.getItem('@vlibras/player');
        if (existing) {
          const parsed = JSON.parse(existing);
          if (parsed && typeof parsed === 'object') {
            parsed.state = Object.assign(
              { speed: 1, showSubtitles: true, config: { baseUrl: '', personalizationUrl: '' } },
              parsed.state || {},
              { avatar: validAvatar }
            );
            playerStore = parsed;
          }
        }
        localStorage.setItem('@vlibras/player', JSON.stringify(playerStore));
      } catch (e) {}

      if (typeof window !== 'undefined') {
        window.VLibrasWidget = Object.assign({ path: VLIBRAS_APP_URL }, window.VLibrasWidget || {}, {
          path: VLIBRAS_APP_URL,
          avatar: validAvatar,
          position: posCode
        });

        try {
          if (window.plugin && window.plugin.player && typeof window.plugin.player.changeAvatar === 'function') {
            window.plugin.player.changeAvatar(validAvatar);
          } else if (window.vlibras && typeof window.vlibras.toggleAvatar === 'function') {
            window.vlibras.toggleAvatar(validAvatar);
          }
        } catch (err) {}
      }

      this.applyVLibrasCustomTheme();
    }

    setVLibrasAvatar(avatar) {
      const validAvatar = ['hosana', 'icaro', 'guga'].includes(avatar) ? avatar : 'hosana';
      this.state.vlibrasAvatar = validAvatar;
      this.syncVLibrasAvatar(validAvatar);
      this.saveState();
      this.updatePanelUI();
      const names = { hosana: 'Hosana', icaro: 'Ícaro', guga: 'Guga' };
      this.announce(`Intérprete do VLibras alterado para ${names[validAvatar] || 'Hosana'}`);
    }

    /**
     * Personaliza o visual da janela e do botão de acesso do VLibras (Shadow DOM aberto),
     * aplicando cor lilás (#7956c2), bordas arredondadas, remoção da opção "Emoções",
     * posição sincronizada e ícone da Hosana/avatar ativo.
     */
    applyVLibrasCustomTheme() {
      if (typeof document === 'undefined') return;
      const VLIBRAS_APP_URL = 'https://vlibras.gov.br/app';
      const validAvatar = ['hosana', 'icaro', 'guga'].includes(this.state.vlibrasAvatar) ? this.state.vlibrasAvatar : 'hosana';
      const isLeft = (this.config && this.config.position === 'left');
      const side = isLeft ? 'left' : 'right';
      const opposite = isLeft ? 'right' : 'left';
      const vlibrasColor = (this.config && this.config.vlibrasColor) ? this.config.vlibrasColor : '#7956c2';

      // 1. Estiliza o botão flutuante de acesso do VLibras (#vlibras-access-wrapper)
      const accessWrapper = document.getElementById('vlibras-access-wrapper');
      if (accessWrapper && accessWrapper.shadowRoot) {
        let accessStyle = accessWrapper.shadowRoot.getElementById('allyada-vlibras-access-theme');
        if (!accessStyle) {
          accessStyle = document.createElement('style');
          accessStyle.id = 'allyada-vlibras-access-theme';
          accessWrapper.shadowRoot.appendChild(accessStyle);
        }
        accessStyle.textContent = `
          #vlibras-access {
            bottom: 96px !important;
            top: auto !important;
            ${side}: 24px !important;
            ${opposite}: auto !important;
            flex-direction: ${isLeft ? 'row-reverse' : 'row'} !important;
            --vlibras-btn-focus-visible-shadow: 0 0 10px 4px ${vlibrasColor} !important;
          }
          #vlibras-button {
            ${side}: 0 !important;
            ${opposite}: auto !important;
            border-radius: 14px !important;
            background: ${vlibrasColor} !important;
            box-shadow: 0 8px 22px rgba(121, 86, 194, 0.35) !important;
          }
          #vlibras-button img,
          #vlibras-popup {
            filter: hue-rotate(45deg) saturate(0.9) !important;
          }
          #vlibras-popup {
            border-radius: 14px !important;
          }
        `;
      }

      // 2. Estiliza a janela principal do player 3D (#vlibras-app-root)
      const appRoot = document.getElementById('vlibras-app-root');
      if (appRoot && appRoot.shadowRoot) {
        let appStyle = appRoot.shadowRoot.getElementById('allyada-vlibras-custom-theme');
        if (!appStyle) {
          appStyle = document.createElement('style');
          appStyle.id = 'allyada-vlibras-custom-theme';
          appRoot.shadowRoot.appendChild(appStyle);
        }
        appStyle.textContent = `
          :host,
          [data-theme="light"],
          :host(.dark),
          [data-theme="dark"] {
            --radius: 18px !important;
            --primary: ${vlibrasColor} !important;
            --primary-foreground: #ffffff !important;
            --secondary: #5e3ea1 !important;
            --secondary-foreground: #f3effb !important;
            --ring: #9d7fe0 !important;
          }
          #vlibras-app {
            z-index: 2147483640 !important;
          }
          #vlibras-app > .widget-radius {
            border-radius: 22px !important;
            box-shadow: 0 24px 54px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(121, 86, 194, 0.28) !important;
            border: 1px solid rgba(121, 86, 194, 0.32) !important;
            overflow: hidden !important;
          }
          #vlibras-app:not([style*="translate3d"]) {
            ${side}: 24px !important;
            ${opposite}: auto !important;
          }
          .size-20.bg-primary i,
          .size-5\\.5 i {
            -webkit-mask-image: url("${VLIBRAS_APP_URL}/assets/icons/${validAvatar}.webp") !important;
            mask-image: url("${VLIBRAS_APP_URL}/assets/icons/${validAvatar}.webp") !important;
          }
          /* Remove a opção "Emoções" da barra de menu do VLibras e alinha os 4 botões restantes */
          #emotions-subtitles-options > :first-child,
          #emotions-subtitles-options [aria-label*="emoção" i],
          #emotions-subtitles-options [aria-label*="emocao" i] {
            display: none !important;
          }
          div:has(> #emotions-subtitles-options) {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          #emotions-subtitles-options {
            grid-column: span 1 / span 1 !important;
            grid-template-columns: 1fr !important;
          }
        `;
      }
    }

    loadVLibras() {
      const VLIBRAS_APP_URL = 'https://vlibras.gov.br/app';
      const validAvatar = ['hosana', 'icaro', 'guga'].includes(this.state.vlibrasAvatar) ? this.state.vlibrasAvatar : 'hosana';
      const posCode = (this.config && this.config.position === 'left') ? 'L' : 'R';

      this.syncVLibrasAvatar(validAvatar);

      // Garante que window.VLibrasWidget preserve a propriedade .path exigida pelo VLibras v7.12.2+
      window.VLibrasWidget = Object.assign({ path: VLIBRAS_APP_URL }, window.VLibrasWidget || {}, {
        path: VLIBRAS_APP_URL,
        avatar: validAvatar,
        position: posCode
      });

      // 1. Injeta estrutura de suporte do VLibras no host caso não exista
      let vw = document.querySelector('[vw]');
      if (!vw) {
        vw = document.createElement('div');
        vw.setAttribute('vw', '');
        vw.className = 'enabled';
        vw.innerHTML = `
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
          </div>
        `;
        document.body.appendChild(vw);
      } else {
        vw.style.display = 'block';
      }

      // Observa a criação de #vlibras-app-root e #vlibras-access-wrapper para aplicar o tema personalizado imediatamente
      if (!this.vlibrasThemeObserver && typeof MutationObserver !== 'undefined' && document.body) {
        this.vlibrasThemeObserver = new MutationObserver(() => {
          if (document.getElementById('vlibras-app-root') || document.getElementById('vlibras-access-wrapper')) {
            this.applyVLibrasCustomTheme();
          }
        });
        this.vlibrasThemeObserver.observe(document.body, { childList: true });
      }

      const getValidAvatar = () => ['hosana', 'icaro', 'guga'].includes(this.state.vlibrasAvatar) ? this.state.vlibrasAvatar : 'hosana';

      const ensureOpen = () => {
        const currentAvatar = getValidAvatar();
        if (window.VLibrasWidget) {
          window.VLibrasWidget.path = VLIBRAS_APP_URL;
          window.VLibrasWidget.avatar = currentAvatar;
          window.VLibrasWidget.position = posCode;
        }
        this.syncVLibrasAvatar(currentAvatar);

        const vwEl = document.querySelector('[vw]');
        if (vwEl) vwEl.style.display = 'block';
        const wrapper = document.getElementById('vlibras-access-wrapper');
        if (wrapper) wrapper.style.display = 'block';
        const appRoot = document.getElementById('vlibras-app-root');
        if (appRoot) {
          appRoot.style.display = 'block';
          appRoot.dataset.active = 'true';
        }

        if (window.VLibrasWidget && typeof window.VLibrasWidget.open === 'function') {
          window.VLibrasWidget.open();
        } else if (window.VLibrasWidget && window.VLibrasWidget.initBtn) {
          window.VLibrasWidget.initBtn.click();
        } else {
          const accessBtn = document.querySelector('[vw-access-button]');
          if (accessBtn) accessBtn.click();
        }

        this.applyVLibrasCustomTheme();
        setTimeout(() => this.applyVLibrasCustomTheme(), 400);
      };

      if (window.VLibras && typeof window.VLibras.Widget === 'function') {
        const currentAvatar = getValidAvatar();
        if (!document.getElementById('vlibras-access-wrapper')) {
          try {
            // IMPORTANTE: Não atribuir "window.VLibrasWidget = new ...", pois isso sobrescreve window.VLibrasWidget.path!
            new window.VLibras.Widget({
              rootPath: VLIBRAS_APP_URL,
              avatar: currentAvatar,
              position: posCode
            });
          } catch(e) {}
        }
        if (window.VLibrasWidget) {
          window.VLibrasWidget.path = VLIBRAS_APP_URL;
          window.VLibrasWidget.avatar = currentAvatar;
          window.VLibrasWidget.position = posCode;
        }
        setTimeout(ensureOpen, 250);
        return;
      }

      let script = document.querySelector('script[src*="vlibras-plugin.js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = `${VLIBRAS_APP_URL}/vlibras-plugin.js`;
        script.onload = () => {
          const currentAvatar = getValidAvatar();
          if (window.VLibras && typeof window.VLibras.Widget === 'function') {
            try {
              new window.VLibras.Widget({
                rootPath: VLIBRAS_APP_URL,
                avatar: currentAvatar,
                position: posCode
              });
            } catch(e) {}
            if (window.VLibrasWidget) {
              window.VLibrasWidget.path = VLIBRAS_APP_URL;
              window.VLibrasWidget.avatar = currentAvatar;
              window.VLibrasWidget.position = posCode;
            }
            setTimeout(ensureOpen, 350);
          }
        };
        document.body.appendChild(script);
      } else {
        setTimeout(ensureOpen, 350);
      }
    }

    getShadowStyles() {
      return `
        :host {
          all: initial !important;
          --primary: ${this.config.primaryColor};
          --primary-hover: #6340ac;
          --accent: ${this.config.accentColor};
          --bg-panel: rgba(255, 255, 255, 0.95);
          --bg-card: #f8fafc;
          --bg-card-hover: #f1f5f9;
          --bg-card-active: #f5f2fb;
          --border-subtle: rgba(203, 213, 225, 0.6);
          --border-active: var(--primary);
          --text-main: #0f172a;
          --text-secondary: #334155;
          --text-muted: #475569;
          --radius-card: 16px;
          --radius-btn: 12px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          font-size: 15px !important;
          line-height: 1.5 !important;
          letter-spacing: normal !important;
          word-spacing: normal !important;
          text-transform: none !important;
          text-shadow: none !important;
          color: #0f172a !important;
          box-sizing: border-box !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }

        *, *::before, *::after {
          box-sizing: border-box !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          letter-spacing: normal !important;
          word-spacing: normal !important;
          text-transform: none !important;
          text-shadow: none !important;
          margin: 0;
          padding: 0;
        }

                .allyada-sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }

        /* Launcher Flutuante (FAB) */
        .allyada-wrapper {
          position: fixed;
          bottom: 24px;
          z-index: 2147483645;
        }
        .pos-right { right: 24px; }
        .pos-left { left: 24px; }

        .allyada-fab {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, #5e3ea1 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 10px 30px -4px rgba(121, 86, 194, 0.48), inset 0 2px 4px rgba(255, 255, 255, 0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
          position: relative;
        }
        .allyada-fab:hover {
          transform: scale(1.08) translateY(-4px);
          box-shadow: 0 16px 36px rgba(121, 86, 194, 0.58), inset 0 2px 4px rgba(255, 255, 255, 0.4);
        }
        .allyada-fab:focus-visible {
          outline: 4px solid var(--accent);
          outline-offset: 4px;
        }
        .fab-icon svg {
          width: 38px;
          height: 38px;
          display: block;
        }
        .fab-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 24px;
          height: 24px;
          background: #ef4444;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          border-radius: 50%;
          display: none;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        }

        /* Backdrop sem bloqueio visual */
        .allyada-backdrop {
          display: none !important;
          pointer-events: none !important;
        }

        /* Painel Flutuante Premium (Drawer Lateral Responsivo ao Viewport e Escala) */
        .allyada-drawer {
          position: fixed;
          bottom: var(--allyada-drawer-bottom, calc(96px / var(--allyada-ui-scale, 1)));
          top: auto;
          width: var(--allyada-drawer-width, 420px);
          max-width: var(--allyada-drawer-width, calc((100vw - 48px) / var(--allyada-ui-scale, 1)));
          height: auto;
          max-height: var(--allyada-drawer-max-height, calc((100vh - 112px) / var(--allyada-ui-scale, 1)));
          background: var(--bg-panel);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 24px;
          box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.25), 0 18px 36px -18px rgba(15, 23, 42, 0.15);
          display: flex;
          flex-direction: column;
          z-index: 2147483647;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(20px) scale(0.98);
          transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s ease;
          zoom: var(--allyada-ui-scale, 1);
        }
        .pos-right .allyada-drawer {
          right: var(--allyada-drawer-side, calc(24px / var(--allyada-ui-scale, 1)));
          left: auto;
        }
        .pos-left .allyada-drawer {
          left: var(--allyada-drawer-side, calc(24px / var(--allyada-ui-scale, 1)));
          right: auto;
        }
        .allyada-drawer.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0) scale(1);
        }
        .allyada-drawer.ally-compact-grid .tools-grid-2,
        .allyada-drawer.ally-compact-grid .profiles-grid {
          grid-template-columns: 1fr !important;
        }
        .allyada-drawer.ally-compact-grid .drawer-header,
        .allyada-drawer.ally-compact-grid .drawer-body,
        .allyada-drawer.ally-compact-grid .drawer-footer {
          padding-left: 16px;
          padding-right: 16px;
        }

        @media (max-width: 480px) {
          .allyada-drawer {
            width: var(--allyada-drawer-width, calc((100vw - 24px) / var(--allyada-ui-scale, 1)));
            max-width: var(--allyada-drawer-width, calc((100vw - 24px) / var(--allyada-ui-scale, 1)));
            right: var(--allyada-drawer-side, calc(12px / var(--allyada-ui-scale, 1))) !important;
            left: var(--allyada-drawer-side, calc(12px / var(--allyada-ui-scale, 1))) !important;
            bottom: var(--allyada-drawer-bottom, calc(88px / var(--allyada-ui-scale, 1)));
            max-height: var(--allyada-drawer-max-height, calc((100vh - 100px) / var(--allyada-ui-scale, 1)));
            border-radius: 20px;
          }
        }

        /* Header Premium */
        .drawer-header {
          padding: 18px 24px 14px;
          background: transparent;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-shrink: 0;
        }
        .header-brand-group {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .brand-badge-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary) 0%, #5e3ea1 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(121, 86, 194, 0.25);
        }
        .brand-badge-icon svg { width: 26px; height: 26px; display: block; }
        .brand-text { display: flex; flex-direction: column; min-width: 0; }
        .title-row { display: flex; align-items: center; gap: 8px; }
        .title-row h2 {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;
          line-height: 1.2;
        }
        .active-badge-pill {
          font-size: 12px;
          font-weight: 800;
          color: #5e3ea1;
          background: #f3effb;
          padding: 3px 8px;
          border-radius: 9999px;
          border: 1px solid #dcd0f5;
        }
        .brand-sub {
          font-size: 14px;
          color: var(--text-muted);
          font-weight: 500;
          line-height: 1.3;
          margin-top: 2px;
        }
        .header-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .btn-header-action, .btn-icon-close {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.6);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .btn-header-action:hover, .btn-icon-close:hover {
          background: #ffffff;
          color: var(--text-main);
          border-color: #cbd5e1;
          box-shadow: 0 4px 8px rgba(0,0,0,0.05);
        }
        .btn-header-action.active {
          background: #f3effb;
          color: #5e3ea1;
          border-color: #dcd0f5;
        }
        .btn-header-action:focus-visible, .btn-icon-close:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .btn-header-action svg, .btn-icon-close svg {
          width: 20px;
          height: 20px;
        }

        /* Abas Superiores */
        .suite-tabs {
          display: flex;
          padding: 8px 24px;
          background: rgba(241, 245, 249, 0.4);
          border-bottom: 1px solid var(--border-subtle);
          flex-shrink: 0;
          gap: 6px;
        }
        .suite-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 8px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 44px;
        }
        .suite-tab-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.8);
        }
        .suite-tab-btn.active {
          background: #ffffff;
          color: var(--primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }
        .suite-tab-btn:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .suite-tab-btn .tab-icon svg { width: 18px; height: 18px; }

        /* Conteúdo das Abas */
        .drawer-tab-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }
        .tab-scroll-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 20px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .tab-scroll-body::-webkit-scrollbar { width: 6px; }
        .tab-scroll-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; }

        /* Campo de Busca Rápida */
        .search-box-wrapper {
          padding: 16px 24px 4px;
          flex-shrink: 0;
        }
        .search-input-box {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .search-icon-svg {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .search-icon-svg svg { width: 18px; height: 18px; }
        .search-input-field {
          width: 100%;
          padding: 12px 36px 12px 40px;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          font-size: 14px;
          color: var(--text-main);
          outline: none;
          transition: all 0.2s ease;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }
        .search-input-field:focus {
          border-color: var(--primary);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02), 0 0 0 4px rgba(121, 86, 194, 0.15);
        }
        .search-clear-btn {
          position: absolute;
          right: 12px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #cbd5e1;
          color: #ffffff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search-clear-btn:hover { background: #94a3b8; }
        .search-clear-btn svg { width: 14px; height: 14px; }

        /* Controles de Configurações Customizados */
        .allyada-select {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          color: var(--text-main);
          font-size: 14px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }
        .allyada-select:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(121, 86, 194, 0.2); }
        .allyada-color-picker {
          -webkit-appearance: none;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          cursor: pointer;
          background: none;
          padding: 0;
        }
        .allyada-color-picker::-webkit-color-swatch-wrapper { padding: 0; }
        .allyada-color-picker::-webkit-color-swatch { border: 2px solid var(--border-subtle); border-radius: 8px; }

        /* Seções do Menu */
        .menu-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-heading h3 {
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .pill-badge {
          font-size: 12px;
          font-weight: 800;
          color: #5e3ea1;
          background: #f3effb;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1px solid #dcd0f5;
        }

        /* Grid do Modo Simples / Acesso Rápido */
        .quick-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .quick-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 8px;
          padding: 14px 6px;
          border-radius: var(--radius-btn);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
          min-height: 90px;
          position: relative;
        }
        .quick-tile:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.05);
        }
        .quick-tile.active {
          background: rgba(121, 86, 194, 0.06);
          border-color: var(--border-active);
          color: var(--primary);
        }
        .quick-tile.active::after {
          content: "✓";
          position: absolute;
          top: 6px;
          right: 6px;
          width: 18px;
          height: 18px;
          background: var(--primary);
          color: white;
          font-size: 11px;
          font-weight: bold;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quick-tile:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .tile-icon svg { width: 28px; height: 28px; transition: transform 0.2s ease; }
        .quick-tile:hover .tile-icon svg { transform: scale(1.1); }
        .tile-label { 
          font-size: 13px; 
          font-weight: 700; 
          line-height: 1.2; 
          word-break: break-word; 
          white-space: normal;
        }

        .btn-customize-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius-btn);
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-customize-link:hover {
          background: #ffffff;
          border-color: var(--primary);
          border-style: solid;
          box-shadow: 0 4px 12px rgba(121, 86, 194, 0.1);
        }
        .btn-customize-link:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .arrow-icon svg { width: 16px; height: 16px; }

        /* Perfis Humanos Premium */
        .profiles-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .profile-card {
          padding: 16px 18px;
          border-radius: var(--radius-card);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .profile-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.06);
        }
        .profile-card.active {
          background: rgba(121, 86, 194, 0.05);
          border-color: var(--border-active);
          box-shadow: 0 0 0 1px var(--border-active);
        }
        .profile-card.active::after {
          content: "✓ Ativo";
          position: absolute;
          top: 16px;
          right: 18px;
          font-size: 12px;
          font-weight: 800;
          color: var(--primary);
          background: rgba(121, 86, 194, 0.12);
          padding: 4px 10px;
          border-radius: 999px;
        }
        .profile-card:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          margin-bottom: 4px;
        }
        .card-icon-bubble {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
          transition: all 0.2s ease;
        }
        .profile-card.active .card-icon-bubble {
          background: var(--primary);
          color: #ffffff;
          box-shadow: 0 4px 8px rgba(121, 86, 194, 0.3);
        }
        .card-icon-bubble svg { width: 20px; height: 20px; }
        .card-tag {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }
        .card-heading {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
          padding-right: 70px;
        }
        .card-subtext {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .sub-selector-box {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          padding: 14px 16px;
        }
        .sub-selector-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
          display: block;
          margin-bottom: 10px;
        }

        /* Caixas de Controle (Steppers & Segmentados) */
        .control-box {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          padding: 14px 16px;
          transition: all 0.2s ease;
        }
        .control-box:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .control-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 8px;
        }
        .control-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-main);
          display: block;
        }
        .control-val {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 700;
        }
        .stepper-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-step {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .btn-step:hover:not(:disabled) {
          background: var(--bg-card-hover);
          border-color: #94a3b8;
        }
        .btn-step:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .btn-step:focus-visible {
          outline: 2px solid var(--primary);
        }

        .steps-progress {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }
        .prog-dot {
          flex: 1;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        .prog-dot.active {
          background: var(--primary);
        }

        .segmented-control {
          display: flex;
          flex-wrap: wrap;
          background: #e2e8f0;
          padding: 4px;
          border-radius: 10px;
          gap: 4px;
        }
        .seg-btn {
          flex: 1;
          padding: 8px 6px;
          font-size: 13px;
          font-weight: 700;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          min-height: 32px;
        }
        .seg-btn:hover { color: var(--text-main); }
        .seg-btn.active {
          background: #ffffff;
          color: var(--primary);
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        .seg-btn:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }

        /* Cards de Ferramentas com Toggle (Linear List) */
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .tool-card {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 12px 14px;
          border-radius: var(--radius-btn);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          min-height: 64px;
          position: relative;
          min-width: 0;
        }
        .tool-card.full-width {
          grid-column: 1 / -1;
        }
        .tool-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.04);
        }
        .tool-card.active {
          background: rgba(121, 86, 194, 0.05);
          border-color: var(--border-active);
          box-shadow: 0 0 0 1px var(--border-active);
        }
        .tool-card:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 1px;
        }
        .tool-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--text-main);
          transition: all 0.2s ease;
        }
        .tool-card.active .tool-icon-box {
          background: var(--primary);
          color: #ffffff;
        }
        .tool-icon-box svg { width: 16px; height: 16px; }
        .tool-info { flex: 1; min-width: 0; overflow: hidden; }
        .tool-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tool-desc {
          font-size: 12px;
          color: var(--text-muted);
          display: block;
          white-space: normal;
          line-height: 1.35;
          overflow-wrap: break-word;
        }
        .toggle-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .tool-card.active .toggle-indicator {
          background: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
        }

        /* Caixa de Prévia ao Vivo */
        .live-preview-wrapper {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius-card);
          padding: 12px 14px;
        }
        .preview-tag {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--primary);
          display: block;
          margin-bottom: 8px;
        }
        .live-preview-box {
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-main);
          padding: 10px 12px;
          background: #f8fafc;
          border-radius: 8px;
          transition: all 0.2s ease;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        /* Estrutura de Títulos (Navegação H1-H3) */
        .structure-nav-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn-action-tile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-btn);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .btn-action-tile:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 8px rgba(0,0,0,0.04);
        }
        .btn-action-tile:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .tile-icon-action {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #f3effb;
          color: #5e3ea1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tile-icon-action svg { width: 18px; height: 18px; }
        .tile-info-action strong { font-size: 14px; font-weight: 700; color: var(--text-main); display: block; }
        .tile-info-action span { font-size: 12px; color: var(--text-muted); display: block; }

        .headings-drawer {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          padding: 12px 14px;
          max-height: 250px;
          overflow-y: auto;
        }
        .headings-list-header {
          font-size: 12px;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .headings-list-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .btn-heading-target {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border: 1px solid transparent;
          border-radius: 8px;
          background: #f8fafc;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }
        .btn-heading-target:hover {
          background: #f3effb;
          border-color: #dcd0f5;
        }
        .btn-heading-target:focus-visible {
          outline: 2px solid var(--primary);
        }
        .heading-level-pill {
          font-size: 11px;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 6px;
          background: #e2e8f0;
          color: #334155;
          flex-shrink: 0;
        }
        .heading-level-pill.h1 { background: #f3effb; color: #5e3ea1; }
        .heading-level-pill.h2 { background: #fef3c7; color: #92400e; }
        .heading-level-pill.h3 { background: #f1f5f9; color: #475569; }
        .heading-text-label {
          font-size: 13px;
          color: var(--text-main);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .heading-empty-item {
          font-size: 13px;
          color: var(--text-muted);
          padding: 10px;
          text-align: center;
        }

        /* Player de Leitura TTS (Exibido apenas quando ativo) */
        .tts-player-panel {
          background: #f5f2fb;
          border: 1px solid #dcd0f5;
          border-radius: var(--radius-card);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(121, 86, 194, 0.08);
          grid-column: 1 / -1;
          width: 100%;
          box-sizing: border-box;
        }
        .tts-player-panel.full-width {
          grid-column: 1 / -1;
        }
        .tts-status-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #5e3ea1;
          line-height: 1.4;
        }
        .tts-pulse-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #7956c2;
          display: inline-block;
          flex-shrink: 0;
          animation: allyada-pulse 1.5s infinite;
        }
        @keyframes allyada-pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(121, 86, 194, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(121, 86, 194, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(121, 86, 194, 0); }
        }
        .tts-controls-row {
          display: flex;
          gap: 10px;
          width: 100%;
        }
        .btn-tts-action {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          min-height: 42px;
        }
        .btn-tts-action.primary {
          background: var(--primary);
          color: #ffffff;
          box-shadow: 0 3px 8px rgba(121, 86, 194, 0.25);
        }
        .btn-tts-action.primary:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
        .btn-tts-action.stop {
          background: #fee2e2;
          color: #dc2626;
          border: 1px solid #fca5a5;
        }
        .btn-tts-action.stop:hover {
          background: #fecaca;
          color: #b91c1c;
          border-color: #f87171;
          transform: translateY(-1px);
        }
        .btn-tts-action:focus-visible {
          outline: 3px solid var(--accent);
          outline-offset: 2px;
        }
        .btn-tts-action svg {
          width: 16px;
          height: 16px;
        }
        .tts-speed-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
        }
        .speed-label {
          font-size: 12px;
          font-weight: 700;
          color: #5e3ea1;
        }
        .tts-rates {
          display: flex;
          width: 100%;
        }
        .tts-rates .seg-btn {
          flex: 1;
          padding: 6px 0;
          font-size: 13px;
        }

        /* Card VLibras */
        .vlibras-banner-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-card);
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.2s ease;
        }
        .vlibras-banner-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 8px rgba(0,0,0,0.04);
        }
        .vlibras-banner-card.active {
          background: rgba(121, 86, 194, 0.05);
          border-color: var(--border-active);
        }
        .vlibras-banner-card:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .vlibras-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #7956c2;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 8px rgba(121, 86, 194, 0.25);
        }
        .vlibras-icon-box svg { width: 22px; height: 22px; }
        .vlibras-info { flex: 1; }
        .toggle-pill {
          font-size: 12px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 9999px;
          background: #e2e8f0;
          color: #475569;
        }
        .toggle-pill.active {
          background: #dcfce7;
          color: #15803d;
        }

        /* Configurações & Switch */
        .setting-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
        }
        .setting-text strong {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
        }
        .setting-text span {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .switch-toggle {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 26px;
          flex-shrink: 0;
        }
        .switch-toggle input { opacity: 0; width: 0; height: 0; }
        .switch-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #cbd5e1;
          border-radius: 26px;
          transition: .2s;
        }
        .switch-slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: .2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .switch-toggle input:checked + .switch-slider { background-color: #16a34a; }
        .switch-toggle input:focus-visible + .switch-slider { outline: 3px solid var(--primary); outline-offset: 2px; }
        .switch-toggle input:checked + .switch-slider:before { transform: translateX(18px); }

        /* Lista de Atalhos */
        .shortcuts-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .shortcut-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-btn);
          font-size: 14px;
          color: var(--text-secondary);
        }
        .kbd-combo kbd {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-main);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        /* Chips de Ajustes Ativos */
        .active-adjustments-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-height: 44px;
        }
        .adjustment-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: #f5f2fb;
          border: 1px solid #dcd0f5;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #5e3ea1;
        }
        .btn-chip-remove {
          border: none;
          background: transparent;
          color: #7956c2;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 4px;
        }
        .btn-chip-remove:hover { color: #4a2e85; background: #e8e0f8; }
        .btn-chip-remove:focus-visible { outline: 2px solid #5e3ea1; }
        .btn-chip-remove svg { width: 14px; height: 14px; }
        .active-none-msg {
          font-size: 14px;
          color: var(--text-muted);
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.6);
          border: 1px dashed var(--border-subtle);
          border-radius: 10px;
          width: 100%;
          text-align: center;
        }

        .btn-reset-all-full {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 16px;
          border-radius: var(--radius-btn);
          border: 1px solid #cbd5e1;
          background: rgba(255, 255, 255, 0.8);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-reset-all-full:hover:not(:disabled) {
          background: #fee2e2;
          color: #b91c1c;
          border-color: #fca5a5;
        }
        .btn-reset-all-full:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .btn-reset-all-full:focus-visible { outline: 3px solid var(--primary); }
        .btn-reset-all-full svg { width: 16px; height: 16px; }

                /* Barra Fixa Inferior com Botão Vermelho de Desfazer */
        .drawer-fixed-action-bar {
          flex-shrink: 0;
          padding: 10px 18px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
          z-index: 10;
        }
        .btn-reset-preferences-fixed {
          width: 100%;
          padding: 12px 18px;
          background: #dc2626 !important;
          color: #ffffff !important;
          border: none !important;
          border-radius: 12px !important;
          font-size: 15px !important;
          font-weight: 700 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.25) !important;
        }
        .btn-reset-preferences-fixed:hover:not(:disabled) {
          background: #b91c1c !important;
          box-shadow: 0 6px 18px rgba(220, 38, 38, 0.35) !important;
          transform: translateY(-1px);
        }
        .btn-reset-preferences-fixed:active:not(:disabled) {
          transform: translateY(0);
        }
        .btn-reset-preferences-fixed:disabled {
          background: #fca5a5 !important;
          opacity: 0.65 !important;
          cursor: not-allowed !important;
          box-shadow: none !important;
        }
        .btn-reset-preferences-fixed svg {
          width: 18px;
          height: 18px;
        }

        /* Rodapé Premium */
        .drawer-footer {
          flex-shrink: 0;
          padding: 12px 24px;
          border-top: 1px solid var(--border-subtle);
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .drawer-footer kbd {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-main);
          box-shadow: 0 1px 1px rgba(0,0,0,0.06);
        }
        .shortcut-tip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .footer-brand-tag { font-weight: 700; color: var(--primary); font-size: 11px; }

        .mt-2 { margin-top: 6px; }
        .mt-3 { margin-top: 8px; }

        @media (max-width: 480px) {
          .tools-grid { grid-template-columns: 1fr; }
          .tool-card.full-width { grid-column: 1; }
          .quick-grid { grid-template-columns: repeat(2, 1fr); }
          .profiles-grid { grid-template-columns: 1fr; }
        }
      `;
    }
  }

  const instance = new AllyadaPlugin();

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const currentScript = document.currentScript || document.querySelector('script[src*="allyada"], script[src*="acessibilidade"]');
        const autoInit = currentScript ? currentScript.getAttribute('data-auto-init') !== 'false' : true;
        if (autoInit && !instance.hostContainer) {
          instance.init();
        }
      });
    } else {
      setTimeout(() => {
        if (!instance.hostContainer) {
          instance.init();
        }
      }, 0);
    }
  }

  return instance;
}));
