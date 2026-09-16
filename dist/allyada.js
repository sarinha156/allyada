/**
 * Allyada - Plataforma de Acessibilidade Digital
 * "Sua aliada em acessibilidade web"
 * 
 * Versão 2.1 (Fase 2: Perfis de Acessibilidade em 1 Clique & Filtros de Daltonismo SVG):
 * - 5 Perfis de 1 Clique: TDAH, Daltonismo, Epilepsia Segura, Baixa Visão, Dislexia
 * - Filtros SVG nativos de matriz de cor: Protanopia, Deuteranopia e Tritanopia
 * - Seletor rápido de tipo de daltonismo
 * - Escalonamento universal de fontes (+15%, +30%, +45%)
 * - Temas de alto contraste WCAG AAA não destrutivos
 * - Posicionamento harmonizado do VLibras
 * - Leitor de voz TTS com realce visual em tempo real
 * - Régua de leitura fluida a 60fps
 * - Isolamento total de CSS via Shadow DOM
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    const exportsObj = factory();
    root.Allyada = exportsObj;
    root.AcessiWeb = exportsObj; // Apelido para compatibilidade retroativa
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
    fontSizeLevel: 0, // 0: normal, 1: +15%, 2: +30%, 3: +45%
    lineHeight: false,
    letterSpacing: false,
    dyslexicFont: false,
    textAlignLeft: false,
    contrast: 'normal', // 'normal', 'dark', 'light', 'monochrome', 'invert'
    highlightLinks: false,
    bigCursor: false,
    stopAnimations: false,
    readingRuler: false,
    vlibrasActive: false
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
     * Inicializa a Allyada com opções personalizadas
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

      console.log('[Allyada v2.1] Inicializada com sucesso. Pressione Alt + A para abrir.');
      return this;
    }

    /**
     * Carrega estado salvo no localStorage
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
     * Salva estado atual no localStorage
     */
    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('[Allyada] Erro ao salvar preferências:', e);
      }
    }

    /**
     * Reseta todas as configurações para o padrão original
     */
    resetState() {
      this.stopSpeech();
      this.state = { ...DEFAULT_STATE };
      this.saveState();
      this.applyAllStateChanges();
      this.updatePanelUI();
    }

    /**
     * Injeta filtros SVG nativos para simulação e compensação de Daltonismo
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
          <!-- Deuteranopia (Deficiência de Verde) -->
          <filter id="allyada-filter-deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0"/>
          </filter>
          <!-- Protanopia (Deficiência de Vermelho) -->
          <filter id="allyada-filter-protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0"/>
          </filter>
          <!-- Tritanopia (Deficiência de Azul) -->
          <filter id="allyada-filter-tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0"/>
          </filter>
        </defs>
      `;
      document.documentElement.appendChild(svg);
      this.svgFiltersContainer = svg;
    }

    /**
     * Injeta estilos no documento do site hospedeiro de forma segura e não intrusiva
     */
    injectHostStyles() {
      if (document.getElementById('allyada-host-styles')) return;

      const style = document.createElement('style');
      style.id = 'allyada-host-styles';
      style.textContent = `
        /* Fontes de Alta Legibilidade */
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');

        /* Espaçamento de Entrelinhas Amplo (apenas em blocos de texto/leitura) */
        html.ally-line-height p,
        html.ally-line-height article p,
        html.ally-line-height li,
        html.ally-line-height blockquote,
        html.ally-line-height dd,
        html.ally-line-height .article-text {
          line-height: 2 !important;
        }

        /* Espaçamento de Letras e Palavras */
        html.ally-letter-spacing p,
        html.ally-letter-spacing article,
        html.ally-letter-spacing li,
        html.ally-letter-spacing blockquote,
        html.ally-letter-spacing h1,
        html.ally-letter-spacing h2,
        html.ally-letter-spacing h3,
        html.ally-letter-spacing h4 {
          letter-spacing: 0.08em !important;
          word-spacing: 0.12em !important;
        }

        /* Fonte para Dislexia (preserva ícones e SVGs) */
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

        /* Alinhamento à Esquerda (apenas para textos e artigos) */
        html.ally-text-align-left p,
        html.ally-text-align-left article p,
        html.ally-text-align-left li,
        html.ally-text-align-left blockquote,
        html.ally-text-align-left .article-text {
          text-align: left !important;
        }

        /* Alto Contraste Escuro - WCAG AAA */
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
          background-color: #1c1d22 !important;
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

        /* Monocromático (Escala de Cinza) */
        html.ally-contrast-monochrome body {
          filter: grayscale(100%) !important;
        }

        /* Inversão Inteligente de Cores */
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

        /* Filtros de Daltonismo SVG (aplicados apenas ao body) */
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

        /* Realce Visual do Texto durante a Leitura por Voz */
        .allyada-reading-highlight {
          background-color: #fef08a !important;
          color: #000000 !important;
          outline: 3px solid #f59e0b !important;
          border-radius: 4px !important;
          transition: background-color 0.2s ease !important;
        }

        /* Posicionamento Inteligente do Botão VLibras */
        div[vw] [vw-access-button] {
          bottom: 92px !important;
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
     * Cria a Régua de Leitura anexada ao documentElement
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
     * Cria a interface com Shadow DOM
     */
    createWidgetDOM() {
      this.hostContainer = document.createElement('div');
      this.hostContainer.id = 'allyada-root';
      this.hostContainer.setAttribute('data-allyada-container', 'true');
      this.hostContainer.setAttribute('data-allyada-ignore', 'true');
      
      this.shadowRoot = this.hostContainer.attachShadow({ mode: 'open' });

      // CSS encapsulado do Painel
      const style = document.createElement('style');
      style.textContent = this.getShadowStyles();
      this.shadowRoot.appendChild(style);

      // Wrapper HTML
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
          <svg class="icon-a11y" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="4" r="2"></circle>
            <path d="M4 8h16"></path>
            <path d="M12 8v6"></path>
            <path d="M8 20l4-6 4 6"></path>
          </svg>
          <span class="fab-badge" aria-hidden="true" id="allyada-active-count">0</span>
        </button>

        <!-- Painel Lateral / Drawer Modal -->
        <div class="allyada-drawer" 
             id="allyada-panel" 
             role="dialog" 
             aria-modal="true" 
             aria-labelledby="allyada-title"
             aria-hidden="true">
          
          <!-- Cabeçalho -->
          <div class="drawer-header">
            <div class="header-title-group">
              <div class="header-brand-badge" aria-hidden="true">A</div>
              <div>
                <h2 id="allyada-title">Allyada</h2>
                <p class="header-subtitle">Sua aliada em acessibilidade web</p>
              </div>
            </div>
            <button type="button" class="btn-close" id="allyada-close-btn" aria-label="Fechar painel de acessibilidade (Esc)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Barra de Ações Rápidas de Topo -->
          <div class="quick-bar">
            <button type="button" class="btn-quick reset" id="btn-reset-all" aria-label="Restaurar configurações originais do site">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              <span>Redefinir</span>
            </button>
            
            <div class="voice-controls" id="voice-controls-box">
              <button type="button" class="btn-quick voice" id="btn-read-page" aria-label="Ler página ou texto selecionado em voz alta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <span id="voice-btn-text">Ouvir Página</span>
              </button>
              <button type="button" class="btn-quick stop-voice" id="btn-stop-voice" style="display:none;" aria-label="Parar leitura em voz alta">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="6" width="12" height="12"></rect>
                </svg>
              </button>
            </div>
          </div>

          <!-- Conteúdo do Painel -->
          <div class="drawer-body">
            
            <!-- NOVA SEÇÃO: Perfis de Acessibilidade em 1 Clique -->
            <div class="feature-section">
              <div class="section-title-wrapper">
                <h3 class="section-title">Perfis em 1 Clique</h3>
                <span class="section-pill">Automático</span>
              </div>
              <div class="profiles-grid">
                
                <button type="button" class="profile-card" id="profile-adhd" aria-pressed="false">
                  <div class="profile-header">
                    <span class="profile-icon">🧠</span>
                    <span class="profile-tag">Foco</span>
                  </div>
                  <strong class="profile-title">Perfil TDAH</strong>
                  <span class="profile-desc">Régua de leitura, sem animações e links em destaque.</span>
                </button>

                <button type="button" class="profile-card" id="profile-colorblind" aria-pressed="false">
                  <div class="profile-header">
                    <span class="profile-icon">👁️</span>
                    <span class="profile-tag">Cores</span>
                  </div>
                  <strong class="profile-title">Daltonismo</strong>
                  <span class="profile-desc">Filtro de matiz de cor para compensação visual.</span>
                </button>

                <button type="button" class="profile-card" id="profile-epilepsy" aria-pressed="false">
                  <div class="profile-header">
                    <span class="profile-icon">⚡</span>
                    <span class="profile-tag">Segurança</span>
                  </div>
                  <strong class="profile-title">Crises / Epilepsia</strong>
                  <span class="profile-desc">Desativa flashes, transições e reduz brilho visual.</span>
                </button>

                <button type="button" class="profile-card" id="profile-low-vision" aria-pressed="false">
                  <div class="profile-header">
                    <span class="profile-icon">👓</span>
                    <span class="profile-tag">Visão</span>
                  </div>
                  <strong class="profile-title">Baixa Visão / Idoso</strong>
                  <span class="profile-desc">Texto ampliado (+30%), alto contraste e cursor grande.</span>
                </button>

                <button type="button" class="profile-card" id="profile-dyslexia" aria-pressed="false">
                  <div class="profile-header">
                    <span class="profile-icon">📖</span>
                    <span class="profile-tag">Leitura</span>
                  </div>
                  <strong class="profile-title">Perfil Dislexia</strong>
                  <span class="profile-desc">Fonte Lexend com espaçamento amplo e sem justificação.</span>
                </button>

              </div>

              <!-- Sub-seletor do Daltonismo (visível quando o perfil de Daltonismo está ativo) -->
              <div class="colorblind-selector-box" id="colorblind-selector-box" style="display: none;">
                <span class="sub-label">Tipo de Daltonismo:</span>
                <div class="colorblind-pills">
                  <button type="button" class="cb-pill active" data-type="deuteranopia" id="cb-deuteranopia">Deuteranopia (Verde)</button>
                  <button type="button" class="cb-pill" data-type="protanopia" id="cb-protanopia">Protanopia (Vermelho)</button>
                  <button type="button" class="cb-pill" data-type="tritanopia" id="cb-tritanopia">Tritanopia (Azul)</button>
                </div>
              </div>
            </div>

            <!-- Seção 1: Texto e Tipografia -->
            <div class="feature-section">
              <h3 class="section-title">Texto e Tipografia</h3>
              
              <div class="stepper-card">
                <div class="stepper-info">
                  <span class="stepper-label">Tamanho do Texto</span>
                  <span class="stepper-value" id="font-size-indicator">Padrão (100%)</span>
                </div>
                <div class="stepper-controls">
                  <button type="button" class="stepper-btn" id="btn-font-decrease" aria-label="Diminuir tamanho do texto">A-</button>
                  <button type="button" class="stepper-btn" id="btn-font-increase" aria-label="Aumentar tamanho do texto">A+</button>
                </div>
              </div>

              <div class="features-grid">
                <button type="button" class="feature-card" id="card-dyslexic-font" aria-pressed="false">
                  <div class="card-icon">🔤</div>
                  <div class="card-text">
                    <span class="card-title">Fonte Dislexia</span>
                    <span class="card-desc">Alta legibilidade</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-line-height" aria-pressed="false">
                  <div class="card-icon">↕️</div>
                  <div class="card-text">
                    <span class="card-title">Espaçamento Linhas</span>
                    <span class="card-desc">Entrelinhas amplo</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-letter-spacing" aria-pressed="false">
                  <div class="card-icon">↔️</div>
                  <div class="card-text">
                    <span class="card-title">Espaçamento Letras</span>
                    <span class="card-desc">Mais respiração</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-text-align-left" aria-pressed="false">
                  <div class="card-icon">📄</div>
                  <div class="card-text">
                    <span class="card-title">Alinhar à Esquerda</span>
                    <span class="card-desc">Evita blocos justificados</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Seção 2: Contraste e Cores -->
            <div class="feature-section">
              <h3 class="section-title">Contraste e Cores</h3>
              <div class="features-grid">
                <button type="button" class="feature-card" id="card-contrast-dark" aria-pressed="false">
                  <div class="card-icon">🌙</div>
                  <div class="card-text">
                    <span class="card-title">Alto Contraste</span>
                    <span class="card-desc">Fundo Escuro</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-contrast-light" aria-pressed="false">
                  <div class="card-icon">☀️</div>
                  <div class="card-text">
                    <span class="card-title">Contraste Claro</span>
                    <span class="card-desc">Fundo Branco puro</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-contrast-monochrome" aria-pressed="false">
                  <div class="card-icon">⚫</div>
                  <div class="card-text">
                    <span class="card-title">Monocromático</span>
                    <span class="card-desc">Escala de cinza</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-contrast-invert" aria-pressed="false">
                  <div class="card-icon">🔄</div>
                  <div class="card-text">
                    <span class="card-title">Inverter Cores</span>
                    <span class="card-desc">Inversão dinâmica</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Seção 3: Navegação e Auxílio Cognitivo -->
            <div class="feature-section">
              <h3 class="section-title">Navegação e Foco</h3>
              <div class="features-grid">
                <button type="button" class="feature-card" id="card-highlight-links" aria-pressed="false">
                  <div class="card-icon">🔗</div>
                  <div class="card-text">
                    <span class="card-title">Destacar Links</span>
                    <span class="card-desc">Sublinhado evidente</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-reading-ruler" aria-pressed="false">
                  <div class="card-icon">📏</div>
                  <div class="card-text">
                    <span class="card-title">Guia de Leitura</span>
                    <span class="card-desc">Foco para TDAH</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-big-cursor" aria-pressed="false">
                  <div class="card-icon">👆</div>
                  <div class="card-text">
                    <span class="card-title">Cursor Ampliado</span>
                    <span class="card-desc">Ponteiro grande</span>
                  </div>
                </button>

                <button type="button" class="feature-card" id="card-stop-animations" aria-pressed="false">
                  <div class="card-icon">⏸️</div>
                  <div class="card-text">
                    <span class="card-title">Parar Animações</span>
                    <span class="card-desc">Pausa movimentos</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Seção 4: Libras com Posicionamento Inteligente -->
            <div class="feature-section">
              <h3 class="section-title">Língua Brasileira de Sinais</h3>
              <button type="button" class="feature-card vlibras-btn-card" id="card-vlibras-toggle" aria-pressed="false">
                <div class="card-icon">🤟</div>
                <div class="card-text">
                  <span class="card-title">Ativar VLibras</span>
                  <span class="card-desc">Avatar 3D tradutor posicionado automaticamente</span>
                </div>
                <div class="toggle-pill" id="vlibras-pill">Desativado</div>
              </button>
            </div>

          </div>

          <!-- Rodapé com atalho e créditos -->
          <div class="drawer-footer">
            <span class="footer-info">Atalho: <kbd>Alt</kbd> + <kbd>A</kbd></span>
            <span class="footer-brand">Allyada</span>
          </div>

        </div>

        <!-- Fundo transparente para fechar ao clicar fora (Backdrop) -->
        <div class="allyada-backdrop" id="allyada-backdrop" aria-hidden="true"></div>
      `;

      this.shadowRoot.appendChild(wrapper);
      document.documentElement.appendChild(this.hostContainer);

      this.bindPanelEvents();
    }

    /**
     * Associa eventos aos elementos da interface dentro do Shadow DOM
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

      // Eventos dos Perfis em 1 Clique
      const bindProfile = (btnId, profileKey, applyFn) => {
        const btn = root.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', () => {
          if (this.state.activeProfile === profileKey) {
            // Desativa perfil e restaura para estado padrão
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

      // 1. Perfil TDAH
      bindProfile('profile-adhd', 'adhd', () => {
        this.state.readingRuler = true;
        this.state.stopAnimations = true;
        this.state.highlightLinks = true;
        this.state.lineHeight = true;
      });

      // 2. Perfil Daltonismo
      bindProfile('profile-colorblind', 'colorblind', () => {
        this.state.highlightLinks = true;
      });

      // 3. Perfil Epilepsia
      bindProfile('profile-epilepsy', 'epilepsy', () => {
        this.state.stopAnimations = true;
        this.state.contrast = 'dark';
      });

      // 4. Perfil Baixa Visão
      bindProfile('profile-low-vision', 'low-vision', () => {
        this.state.fontSizeLevel = 2; // +30%
        this.state.contrast = 'dark';
        this.state.bigCursor = true;
        this.state.highlightLinks = true;
      });

      // 5. Perfil Dislexia
      bindProfile('profile-dyslexia', 'dyslexia', () => {
        this.state.dyslexicFont = true;
        this.state.lineHeight = true;
        this.state.letterSpacing = true;
        this.state.textAlignLeft = true;
      });

      // Seletores de tipo de Daltonismo
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

      // Controle de Tamanho de Fonte
      const btnFontIncrease = root.getElementById('btn-font-increase');
      btnFontIncrease.addEventListener('click', () => {
        if (this.state.fontSizeLevel < 3) {
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

      // Toggles de botões simples
      const bindToggle = (id, stateKey) => {
        const el = root.getElementById(id);
        if (!el) return;
        el.addEventListener('click', () => {
          this.state[stateKey] = !this.state[stateKey];
          this.state.activeProfile = null; // desmarca perfil ativo caso ajuste individual
          this.saveState();
          this.applyAllStateChanges();
          this.updatePanelUI();
        });
      };

      bindToggle('card-dyslexic-font', 'dyslexicFont');
      bindToggle('card-line-height', 'lineHeight');
      bindToggle('card-letter-spacing', 'letterSpacing');
      bindToggle('card-text-align-left', 'textAlignLeft');
      bindToggle('card-highlight-links', 'highlightLinks');
      bindToggle('card-big-cursor', 'bigCursor');
      bindToggle('card-stop-animations', 'stopAnimations');
      bindToggle('card-reading-ruler', 'readingRuler');

      // Toggles de Contraste (Exclusivos)
      const contrastOptions = ['dark', 'light', 'monochrome', 'invert'];
      contrastOptions.forEach(opt => {
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

      // Toggle do VLibras com posicionamento sincronizado
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

      // Síntese de Voz (Leitor)
      const readBtn = root.getElementById('btn-read-page');
      readBtn.addEventListener('click', () => this.handleSpeechClick());

      const stopVoiceBtn = root.getElementById('btn-stop-voice');
      stopVoiceBtn.addEventListener('click', () => this.stopSpeech());
    }

    /**
     * Aplica redimensionamento proporcional a TODOS os elementos de texto da página
     */
    applyFontSize() {
      const factors = [1.0, 1.15, 1.30, 1.45];
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
     * Aplica todas as classes e comportamentos no DOM do site hospedeiro
     */
    applyAllStateChanges() {
      const html = document.documentElement;

      // Fonte universal
      this.applyFontSize();

      // Tipografia e Espaçamentos
      html.classList.toggle('ally-line-height', this.state.lineHeight);
      html.classList.toggle('ally-letter-spacing', this.state.letterSpacing);
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

      // Filtros de Daltonismo SVG
      html.classList.remove(
        'ally-filter-deuteranopia',
        'ally-filter-protanopia',
        'ally-filter-tritanopia'
      );
      if (this.state.activeProfile === 'colorblind') {
        html.classList.add(`ally-filter-${this.state.colorblindType}`);
      }

      // Navegação e Auxílio
      html.classList.toggle('ally-highlight-links', this.state.highlightLinks);
      html.classList.toggle('ally-big-cursor', this.state.bigCursor);
      html.classList.toggle('ally-stop-animations', this.state.stopAnimations);

      // Régua de Leitura
      if (this.rulerElement) {
        this.rulerElement.style.display = this.state.readingRuler ? 'block' : 'none';
      }
    }

    /**
     * Atualiza os estados visuais dos botões no painel Shadow DOM
     */
    updatePanelUI() {
      const root = this.shadowRoot;
      if (!root) return;

      // Atualiza cards de Perfis em 1 Clique
      const profiles = ['adhd', 'colorblind', 'epilepsy', 'low-vision', 'dyslexia'];
      profiles.forEach(p => {
        const el = root.getElementById(`profile-${p}`);
        if (el) {
          const isActive = this.state.activeProfile === p;
          el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          el.classList.toggle('active', isActive);
        }
      });

      // Exibição do seletor de tipo de Daltonismo
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

      // Atualiza indicador de fonte e travas dos botões
      const fontLabels = ['Padrão (100%)', '+15%', '+30%', '+45%'];
      const fontIndicator = root.getElementById('font-size-indicator');
      if (fontIndicator) {
        fontIndicator.textContent = fontLabels[this.state.fontSizeLevel] || 'Padrão (100%)';
      }

      const btnDec = root.getElementById('btn-font-decrease');
      const btnInc = root.getElementById('btn-font-increase');
      if (btnDec) btnDec.disabled = this.state.fontSizeLevel === 0;
      if (btnInc) btnInc.disabled = this.state.fontSizeLevel === 3;

      // Atualiza botões simples
      const updateBtn = (id, active) => {
        const el = root.getElementById(id);
        if (el) {
          el.setAttribute('aria-pressed', active ? 'true' : 'false');
          el.classList.toggle('active', !!active);
        }
      };

      updateBtn('card-dyslexic-font', this.state.dyslexicFont);
      updateBtn('card-line-height', this.state.lineHeight);
      updateBtn('card-letter-spacing', this.state.letterSpacing);
      updateBtn('card-text-align-left', this.state.textAlignLeft);
      updateBtn('card-highlight-links', this.state.highlightLinks);
      updateBtn('card-big-cursor', this.state.bigCursor);
      updateBtn('card-stop-animations', this.state.stopAnimations);
      updateBtn('card-reading-ruler', this.state.readingRuler);

      // Contrastes
      ['dark', 'light', 'monochrome', 'invert'].forEach(opt => {
        updateBtn(`card-contrast-${opt}`, this.state.contrast === opt);
      });

      // VLibras
      updateBtn('card-vlibras-toggle', this.state.vlibrasActive);
      const vlibrasPill = root.getElementById('vlibras-pill');
      if (vlibrasPill) {
        vlibrasPill.textContent = this.state.vlibrasActive ? 'Ativado' : 'Desativado';
        vlibrasPill.classList.toggle('active', this.state.vlibrasActive);
      }

      // Badge com contador de recursos ativos no FAB
      let activeCount = 0;
      if (this.state.activeProfile) activeCount++;
      if (this.state.fontSizeLevel > 0) activeCount++;
      if (this.state.lineHeight) activeCount++;
      if (this.state.letterSpacing) activeCount++;
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

    /**
     * Alterna a abertura do painel
     */
    togglePanel() {
      if (this.isOpen) {
        this.closePanel();
      } else {
        this.openPanel();
      }
    }

    /**
     * Abre o painel lateral com controle de foco
     */
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

    /**
     * Fecha o painel lateral e restaura foco
     */
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

    /**
     * Configura atalhos globais de teclado (Alt + A para abrir/fechar, Esc para fechar)
     */
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

    /**
     * Inicializa a API nativa de Text-to-Speech (Leitor de Voz)
     */
    initSpeechSynthesis() {
      if (!('speechSynthesis' in window)) {
        console.warn('[Allyada] O navegador atual não suporta Web Speech Synthesis.');
        const voiceBox = this.shadowRoot.getElementById('voice-controls-box');
        if (voiceBox) voiceBox.style.display = 'none';
        return;
      }
      this.speechSynthesizer = window.speechSynthesis;
    }

    /**
     * Ação do botão de leitura em voz alta com realce do texto em leitura
     */
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

    /**
     * Executa a síntese de fala com realce visual
     */
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

    /**
     * Remove realce visual da leitura
     */
    clearHighlight() {
      if (this.currentSpeakingNode) {
        this.currentSpeakingNode.classList.remove('allyada-reading-highlight');
        this.currentSpeakingNode = null;
      }
    }

    /**
     * Interrompe a leitura de voz
     */
    stopSpeech() {
      if (this.speechSynthesizer) {
        this.speechSynthesizer.cancel();
      }
      this.isSpeaking = false;
      this.isSpeechPaused = false;
      this.clearHighlight();
      this.updateSpeechButtons(false, false);
    }

    /**
     * Atualiza o visual dos botões de voz
     */
    updateSpeechButtons(speaking, paused) {
      const root = this.shadowRoot;
      const textSpan = root.getElementById('voice-btn-text');
      const stopBtn = root.getElementById('btn-stop-voice');

      if (!textSpan || !stopBtn) return;

      if (speaking) {
        textSpan.textContent = paused ? 'Continuar' : 'Pausar';
        stopBtn.style.display = 'inline-flex';
      } else {
        textSpan.textContent = 'Ouvir Página';
        stopBtn.style.display = 'none';
      }
    }

    /**
     * Extrai texto limpo e legível de um elemento HTML
     */
    extractReadableText(el) {
      if (!el) return '';
      const clone = el.cloneNode(true);
      const removeSelectors = ['script', 'style', 'noscript', '#allyada-root', '#allyada-reading-ruler', '#allyada-svg-filters', '[data-allyada-ignore]', '[vw]'];
      removeSelectors.forEach(sel => {
        clone.querySelectorAll(sel).forEach(node => node.remove());
      });
      return clone.innerText.slice(0, 3000);
    }

    /**
     * Carrega dinamicamente a integração com o VLibras oficial com posicionamento harmonizado
     */
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
          console.log('[Allyada] Integração oficial com VLibras carregada e posicionada.');
        }
      };
      document.body.appendChild(script);
    }

    /**
     * Retorna a folha de estilos encapsulada do Shadow DOM
     */
    getShadowStyles() {
      return `
        :host {
          --primary: ${this.config.primaryColor};
          --primary-hover: #003e99;
          --accent: ${this.config.accentColor};
          --bg-panel: #ffffff;
          --text-main: #1f2937;
          --text-muted: #6b7280;
          --border: #e5e7eb;
          --card-bg: #f9fafb;
          --card-hover: #f3f4f6;
          --card-active-bg: #e0edff;
          --card-active-border: #0052cc;
          --card-active-text: #003e99;
          --shadow-lg: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          font-size: 15px;
          line-height: 1.5;
          color: var(--text-main);
          box-sizing: border-box;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Botão Flutuante (FAB) */
        .allyada-wrapper {
          position: fixed;
          bottom: 24px;
          z-index: 2147483645;
        }
        .pos-right {
          right: 24px;
        }
        .pos-left {
          left: 24px;
        }

        .allyada-fab {
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: var(--primary);
          color: #ffffff;
          border: 3px solid #ffffff;
          box-shadow: 0 4px 16px rgba(0, 82, 204, 0.45);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, box-shadow 0.2s ease;
          position: relative;
        }
        .allyada-fab:hover {
          background: var(--primary-hover);
          transform: scale(1.08);
          box-shadow: 0 6px 22px rgba(0, 82, 204, 0.55);
        }
        .allyada-fab:focus-visible {
          outline: 4px solid var(--accent);
          outline-offset: 3px;
        }
        .icon-a11y {
          width: 32px;
          height: 32px;
        }
        .fab-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 22px;
          height: 22px;
          background: #ef4444;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          border-radius: 50%;
          display: none;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }

        /* Backdrop */
        .allyada-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.45);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, visibility 0.25s ease;
          z-index: 2147483646;
        }
        .allyada-backdrop.open {
          opacity: 1;
          visibility: visible;
        }

        /* Painel Lateral (Drawer) */
        .allyada-drawer {
          position: fixed;
          top: 0;
          width: 420px;
          max-width: 92vw;
          height: 100vh;
          background: var(--bg-panel);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          z-index: 2147483647;
          transform: translateX(110%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
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

        /* Cabeçalho */
        .drawer-header {
          flex-shrink: 0;
          padding: 18px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
        }
        .header-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-brand-badge {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--primary), #0284c7);
          color: #ffffff;
          font-weight: 800;
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 82, 204, 0.25);
        }
        .drawer-header h2 {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.01em;
          margin-bottom: 2px;
        }
        .header-subtitle {
          font-size: 0.78rem;
          color: var(--text-muted);
        }
        .btn-close {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .btn-close:hover {
          background: #f3f4f6;
          color: var(--text-main);
        }
        .btn-close:focus-visible {
          outline: 3px solid var(--primary);
        }
        .btn-close svg {
          width: 22px;
          height: 22px;
        }

        /* Barra Rápida */
        .quick-bar {
          flex-shrink: 0;
          padding: 12px 20px;
          background: #f8fafc;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .voice-controls {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-quick {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border);
          background: #ffffff;
          color: var(--text-main);
          transition: all 0.15s ease;
        }
        .btn-quick svg {
          width: 16px;
          height: 16px;
        }
        .btn-quick:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .btn-quick:focus-visible {
          outline: 2px solid var(--primary);
        }
        .btn-quick.reset:hover {
          color: #dc2626;
          border-color: #fca5a5;
          background: #fef2f2;
        }
        .btn-quick.voice {
          color: #0052cc;
          background: #eff6ff;
          border-color: #bfdbfe;
        }
        .btn-quick.voice:hover {
          background: #dbeafe;
        }
        .btn-quick.stop-voice {
          padding: 7px 9px;
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }

        /* Corpo / Seções */
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .section-title-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .section-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: var(--text-muted);
        }
        .section-pill {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
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
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          color: var(--text-main);
        }
        .profile-card:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          transform: translateY(-1px);
        }
        .profile-card:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .profile-card.active {
          background: #eff6ff;
          border-color: #0052cc;
          box-shadow: 0 0 0 1px #0052cc;
        }
        .profile-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .profile-icon {
          font-size: 1.3rem;
        }
        .profile-tag {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 4px;
          background: #e2e8f0;
          color: #475569;
        }
        .profile-card.active .profile-tag {
          background: #0052cc;
          color: #ffffff;
        }
        .profile-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .profile-card.active .profile-title {
          color: #0052cc;
        }
        .profile-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          line-height: 1.3;
        }

        /* Box seletor de tipo de Daltonismo */
        .colorblind-selector-box {
          margin-top: 10px;
          padding: 12px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
        }
        .sub-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #166534;
          margin-bottom: 8px;
        }
        .colorblind-pills {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cb-pill {
          padding: 6px 10px;
          font-size: 0.76rem;
          font-weight: 600;
          border-radius: 6px;
          border: 1px solid #86efac;
          background: #ffffff;
          color: #15803d;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }
        .cb-pill:hover {
          background: #dcfce7;
        }
        .cb-pill.active {
          background: #16a34a;
          color: #ffffff;
          border-color: #15803d;
          font-weight: 700;
        }

        /* Stepper de Tamanho de Fonte */
        .stepper-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .stepper-info {
          display: flex;
          flex-direction: column;
        }
        .stepper-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .stepper-value {
          font-size: 0.78rem;
          color: var(--primary);
          font-weight: 700;
        }
        .stepper-controls {
          display: flex;
          gap: 8px;
        }
        .stepper-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: #ffffff;
          color: var(--text-main);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .stepper-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .stepper-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .stepper-btn:focus-visible {
          outline: 2px solid var(--primary);
        }

        /* Grid de Cards */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .feature-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          padding: 12px 14px;
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          color: var(--text-main);
          position: relative;
        }
        .feature-card:hover {
          background: var(--card-hover);
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
        .feature-card:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .feature-card.active {
          background: var(--card-active-bg);
          border-color: var(--card-active-border);
          box-shadow: 0 0 0 1px var(--card-active-border);
        }
        .card-icon {
          font-size: 1.4rem;
          line-height: 1;
        }
        .card-title {
          font-size: 0.85rem;
          font-weight: 700;
          display: block;
        }
        .card-desc {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: block;
          margin-top: 2px;
        }
        .feature-card.active .card-title {
          color: var(--card-active-text);
        }

        /* Card Grande VLibras */
        .vlibras-btn-card {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
        }
        .vlibras-btn-card .card-text {
          flex: 1;
          margin: 0 12px;
        }
        .toggle-pill {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          background: #e2e8f0;
          color: #475569;
        }
        .toggle-pill.active {
          background: #22c55e;
          color: #ffffff;
        }

        /* Rodapé */
        .drawer-footer {
          flex-shrink: 0;
          padding: 14px 20px;
          border-top: 1px solid var(--border);
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
          font-weight: 600;
          color: var(--text-main);
          box-shadow: 0 1px 1px rgba(0,0,0,0.08);
        }
        .footer-brand {
          font-weight: 800;
          color: var(--primary);
          letter-spacing: 0.05em;
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
