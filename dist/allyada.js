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
    verticalPosition: 'bottom', // 'bottom', 'middle', 'top'
    primaryColor: '#7956c2',
    accentColor: '#ffab00',
    fabIcon: 'allyada', // 'allyada', 'universal', 'hands', 'heart', 'shield'
    vlibrasShirtColor: '',
    vlibrasPantsColor: '',
    vlibrasLogoUrl: '',
    allowedDomain: '',
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
    textAlign: 'normal', // 'normal', 'left', 'center', 'right', 'justify'
    contrast: 'normal', // 'normal', 'dark', 'light', 'monochrome', 'invert'
    customTitleColor: '',
    customTextColor: '',
    customBgColor: '',
    highlightLinks: false,
    highlightColor: '#f59e0b',
    cursorSize: 'normal', // 'normal', 'large', 'xlarge'
    cursorColor: '#000000',
    stopAnimations: false,
    readingGuideMode: 'none', // 'none', 'ruler', 'mask'
    enhancedFocus: false,
    virtualKeyboard: false,
    imageInspector: false,
    speechRate: 1.0, // 0.75, 1.0, 1.25, 1.5, 2.0
    speechVoiceURI: '',
    uiScale: '1',
    dockPosition: 'right', // 'right', 'left'
    verticalPosition: 'bottom', // 'bottom' (Padrão), 'middle' (Centralizado ✨ Premium), 'top' (Superior ✨ Premium)
    vlibrasActive: false,
    vlibrasAvatar: 'hosana', // 'hosana', 'icaro', 'guga'
    rememberPreferences: true,
    enableShortcut: true
  };

  // SVGs de Ícones Acessíveis
  const ICONS = {
    allyada: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4.8" stroke-linecap="butt" stroke-linejoin="round" aria-hidden="true"><path d="M13.8 30.2A40 40 0 0 1 86.2 30.2"/><path d="M9.3 47.4A40 40 0 0 0 20.2 77.5"/><path d="M90.7 47.4A40 40 0 0 1 79.8 77.5"/><path d="M35.5 88.2A40 40 0 0 0 64.5 88.2"/><path d="M15.8 40.5Q50 58 84.2 40.5"/><path d="M30.8 79.2L49.2 49.5L50.8 49.5L69.2 79.2"/><circle cx="50" cy="29.5" r="10.2" fill="rgba(255,255,255,0.35)"/><circle cx="11.5" cy="38.5" r="5.2" fill="rgba(255,255,255,0.35)"/><circle cx="88.5" cy="38.5" r="5.2" fill="rgba(255,255,255,0.35)"/><circle cx="28" cy="83.5" r="5.2" fill="rgba(255,255,255,0.35)"/><circle cx="72" cy="83.5" r="5.2" fill="rgba(255,255,255,0.35)"/></svg>`,
    universal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="7.2" r="1.6" fill="currentColor"/><path d="M7.2 10.5h9.6"/><path d="M12 10.5v4.2"/><path d="m9.2 18.5 2.8-3.8 2.8 3.8"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><circle cx="12" cy="9.5" r="1.4" fill="currentColor"/><path d="M9.2 12h5.6"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="8.5" r="1.4" fill="currentColor"/><path d="M8.8 11.3h6.4"/><path d="m10 16.2 2-3.2 2 3.2"/></svg>`,
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
    alignCenter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>`,
    alignRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>`,
    alignJustify: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>`,
    palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r="1.5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.65-.75 1.65-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.13a1.64 1.64 0 0 1 1.67-1.67h1.99c3.05 0 5.55-2.5 5.55-5.55C21.97 5.81 17.5 2 12 2z"></path></svg>`,
    image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
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
    vpos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 7 4-4 4 4"/><path d="m8 17 4 4 4-4"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
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
      this.isStructureOpen = false;
      this.activeStructureTab = 'headings';
      this.imageDescriptionCache = new Map();
      this.imageTooltipEl = null;
      this.previousFocusedElement = null;
      this.guideRafId = null;
      this.mouseY = 0;
      this.panelKeyDownHandler = null;
      this.isAdminStudioUnlocked = false;
      this._logoClickCount = 0;
      this._logoClickTimer = null;
    }

    init(options = {}) {
      if (this.hostContainer) return this;

      // Lê configurações globais window.ALLYADA_CONFIG e atributos data-* da tag <script> do cliente PRO
      const scriptEl = (typeof document !== 'undefined')
        ? (document.currentScript || document.querySelector('script[src*="allyada"], script[src*="acessibilidade"], script[data-allyada]'))
        : null;
      const scriptOpts = {};
      if (scriptEl && scriptEl.getAttribute) {
        if (scriptEl.getAttribute('data-color')) scriptOpts.primaryColor = scriptEl.getAttribute('data-color');
        if (scriptEl.getAttribute('data-icon')) scriptOpts.fabIcon = scriptEl.getAttribute('data-icon');
        if (scriptEl.getAttribute('data-vpos')) scriptOpts.verticalPosition = scriptEl.getAttribute('data-vpos');
        if (scriptEl.getAttribute('data-position')) scriptOpts.position = scriptEl.getAttribute('data-position');
        if (scriptEl.getAttribute('data-vlibras-shirt')) scriptOpts.vlibrasShirtColor = scriptEl.getAttribute('data-vlibras-shirt');
        if (scriptEl.getAttribute('data-vlibras-pants')) scriptOpts.vlibrasPantsColor = scriptEl.getAttribute('data-vlibras-pants');
        if (scriptEl.getAttribute('data-vlibras-logo')) scriptOpts.vlibrasLogoUrl = scriptEl.getAttribute('data-vlibras-logo');
        if (scriptEl.getAttribute('data-domain')) scriptOpts.allowedDomain = scriptEl.getAttribute('data-domain');
      }
      const globalCfg = (typeof window !== 'undefined' && window.ALLYADA_CONFIG && typeof window.ALLYADA_CONFIG === 'object')
        ? window.ALLYADA_CONFIG
        : {};

      const normalizedOptions = { ...globalCfg, ...scriptOpts, ...options };
      if (normalizedOptions.primaryColor && normalizedOptions.primaryColor.toLowerCase() === '#0052cc') {
        normalizedOptions.primaryColor = '#7956c2';
      }

      // Validação de licença por domínio: se allowedDomain estiver definido e não bater com o domínio atual, reverte para o padrão gratuito
      if (normalizedOptions.allowedDomain && typeof window !== 'undefined' && window.location && window.location.hostname) {
        const currentHost = window.location.hostname.toLowerCase().replace(/^www\./, '');
        const allowedList = String(normalizedOptions.allowedDomain).toLowerCase().split(',').map(d => d.trim().replace(/^www\./, '')).filter(Boolean);
        const isAllowed = allowedList.some(d => currentHost === d || currentHost.endsWith('.' + d) || currentHost === 'localhost' || currentHost === '127.0.0.1');
        if (!isAllowed) {
          console.warn(`[Allyada PRO] Licença vinculada ao domínio "${normalizedOptions.allowedDomain}". Revertendo para visual padrão gratuito.`);
          normalizedOptions.primaryColor = '#7956c2';
          normalizedOptions.fabIcon = 'allyada';
          normalizedOptions.verticalPosition = 'bottom';
          normalizedOptions.vlibrasShirtColor = '';
          normalizedOptions.vlibrasPantsColor = '';
          normalizedOptions.vlibrasLogoUrl = '';
        }
      }

      this.config = { ...this.config, ...normalizedOptions };
      if (this.config.primaryColor) {
        this.config.vlibrasColor = this.config.primaryColor;
      }

      // Verifica se o modo Studio PRO (Configurador do Cliente) foi acionado via URL (?allyada_admin=1 ou ?allyada_pro=1)
      try {
        if (typeof window !== 'undefined' && window.location && /[?&](allyada_admin|allyada_pro|allyada_studio)=1/i.test(window.location.search)) {
          this.isAdminStudioUnlocked = true;
        }
      } catch (e) {}

      this.loadState();
      // A posição vertical nos cantos respeita a configuração definida pelo cliente dono do site
      if (normalizedOptions.verticalPosition) {
        this.state.verticalPosition = normalizedOptions.verticalPosition;
      }
      if (normalizedOptions.position) {
        this.state.dockPosition = normalizedOptions.position;
      }

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
          if (parsed.textAlignLeft && (!parsed.textAlign || parsed.textAlign === 'normal')) {
            parsed.textAlign = 'left';
          } else if (parsed.textAlign === 'left') {
            parsed.textAlignLeft = true;
          }

          // Players ativos (TTS e VLibras) iniciam desativados ao abrir a página, abrindo apenas sob comando do usuário
          this.state = { ...DEFAULT_STATE, ...parsed, vlibrasActive: false, rememberPreferences: true };
          if (this.state.dockPosition) this.config.position = this.state.dockPosition;
          if (this.state.verticalPosition) this.config.verticalPosition = this.state.verticalPosition;
        } else {
          // Detecção de prefers-reduced-motion no dispositivo
          if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.state.stopAnimations = true;
          }
          this.state.dockPosition = this.config.position || 'right';
          this.state.verticalPosition = this.config.verticalPosition || 'bottom';
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
      this.closeStructureModal();
      this.hideImageInspectorTooltip();
      const currentTab = this.state.activeTab;
      const remember = this.state.rememberPreferences;
      const vPos = this.state.verticalPosition || this.config.verticalPosition || 'bottom';
      const dPos = this.state.dockPosition || this.config.position || 'right';
      const scale = this.state.uiScale || '1';
      this.state = {
        ...DEFAULT_STATE,
        activeTab: currentTab,
        rememberPreferences: remember,
        verticalPosition: vPos,
        dockPosition: dPos,
        uiScale: scale
      };
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

        /* Alinhamentos de Texto (Esquerda, Centro, Direita, Justificado) */
        html.ally-text-align-left :is(p, article p, blockquote, dd, .article-text, h1, h2, h3, h4):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-text-align-left :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          text-align: left !important;
        }

        html.ally-text-align-center :is(p, article p, blockquote, dd, .article-text, h1, h2, h3, h4):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-text-align-center :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          text-align: center !important;
        }

        html.ally-text-align-right :is(p, article p, blockquote, dd, .article-text, h1, h2, h3, h4):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-text-align-right :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          text-align: right !important;
        }

        html.ally-text-align-justify :is(p, article p, blockquote, dd, .article-text):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *),
        html.ally-text-align-justify :is(main li, article li, section li, [role="main"] li):not(header *):not(nav *):not([class*="header"] *):not([class*="navbar"] *):not([class*="topbar"] *):not([class*="menu"] *):not(#allyada-root *) {
          text-align: justify !important;
        }

        /* Destaque de Imagem no Modo Descrever Imagem (IA) */
        .allyada-img-inspect-target {
          outline: 3px solid #7956c2 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 6px rgba(121, 86, 194, 0.25) !important;
          border-radius: 6px !important;
          cursor: help !important;
          transition: outline 0.15s ease, box-shadow 0.15s ease !important;
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

        /* Cursor Ampliado - Grande (44px, sem borda branca) */
        html.ally-cursor-large,
        html.ally-cursor-large * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M2 1.5V21.5L7.6 15.9L11.2 22.8L14.3 21.2L10.7 14.3H18.5L2 1.5Z'/%3E%3C/svg%3E") 4 2, auto !important;
        }

        /* Hover para Modo TTS (Point and Read) */
        .allyada-tts-hover-target {
          outline: 3px dashed #7956c2 !important;
          outline-offset: 2px !important;
          background-color: rgba(121, 86, 194, 0.1) !important;
          cursor: pointer !important;
        }

        /* Cursor Ampliado - Extra Grande (60px, sem borda branca) */
        html.ally-cursor-xlarge,
        html.ally-cursor-xlarge * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24'%3E%3Cpath fill='%23000000' d='M2 1.5V21.5L7.6 15.9L11.2 22.8L14.3 21.2L10.7 14.3H18.5L2 1.5Z'/%3E%3C/svg%3E") 5 3, auto !important;
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
      const initHPos = this.state.dockPosition || this.config.position || 'right';
      const initVPos = this.state.verticalPosition || this.config.verticalPosition || 'bottom';
      const initFabIconSvg = ICONS[this.config.fabIcon] || ICONS.allyada;
      wrapper.className = `allyada-wrapper pos-${initHPos} vpos-${initVPos}`;
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
          <span class="fab-icon" id="allyada-fab-icon-span">${initFabIconSvg}</span>
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
            <div class="header-brand-group" id="allyada-brand-logo-btn" style="cursor: pointer;" title="Allyada Acessibilidade">
              <div class="brand-badge-icon" id="allyada-header-icon-box" aria-hidden="true">${initFabIconSvg}</div>
              <div class="brand-text">
                <div class="title-row">
                  <h2 id="allyada-title">Allyada</h2>
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

          <!-- ABA 1: INÍCIO (ORGANIZADA POR PRIORIDADE DE ACESSIBILIDADE E SEM DUPLICAÇÃO) -->
          <div class="drawer-tab-content active" id="tab-content-foryou" role="tabpanel" aria-labelledby="tab-btn-foryou">
            
            <!-- Busca Rápida no Topo -->
            <div class="search-box-wrapper">
              <div class="search-input-box">
                <span class="search-icon-svg">${ICONS.search}</span>
                <input type="text" id="allyada-search-input" class="search-input-field" placeholder="Buscar recurso (ex: voz, libras, fonte, cor)..." aria-label="Buscar recursos de acessibilidade">
                <button type="button" class="search-clear-btn" id="btn-search-clear" style="display:none;" aria-label="Limpar pesquisa">&times;</button>
              </div>
            </div>

            <!-- Controles ocultos legados para manter 100% de compatibilidade com integrações/testes -->
            <div id="tts-quick-controls" style="display: none;" aria-hidden="true">
              <span id="q-tts-status-text"></span>
              <button type="button" id="btn-q-tts-play-pause"><span id="q-tts-play-icon"></span><strong id="q-tts-play-label">Pausar</strong></button>
              <button type="button" id="btn-q-tts-stop"></button>
              <button type="button" id="q-rate-075" data-rate="0.75"></button>
              <button type="button" id="q-rate-100" data-rate="1"></button>
              <button type="button" id="q-rate-125" data-rate="1.25"></button>
              <button type="button" id="q-rate-150" data-rate="1.5"></button>
              <button type="button" id="q-rate-200" data-rate="2"></button>
              <select id="q-select-tts-voice"><option value="">Automática</option></select>
            </div>

            <div class="tab-scroll-body">

              <!-- 1. PERFIS PRONTOS DE 1 CLIQUE (NO TOPO, EM 2 COLUNAS COMPACTAS) -->
              <section class="menu-section" data-section="profiles">
                <div class="section-heading">
                  <h3>Perfis Prontos (1 Clique)</h3>
                  <span class="pill-badge">Combinações</span>
                </div>
                
                <div class="profiles-grid">
                  <button type="button" class="profile-card" id="profile-zoom" aria-pressed="false" title="Baixa Visão: Texto ampliado (130%), contraste escuro, links destacados e cursor grande">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.glasses}</div>
                      <span class="card-tag">Baixa Visão</span>
                    </div>
                    <strong class="card-heading">Ampliação</strong>
                    <p class="card-subtext">Letra 130%, fundo escuro e cursor grande.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-reading" aria-pressed="false" title="Leitura Fácil & Dislexia: Fonte Lexend, linhas espaçadas e alinhamento à esquerda">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.book}</div>
                      <span class="card-tag">Dislexia</span>
                    </div>
                    <strong class="card-heading">Leitura Fácil</strong>
                    <p class="card-subtext">Fonte Lexend e linhas espaçadas.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-focus" aria-pressed="false" title="Foco & TDAH: Régua de leitura, sem animações e espaçamento confortável">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.brain}</div>
                      <span class="card-tag">TDAH / Foco</span>
                    </div>
                    <strong class="card-heading">Modo Foco</strong>
                    <p class="card-subtext">Régua guia e pausa distrações.</p>
                  </button>

                  <button type="button" class="profile-card" id="profile-motion" aria-pressed="false" title="Sem Movimento: Pausa animações, vídeos e transições que causam desconforto">
                    <div class="card-top-row">
                      <div class="card-icon-bubble">${ICONS.zap}</div>
                      <span class="card-tag">Calma</span>
                    </div>
                    <strong class="card-heading">Sem Movimento</strong>
                    <p class="card-subtext">Bloqueia animações e tontura.</p>
                  </button>

                  <button type="button" class="profile-card profile-card-wide" id="profile-colors" aria-pressed="false" title="Daltonismo & Cores: Realça links e ativa filtros de percepção de cores">
                    <div class="card-icon-bubble">${ICONS.eye}</div>
                    <div class="profile-wide-info">
                      <div style="display:flex; align-items:center; gap:6px;">
                        <strong class="card-heading" style="padding-right:0;">Modo Cores</strong>
                        <span class="card-tag">Daltonismo</span>
                      </div>
                      <p class="card-subtext">Deuteranopia, Protanopia e Tritanopia.</p>
                    </div>
                  </button>
                </div>

                <!-- Seletor rápido quando o Perfil Cores é clicado -->
                <div class="sub-selector-box" id="colorblind-selector-box" style="display: none;">
                  <span class="sub-selector-title">Escolha o filtro de daltonismo:</span>
                  <div class="segmented-control">
                    <button type="button" class="seg-btn active" data-type="deuteranopia" id="cb-deuteranopia">Deuteranopia</button>
                    <button type="button" class="seg-btn" data-type="protanopia" id="cb-protanopia">Protanopia</button>
                    <button type="button" class="seg-btn" data-type="tritanopia" id="cb-tritanopia">Tritanopia</button>
                  </div>
                </div>
              </section>

              <!-- 2. GUIA DE FOCO, TECLADO & MOUSE -->
              <section class="menu-section" data-section="navigation">
                <div class="section-heading">
                  <h3>Guia de Foco, Teclado & Mouse</h3>
                </div>

                <div class="tools-grid-2col">
                  <button type="button" class="tool-card" id="card-reading-ruler" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.ruler}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Régua Guia</strong>
                      <span class="tool-desc">Linha de leitura</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-reading-mask" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.eye}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Máscara Foco</strong>
                      <span class="tool-desc">Destaca o trecho</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-highlight-links" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.link}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Destacar Links</strong>
                      <span class="tool-desc">Realça cliques</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-enhanced-focus" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.target}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Foco Teclado</strong>
                      <span class="tool-desc">Borda no Tab</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-virtual-keyboard" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.keyboard}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Teclado Virtual</strong>
                      <span class="tool-desc">Digitar na tela</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-stop-animations" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.pause}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Sem Animação</strong>
                      <span class="tool-desc">Pausa efeitos</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>

                <div class="control-box mt-2">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Tamanho e Cor do Cursor</strong>
                      <span class="control-val" id="cursor-size-label">Normal</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-cursor-normal">Normal</button>
                    <button type="button" class="seg-btn" id="btn-cursor-large">Grande (44px)</button>
                    <button type="button" class="seg-btn" id="btn-cursor-xlarge">Extra (60px)</button>
                  </div>
                  
                  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-subtle);">
                    <div class="setting-text mb-2" style="display: flex; justify-content: space-between; align-items: center;">
                      <span class="control-val" style="display: block; font-size: 12.5px; font-weight: 600;">Cor do Cursor</span>
                      <span id="cursor-color-hex" style="font-size: 12px; color: #64748b; font-family: monospace;">#000000</span>
                    </div>
                    <div class="color-presets" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                      <button type="button" class="color-preset-btn" data-color="#000000" aria-label="Preto" title="Preto" style="width: 28px; height: 28px; border-radius: 50%; background: #000000; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#7956c2" aria-label="Roxo" title="Roxo" style="width: 28px; height: 28px; border-radius: 50%; background: #7956c2; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#ffffff" aria-label="Branco" title="Branco" style="width: 28px; height: 28px; border-radius: 50%; background: #ffffff; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#facc15" aria-label="Amarelo" title="Amarelo" style="width: 28px; height: 28px; border-radius: 50%; background: #facc15; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#ef4444" aria-label="Vermelho" title="Vermelho" style="width: 28px; height: 28px; border-radius: 50%; background: #ef4444; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#0284c7" aria-label="Azul" title="Azul" style="width: 28px; height: 28px; border-radius: 50%; background: #0284c7; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      <button type="button" class="color-preset-btn" data-color="#16a34a" aria-label="Verde" title="Verde" style="width: 28px; height: 28px; border-radius: 50%; background: #16a34a; border: 2px solid #cbd5e1; cursor: pointer;"></button>
                      
                      <label class="custom-color-picker-label" title="Escolher qualquer cor personalizada" style="position: relative; width: 28px; height: 28px; border-radius: 50%; background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red); display: inline-flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #cbd5e1; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">
                        <input type="color" id="input-cursor-custom-color" value="#000000" aria-label="Escolher qualquer cor personalizada para o cursor" style="opacity: 0; position: absolute; inset: 0; width: 100%; height: 100%; cursor: pointer;">
                        <span style="font-size: 11px; font-weight: 900; color: #fff; text-shadow: 0 0 3px #000; pointer-events: none;">+</span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 3. VOZ, LIBRAS & ESTRUTURA -->
              <section class="menu-section" data-section="assistive">
                <div class="section-heading">
                  <h3>Voz, Libras & Estrutura</h3>
                  <span class="pill-badge">Essenciais</span>
                </div>

                <div class="tools-grid">
                  <button type="button" class="tool-card full-width" id="card-tts-toggle" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.sound}</div>
                    <div class="tool-info">
                      <strong class="tool-title" id="card-tts-title">Ouvir Página</strong>
                      <span class="tool-desc" id="card-tts-desc">Leitura do site com voz humana natural</span>
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
                    <div class="tts-voice-row">
                      <label class="speed-label" for="select-tts-voice">Timbre de Voz (Humana / Natural):</label>
                      <select id="select-tts-voice" class="allyada-select tts-voice-select" aria-label="Escolher voz de leitura">
                        <option value="">✨ Automática (Voz mais natural)</option>
                      </select>
                    </div>
                  </div>

                  <button type="button" class="tool-card full-width" id="card-image-inspector" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.image}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Descrever Imagens (IA)</strong>
                      <span class="tool-desc">Mostra e lê a descrição ao passar o mouse nas imagens</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="vlibras-banner-card" id="card-vlibras-toggle" aria-pressed="false" style="width: 100%;">
                    <div class="vlibras-icon-box">${ICONS.hands}</div>
                    <div class="vlibras-info">
                      <strong>Língua de Sinais (Libras)</strong>
                      <span id="card-vlibras-desc">Ativar tradutor 3D • Intérprete: Hosana</span>
                    </div>
                    <div class="vlibras-status-pill" id="vlibras-status-pill">Desativado</div>
                  </button>
                </div>

                <div class="structure-nav-group mt-2">
                  <button type="button" class="btn-action-tile" id="btn-toggle-headings" aria-expanded="false">
                    <span class="tile-icon-action">${ICONS.headings}</span>
                    <div class="tile-info-action" style="flex:1;">
                      <strong>Estrutura da Página</strong>
                      <span id="headings-count-summary">Navegar por Títulos, Regiões e Links</span>
                    </div>
                    <span class="pill-badge" style="font-size:11px;">Abrir</span>
                  </button>

                  <button type="button" class="btn-action-tile" id="btn-skip-to-main">
                    <span class="tile-icon-action">${ICONS.skip}</span>
                    <div class="tile-info-action">
                      <strong>Pular para o Conteúdo Principal</strong>
                      <span>Vai direto ao texto principal da página</span>
                    </div>
                  </button>
                </div>
              </section>

              <!-- 4. TEXTO & LEITURA -->
              <section class="menu-section" data-section="typography">
                <div class="section-heading">
                  <h3>Texto & Leitura</h3>
                </div>

                <div class="control-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Tamanho da Letra</strong>
                      <span class="control-val" id="font-size-indicator">Normal (100%)</span>
                    </div>
                    <div class="stepper-actions">
                      <button type="button" class="btn-step" id="btn-font-decrease" aria-label="Diminuir tamanho da letra">-</button>
                      <button type="button" class="btn-step" id="btn-font-increase" aria-label="Aumentar tamanho da letra">+</button>
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
                  <input type="hidden" id="slider-font-size" value="0">
                </div>

                <div class="control-box" id="text-align-control-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Alinhamento do Texto</strong>
                      <span class="control-val" id="text-align-indicator">Padrão</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2" role="group" aria-label="Escolher alinhamento do texto">
                    <button type="button" class="seg-btn active" id="btn-align-normal" data-align="normal" title="Alinhamento original do site">Padrão</button>
                    <button type="button" class="seg-btn" id="btn-align-left" data-align="left" title="Alinhar texto à esquerda">${ICONS.alignLeft}<span>Esq.</span></button>
                    <button type="button" class="seg-btn" id="btn-align-center" data-align="center" title="Centralizar texto">${ICONS.alignCenter}<span>Centro</span></button>
                    <button type="button" class="seg-btn" id="btn-align-right" data-align="right" title="Alinhar texto à direita">${ICONS.alignRight}<span>Dir.</span></button>
                    <button type="button" class="seg-btn" id="btn-align-justify" data-align="justify" title="Justificar texto">${ICONS.alignJustify}<span>Justif.</span></button>
                  </div>
                </div>

                <div class="control-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Distância entre Linhas</strong>
                      <span class="control-val" id="line-height-indicator">Normal</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-lh-0">Normal</button>
                    <button type="button" class="seg-btn" id="btn-lh-1">Confortável</button>
                    <button type="button" class="seg-btn" id="btn-lh-2">Amplo</button>
                  </div>
                </div>
                
                <div class="control-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Distância entre Letras</strong>
                      <span class="control-val" id="letter-spacing-indicator">Normal</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-ls-0">Normal</button>
                    <button type="button" class="seg-btn" id="btn-ls-1">Médio</button>
                    <button type="button" class="seg-btn" id="btn-ls-2">Amplo</button>
                  </div>
                </div>

                <div class="tools-grid mt-2">
                  <button type="button" class="tool-card full-width" id="card-dyslexic-font" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.book}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Fonte para Dislexia (Lexend)</strong>
                      <span class="tool-desc">Letras mais abertas e fáceis de distinguir na leitura</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-wcag-spacing" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.type}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Texto Arejado (Leitura Fácil)</strong>
                      <span class="tool-desc">Amplia o respiro entre linhas, letras e parágrafos</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card full-width" id="card-word-spacing" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.type}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Separar Palavras</strong>
                      <span class="tool-desc">Aumenta o espaço entre cada palavra da frase</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>
              </section>

              <!-- 5. CORES & CONTRASTE -->
              <section class="menu-section" data-section="colors">
                <div class="section-heading">
                  <h3>Cores & Contraste</h3>
                </div>

                <div class="tools-grid-2col">
                  <button type="button" class="tool-card" id="card-contrast-dark" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.moon}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Modo Escuro</strong>
                      <span class="tool-desc">Fundo escuro</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-contrast-light" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.sun}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Modo Claro</strong>
                      <span class="tool-desc">Fundo branco</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-contrast-monochrome" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.contrast}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Tons de Cinza</strong>
                      <span class="tool-desc">Sem cores</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>

                  <button type="button" class="tool-card" id="card-contrast-invert" aria-pressed="false">
                    <div class="tool-icon-box">${ICONS.refresh}</div>
                    <div class="tool-info">
                      <strong class="tool-title">Inverter Cores</strong>
                      <span class="tool-desc">Alto contraste</span>
                    </div>
                    <div class="toggle-indicator"></div>
                  </button>
                </div>

                <!-- Personalização de Cores: Títulos, Texto e Fundo -->
                <div class="control-box mt-2" id="custom-colors-box">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Personalizar Cores da Página</strong>
                      <span class="control-val" id="custom-colors-status">Títulos, Texto e Fundo</span>
                    </div>
                    <button type="button" class="btn-mini-reset" id="btn-reset-custom-colors" style="display:none;" title="Restaurar cores originais da página">Restaurar</button>
                  </div>

                  <!-- 1. Cor dos Títulos -->
                  <div class="custom-color-group mt-2">
                    <div class="custom-color-row-header">
                      <span class="custom-color-label">Cor dos Títulos</span>
                      <span class="custom-color-hex" id="hex-custom-title">Padrão</span>
                    </div>
                    <div class="custom-color-swatches">
                      <button type="button" class="custom-swatch-btn" data-target="title" data-color="#7956c2" aria-label="Título Roxo" title="Roxo" style="background:#7956c2;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="title" data-color="#1e293b" aria-label="Título Grafite" title="Grafite Escuro" style="background:#1e293b;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="title" data-color="#0284c7" aria-label="Título Azul" title="Azul" style="background:#0284c7;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="title" data-color="#15803d" aria-label="Título Verde" title="Verde" style="background:#15803d;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="title" data-color="#b45309" aria-label="Título Âmbar" title="Âmbar" style="background:#b45309;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="title" data-color="#dc2626" aria-label="Título Vermelho" title="Vermelho" style="background:#dc2626;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="title" data-color="#fde047" aria-label="Título Amarelo Claro" title="Amarelo Alto Contraste" style="background:#fde047;"></button>
                      <label class="custom-color-picker-label swatch-picker" title="Escolher cor livre para Títulos">
                        <input type="color" id="input-custom-title-color" value="#7956c2" aria-label="Escolher cor personalizada para títulos">
                        <span>+</span>
                      </label>
                    </div>
                  </div>

                  <!-- 2. Cor do Texto -->
                  <div class="custom-color-group mt-2">
                    <div class="custom-color-row-header">
                      <span class="custom-color-label">Cor do Texto</span>
                      <span class="custom-color-hex" id="hex-custom-text">Padrão</span>
                    </div>
                    <div class="custom-color-swatches">
                      <button type="button" class="custom-swatch-btn" data-target="text" data-color="#0f172a" aria-label="Texto Preto Suave" title="Preto Suave" style="background:#0f172a;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="text" data-color="#1e3a8a" aria-label="Texto Azul Marinho" title="Azul Marinho" style="background:#1e3a8a;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="text" data-color="#14532d" aria-label="Texto Verde Escuro" title="Verde Escuro" style="background:#14532d;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="text" data-color="#4c1d95" aria-label="Texto Roxo Escuro" title="Roxo Escuro" style="background:#4c1d95;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="text" data-color="#78350f" aria-label="Texto Sépia" title="Marrom Sépia" style="background:#78350f;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="text" data-color="#ffffff" aria-label="Texto Branco" title="Branco" style="background:#ffffff;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="text" data-color="#fef08a" aria-label="Texto Amarelo Pastel" title="Amarelo Pastel" style="background:#fef08a;"></button>
                      <label class="custom-color-picker-label swatch-picker" title="Escolher cor livre para Texto">
                        <input type="color" id="input-custom-text-color" value="#0f172a" aria-label="Escolher cor personalizada para o texto">
                        <span>+</span>
                      </label>
                    </div>
                  </div>

                  <!-- 3. Cor do Fundo -->
                  <div class="custom-color-group mt-2">
                    <div class="custom-color-row-header">
                      <span class="custom-color-label">Cor do Fundo</span>
                      <span class="custom-color-hex" id="hex-custom-bg">Padrão</span>
                    </div>
                    <div class="custom-color-swatches">
                      <button type="button" class="custom-swatch-btn" data-target="bg" data-color="#ffffff" aria-label="Fundo Branco" title="Branco" style="background:#ffffff;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="bg" data-color="#fdf6e3" aria-label="Fundo Creme Sépia" title="Creme Conforto Visual (Irlen)" style="background:#fdf6e3;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="bg" data-color="#f0fdf4" aria-label="Fundo Verde Pastel" title="Verde Pastel Suave" style="background:#f0fdf4;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="bg" data-color="#eff6ff" aria-label="Fundo Azul Pastel" title="Azul Pastel Suave" style="background:#eff6ff;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="bg" data-color="#f5f3ff" aria-label="Fundo Lilás Pastel" title="Lilás Pastel Suave" style="background:#f5f3ff;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="bg" data-color="#18181b" aria-label="Fundo Cinza Escuro" title="Cinza Noturno" style="background:#18181b;"></button>
                      <button type="button" class="custom-swatch-btn" data-target="bg" data-color="#0f172a" aria-label="Fundo Azul Noturno" title="Azul Noturno Profundo" style="background:#0f172a;"></button>
                      <label class="custom-color-picker-label swatch-picker" title="Escolher cor livre para Fundo">
                        <input type="color" id="input-custom-bg-color" value="#fdf6e3" aria-label="Escolher cor personalizada para o fundo">
                        <span>+</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="control-box mt-2">
                  <div class="control-box-header">
                    <div>
                      <strong class="control-title">Filtro para Daltonismo</strong>
                      <span class="control-val" id="colorblind-active-label">Padrão</span>
                    </div>
                  </div>
                  <div class="segmented-control mt-2">
                    <button type="button" class="seg-btn active" id="btn-cb-none">Padrão</button>
                    <button type="button" class="seg-btn" id="btn-cb-deuteranopia" title="Dificuldade com tons de verde">Deuteranopia</button>
                    <button type="button" class="seg-btn" id="btn-cb-protanopia" title="Dificuldade com tons de vermelho">Protanopia</button>
                    <button type="button" class="seg-btn" id="btn-cb-tritanopia" title="Dificuldade com azul e amarelo">Tritanopia</button>
                  </div>
                </div>
              </section>

              <!-- 6. PERSONALIZAÇÃO DO INTÉRPRETE VLIBRAS (NO FINAL) -->
              <section class="menu-section" data-section="vlibras-avatar">
                <div class="control-box" id="vlibras-avatar-box">
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

              <!-- Aparência do Painel (Para o Usuário do Site) -->
              <section class="menu-section">
                <div class="section-heading">
                  <h3>Aparência do Painel</h3>
                </div>

                <div class="setting-item-row" style="flex-direction: column; align-items: stretch; gap: 10px; margin-bottom: 10px;">
                  <div>
                    <span style="display:block; font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 5px;">Lado da Página:</span>
                    <div class="segmented-control" role="group" aria-label="Lado do plugin na tela">
                      <button type="button" class="seg-btn active" id="btn-hpos-right" data-hpos="right">Canto Direito</button>
                      <button type="button" class="seg-btn" id="btn-hpos-left" data-hpos="left">Canto Esquerdo</button>
                    </div>
                  </div>
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

        <!-- Caixa Flutuante de Estrutura da Página (Títulos, Regiões e Links — Estilo Rybená) -->
        <div class="allyada-structure-modal" id="allyada-structure-modal" role="dialog" aria-modal="false" aria-labelledby="allyada-structure-title" aria-hidden="true" style="display:none;">
          <div class="structure-modal-header">
            <div class="structure-title-group">
              <span class="structure-header-icon">${ICONS.headings}</span>
              <div>
                <h3 id="allyada-structure-title">Estrutura da Página</h3>
                <span class="structure-subtitle" id="structure-modal-count">Navegação rápida por elementos</span>
              </div>
            </div>
            <div class="structure-header-actions">
              <button type="button" class="btn-structure-back" id="btn-back-structure-modal" aria-label="Voltar para o painel principal do Allyada" title="Voltar para o painel principal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                <span>Voltar</span>
              </button>
              <button type="button" class="btn-icon-close" id="btn-close-structure-modal" aria-label="Fechar Estrutura da Página" title="Fechar">
                ${ICONS.close}
              </button>
            </div>
          </div>

          <div class="structure-tabs" role="tablist" aria-label="Categorias da estrutura da página">
            <button type="button" class="struct-tab-btn active" id="struct-tab-headings" data-struct-tab="headings" role="tab" aria-selected="true">Títulos</button>
            <button type="button" class="struct-tab-btn" id="struct-tab-landmarks" data-struct-tab="landmarks" role="tab" aria-selected="false">Regiões</button>
            <button type="button" class="struct-tab-btn" id="struct-tab-links" data-struct-tab="links" role="tab" aria-selected="false">Links</button>
          </div>

          <div class="structure-search-row">
            <div class="search-input-box">
              <span class="search-icon-svg">${ICONS.search}</span>
              <input type="text" id="struct-search-input" class="search-input-field" placeholder="Filtrar itens da página..." aria-label="Filtrar itens da estrutura da página">
            </div>
          </div>

          <div class="structure-modal-body" id="headings-list-container">
            <ul class="headings-list-items" id="headings-items-ul"></ul>
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

      

      // 3. Mover Doca (Esquerda / Direita) e Altura nos Cantos (Centralizado / Fim da Página)
      const dockBtn = root.getElementById('btn-toggle-dock');
      if (dockBtn) {
        dockBtn.addEventListener('click', () => this.toggleDockPosition());
      }
      const vposBtn = root.getElementById('btn-toggle-vpos');
      if (vposBtn) {
        vposBtn.addEventListener('click', () => {
          const cur = this.state.verticalPosition || this.config.verticalPosition || 'bottom';
          const next = (cur === 'middle') ? 'bottom' : 'middle';
          this.setVerticalPosition(next);
        });
      }

      // 4. Busca Instantânea nas Ferramentas (Aba Principal)
      const searchInput = root.getElementById('allyada-search-input');
      const searchClearBtn = root.getElementById('btn-search-clear');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const query = e.target.value.toLowerCase().trim();
          if (searchClearBtn) searchClearBtn.style.display = query ? 'flex' : 'none';

          const cards = root.querySelectorAll('#tab-content-foryou .tool-card, #tab-content-foryou .control-box, #tab-content-foryou .structure-nav-group, #tab-content-foryou .vlibras-banner-card, #tab-content-foryou .profile-card');
          cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const match = !query || text.includes(query);
            card.style.display = match ? '' : 'none';
          });

          root.querySelectorAll('#tab-content-foryou .menu-section').forEach(sec => {
            const visible = sec.querySelectorAll('.tool-card:not([style*="display: none"]), .control-box:not([style*="display: none"]), .structure-nav-group:not([style*="display: none"]), .vlibras-banner-card:not([style*="display: none"]), .profile-card:not([style*="display: none"])');
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
              verticalPosition: this.state.verticalPosition || this.config.verticalPosition || 'bottom',
              dockPosition: this.state.dockPosition || this.config.position || 'right',
              uiScale: this.state.uiScale || '1',
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
        this.state.cursorColor = '#ffffff';
        this.state.highlightLinks = true;
      });

      bindBoth('profile-reading', null, 'reading', () => {
        this.state.dyslexicFont = true;
        this.state.lineHeightLevel = 1;
        this.state.textAlignLeft = true;
        this.state.textAlign = 'left';
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

      // Alinhamento de Texto Completo (Padrão, Esquerda, Centro, Direita, Justificado)
      ['normal', 'left', 'center', 'right', 'justify'].forEach(align => {
        const btn = root.getElementById(`btn-align-${align}`);
        if (!btn) return;
        btn.addEventListener('click', () => {
          this.state.textAlign = align;
          this.state.textAlignLeft = (align === 'left');
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
      bindToggle('card-dyslexic-font', 'dyslexicFont');
      bindToggle('card-image-inspector', 'imageInspector');

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

      // Personalização de Cores: Títulos, Texto e Fundo
      const setCustomPageColor = (target, color, toggleIfSame = false) => {
        const keyMap = { title: 'customTitleColor', text: 'customTextColor', bg: 'customBgColor' };
        const stateKey = keyMap[target];
        if (!stateKey) return;
        const current = (this.state[stateKey] || '').toLowerCase();
        if (toggleIfSame && current === (color || '').toLowerCase()) {
          this.state[stateKey] = '';
        } else {
          this.state[stateKey] = color;
        }
        this.state.activeProfile = null;
        this.syncStateAndUI();
      };

      root.querySelectorAll('.custom-swatch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          setCustomPageColor(btn.dataset.target, btn.dataset.color, true);
        });
      });

      const inputCustomTitle = root.getElementById('input-custom-title-color');
      if (inputCustomTitle) {
        inputCustomTitle.addEventListener('input', (e) => setCustomPageColor('title', e.target.value, false));
      }
      const inputCustomText = root.getElementById('input-custom-text-color');
      if (inputCustomText) {
        inputCustomText.addEventListener('input', (e) => setCustomPageColor('text', e.target.value, false));
      }
      const inputCustomBg = root.getElementById('input-custom-bg-color');
      if (inputCustomBg) {
        inputCustomBg.addEventListener('input', (e) => setCustomPageColor('bg', e.target.value, false));
      }

      const btnResetCustomColors = root.getElementById('btn-reset-custom-colors');
      if (btnResetCustomColors) {
        btnResetCustomColors.addEventListener('click', () => {
          this.state.customTitleColor = '';
          this.state.customTextColor = '';
          this.state.customBgColor = '';
          this.syncStateAndUI();
        });
      }

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

      // Estrutura da Página (Caixa Flutuante com Títulos, Regiões e Links)
      const btnHeadings = root.getElementById('btn-toggle-headings');
      if (btnHeadings) {
        btnHeadings.addEventListener('click', () => this.toggleHeadingsList());
      }

      const btnBackStruct = root.getElementById('btn-back-structure-modal');
      if (btnBackStruct) {
        btnBackStruct.addEventListener('click', () => {
          this.closeStructureModal();
          this.openPanel();
        });
      }

      const btnCloseStruct = root.getElementById('btn-close-structure-modal');
      if (btnCloseStruct) {
        btnCloseStruct.addEventListener('click', () => this.closeStructureModal());
      }

      ['headings', 'landmarks', 'links'].forEach(tabKey => {
        const tabBtn = root.getElementById(`struct-tab-${tabKey}`);
        if (tabBtn) {
          tabBtn.addEventListener('click', () => this.switchStructureTab(tabKey));
        }
      });

      const structSearch = root.getElementById('struct-search-input');
      if (structSearch) {
        structSearch.addEventListener('input', () => this.renderStructureList());
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

      ['select-tts-voice', 'q-select-tts-voice'].forEach(selId => {
        const sel = root.getElementById(selId);
        if (sel) {
          sel.addEventListener('change', (e) => {
            this.changeSpeechVoice(e.target.value);
          });
        }
      });

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
      // 16. Configurações de Aparência e Posição (Tamanho e Posição nos Cantos ✨ Premium)
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
      ['bottom', 'middle', 'top'].forEach(vpos => {
        const btnV = root.getElementById(`btn-vpos-${vpos}`);
        if (btnV) {
          btnV.addEventListener('click', () => this.setVerticalPosition(vpos));
        }
      });
      ['right', 'left'].forEach(hpos => {
        const btnH = root.getElementById(`btn-hpos-${hpos}`);
        if (btnH) {
          btnH.addEventListener('click', () => this.setDockPosition(hpos));
        }
      });

      // Desbloqueio do Modo Studio PRO (Exclusivo do Cliente/Dono do Site: 5 cliques na logo Allyada)
      const brandLogoBtn = root.getElementById('allyada-brand-logo-btn');
      if (brandLogoBtn) {
        this._adminClickCount = 0;
        this._adminClickTimer = null;
        brandLogoBtn.addEventListener('click', () => {
          this._adminClickCount = (this._adminClickCount || 0) + 1;
          clearTimeout(this._adminClickTimer);
          this._adminClickTimer = setTimeout(() => { this._adminClickCount = 0; }, 1800);
          if (this._adminClickCount >= 5) {
            this._adminClickCount = 0;
            this.openAdmin();
          }
        });
      }

      // Controles do Studio PRO (Ícone, Cor da Marca, Uniforme 3D VLibras e Gerador de Script)
      root.querySelectorAll('.btn-studio-icon').forEach(btn => {
        btn.addEventListener('click', () => {
          this.setFabIcon(btn.getAttribute('data-icon'));
        });
      });

      root.querySelectorAll('.studio-brand-swatch').forEach(btn => {
        btn.addEventListener('click', () => {
          this.setBrandColor(btn.getAttribute('data-brand-color'));
        });
      });

      const brandColorInput = root.getElementById('input-brand-custom-color');
      if (brandColorInput) {
        brandColorInput.addEventListener('input', (e) => {
          this.setBrandColor(e.target.value);
        });
      }

      const vlibrasShirtInput = root.getElementById('input-vlibras-shirt');
      const vlibrasPantsInput = root.getElementById('input-vlibras-pants');
      const vlibrasLogoInput = root.getElementById('input-vlibras-logo');
      const handleUniformChange = () => {
        this.setVLibrasUniform({
          shirt: vlibrasShirtInput ? vlibrasShirtInput.value : this.config.vlibrasShirtColor,
          pants: vlibrasPantsInput ? vlibrasPantsInput.value : this.config.vlibrasPantsColor,
          logo: vlibrasLogoInput ? vlibrasLogoInput.value.trim() : this.config.vlibrasLogoUrl
        });
      };
      if (vlibrasShirtInput) vlibrasShirtInput.addEventListener('input', handleUniformChange);
      if (vlibrasPantsInput) vlibrasPantsInput.addEventListener('input', handleUniformChange);
      if (vlibrasLogoInput) vlibrasLogoInput.addEventListener('change', handleUniformChange);

      const btnCopyScript = root.getElementById('btn-copy-client-pro-script');
      if (btnCopyScript) {
        btnCopyScript.addEventListener('click', () => {
          const domain = (window.location && window.location.hostname) ? window.location.hostname : 'seudominio.com.br';
          const color = this.config.primaryColor || '#7956c2';
          const icon = this.config.fabIcon || 'allyada';
          const vpos = this.state.verticalPosition || this.config.verticalPosition || 'bottom';
          const hpos = this.state.dockPosition || this.config.position || 'right';
          const shirt = this.config.vlibrasShirtColor || color;
          const pants = this.config.vlibrasPantsColor || '#201E62';
          const logoAttr = this.config.vlibrasLogoUrl ? `\n  data-vlibras-logo="${this.config.vlibrasLogoUrl}"` : '';
          const scriptCode = `<script src="https://cdn.allyada.com.br/allyada.min.js"\n  data-domain="${domain}"\n  data-color="${color}"\n  data-icon="${icon}"\n  data-vpos="${vpos}"\n  data-position="${hpos}"\n  data-vlibras-shirt="${shirt}"\n  data-vlibras-pants="${pants}"${logoAttr}\n  defer></script>`;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(scriptCode).catch(() => {});
          }
          const origHtml = btnCopyScript.innerHTML;
          btnCopyScript.innerHTML = '<span>✅ Código &lt;script&gt; PRO copiado!</span>';
          setTimeout(() => { btnCopyScript.innerHTML = origHtml; }, 2600);
          this.announce('Código de instalação PRO copiado para a área de transferência');
        });
      }

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
      const isDarkPage = this.state.contrast === 'dark' || ['#18181b', '#0f172a', '#000000', '#121212'].includes((this.state.customBgColor || '').toLowerCase());
      let rawColor = (this.state.cursorColor || '#000000').trim();
      if (isDarkPage && rawColor.toLowerCase() === '#000000') {
        rawColor = '#ffffff';
      }
      const cColor = encodeURIComponent(rawColor);
      const isLightCursor = ['#ffffff', '#fff', '#facc15', '#fef08a', '#eab308'].includes(rawColor.toLowerCase());
      const strokeAttr = isLightCursor
        ? " stroke='%230f172a' stroke-width='1.3' stroke-linejoin='round'"
        : " stroke='%23ffffff' stroke-width='1.3' stroke-linejoin='round'";
      const pathD = 'M2 1.5V21.5L7.6 15.9L11.2 22.8L14.3 21.2L10.7 14.3H18.5L2 1.5Z';

      let hostCss = '';
      let shadowCss = '';

      if (this.state.cursorSize === 'large') {
        const uri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24'%3E%3Cpath fill='${cColor}'${strokeAttr} d='${pathD}'/%3E%3C/svg%3E") 4 2, auto`;
        hostCss += `html.ally-cursor-large, html.ally-cursor-large * { cursor: ${uri} !important; }\n`;
        shadowCss += `:host, :host * { cursor: ${uri} !important; }\n`;
      } else if (this.state.cursorSize === 'xlarge') {
        const uri = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 24 24'%3E%3Cpath fill='${cColor}'${strokeAttr} d='${pathD}'/%3E%3C/svg%3E") 5 3, auto`;
        hostCss += `html.ally-cursor-xlarge, html.ally-cursor-xlarge * { cursor: ${uri} !important; }\n`;
        shadowCss += `:host, :host * { cursor: ${uri} !important; }\n`;
      }

      // Cores Personalizadas de Fundo, Texto e Títulos (Estilo Rybená)
      if (this.state.customBgColor) {
        const bg = this.state.customBgColor;
        hostCss += `
          html.ally-custom-bg,
          html.ally-custom-bg body,
          html.ally-custom-bg main,
          html.ally-custom-bg article,
          html.ally-custom-bg section,
          html.ally-custom-bg header,
          html.ally-custom-bg nav,
          html.ally-custom-bg footer,
          html.ally-custom-bg aside,
          html.ally-custom-bg [class*="card"]:not(#allyada-root *):not([vw] *),
          html.ally-custom-bg [class*="panel"]:not(#allyada-root *):not([vw] *),
          html.ally-custom-bg [class*="container"]:not(#allyada-root *):not([vw] *),
          html.ally-custom-bg [class*="wrapper"]:not(#allyada-root *):not([vw] *),
          html.ally-custom-bg [class*="hero"]:not(#allyada-root *):not([vw] *) {
            background-color: ${bg} !important;
            background-image: none !important;
          }
        `;
      }
      if (this.state.customTextColor) {
        const txt = this.state.customTextColor;
        hostCss += `
          html.ally-custom-text body,
          html.ally-custom-text :is(p, span, li, a, label, td, th, blockquote, dd, dt, figcaption, strong, em, b, i, small):not(h1):not(h2):not(h3):not(h4):not(h5):not(h6):not(#allyada-root *):not([vw] *):not([data-allyada-ignore] *) {
            color: ${txt} !important;
          }
        `;
      }
      if (this.state.customTitleColor) {
        const ttl = this.state.customTitleColor;
        hostCss += `
          html.ally-custom-title :is(h1, h2, h3, h4, h5, h6, [role="heading"], h1 *, h2 *, h3 *, h4 *, h5 *, h6 *):not(#allyada-root *):not([vw] *):not([data-allyada-ignore] *) {
            color: ${ttl} !important;
          }
        `;
      }

      return { hostCss, shadowCss };
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

    /**
     * Abre/fecha a Caixa Flutuante de Estrutura da Página (Títulos, Regiões e Links)
     */
    toggleHeadingsList() {
      if (this.isStructureOpen) {
        this.closeStructureModal();
      } else {
        this.openStructureModal('headings');
      }
    }

    openStructureModal(initialTab = 'headings') {
      const root = this.shadowRoot;
      if (!root) return;
      const modal = root.getElementById('allyada-structure-modal');
      const btnHeadings = root.getElementById('btn-toggle-headings');
      if (!modal) return;

      this.isStructureOpen = true;
      this.isStructureModalOpen = true;
      this.activeStructureTab = initialTab || 'headings';
      // Fecha o painel principal para que a caixa de Estrutura da Página fique livre sobre o site (Estilo Rybená)
      if (this.isOpen) {
        this.closePanel();
      }

      modal.style.display = 'flex';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      if (btnHeadings) btnHeadings.setAttribute('aria-expanded', 'true');

      this.switchStructureTab(this.activeStructureTab);
      setTimeout(() => {
        const searchInput = root.getElementById('struct-search-input');
        if (searchInput) searchInput.focus();
      }, 60);
    }

    closeStructureModal() {
      const root = this.shadowRoot;
      if (!root) return;
      const modal = root.getElementById('allyada-structure-modal');
      const btnHeadings = root.getElementById('btn-toggle-headings');
      this.isStructureOpen = false;
      this.isStructureModalOpen = false;
      if (modal) {
        modal.classList.remove('open');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
      if (btnHeadings) {
        btnHeadings.setAttribute('aria-expanded', 'false');
      }
    }

    switchStructureTab(tabKey) {
      this.activeStructureTab = tabKey || 'headings';
      const root = this.shadowRoot;
      if (!root) return;
      ['headings', 'landmarks', 'links'].forEach(k => {
        const btn = root.getElementById(`struct-tab-${k}`);
        if (btn) {
          const isAct = (k === this.activeStructureTab);
          btn.classList.toggle('active', isAct);
          btn.setAttribute('aria-selected', isAct ? 'true' : 'false');
        }
      });
      this.renderStructureList();
    }

    renderStructureList() {
      const root = this.shadowRoot;
      if (!root) return;
      const ul = root.getElementById('headings-items-ul');
      const countLabel = root.getElementById('structure-modal-count');
      const searchInput = root.getElementById('struct-search-input');
      if (!ul) return;

      const query = (searchInput && searchInput.value ? searchInput.value : '').toLowerCase().trim();
      ul.innerHTML = '';
      const items = [];

      const isVisibleNode = (el, win) => {
        if (!el) return false;
        if (el.closest('#allyada-root') || el.closest('[data-allyada-ignore]') || el.closest('[vw]')) return false;
        if (el.closest('[aria-hidden="true"], [hidden], [inert]')) return false;
        try {
          const cs = win.getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        } catch (err) {}
        return true;
      };

      if (this.activeStructureTab === 'headings') {
        this.getAllAccessibleDocuments().forEach(({ iframe, doc, win }) => {
          if (!doc) return;
          const docHeadings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"][aria-level]')).filter(el => isVisibleNode(el, win));
          docHeadings.forEach(h => {
            const text = (h.textContent || '').replace(/\s+/g, ' ').trim();
            if (!text) return;
            let badge = 'H2';
            if (/^H[1-6]$/i.test(h.tagName)) badge = h.tagName.toUpperCase();
            else if (h.getAttribute('aria-level')) badge = 'H' + h.getAttribute('aria-level');
            items.push({ el: h, iframe, badge, badgeClass: badge.toLowerCase(), text: (iframe ? '[Quadro] ' : '') + text });
          });
        });
      } else if (this.activeStructureTab === 'landmarks') {
        const landmarkDefs = [
          { sel: 'header, [role="banner"]', badge: 'Topo', name: 'Cabeçalho da Página' },
          { sel: 'nav, [role="navigation"]', badge: 'Menu', name: 'Menu de Navegação' },
          { sel: '[role="search"], form[role*="search" i]', badge: 'Busca', name: 'Área de Pesquisa' },
          { sel: 'main, [role="main"]', badge: 'Principal', name: 'Conteúdo Principal' },
          { sel: 'article', badge: 'Artigo', name: 'Artigo' },
          { sel: 'section[aria-label], section[aria-labelledby], section', badge: 'Seção', name: 'Seção da Página' },
          { sel: 'aside, [role="complementary"]', badge: 'Lateral', name: 'Conteúdo Complementar' },
          { sel: 'footer, [role="contentinfo"]', badge: 'Rodapé', name: 'Rodapé da Página' }
        ];
        const seen = new Set();
        this.getAllAccessibleDocuments().forEach(({ iframe, doc, win }) => {
          if (!doc) return;
          landmarkDefs.forEach(def => {
            Array.from(doc.querySelectorAll(def.sel)).forEach(el => {
              if (seen.has(el) || !isVisibleNode(el, win)) return;
              seen.add(el);
              const ariaLabel = el.getAttribute('aria-label') || '';
              const headingInside = el.querySelector('h1, h2, h3, h4');
              const headingText = headingInside ? (headingInside.textContent || '').replace(/\s+/g, ' ').trim() : '';
              const label = ariaLabel || headingText || def.name;
              items.push({ el, iframe, badge: def.badge, badgeClass: 'h1', text: (iframe ? '[Quadro] ' : '') + label });
            });
          });
        });
      } else if (this.activeStructureTab === 'links') {
        this.getAllAccessibleDocuments().forEach(({ iframe, doc, win }) => {
          if (!doc) return;
          Array.from(doc.querySelectorAll('a[href]')).forEach(a => {
            if (!isVisibleNode(a, win)) return;
            const text = (a.getAttribute('aria-label') || a.textContent || a.getAttribute('title') || a.getAttribute('href') || '').replace(/\s+/g, ' ').trim();
            if (!text) return;
            const href = a.getAttribute('href') || '';
            const isExternal = /^https?:\/\//i.test(href) && (!win.location || !href.includes(win.location.hostname));
            items.push({ el: a, iframe, badge: isExternal ? 'Externo' : 'Link', badgeClass: isExternal ? 'h2' : 'h3', text: (iframe ? '[Quadro] ' : '') + text });
          });
        });
      }

      const filtered = query ? items.filter(it => it.text.toLowerCase().includes(query) || it.badge.toLowerCase().includes(query)) : items;

      if (countLabel) {
        const tabNames = { headings: 'títulos', landmarks: 'regiões', links: 'links' };
        countLabel.textContent = `${filtered.length} ${tabNames[this.activeStructureTab] || 'itens'} encontrados`;
      }

      if (filtered.length === 0) {
        ul.innerHTML = `<li class="heading-empty-item">Nenhum item encontrado para esta categoria.</li>`;
        return;
      }

      filtered.forEach((item, idx) => {
        const li = document.createElement('li');
        li.className = 'heading-list-item';
        li.innerHTML = `
          <button type="button" class="btn-heading-target" data-heading-idx="${idx}">
            <span class="heading-level-pill ${item.badgeClass}">${this.escapeHTML(item.badge)}</span>
            <span class="heading-text-label">${this.escapeHTML(item.text.slice(0, 90))}</span>
          </button>
        `;
        li.querySelector('button').addEventListener('click', () => {
          if (item.iframe) {
            item.iframe.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          item.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (!item.el.hasAttribute('tabindex')) {
            item.el.setAttribute('tabindex', '-1');
          }
          item.el.focus();
          item.el.classList.add('allyada-heading-target-highlight');
          setTimeout(() => {
            item.el.classList.remove('allyada-heading-target-highlight');
          }, 2500);
        });
        ul.appendChild(li);
      });
    }

    /**
     * Inspetor e Descritor Inteligente de Imagens (Visão Computacional Neural + OCR + Contexto Semântico + Voz)
     */
    enableImageInspector() {
      if (this.imageInspectorActive) return;
      this.imageInspectorActive = true;
      if (!this.imageVisualAnalyzedKeys) {
        this.imageVisualAnalyzedKeys = new Set();
      }
      if (!this.imagePendingAnalyses) {
        this.imagePendingAnalyses = new Map();
      }

      // Pré-carrega em background os motores de Visão Computacional (COCO-SSD) e OCR (Tesseract.js)
      this.preloadVisionEngines();

      if (!this.imageTooltipEl) {
        const tip = document.createElement('div');
        tip.id = 'allyada-image-tooltip';
        tip.setAttribute('data-allyada-ignore', 'true');
        tip.setAttribute('role', 'status');
        tip.setAttribute('aria-live', 'polite');
        tip.style.cssText = `
          display: none;
          position: fixed;
          z-index: 2147483646;
          max-width: 370px;
          min-width: 240px;
          background: rgba(15, 23, 42, 0.96);
          color: #ffffff;
          border: 2px solid #7956c2;
          border-radius: 14px;
          padding: 12px 14px;
          box-shadow: 0 18px 38px rgba(0, 0, 0, 0.45);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13.5px;
          line-height: 1.45;
          pointer-events: auto;
          backdrop-filter: blur(10px);
        `;
        document.documentElement.appendChild(tip);
        this.imageTooltipEl = tip;
      }

      this.imgOverHandler = (e) => {
        const img = e.target && e.target.closest ? e.target.closest('img, svg[role="img"], [role="img"], figure, picture') : null;
        if (!img || img.closest('#allyada-root') || img.closest('[vw]') || img.closest('[data-allyada-ignore]')) return;
        if (this.currentInspectedImg && this.currentInspectedImg !== img) {
          this.currentInspectedImg.classList.remove('allyada-img-inspect-target');
        }
        this.currentInspectedImg = img;
        img.classList.add('allyada-img-inspect-target');

        const targetImg = this.resolveTargetImageNode(img);
        const cacheKey = this.getImageCacheKey(targetImg);
        const isAlreadyAnalyzed = this.imageVisualAnalyzedKeys && this.imageVisualAnalyzedKeys.has(cacheKey);
        const initialDesc = this.describeImageElement(img);
        const rect = img.getBoundingClientRect();

        this.showImageInspectorTooltip(img, initialDesc, rect, !isAlreadyAnalyzed);

        if (!isAlreadyAnalyzed) {
          this.analyzeImageVisualsAsync(img, (richDesc) => {
            if (this.currentInspectedImg === img) {
              const updatedRect = img.getBoundingClientRect();
              this.showImageInspectorTooltip(img, richDesc, updatedRect, false);
            }
          });
        }
      };

      this.imgOutHandler = (e) => {
        const img = e.target && e.target.closest ? e.target.closest('img, svg[role="img"], [role="img"], figure, picture') : null;
        if (!img) return;
        const related = e.relatedTarget;
        if (related && (img.contains(related) || (this.imageTooltipEl && this.imageTooltipEl.contains(related)))) return;
        img.classList.remove('allyada-img-inspect-target');
      };

      this.imgClickHandler = (e) => {
        const img = e.target && e.target.closest ? e.target.closest('img, svg[role="img"], [role="img"], figure, picture') : null;
        if (!img || img.closest('#allyada-root') || img.closest('[vw]') || img.closest('[data-allyada-ignore]')) return;
        const targetImg = this.resolveTargetImageNode(img);
        const cacheKey = this.getImageCacheKey(targetImg);
        const isAlreadyAnalyzed = this.imageVisualAnalyzedKeys && this.imageVisualAnalyzedKeys.has(cacheKey);
        const currentDesc = this.describeImageElement(img);
        const rect = img.getBoundingClientRect();

        if (isAlreadyAnalyzed) {
          this.showImageInspectorTooltip(img, currentDesc, rect, false);
          this.speakText(`Descrição da imagem: ${currentDesc}`, img, 0);
        } else {
          this.showImageInspectorTooltip(img, currentDesc, rect, true);
          this.analyzeImageVisualsAsync(img, (richDesc) => {
            const updatedRect = img.getBoundingClientRect();
            this.showImageInspectorTooltip(img, richDesc, updatedRect, false);
            this.speakText(`Descrição da imagem: ${richDesc}`, img, 0);
          });
        }
      };

      this.getAllAccessibleDocuments().forEach(({ doc }) => {
        if (!doc || !doc.documentElement) return;
        doc.addEventListener('mouseover', this.imgOverHandler, true);
        doc.addEventListener('mouseout', this.imgOutHandler, true);
        doc.addEventListener('focusin', this.imgOverHandler, true);
        doc.addEventListener('click', this.imgClickHandler, true);
      });
    }

    disableImageInspector() {
      this.imageInspectorActive = false;
      if (this.currentInspectedImg) {
        this.currentInspectedImg.classList.remove('allyada-img-inspect-target');
        this.currentInspectedImg = null;
      }
      this.hideImageInspectorTooltip();
      this.getAllAccessibleDocuments().forEach(({ doc }) => {
        if (!doc || !doc.documentElement) return;
        if (this.imgOverHandler) {
          doc.removeEventListener('mouseover', this.imgOverHandler, true);
          doc.removeEventListener('mouseout', this.imgOutHandler, true);
          doc.removeEventListener('focusin', this.imgOverHandler, true);
          doc.removeEventListener('click', this.imgClickHandler, true);
        }
        doc.querySelectorAll('.allyada-img-inspect-target').forEach(el => el.classList.remove('allyada-img-inspect-target'));
      });
      this.imgOverHandler = null;
      this.imgOutHandler = null;
      this.imgClickHandler = null;
    }

    resolveTargetImageNode(el) {
      if (!el) return null;
      if (el.tagName === 'IMG' || el.tagName === 'SVG') return el;
      if (el.querySelector) {
        const inner = el.querySelector('img, svg');
        if (inner) return inner;
      }
      return el;
    }

    getImageCacheKey(targetImg) {
      if (!targetImg) return 'unknown-img';
      return (targetImg.currentSrc || targetImg.src || targetImg.id || (targetImg.outerHTML ? targetImg.outerHTML.slice(0, 140) : 'img')).trim();
    }

    loadExternalScriptOnce(url, globalCheckFn) {
      if (globalCheckFn && globalCheckFn()) return Promise.resolve(true);
      if (!this._scriptPromises) this._scriptPromises = new Map();
      if (this._scriptPromises.has(url)) return this._scriptPromises.get(url);

      const p = new Promise((resolve) => {
        try {
          const s = document.createElement('script');
          s.src = url;
          s.async = true;
          s.crossOrigin = 'anonymous';
          s.onload = () => resolve(true);
          s.onerror = () => resolve(false);
          (document.head || document.documentElement).appendChild(s);
        } catch (e) {
          resolve(false);
        }
      });
      this._scriptPromises.set(url, p);
      return p;
    }

    preloadVisionEngines() {
      if (this._visionPreloadPromise) return this._visionPreloadPromise;
      this._visionPreloadPromise = (async () => {
        try {
          const tfOk = await this.loadExternalScriptOnce(
            'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js',
            () => typeof window.tf !== 'undefined'
          );
          if (tfOk) {
            const cocoOk = await this.loadExternalScriptOnce(
              'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js',
              () => typeof window.cocoSsd !== 'undefined'
            );
            if (cocoOk && window.cocoSsd && !this._cocoModel) {
              try {
                this._cocoModel = await window.cocoSsd.load({ base: 'mobilenet_v2' });
              } catch (e1) {
                try {
                  this._cocoModel = await window.cocoSsd.load();
                } catch (e2) {}
              }
            }
          }
        } catch (err) {}

        try {
          await this.loadExternalScriptOnce(
            'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
            () => typeof window.Tesseract !== 'undefined'
          );
        } catch (err) {}
        return true;
      })();
      return this._visionPreloadPromise;
    }

    /**
     * Extrai textos/títulos sobrepostos na imagem (HTML overlay, badges, legendas, alt curto ou SVG text)
     */
    extractImageContextAndOverlays(el) {
      const targetImg = this.resolveTargetImageNode(el);
      if (!targetImg) return { alt: '', figCap: '', overlayTitle: '', nearHeading: '', srcHint: '', genderHint: '' };

      const alt = ((targetImg.getAttribute && (targetImg.getAttribute('alt') || targetImg.getAttribute('aria-label') || targetImg.getAttribute('title'))) || '').replace(/\s+/g, ' ').trim();
      const fig = targetImg.closest ? targetImg.closest('figure') : null;
      const figCap = fig && fig.querySelector('figcaption') ? (fig.querySelector('figcaption').textContent || '').replace(/\s+/g, ' ').trim() : '';

      // 1. Procura textos HTML posicionados visualmente sobre a imagem ou dentro do mesmo container/card/banner
      let overlayTitle = '';
      try {
        const imgRect = targetImg.getBoundingClientRect();
        const container = (targetImg.closest && targetImg.closest('figure, picture, a, [class*="banner"], [class*="card"], [class*="hero"], [class*="slide"], [class*="thumb"], [class*="image"], [class*="img"], [class*="media"], [class*="box"]')) || targetImg.parentElement;
        if (container && imgRect.width > 20 && imgRect.height > 20) {
          const candidates = container.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b, span, p, div, figcaption, [class*="title"], [class*="titulo"], [class*="label"], [class*="caption"], [class*="badge"]');
          const foundTexts = [];
          candidates.forEach(node => {
            if (node === targetImg || node.contains(targetImg) || node.closest('#allyada-root')) return;
            // Pega apenas nós folha ou com texto direto curto
            const txt = (node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim();
            if (!txt || txt.length < 2 || txt.length > 90) return;
            const r = node.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            // Verifica se está sobreposto à área da imagem ou imediatamente colado a ela
            const overlapsHoriz = r.left < imgRect.right + 12 && r.right > imgRect.left - 12;
            const overlapsVert = r.top < imgRect.bottom + 28 && r.bottom > imgRect.top - 28;
            if (overlapsHoriz && overlapsVert && !foundTexts.includes(txt)) {
              foundTexts.push(txt);
            }
          });
          if (foundTexts.length > 0) {
            overlayTitle = foundTexts[0];
          }
        }
      } catch (e) {}

      // Se for SVG com <text> interno
      if (!overlayTitle && targetImg.tagName === 'SVG') {
        const svgTexts = Array.from(targetImg.querySelectorAll('text, tspan')).map(t => (t.textContent || '').trim()).filter(Boolean);
        if (svgTexts.length > 0) overlayTitle = svgTexts.join(' ');
      }

      const parentCard = targetImg.closest ? targetImg.closest('article, section, li, [class*="card"], [class*="product"], [class*="post"]') : null;
      const nearHeadingNode = parentCard ? parentCard.querySelector('h1, h2, h3, h4, strong') : null;
      const nearHeading = nearHeadingNode ? (nearHeadingNode.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90) : '';

      const rawSrc = (targetImg.currentSrc || (targetImg.getAttribute && targetImg.getAttribute('src')) || '');
      let srcHint = '';
      if (!rawSrc.startsWith('data:')) {
        srcHint = rawSrc
          .split('/').pop().split('?')[0]
          .replace(/\.(png|jpe?g|webp|svg|gif|avif)$/i, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\b\d{3,}\b/g, '')
          .trim();
      }

      // Pistas contextuais de gênero (caso existam em atributos, classes, nome do arquivo ou texto ao redor)
      const combinedContext = `${alt} ${figCap} ${srcHint} ${overlayTitle} ${nearHeading} ${(targetImg.className || '')}`.toLowerCase();
      let genderHint = '';
      if (/\b(homem|homens|man|men|male|boy|rapaz|senhor|pai|masculino|executivo|empresario|empresário|garoto|cara)\b/i.test(combinedContext)) {
        genderHint = 'male';
      } else if (/\b(mulher|mulheres|woman|women|female|girl|moca|moça|senhora|mae|mãe|feminino|executiva|empresaria|empresária|garota)\b/i.test(combinedContext)) {
        genderHint = 'female';
      }

      return { alt, figCap, overlayTitle, nearHeading, srcHint, genderHint };
    }

    /**
     * Converte um elemento <img> em um <canvas> legível (tratando CORS via fetch/blob ou crossOrigin anonymous)
     */
    async getImageCanvasForAnalysis(targetImg) {
      if (!targetImg || targetImg.tagName !== 'IMG') return null;
      const src = targetImg.currentSrc || targetImg.src || '';
      if (!src) return null;

      const tryDrawToCanvas = (imgSource) => {
        try {
          const natW = imgSource.naturalWidth || imgSource.width || 300;
          const natH = imgSource.naturalHeight || imgSource.height || 300;
          if (natW < 16 || natH < 16) return null;
          const maxDim = 640;
          const scale = Math.min(1, maxDim / Math.max(natW, natH));
          const w = Math.max(32, Math.round(natW * scale));
          const h = Math.max(32, Math.round(natH * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(imgSource, 0, 0, w, h);
          // Testa se o canvas não está bloqueado por CORS (tainted)
          ctx.getImageData(0, 0, 1, 1);
          return { canvas, ctx, width: w, height: h };
        } catch (err) {
          return null;
        }
      };

      // 1. Tenta desenhar a própria imagem já carregada na página
      if (targetImg.complete && (targetImg.naturalWidth || 0) > 0) {
        const direct = tryDrawToCanvas(targetImg);
        if (direct) return direct;
      }

      // 2. Tenta carregar via Image com crossOrigin="anonymous"
      const viaAnonImg = await new Promise((resolve) => {
        try {
          const im = new Image();
          im.crossOrigin = 'anonymous';
          const timer = setTimeout(() => resolve(null), 3500);
          im.onload = () => {
            clearTimeout(timer);
            resolve(tryDrawToCanvas(im));
          };
          im.onerror = () => {
            clearTimeout(timer);
            resolve(null);
          };
          im.src = src;
        } catch (e) {
          resolve(null);
        }
      });
      if (viaAnonImg) return viaAnonImg;

      // 3. Tenta via fetch -> Blob -> ObjectURL
      try {
        const resp = await fetch(src, { mode: 'cors', credentials: 'omit' });
        if (resp.ok) {
          const blob = await resp.blob();
          const objUrl = URL.createObjectURL(blob);
          const viaBlob = await new Promise((resolve) => {
            const im = new Image();
            im.onload = () => {
              URL.revokeObjectURL(objUrl);
              resolve(tryDrawToCanvas(im));
            };
            im.onerror = () => {
              URL.revokeObjectURL(objUrl);
              resolve(null);
            };
            im.src = objUrl;
          });
          if (viaBlob) return viaBlob;
        }
      } catch (e) {}

      return null;
    }

    /**
     * Analisa visualmente os pixels da região da pessoa para refinar características
     * (ex.: Homem vs Mulher vs Pessoa, e se segura um celular/objeto retangular próximo às mãos/peito)
     */
    analyzePersonAndHandheldInCanvas(ctx, width, height, personBbox, genderHint, allDetections) {
      const [px, py, pw, ph] = personBbox;
      const x0 = Math.max(0, Math.floor(px));
      const y0 = Math.max(0, Math.floor(py));
      const w = Math.min(width - x0, Math.floor(pw));
      const h = Math.min(height - y0, Math.floor(ph));

      let resolvedPersonNoun = 'Pessoa';
      if (genderHint === 'male') {
        resolvedPersonNoun = 'Homem';
      } else if (genderHint === 'female') {
        resolvedPersonNoun = 'Mulher';
      } else if (w > 24 && h > 36) {
        try {
          // Verifica se há gravata (tie) detectada perto da pessoa
          const hasTie = (allDetections || []).some(d => d.class === 'tie' && d.score >= 0.15);
          if (hasTie) {
            resolvedPersonNoun = 'Homem';
          } else {
            // Heurística visual na região da cabeça/mandíbula/ombros (topo 0% a 36% da pessoa)
            const headH = Math.max(12, Math.floor(h * 0.36));
            const imgData = ctx.getImageData(x0, y0, w, headH).data;

            // Compara densidade de cabelo/escuro nas laterais inferiores do pescoço vs mandíbula/barba no centro inferior da face
            let sideLongHairPixels = 0;
            let sideTotal = 0;
            let jawDarkPixels = 0;
            let jawTotal = 0;
            let crownDarkPixels = 0;
            let crownTotal = 0;

            for (let ry = 0; ry < headH; ry++) {
              const normY = ry / headH;
              for (let rx = 0; rx < w; rx++) {
                const normX = rx / w;
                const idx = (ry * w + rx) * 4;
                const r = imgData[idx];
                const g = imgData[idx + 1];
                const b = imgData[idx + 2];
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;

                // Topo da cabeça (cabelo curto concentrado no topo)
                if (normY >= 0.05 && normY <= 0.30 && normX >= 0.30 && normX <= 0.70) {
                  crownTotal++;
                  if (lum < 95) crownDarkPixels++;
                }
                // Laterais na altura do queixo/pescoço (cabelo comprido solto nas laterais)
                if (normY >= 0.55 && normY <= 0.92 && ((normX >= 0.12 && normX <= 0.28) || (normX >= 0.72 && normX <= 0.88))) {
                  sideTotal++;
                  if (lum < 85) sideLongHairPixels++;
                }
                // Região central da mandíbula/barba
                if (normY >= 0.58 && normY <= 0.85 && normX >= 0.36 && normX <= 0.64) {
                  jawTotal++;
                  if (lum < 105) jawDarkPixels++;
                }
              }
            }

            const sideHairRatio = sideTotal > 0 ? sideLongHairPixels / sideTotal : 0;
            const jawDarkRatio = jawTotal > 0 ? jawDarkPixels / jawTotal : 0;
            const crownRatio = crownTotal > 0 ? crownDarkPixels / crownTotal : 0;

            if (sideHairRatio > 0.42 && jawDarkRatio < 0.22) {
              resolvedPersonNoun = 'Mulher';
            } else if (crownRatio > 0.18 && sideHairRatio < 0.28) {
              resolvedPersonNoun = 'Homem';
            } else if (jawDarkRatio >= 0.22) {
              resolvedPersonNoun = 'Homem';
            }
          }
        } catch (e) {}
      }

      // Verifica se há celular detectado pelo modelo neural (mesmo com score moderado >= 0.13)
      const phoneDetection = (allDetections || []).find(d =>
        (d.class === 'cell phone' && d.score >= 0.12) ||
        (d.class === 'remote' && d.score >= 0.15)
      );

      let holdingPhone = !!phoneDetection;

      // Caso a mão encubra parte do celular e o COCO-SSD dê score baixo, verifica na zona das mãos/peito (entre 28% e 88% da altura da pessoa)
      // se há um objeto retangular compacto de alto contraste (borda de smartphone + reflexo/tela) próximo a pixels de pele (mão)
      if (!holdingPhone && w > 40 && h > 50) {
        try {
          const zoneY0 = Math.min(height - 1, Math.floor(y0 + h * 0.28));
          const zoneH = Math.min(height - zoneY0, Math.floor(h * 0.58));
          if (zoneH > 16) {
            const zData = ctx.getImageData(x0, zoneY0, w, zoneH).data;
            let skinPixels = 0;
            let darkDevicePixels = 0;
            let sharpEdgeTransitions = 0;
            const totalPx = w * zoneH;

            for (let ry = 1; ry < zoneH - 1; ry += 2) {
              for (let rx = 1; rx < w - 1; rx += 2) {
                const idx = (ry * w + rx) * 4;
                const r = zData[idx], g = zData[idx + 1], b = zData[idx + 2];
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;

                // Detecção de tom de pele (mão segurando objeto na zona do peito/rosto)
                const isSkin = r > 95 && g > 40 && b > 20 && (Math.max(r, g, b) - Math.min(r, g, b) > 15) && Math.abs(r - g) > 15 && r > g && r > b;
                if (isSkin) skinPixels++;
                if (lum < 48) darkDevicePixels++;

                const nextIdx = (ry * w + (rx + 1)) * 4;
                const nextLum = 0.299 * zData[nextIdx] + 0.587 * zData[nextIdx + 1] + 0.114 * zData[nextIdx + 2];
                if (Math.abs(lum - nextLum) > 55) sharpEdgeTransitions++;
              }
            }

            const sampled = Math.max(1, totalPx / 4);
            const skinRatio = skinPixels / sampled;
            const darkRatio = darkDevicePixels / sampled;
            const edgeRatio = sharpEdgeTransitions / sampled;

            // Se há mão visível na altura do peito/rosto + superfície escura/retangular com bordas nítidas
            if (skinRatio >= 0.04 && skinRatio <= 0.45 && darkRatio >= 0.04 && darkRatio <= 0.55 && edgeRatio >= 0.035) {
              holdingPhone = true;
            }
          }
        } catch (e) {}
      }

      return { resolvedPersonNoun, holdingPhone };
    }

    /**
     * Executa OCR real (Tesseract.js) em duas passadas (original + alto contraste para textos claros sobre fotos)
     */
    async extractTextFromCanvasOCR(canvas) {
      if (!canvas || typeof window.Tesseract === 'undefined') return '';
      try {
        const cleanOcrText = (raw) => {
          if (!raw) return '';
          const lines = raw
            .split(/\r?\n/)
            .map(l => l.replace(/[^a-zA-ZÀ-ÿ0-9\s!?:.,$-]/g, ' ').replace(/\s+/g, ' ').trim())
            .filter(l => {
              if (l.length < 2) return false;
              // Deve conter ao menos uma palavra real com 3+ letras seguidas
              return /[a-zA-ZÀ-ÿ]{3,}/.test(l);
            });
          return lines.join(' — ').slice(0, 110).trim();
        };

        // 1ª passada: imagem original
        const res1 = await window.Tesseract.recognize(canvas, 'por+eng');
        const confidence1 = res1 && res1.data ? (res1.data.confidence || 0) : 0;
        const text1 = (res1 && res1.data && res1.data.text) ? cleanOcrText(res1.data.text) : '';
        if (text1 && (confidence1 >= 45 || text1.length >= 4)) {
          return text1;
        }

        // 2ª passada: filtro de alto contraste P&B para títulos claros escritos sobre fotos (ex.: título "Exemplo" sobre a foto)
        const hcCanvas = document.createElement('canvas');
        hcCanvas.width = canvas.width;
        hcCanvas.height = canvas.height;
        const hcCtx = hcCanvas.getContext('2d');
        hcCtx.drawImage(canvas, 0, 0);
        const imgData = hcCtx.getImageData(0, 0, hcCanvas.width, hcCanvas.height);
        const d = imgData.data;
        for (let i = 0; i < d.length; i += 4) {
          const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Destaca texto branco/claro (lum > 195) como preto puro no fundo branco para o OCR ler com perfeição
          const v = lum > 190 ? 0 : 255;
          d[i] = d[i + 1] = d[i + 2] = v;
        }
        hcCtx.putImageData(imgData, 0, 0);

        const res2 = await window.Tesseract.recognize(hcCanvas, 'por+eng');
        const text2 = (res2 && res2.data && res2.data.text) ? cleanOcrText(res2.data.text) : '';
        return text2 || text1 || '';
      } catch (e) {
        return '';
      }
    }

    /**
     * Analisa a imagem de forma assíncrona combinando:
     * 1. Visão Computacional Neural (COCO-SSD + análise de cena/pessoa/celular/objetos)
     * 2. OCR Real nos pixels da imagem (Tesseract.js) + Textos HTML sobrepostos
     * 3. Gemini Flash Vision (se chave de API opcional estiver configurada)
     */
    async analyzeImageVisualsAsync(el, onUpdate) {
      const targetImg = this.resolveTargetImageNode(el);
      if (!targetImg) return '';
      const cacheKey = this.getImageCacheKey(targetImg);

      if (this.imageVisualAnalyzedKeys && this.imageVisualAnalyzedKeys.has(cacheKey) && this.imageDescriptionCache.has(cacheKey)) {
        const cached = this.imageDescriptionCache.get(cacheKey);
        if (onUpdate) onUpdate(cached);
        return cached;
      }

      if (this.imagePendingAnalyses && this.imagePendingAnalyses.has(cacheKey)) {
        const pending = await this.imagePendingAnalyses.get(cacheKey);
        if (onUpdate && pending) onUpdate(pending);
        return pending;
      }

      const analysisPromise = (async () => {
        const ctxInfo = this.extractImageContextAndOverlays(el);
        await this.preloadVisionEngines();

        const canvasInfo = await this.getImageCanvasForAnalysis(targetImg);
        let visualSceneDesc = '';
        let ocrText = '';

        if (canvasInfo) {
          const { canvas, ctx, width, height } = canvasInfo;

          // 1. Opcional: Se o desenvolvedor configurou chave Gemini Vision API, usa modelo multimodal completo
          const geminiKey = (this.config && this.config.geminiApiKey) || (typeof localStorage !== 'undefined' && localStorage.getItem('allyada_gemini_key')) || '';
          if (geminiKey) {
            try {
              const b64 = canvas.toDataURL('image/jpeg', 0.82).split(',')[1];
              const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(geminiKey)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{
                    parts: [
                      { text: 'Descreva esta imagem em português de forma direta, humana e acessível em 1 frase curta. Diga se há um homem, mulher ou pessoa, o que está fazendo (ex: segurando um celular) e cite qualquer título ou texto escrito na imagem.' },
                      { inline_data: { mime_type: 'image/jpeg', data: b64 } }
                    ]
                  }]
                })
              });
              if (resp.ok) {
                const json = await resp.json();
                const aiText = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                if (aiText) {
                  this.imageDescriptionCache.set(cacheKey, aiText);
                  this.imageVisualAnalyzedKeys.add(cacheKey);
                  return aiText;
                }
              }
            } catch (e) {}
          }

          // 2. Detecção Neural de Pessoas, Celular, Objetos e Interações (TensorFlow.js COCO-SSD)
          let detections = [];
          if (this._cocoModel) {
            try {
              detections = await this._cocoModel.detect(canvas, 20, 0.12);
            } catch (e) {}
          }

          const persons = detections.filter(d => d.class === 'person' && d.score >= 0.28);
          const hasLaptop = detections.some(d => d.class === 'laptop' && d.score >= 0.20);
          const hasBook = detections.some(d => d.class === 'book' && d.score >= 0.22);
          const hasCup = detections.some(d => (d.class === 'cup' || d.class === 'wine glass' || d.class === 'bottle') && d.score >= 0.22);
          const hasCar = detections.some(d => (d.class === 'car' || d.class === 'bus' || d.class === 'truck' || d.class === 'motorcycle') && d.score >= 0.28);
          const hasDog = detections.some(d => d.class === 'dog' && d.score >= 0.28);
          const hasCat = detections.some(d => d.class === 'cat' && d.score >= 0.28);

          if (persons.length > 0) {
            const mainPerson = persons.sort((a, b) => (b.bbox[2] * b.bbox[3]) - (a.bbox[2] * a.bbox[3]))[0];
            const { resolvedPersonNoun, holdingPhone } = this.analyzePersonAndHandheldInCanvas(
              ctx, width, height, mainPerson.bbox, ctxInfo.genderHint, detections
            );

            const subject = persons.length === 1
              ? resolvedPersonNoun
              : `${persons.length} pessoas`;

            const actions = [];
            if (holdingPhone) actions.push('segurando o celular');
            if (hasLaptop) actions.push('utilizando um notebook');
            if (!holdingPhone && !hasLaptop && hasBook) actions.push('segurando um livro');
            if (hasCup) actions.push('com uma xícara/copo');

            visualSceneDesc = actions.length > 0
              ? `${subject} ${actions.join(' e ')}`
              : subject;
          } else {
            const ptMap = {
              'cell phone': 'Um celular em destaque',
              'laptop': 'Um notebook',
              'book': 'Um livro',
              'car': 'Um automóvel',
              'dog': 'Um cachorro',
              'cat': 'Um gato',
              'chair': 'Uma cadeira/ambiente interno',
              'couch': 'Um sofá em ambiente interno',
              'potted plant': 'Planta decorativa',
              'tv': 'Uma tela/monitor',
              'Keyboard': 'Um teclado',
              'keyboard': 'Um teclado',
              'clock': 'Um relógio'
            };
            const topObj = detections.filter(d => d.score >= 0.28 && ptMap[d.class])[0];
            if (topObj) {
              visualSceneDesc = ptMap[topObj.class];
            } else if (hasCar) {
              visualSceneDesc = 'Veículo na cena';
            } else if (hasDog) {
              visualSceneDesc = 'Cachorro na imagem';
            } else if (hasCat) {
              visualSceneDesc = 'Gato na imagem';
            }
          }

          // 3. OCR Real para ler título/texto escrito dentro da própria imagem (ex.: "Exemplo")
          ocrText = await this.extractTextFromCanvasOCR(canvas);
        }

        // 4. Determina o título na imagem (priorizando texto sobreposto, OCR na imagem ou alt curto que funciona como título)
        const isShortTitleAlt = ctxInfo.alt && ctxInfo.alt.length >= 2 && ctxInfo.alt.length <= 35 && !/\b(segurando|usando|olhando|sorrindo|sentad|em pé|pessoa|homem|mulher)\b/i.test(ctxInfo.alt);
        const imageTitle = ctxInfo.overlayTitle || ocrText || (isShortTitleAlt ? ctxInfo.alt : '') || ctxInfo.figCap;

        // Se o próprio alt já era uma descrição longa completa e não tivemos detecção visual melhor:
        let finalDesc = '';
        if (visualSceneDesc && imageTitle) {
          // Evita repetir se visualSceneDesc já contiver o imageTitle
          if (visualSceneDesc.toLowerCase().includes(imageTitle.toLowerCase())) {
            finalDesc = visualSceneDesc;
          } else {
            finalDesc = `${visualSceneDesc} com o título na imagem "${imageTitle}"`;
          }
        } else if (visualSceneDesc && ctxInfo.alt && !visualSceneDesc.toLowerCase().includes(ctxInfo.alt.toLowerCase())) {
          finalDesc = `${visualSceneDesc} (${ctxInfo.alt})`;
        } else if (visualSceneDesc) {
          finalDesc = ctxInfo.nearHeading
            ? `${visualSceneDesc} — seção "${ctxInfo.nearHeading}"`
            : visualSceneDesc;
        } else if (imageTitle && ctxInfo.alt && imageTitle !== ctxInfo.alt) {
          finalDesc = `${ctxInfo.alt}, com o título na imagem "${imageTitle}"`;
        } else if (imageTitle) {
          finalDesc = `Imagem com o título "${imageTitle}"`;
        } else {
          finalDesc = this.describeImageElement(el);
        }

        this.imageDescriptionCache.set(cacheKey, finalDesc);
        if (this.imageVisualAnalyzedKeys) {
          this.imageVisualAnalyzedKeys.add(cacheKey);
        }
        return finalDesc;
      })();

      if (this.imagePendingAnalyses) {
        this.imagePendingAnalyses.set(cacheKey, analysisPromise);
      }

      try {
        const result = await analysisPromise;
        if (onUpdate && result) onUpdate(result);
        return result;
      } finally {
        if (this.imagePendingAnalyses) {
          this.imagePendingAnalyses.delete(cacheKey);
        }
      }
    }

    describeImageElement(el) {
      if (!el) return 'Imagem ilustrativa na página';
      const targetImg = this.resolveTargetImageNode(el);
      const cacheKey = this.getImageCacheKey(targetImg);
      if (this.imageDescriptionCache.has(cacheKey)) {
        return this.imageDescriptionCache.get(cacheKey);
      }

      const { alt, figCap, overlayTitle, nearHeading, srcHint } = this.extractImageContextAndOverlays(el);
      const isMeaningfulAlt = alt && alt.length > 2 && !/^(img|image|foto|photo|banner|dsc|untitled|\d+)[\w.-]*$/i.test(alt);

      let desc = '';
      const parts = [];

      if (isMeaningfulAlt) {
        // Se o alt é apenas uma palavra curta (ex: "Exemplo"), marca como título da imagem
        if (alt.split(/\s+/).length <= 3 && !/\b(segurando|usando|homem|mulher|pessoa|foto de|imagem de)\b/i.test(alt)) {
          parts.push(`Título na imagem: "${alt}"`);
        } else {
          parts.push(alt);
        }
      }

      if (overlayTitle && (!alt || !alt.toLowerCase().includes(overlayTitle.toLowerCase()))) {
        parts.push(`Título na imagem: "${overlayTitle}"`);
      }

      if (figCap && !parts.some(p => p.toLowerCase().includes(figCap.toLowerCase()))) {
        parts.push(figCap);
      }

      if (parts.length > 0) {
        desc = parts.join(' — ');
      } else {
        const parentLink = targetImg.closest ? targetImg.closest('a, button') : null;
        if (parentLink && (parentLink.textContent || parentLink.getAttribute('aria-label') || '').trim()) {
          desc = `Imagem vinculada a: "${(parentLink.getAttribute('aria-label') || parentLink.textContent).replace(/\s+/g, ' ').trim().slice(0, 90)}"`;
        } else if (nearHeading) {
          desc = `Ilustração referente ao tópico "${nearHeading}"`;
        } else if (srcHint && srcHint.length > 3) {
          desc = `Imagem visual: ${srcHint.charAt(0).toUpperCase() + srcHint.slice(1)}`;
        } else {
          desc = 'Analisando elementos visuais da imagem...';
        }
      }

      this.imageDescriptionCache.set(cacheKey, desc);
      return desc;
    }

    showImageInspectorTooltip(el, desc, rect, isAnalyzing = false) {
      if (!this.imageTooltipEl) return;
      const resolvedDesc = desc || this.describeImageElement(el);
      const resolvedRect = rect || (el && typeof el.getBoundingClientRect === 'function' ? el.getBoundingClientRect() : null);
      const tip = this.imageTooltipEl;
      const badgeLabel = isAnalyzing ? '🔍 Analisando imagem (IA)...' : '✨ Descrição Visual IA';
      tip.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px;">
          <span style="display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; background:#7956c2; color:#fff; padding:2px 8px; border-radius:999px;">
            ${badgeLabel}
          </span>
          <button type="button" id="allyada-tip-speak-btn" style="border:none; background:rgba(255,255,255,0.14); color:#fff; font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px; cursor:pointer;">
            🔊 Ouvir
          </button>
        </div>
        <div id="allyada-tip-desc-text" style="color:#f8fafc; font-weight:500;">${this.escapeHTML(resolvedDesc)}</div>
      `;
      tip.style.display = 'block';

      const speakBtn = tip.querySelector('#allyada-tip-speak-btn');
      if (speakBtn) {
        speakBtn.onclick = (ev) => {
          ev.stopPropagation();
          const latestDesc = this.describeImageElement(el);
          this.speakText(`Descrição da imagem: ${latestDesc}`, el, 0);
        };
      }

      const vw = window.innerWidth || 1024;
      const vh = window.innerHeight || 768;
      const topCandidate = (resolvedRect && typeof resolvedRect.bottom === 'number') ? resolvedRect.bottom + 10 : 80;
      const leftCandidate = (resolvedRect && typeof resolvedRect.left === 'number') ? resolvedRect.left : 24;

      const finalTop = Math.max(12, Math.min(topCandidate, vh - 130));
      const finalLeft = Math.max(12, Math.min(leftCandidate, vw - 376));
      tip.style.top = `${finalTop}px`;
      tip.style.left = `${finalLeft}px`;
    }

    hideImageInspectorTooltip() {
      if (this.imageTooltipEl) {
        this.imageTooltipEl.style.display = 'none';
      }
    }

    escapeHTML(str) {
      return String(str == null ? '' : str).replace(/[&<>'"]/g, tag => ({
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

      // Mantém sincronia bidirecional entre textAlignLeft legado e textAlign completo
      if (this.state.textAlignLeft && (!this.state.textAlign || this.state.textAlign === 'normal')) {
        this.state.textAlign = 'left';
      } else if (this.state.textAlign && this.state.textAlign !== 'normal') {
        this.state.textAlignLeft = (this.state.textAlign === 'left');
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

        // Fonte & Alinhamento Completo (Esquerda, Centro, Direita, Justificado)
        html.classList.toggle('ally-dyslexic-font', this.state.dyslexicFont);
        html.classList.remove('ally-text-align-left', 'ally-text-align-center', 'ally-text-align-right', 'ally-text-align-justify');
        const activeAlign = this.state.textAlign || (this.state.textAlignLeft ? 'left' : 'normal');
        if (activeAlign && activeAlign !== 'normal') {
          html.classList.add(`ally-text-align-${activeAlign}`);
        }

        // Contraste
        html.classList.remove('ally-contrast-dark', 'ally-contrast-light', 'ally-contrast-monochrome', 'ally-contrast-invert');
        if (this.state.contrast !== 'normal') {
          html.classList.add(`ally-contrast-${this.state.contrast}`);
        }

        // Cores Personalizadas (Títulos, Texto e Fundo)
        html.classList.toggle('ally-custom-title', !!this.state.customTitleColor);
        html.classList.toggle('ally-custom-text', !!this.state.customTextColor);
        html.classList.toggle('ally-custom-bg', !!this.state.customBgColor);

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

        // Estilos Dinâmicos (Cor do Cursor + Cores Personalizadas)
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

      // Inspetor de Imagens com IA
      if (this.state.imageInspector) {
        this.enableImageInspector();
      } else {
        this.disableImageInspector();
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

      const vPos = this.state.verticalPosition || this.config.verticalPosition || 'bottom';
      const hPos = this.state.dockPosition || this.config.position || 'right';

      if (this.shadowRoot) {
        const wrapper = this.shadowRoot.querySelector('.allyada-wrapper');
        if (wrapper) {
          wrapper.classList.remove('pos-right', 'pos-left', 'vpos-bottom', 'vpos-middle', 'vpos-top');
          wrapper.classList.add(`pos-${hPos}`, `vpos-${vPos}`);
        }
      }

      const requestedScale = parseFloat(this.state.uiScale || '1') || 1;
      const docEl = document.documentElement;
      const vw = (docEl && docEl.clientWidth) ? Math.min(window.innerWidth || docEl.clientWidth, docEl.clientWidth) : (window.innerWidth || 1024);
      const vh = (docEl && docEl.clientHeight) ? Math.min(window.innerHeight || docEl.clientHeight, docEl.clientHeight) : (window.innerHeight || 768);

      const isMobile = vw <= 480;
      const sideMargin = isMobile ? 12 : 24;
      const bottomOffset = vPos === 'middle' ? (isMobile ? 24 : 36) : (isMobile ? 88 : 96);
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
      const unscaledCenterTop = (vh / 2) / effectiveScale;

      this.hostContainer.style.setProperty('--allyada-ui-scale', effectiveScale.toFixed(3));
      this.hostContainer.style.setProperty('--allyada-drawer-width', `${unscaledWidth.toFixed(2)}px`);
      this.hostContainer.style.setProperty('--allyada-drawer-max-height', `${unscaledMaxHeight.toFixed(2)}px`);
      this.hostContainer.style.setProperty('--allyada-drawer-bottom', `${unscaledBottom.toFixed(2)}px`);
      this.hostContainer.style.setProperty('--allyada-drawer-side', `${unscaledSide.toFixed(2)}px`);
      this.hostContainer.style.setProperty('--allyada-drawer-center-top', `${unscaledCenterTop.toFixed(2)}px`);

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

      const activeAlign = this.state.textAlign || (this.state.textAlignLeft ? 'left' : 'normal');
      if (activeAlign && activeAlign !== 'normal') {
        const alignNames = { left: 'Esquerda', center: 'Centralizado', right: 'Direita', justify: 'Justificado' };
        items.push({
          id: 'text-align',
          label: `Alinhamento (${alignNames[activeAlign] || activeAlign})`,
          reset: () => { this.state.textAlign = 'normal'; this.state.textAlignLeft = false; }
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

      if (this.state.customTitleColor) {
        items.push({
          id: 'custom-title-color',
          label: `Cor Títulos (${this.state.customTitleColor.toUpperCase()})`,
          reset: () => { this.state.customTitleColor = ''; }
        });
      }

      if (this.state.customTextColor) {
        items.push({
          id: 'custom-text-color',
          label: `Cor Texto (${this.state.customTextColor.toUpperCase()})`,
          reset: () => { this.state.customTextColor = ''; }
        });
      }

      if (this.state.customBgColor) {
        items.push({
          id: 'custom-bg-color',
          label: `Cor Fundo (${this.state.customBgColor.toUpperCase()})`,
          reset: () => { this.state.customBgColor = ''; }
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

      if (this.state.imageInspector) {
        items.push({
          id: 'image-inspector',
          label: 'Descrever Imagens (IA)',
          reset: () => { this.state.imageInspector = false; }
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
        qTtsControls.style.display = 'none';
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

      // Alinhamento de Texto
      const currentAlign = this.state.textAlign || (this.state.textAlignLeft ? 'left' : 'normal');
      const alignLabels = { normal: 'Padrão', left: 'Esquerda', center: 'Centralizado', right: 'Direita', justify: 'Justificado' };
      const alignInd = root.getElementById('text-align-indicator');
      if (alignInd) alignInd.textContent = alignLabels[currentAlign] || 'Padrão';
      ['normal', 'left', 'center', 'right', 'justify'].forEach(al => {
        const btn = root.getElementById(`btn-align-${al}`);
        if (btn) {
          const isAct = (currentAlign === al);
          btn.classList.toggle('active', isAct);
          btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        }
      });

      const updateTool = (id, active) => {
        const el = root.getElementById(id);
        if (el) {
          el.setAttribute('aria-pressed', active ? 'true' : 'false');
          el.classList.toggle('active', !!active);
        }
      };

      updateTool('card-word-spacing', !!this.state.wordSpacingLevel);
      updateTool('card-wcag-spacing', this.state.wcagSpacing);
      updateTool('card-dyslexic-font', this.state.dyslexicFont);
      updateTool('card-virtual-keyboard', this.state.virtualKeyboard);
      updateTool('card-image-inspector', this.state.imageInspector);

      // 4. Cores e Contraste + Cores Personalizadas
      ['dark', 'light', 'monochrome', 'invert'].forEach(opt => {
        updateTool(`card-contrast-${opt}`, this.state.contrast === opt);
      });

      const hexTitle = root.getElementById('hex-custom-title');
      if (hexTitle) hexTitle.textContent = this.state.customTitleColor ? this.state.customTitleColor.toUpperCase() : 'Padrão';
      const hexText = root.getElementById('hex-custom-text');
      if (hexText) hexText.textContent = this.state.customTextColor ? this.state.customTextColor.toUpperCase() : 'Padrão';
      const hexBg = root.getElementById('hex-custom-bg');
      if (hexBg) hexBg.textContent = this.state.customBgColor ? this.state.customBgColor.toUpperCase() : 'Padrão';

      const hasAnyCustomColor = !!(this.state.customTitleColor || this.state.customTextColor || this.state.customBgColor);
      const btnResetCustom = root.getElementById('btn-reset-custom-colors');
      if (btnResetCustom) {
        btnResetCustom.style.display = hasAnyCustomColor ? 'inline-flex' : 'none';
      }

      root.querySelectorAll('.custom-swatch-btn').forEach(btn => {
        const target = btn.dataset.target;
        const col = (btn.dataset.color || '').toLowerCase();
        const activeVal = ((
          target === 'title' ? this.state.customTitleColor :
          target === 'text' ? this.state.customTextColor :
          this.state.customBgColor
        ) || '').toLowerCase();
        btn.classList.toggle('active', !!activeVal && activeVal === col);
      });

      const inpTitleCol = root.getElementById('input-custom-title-color');
      if (inpTitleCol && this.state.customTitleColor) inpTitleCol.value = this.state.customTitleColor;
      const inpTextCol = root.getElementById('input-custom-text-color');
      if (inpTextCol && this.state.customTextColor) inpTextCol.value = this.state.customTextColor;
      const inpBgCol = root.getElementById('input-custom-bg-color');
      if (inpBgCol && this.state.customBgColor) inpBgCol.value = this.state.customBgColor;

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
        const cNames = { normal: 'Normal', large: 'Grande (44px)', xlarge: 'Extra Grande (60px)' };
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

      // 8. Velocidade e Timbre de Fala (TTS) em ambas as abas
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

      ['select-tts-voice', 'q-select-tts-voice'].forEach(selId => {
        const sel = root.getElementById(selId);
        if (sel && sel.value !== (this.state.speechVoiceURI || '')) {
          sel.value = this.state.speechVoiceURI || '';
        }
      });

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

      const curVPos = this.state.verticalPosition || this.config.verticalPosition || 'bottom';
      const curHPos = this.state.dockPosition || this.config.position || 'right';

      ['bottom', 'middle', 'top'].forEach(vpos => {
        const btnV = root.getElementById(`btn-vpos-${vpos}`);
        if (btnV) {
          const isAct = (curVPos === vpos);
          btnV.classList.toggle('active', isAct);
          btnV.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        }
      });
      ['right', 'left'].forEach(hpos => {
        const btnH = root.getElementById(`btn-hpos-${hpos}`);
        if (btnH) {
          const isAct = (curHPos === hpos);
          btnH.classList.toggle('active', isAct);
          btnH.setAttribute('aria-pressed', isAct ? 'true' : 'false');
        }
      });
      const headerVposBtn = root.getElementById('btn-toggle-vpos');
      if (headerVposBtn) {
        const isCentered = (curVPos === 'middle');
        headerVposBtn.classList.toggle('active', isCentered);
        headerVposBtn.setAttribute('aria-pressed', isCentered ? 'true' : 'false');
        headerVposBtn.style.display = this.isAdminMode ? 'inline-flex' : 'none';
      }

      const studioSection = root.getElementById('allyada-client-studio-section');
      if (studioSection) {
        studioSection.style.display = this.isAdminMode ? 'block' : 'none';
      }

      // Sincroniza controles do Studio PRO (Ícone, Cor da Marca e Uniforme VLibras)
      const activeFabIcon = this.config.fabIcon || 'allyada';
      root.querySelectorAll('.btn-studio-icon').forEach(btn => {
        const isAct = (btn.getAttribute('data-icon') === activeFabIcon);
        btn.classList.toggle('active', isAct);
        btn.setAttribute('aria-pressed', isAct ? 'true' : 'false');
      });

      const activeBrandColor = (this.config.primaryColor || '#7956c2').toLowerCase();
      root.querySelectorAll('.studio-brand-swatch').forEach(btn => {
        const isAct = ((btn.getAttribute('data-brand-color') || '').toLowerCase() === activeBrandColor);
        btn.classList.toggle('active', isAct);
      });
      const brandHexEl = root.getElementById('studio-brand-color-hex');
      if (brandHexEl) brandHexEl.textContent = activeBrandColor.toUpperCase();
      const brandColorInput = root.getElementById('input-brand-custom-color');
      if (brandColorInput) brandColorInput.value = activeBrandColor;

      const shirtInput = root.getElementById('input-vlibras-shirt');
      if (shirtInput) shirtInput.value = this.config.vlibrasShirtColor || this.config.primaryColor || '#7956c2';
      const pantsInput = root.getElementById('input-vlibras-pants');
      if (pantsInput) pantsInput.value = this.config.vlibrasPantsColor || '#201E62';
      const logoInput = root.getElementById('input-vlibras-logo');
      if (logoInput && logoInput !== root.activeElement) logoInput.value = this.config.vlibrasLogoUrl || '';

      const isDarkPage = this.state.contrast === 'dark' || ['#18181b', '#0f172a', '#000000', '#121212'].includes((this.state.customBgColor || '').toLowerCase());
      const effectiveCursorColor = (isDarkPage && (this.state.cursorColor || '#000000').toLowerCase() === '#000000')
        ? '#ffffff'
        : (this.state.cursorColor || '#000000');

      const cursorColorBtns = root.querySelectorAll('.color-preset-btn');
      cursorColorBtns.forEach(btn => {
        if (btn.dataset.color.toLowerCase() === effectiveCursorColor.toLowerCase()) {
          btn.style.outline = '3px solid var(--primary)';
          btn.style.outlineOffset = '2px';
        } else {
          btn.style.outline = 'none';
        }
      });

      const customColorInput = root.getElementById('input-cursor-custom-color');
      if (customColorInput) customColorInput.value = effectiveCursorColor;

      const hexTag = root.getElementById('cursor-color-hex');
      if (hexTag) hexTag.textContent = effectiveCursorColor.toUpperCase();

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

    /**
     * Desbloqueia o painel "Studio PRO (Exclusivo do Cliente)" para o dono do site
     * (pode ser acionado via 5 cliques na logo Allyada do topo, ?allyada_admin=1 na URL ou Allyada.openAdmin() no console).
     */
    openAdmin() {
      this.isAdminMode = true;
      if (!this.isOpen) {
        this.openPanel();
      }
      this.switchTab('settings');
      this.updatePanelUI();
      if (this.shadowRoot) {
        const studioSection = this.shadowRoot.getElementById('allyada-client-studio-section');
        if (studioSection) {
          setTimeout(() => {
            studioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        }
      }
      this.announce('Modo Studio PRO de personalização do cliente desbloqueado');
    }

    setFabIcon(iconKey) {
      const validIcons = ['allyada', 'universal', 'hands', 'heart', 'shield'];
      const chosen = validIcons.includes(iconKey) ? iconKey : 'allyada';
      this.config.fabIcon = chosen;
      if (this.shadowRoot) {
        const fabIconSpan = this.shadowRoot.getElementById('allyada-fab-icon-span') || this.shadowRoot.getElementById('allyada-fab-icon-svg');
        if (fabIconSpan) {
          fabIconSpan.innerHTML = ICONS[chosen] || ICONS.allyada;
        }
        const headerIconBox = this.shadowRoot.getElementById('allyada-header-icon-box');
        if (headerIconBox) {
          headerIconBox.innerHTML = ICONS[chosen] || ICONS.allyada;
        }
      }
      this.updatePanelUI();
      this.announce(`Ícone do botão flutuante alterado para ${chosen}`);
    }

    setBrandColor(hexColor) {
      if (!hexColor || typeof hexColor !== 'string') return;
      const cleanHex = hexColor.trim();
      this.config.primaryColor = cleanHex;
      this.config.vlibrasColor = cleanHex;
      if (!this._customShirtEdited) {
        this.config.vlibrasShirtColor = cleanHex;
      }
      if (this.shadowRoot && this.shadowRoot.host) {
        this.shadowRoot.host.style.setProperty('--primary', cleanHex);
        this.shadowRoot.host.style.setProperty('--primary-hover', cleanHex);
      }
      this.applyVLibrasCustomTheme();
      this.syncVLibrasAvatar(this.state.vlibrasAvatar || 'hosana');
      this.updatePanelUI();
    }

    setVLibrasUniform(opts = {}) {
      if (opts.shirt) {
        this._customShirtEdited = true;
        this.config.vlibrasShirtColor = opts.shirt;
      }
      if (opts.pants) {
        this.config.vlibrasPantsColor = opts.pants;
      }
      if (typeof opts.logo === 'string') {
        this.config.vlibrasLogoUrl = opts.logo.trim();
      }
      this.syncVLibrasAvatar(this.state.vlibrasAvatar || 'hosana');
      this.updatePanelUI();
    }

    setVerticalPosition(vpos) {
      const valid = ['bottom', 'middle', 'top'].includes(vpos) ? vpos : 'bottom';
      this.config.verticalPosition = valid;
      this.state.verticalPosition = valid;
      if (this.shadowRoot) {
        const wrapper = this.shadowRoot.querySelector('.allyada-wrapper');
        if (wrapper) {
          wrapper.classList.remove('vpos-bottom', 'vpos-middle', 'vpos-top');
          wrapper.classList.add(`vpos-${valid}`);
        }
      }
      this.applyResponsiveWidgetSize();
      this.saveState();
      this.updatePanelUI();
      const labels = { bottom: 'Fim da página', middle: 'Centro lateral da tela', top: 'Topo lateral da tela' };
      this.announce(`Posição vertical alterada para ${labels[valid]}`);
    }

    setDockPosition(hpos) {
      const newPos = (hpos === 'left') ? 'left' : 'right';
      this.config.position = newPos;
      this.state.dockPosition = newPos;
      if (this.shadowRoot) {
        const wrapper = this.shadowRoot.querySelector('.allyada-wrapper');
        if (wrapper) {
          wrapper.classList.remove('pos-right', 'pos-left');
          wrapper.classList.add(`pos-${newPos}`);
        }
      }
      const vlibrasBtn = document.querySelector('div[vw] [vw-access-button]');
      if (vlibrasBtn) {
        if (newPos === 'right') {
          vlibrasBtn.style.left = '24px';
          vlibrasBtn.style.right = 'auto';
        } else {
          vlibrasBtn.style.right = '24px';
          vlibrasBtn.style.left = 'auto';
        }
      }
      this.applyVLibrasCustomTheme();
      this.saveState();
      this.updatePanelUI();
    }

    toggleDockPosition() {
      const cur = this.state.dockPosition || this.config.position || 'right';
      const newPos = (cur === 'right') ? 'left' : 'right';
      this.setDockPosition(newPos);
    }

    togglePanel() {
      if (this.isOpen) this.closePanel();
      else this.openPanel();
    }

    openPanel() {
      if (this.isStructureModalOpen) {
        this.closeStructureModal();
      }
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

        if (e.key === 'Escape') {
          if (this.isStructureModalOpen) {
            e.preventDefault();
            this.closeStructureModal();
          } else if (this.isOpen) {
            e.preventDefault();
            this.closePanel();
          }
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
      this.populateVoiceSelectors();
      if ('onvoiceschanged' in this.speechSynthesizer) {
        this.speechSynthesizer.addEventListener('voiceschanged', () => {
          this.populateVoiceSelectors();
        });
      }
    }

    /**
     * Classifica e ordena as vozes em Português priorizando síntese Neural / Natural / Humana
     * (ex.: Microsoft Francisca/Antonio/Thalita Online Natural, Google Português do Brasil, Apple Luciana Enhanced)
     * em vez das antigas vozes offline robóticas SAPI5.
     */
    getRankedPortugueseVoices() {
      if (!this.speechSynthesizer || typeof this.speechSynthesizer.getVoices !== 'function') return [];
      const allVoices = this.speechSynthesizer.getVoices() || [];
      if (allVoices.length === 0) return [];

      const scoreVoice = (v) => {
        let score = 0;
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();

        if (lang.includes('pt-br') || lang.includes('pt_br')) score += 100;
        else if (lang.startsWith('pt')) score += 50;

        // Prioridade máxima para vozes Neurais / Naturais / Online humanas
        if (name.includes('natural') || name.includes('neural')) score += 90;
        if (name.includes('online') || name.includes('multilingual')) score += 65;
        if (name.includes('francisca') || name.includes('antonio') || name.includes('thalita')) score += 55;
        if (name.includes('google')) score += 60;
        if (name.includes('luciana') || name.includes('felipe') || name.includes('fernanda') || name.includes('premium') || name.includes('enhanced')) score += 45;
        if (!v.localService) score += 30;
        if (v.default) score += 10;

        // Penaliza levemente vozes SAPI5 locais conhecidas por timbre mais robótico quando há opções neurais
        if (v.localService && (name.includes('maria') || name.includes('daniel') || name.includes('espeak'))) {
          score -= 15;
        }
        return score;
      };

      const ptVoices = allVoices.filter(v => (v.lang || '').toLowerCase().startsWith('pt'));
      const pool = ptVoices.length > 0 ? ptVoices : allVoices;

      return pool.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a));
    }

    populateVoiceSelectors() {
      if (!this.shadowRoot) return;
      const ranked = this.getRankedPortugueseVoices();
      const selectors = ['select-tts-voice', 'q-select-tts-voice']
        .map(id => this.shadowRoot.getElementById(id))
        .filter(Boolean);

      if (selectors.length === 0) return;

      const formatVoiceLabel = (v) => {
        const rawName = (v.name || 'Voz').replace(/^Microsoft\s+/i, '').replace(/Desktop\s*-\s*Portuguese.*$/i, '').trim();
        const isNatural = /natural|neural|online|google|luciana|premium|enhanced/i.test(v.name || '') || !v.localService;
        return isNatural ? `✨ ${rawName}` : rawName;
      };

      selectors.forEach(sel => {
        const currentVal = this.state.speechVoiceURI || '';
        sel.innerHTML = `<option value="">✨ Automática (Mais Natural)</option>`;
        ranked.forEach(v => {
          const opt = document.createElement('option');
          opt.value = v.voiceURI || v.name;
          opt.textContent = formatVoiceLabel(v);
          sel.appendChild(opt);
        });
        sel.value = currentVal;
      });
    }

    changeSpeechVoice(voiceURI) {
      const wasSpeaking = !!(this.isSpeaking && this.speechSynthesizer && this.fullSpeakingText);
      const resumeOffset = wasSpeaking ? this.getCurrentReadingOffset() : 0;

      this.state.speechVoiceURI = voiceURI || '';
      this.saveState();

      if (wasSpeaking) {
        this.speakText(this.fullSpeakingText, this.currentSpeakingNode, resumeOffset);
      }
      this.syncStateAndUI();
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

        const clickedImg = e.target.closest ? e.target.closest('img, svg[role="img"], [role="img"], figure, picture') : null;
        if (clickedImg) {
          this.disableTtsSelectionListeners();
          this.analyzeImageVisualsAsync(clickedImg, (richDesc) => {
            this.speakText(`Descrição da imagem: ${richDesc}`, clickedImg, 0);
          });
          return;
        }
        
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

      const rankedVoices = this.getRankedPortugueseVoices();
      let chosenVoice = null;
      if (this.state.speechVoiceURI) {
        const allVoices = this.speechSynthesizer.getVoices() || [];
        chosenVoice = allVoices.find(v => v.voiceURI === this.state.speechVoiceURI || v.name === this.state.speechVoiceURI);
      }
      if (!chosenVoice && rankedVoices.length > 0) {
        chosenVoice = rankedVoices[0];
      }
      if (chosenVoice) {
        utterance.voice = chosenVoice;
        if (chosenVoice.lang) utterance.lang = chosenVoice.lang;
      }

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
        qControls.style.display = 'none';
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
     * Gera o JSON oficial de personalização do uniforme 3D do VLibras (CustomizationBridge.setURL),
     * permitindo definir a cor da camisa, cor da calça e logo 500x500 fundo transparente no peito do avatar.
     */
    getVLibrasPersonalizationUrl() {
      const shirt = (this.config && this.config.vlibrasShirtColor) || (this.config && this.config.primaryColor) || '';
      const pants = (this.config && this.config.vlibrasPantsColor) || '';
      const logo = (this.config && this.config.vlibrasLogoUrl) || '';

      // Se o cliente definiu uma URL direta de arquivo .json de personalização
      if (logo && /\.json(\?.*)?$/i.test(logo)) {
        return logo;
      }

      // Gera um JSON compatível com o schema oficial do VLibras (https://vlibras.gov.br/config/default_logo.json)
      const customConfig = {
        calca: pants || '#201E62',
        camisa: shirt || '#7956c2',
        cabelo: '#000000',
        corpo: '#C18471',
        iris: '#000000',
        olhos: '#FFFFFF',
        sombrancelhas: '#000000',
        pos: 'center',
        logo: logo || 'https://vlibras.gov.br/config/img/gov_br_original.png'
      };

      try {
        const jsonStr = JSON.stringify(customConfig);
        if (this._lastVlibrasJsonStr === jsonStr && this._vlibrasPersonalizationBlobUrl) {
          return this._vlibrasPersonalizationBlobUrl;
        }
        if (this._vlibrasPersonalizationBlobUrl && typeof URL !== 'undefined' && URL.revokeObjectURL) {
          try { URL.revokeObjectURL(this._vlibrasPersonalizationBlobUrl); } catch (e) {}
        }
        if (typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
          const blob = new Blob([jsonStr], { type: 'application/json' });
          this._vlibrasPersonalizationBlobUrl = URL.createObjectURL(blob);
          this._lastVlibrasJsonStr = jsonStr;
          return this._vlibrasPersonalizationBlobUrl;
        }
      } catch (e) {}
      return '';
    }

    /**
     * Sincroniza o intérprete escolhido (Hosana por padrão, Ícaro ou Guga) e o uniforme personalizado
     * no storage do VLibras, no objeto global window.VLibrasWidget e no player 3D ativo em tempo real.
     */
    syncVLibrasAvatar(avatar) {
      const VLIBRAS_APP_URL = 'https://vlibras.gov.br/app';
      const validAvatar = ['hosana', 'icaro', 'guga'].includes(avatar) ? avatar : 'hosana';
      const posCode = (this.config && this.config.position === 'left') ? 'R' : 'L';
      const personalizationUrl = this.getVLibrasPersonalizationUrl();

      try {
        let playerStore = {
          state: {
            speed: 1,
            showSubtitles: true,
            avatar: validAvatar,
            config: { baseUrl: '', personalizationUrl: personalizationUrl }
          },
          version: 1
        };
        const existing = localStorage.getItem('@vlibras/player');
        if (existing) {
          const parsed = JSON.parse(existing);
          if (parsed && typeof parsed === 'object') {
            parsed.state = Object.assign(
              { speed: 1, showSubtitles: true, config: { baseUrl: '', personalizationUrl: personalizationUrl } },
              parsed.state || {},
              {
                avatar: validAvatar,
                config: Object.assign({}, (parsed.state && parsed.state.config) || {}, {
                  personalizationUrl: personalizationUrl
                })
              }
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
          position: posCode,
          personalization: personalizationUrl
        });

        try {
          if (window.plugin && window.plugin.player) {
            if (typeof window.plugin.player.changeAvatar === 'function') {
              window.plugin.player.changeAvatar(validAvatar);
            }
            if (personalizationUrl) {
              if (typeof window.plugin.player.setPersonalization === 'function') {
                window.plugin.player.setPersonalization(personalizationUrl);
              } else if (window.plugin.player.player && typeof window.plugin.player.player.SendMessage === 'function') {
                window.plugin.player.player.SendMessage('CustomizationBridge', 'setURL', personalizationUrl);
              }
            }
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
     * posição sincronizada no lado oposto ao do Allyada e ícone da Hosana/avatar ativo.
     */
    applyVLibrasCustomTheme() {
      if (typeof document === 'undefined') return;
      const VLIBRAS_APP_URL = 'https://vlibras.gov.br/app';
      const validAvatar = ['hosana', 'icaro', 'guga'].includes(this.state.vlibrasAvatar) ? this.state.vlibrasAvatar : 'hosana';
      const allyadaIsLeft = (this.config && this.config.position === 'left');
      // Posiciona o VLibras sempre no lado OPOSTO ao do Allyada
      const vlibrasIsLeft = !allyadaIsLeft;
      const side = vlibrasIsLeft ? 'left' : 'right';
      const opposite = vlibrasIsLeft ? 'right' : 'left';
      const vlibrasColor = (this.config && this.config.vlibrasColor) ? this.config.vlibrasColor : '#7956c2';
      if (typeof window !== 'undefined' && window.VLibrasWidget) {
        window.VLibrasWidget.position = vlibrasIsLeft ? 'L' : 'R';
      }

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
            bottom: 24px !important;
            top: auto !important;
            ${side}: 24px !important;
            ${opposite}: auto !important;
            flex-direction: ${vlibrasIsLeft ? 'row-reverse' : 'row'} !important;
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
      // Sempre no lado OPOSTO ao do Allyada ('L' quando o Allyada está na direita, 'R' quando o Allyada está na esquerda)
      const posCode = (this.config && this.config.position === 'left') ? 'R' : 'L';
      const personalizationUrl = this.getVLibrasPersonalizationUrl();

      this.syncVLibrasAvatar(validAvatar);

      // Garante que window.VLibrasWidget preserve a propriedade .path exigida pelo VLibras v7.12.2+
      window.VLibrasWidget = Object.assign({ path: VLIBRAS_APP_URL }, window.VLibrasWidget || {}, {
        path: VLIBRAS_APP_URL,
        avatar: validAvatar,
        position: posCode,
        personalization: personalizationUrl
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
          window.VLibrasWidget.personalization = personalizationUrl;
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
              position: posCode,
              personalization: personalizationUrl
            });
          } catch(e) {}
        }
        if (window.VLibrasWidget) {
          window.VLibrasWidget.path = VLIBRAS_APP_URL;
          window.VLibrasWidget.avatar = currentAvatar;
          window.VLibrasWidget.position = posCode;
          window.VLibrasWidget.personalization = personalizationUrl;
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
                position: posCode,
                personalization: personalizationUrl
              });
            } catch(e) {}
            if (window.VLibrasWidget) {
              window.VLibrasWidget.path = VLIBRAS_APP_URL;
              window.VLibrasWidget.avatar = currentAvatar;
              window.VLibrasWidget.position = posCode;
              window.VLibrasWidget.personalization = personalizationUrl;
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
        .btn-studio-icon {
          display: inline-flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 3px !important;
          padding: 6px 4px !important;
          font-size: 10.5px !important;
        }
        .btn-studio-icon svg {
          width: 18px !important;
          height: 18px !important;
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
          top: auto;
          z-index: 2147483645;
          transition: top 0.25s ease, bottom 0.25s ease;
        }
        .allyada-wrapper.vpos-middle {
          top: calc(50vh - 32px);
          bottom: auto;
        }
        .allyada-wrapper.vpos-top {
          top: 24px;
          bottom: auto;
        }
        .pos-right { right: 24px; }
        .pos-left { left: 24px; }

        .premium-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 999px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border: 1px solid #f59e0b;
          box-shadow: 0 2px 6px rgba(245, 158, 11, 0.18);
        }
        .premium-pill-mini {
          display: inline-flex;
          align-items: center;
          font-size: 10.5px;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 999px;
          background: linear-gradient(135deg, #7956c2 0%, #5e3ea1 100%);
          color: #ffffff;
          letter-spacing: 0.03em;
        }
        .premium-setting-card {
          border: 1.5px solid #dcd0f5 !important;
          background: linear-gradient(180deg, #faf8ff 0%, #ffffff 100%) !important;
        }

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
        .allyada-wrapper.vpos-middle .allyada-drawer {
          top: var(--allyada-drawer-center-top, calc(50vh / var(--allyada-ui-scale, 1)));
          bottom: auto;
          transform: translateY(-50%) scale(0.98);
        }
        .allyada-wrapper.vpos-middle .allyada-drawer.open {
          transform: translateY(-50%) scale(1);
        }
        .allyada-wrapper.vpos-top .allyada-drawer {
          top: var(--allyada-drawer-bottom, calc(96px / var(--allyada-ui-scale, 1)));
          bottom: auto;
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

        /* Perfis Humanos Premium (2 Colunas Compactas) */
        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .profile-card {
          padding: 11px 12px;
          border-radius: 13px;
          border: 1px solid var(--border-subtle);
          background: rgba(255, 255, 255, 0.72);
          cursor: pointer;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }
        .profile-card.profile-card-wide {
          grid-column: 1 / -1;
          flex-direction: row;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
        }
        .profile-wide-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }
        .profile-card:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.06);
        }
        .profile-card.active {
          background: rgba(121, 86, 194, 0.06);
          border-color: var(--border-active);
          box-shadow: 0 0 0 1px var(--border-active);
        }
        .profile-card.active::after {
          content: "✓";
          position: absolute;
          top: 8px;
          right: 8px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          color: #ffffff;
          background: var(--primary);
          border-radius: 50%;
        }
        .profile-card:focus-visible {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
        }
        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 7px;
          margin-bottom: 1px;
        }
        .card-icon-bubble {
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          border-radius: 8px;
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
        .card-icon-bubble svg { width: 17px; height: 17px; }
        .card-tag {
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
        .card-heading {
          font-size: 13.5px;
          font-weight: 800;
          color: var(--text-main);
          padding-right: 18px;
          line-height: 1.2;
        }
        .card-subtext {
          font-size: 11.5px;
          color: var(--text-secondary);
          line-height: 1.3;
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }
        .seg-btn svg {
          width: 15px;
          height: 15px;
          flex-shrink: 0;
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

        /* Personalização de Cores (Títulos, Texto e Fundo) */
        .custom-color-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .custom-color-group:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }
        .custom-color-row-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .custom-color-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .custom-color-swatches {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .custom-swatch-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          padding: 0;
          flex-shrink: 0;
        }
        .custom-swatch-btn:hover {
          transform: scale(1.12);
        }
        .custom-swatch-btn.active {
          outline: 3px solid var(--primary);
          outline-offset: 2px;
          transform: scale(1.08);
        }
        .swatch-picker {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px dashed #94a3b8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          background: conic-gradient(#ef4444, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444);
          color: #ffffff;
          flex-shrink: 0;
        }
        .swatch-picker svg {
          width: 14px;
          height: 14px;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.6));
          pointer-events: none;
        }
        .swatch-picker input[type="color"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          border: none;
        }
        .btn-mini-reset {
          border: 1px solid #fca5a5;
          background: #fef2f2;
          color: #dc2626;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-mini-reset:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        /* Cards de Ferramentas com Toggle (Linear List e Grade 2x2 Compacta) */
        .tools-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .tools-grid-2col {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }
        .tools-grid-2col .tool-card {
          padding: 10px 10px;
          min-height: 54px;
          gap: 8px;
        }
        .tools-grid-2col .tool-icon-box {
          width: 28px;
          height: 28px;
          border-radius: 7px;
        }
        .tools-grid-2col .tool-title {
          font-size: 13px;
        }
        .tools-grid-2col .tool-desc {
          font-size: 11px;
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
        .heading-level-pill.h4, .heading-level-pill.h5, .heading-level-pill.h6 { background: #e0f2fe; color: #0369a1; }
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

        /* Modal Flutuante Compacto de Estrutura da Página (Ancorado na Lateral) */
        .allyada-structure-modal {
          position: fixed;
          bottom: 88px;
          right: 24px;
          left: auto;
          top: auto;
          transform: translateY(10px) scale(0.97);
          width: min(340px, calc(100vw - 32px));
          max-height: min(430px, calc(100vh - 116px));
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid #cbd5e1;
          box-shadow: 0 18px 38px -10px rgba(15, 23, 42, 0.26), 0 0 0 1px rgba(121, 86, 194, 0.14);
          display: flex;
          flex-direction: column;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2147483647;
          overflow: hidden;
        }
        .allyada-wrapper.pos-left .allyada-structure-modal {
          left: 24px;
          right: auto;
        }
        .allyada-structure-modal.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0) scale(1);
        }
        .allyada-wrapper.vpos-middle .allyada-structure-modal {
          top: 50vh;
          bottom: auto;
          transform: translateY(-50%) scale(0.97);
        }
        .allyada-wrapper.vpos-middle .allyada-structure-modal.open {
          transform: translateY(-50%) scale(1);
        }
        .allyada-wrapper.vpos-top .allyada-structure-modal {
          top: 96px;
          bottom: auto;
        }
        .structure-modal-header {
          background: var(--primary);
          color: #ffffff;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-shrink: 0;
        }
        .structure-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .structure-header-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #ffffff;
        }
        .structure-header-icon svg {
          width: 18px;
          height: 18px;
          display: block;
        }
        .structure-title-group h3 {
          font-size: 14.5px;
          font-weight: 800;
          color: #ffffff;
          margin: 0;
          line-height: 1.2;
        }
        .structure-subtitle {
          display: block;
          font-size: 11.5px;
          color: rgba(255, 255, 255, 0.86);
          margin-top: 2px;
          line-height: 1.2;
        }
        .structure-header-actions {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .btn-structure-back {
          height: 30px;
          padding: 0 10px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .btn-structure-back:hover {
          background: rgba(255, 255, 255, 0.28);
        }
        .btn-structure-back svg {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }
        .structure-modal-header .btn-icon-close {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          border: none;
          background: rgba(255, 255, 255, 0.16);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .structure-modal-header .btn-icon-close:hover {
          background: rgba(255, 255, 255, 0.28);
        }
        .structure-modal-header .btn-icon-close svg {
          width: 16px;
          height: 16px;
        }
        .structure-tabs {
          display: flex;
          background: #f1f5f9;
          padding: 5px;
          gap: 4px;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .struct-tab-btn {
          flex: 1;
          padding: 7px 8px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #475569;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .struct-tab-btn:hover {
          color: #0f172a;
          background: rgba(255, 255, 255, 0.5);
        }
        .struct-tab-btn.active {
          background: #ffffff;
          color: var(--primary);
          box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
        }
        .structure-search-row {
          padding: 10px 12px 6px 12px;
          background: #ffffff;
          flex-shrink: 0;
        }
        .structure-search-row input.search-input-field {
          width: 100%;
          box-sizing: border-box;
          padding: 8px 12px 8px 36px;
          border-radius: 9px;
          border: 1px solid #cbd5e1;
          font-size: 12.5px;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .structure-search-row input.search-input-field:focus {
          border-color: var(--primary);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(121, 86, 194, 0.15);
        }
        .structure-modal-body {
          padding: 8px 12px 12px 12px;
          overflow-y: auto;
          flex: 1;
          max-height: 280px;
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
        .tts-voice-row {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 100%;
        }
        .tts-voice-select {
          width: 100%;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #0f172a;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }
        .tts-voice-select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(121, 86, 194, 0.2);
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
