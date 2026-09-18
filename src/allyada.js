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

  const STORAGE_KEY = 'allyada_preferences';
  const LEGACY_KEY = 'acessiweb_preferences';
  const REMEMBER_KEY = 'allyada_remember_prefs';

  const DEFAULT_CONFIG = {
    position: 'right',
    primaryColor: '#0052cc',
    accentColor: '#ffab00',
    shortcutKey: 'a',
    enableSpeech: true,
    enableVLibras: true,
    speechLang: 'pt-BR',
    autoInit: true
  };

  const DEFAULT_STATE = {
    activeTab: 'foryou', // 'foryou', 'tools', 'settings'
    activeProfile: null, // 'concentration', 'low-vision', 'reading', 'colorblind', 'motion'
    colorblindType: 'none', // 'none', 'deuteranopia', 'protanopia', 'tritanopia'
    fontSizeLevel: 0, // 0 a 4 (Normal, +15%, +30%, +45%, +60%)
    lineHeightLevel: 0, // 0 a 2 (Normal, Confortável 1.9x, Amplo 2.3x)
    letterSpacingLevel: 0, // 0 a 2 (Normal, Médio +0.08em, Amplo +0.16em)
    wordSpacingLevel: 0, // 0 a 1 (Normal, Amplo +0.12em)
    dyslexicFont: false,
    textAlignLeft: false,
    contrast: 'normal', // 'normal', 'dark', 'light', 'monochrome', 'invert'
    highlightLinks: false,
    cursorSize: 'normal', // 'normal', 'large', 'xlarge'
    stopAnimations: false,
    readingGuideMode: 'none', // 'none', 'ruler', 'mask'
    enhancedFocus: false,
    speechRate: 1.0, // 0.75, 1.0, 1.25, 1.5, 2.0
    vlibrasActive: false,
    rememberPreferences: true
  };

  // SVGs de Ícones Acessíveis
  const ICONS = {
    allyada: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4" r="2"></circle><path d="M4 8h16"></path><path d="M12 8v6"></path><path d="M8 20l4-6 4 6"></path></svg>`,
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
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.3 8.7 8.7 21.3c-1 1-2.6 1-3.6 0l-1.4-1.4c-1-1-1-2.6 0-3.6L16.3 3.7c1-1 2.6-1 3.6 0l1.4 1.4c1 1 1 2.6 0 3.6z"></path></svg>`,
    cursor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 3 7 18 3-7 7-3L3 3z"></path></svg>`,
    target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>`,
    headings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="18" y2="18"></line></svg>`,
    skip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 12 12 19 19 12"></polyline><line x1="12" y1="5" x2="12" y2="19"></line></svg>`,
    hands: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v6"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>`,
    spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    tools: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    dock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><path d="m14 9-3 3 3 3"></path></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    remove: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`
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

      this.config = { ...this.config, ...options };
      this.loadState();
      this.injectHostStyles();
      this.injectSvgFilters();
      this.injectSkipLink();
      this.createReadingGuideDOM();
      this.createWidgetDOM();
      this.initSpeechSynthesis();
      this.setupGlobalShortcuts();

      this.applyAllStateChanges();

      if (this.state.vlibrasActive) {
        this.loadVLibras();
      }

      console.log('[Allyada v3.0] Assistente de Acessibilidade & Tecnologia Assistiva carregado com sucesso.');
      return this;
    }

    loadState() {
      try {
        const rememberSetting = localStorage.getItem(REMEMBER_KEY);
        const shouldRemember = rememberSetting === null ? true : rememberSetting === 'true';
        if (!shouldRemember) {
          this.state.rememberPreferences = false;
          return;
        }

        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Migração de campos legados
          if (parsed.bigCursor && !parsed.cursorSize) parsed.cursorSize = 'large';
          if (parsed.readingRuler && !parsed.readingGuideMode) parsed.readingGuideMode = 'ruler';
          if (parsed.activeProfile === 'adhd') parsed.activeProfile = 'concentration';
          if (parsed.activeProfile === 'dyslexia') parsed.activeProfile = 'reading';
          if (parsed.activeProfile === 'epilepsy') parsed.activeProfile = 'motion';
          // Limpeza de campos legados de auditoria/remediação
          delete parsed.autoRemediate;
          delete parsed.lastAuditScore;
          delete parsed.enableComplianceTab;
          delete parsed.autoRemediation;

          this.state = { ...DEFAULT_STATE, ...parsed, rememberPreferences: true };
        }
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
        background: #0052cc;
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

    injectHostStyles() {
      if (document.getElementById('allyada-host-styles')) return;

      const style = document.createElement('style');
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
        html.ally-dyslexic-font :is(p, h1, h2, h3, h4, h5, h6, blockquote, label, input, textarea, select):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-dyslexic-font :is(main li, article li, section li, [role="main"] li, main a, article a, section a, [role="main"] a):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          font-family: 'Lexend', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        /* Alinhamento à Esquerda */
        html.ally-text-align-left :is(p, article p, blockquote, dd, .article-text):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-text-align-left :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          text-align: left !important;
        }

        /* Alto Contraste Escuro */
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
        html.ally-highlight-links a:not([data-allyada-ignore]):not(#allyada-root *):not(header *):not(nav *):not([class*="navbar"] *):not([class*="topbar"] *),
        html.ally-highlight-links [role="button"]:not([data-allyada-ignore]):not(#allyada-root *):not(header *):not(nav *) {
          outline: 3px solid #f59e0b !important;
          outline-offset: 3px !important;
          text-decoration: underline 3px #f59e0b !important;
          text-underline-offset: 4px !important;
          font-weight: 700 !important;
          border-radius: 3px !important;
        }

        /* Cursor Ampliado - Grande (36px) */
        html.ally-cursor-large,
        html.ally-cursor-large * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='%23000000' stroke='%23ffffff' stroke-width='2.2'%3E%3Cpath d='M3 3l7 18 3-7 7-3L3 3z'/%3E%3C/svg%3E") 0 0, auto !important;
        }

        /* Cursor Ampliado - Extra Grande (48px) */
        html.ally-cursor-xlarge,
        html.ally-cursor-xlarge * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='%23000000' stroke='%23ffab00' stroke-width='2.5'%3E%3Cpath d='M3 3l7 18 3-7 7-3L3 3z'/%3E%3C/svg%3E") 0 0, auto !important;
        }

        /* Foco Visual de Teclado Reforçado */
        html.ally-enhanced-focus *:focus,
        html.ally-enhanced-focus *:focus-visible {
          outline: 3px solid #ffab00 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.9) !important;
          border-radius: 4px !important;
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
      (document.head || document.documentElement).appendChild(style);
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

      window.addEventListener('mousemove', (e) => onPointerMove(e.clientY), { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) onPointerMove(e.touches[0].clientY);
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
        <!-- Botão Flutuante de Abertura (FAB) -->
        <button type="button" 
                class="allyada-fab" 
                id="allyada-trigger-btn"
                aria-label="Abrir Menu de Acessibilidade Pessoal Allyada (Atalho: Alt + A)"
                aria-haspopup="dialog"
                aria-expanded="false"
                title="Allyada - Acessibilidade para você (Alt + A)">
          <span class="fab-icon">${ICONS.allyada}</span>
          <span class="fab-badge" aria-hidden="true" id="allyada-active-count">0</span>
        </button>

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
            <button type="button" class="suite-tab-btn active" id="tab-btn-foryou" role="tab" aria-selected="true" aria-controls="tab-content-foryou" title="Acesso rápido e perfis">
              <span class="tab-icon">${ICONS.spark}</span>
              <span>Para você</span>
            </button>
            <button type="button" class="suite-tab-btn" id="tab-btn-tools" role="tab" aria-selected="false" aria-controls="tab-content-tools" title="Todas as ferramentas assistivas">
              <span class="tab-icon">${ICONS.tools}</span>
              <span>Ferramentas</span>
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
                  <button type="button" class="quick-tile" id="quick-font-size" aria-pressed="false">
                    <div class="tile-icon">${ICONS.type}</div>
                    <span class="tile-label">Texto Maior</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-contrast" aria-pressed="false">
                    <div class="tile-icon">${ICONS.moon}</div>
                    <span class="tile-label">Alto Contraste</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-links" aria-pressed="false">
                    <div class="tile-icon">${ICONS.link}</div>
                    <span class="tile-label">Destacar Links</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-tts" aria-pressed="false">
                    <div class="tile-icon">${ICONS.sound}</div>
                    <span class="tile-label" id="quick-tts-label">Ouvir Texto</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-motion" aria-pressed="false">
                    <div class="tile-icon">${ICONS.zap}</div>
                    <span class="tile-label">Menos Movimento</span>
                  </button>

                  <button type="button" class="quick-tile" id="quick-cursor" aria-pressed="false">
                    <div class="tile-icon">${ICONS.cursor}</div>
                    <span class="tile-label">Cursor Maior</span>
                  </button>
                </div>

                <button type="button" class="btn-customize-link" id="btn-goto-tools">
                  <span>Personalizar acessibilidade detalhada</span>
                  <span class="arrow-icon">${ICONS.arrowRight}</span>
                </button>
              </section>

              <!-- Perfis de Navegação Humana -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Como você prefere navegar?</h3>
                  <span class="pill-badge">Perfis</span>
                </div>
                
                <div class="profiles-grid">
                  <button type="button" class="profile-card" id="profile-concentration" aria-pressed="false">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.brain}</div>
                      <span class="card-tag">Foco</span>
                    </div>
                    <strong class="card-heading">Mais Concentração</strong>
                    <p class="card-subtext">Régua de leitura ativa, animações pausadas e espaçamento confortável.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-low-vision" aria-pressed="false">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.glasses}</div>
                      <span class="card-tag">Visão</span>
                    </div>
                    <strong class="card-heading">Facilidade para Enxergar</strong>
                    <p class="card-subtext">Texto ampliado (+30%), alto contraste escuro, links e cursor grande.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-reading" aria-pressed="false">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.book}</div>
                      <span class="card-tag">Leitura</span>
                    </div>
                    <strong class="card-heading">Leitura Confortável</strong>
                    <p class="card-subtext">Fonte legível Lexend, entrelinhas 1.9x e alinhamento à esquerda.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-colorblind" aria-pressed="false">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.eye}</div>
                      <span class="card-tag">Cores</span>
                    </div>
                    <strong class="card-heading">Diferenciar Cores</strong>
                    <p class="card-subtext">Compensação cromática para deuteranopia, protanopia e tritanopia.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-motion" aria-pressed="false">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.zap}</div>
                      <span class="card-tag">Calma</span>
                    </div>
                    <strong class="card-heading">Menos Movimento</strong>
                    <p class="card-subtext">Pausa total de animações, transições suaves e redução de estímulos.</p>
                  </button>
                </div>

                <!-- Seletor de Tipo de Daltonismo (quando o perfil de cores está ativo) -->
                <div class="sub-selector-box" id="colorblind-selector-box" style="display: none;">
                  <span class="sub-selector-title">Ajuste específico para Daltonismo:</span>
                  <div class="segmented-control">
                    <button type="button" class="seg-btn active" data-type="deuteranopia" id="cb-deuteranopia">Deuteranopia</button>
                    <button type="button" class="seg-btn" data-type="protanopia" id="cb-protanopia">Protanopia</button>
                    <button type="button" class="seg-btn" data-type="tritanopia" id="cb-tritanopia">Tritanopia</button>
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
              
              <!-- 1. TEXTO & TIPOGRAFIA -->
              <section class="menu-section" data-section="typography">
                <div class="section-heading">
                  <h3>Texto & Tipografia</h3>
                </div>

                <!-- Tamanho do Texto -->
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
                  <div class="steps-progress" id="font-progress-bar">
                    <span class="prog-dot active"></span>
                    <span class="prog-dot"></span>
                    <span class="prog-dot"></span>
                    <span class="prog-dot"></span>
                    <span class="prog-dot"></span>
                  </div>
                </div>

                <!-- Espaçamento de Linhas -->
                <div class="control-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Espaçamento de Linhas</strong>
                      <span class="control-val" id="line-height-indicator">Normal</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-lh-0">Normal</button>
                    <button type="button" class="seg-btn" id="btn-lh-1">Confortável (1.9x)</button>
                    <button type="button" class="seg-btn" id="btn-lh-2">Amplo (2.3x)</button>
                  </div>
                </div>

                <!-- Espaçamento de Letras -->
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

                <!-- Espaçamento de Palavras & Alinhamento -->
                <div class="tools-grid mt-3">
                  <button type="button" class="tool-card" id="card-word-spacing" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.type}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Separar Palavras</strong>
                      <span class="tool-desc">Mais respiro entre termos</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-text-align-left" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.alignLeft}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Alinhar à Esquerda</strong>
                      <span class="tool-desc">Evita texto justificado</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-dyslexic-font" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.book}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Fonte Amigável</strong>
                      <span class="tool-desc">Tipografia Lexend</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>

                <!-- Caixa de Prévia ao Vivo -->
                <div class="live-preview-wrapper mt-3">
                  <span class="preview-tag">Prévia de Leitura ao Vivo</span>
                  <div class="live-preview-box" id="typography-preview-box">
                    A acessibilidade web garante que todas as pessoas possam navegar, compreender e interagir com autonomia e clareza.
                  </div>
                </div>
              </section>

              <!-- 2. CORES E CONTRASTE -->
              <section class="menu-section" data-section="colors">
                <div class="section-heading">
                  <h3>Cores & Contraste</h3>
                </div>

                <div class="tools-grid">
                  <button type="button" class="tool-card" id="card-contrast-dark" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.moon}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Modo Escuro</strong>
                      <span class="tool-desc">Fundo escuro suave</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-contrast-light" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.sun}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Modo Claro</strong>
                      <span class="tool-desc">Fundo branco nítido</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-contrast-monochrome" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.contrast}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Monocromático</strong>
                      <span class="tool-desc">Tons de cinza</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-contrast-invert" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.refresh}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Inverter Cores</strong>
                      <span class="tool-desc">Inversão de alto contraste</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>

                <!-- Percepção de Cores (Filtros de Daltonismo) -->
                <div class="control-box mt-3">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Filtro para Daltonismo</strong>
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

              <!-- 3. NAVEGAÇÃO & FOCO -->
              <section class="menu-section" data-section="navigation">
                <div class="section-heading">
                  <h3>Navegação & Foco</h3>
                </div>

                <div class="tools-grid">
                  <button type="button" class="tool-card" id="card-highlight-links" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.link}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Destacar Links</strong>
                      <span class="tool-desc">Borda âmbar visível</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-enhanced-focus" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.target}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Foco Reforçado</strong>
                      <span class="tool-desc">Anel luminoso no teclado</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-reading-ruler" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.ruler}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Régua de Leitura</strong>
                      <span class="tool-desc">Faixa guia horizontal</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-reading-mask" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.eye}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Máscara de Foco</strong>
                      <span class="tool-desc">Escurece o restante</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>

                <!-- Tamanho do Cursor -->
                <div class="control-box mt-3">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Tamanho do Cursor</strong>
                      <span class="control-val" id="cursor-size-label">Normal</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-cursor-normal">Normal</button>
                    <button type="button" class="seg-btn" id="btn-cursor-large">Grande (36px)</button>
                    <button type="button" class="seg-btn" id="btn-cursor-xlarge">Extra Grande (48px)</button>
                  </div>
                </div>

                <!-- Ações de Navegação Estrutural -->
                <div class="structure-nav-group mt-3">
                  <button type="button" class="btn-action-tile" id="btn-skip-to-main">
                    <span class="tile-icon-action">${ICONS.skip}</span>
                    <div class="tile-info-action">
                      <strong>Ir para o Conteúdo Principal</strong>
                      <span>Pula menus e cabeçalhos diretamente para o texto</span>
                    </div>
                  </button>

                  <button type="button" class="btn-action-tile" id="btn-toggle-headings" aria-expanded="false">
                    <span class="tile-icon-action">${ICONS.headings}</span>
                    <div class="tile-info-action">
                      <strong>Navegar pelos Títulos da Página</strong>
                      <span id="headings-count-summary">Ver índice de cabeçalhos H1-H3</span>
                    </div>
                  </button>

                  <div class="headings-drawer" id="headings-list-container" style="display:none;">
                    <div class="headings-list-header">
                      <span>Estrutura de Títulos Encontrada:</span>
                    </div>
                    <ul class="headings-list-items" id="headings-items-ul">
                      <!-- Preenchido dinamicamente via JS -->
                    </ul>
                  </div>
                </div>
              </section>

              <!-- 4. LEITURA EM VOZ ALTA (TTS) -->
              <section class="menu-section" data-section="speech">
                <div class="section-heading">
                  <h3>Leitura em Voz Alta</h3>
                  <span class="pill-badge">Síntese de Voz</span>
                </div>

                <div class="tts-card-box">
                  <div class="tts-status-row">
                    <span class="tts-status-indicator" id="tts-status-text">Pronto para ler a página ou o trecho selecionado.</span>
                  </div>

                  <div class="tts-button-controls">
                    <button type="button" class="btn-tts-action primary" id="btn-tts-play-pause">
                      <span class="tts-btn-icon" id="tts-play-icon">${ICONS.sound}</span>
                      <span id="tts-play-label">Ouvir Página</span>
                    </button>
                    <button type="button" class="btn-tts-action stop" id="btn-tts-stop" style="display:none;" title="Parar leitura">
                      ${ICONS.stop} Parar
                    </button>
                  </div>

                  <!-- Velocidade de Fala -->
                  <div class="tts-rate-row mt-2">
                    <span class="tts-rate-title">Velocidade:</span>
                    <div class="segmented-control tts-rates">
                      <button type="button" class="seg-btn" data-rate="0.75" id="rate-075">0.75x</button>
                      <button type="button" class="seg-btn active" data-rate="1" id="rate-100">1.0x</button>
                      <button type="button" class="seg-btn" data-rate="1.25" id="rate-125">1.25x</button>
                      <button type="button" class="seg-btn" data-rate="1.5" id="rate-150">1.5x</button>
                      <button type="button" class="seg-btn" data-rate="2" id="rate-200">2.0x</button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 5. MOVIMENTO & ESTÍMULOS -->
              <section class="menu-section" data-section="motion">
                <div class="section-heading">
                  <h3>Movimento & Transições</h3>
                </div>

                <button type="button" class="tool-card full-width" id="card-stop-animations" aria-pressed="false">
                  <div class="tool-icon-box">${ICONS.pause}</div>
                  <div class="tool-info">
                    <strong class="tool-title">Pausar Animações e Movimentos</strong>
                    <span class="tool-desc">Interrompe transições visuais, gifs e animações automáticas</span>
                  </div>
                  <div class="toggle-indicator"></div>
                </button>
              </section>

              <!-- 6. LIBRAS (LÍNGUA DE SINAIS) -->
              <section class="menu-section" data-section="libras">
                <div class="section-heading">
                  <h3>Língua de Sinais (Libras)</h3>
                </div>

                <button type="button" class="vlibras-banner-card" id="card-vlibras-toggle" aria-pressed="false">
                  <div class="vlibras-icon-box">${ICONS.hands}</div>
                  <div class="vlibras-info">
                    <strong class="tool-title">Ativar Tradutor VLibras</strong>
                    <span class="tool-desc">Avatar 3D tradutor posicionado logo acima da Allyada</span>
                  </div>
                  <div class="toggle-pill" id="vlibras-pill">Desativado</div>
                </button>
              </section>

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

              <!-- Guia de Atalhos de Teclado -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Atalhos Rápidos de Teclado</h3>
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

      // Atalho "Personalizar acessibilidade" para ir da aba 1 para a aba 2
      const gotoToolsBtn = root.getElementById('btn-goto-tools');
      if (gotoToolsBtn) {
        gotoToolsBtn.addEventListener('click', () => this.switchTab('tools'));
      }

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

          const cards = root.querySelectorAll('#tab-content-tools .tool-card, #tab-content-tools .control-box, #tab-content-tools .structure-nav-group, #tab-content-tools .tts-card-box, #tab-content-tools .vlibras-banner-card');
          cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const match = !query || text.includes(query);
            card.style.display = match ? '' : 'none';
          });

          root.querySelectorAll('#tab-content-tools .menu-section').forEach(sec => {
            const visible = sec.querySelectorAll('.tool-card:not([style*="display: none"]), .control-box:not([style*="display: none"]), .structure-nav-group:not([style*="display: none"]), .tts-card-box:not([style*="display: none"]), .vlibras-banner-card:not([style*="display: none"])');
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

      bindProfile('profile-concentration', 'concentration', () => {
        this.state.readingGuideMode = 'ruler';
        this.state.stopAnimations = true;
        this.state.lineHeightLevel = 1;
      });

      bindProfile('profile-low-vision', 'low-vision', () => {
        this.state.fontSizeLevel = 2;
        this.state.contrast = 'dark';
        this.state.cursorSize = 'large';
        this.state.highlightLinks = true;
      });

      bindProfile('profile-reading', 'reading', () => {
        this.state.dyslexicFont = true;
        this.state.lineHeightLevel = 1;
        this.state.textAlignLeft = true;
      });

      bindProfile('profile-colorblind', 'colorblind', () => {
        this.state.highlightLinks = true;
        if (this.state.colorblindType === 'none') {
          this.state.colorblindType = 'deuteranopia';
        }
      });

      bindProfile('profile-motion', 'motion', () => {
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
          if (this.state.fontSizeLevel < 4) {
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
      const playPauseBtn = root.getElementById('btn-tts-play-pause');
      if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => this.handleSpeechClick());
      }

      const stopBtn = root.getElementById('btn-tts-stop');
      if (stopBtn) {
        stopBtn.addEventListener('click', () => this.stopSpeech());
      }

      [0.75, 1, 1.25, 1.5, 2].forEach(r => {
        const rateBtn = root.getElementById(`rate-${String(r).replace('.', '')}`);
        if (!rateBtn) return;
        rateBtn.addEventListener('click', () => {
          this.state.speechRate = r;
          this.saveState();
          this.updatePanelUI();
          if (this.isSpeaking) {
            // Reinicia a fala com a nova velocidade
            this.handleSpeechClick();
          }
        });
      });

      // 11. Movimento
      bindToggle('card-stop-animations', 'stopAnimations');

      // 12. VLibras
      const vlibrasBtn = root.getElementById('card-vlibras-toggle');
      if (vlibrasBtn) {
        vlibrasBtn.addEventListener('click', () => {
          this.state.vlibrasActive = !this.state.vlibrasActive;
          this.saveState();
          if (this.state.vlibrasActive) {
            this.loadVLibras();
          } else {
            const vwContainer = document.querySelector('[vw]');
            if (vwContainer) vwContainer.style.display = 'none';
          }
          this.updatePanelUI();
        });
      }

      // 13. Configurações: Lembrar Preferências
      const chkRemember = root.getElementById('chk-remember-preferences');
      if (chkRemember) {
        chkRemember.addEventListener('change', (e) => {
          this.state.rememberPreferences = e.target.checked;
          this.saveState();
        });
      }

      // 14. Redefinir Tudo
      const resetBtn = root.getElementById('btn-reset-all');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetState());
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

      const tabs = ['foryou', 'tools', 'settings'];
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
          content.style.display = isActive ? 'block' : 'none';
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

        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).filter(el => {
          return !el.closest('#allyada-root') && !el.closest('[data-allyada-ignore]') && !el.closest('[vw]');
        });

        if (headings.length === 0) {
          ul.innerHTML = `<li class="heading-empty-item">Nenhum cabeçalho estrutural (H1, H2, H3) foi encontrado nesta página.</li>`;
          return;
        }

        headings.forEach((h, idx) => {
          const text = (h.textContent || '').trim();
          if (!text) return;
          const tag = h.tagName.toLowerCase();
          const li = document.createElement('li');
          li.className = 'heading-list-item';
          li.innerHTML = `
            <button type="button" class="btn-heading-target" data-heading-idx="${idx}">
              <span class="heading-level-pill ${tag}">${tag.toUpperCase()}</span>
              <span class="heading-text-label">${this.escapeHTML(text.slice(0, 80))}</span>
            </button>
          `;
          li.querySelector('button').addEventListener('click', () => {
            this.closePanel();
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
      const factors = [1.0, 1.15, 1.30, 1.45, 1.60];
      const factor = factors[this.state.fontSizeLevel] || 1.0;

      // Não modifica document.documentElement.style.fontSize para proteger unidades rem no header/topbar
      document.documentElement.style.fontSize = '';

      if (!document.body) return;
      const selectors = 'p, h1, h2, h3, h4, h5, h6, a, span, li, button, input, textarea, select, label, blockquote, figcaption, td, th, kbd, dt, dd';
      const elements = document.body.querySelectorAll(selectors);

      elements.forEach(el => {
        // Escudo de isolamento: ignora Allyada, VLibras e cabeçalhos/navbars do host
        if (
          el.closest('#allyada-root') || 
          el.closest('[data-allyada-ignore]') || 
          el.closest('[vw]') ||
          el.closest('header, nav, [role="banner"], [role="navigation"], [class*="header"], [class*="navbar"], [class*="topbar"], [class*="menu"]')
        ) {
          if (el.dataset.allyOrigFont) {
            el.style.fontSize = '';
            delete el.dataset.allyOrigFont;
          }
          return;
        }

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

    applyAllStateChanges() {
      const html = document.documentElement;

      this.applyFontSize();

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
      html.classList.toggle('ally-enhanced-focus', this.state.enhancedFocus);

      // Cursor
      html.classList.remove('ally-cursor-large', 'ally-cursor-xlarge');
      if (this.state.cursorSize === 'large') {
        html.classList.add('ally-cursor-large');
      } else if (this.state.cursorSize === 'xlarge') {
        html.classList.add('ally-cursor-xlarge');
      }

      // Movimento
      html.classList.toggle('ally-stop-animations', this.state.stopAnimations);

      // Guia de Leitura (Régua ou Máscara)
      if (this.readingGuideElement) {
        this.readingGuideElement.style.display = (this.state.readingGuideMode === 'ruler') ? 'block' : 'none';
      }
      if (this.readingMaskElement) {
        this.readingMaskElement.style.display = (this.state.readingGuideMode === 'mask') ? 'block' : 'none';
      }
    }

    /**
     * Calcula a lista de ajustes ativos para exibição e desativação individual
     */
    getActiveAdjustments() {
      const items = [];

      if (this.state.activeProfile) {
        const profileNames = {
          concentration: 'Concentração',
          'low-vision': 'Facilidade para enxergar',
          reading: 'Leitura confortável',
          colorblind: 'Diferenciar cores',
          motion: 'Menos movimento'
        };
        items.push({
          id: 'profile',
          label: `Perfil: ${profileNames[this.state.activeProfile] || this.state.activeProfile}`,
          reset: () => { this.state.activeProfile = null; }
        });
      }

      if (this.state.fontSizeLevel > 0) {
        items.push({
          id: 'font-size',
          label: `Texto (+${this.state.fontSizeLevel * 15}%)`,
          reset: () => { this.state.fontSizeLevel = 0; }
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
            const vw = document.querySelector('[vw]');
            if (vw) vw.style.display = 'none';
          }
        });
      }

      return items;
    }

    updatePanelUI() {
      const root = this.shadowRoot;
      if (!root) return;

      // 1. Perfis
      const profiles = ['concentration', 'low-vision', 'reading', 'colorblind', 'motion'];
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
        cbBox.style.display = this.state.activeProfile === 'colorblind' ? 'block' : 'none';
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
      setQuick('quick-tts', this.isSpeaking);
      setQuick('quick-motion', this.state.stopAnimations);
      setQuick('quick-cursor', this.state.cursorSize !== 'normal');

      // 3. Tipografia
      const fontLabels = ['Normal (100%)', '+15%', '+30%', '+45%', '+60%'];
      const fontIndicator = root.getElementById('font-size-indicator');
      if (fontIndicator) {
        fontIndicator.textContent = fontLabels[this.state.fontSizeLevel] || 'Normal (100%)';
      }

      const btnDec = root.getElementById('btn-font-decrease');
      const btnInc = root.getElementById('btn-font-increase');
      if (btnDec) btnDec.disabled = this.state.fontSizeLevel === 0;
      if (btnInc) btnInc.disabled = this.state.fontSizeLevel === 4;

      const dots = root.querySelectorAll('#font-progress-bar .prog-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx <= this.state.fontSizeLevel);
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
      updateTool('card-dyslexic-font', this.state.dyslexicFont);

      // Atualiza Caixa de Prévia ao Vivo de Tipografia
      const previewBox = root.getElementById('typography-preview-box');
      if (previewBox) {
        const factors = [1.0, 1.15, 1.30, 1.45, 1.60];
        const lhValues = ['1.5', '1.9', '2.3'];
        const lsValues = ['normal', '0.08em', '0.16em'];

        previewBox.style.fontSize = `${(13 * (factors[this.state.fontSizeLevel] || 1.0)).toFixed(1)}px`;
        previewBox.style.lineHeight = lhValues[this.state.lineHeightLevel] || '1.5';
        previewBox.style.letterSpacing = lsValues[this.state.letterSpacingLevel] || 'normal';
        previewBox.style.wordSpacing = this.state.wordSpacingLevel ? '0.12em' : 'normal';
        previewBox.style.fontFamily = this.state.dyslexicFont ? "'Lexend', sans-serif" : 'inherit';
        previewBox.style.textAlign = this.state.textAlignLeft ? 'left' : 'inherit';
      }

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
      const vlibrasPill = root.getElementById('vlibras-pill');
      if (vlibrasPill) {
        vlibrasPill.textContent = this.state.vlibrasActive ? 'Ativado' : 'Desativado';
        vlibrasPill.classList.toggle('active', this.state.vlibrasActive);
      }

      // 8. Velocidade de Fala (TTS)
      [0.75, 1, 1.25, 1.5, 2].forEach(r => {
        const btn = root.getElementById(`rate-${String(r).replace('.', '')}`);
        if (btn) btn.classList.toggle('active', this.state.speechRate === r);
      });

      // 9. Configurações: Switch de Lembrar
      const chkRem = root.getElementById('chk-remember-preferences');
      if (chkRem) chkRem.checked = !!this.state.rememberPreferences;

      // 10. Ajustes Ativos: Chips e Contadores
      const activeItems = this.getActiveAdjustments();
      const activeCount = activeItems.length;

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
    }

    togglePanel() {
      if (this.isOpen) this.closePanel();
      else this.openPanel();
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
        // Bloqueia Alt + A caso o usuário esteja digitando em um campo de texto
        if (e.altKey && e.key.toLowerCase() === this.config.shortcutKey) {
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
        const ttsSec = this.shadowRoot.querySelector('[data-section="speech"]');
        if (ttsSec) ttsSec.style.display = 'none';
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
        targetNode = document.querySelector('main article') || 
                     document.querySelector('main') || 
                     document.querySelector('[role="main"]') || 
                     document.querySelector('#content') || 
                     document.querySelector('article') || 
                     document.body;
        textToRead = this.extractReadableText(targetNode);
      }

      if (!textToRead) {
        alert('Nenhum texto legível disponível na página.');
        return;
      }

      this.speakText(textToRead, targetNode);
    }

    speakText(text, targetNode) {
      this.speechSynthesizer.cancel();
      this.clearHighlight();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.config.speechLang;
      utterance.rate = this.state.speechRate || 1.0;
      utterance.pitch = 1.0;

      const voices = this.speechSynthesizer.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
      if (ptVoice) utterance.voice = ptVoice;

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
        console.warn('[Allyada] Erro na fala:', e);
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
      if (this.speechSynthesizer) this.speechSynthesizer.cancel();
      this.isSpeaking = false;
      this.isSpeechPaused = false;
      this.clearHighlight();
      this.updateSpeechButtons(false, false);
    }

    updateSpeechButtons(speaking, paused) {
      const root = this.shadowRoot;
      if (!root) return;

      const playLabel = root.getElementById('tts-play-label');
      const playIcon = root.getElementById('tts-play-icon');
      const stopBtn = root.getElementById('btn-tts-stop');
      const statusText = root.getElementById('tts-status-text');
      const quickLabel = root.getElementById('quick-tts-label');

      if (speaking) {
        if (playLabel) playLabel.textContent = paused ? 'Continuar Leitura' : 'Pausar Leitura';
        if (playIcon) playIcon.innerHTML = paused ? ICONS.play : ICONS.pause;
        if (stopBtn) stopBtn.style.display = 'inline-flex';
        if (statusText) statusText.textContent = paused ? 'Leitura pausada. Clique em continuar para prosseguir.' : 'Lendo conteúdo em voz alta...';
        if (quickLabel) quickLabel.textContent = paused ? 'Continuar' : 'Pausar';
      } else {
        if (playLabel) playLabel.textContent = 'Ouvir Página';
        if (playIcon) playIcon.innerHTML = ICONS.sound;
        if (stopBtn) stopBtn.style.display = 'none';
        if (statusText) statusText.textContent = 'Pronto para ler a página ou o trecho selecionado.';
        if (quickLabel) quickLabel.textContent = 'Ouvir Texto';
      }

      const quickTile = root.getElementById('quick-tts');
      if (quickTile) {
        quickTile.setAttribute('aria-pressed', speaking ? 'true' : 'false');
        quickTile.classList.toggle('active', speaking);
      }
    }

    extractReadableText(el) {
      if (!el) return '';
      const clone = el.cloneNode(true);
      const removeSelectors = ['script', 'style', 'noscript', '#allyada-root', '#allyada-reading-ruler', '#allyada-reading-mask', '#allyada-svg-filters', '[data-allyada-ignore]', '[vw]'];
      removeSelectors.forEach(sel => {
        clone.querySelectorAll(sel).forEach(node => node.remove());
      });
      return clone.innerText.slice(0, 3500);
    }

    loadVLibras() {
      if (window.VLibras) {
        const vwContainer = document.querySelector('[vw]');
        if (vwContainer) vwContainer.style.display = 'block';
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
          console.log('[Allyada] VLibras carregado e posicionado.');
        }
      };
      document.body.appendChild(script);
    }

    getShadowStyles() {
      return `
        :host {
          all: initial !important;
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
          --radius-card: 12px;
          --radius-btn: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          font-size: 13px !important;
          line-height: 1.4 !important;
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

        /* Backdrop sem bloqueio visual */
        .allyada-backdrop {
          display: none !important;
          pointer-events: none !important;
        }

        /* Painel Flutuante (Drawer Lateral Descolado) */
        .allyada-drawer {
          position: fixed;
          bottom: 86px;
          top: auto;
          width: 395px;
          max-width: calc(100vw - 24px);
          height: auto;
          max-height: min(620px, calc(100vh - 104px));
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.12);
          border-radius: 16px;
          box-shadow: 0 20px 48px -6px rgba(15, 23, 42, 0.22), 0 8px 20px -2px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          z-index: 2147483647;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(14px) scale(0.96);
          transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s ease;
        }
        .pos-right .allyada-drawer {
          right: 20px;
          left: auto;
        }
        .pos-left .allyada-drawer {
          left: 20px;
          right: auto;
        }
        .allyada-drawer.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0) scale(1);
        }

        @media (max-width: 480px) {
          .allyada-drawer {
            width: calc(100vw - 20px);
            right: 10px !important;
            left: 10px !important;
            bottom: 84px;
            max-height: calc(100vh - 96px);
          }
        }

        /* Header */
        .drawer-header {
          padding: 12px 14px;
          background: #ffffff;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          flex-shrink: 0;
        }
        .header-brand-group {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }
        .brand-badge-icon {
          width: 32px;
          height: 32px;
          border-radius: 9px;
          background: linear-gradient(135deg, var(--primary) 0%, #0284c7 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .brand-badge-icon svg { width: 18px; height: 18px; }
        .brand-text { display: flex; flex-direction: column; min-width: 0; }
        .title-row { display: flex; align-items: center; gap: 6px; }
        .title-row h2 {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .active-badge-pill {
          font-size: 0.62rem;
          font-weight: 800;
          color: #1d4ed8;
          background: #dbeafe;
          padding: 1px 6px;
          border-radius: 9999px;
          border: 1px solid #bfdbfe;
        }
        .brand-sub {
          font-size: 0.67rem;
          color: var(--text-muted);
          font-weight: 500;
          line-height: 1.2;
        }
        .header-actions-group {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .btn-header-action, .btn-icon-close {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .btn-header-action:hover, .btn-icon-close:hover {
          background: var(--bg-card-hover);
          color: var(--text-main);
          border-color: #cbd5e1;
        }
        .btn-header-action:focus-visible, .btn-icon-close:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .btn-header-action svg, .btn-icon-close svg {
          width: 16px;
          height: 16px;
        }

        /* Abas Superiores */
        .suite-tabs {
          display: flex;
          padding: 4px;
          background: #f1f5f9;
          border-bottom: 1px solid var(--border-subtle);
          flex-shrink: 0;
          gap: 3px;
        }
        .suite-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 7px 4px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.73rem;
          font-weight: 700;
          border-radius: 7px;
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 36px;
        }
        .suite-tab-btn:hover {
          color: var(--text-main);
          background: rgba(255, 255, 255, 0.6);
        }
        .suite-tab-btn.active {
          background: #ffffff;
          color: var(--primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .suite-tab-btn:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .suite-tab-btn .tab-icon svg { width: 14px; height: 14px; }

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
          overflow-y: auto;
          padding: 12px 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .tab-scroll-body::-webkit-scrollbar { width: 5px; }
        .tab-scroll-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

        /* Campo de Busca Rápida */
        .search-box-wrapper {
          padding: 8px 14px 2px;
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
          left: 10px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          pointer-events: none;
        }
        .search-icon-svg svg { width: 14px; height: 14px; }
        .search-input-field {
          width: 100%;
          padding: 7px 28px 7px 30px;
          border-radius: 8px;
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          font-size: 0.74rem;
          color: var(--text-main);
          outline: none;
          transition: all 0.15s ease;
        }
        .search-input-field:focus {
          border-color: var(--primary);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.15);
        }
        .search-clear-btn {
          position: absolute;
          right: 8px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #cbd5e1;
          color: #ffffff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
        }

        /* Seções do Menu */
        .menu-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .section-heading h3 {
          font-size: 0.70rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .pill-badge {
          font-size: 0.60rem;
          font-weight: 700;
          color: #0369a1;
          background: #e0f2fe;
          padding: 1px 6px;
          border-radius: 9999px;
        }

        /* Grid do Modo Simples / Acesso Rápido */
        .quick-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }
        .quick-tile {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 10px 4px;
          border-radius: var(--radius-btn);
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
          min-height: 64px;
        }
        .quick-tile:hover {
          background: var(--bg-card-hover);
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
        .quick-tile.active {
          background: var(--bg-card-active);
          border-color: var(--border-active);
          color: var(--primary);
        }
        .quick-tile:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .tile-icon svg { width: 18px; height: 18px; }
        .tile-label { font-size: 0.67rem; font-weight: 700; line-height: 1.2; }

        .btn-customize-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 8px 10px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius-btn);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--primary);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-customize-link:hover {
          background: var(--bg-card-active);
          border-color: var(--primary);
        }
        .btn-customize-link:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .arrow-icon svg { width: 12px; height: 12px; }

        /* Perfis Humanos */
        .profiles-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .profile-card {
          padding: 9px 11px;
          border-radius: var(--radius-card);
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          cursor: pointer;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: all 0.15s ease;
        }
        .profile-card:hover {
          background: var(--bg-card-hover);
          border-color: #cbd5e1;
        }
        .profile-card.active {
          background: var(--bg-card-active);
          border-color: var(--border-active);
          box-shadow: 0 0 0 1px var(--border-active);
        }
        .profile-card:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2px;
        }
        .card-icon-bubble {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-main);
        }
        .profile-card.active .card-icon-bubble {
          background: var(--primary);
          color: #ffffff;
        }
        .card-icon-bubble svg { width: 14px; height: 14px; }
        .card-tag {
          font-size: 0.60rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .card-heading {
          font-size: 0.77rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .card-subtext {
          font-size: 0.67rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }

        .sub-selector-box {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          padding: 8px 10px;
        }
        .sub-selector-title {
          font-size: 0.67rem;
          font-weight: 700;
          color: var(--text-main);
          display: block;
          margin-bottom: 5px;
        }

        /* Caixas de Controle (Steppers & Segmentados) */
        .control-box {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          padding: 8px 10px;
        }
        .control-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .control-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-main);
          display: block;
        }
        .control-val {
          font-size: 0.66rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stepper-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .btn-step {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
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
          gap: 4px;
          margin-top: 6px;
        }
        .prog-dot {
          flex: 1;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          transition: background 0.2s ease;
        }
        .prog-dot.active {
          background: var(--primary);
        }

        .segmented-control {
          display: flex;
          background: #e2e8f0;
          padding: 2px;
          border-radius: 7px;
          gap: 2px;
        }
        .seg-btn {
          flex: 1;
          padding: 5px 3px;
          font-size: 0.67rem;
          font-weight: 700;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
          min-height: 28px;
        }
        .seg-btn:hover { color: var(--text-main); }
        .seg-btn.active {
          background: #ffffff;
          color: var(--primary);
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
        }
        .seg-btn:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }

        /* Cards de Ferramentas com Toggle */
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        .tool-card {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 8px;
          border-radius: var(--radius-btn);
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          min-height: 48px;
        }
        .tool-card.full-width {
          grid-column: 1 / -1;
        }
        .tool-card:hover {
          background: var(--bg-card-hover);
          border-color: #cbd5e1;
        }
        .tool-card.active {
          background: var(--bg-card-active);
          border-color: var(--border-active);
        }
        .tool-card:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .tool-icon-box {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--text-main);
        }
        .tool-card.active .tool-icon-box {
          background: var(--primary);
          color: #ffffff;
        }
        .tool-icon-box svg { width: 14px; height: 14px; }
        .tool-info { flex: 1; min-width: 0; }
        .tool-title {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--text-main);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tool-desc {
          font-size: 0.63rem;
          color: var(--text-muted);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .toggle-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #cbd5e1;
          flex-shrink: 0;
          transition: background 0.2s ease;
        }
        .tool-card.active .toggle-indicator {
          background: #16a34a;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.25);
        }

        /* Caixa de Prévia ao Vivo */
        .live-preview-wrapper {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: var(--radius-card);
          padding: 8px 10px;
        }
        .preview-tag {
          font-size: 0.62rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--primary);
          display: block;
          margin-bottom: 4px;
        }
        .live-preview-box {
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-main);
          padding: 6px 8px;
          background: #f8fafc;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        /* Estrutura de Títulos (Navegação H1-H3) */
        .structure-nav-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .btn-action-tile {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: var(--radius-btn);
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }
        .btn-action-tile:hover {
          background: var(--bg-card-hover);
          border-color: #cbd5e1;
        }
        .btn-action-tile:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .tile-icon-action {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #e0e7ff;
          color: #3730a3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tile-icon-action svg { width: 16px; height: 16px; }
        .tile-info-action strong { font-size: 0.74rem; font-weight: 700; color: var(--text-main); display: block; }
        .tile-info-action span { font-size: 0.65rem; color: var(--text-muted); display: block; }

        .headings-drawer {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          padding: 8px 10px;
          max-height: 220px;
          overflow-y: auto;
        }
        .headings-list-header {
          font-size: 0.67rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .headings-list-items {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .btn-heading-target {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 6px;
          border: 1px solid transparent;
          border-radius: 6px;
          background: #f8fafc;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }
        .btn-heading-target:hover {
          background: #e0f2fe;
          border-color: #bae6fd;
        }
        .btn-heading-target:focus-visible {
          outline: 2px solid var(--primary);
        }
        .heading-level-pill {
          font-size: 0.58rem;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 4px;
          background: #e2e8f0;
          color: #334155;
          flex-shrink: 0;
        }
        .heading-level-pill.h1 { background: #dbeafe; color: #1e40af; }
        .heading-level-pill.h2 { background: #fef3c7; color: #92400e; }
        .heading-level-pill.h3 { background: #f1f5f9; color: #475569; }
        .heading-text-label {
          font-size: 0.68rem;
          color: var(--text-main);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .heading-empty-item {
          font-size: 0.68rem;
          color: var(--text-muted);
          padding: 6px;
          text-align: center;
        }

        /* Card TTS (Leitura em Voz Alta) */
        .tts-card-box {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .tts-status-row {
          font-size: 0.68rem;
          color: var(--text-secondary);
          line-height: 1.3;
        }
        .tts-button-controls {
          display: flex;
          gap: 6px;
        }
        .btn-tts-action {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 7px;
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.15s ease;
          min-height: 38px;
        }
        .btn-tts-action.primary {
          background: var(--primary);
          color: #ffffff;
        }
        .btn-tts-action.primary:hover { background: var(--primary-hover); }
        .btn-tts-action.stop {
          background: #fee2e2;
          color: #b91c1c;
          border: 1px solid #fca5a5;
        }
        .btn-tts-action.stop:hover { background: #fecaca; }
        .btn-tts-action:focus-visible { outline: 2px solid var(--accent); }
        .tts-btn-icon svg { width: 16px; height: 16px; }

        .tts-rate-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .tts-rate-title { font-size: 0.67rem; font-weight: 700; color: var(--text-muted); }
        .tts-rates { flex: 1; max-width: 220px; }

        /* Card VLibras */
        .vlibras-banner-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: var(--radius-card);
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 0.15s ease;
        }
        .vlibras-banner-card:hover {
          background: var(--bg-card-hover);
          border-color: #cbd5e1;
        }
        .vlibras-banner-card.active {
          background: var(--bg-card-active);
          border-color: var(--border-active);
        }
        .vlibras-banner-card:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .vlibras-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #0052cc;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .vlibras-icon-box svg { width: 18px; height: 18px; }
        .vlibras-info { flex: 1; }
        .toggle-pill {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
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
          gap: 10px;
          padding: 8px 10px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-card);
        }
        .setting-text strong {
          display: block;
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .setting-text span {
          display: block;
          font-size: 0.65rem;
          color: var(--text-muted);
        }
        .switch-toggle {
          position: relative;
          display: inline-block;
          width: 38px;
          height: 22px;
          flex-shrink: 0;
        }
        .switch-toggle input { opacity: 0; width: 0; height: 0; }
        .switch-slider {
          position: absolute;
          cursor: pointer;
          inset: 0;
          background-color: #cbd5e1;
          border-radius: 22px;
          transition: .2s;
        }
        .switch-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: .2s;
        }
        .switch-toggle input:checked + .switch-slider { background-color: #16a34a; }
        .switch-toggle input:focus-visible + .switch-slider { outline: 2px solid var(--primary); }
        .switch-toggle input:checked + .switch-slider:before { transform: translateX(16px); }

        /* Lista de Atalhos */
        .shortcuts-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .shortcut-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-btn);
          font-size: 0.70rem;
          color: var(--text-secondary);
        }
        .kbd-combo kbd {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-main);
          box-shadow: 0 1px 1px rgba(0,0,0,0.06);
        }

        /* Chips de Ajustes Ativos */
        .active-adjustments-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          min-height: 38px;
        }
        .adjustment-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          font-size: 0.68rem;
          font-weight: 700;
          color: #1e40af;
        }
        .btn-chip-remove {
          border: none;
          background: transparent;
          color: #60a5fa;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1px;
          border-radius: 3px;
        }
        .btn-chip-remove:hover { color: #1e3a8a; background: #dbeafe; }
        .btn-chip-remove svg { width: 12px; height: 12px; }
        .active-none-msg {
          font-size: 0.69rem;
          color: var(--text-muted);
          padding: 8px 10px;
          background: var(--bg-card);
          border: 1px dashed var(--border-subtle);
          border-radius: 8px;
          width: 100%;
          text-align: center;
        }

        .btn-reset-all-full {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          border-radius: var(--radius-btn);
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          color: var(--text-secondary);
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
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
        .btn-reset-all-full:focus-visible { outline: 2px solid var(--primary); }
        .btn-reset-all-full svg { width: 14px; height: 14px; }

        /* Rodapé */
        .drawer-footer {
          flex-shrink: 0;
          padding: 8px 14px;
          border-top: 1px solid var(--border-subtle);
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.69rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .drawer-footer kbd {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 0.66rem;
          font-weight: 700;
          color: var(--text-main);
          box-shadow: 0 1px 1px rgba(0,0,0,0.06);
        }
        .shortcut-tip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .footer-brand-tag { font-weight: 700; color: var(--primary); font-size: 0.67rem; }

        .mt-2 { margin-top: 6px; }
        .mt-3 { margin-top: 8px; }
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
