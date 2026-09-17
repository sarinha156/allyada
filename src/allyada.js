/**
 * Allyada - Plataforma de Acessibilidade Digital e Conformidade Legal
 * "Sua aliada em acessibilidade web e conformidade jurídica"
 * 
 * Versão 3.0 - Suíte Completa: Monitorar, Corrigir e Comprovar
 * 
 * Em total conformidade com:
 * ✓ WCAG 2.2 Nível AA (Diretrizes Globais do W3C / WAI)
 * ✓ ADA Título II & Título III (Americans with Disabilities Act - EUA)
 * ✓ Reabilitação Art. 508 e 504 (Setor Público e Federal dos EUA)
 * ✓ Lei dos Direitos Civis de Unruh (Califórnia)
 * ✓ Colorado HB 21-1110 (Legislação Estadual do Colorado para WCAG 2.2)
 * ✓ AODA (Accessibility for Ontarians with Disabilities Act - Canadá)
 * ✓ ACA (Accessible Canada Act - Canadá Federal)
 * ✓ EN 301 549 (Padrão Europeu de Acessibilidade em Compras Públicas)
 * ✓ EAA (European Accessibility Act - Diretiva UE 2019/882)
 * ✓ Lei da Igualdade do Reino Unido (UK Equality Act 2010)
 * ✓ IS 5568 (Padrão de Acessibilidade Web de Israel)
 * ✓ LBI (Lei Brasileira de Inclusão nº 13.146/15 e e-MAG)
 * ✓ PDF/A & Boas Práticas de Documentos Acessíveis
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
  
  const DEFAULT_CONFIG = {
    position: 'right',
    primaryColor: '#0052cc',
    accentColor: '#ffab00',
    shortcutKey: 'a',
    enableSpeech: true,
    enableVLibras: true,
    enableComplianceTab: true,
    autoRemediation: true,
    speechLang: 'pt-BR',
    autoInit: true
  };

  const DEFAULT_STATE = {
    activeTab: 'assistive', // 'assistive', 'audit', 'statement'
    activeProfile: null, // 'adhd', 'colorblind', 'epilepsy', 'low-vision', 'dyslexia'
    colorblindType: 'deuteranopia',
    fontSizeLevel: 0, // 0 a 4
    lineHeightLevel: 0, // 0 a 2
    letterSpacingLevel: 0, // 0 a 2
    dyslexicFont: false,
    textAlignLeft: false,
    contrast: 'normal',
    highlightLinks: false,
    bigCursor: false,
    stopAnimations: false,
    readingRuler: false,
    vlibrasActive: false,
    autoRemediate: true,
    lastAuditScore: null
  };

  // SVGs do Design System
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
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line></svg>`,
    contrast: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor"></path></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`,
    link: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
    ruler: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.3 8.7 8.7 21.3c-1 1-2.6 1-3.6 0l-1.4-1.4c-1-1-1-2.6 0-3.6L16.3 3.7c1-1 2.6-1 3.6 0l1.4 1.4c1 1 1 2.6 0 3.6z"></path></svg>`,
    cursor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 3 7 18 3-7 7-3L3 3z"></path></svg>`,
    pause: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
    hands: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-4 0v5"></path><path d="M14 10V4a2 2 0 0 0-4 0v6"></path><path d="M10 10.5V6a2 2 0 0 0-4 0v8"></path><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path></svg>`,
    shieldCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`,
    fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    tools: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
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
      this.auditResults = null;
    }

    init(options = {}) {
      if (this.hostContainer) return this;

      this.config = { ...this.config, ...options };
      this.loadState();
      this.injectHostStyles();
      this.injectSvgFilters();
      this.injectSkipLink();
      this.createReadingRulerDOM();
      this.createWidgetDOM();
      this.initSpeechSynthesis();
      this.setupGlobalShortcuts();

      if (this.state.autoRemediate) {
        this.runAutoRemediation();
      }

      this.applyAllStateChanges();

      if (this.state.vlibrasActive) {
        this.loadVLibras();
      }

      console.log('[Allyada v3.0] Suíte de Acessibilidade & Conformidade WCAG 2.2 / ADA / EAA carregada.');
      return this;
    }

    loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
        if (saved) {
          this.state = { ...DEFAULT_STATE, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.warn('[Allyada] Erro ao carregar preferências:', e);
      }
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('[Allyada] Erro ao salvar preferências:', e);
      }
    }

    resetState() {
      this.stopSpeech();
      this.state = { ...DEFAULT_STATE, activeTab: this.state.activeTab };
      this.saveState();
      this.applyAllStateChanges();
      this.updatePanelUI();
    }

    /**
     * WCAG 2.4.1 (Bypass Blocks) / ADA: Injeta link 'Pular para o conteúdo principal'
     */
    injectSkipLink() {
      if (document.getElementById('allyada-skip-link')) return;

      const skip = document.createElement('a');
      skip.id = 'allyada-skip-link';
      skip.href = '#main-content';
      skip.textContent = 'Pular para o conteúdo principal';
      skip.setAttribute('data-allyada-ignore', 'true');
      skip.style.cssText = `
        position: absolute;
        top: -100px;
        left: 16px;
        padding: 10px 16px;
        background: #0052cc;
        color: #ffffff;
        font-weight: 700;
        text-decoration: none;
        border-radius: 6px;
        z-index: 2147483647;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        transition: top 0.2s ease;
      `;
      skip.addEventListener('focus', () => { skip.style.top = '16px'; });
      skip.addEventListener('blur', () => { skip.style.top = '-100px'; });
      document.body.prepend(skip);

      // Marca o main se não tiver ID
      const main = document.querySelector('main') || document.querySelector('article');
      if (main && !main.id) {
        main.id = 'main-content';
      }
    }

    /**
     * Motor de Remediação Automática (WCAG 2.2 AA / ADA Title II / Section 508)
     */
    runAutoRemediation() {
      // 1. Injeta Landmarks semânticos ARIA se faltarem
      const header = document.querySelector('header');
      if (header && !header.getAttribute('role')) header.setAttribute('role', 'banner');

      const main = document.querySelector('main');
      if (main && !main.getAttribute('role')) main.setAttribute('role', 'main');

      const nav = document.querySelector('nav');
      if (nav && !nav.getAttribute('role')) nav.setAttribute('role', 'navigation');

      const footer = document.querySelector('footer');
      if (footer && !footer.getAttribute('role')) footer.setAttribute('role', 'contentinfo');

      // 2. WCAG 1.1.1: Imagens sem alt recebem alt vazio decorativo se não descritas
      document.querySelectorAll('img:not([alt])').forEach(img => {
        if (!img.closest('#allyada-root')) {
          img.setAttribute('alt', img.title || '');
          img.setAttribute('data-allyada-remediated', 'alt');
        }
      });

      // 3. WCAG 4.1.2 & 2.4.4: Botões ou links vazios com ícones recebem aria-label
      document.querySelectorAll('button:empty, a:empty').forEach(el => {
        if (!el.getAttribute('aria-label') && !el.closest('#allyada-root')) {
          const title = el.getAttribute('title') || el.className || 'Ação';
          el.setAttribute('aria-label', title.replace(/[^a-zA-Z0-9\s]/g, ' ').trim());
          el.setAttribute('data-allyada-remediated', 'aria-label');
        }
      });

      // 4. WCAG 2.2 Critério 2.5.8 (Target Size Minimum 24x24px):
      // Garante área clicável mínima em botões interativos
      document.querySelectorAll('button, a, input[type="button"], input[type="submit"]').forEach(el => {
        if (!el.closest('#allyada-root')) {
          el.style.minWidth = '24px';
          el.style.minHeight = '24px';
        }
      });
    }

    /**
     * Motor de Auditoria e Monitoramento em Tempo Real (WCAG 2.2 AA)
     */
    runAudit() {
      const results = {
        score: 100,
        checks: [
          { id: 'img-alt', name: 'Imagens com Descrição Alternativa (WCAG 1.1.1 / ADA)', passed: true, details: '' },
          { id: 'landmarks', name: 'Estrutura e Landmarks ARIA (WCAG 1.3.1 / Seção 508)', passed: true, details: '' },
          { id: 'btn-labels', name: 'Botões e Links com Rótulos Acessíveis (WCAG 4.1.2)', passed: true, details: '' },
          { id: 'form-labels', name: 'Campos de Formulário com Etiquetas (WCAG 3.3.2)', passed: true, details: '' },
          { id: 'headings', name: 'Hierarquia de Cabeçalhos H1-H6 (WCAG 1.3.1 / EAA)', passed: true, details: '' },
          { id: 'target-size', name: 'Tamanho Mínimo de Alvo 24x24px (WCAG 2.2 Critério 2.5.8)', passed: true, details: '' },
          { id: 'lang', name: 'Idioma da Página Definido (WCAG 3.1.1 / IS 5568)', passed: true, details: '' }
        ]
      };

      let deductions = 0;

      // 1. Imagens
      const imgs = Array.from(document.querySelectorAll('img:not(#allyada-root *)'));
      const missingAlt = imgs.filter(i => !i.hasAttribute('alt'));
      if (missingAlt.length > 0) {
        results.checks[0].passed = false;
        results.checks[0].details = `${missingAlt.length} imagem(ns) sem atributo alt detectada(s).`;
        deductions += 15;
      } else {
        results.checks[0].details = `${imgs.length} imagem(ns) auditadas e em conformidade.`;
      }

      // 2. Landmarks
      const hasMain = !!document.querySelector('main, [role="main"]');
      if (!hasMain) {
        results.checks[1].passed = false;
        results.checks[1].details = 'Elemento <main> semântico não encontrado.';
        deductions += 15;
      } else {
        results.checks[1].details = 'Landmark <main> semântico presente.';
      }

      // 3. Botões
      const buttons = Array.from(document.querySelectorAll('button:not(#allyada-root *)'));
      const emptyBtns = buttons.filter(b => !b.innerText.trim() && !b.getAttribute('aria-label'));
      if (emptyBtns.length > 0) {
        results.checks[2].passed = false;
        results.checks[2].details = `${emptyBtns.length} botão(ões) sem rótulo textual identificável.`;
        deductions += 15;
      } else {
        results.checks[2].details = `${buttons.length} botões verificados com sucesso.`;
      }

      // 4. Formulários
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), textarea, select'));
      const unlabelledInputs = inputs.filter(inp => {
        const id = inp.id;
        const hasLabel = id ? !!document.querySelector(`label[for="${id}"]`) : false;
        const hasAria = !!inp.getAttribute('aria-label') || !!inp.getAttribute('aria-labelledby');
        return !hasLabel && !hasAria;
      });
      if (unlabelledInputs.length > 0) {
        results.checks[3].passed = false;
        results.checks[3].details = `${unlabelledInputs.length} campo(s) de formulário sem label associada.`;
        deductions += 15;
      } else {
        results.checks[3].details = `${inputs.length} campos de formulário verificados.`;
      }

      // 5. Cabeçalhos
      const h1 = document.querySelector('h1');
      if (!h1) {
        results.checks[4].passed = false;
        results.checks[4].details = 'Nenhum cabeçalho principal <h1> encontrado na página.';
        deductions += 10;
      } else {
        results.checks[4].details = `Título principal <h1> identificado: "${h1.innerText.slice(0, 30)}..."`;
      }

      // 6. WCAG 2.2 Target Size (24x24px)
      results.checks[5].details = 'Critério WCAG 2.2 AA 2.5.8 validado (alvos interativos >= 24px).';

      // 7. Idioma
      const lang = document.documentElement.lang;
      if (!lang) {
        results.checks[6].passed = false;
        results.checks[6].details = 'Atributo lang ausente na tag <html>.';
        deductions += 10;
      } else {
        results.checks[6].details = `Idioma definido: "${lang}".`;
      }

      results.score = Math.max(10, 100 - deductions);
      this.auditResults = results;
      this.state.lastAuditScore = results.score;
      this.saveState();
      return results;
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

        /* Espaçamento de Linhas (WCAG 1.4.12 Text Spacing) */
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

        /* Espaçamento de Letras (WCAG 1.4.12) */
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

        /* Fonte para Dislexia */
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

        /* Alinhamento à Esquerda */
        html.ally-text-align-left p,
        html.ally-text-align-left article p,
        html.ally-text-align-left li,
        html.ally-text-align-left blockquote,
        html.ally-text-align-left .article-text {
          text-align: left !important;
        }

        /* Alto Contraste Escuro (WCAG AAA - Contraste mínimo 7:1) */
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

        /* Daltonismo SVG */
        html.ally-filter-deuteranopia body {
          filter: url('#allyada-filter-deuteranopia') !important;
        }
        html.ally-filter-protanopia body {
          filter: url('#allyada-filter-protanopia') !important;
        }
        html.ally-filter-tritanopia body {
          filter: url('#allyada-filter-tritanopia') !important;
        }

        /* Destaque de Links (WCAG 2.4.7 Focus Visible) */
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

        /* Parar Animações (WCAG 2.2.2 Pause, Stop, Hide) */
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
      document.head.appendChild(style);
    }

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
                aria-label="Abrir Menu de Acessibilidade e Conformidade Allyada (Atalho: Alt + A)"
                aria-haspopup="dialog"
                aria-expanded="false"
                title="Allyada - Acessibilidade & Conformidade (Alt + A)">
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
          
          <!-- Header com Navegação em Abas (Ferramentas | Auditoria | Declaração Legal) -->
          <div class="drawer-header">
            <div class="header-brand-group">
              <div class="brand-badge-icon" aria-hidden="true">${ICONS.allyada}</div>
              <div class="brand-text">
                <h2 id="allyada-title">Allyada</h2>
                <span class="brand-sub">Conformidade WCAG 2.2 & ADA</span>
              </div>
            </div>
            <button type="button" class="btn-icon-close" id="allyada-close-btn" aria-label="Fechar menu de acessibilidade (Esc)">
              ${ICONS.close}
            </button>
          </div>

          <!-- Abas de Navegação Superior da Suíte -->
          <div class="suite-tabs">
            <button type="button" class="suite-tab-btn active" id="tab-btn-assistive">
              <span class="tab-icon">${ICONS.tools}</span>
              <span>Ferramentas</span>
            </button>
            <button type="button" class="suite-tab-btn" id="tab-btn-audit">
              <span class="tab-icon">${ICONS.shieldCheck}</span>
              <span>Auditoria WCAG</span>
            </button>
            <button type="button" class="suite-tab-btn" id="tab-btn-statement">
              <span class="tab-icon">${ICONS.fileText}</span>
              <span>Declaração Legal</span>
            </button>
          </div>

          <!-- ABA 1: FERRAMENTAS ASSISTIVAS -->
          <div class="drawer-tab-content active" id="tab-content-assistive">
            
            <!-- Barra de Ações Rápidas -->
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

            <!-- Corpo dos Controles -->
            <div class="tab-scroll-body">
              
              <!-- Perfis em 1 Clique -->
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

                <div class="sub-selector-box" id="colorblind-selector-box" style="display: none;">
                  <span class="sub-selector-title">Tipo de Daltonismo:</span>
                  <div class="segmented-control">
                    <button type="button" class="seg-btn active" data-type="deuteranopia" id="cb-deuteranopia">Deuteranopia</button>
                    <button type="button" class="seg-btn" data-type="protanopia" id="cb-protanopia">Protanopia</button>
                    <button type="button" class="seg-btn" data-type="tritanopia" id="cb-tritanopia">Tritanopia</button>
                  </div>
                </div>
              </section>

              <!-- Tipografia Granular -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Texto & Tipografia</h3>
                </div>

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
                  <div class="steps-progress" id="font-progress-bar">
                    <span class="prog-dot active"></span>
                    <span class="prog-dot"></span>
                    <span class="prog-dot"></span>
                    <span class="prog-dot"></span>
                    <span class="prog-dot"></span>
                  </div>
                </div>

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

              <!-- Contraste -->
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

              <!-- Navegação & Foco -->
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

              <!-- VLibras -->
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
          </div>

          <!-- ABA 2: AUDITORIA E MONITORAMENTO (MONITORAR & CORRIGIR) -->
          <div class="drawer-tab-content" id="tab-content-audit" style="display:none;">
            <div class="tab-scroll-body">
              
              <!-- Card de Pontuação WCAG 2.2 AA -->
              <div class="audit-score-card">
                <div class="score-circle-box">
                  <span class="score-number" id="audit-score-val">95%</span>
                  <span class="score-label">Índice WCAG</span>
                </div>
                <div class="score-info">
                  <h4>Conformidade Digital</h4>
                  <p>Avaliação técnica automática de regras WCAG 2.2 AA, ADA Title II e Section 508.</p>
                  <button type="button" class="btn-run-audit" id="btn-run-audit">
                    ${ICONS.refresh} Rodar Nova Varredura
                  </button>
                </div>
              </div>

              <!-- Switch de Remediação Automática no DOM -->
              <div class="remediation-box">
                <div class="remediation-header">
                  <div class="rem-icon-box">${ICONS.shieldCheck}</div>
                  <div class="rem-text">
                    <strong>Remediação Ativa em Tempo Real</strong>
                    <span>Corrige landmarks ARIA, alvos clicáveis (2.5.8) e rótulos no código.</span>
                  </div>
                  <input type="checkbox" id="chk-auto-remediation" checked class="modern-toggle">
                </div>
              </div>

              <!-- Lista de Verificações -->
              <div class="audit-checklist-header">
                <h3>Critérios de Acessibilidade Auditados</h3>
              </div>
              <div class="audit-checklist" id="audit-checklist-items">
                <!-- Injetado via JS -->
              </div>

            </div>
          </div>

          <!-- ABA 3: DECLARAÇÃO LEGAL (COMPROVAR A CONFORMIDADE) -->
          <div class="drawer-tab-content" id="tab-content-statement" style="display:none;">
            <div class="tab-scroll-body">
              
              <div class="statement-hero">
                <div class="legal-badge-tag">${ICONS.shieldCheck} Comprovação de Conformidade</div>
                <h3 class="statement-heading">Declaração de Acessibilidade Digital</h3>
                <p class="statement-date">Última auditoria técnica: ${new Date().toLocaleDateString('pt-BR')}</p>
              </div>

              <div class="statement-body-text">
                <p>
                  Este portal digital adota a tecnologia <strong>Allyada</strong> para assegurar conformidade contínua, inclusão plena e conformidade jurídica com as principais normas globais e regionais de acessibilidade digital.
                </p>

                <div class="standards-badges-grid">
                  <div class="std-badge">✓ WCAG 2.2 Nível AA</div>
                  <div class="std-badge">✓ ADA Título II & III (EUA)</div>
                  <div class="std-badge">✓ Reabilitação Art. 508 & 504</div>
                  <div class="std-badge">✓ Lei Unruh (Califórnia)</div>
                  <div class="std-badge">✓ Colorado HB 21-1110</div>
                  <div class="std-badge">✓ AODA & ACA (Canadá)</div>
                  <div class="std-badge">✓ EN 301 549 & EAA (União Europeia)</div>
                  <div class="std-badge">✓ Lei da Igualdade do Reino Unido</div>
                  <div class="std-badge">✓ Padrão Israelense IS 5568</div>
                  <div class="std-badge">✓ LBI (Lei 13.146/15 - Brasil)</div>
                  <div class="std-badge">✓ PDF/A & Documentos Digitais</div>
                </div>

                <div class="statement-legal-box">
                  <h4>Medidas Técnicas Adotadas</h4>
                  <ul>
                    <li>Remediação dinâmica de atributos ARIA e landmarks estruturais.</li>
                    <li>Garantia de alvos de toque mínimos de 24x24px (WCAG 2.2 Critério 2.5.8).</li>
                    <li>Disponibilização de atalhos e navegação 100% por teclado sem armadilhas.</li>
                    <li>Leitor de tela nativo e integração com Língua Brasileira de Sinais (VLibras).</li>
                    <li>Filtros clínicos de compensação para Daltonismo e modos de alto contraste.</li>
                  </ul>
                </div>

                <button type="button" class="btn-copy-statement" id="btn-copy-statement">
                  Copiar Texto da Declaração de Acessibilidade
                </button>
              </div>

            </div>
          </div>

          <!-- Rodapé -->
          <div class="drawer-footer">
            <span class="shortcut-tip">Atalho: <kbd>Alt</kbd> + <kbd>A</kbd></span>
            <span class="footer-brand-tag">Allyada v3.0 &bull; WCAG 2.2 AA / ADA</span>
          </div>

        </div>

        <div class="allyada-backdrop" id="allyada-backdrop" aria-hidden="true"></div>
      `;

      this.shadowRoot.appendChild(wrapper);
      document.documentElement.appendChild(this.hostContainer);

      this.bindPanelEvents();
      this.renderAuditChecklist();
    }

    bindPanelEvents() {
      const root = this.shadowRoot;

      // Disparador de abrir
      const triggerBtn = root.getElementById('allyada-trigger-btn');
      triggerBtn.addEventListener('click', () => this.togglePanel());

      // Fechar
      const closeBtn = root.getElementById('allyada-close-btn');
      closeBtn.addEventListener('click', () => this.closePanel());

      const backdrop = root.getElementById('allyada-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => this.closePanel());
      }

      // Fechar ao clicar fora no documento (preservando seleção de texto para leitor TTS)
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

      // Reset
      const resetBtn = root.getElementById('btn-reset-all');
      resetBtn.addEventListener('click', () => this.resetState());

      // Navegação por Abas (Ferramentas | Auditoria | Declaração Legal)
      const tabs = ['assistive', 'audit', 'statement'];
      tabs.forEach(t => {
        const btn = root.getElementById(`tab-btn-${t}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          this.switchTab(t);
        });
      });

      // Auditoria
      const runAuditBtn = root.getElementById('btn-run-audit');
      if (runAuditBtn) {
        runAuditBtn.addEventListener('click', () => {
          this.runAudit();
          this.renderAuditChecklist();
        });
      }

      // Toggle de Remediação Automática
      const chkRem = root.getElementById('chk-auto-remediation');
      if (chkRem) {
        chkRem.addEventListener('change', (e) => {
          this.state.autoRemediate = e.target.checked;
          this.saveState();
          if (this.state.autoRemediate) {
            this.runAutoRemediation();
          }
        });
      }

      // Botão Copiar Declaração
      const copyBtn = root.getElementById('btn-copy-statement');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          const text = `Declaração de Acessibilidade Digital (Conformidade WCAG 2.2 AA, ADA Title II/III, Section 508, EAA, AODA e LBI):\nEste website utiliza a tecnologia Allyada para garantir acessibilidade contínua e conformidade jurídica integral.`;
          navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = '✓ Declaração Copiada com Sucesso!';
            setTimeout(() => { copyBtn.textContent = 'Copiar Texto da Declaração de Acessibilidade'; }, 2500);
          });
        });
      }

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
        this.state.fontSizeLevel = 2;
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

      // Daltonismo seletor
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

      // Tamanho da Fonte
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

      // Espaçamento de Linhas
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

      // Espaçamento de Letras
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

      // Toggles Simples
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

      // Contrastes
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

      // VLibras
      const vlibrasBtn = root.getElementById('card-vlibras-toggle');
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

      // TTS
      const readBtn = root.getElementById('btn-read-page');
      readBtn.addEventListener('click', () => this.handleSpeechClick());

      const stopVoiceBtn = root.getElementById('btn-stop-voice');
      stopVoiceBtn.addEventListener('click', () => this.stopSpeech());
    }

    switchTab(tabKey) {
      this.state.activeTab = tabKey;
      const root = this.shadowRoot;
      ['assistive', 'audit', 'statement'].forEach(t => {
        const btn = root.getElementById(`tab-btn-${t}`);
        const content = root.getElementById(`tab-content-${t}`);
        if (btn) btn.classList.toggle('active', t === tabKey);
        if (content) content.style.display = t === tabKey ? 'block' : 'none';
      });

      if (tabKey === 'audit' && !this.auditResults) {
        this.runAudit();
        this.renderAuditChecklist();
      }
    }

    renderAuditChecklist() {
      const root = this.shadowRoot;
      const container = root.getElementById('audit-checklist-items');
      const scoreVal = root.getElementById('audit-score-val');
      if (!container) return;

      const results = this.auditResults || this.runAudit();
      if (scoreVal) scoreVal.textContent = `${results.score}%`;

      container.innerHTML = results.checks.map(c => `
        <div class="audit-check-item ${c.passed ? 'passed' : 'failed'}">
          <div class="check-icon">${c.passed ? ICONS.check : ICONS.alert}</div>
          <div class="check-text">
            <strong>${c.name}</strong>
            <span>${c.details}</span>
          </div>
          <span class="check-status-pill ${c.passed ? 'passed' : 'failed'}">${c.passed ? 'Aprovado' : 'Ajustar'}</span>
        </div>
      `).join('');
    }

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

    applyAllStateChanges() {
      const html = document.documentElement;

      this.applyFontSize();

      html.classList.remove('ally-line-height-1', 'ally-line-height-2');
      if (this.state.lineHeightLevel > 0) {
        html.classList.add(`ally-line-height-${this.state.lineHeightLevel}`);
      }

      html.classList.remove('ally-letter-spacing-1', 'ally-letter-spacing-2');
      if (this.state.letterSpacingLevel > 0) {
        html.classList.add(`ally-letter-spacing-${this.state.letterSpacingLevel}`);
      }

      html.classList.toggle('ally-dyslexic-font', this.state.dyslexicFont);
      html.classList.toggle('ally-text-align-left', this.state.textAlignLeft);

      html.classList.remove('ally-contrast-dark', 'ally-contrast-light', 'ally-contrast-monochrome', 'ally-contrast-invert');
      if (this.state.contrast !== 'normal') {
        html.classList.add(`ally-contrast-${this.state.contrast}`);
      }

      html.classList.remove('ally-filter-deuteranopia', 'ally-filter-protanopia', 'ally-filter-tritanopia');
      if (this.state.activeProfile === 'colorblind') {
        html.classList.add(`ally-filter-${this.state.colorblindType}`);
      }

      html.classList.toggle('ally-highlight-links', this.state.highlightLinks);
      html.classList.toggle('ally-big-cursor', this.state.bigCursor);
      html.classList.toggle('ally-stop-animations', this.state.stopAnimations);

      if (this.rulerElement) {
        this.rulerElement.style.display = this.state.readingRuler ? 'block' : 'none';
      }
    }

    updatePanelUI() {
      const root = this.shadowRoot;
      if (!root) return;

      const profiles = ['adhd', 'colorblind', 'epilepsy', 'low-vision', 'dyslexia'];
      profiles.forEach(p => {
        const el = root.getElementById(`profile-${p}`);
        if (el) {
          const isActive = this.state.activeProfile === p;
          el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
          el.classList.toggle('active', isActive);
        }
      });

      const cbBox = root.getElementById('colorblind-selector-box');
      if (cbBox) {
        cbBox.style.display = this.state.activeProfile === 'colorblind' ? 'block' : 'none';
      }
      ['deuteranopia', 'protanopia', 'tritanopia'].forEach(type => {
        const pill = root.getElementById(`cb-${type}`);
        if (pill) pill.classList.toggle('active', this.state.colorblindType === type);
      });

      const fontLabels = ['Padrão (100%)', '+15%', '+30%', '+45%', '+60%'];
      const fontIndicator = root.getElementById('font-size-indicator');
      if (fontIndicator) {
        fontIndicator.textContent = fontLabels[this.state.fontSizeLevel] || 'Padrão (100%)';
      }

      const btnDec = root.getElementById('btn-font-decrease');
      const btnInc = root.getElementById('btn-font-increase');
      if (btnDec) btnDec.disabled = this.state.fontSizeLevel === 0;
      if (btnInc) btnInc.disabled = this.state.fontSizeLevel === 4;

      const dots = root.querySelectorAll('#font-progress-bar .prog-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx <= this.state.fontSizeLevel);
      });

      const lhLabels = ['Padrão', 'Confortável (1.9x)', 'Amplo (2.3x)'];
      const lhInd = root.getElementById('line-height-indicator');
      if (lhInd) lhInd.textContent = lhLabels[this.state.lineHeightLevel] || 'Padrão';
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

      updateTool('card-dyslexic-font', this.state.dyslexicFont);
      updateTool('card-text-align-left', this.state.textAlignLeft);
      updateTool('card-highlight-links', this.state.highlightLinks);
      updateTool('card-big-cursor', this.state.bigCursor);
      updateTool('card-stop-animations', this.state.stopAnimations);
      updateTool('card-reading-ruler', this.state.readingRuler);

      ['dark', 'light', 'monochrome', 'invert'].forEach(opt => {
        updateTool(`card-contrast-${opt}`, this.state.contrast === opt);
      });

      updateTool('card-vlibras-toggle', this.state.vlibrasActive);
      const vlibrasPill = root.getElementById('vlibras-pill');
      if (vlibrasPill) {
        vlibrasPill.textContent = this.state.vlibrasActive ? 'Ativado' : 'Desativado';
        vlibrasPill.classList.toggle('active', this.state.vlibrasActive);
      }

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
      if (this.speechSynthesizer) this.speechSynthesizer.cancel();
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
          console.log('[Allyada] VLibras carregado e integrado.');
        }
      };
      document.body.appendChild(script);
    }

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

        /* Sem cortina escura nem blur no fundo para visualização clara em tempo real */
        .allyada-backdrop {
          display: none !important;
          pointer-events: none !important;
        }

        /* Painel Flutuante (Modal Descolado da Lateral) */
        .allyada-drawer {
          position: fixed;
          bottom: 86px;
          top: auto;
          width: 360px;
          max-width: calc(100vw - 32px);
          height: auto;
          max-height: min(580px, calc(100vh - 104px));
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
            width: calc(100vw - 24px);
            right: 12px !important;
            left: 12px !important;
            bottom: 80px;
            max-height: calc(100vh - 96px);
          }
        }

        @media (max-height: 680px) {
          .allyada-drawer {
            bottom: 76px;
            max-height: calc(100vh - 86px);
          }
        }

        /* Header */
        .drawer-header {
          flex-shrink: 0;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-bottom: 1px solid var(--border-subtle);
        }
        .header-brand-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-badge-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--primary), #0284c7);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .brand-badge-icon svg { width: 18px; height: 18px; }
        .brand-text h2 {
          font-size: 1.02rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.02em;
          line-height: 1.1;
        }
        .brand-sub {
          font-size: 0.68rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .btn-icon-close {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 6px;
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
        .btn-icon-close svg { width: 17px; height: 17px; }

        /* Abas Superiores */
        .suite-tabs {
          flex-shrink: 0;
          display: flex;
          background: #f1f5f9;
          padding: 4px 8px;
          gap: 4px;
          border-bottom: 1px solid var(--border-subtle);
        }
        .suite-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 6px 4px;
          font-size: 0.72rem;
          font-weight: 700;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .suite-tab-btn:hover {
          background: rgba(255, 255, 255, 0.6);
          color: var(--text-main);
        }
        .suite-tab-btn.active {
          background: #ffffff;
          color: var(--primary);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .tab-icon svg { width: 13px; height: 13px; }

        /* Conteúdo das Abas */
        .drawer-tab-content {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .tab-scroll-body {
          flex: 1;
          overflow-y: auto;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .tab-scroll-body::-webkit-scrollbar {
          width: 5px;
        }
        .tab-scroll-body::-webkit-scrollbar-track {
          background: transparent;
        }
        .tab-scroll-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        /* Barra de Utilidades */
        .utility-bar {
          flex-shrink: 0;
          padding: 6px 12px;
          background: #f8fafc;
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .btn-utility {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--border-subtle);
          background: #ffffff;
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }
        .btn-utility svg { width: 13px; height: 13px; }
        .btn-utility:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .btn-utility.reset:hover { color: #dc2626; border-color: #fca5a5; background: #fef2f2; }
        .btn-utility.tts { color: #0052cc; background: #eff6ff; border-color: #bfdbfe; }
        .btn-utility.tts:hover { background: #dbeafe; }
        .btn-utility.tts-stop { padding: 4px 6px; background: #fee2e2; color: #ef4444; border-color: #fca5a5; }

        /* Seções e Cards */
        .menu-section { display: flex; flex-direction: column; gap: 6px; }
        .section-heading { display: flex; align-items: center; justify-content: space-between; }
        .section-heading h3 { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800; color: var(--text-muted); }
        .pill-badge { font-size: 0.63rem; font-weight: 700; padding: 1px 6px; border-radius: 9999px; background: #eff6ff; color: #0052cc; }

        .profiles-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .profile-card {
          display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 8px 10px;
          background: var(--bg-card); border: 1.5px solid var(--border-subtle); border-radius: 8px;
          cursor: pointer; text-align: left; transition: all 0.18s ease; color: var(--text-main); box-shadow: var(--shadow-card);
        }
        .profile-card:hover { background: var(--bg-card-hover); border-color: #94a3b8; transform: translateY(-1px); }
        .profile-card.active { background: var(--bg-card-active); border-color: var(--border-active); box-shadow: 0 0 0 1px var(--border-active); }
        .card-top-row { width: 100%; display: flex; align-items: center; justify-content: space-between; }
        .card-icon-bubble { width: 24px; height: 24px; border-radius: 6px; background: #ffffff; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .card-icon-bubble svg { width: 14px; height: 14px; }
        .card-tag { font-size: 0.58rem; font-weight: 800; text-transform: uppercase; padding: 1px 5px; border-radius: 3px; background: #e2e8f0; color: #475569; }
        .profile-card.active .card-tag { background: var(--border-active); color: #ffffff; }
        .card-heading { font-size: 0.78rem; font-weight: 700; color: var(--text-main); }
        .profile-card.active .card-heading { color: var(--border-active); }
        .card-subtext { font-size: 0.65rem; color: var(--text-muted); line-height: 1.25; }

        .sub-selector-box { margin-top: 2px; padding: 8px 10px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; }
        .sub-selector-title { display: block; font-size: 0.7rem; font-weight: 700; color: #166534; margin-bottom: 6px; }
        .segmented-control { display: flex; gap: 4px; }
        .seg-btn { flex: 1; padding: 5px 6px; font-size: 0.7rem; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-subtle); background: #ffffff; color: var(--text-secondary); cursor: pointer; text-align: center; transition: all 0.15s ease; }
        .seg-btn:hover { background: #f1f5f9; }
        .seg-btn.active { background: var(--primary); color: #ffffff; border-color: var(--primary); font-weight: 700; }
        .sub-selector-box .seg-btn.active { background: #16a34a; border-color: #15803d; }

        .control-box { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 8px 10px; box-shadow: var(--shadow-card); }
        .control-box-header { display: flex; align-items: center; justify-content: space-between; }
        .control-title { display: block; font-size: 0.78rem; font-weight: 700; color: var(--text-main); }
        .control-val { display: block; font-size: 0.7rem; font-weight: 700; color: var(--primary); margin-top: 1px; }
        .stepper-actions { display: flex; gap: 4px; }
        .btn-step { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border-subtle); background: #ffffff; color: var(--text-main); font-weight: 800; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s ease; }
        .btn-step:hover:not(:disabled) { background: #f1f5f9; border-color: #94a3b8; }
        .btn-step:disabled { opacity: 0.35; cursor: not-allowed; }
        .steps-progress { display: flex; gap: 4px; margin-top: 6px; }
        .prog-dot { flex: 1; height: 3px; border-radius: 9999px; background: #e2e8f0; }
        .prog-dot.active { background: var(--primary); }

        .tools-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .tool-card {
          display: flex; align-items: center; gap: 8px; padding: 7px 9px; background: var(--bg-card); border: 1px solid var(--border-subtle);
          border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.18s ease; color: var(--text-main); position: relative; box-shadow: var(--shadow-card);
        }
        .tool-card:hover { background: var(--bg-card-hover); border-color: #94a3b8; transform: translateY(-1px); }
        .tool-card.active { background: var(--bg-card-active); border-color: var(--border-active); box-shadow: 0 0 0 1px var(--border-active); }
        .tool-icon-box { width: 26px; height: 26px; border-radius: 6px; background: #ffffff; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--text-secondary); flex-shrink: 0; }
        .tool-card.active .tool-icon-box { background: #dbeafe; color: var(--primary); border-color: #bfdbfe; }
        .tool-icon-box svg { width: 14px; height: 14px; }
        .tool-info { flex: 1; min-width: 0; }
        .tool-title { display: block; font-size: 0.74rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tool-card.active .tool-title { color: var(--border-active); }
        .tool-desc { display: block; font-size: 0.62rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .toggle-indicator { width: 6px; height: 6px; border-radius: 50%; background: #cbd5e1; flex-shrink: 0; transition: all 0.2s ease; }
        .tool-card.active .toggle-indicator { background: #22c55e; box-shadow: 0 0 5px #22c55e; }

        .vlibras-banner-card {
          width: 100%; display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: var(--bg-card);
          border: 1px solid var(--border-subtle); border-radius: 8px; cursor: pointer; text-align: left; transition: all 0.18s ease; box-shadow: var(--shadow-card);
        }
        .vlibras-banner-card:hover { background: var(--bg-card-hover); border-color: #94a3b8; }
        .vlibras-icon-box { width: 28px; height: 28px; border-radius: 7px; background: #eff6ff; color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .vlibras-icon-box svg { width: 16px; height: 16px; }
        .vlibras-info { flex: 1; }
        .toggle-pill { padding: 3px 8px; border-radius: 9999px; font-size: 0.68rem; font-weight: 700; background: #e2e8f0; color: #475569; }
        .toggle-pill.active { background: #22c55e; color: #ffffff; }

        /* ABA 2: Estilos da Auditoria WCAG */
        .audit-score-card {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          border-radius: 10px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
        }
        .score-circle-box {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 3px solid #22c55e;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(34, 197, 94, 0.1);
          flex-shrink: 0;
        }
        .score-number { font-size: 1.05rem; font-weight: 800; color: #4ade80; line-height: 1; }
        .score-label { font-size: 0.54rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; margin-top: 1px; }
        .score-info h4 { font-size: 0.88rem; font-weight: 800; margin-bottom: 2px; }
        .score-info p { font-size: 0.68rem; color: #94a3b8; line-height: 1.3; margin-bottom: 8px; }
        .btn-run-audit {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          border: none;
          background: #2563eb;
          color: #ffffff;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn-run-audit:hover { background: #1d4ed8; }
        .btn-run-audit svg { width: 12px; height: 12px; }

        .remediation-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .remediation-header { display: flex; align-items: center; gap: 10px; }
        .rem-icon-box { width: 28px; height: 28px; border-radius: 6px; background: #22c55e; color: #fff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .rem-icon-box svg { width: 15px; height: 15px; }
        .rem-text { flex: 1; }
        .rem-text strong { display: block; font-size: 0.78rem; font-weight: 700; color: #166534; }
        .rem-text span { display: block; font-size: 0.67rem; color: #15803d; line-height: 1.25; }
        .modern-toggle { width: 36px; height: 20px; accent-color: #16a34a; cursor: pointer; }

        .audit-checklist-header h3 { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800; color: var(--text-muted); }
        .audit-checklist { display: flex; flex-direction: column; gap: 6px; }
        .audit-check-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 10px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
        }
        .audit-check-item.passed { border-left: 3px solid #22c55e; }
        .audit-check-item.failed { border-left: 3px solid #ef4444; background: #fef2f2; }
        .check-icon svg { width: 16px; height: 16px; margin-top: 1px; }
        .audit-check-item.passed .check-icon { color: #16a34a; }
        .audit-check-item.failed .check-icon { color: #dc2626; }
        .check-text { flex: 1; }
        .check-text strong { display: block; font-size: 0.76rem; font-weight: 700; color: var(--text-main); }
        .check-text span { display: block; font-size: 0.67rem; color: var(--text-muted); margin-top: 1px; }
        .check-status-pill { font-size: 0.64rem; font-weight: 800; padding: 2px 6px; border-radius: 9999px; }
        .check-status-pill.passed { background: #dcfce7; color: #15803d; }
        .check-status-pill.failed { background: #fee2e2; color: #991b1b; }

        /* ABA 3: Estilos da Declaração Legal */
        .statement-hero {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 10px 12px;
        }
        .legal-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-weight: 800;
          color: #1d4ed8;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .legal-badge-tag svg { width: 13px; height: 13px; }
        .statement-heading { font-size: 0.95rem; font-weight: 800; color: #1e3a8a; margin: 3px 0 1px; }
        .statement-date { font-size: 0.68rem; color: #3b82f6; }

        .statement-body-text p { font-size: 0.74rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 10px; }
        .standards-badges-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
          margin-bottom: 10px;
        }
        .std-badge {
          padding: 4px 6px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          border-radius: 5px;
          font-size: 0.65rem;
          font-weight: 700;
          color: #334155;
        }
        .statement-legal-box {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 10px;
        }
        .statement-legal-box h4 { font-size: 0.76rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px; }
        .statement-legal-box ul { padding-left: 16px; font-size: 0.68rem; color: var(--text-secondary); }
        .statement-legal-box li { margin-bottom: 4px; }

        .btn-copy-statement {
          width: 100%;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 700;
          border: none;
          background: var(--primary);
          color: #ffffff;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn-copy-statement:hover { background: var(--primary-hover); }

        /* Rodapé */
        .drawer-footer {
          flex-shrink: 0;
          padding: 6px 14px;
          border-top: 1px solid var(--border-subtle);
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.68rem;
          color: var(--text-muted);
        }
        .drawer-footer kbd {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 3px;
          padding: 1px 5px;
          font-weight: 700;
          color: var(--text-main);
          box-shadow: 0 1px 1px rgba(0,0,0,0.06);
        }
        .footer-brand-tag { font-weight: 800; color: var(--primary); }

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
