/**
 * Allyada - Plataforma de Acessibilidade Digital
 * "Sua aliada em acessibilidade web"
 * 
 * Versão 2.5 - Redesign UX/UI Senior & Motor Anti-Quebra
 * 
 * Destaques do Redesign:
 * 1. Design System Premium:
 *    - Ícones vetoriais SVG nítidos e consistentes (substituição total de emojis).
 *    - Switches táteis e badges de estado ativo em cada card.
 *    - Micro-interações, sombras suaves e acabamento refinado (estilo Linear/Vercel/Apple).
 * 2. Controle Tipográfico Granular:
 *    - Tamanho da Fonte: 5 níveis com barra de progresso visual (100%, 115%, 130%, 145%, 160%).
 *    - Espaçamento de Linhas: Seletor em 3 níveis (Padrão 1.5, Confortável 1.9, Amplo 2.3).
 *    - Espaçamento de Letras: Seletor em 3 níveis (Normal, Médio, Amplo).
 * 3. Motor Anti-Quebra (Layout Shield):
 *    - Proteção estrita de navbars, botões, ícones SVG e flex/grid containers.
 *    - Preservação da hierarquia de formulários e caixas de texto.
 *    - Contraste semântico não-destrutivo.
 * 4. Posicionamento Harmonizado do VLibras e Leitor TTS com realce dourado.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exportsObj = factory();
    root.Allyada = exportsObj;
    root.AcessiWeb = exportsObj; // Compatibilidade retroativa
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const STORAGE_KEY = 'allyada_preferences';
  const LEGACY_KEY = 'acessiweb_preferences';
  
  const DEFAULT_CONFIG = {
    position: 'right', // 'right' ou 'left'
    primaryColor: '#0052cc',
    accentColor: '#ffab00',
    shortcutKey: 'a', // Alt + A
    enableSpeech: true,
    enableVLibras: true,
    speechLang: 'pt-BR',
    autoInit: true
  };

  const DEFAULT_STATE = {
    activeProfile: null, // 'adhd', 'colorblind', 'epilepsy', 'low-vision', 'dyslexia'
    colorblindType: 'deuteranopia', // 'deuteranopia', 'protanopia', 'tritanopia'
    fontSizeLevel: 0, // 0: 100%, 1: 115%, 2: 130%, 3: 145%, 4: 160%
    lineHeightLevel: 0, // 0: Padrão, 1: Confortável (1.9), 2: Amplo (2.3)
    letterSpacingLevel: 0, // 0: Padrão, 1: Médio (+0.08em), 2: Amplo (+0.16em)
    dyslexicFont: false,
    textAlignLeft: false,
    contrast: 'normal', // 'normal', 'dark', 'light', 'monochrome', 'invert'
    highlightLinks: false,
    bigCursor: false,
    stopAnimations: false,
    readingRuler: false,
    vlibrasActive: false
  };

  // SVGs dos ícones do Design System
  const ICONS = {
    allyada: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"></circle><path d="M4 8h16"></path><path d="M12 8v6"></path><path d="M8 20l4-6 4 6"></path></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`,
    sound: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`,
    stop: `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12"></rect></svg>`,
    brain: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z"></path></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
    glasses: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="15" r="4"></circle><circle cx="18" cy="15" r="4"></circle><path d="M14 15a2 2 0 0 0-4 0"></path><path d="M2.5 13 5 7c.7-1.3 1.9-2 3.5-2"></path><path d="M21.5 13 19 7c-.7-1.3-1.9-2-3.5-2"></path></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    type: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>`,
    alignLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    contrast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"></path></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.3 8.7 8.7 21.3c-1 1-2.6 1-3.6 0l-1.4-1.4c-1-1-1-2.6 0-3.6L16.3 3.7c1-1 2.6-1 3.6 0l1.4 1.4c1 1 1 2.6 0 3.6z"></path><line x1="7.5" y1="10.5" x2="9.5" y2="12.5"></line><line x1="10.5" y1="7.5" x2="12.5" y2="9.5"></line><line x1="13.5" y1="4.5" x2="15.5" y2="6.5"></line></svg>`,
    cursor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 3 7 18 3-7 7-3L3 3z"></path></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    hands: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v6"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
  };

  class AllyadaPlugin {
    constructor() {
      this.config = { ...DEFAULT_CONFIG };
      this.state = { ...DEFAULT_STATE };
      this.hostContainer = null;
      this.shadowRoot = null;
      this.rulerElement = null;
      this.svgFiltersContainer = null;
      this.speechSynthesizer = null;
      this.speechUtterance = null;
      this.currentSpeakingNode = null;
      this.isSpeaking = false;
      this.isSpeechPaused = false;
      this.isOpen = false;
      this.previousFocusedElement = null;
      this.rulerRafId = null;
      this.mouseY = 0;
    }

    /**
     * Inicializa a Allyada
     */
    init(options = {}) {
      if (this.hostContainer) {
        console.warn('[Allyada] O plugin já foi inicializado nesta página.');
        return this;
      }

      this.config = { ...this.config, ...options };
      this.loadState();
      this.injectHostStyles();
      this.injectSvgFilters();
      this.createReadingRulerDOM();
      this.createWidgetDOM();
      this.initSpeechSynthesis();
      this.setupGlobalShortcuts();
      this.applyAllStateChanges();

      if (this.state.vlibrasActive) {
        this.loadVLibras();
      }

      console.log('[Allyada v2.5] Inicializada com sucesso. Pressione Alt + A para abrir.');
      return this;
    }

    /**
     * Carrega estado salvo
     */
    loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.state = { ...DEFAULT_STATE, ...parsed };
        }
      } catch (e) {
        console.warn('[Allyada] Erro ao carregar preferências:', e);
      }
    }

    /**
     * Salva estado atual
     */
    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('[Allyada] Erro ao salvar preferências:', e);
      }
    }

    /**
     * Restaura tudo para o padrão
     */
    resetState() {
      this.stopSpeech();
      this.state = { ...DEFAULT_STATE };
      this.saveState();
      this.applyAllStateChanges();
      this.updatePanelUI();
    }

    /**
     * Injeta filtros SVG nativos para Daltonismo
     */
    injectSvgFilters() {
      if (document.getElementById('allyada-svg-filters')) return;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
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
      document.documentElement.appendChild(svg);
      this.svgFiltersContainer = svg;
    }

    /**
     * Injeta regras anti-quebra de layout no site
     */
    injectHostStyles() {
      if (document.getElementById('allyada-host-styles')) return;

      const style = document.createElement('style');
      style.id = 'allyada-host-styles';
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');

        /* Espaçamento de Linhas (3 Níveis) - Foco apenas em blocos de leitura */
        html.ally-line-height-1 p,
        html.ally-line-height-1 article p,
        html.ally-line-height-1 li,
        html.ally-line-height-1 blockquote,
        html.ally-line-height-1 dd,
        html.ally-line-height-1 .article-text {
          line-height: 1.9 !important;
        }

        html.ally-line-height-2 p,
        html.ally-line-height-2 article p,
        html.ally-line-height-2 li,
        html.ally-line-height-2 blockquote,
        html.ally-line-height-2 dd,
        html.ally-line-height-2 .article-text {
          line-height: 2.3 !important;
        }

        /* Espaçamento de Letras (3 Níveis) */
        html.ally-letter-spacing-1 p,
        html.ally-letter-spacing-1 article,
        html.ally-letter-spacing-1 li,
        html.ally-letter-spacing-1 blockquote,
        html.ally-letter-spacing-1 h1,
        html.ally-letter-spacing-1 h2,
        html.ally-letter-spacing-1 h3,
        html.ally-letter-spacing-1 h4 {
          letter-spacing: 0.08em !important;
          word-spacing: 0.12em !important;
        }

        html.ally-letter-spacing-2 p,
        html.ally-letter-spacing-2 article,
        html.ally-letter-spacing-2 li,
        html.ally-letter-spacing-2 blockquote,
        html.ally-letter-spacing-2 h1,
        html.ally-letter-spacing-2 h2,
        html.ally-letter-spacing-2 h3,
        html.ally-letter-spacing-2 h4 {
          letter-spacing: 0.16em !important;
          word-spacing: 0.20em !important;
        }

        /* Fonte para Dislexia (Lexend) - Proteção explícita de fontes de ícones */
        html.ally-dyslexic-font body,
        html.ally-dyslexic-font p,
        html.ally-dyslexic-font h1,
        html.ally-dyslexic-font h2,
        html.ally-dyslexic-font h3,
        html.ally-dyslexic-font h4,
        html.ally-dyslexic-font h5,
        html.ally-dyslexic-font h6,
        html.ally-dyslexic-font li,
        html.ally-dyslexic-font blockquote,
        html.ally-dyslexic-font label,
        html.ally-dyslexic-font input,
        html.ally-dyslexic-font textarea,
        html.ally-dyslexic-font select,
        html.ally-dyslexic-font button,
        html.ally-dyslexic-font a:not([class*="icon"]) {
          font-family: 'Lexend', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        }

        /* Alinhamento à Esquerda (sem afetar alinhamentos de botões ou hero) */
        html.ally-text-align-left p,
        html.ally-text-align-left article p,
        html.ally-text-align-left li,
        html.ally-text-align-left blockquote,
        html.ally-text-align-left .article-text {
          text-align: left !important;
        }

        /* Alto Contraste Escuro (WCAG AAA) - Não destrutivo */
        html.ally-contrast-dark,
        html.ally-contrast-dark body {
          background-color: #121212 !important;
          color: #f8fafc !important;
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
        html.ally-contrast-dark .test-guide-box {
          background-color: #064e3b !important;
          border-color: #059669 !important;
        }
        html.ally-contrast-dark .test-guide-box h4,
        html.ally-contrast-dark .test-guide-box ul,
        html.ally-contrast-dark .test-guide-box li {
          color: #d1fae5 !important;
        }

        /* Alto Contraste Claro */
        html.ally-contrast-light,
        html.ally-contrast-light body {
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        html.ally-contrast-light header,
        html.ally-contrast-light nav,
        html.ally-contrast-light main,
        html.ally-contrast-light article,
        html.ally-contrast-light aside,
        html.ally-contrast-light footer,
        html.ally-contrast-light section,
        html.ally-contrast-light .article-card,
        html.ally-contrast-light .sidebar-widget {
          background-color: #ffffff !important;
          color: #000000 !important;
          border-color: #000000 !important;
        }
        html.ally-contrast-light .hero-banner {
          background: #f8fafc !important;
          color: #000000 !important;
          border-bottom: 2px solid #000000 !important;
        }
        html.ally-contrast-light .hero-banner h1,
        html.ally-contrast-light .hero-banner p {
          color: #000000 !important;
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
        html.ally-contrast-light input,
        html.ally-contrast-light textarea {
          background-color: #ffffff !important;
          color: #000000 !important;
          border: 2px solid #000000 !important;
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

        /* Filtros Daltonismo SVG */
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
        html.ally-highlight-links a:not([data-allyada-ignore]),
        html.ally-highlight-links [role="button"]:not([data-allyada-ignore]) {
          outline: 3px solid #f59e0b !important;
          outline-offset: 3px !important;
          text-decoration: underline 3px #f59e0b !important;
          text-underline-offset: 4px !important;
          font-weight: 700 !important;
          border-radius: 2px !important;
        }

        /* Cursor Grande */
        html.ally-big-cursor,
        html.ally-big-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23000000' stroke='%23ffffff' stroke-width='2'%3E%3Cpath d='M3 3l7 18 3-7 7-3L3 3z'/%3E%3C/svg%3E"), auto !important;
        }

        /* Parar Animações */
        html.ally-stop-animations *,
        html.ally-stop-animations *::before,
        html.ally-stop-animations *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          scroll-behavior: auto !important;
        }

        /* Realce Visual na Leitura TTS */
        .allyada-reading-highlight {
          background-color: #fef08a !important;
          color: #000000 !important;
          outline: 3px solid #f59e0b !important;
          border-radius: 4px !important;
          transition: background-color 0.2s ease !important;
        }

        /* Posicionamento Inteligente do Botão VLibras */
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
      document.head.appendChild(style);
    }

    /**
     * Cria a Régua de Leitura
     */
    createReadingRulerDOM() {
      if (document.getElementById('allyada-reading-ruler')) return;

      const ruler = document.createElement('div');
      ruler.id = 'allyada-reading-ruler';
      ruler.setAttribute('aria-hidden', 'true');
      ruler.setAttribute('data-allyada-ignore', 'true');
      ruler.style.cssText = `
        display: none;
        position: fixed;
        left: 0;
        right: 0;
        height: 44px;
        background: rgba(254, 240, 138, 0.35);
        border-top: 3px solid #f59e0b;
        border-bottom: 3px solid #f59e0b;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
        pointer-events: none;
        z-index: 2147483640;
        transform: translateY(-50%);
        will-change: top;
      `;
      document.documentElement.appendChild(ruler);
      this.rulerElement = ruler;

      const onPointerMove = (clientY) => {
        this.mouseY = clientY;
        if (!this.rulerRafId && this.state.readingRuler) {
          this.rulerRafId = requestAnimationFrame(() => {
            if (this.rulerElement) {
              this.rulerElement.style.top = `${this.mouseY}px`;
            }
            this.rulerRafId = null;
          });
        }
      };

      window.addEventListener('mousemove', (e) => onPointerMove(e.clientY), { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) onPointerMove(e.touches[0].clientY);
      }, { passive: true });
    }

    /**
     * Cria o Shadow DOM com o novo Design System UX/UI Senior
     */
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
        <!-- Botão Flutuante (FAB) -->
        <button type="button" 
                class="allyada-fab" 
                id="allyada-trigger-btn"
                aria-label="Abrir Menu de Acessibilidade Allyada (Atalho: Alt + A)"
                aria-haspopup="dialog"
                aria-expanded="false"
                title="Allyada - Acessibilidade Digital (Alt + A)">
          <span class="fab-icon">${ICONS.allyada}</span>
          <span class="fab-badge" aria-hidden="true" id="allyada-active-count">0</span>
        </button>

        <!-- Drawer Lateral -->
        <div class="allyada-drawer" 
             id="allyada-panel" 
             role="dialog" 
             aria-modal="true" 
             aria-labelledby="allyada-title"
             aria-hidden="true">
          
          <!-- Header -->
          <div class="drawer-header">
            <div class="header-brand-group">
              <div class="brand-badge-icon" aria-hidden="true">${ICONS.allyada}</div>
              <div class="brand-text">
                <h2 id="allyada-title">Allyada</h2>
                <span class="brand-sub">Sua aliada em acessibilidade</span>
              </div>
            </div>
            <button type="button" class="btn-icon-close" id="allyada-close-btn" aria-label="Fechar menu de acessibilidade (Esc)">
              ${ICONS.close}
            </button>
          </div>

          <!-- Barra de Utilidades / Ações Rápidas -->
          <div class="utility-bar">
            <button type="button" class="btn-utility reset" id="btn-reset-all" title="Restaurar padrão">
              <span class="btn-icon">${ICONS.reset}</span>
              <span>Redefinir</span>
            </button>

            <div class="tts-utility-group" id="voice-controls-box">
              <button type="button" class="btn-utility tts" id="btn-read-page" title="Ouvir texto">
                <span class="btn-icon" id="voice-icon-box">${ICONS.sound}</span>
                <span id="voice-btn-text">Ouvir Texto</span>
              </button>
              <button type="button" class="btn-utility tts-stop" id="btn-stop-voice" style="display:none;" title="Parar fala">
                ${ICONS.stop}
              </button>
            </div>
          </div>

          <!-- Corpo do Menu -->
          <div class="drawer-body">
            
            <!-- SEÇÃO: Perfis em 1 Clique -->
            <section class="menu-section">
              <div class="section-heading">
                <h3>Perfis em 1 Clique</h3>
                <span class="pill-badge">Automático</span>
              </div>
              
              <div class="profiles-grid">
                
                <button type="button" class="profile-card" id="profile-adhd" aria-pressed="false">
                  <div class="card-top-row">
                    <div class="card-icon-bubble">${ICONS.brain}</div>
                    <span class="card-tag">Foco</span>
                  </div>
                  <strong class="card-heading">TDAH & Atenção</strong>
                  <p class="card-subtext">Régua de leitura, sem distrações e links visíveis.</p>
                </button>

                <button type="button" class="profile-card" id="profile-colorblind" aria-pressed="false">
                  <div class="card-top-row">
                    <div class="card-icon-bubble">${ICONS.eye}</div>
                    <span class="card-tag">Cores</span>
                  </div>
                  <strong class="card-heading">Daltonismo</strong>
                  <p class="card-subtext">Filtros clínicos de matiz de cor para compensação.</p>
                </button>

                <button type="button" class="profile-card" id="profile-epilepsy" aria-pressed="false">
                  <div class="card-top-row">
                    <div class="card-icon-bubble">${ICONS.zap}</div>
                    <span class="card-tag">Segurança</span>
                  </div>
                  <strong class="card-heading">Anti-Crises</strong>
                  <p class="card-subtext">Pausa vídeos, flashes, transições e reduz brilho.</p>
                </button>

                <button type="button" class="profile-card" id="profile-low-vision" aria-pressed="false">
                  <div class="card-top-row">
                    <div class="card-icon-bubble">${ICONS.glasses}</div>
                    <span class="card-tag">Visão</span>
                  </div>
                  <strong class="card-heading">Baixa Visão</strong>
                  <p class="card-subtext">Texto ampliado (+30%), alto contraste e cursor grande.</p>
                </button>

                <button type="button" class="profile-card" id="profile-dyslexia" aria-pressed="false">
                  <div class="card-top-row">
                    <div class="card-icon-bubble">${ICONS.book}</div>
                    <span class="card-tag">Leitura</span>
                  </div>
                  <strong class="card-heading">Dislexia</strong>
                  <p class="card-subtext">Fonte Lexend com espaçamento amplo e confortável.</p>
                </button>

              </div>

              <!-- Sub-seletor Daltonismo -->
              <div class="sub-selector-box" id="colorblind-selector-box" style="display: none;">
                <span class="sub-selector-title">Tipo de Daltonismo:</span>
                <div class="segmented-control">
                  <button type="button" class="seg-btn active" data-type="deuteranopia" id="cb-deuteranopia">Deuteranopia (Verde)</button>
                  <button type="button" class="seg-btn" data-type="protanopia" id="cb-protanopia">Protanopia (Vermelho)</button>
                  <button type="button" class="seg-btn" data-type="tritanopia" id="cb-tritanopia">Tritanopia (Azul)</button>
                </div>
              </div>
            </section>

            <!-- SEÇÃO: Tipografia & Leitura Granular -->
            <section class="menu-section">
              <div class="section-heading">
                <h3>Texto & Tipografia</h3>
              </div>

              <!-- Stepper: Tamanho da Fonte com 5 níveis -->
              <div class="control-box">
                <div class="control-box-header">
                  <div>
                    <strong class="control-title">Tamanho do Texto</strong>
                    <span class="control-val" id="font-size-indicator">Padrão (100%)</span>
                  </div>
                  <div class="stepper-actions">
                    <button type="button" class="btn-step" id="btn-font-decrease" aria-label="Diminuir texto">-</button>
                    <button type="button" class="btn-step" id="btn-font-increase" aria-label="Aumentar texto">+</button>
                  </div>
                </div>
                <!-- Indicador de barras de progresso -->
                <div class="steps-progress" id="font-progress-bar">
                  <span class="prog-dot active"></span>
                  <span class="prog-dot"></span>
                  <span class="prog-dot"></span>
                  <span class="prog-dot"></span>
                  <span class="prog-dot"></span>
                </div>
              </div>

              <!-- Stepper Granular: Espaçamento de Linhas (3 Níveis) -->
              <div class="control-box">
                <div class="control-box-header">
                  <div>
                    <strong class="control-title">Espaçamento de Linhas</strong>
                    <span class="control-val" id="line-height-indicator">Padrão</span>
                  </div>
                </div>
                <div class="segmented-control mt-2">
                  <button type="button" class="seg-btn active" id="btn-lh-0">Padrão</button>
                  <button type="button" class="seg-btn" id="btn-lh-1">Confortável (1.9x)</button>
                  <button type="button" class="seg-btn" id="btn-lh-2">Amplo (2.3x)</button>
                </div>
              </div>

              <!-- Stepper Granular: Espaçamento de Letras (3 Níveis) -->
              <div class="control-box">
                <div class="control-box-header">
                  <div>
                    <strong class="control-title">Espaçamento de Letras</strong>
                    <span class="control-val" id="letter-spacing-indicator">Padrão</span>
                  </div>
                </div>
                <div class="segmented-control mt-2">
                  <button type="button" class="seg-btn active" id="btn-ls-0">Normal</button>
                  <button type="button" class="seg-btn" id="btn-ls-1">Médio (+0.08em)</button>
                  <button type="button" class="seg-btn" id="btn-ls-2">Amplo (+0.16em)</button>
                </div>
              </div>

              <!-- Grid de Ferramentas de Texto -->
              <div class="tools-grid mt-3">
                <button type="button" class="tool-card" id="card-dyslexic-font" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.type}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Fonte Dislexia</strong>
                    <span class="tool-desc">Tipografia Lexend</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>

                <button type="button" class="tool-card" id="card-text-align-left" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.alignLeft}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Alinhar à Esquerda</strong>
                    <span class="tool-desc">Sem justificado</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>
              </div>

            </section>

            <!-- SEÇÃO: Contraste & Cores -->
            <section class="menu-section">
              <div class="section-heading">
                <h3>Contraste & Cores</h3>
              </div>

              <div class="tools-grid">
                <button type="button" class="tool-card" id="card-contrast-dark" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.moon}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Alto Contraste</strong>
                    <span class="tool-desc">Fundo Escuro</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>

                <button type="button" class="tool-card" id="card-contrast-light" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.sun}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Contraste Claro</strong>
                    <span class="tool-desc">Branco Puro</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>

                <button type="button" class="tool-card" id="card-contrast-monochrome" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.contrast}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Monocromático</strong>
                    <span class="tool-desc">Escala de cinza</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>

                <button type="button" class="tool-card" id="card-contrast-invert" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.refresh}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Inverter Cores</strong>
                    <span class="tool-desc">Inversão suave</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>
              </div>
            </section>

            <!-- SEÇÃO: Navegação & Foco -->
            <section class="menu-section">
              <div class="section-heading">
                <h3>Navegação & Foco</h3>
              </div>

              <div class="tools-grid">
                <button type="button" class="tool-card" id="card-highlight-links" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.link}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Destacar Links</strong>
                    <span class="tool-desc">Contorno visível</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>

                <button type="button" class="tool-card" id="card-reading-ruler" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.ruler}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Guia de Leitura</strong>
                    <span class="tool-desc">Régua para TDAH</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>

                <button type="button" class="tool-card" id="card-big-cursor" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.cursor}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Cursor Ampliado</strong>
                    <span class="tool-desc">Ponteiro grande</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>

                <button type="button" class="tool-card" id="card-stop-animations" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.pause}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Parar Animações</strong>
                    <span class="tool-desc">Congela movimentos</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>
              </div>
            </section>

            <!-- SEÇÃO: Língua de Sinais (VLibras) -->
            <section class="menu-section">
              <div class="section-heading">
                <h3>Língua de Sinais (Libras)</h3>
              </div>

              <button type="button" class="vlibras-banner-card" id="card-vlibras-toggle" aria-pressed="false">
                <div class="vlibras-icon-box">${ICONS.hands}</div>
                <div class="vlibras-info">
                  <strong class="tool-title">Ativar VLibras</strong>
                  <span class="tool-desc">Avatar 3D tradutor posicionado acima da Allyada</span>
                </div>
                <div class="toggle-pill" id="vlibras-pill">Desativado</div>
              </button>
            </section>

          </div>

          <!-- Rodapé -->
          <div class="drawer-footer">
            <span class="shortcut-tip">Atalho: <kbd>Alt</kbd> + <kbd>A</kbd></span>
            <span class="footer-brand-tag">Allyada v2.5</span>
          </div>

        </div>

        <div class="allyada-backdrop" id="allyada-backdrop" aria-hidden="true"></div>
      `;

      this.shadowRoot.appendChild(wrapper);
      document.documentElement.appendChild(this.hostContainer);

      this.bindPanelEvents();
    }

    /**
     * Associa eventos aos elementos da interface
     */
    bindPanelEvents() {
      const root = this.shadowRoot;

      // Disparador de abrir
      const triggerBtn = root.getElementById('allyada-trigger-btn');
      triggerBtn.addEventListener('click', () => this.togglePanel());

      // Fechar
      const closeBtn = root.getElementById('allyada-close-btn');
      closeBtn.addEventListener('click', () => this.closePanel());

      const backdrop = root.getElementById('allyada-backdrop');
      backdrop.addEventListener('click', () => this.closePanel());

      // Reset
      const resetBtn = root.getElementById('btn-reset-all');
      resetBtn.addEventListener('click', () => this.resetState());

      // Perfis em 1 Clique
      const bindProfile = (btnId, profileKey, applyFn) => {
        const btn = root.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', () => {
          if (this.state.activeProfile === profileKey) {
            this.state.activeProfile = null;
            this.resetState();
          } else {
            this.state.activeProfile = profileKey;
            applyFn();
            this.saveState();
            this.applyAllStateChanges();
            this.updatePanelUI();
          }
        });
      };

      bindProfile('profile-adhd', 'adhd', () => {
        this.state.readingRuler = true;
        this.state.stopAnimations = true;
        this.state.highlightLinks = true;
        this.state.lineHeightLevel = 1;
      });

      bindProfile('profile-colorblind', 'colorblind', () => {
        this.state.highlightLinks = true;
      });

      bindProfile('profile-epilepsy', 'epilepsy', () => {
        this.state.stopAnimations = true;
        this.state.contrast = 'dark';
      });

      bindProfile('profile-low-vision', 'low-vision', () => {
        this.state.fontSizeLevel = 2; // +30%
        this.state.contrast = 'dark';
        this.state.bigCursor = true;
        this.state.highlightLinks = true;
      });

      bindProfile('profile-dyslexia', 'dyslexia', () => {
        this.state.dyslexicFont = true;
        this.state.lineHeightLevel = 1;
        this.state.letterSpacingLevel = 1;
        this.state.textAlignLeft = true;
      });

      // Seletor de tipo de Daltonismo
      ['deuteranopia', 'protanopia', 'tritanopia'].forEach(type => {
        const pill = root.getElementById(`cb-${type}`);
        if (!pill) return;
        pill.addEventListener('click', () => {
          this.state.colorblindType = type;
          this.saveState();
          this.applyAllStateChanges();
          this.updatePanelUI();
        });
      });

      // Controle de Tamanho de Fonte (5 Níveis)
      const btnFontIncrease = root.getElementById('btn-font-increase');
      btnFontIncrease.addEventListener('click', () => {
        if (this.state.fontSizeLevel < 4) {
          this.state.fontSizeLevel++;
          this.state.activeProfile = null;
          this.saveState();
          this.applyAllStateChanges();
          this.updatePanelUI();
        }
      });

      const btnFontDecrease = root.getElementById('btn-font-decrease');
      btnFontDecrease.addEventListener('click', () => {
        if (this.state.fontSizeLevel > 0) {
          this.state.fontSizeLevel--;
          this.state.activeProfile = null;
          this.saveState();
          this.applyAllStateChanges();
          this.updatePanelUI();
        }
      });

      // Segmented: Espaçamento de Linhas
      [0, 1, 2].forEach(level => {
        const btn = root.getElementById(`btn-lh-${level}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          this.state.lineHeightLevel = level;
          this.state.activeProfile = null;
          this.saveState();
          this.applyAllStateChanges();
          this.updatePanelUI();
        });
      });

      // Segmented: Espaçamento de Letras
      [0, 1, 2].forEach(level => {
        const btn = root.getElementById(`btn-ls-${level}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          this.state.letterSpacingLevel = level;
          this.state.activeProfile = null;
          this.saveState();
          this.applyAllStateChanges();
          this.updatePanelUI();
        });
      });

      // Toggles de Ferramentas Simples
      const bindToggle = (id, stateKey) => {
        const el = root.getElementById(id);
        if (!el) return;
        el.addEventListener('click', () => {
          this.state[stateKey] = !this.state[stateKey];
          this.state.activeProfile = null;
          this.saveState();
          this.applyAllStateChanges();
          this.updatePanelUI();
        });
      };

      bindToggle('card-dyslexic-font', 'dyslexicFont');
      bindToggle('card-text-align-left', 'textAlignLeft');
      bindToggle('card-highlight-links', 'highlightLinks');
      bindToggle('card-big-cursor', 'bigCursor');
      bindToggle('card-stop-animations', 'stopAnimations');
      bindToggle('card-reading-ruler', 'readingRuler');

      // Toggles de Contraste
      ['dark', 'light', 'monochrome', 'invert'].forEach(opt => {
        const el = root.getElementById(`card-contrast-${opt}`);
        if (!el) return;
        el.addEventListener('click', () => {
          this.state.contrast = (this.state.contrast === opt) ? 'normal' : opt;
          this.state.activeProfile = null;
          this.saveState();
          this.applyAllStateChanges();
          this.updatePanelUI();
        });
      });

      // Toggle do VLibras
      const vlibrasBtn = root.getElementById('card-vlibras-toggle');
      vlibrasBtn.addEventListener('click', () => {
        this.state.vlibrasActive = !this.state.vlibrasActive;
        this.saveState();
        if (this.state.vlibrasActive) {
          this.loadVLibras();
        } else {
          const vwContainer = document.querySelector('[vw]');
          if (vwContainer) {
            vwContainer.style.display = 'none';
          }
        }
        this.updatePanelUI();
      });

      // TTS Leitor de Voz
      const readBtn = root.getElementById('btn-read-page');
      readBtn.addEventListener('click', () => this.handleSpeechClick());

      const stopVoiceBtn = root.getElementById('btn-stop-voice');
      stopVoiceBtn.addEventListener('click', () => this.stopSpeech());
    }

    /**
     * Escalonamento Universal Proporcional de Fontes
     */
    applyFontSize() {
      const factors = [1.0, 1.15, 1.30, 1.45, 1.60];
      const factor = factors[this.state.fontSizeLevel] || 1.0;
      const html = document.documentElement;

      if (this.state.fontSizeLevel > 0) {
        html.style.fontSize = `${(100 * factor).toFixed(1)}%`;
      } else {
        html.style.fontSize = '';
      }

      if (!document.body) return;
      const selectors = 'p, h1, h2, h3, h4, h5, h6, a, span, li, button, input, textarea, select, label, blockquote, figcaption, td, th, kbd, dt, dd';
      const elements = document.body.querySelectorAll(selectors);

      elements.forEach(el => {
        if (el.closest('#allyada-root') || el.closest('[data-allyada-ignore]') || el.closest('[vw]')) return;

        if (this.state.fontSizeLevel === 0) {
          if (el.dataset.allyOrigFont) {
            el.style.fontSize = '';
            delete el.dataset.allyOrigFont;
          }
        } else {
          if (!el.dataset.allyOrigFont) {
            const computed = window.getComputedStyle(el).fontSize;
            el.dataset.allyOrigFont = computed;
          }
          const origPx = parseFloat(el.dataset.allyOrigFont);
          if (!isNaN(origPx) && origPx > 0) {
            el.style.fontSize = `${(origPx * factor).toFixed(1)}px`;
          }
        }
      });
    }

    /**
     * Aplica alterações no DOM do site hospedeiro
     */
    applyAllStateChanges() {
      const html = document.documentElement;

      // Fonte
      this.applyFontSize();

      // Espaçamento de Linhas
      html.classList.remove('ally-line-height-1', 'ally-line-height-2');
      if (this.state.lineHeightLevel > 0) {
        html.classList.add(`ally-line-height-${this.state.lineHeightLevel}`);
      }

      // Espaçamento de Letras
      html.classList.remove('ally-letter-spacing-1', 'ally-letter-spacing-2');
      if (this.state.letterSpacingLevel > 0) {
        html.classList.add(`ally-letter-spacing-${this.state.letterSpacingLevel}`);
      }

      // Tipografia & Alinhamento
      html.classList.toggle('ally-dyslexic-font', this.state.dyslexicFont);
      html.classList.toggle('ally-text-align-left', this.state.textAlignLeft);

      // Contrastes
      html.classList.remove(
        'ally-contrast-dark', 
        'ally-contrast-light', 
        'ally-contrast-monochrome', 
        'ally-contrast-invert'
      );
      if (this.state.contrast !== 'normal') {
        html.classList.add(`ally-contrast-${this.state.contrast}`);
      }

      // Daltonismo SVG
      html.classList.remove(
        'ally-filter-deuteranopia',
        'ally-filter-protanopia',
        'ally-filter-tritanopia'
      );
      if (this.state.activeProfile === 'colorblind') {
        html.classList.add(`ally-filter-${this.state.colorblindType}`);
      }

      // Navegação e Foco
      html.classList.toggle('ally-highlight-links', this.state.highlightLinks);
      html.classList.toggle('ally-big-cursor', this.state.bigCursor);
      html.classList.toggle('ally-stop-animations', this.state.stopAnimations);

      // Régua de Leitura
      if (this.rulerElement) {
        this.rulerElement.style.display = this.state.readingRuler ? 'block' : 'none';
      }
    }

    /**
     * Atualiza o estado visual de todos os controles na UI da Allyada
     */
    updatePanelUI() {
      const root = this.shadowRoot;
      if (!root) return;

      // Perfis
      const profiles = ['adhd', 'colorblind', 'epilepsy', 'low-vision', 'dyslexia'];
      profiles.forEach(p => {
        const el = root.getElementById(`profile-${p}`);
        if (el) {
          const isActive = this.state.activeProfile === p;
          el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          el.classList.toggle('active', isActive);
        }
      });

      // Daltonismo Box
      const cbBox = root.getElementById('colorblind-selector-box');
      if (cbBox) {
        cbBox.style.display = this.state.activeProfile === 'colorblind' ? 'block' : 'none';
      }
      ['deuteranopia', 'protanopia', 'tritanopia'].forEach(type => {
        const pill = root.getElementById(`cb-${type}`);
        if (pill) {
          pill.classList.toggle('active', this.state.colorblindType === type);
        }
      });

      // Tamanho da Fonte (5 Níveis)
      const fontLabels = ['Padrão (100%)', '+15%', '+30%', '+45%', '+60%'];
      const fontIndicator = root.getElementById('font-size-indicator');
      if (fontIndicator) {
        fontIndicator.textContent = fontLabels[this.state.fontSizeLevel] || 'Padrão (100%)';
      }

      const btnDec = root.getElementById('btn-font-decrease');
      const btnInc = root.getElementById('btn-font-increase');
      if (btnDec) btnDec.disabled = this.state.fontSizeLevel === 0;
      if (btnInc) btnInc.disabled = this.state.fontSizeLevel === 4;

      // Barra de progresso do tamanho
      const dots = root.querySelectorAll('#font-progress-bar .prog-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx <= this.state.fontSizeLevel);
      });

      // Espaçamento de Linhas
      const lhLabels = ['Padrão', 'Confortável (1.9x)', 'Amplo (2.3x)'];
      const lhInd = root.getElementById('line-height-indicator');
      if (lhInd) lhInd.textContent = lhLabels[this.state.lineHeightLevel] || 'Padrão';
      [0, 1, 2].forEach(l => {
        const btn = root.getElementById(`btn-lh-${l}`);
        if (btn) btn.classList.toggle('active', this.state.lineHeightLevel === l);
      });

      // Espaçamento de Letras
      const lsLabels = ['Normal', 'Médio (+0.08em)', 'Amplo (+0.16em)'];
      const lsInd = root.getElementById('letter-spacing-indicator');
      if (lsInd) lsInd.textContent = lsLabels[this.state.letterSpacingLevel] || 'Normal';
      [0, 1, 2].forEach(l => {
        const btn = root.getElementById(`btn-ls-${l}`);
        if (btn) btn.classList.toggle('active', this.state.letterSpacingLevel === l);
      });

      // Ferramentas com Toggle
      const updateTool = (id, active) => {
        const el = root.getElementById(id);
        if (el) {
          el.setAttribute('aria-pressed', active ? 'true' : 'false');
          el.classList.toggle('active', !!active);
        }
      };

      updateTool('card-dyslexic-font', this.state.dyslexicFont);
      updateTool('card-text-align-left', this.state.textAlignLeft);
      updateTool('card-highlight-links', this.state.highlightLinks);
      updateTool('card-big-cursor', this.state.bigCursor);
      updateTool('card-stop-animations', this.state.stopAnimations);
      updateTool('card-reading-ruler', this.state.readingRuler);

      // Contrastes
      ['dark', 'light', 'monochrome', 'invert'].forEach(opt => {
        updateTool(`card-contrast-${opt}`, this.state.contrast === opt);
      });

      // VLibras
      updateTool('card-vlibras-toggle', this.state.vlibrasActive);
      const vlibrasPill = root.getElementById('vlibras-pill');
      if (vlibrasPill) {
        vlibrasPill.textContent = this.state.vlibrasActive ? 'Ativado' : 'Desativado';
        vlibrasPill.classList.toggle('active', this.state.vlibrasActive);
      }

      // Contador no Badge FAB
      let activeCount = 0;
      if (this.state.activeProfile) activeCount++;
      if (this.state.fontSizeLevel > 0) activeCount++;
      if (this.state.lineHeightLevel > 0) activeCount++;
      if (this.state.letterSpacingLevel > 0) activeCount++;
      if (this.state.dyslexicFont) activeCount++;
      if (this.state.textAlignLeft) activeCount++;
      if (this.state.contrast !== 'normal') activeCount++;
      if (this.state.highlightLinks) activeCount++;
      if (this.state.bigCursor) activeCount++;
      if (this.state.stopAnimations) activeCount++;
      if (this.state.readingRuler) activeCount++;
      if (this.state.vlibrasActive) activeCount++;

      const badge = root.getElementById('allyada-active-count');
      if (badge) {
        badge.textContent = activeCount;
        badge.style.display = activeCount > 0 ? 'flex' : 'none';
      }
    }

    togglePanel() {
      if (this.isOpen) {
        this.closePanel();
      } else {
        this.openPanel();
      }
    }

    openPanel() {
      this.isOpen = true;
      this.previousFocusedElement = document.activeElement;

      const panel = this.shadowRoot.getElementById('allyada-panel');
      const backdrop = this.shadowRoot.getElementById('allyada-backdrop');
      const trigger = this.shadowRoot.getElementById('allyada-trigger-btn');

      panel.classList.add('open');
      backdrop.classList.add('open');
      panel.setAttribute('aria-hidden', 'false');
      backdrop.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');

      this.updatePanelUI();

      setTimeout(() => {
        const closeBtn = this.shadowRoot.getElementById('allyada-close-btn');
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    closePanel() {
      this.isOpen = false;
      const panel = this.shadowRoot.getElementById('allyada-panel');
      const backdrop = this.shadowRoot.getElementById('allyada-backdrop');
      const trigger = this.shadowRoot.getElementById('allyada-trigger-btn');

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

      if (this.previousFocusedElement && typeof this.previousFocusedElement.focus === 'function') {
        this.previousFocusedElement.focus();
      }
    }

    setupGlobalShortcuts() {
      window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === this.config.shortcutKey) {
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
        const voiceBox = this.shadowRoot.getElementById('voice-controls-box');
        if (voiceBox) voiceBox.style.display = 'none';
        return;
      }
      this.speechSynthesizer = window.speechSynthesis;
    }

    handleSpeechClick() {
      if (!this.speechSynthesizer) return;

      if (this.isSpeaking) {
        if (this.isSpeechPaused) {
          this.speechSynthesizer.resume();
          this.isSpeechPaused = false;
          this.updateSpeechButtons(true, false);
        } else {
          this.speechSynthesizer.pause();
          this.isSpeechPaused = true;
          this.updateSpeechButtons(true, true);
        }
        return;
      }

      let textToRead = '';
      let targetNode = null;
      const selection = window.getSelection();

      if (selection && selection.toString().trim().length > 0) {
        textToRead = selection.toString().trim();
        targetNode = selection.anchorNode ? (selection.anchorNode.nodeType === 1 ? selection.anchorNode : selection.anchorNode.parentElement) : null;
      } else {
        targetNode = document.querySelector('main article') || document.querySelector('main') || document.querySelector('article') || document.body;
        textToRead = this.extractReadableText(targetNode);
      }

      if (!textToRead) {
        alert('Nenhum texto disponível para leitura.');
        return;
      }

      this.speakText(textToRead, targetNode);
    }

    speakText(text, targetNode) {
      this.speechSynthesizer.cancel();
      this.clearHighlight();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.config.speechLang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = this.speechSynthesizer.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
      if (ptVoice) {
        utterance.voice = ptVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.isSpeechPaused = false;
        this.updateSpeechButtons(true, false);
        if (targetNode && targetNode.classList) {
          targetNode.classList.add('allyada-reading-highlight');
          this.currentSpeakingNode = targetNode;
        }
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.isSpeechPaused = false;
        this.clearHighlight();
        this.updateSpeechButtons(false, false);
      };

      utterance.onerror = (e) => {
        console.warn('[Allyada] Erro na síntese de voz:', e);
        this.isSpeaking = false;
        this.isSpeechPaused = false;
        this.clearHighlight();
        this.updateSpeechButtons(false, false);
      };

      this.speechUtterance = utterance;
      this.speechSynthesizer.speak(utterance);
    }

    clearHighlight() {
      if (this.currentSpeakingNode) {
        this.currentSpeakingNode.classList.remove('allyada-reading-highlight');
        this.currentSpeakingNode = null;
      }
    }

    stopSpeech() {
      if (this.speechSynthesizer) {
        this.speechSynthesizer.cancel();
      }
      this.isSpeaking = false;
      this.isSpeechPaused = false;
      this.clearHighlight();
      this.updateSpeechButtons(false, false);
    }

    updateSpeechButtons(speaking, paused) {
      const root = this.shadowRoot;
      const textSpan = root.getElementById('voice-btn-text');
      const stopBtn = root.getElementById('btn-stop-voice');

      if (!textSpan || !stopBtn) return;

      if (speaking) {
        textSpan.textContent = paused ? 'Continuar' : 'Pausar';
        stopBtn.style.display = 'inline-flex';
      } else {
        textSpan.textContent = 'Ouvir Texto';
        stopBtn.style.display = 'none';
      }
    }

    extractReadableText(el) {
      if (!el) return '';
      const clone = el.cloneNode(true);
      const removeSelectors = ['script', 'style', 'noscript', '#allyada-root', '#allyada-reading-ruler', '#allyada-svg-filters', '[data-allyada-ignore]', '[vw]'];
      removeSelectors.forEach(sel => {
        clone.querySelectorAll(sel).forEach(node => node.remove());
      });
      return clone.innerText.slice(0, 3000);
    }

    loadVLibras() {
      if (window.VLibras) {
        const vwContainer = document.querySelector('[vw]');
        if (vwContainer) {
          vwContainer.style.display = 'block';
        }
        return;
      }

      let vwDiv = document.querySelector('[vw]');
      if (!vwDiv) {
        vwDiv = document.createElement('div');
        vwDiv.setAttribute('vw', '');
        vwDiv.className = 'enabled';
        vwDiv.setAttribute('data-allyada-ignore', 'true');
        vwDiv.innerHTML = `
          <div vw-access-button class="active"></div>
          <div vw-plugin-wrapper>
            <div class="vw-plugin-top-wrapper"></div>
          </div>
        `;
        document.body.appendChild(vwDiv);
      } else {
        vwDiv.style.display = 'block';
      }

      const script = document.createElement('script');
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.onload = () => {
        if (window.VLibras) {
          new window.VLibras.Widget({
            rootPath: 'https://vlibras.gov.br/app',
            position: this.config.position === 'right' ? 'R' : 'L'
          });
          console.log('[Allyada] VLibras carregado e posicionado perfeitamente.');
        }
      };
      document.body.appendChild(script);
    }

    /**
     * Folha de Estilos com Design System Senior
     */
    getShadowStyles() {
      return `
        :host {
          --primary: ${this.config.primaryColor};
          --primary-hover: #0043a8;
          --accent: ${this.config.accentColor};
          --bg-panel: #ffffff;
          --bg-card: #f8fafc;
          --bg-card-hover: #f1f5f9;
          --bg-card-active: #eff6ff;
          --border-subtle: #e2e8f0;
          --border-active: #2563eb;
          --text-main: #0f172a;
          --text-secondary: #475569;
          --text-muted: #64748b;
          --shadow-floating: 0 12px 36px -4px rgba(0, 30, 80, 0.22), 0 4px 12px -2px rgba(0, 0, 0, 0.08);
          --shadow-card: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
          --radius-card: 12px;
          --radius-btn: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-main);
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
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
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, #0284c7 100%);
          color: #ffffff;
          border: 3px solid #ffffff;
          box-shadow: 0 8px 24px -2px rgba(0, 82, 204, 0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease;
          position: relative;
        }
        .allyada-fab:hover {
          transform: scale(1.08) translateY(-2px);
          box-shadow: 0 12px 28px rgba(0, 82, 204, 0.55);
        }
        .allyada-fab:focus-visible {
          outline: 4px solid var(--accent);
          outline-offset: 3px;
        }
        .fab-icon svg {
          width: 28px;
          height: 28px;
        }
        .fab-badge {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 22px;
          height: 22px;
          background: #ef4444;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          border-radius: 50%;
          display: none;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        /* Backdrop translúcido */
        .allyada-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(2px);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, visibility 0.25s ease;
          z-index: 2147483646;
        }
        .allyada-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        /* Drawer Lateral */
        .allyada-drawer {
          position: fixed;
          top: 0;
          width: 430px;
          max-width: 94vw;
          height: 100vh;
          background: var(--bg-panel);
          box-shadow: var(--shadow-floating);
          display: flex;
          flex-direction: column;
          z-index: 2147483647;
          transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pos-right .allyada-drawer {
          right: 0;
          transform: translateX(110%);
        }
        .pos-left .allyada-drawer {
          left: 0;
          transform: translateX(-110%);
        }
        .allyada-drawer.open {
          transform: translateX(0);
        }

        /* Header */
        .drawer-header {
          flex-shrink: 0;
          padding: 18px 22px;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
        }
        .header-brand-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand-badge-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary), #0284c7);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-badge-icon svg {
          width: 22px;
          height: 22px;
        }
        .brand-text h2 {
          font-size: 1.18rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }
        .brand-sub {
          font-size: 0.76rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .btn-icon-close {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: var(--radius-btn);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .btn-icon-close:hover {
          background: #f1f5f9;
          color: var(--text-main);
        }
        .btn-icon-close:focus-visible {
          outline: 3px solid var(--primary);
        }
        .btn-icon-close svg {
          width: 20px;
          height: 20px;
        }

        /* Barra de Utilidades */
        .utility-bar {
          flex-shrink: 0;
          padding: 10px 22px;
          background: #f8fafc;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .btn-utility {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }
        .btn-utility svg {
          width: 15px;
          height: 15px;
        }
        .btn-utility:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .btn-utility:focus-visible {
          outline: 2px solid var(--primary);
        }
        .btn-utility.reset:hover {
          color: #dc2626;
          border-color: #fca5a5;
          background: #fef2f2;
        }
        .btn-utility.tts {
          color: #0052cc;
          background: #eff6ff;
          border-color: #bfdbfe;
        }
        .btn-utility.tts:hover {
          background: #dbeafe;
        }
        .btn-utility.tts-stop {
          padding: 6px 8px;
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }

        /* Corpo / Seções */
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .menu-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .section-heading h3 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 800;
          color: var(--text-muted);
        }
        .pill-badge {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          background: #eff6ff;
          color: #0052cc;
        }

        /* Grid de Perfis em 1 Clique */
        .profiles-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .profile-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          padding: 12px 14px;
          background: var(--bg-card);
          border: 1.5px solid var(--border-subtle);
          border-radius: var(--radius-card);
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
          color: var(--text-main);
          box-shadow: var(--shadow-card);
        }
        .profile-card:hover {
          background: var(--bg-card-hover);
          border-color: #94a3b8;
          transform: translateY(-1px);
        }
        .profile-card:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .profile-card.active {
          background: var(--bg-card-active);
          border-color: var(--border-active);
          box-shadow: 0 0 0 1px var(--border-active);
        }
        .card-top-row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .card-icon-bubble {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .card-icon-bubble svg {
          width: 16px;
          height: 16px;
        }
        .card-tag {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          background: #e2e8f0;
          color: #475569;
        }
        .profile-card.active .card-tag {
          background: var(--border-active);
          color: #ffffff;
        }
        .card-heading {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .profile-card.active .card-heading {
          color: var(--border-active);
        }
        .card-subtext {
          font-size: 0.71rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        /* Sub-seletor Segmentado */
        .sub-selector-box {
          margin-top: 4px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: var(--radius-card);
        }
        .sub-selector-title {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 8px;
        }
        .segmented-control {
          display: flex;
          gap: 6px;
        }
        .seg-btn {
          flex: 1;
          padding: 7px 8px;
          font-size: 0.74rem;
          font-weight: 600;
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          color: var(--text-secondary);
          cursor: pointer;
          text-align: center;
          transition: all 0.15s ease;
        }
        .seg-btn:hover {
          background: #f1f5f9;
        }
        .seg-btn.active {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          font-weight: 700;
        }
        .sub-selector-box .seg-btn.active {
          background: #16a34a;
          border-color: #15803d;
        }

        /* Control Box (Steppers) */
        .control-box {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          padding: 14px 16px;
          box-shadow: var(--shadow-card);
        }
        .control-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .control-title {
          display: block;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .control-val {
          display: block;
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--primary);
          margin-top: 2px;
        }
        .stepper-actions {
          display: flex;
          gap: 6px;
        }
        .btn-step {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          color: var(--text-main);
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .btn-step:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .btn-step:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* Barra de pontos de progresso */
        .steps-progress {
          display: flex;
          gap: 6px;
          margin-top: 10px;
        }
        .prog-dot {
          flex: 1;
          height: 4px;
          border-radius: 9999px;
          background: #e2e8f0;
          transition: background-color 0.2s ease;
        }
        .prog-dot.active {
          background: var(--primary);
        }

        /* Grid de Ferramentas */
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .tool-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
          color: var(--text-main);
          position: relative;
          box-shadow: var(--shadow-card);
        }
        .tool-card:hover {
          background: var(--bg-card-hover);
          border-color: #94a3b8;
          transform: translateY(-1px);
        }
        .tool-card:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .tool-card.active {
          background: var(--bg-card-active);
          border-color: var(--border-active);
          box-shadow: 0 0 0 1px var(--border-active);
        }
        .tool-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          flex-shrink: 0;
        }
        .tool-card.active .tool-icon-box {
          background: #dbeafe;
          color: var(--primary);
          border-color: #bfdbfe;
        }
        .tool-icon-box svg {
          width: 17px;
          height: 17px;
        }
        .tool-info {
          flex: 1;
          min-width: 0;
        }
        .tool-title {
          display: block;
          font-size: 0.84rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tool-card.active .tool-title {
          color: var(--border-active);
        }
        .tool-desc {
          display: block;
          font-size: 0.69rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
        }

        /* Banner Card VLibras */
        .vlibras-banner-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          cursor: pointer;
          text-align: left;
          transition: all 0.18s ease;
          box-shadow: var(--shadow-card);
        }
        .vlibras-banner-card:hover {
          background: var(--bg-card-hover);
          border-color: #94a3b8;
        }
        .vlibras-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #eff6ff;
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .vlibras-icon-box svg {
          width: 20px;
          height: 20px;
        }
        .vlibras-info {
          flex: 1;
        }
        .toggle-pill {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          background: #e2e8f0;
          color: #475569;
          transition: all 0.18s ease;
        }
        .toggle-pill.active {
          background: #22c55e;
          color: #ffffff;
        }

        /* Rodapé */
        .drawer-footer {
          flex-shrink: 0;
          padding: 14px 22px;
          border-top: 1px solid var(--border-subtle);
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .drawer-footer kbd {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 2px 6px;
          font-weight: 700;
          color: var(--text-main);
          box-shadow: 0 1px 1px rgba(0,0,0,0.06);
        }
        .footer-brand-tag {
          font-weight: 800;
          color: var(--primary);
          letter-spacing: 0.02em;
        }

        /* Utilitários */
        .mt-2 { margin-top: 8px; }
        .mt-3 { margin-top: 12px; }
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
