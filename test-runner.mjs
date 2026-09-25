import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:8080/demo/index.html';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('🚀 Iniciando bateria completa de testes no Chrome Headless...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--user-data-dir=C:\\Users\\sarah\\AppData\\Local\\Temp\\allyada_test_cdp_full',
    '--no-first-run',
    '--no-default-browser-check',
    '--disk-cache-size=1',
    '--autoplay-policy=no-user-gesture-required',
    URL
  ]);

  let wsUrl = null;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:9222/json');
      const list = await res.json();
      const page = list.find(p => p.type === 'page' && p.url.includes('localhost:8080'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
    await sleep(300);
  }

  if (!wsUrl) {
    console.error('❌ Falha ao conectar ao Chrome CDP.');
    chrome.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  let msgId = 1;
  const callbacks = new Map();
  const pageErrors = [];
  const local404Errors = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Runtime.exceptionThrown') {
      pageErrors.push(data.params.exceptionDetails);
      console.error('  [Page Exception!]:', data.params.exceptionDetails.text, data.params.exceptionDetails.exception?.description);
    }
    if (data.method === 'Log.entryAdded') {
      const entry = data.params.entry;
      if (entry.level === 'error' && entry.url && entry.url.includes('localhost:8080')) {
        local404Errors.push(`${entry.text} -> ${entry.url}`);
        console.error('  [Local 404/Net Error!]:', entry.text, entry.url);
      }
    }
    if (data.id && callbacks.has(data.id)) {
      const resolve = callbacks.get(data.id);
      callbacks.delete(data.id);
      resolve(data);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    const id = msgId++;
    return new Promise((resolve) => {
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.result?.exceptionDetails) {
      console.error('  Eval Exception:', res.result.exceptionDetails);
    }
    return res.result?.result?.value;
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');
  await send('Log.enable');

  await sleep(1000);

  // 0. Limpa estado inicial para garantir teste limpo
  await evaluate(`
    (() => {
      localStorage.clear();
      window.Allyada.resetState();
    })()
  `);
  await sleep(300);

  let passed = 0;
  let total = 0;
  function assert(name, condition, extra = '') {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${name} ${extra}`);
    } else {
      console.error(`  ❌ [FAIL] ${name} ${extra}`);
    }
  }

  console.log('\n--- 1. Painel e Acessibilidade do Componente ---');
  await evaluate('window.Allyada.openPanel()');
  await sleep(300);
  assert('Painel aberto via openPanel()', await evaluate('window.Allyada.isOpen'));
  assert('Painel com aria-hidden false', await evaluate('window.Allyada.shadowRoot.getElementById("allyada-panel").getAttribute("aria-hidden") === "false"'));
  
  await evaluate('window.Allyada.closePanel()');
  await sleep(300);
  assert('Painel fechado via closePanel()', !await evaluate('window.Allyada.isOpen'));
  
  await evaluate('window.Allyada.openPanel()');
  await sleep(300);

  console.log('\n--- 2. Modos de Apresentação (Perfis) ---');
  // Modo Foco
  await evaluate('window.Allyada.shadowRoot.getElementById("profile-focus").click()');
  await sleep(200);
  assert('Modo Foco ativado', await evaluate('window.Allyada.state.activeProfile === "focus" && window.Allyada.state.readingGuideMode === "ruler" && window.Allyada.state.stopAnimations === true'));

  // Modo Ampliação
  await evaluate('window.Allyada.shadowRoot.getElementById("profile-zoom").click()');
  await sleep(200);
  assert('Modo Ampliação ativado', await evaluate('window.Allyada.state.activeProfile === "zoom" && window.Allyada.state.fontSizeLevel === 2 && window.Allyada.state.contrast === "dark"'));

  // Modo Leitura
  await evaluate('window.Allyada.shadowRoot.getElementById("profile-reading").click()');
  await sleep(200);
  assert('Modo Leitura ativado', await evaluate('window.Allyada.state.activeProfile === "reading" && window.Allyada.state.dyslexicFont === true && window.Allyada.state.textAlignLeft === true'));

  // Modo Cores
  await evaluate('window.Allyada.shadowRoot.getElementById("profile-colors").click()');
  await sleep(200);
  assert('Modo Cores ativado', await evaluate('window.Allyada.state.activeProfile === "colors" && window.Allyada.state.highlightLinks === true'));

  console.log('\n--- 3. Redefinir Preferências ---');
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-reset-fixed").click()');
  await sleep(300);
  const isReset = await evaluate(`
    (() => {
      const s = window.Allyada.state;
      return s.activeProfile === null && s.fontSizeLevel === 0 && s.contrast === 'normal' && !s.dyslexicFont && !s.highlightLinks && s.readingGuideMode === 'none';
    })()
  `);
  assert('Botão fixo "Redefinir" restaurou padrões', isReset);

  console.log('\n--- 4. Leitura em Voz Alta (TTS) ---');
  // Antes de clicar: player oculto
  const ttsHiddenBefore = await evaluate(`
    (() => {
      const s = window.Allyada.shadowRoot;
      return s.getElementById('tts-quick-controls').style.display === 'none' && s.getElementById('tts-player-panel').style.display === 'none';
    })()
  `);
  assert('Player e velocidades ocultos antes de ouvir', ttsHiddenBefore);

  // Clica em Ouvir Página
  await evaluate('window.Allyada.shadowRoot.getElementById("card-tts-toggle").click()');
  await sleep(500);
  const ttsActive = await evaluate(`
    (() => {
      const s = window.Allyada.shadowRoot;
      return window.Allyada.isSpeaking && s.getElementById('tts-player-panel').style.display === 'flex';
    })()
  `);
  assert('Player exibido após clicar em Ouvir Página', ttsActive);

  // Pausar Leitura
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-tts-play-pause").click()');
  await sleep(300);
  assert('Pausar leitura funcional', await evaluate('window.Allyada.isSpeechPaused && window.Allyada.shadowRoot.getElementById("tts-play-label").textContent === "Continuar"'));

  // Continuar Leitura
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-tts-play-pause").click()');
  await sleep(1000);
  assert('Continuar leitura funcional', await evaluate('!window.Allyada.isSpeechPaused && window.Allyada.shadowRoot.getElementById("tts-play-label").textContent === "Pausar"'));

  // Alterar velocidade para 1.5x e verificar que NÃO recomeça do início
  await evaluate('window.Allyada.shadowRoot.getElementById("rate-150").click()');
  await sleep(300);
  const rateResumeCheck = await evaluate(`
    (() => {
      return {
        rate: window.Allyada.state.speechRate,
        baseOffset: window.Allyada.utteranceBaseOffset,
        remLen: window.Allyada.currentSpeakingText ? window.Allyada.currentSpeakingText.length : 0,
        fullLen: window.Allyada.fullSpeakingText ? window.Allyada.fullSpeakingText.length : 0
      };
    })()
  `);
  assert(
    'Velocidade 1.5x continua do ponto atual (sem voltar ao início)',
    rateResumeCheck.rate === 1.5 && rateResumeCheck.baseOffset > 0 && rateResumeCheck.remLen < rateResumeCheck.fullLen,
    `(offset: ${rateResumeCheck.baseOffset} chars, restante: ${rateResumeCheck.remLen}/${rateResumeCheck.fullLen})`
  );

  // Parar Leitura
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-tts-stop").click()');
  await sleep(300);
  const ttsStopped = await evaluate(`
    (() => {
      const s = window.Allyada.shadowRoot;
      return !window.Allyada.isSpeaking && s.getElementById('tts-player-panel').style.display === 'none';
    })()
  `);
  assert('Botão Parar interrompe fala e oculta player', ttsStopped);

  console.log('\n--- 5. VLibras ---');
  // Verifica que Hosana é a intérprete padrão
  const defaultHosana = await evaluate(`
    (() => {
      const s = window.Allyada.shadowRoot;
      const hosanaBtn = s.getElementById('btn-vlibras-hosana');
      return window.Allyada.state.vlibrasAvatar === 'hosana' &&
             hosanaBtn && hosanaBtn.classList.contains('active') &&
             hosanaBtn.getAttribute('aria-pressed') === 'true';
    })()
  `);
  assert('Hosana configurada como intérprete 3D padrão do VLibras', defaultHosana);

  // Ativa VLibras (e verifica que o painel do Allyada fecha automaticamente para não ficar atrás/atrapalhando)
  await evaluate('window.Allyada.shadowRoot.getElementById("card-vlibras-toggle").click()');
  await sleep(1500);
  const vlibrasOn = await evaluate(`
    (() => {
      return window.Allyada.state.vlibrasActive &&
             !window.Allyada.isOpen &&
             !!document.querySelector('[vw]') &&
             document.querySelector('[vw]').style.display !== 'none' &&
             window.VLibrasWidget &&
             window.VLibrasWidget.path === 'https://vlibras.gov.br/app' &&
             window.VLibrasWidget.avatar === 'hosana' &&
             window.VLibrasWidget.position === 'L';
    })()
  `);
  assert('VLibras ativado no lado oposto ao do Allyada com Hosana e painel fechado automaticamente', vlibrasOn);

  // Reabre o painel do Allyada para continuar os testes
  await evaluate('window.Allyada.openPanel()');
  await sleep(200);

  // Verifica injeção do tema personalizado do Allyada no VLibras (cor #7956c2 + ocultar Emoções) e sincronização no localStorage
  const vlibrasCustomThemeAndStorage = await evaluate(`
    (() => {
      const appRoot = document.getElementById('vlibras-app-root');
      const accessWrap = document.getElementById('vlibras-access-wrapper');
      const appStyle = appRoot && appRoot.shadowRoot ? appRoot.shadowRoot.getElementById('allyada-vlibras-custom-theme') : null;
      const accessStyle = accessWrap && accessWrap.shadowRoot ? accessWrap.shadowRoot.getElementById('allyada-vlibras-access-theme') : null;
      const css = (appStyle ? appStyle.textContent : '') + (accessStyle ? accessStyle.textContent : '');
      const hasLilacTheme = css.includes('#7956c2');
      const rawStore = localStorage.getItem('@vlibras/player');
      const parsed = rawStore ? JSON.parse(rawStore) : null;
      const fabSvg = window.Allyada.shadowRoot.querySelector('.fab-icon svg');
      const hasNewSymbol = !!(fabSvg && fabSvg.getAttribute('viewBox') === '0 0 100 100' && fabSvg.querySelectorAll('circle').length === 5);
      return hasLilacTheme && hasNewSymbol && parsed && parsed.state && parsed.state.avatar === 'hosana';
    })()
  `);
  assert('Novo símbolo do Allyada aplicado, VLibras personalizado com lilás (#7956c2) e Hosana sincronizada', vlibrasCustomThemeAndStorage);

  // Testa troca de intérprete (Ícaro -> Hosana) pelo painel do Allyada
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-vlibras-icaro").click()');
  await sleep(200);
  const switchedToIcaro = await evaluate(`
    (() => {
      const parsed = JSON.parse(localStorage.getItem('@vlibras/player') || '{}');
      return window.Allyada.state.vlibrasAvatar === 'icaro' &&
             window.VLibrasWidget.avatar === 'icaro' &&
             parsed.state && parsed.state.avatar === 'icaro';
    })()
  `);
  assert('Seletor de intérprete alterna para Ícaro em tempo real', switchedToIcaro);

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-vlibras-hosana").click()');
  await sleep(200);
  const switchedBackToHosana = await evaluate(`
    (() => {
      const parsed = JSON.parse(localStorage.getItem('@vlibras/player') || '{}');
      return window.Allyada.state.vlibrasAvatar === 'hosana' &&
             window.VLibrasWidget.avatar === 'hosana' &&
             parsed.state && parsed.state.avatar === 'hosana';
    })()
  `);
  assert('Seletor de intérprete retorna para Hosana em tempo real', switchedBackToHosana);

  assert('Zero erros 404 de assets/fontes/unity no console ao ativar VLibras', local404Errors.length === 0, local404Errors.length ? JSON.stringify(local404Errors) : '');

  // Simula recarregamento de estado (loadState) e verifica que VLibras não abre sozinho ao abrir a página
  const noAutoOpenOnLoad = await evaluate(`
    (() => {
      window.Allyada.loadState();
      return window.Allyada.state.vlibrasActive === false;
    })()
  `);
  assert('VLibras inicia desativado ao abrir a página (não abre sozinho)', noAutoOpenOnLoad);

  // Garante desativação visual completa
  await evaluate('window.Allyada.hideVLibras(); window.Allyada.updatePanelUI();');
  await sleep(300);
  const vlibrasOff = await evaluate(`
    (() => {
      return !window.Allyada.state.vlibrasActive && document.querySelector('[vw]').style.display === 'none';
    })()
  `);
  assert('VLibras desativado e container [vw] oculto', vlibrasOff);

  console.log('\n--- 6. Tipografia e Ajustes Manuais ---');
  // Aumentar tamanho de fonte via stepper
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-font-increase").click()');
  await sleep(200);
  assert('Aumento de fonte via stepper (+15%)', await evaluate('window.Allyada.state.fontSizeLevel === 1'));

  // Definir tamanho 200% (nível 6)
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-fs-6").click()');
  await sleep(200);
  assert('Tamanho máximo 200% (WCAG 1.4.4) selecionado', await evaluate('window.Allyada.state.fontSizeLevel === 6'));

  // Espaçamento WCAG 1.4.12
  await evaluate('window.Allyada.shadowRoot.getElementById("card-wcag-spacing").click()');
  await sleep(200);
  assert('Espaçamento WCAG 1.4.12 aplicado', await evaluate('window.Allyada.state.wcagSpacing && document.documentElement.classList.contains("ally-wcag-spacing")'));

  // Fonte Lexend
  await evaluate('window.Allyada.shadowRoot.getElementById("card-dyslexic-font").click()');
  await sleep(200);
  assert('Fonte Lexend aplicada', await evaluate('window.Allyada.state.dyslexicFont && document.documentElement.classList.contains("ally-dyslexic-font")'));

  // Contraste Invertido
  await evaluate('window.Allyada.shadowRoot.getElementById("card-contrast-invert").click()');
  await sleep(200);
  assert('Contraste Invertido aplicado', await evaluate('window.Allyada.state.contrast === "invert" && document.documentElement.classList.contains("ally-contrast-invert")'));

  // Foco reforçado
  await evaluate('window.Allyada.shadowRoot.getElementById("card-enhanced-focus").click()');
  await sleep(200);
  assert('Foco reforçado duplo contraste aplicado', await evaluate('window.Allyada.state.enhancedFocus && document.documentElement.classList.contains("ally-enhanced-focus")'));

  // Cursores Grande (44px) e Extra (60px) sem borda branca + Cor Roxo (#7956c2) do Allyada
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-cursor-large").click()');
  await sleep(150);
  const largeCursorCheck = await evaluate(`
    (() => {
      const css = (document.getElementById('allyada-dynamic-styles') || {}).textContent || '';
      return window.Allyada.state.cursorSize === 'large' &&
             css.includes("width='44' height='44'") &&
             !css.includes("stroke='%23ffffff'");
    })()
  `);
  assert('Cursor Grande (44px) proporcional e sem borda branca', largeCursorCheck);

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-cursor-xlarge").click()');
  await sleep(150);
  const xlargeCursorCheck = await evaluate(`
    (() => {
      const css = (document.getElementById('allyada-dynamic-styles') || {}).textContent || '';
      return window.Allyada.state.cursorSize === 'xlarge' &&
             css.includes("width='60' height='60'") &&
             !css.includes("stroke='%23ffffff'") &&
             window.Allyada.config.primaryColor === '#7956c2';
    })()
  `);
  assert('Cursor Extra (60px) sem borda branca e cor principal do Allyada em roxo (#7956c2)', xlargeCursorCheck);

  // Redefinir Tudo final
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-reset-fixed").click()');
  await sleep(300);
  assert('Redefinição final com sucesso', await evaluate('window.Allyada.state.fontSizeLevel === 0 && window.Allyada.state.contrast === "normal" && !window.Allyada.state.wcagSpacing'));

  console.log('\n--- 7. Tamanho do Widget Responsivo à Tela (Multi-Viewport) ---');
  const viewports = [
    { name: 'Desktop Full HD (1920x1080)', width: 1920, height: 1080, mobile: false },
    { name: 'Notebook (1366x768)', width: 1366, height: 768, mobile: false },
    { name: 'Tela Compacta (1024x600)', width: 1024, height: 600, mobile: false },
    { name: 'Mobile (375x667)', width: 375, height: 667, mobile: true }
  ];
  const scales = [
    { id: 'btn-scale-090', val: '0.9', label: 'Compacto (90%)' },
    { id: 'btn-scale-100', val: '1', label: 'Normal (100%)' },
    { id: 'btn-scale-115', val: '1.15', label: 'Grande (115%)' },
    { id: 'btn-scale-130', val: '1.3', label: 'Muito Grande (130%)' }
  ];

  await evaluate('window.Allyada.shadowRoot.getElementById("tab-btn-settings").click()');
  await sleep(200);

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });
    await evaluate('window.dispatchEvent(new Event("resize"))');
    await sleep(150);

    for (const sc of scales) {
      await evaluate(`window.Allyada.shadowRoot.getElementById("${sc.id}").click()`);
      await sleep(150);
      const metrics = await evaluate(`
        (() => {
          const panel = window.Allyada.shadowRoot.getElementById('allyada-panel');
          const rect = panel.getBoundingClientRect();
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          return {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            bottom: Math.round(rect.bottom),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            vw,
            vh,
            uiScale: window.Allyada.state.uiScale
          };
        })()
      `);
      const fitsViewport =
        metrics.top >= 8 &&
        metrics.left >= 8 &&
        metrics.right <= metrics.vw - 8 &&
        metrics.bottom <= metrics.vh - 8 &&
        metrics.uiScale === sc.val;
      assert(
        `[${vp.name}] Escala ${sc.label} cabe 100% na tela`,
        fitsViewport,
        `(box: ${metrics.width}x${metrics.height}, top:${metrics.top}, bottom:${metrics.bottom}/${metrics.vh}, left:${metrics.left}, right:${metrics.right}/${metrics.vw})`
      );
    }
  }

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-reset-fixed").click()');
  await sleep(200);
  assert('Botão Redefinir restaura tamanho do painel para Normal (100%)', await evaluate('window.Allyada.state.uiScale === "1"'));

  // Verificar que nenhum card ou control-box estoura horizontalmente o painel
  await send('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await evaluate('window.Allyada.shadowRoot.getElementById("tab-btn-foryou").click()');
  await sleep(200);
  const overflowCheck = await evaluate(`
    (() => {
      const root = window.Allyada.shadowRoot;
      const panelRect = root.getElementById('allyada-panel').getBoundingClientRect();
      const cards = Array.from(root.querySelectorAll('.tool-card, .control-box'));
      const overflowing = [];
      for (const el of cards) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > panelRect.right + 1 || r.left < panelRect.left - 1)) {
          overflowing.push(el.id || el.className);
        }
      }
      const wcagRect = root.getElementById('card-wcag-spacing').getBoundingClientRect();
      const wordRect = root.getElementById('card-word-spacing').getBoundingClientRect();
      return {
        overflowing,
        wcagWidth: Math.round(wcagRect.width),
        wordWidth: Math.round(wordRect.width),
        sameWidth: wcagRect.width > 0 && Math.abs(wcagRect.width - wordRect.width) <= 1
      };
    })()
  `);
  assert(
    'Card Espaçamento WCAG 1.4.12 e todos os cards alinhados sem estourar a largura do painel',
    overflowCheck.overflowing.length === 0 && overflowCheck.sameWidth,
    `(wcagWidth: ${overflowCheck.wcagWidth}px, wordWidth: ${overflowCheck.wordWidth}px, overflowing: ${overflowCheck.overflowing.join(', ') || 'nenhum'})`
  );

  console.log('\n--- 8. Sincronização Automática com Iframes ---');
  await evaluate(`
    (() => {
      const iframe = document.createElement('iframe');
      iframe.id = 'test-allyada-iframe';
      iframe.style.cssText = 'width: 400px; height: 180px; border: 1px solid #ccc;';
      document.body.appendChild(iframe);
      const idoc = iframe.contentDocument;
      idoc.open();
      idoc.write('<!DOCTYPE html><html><head></head><body><h2 id="iframe-h2">Subtítulo Exclusivo do Iframe</h2><p id="iframe-p" style="font-size: 16px;">Texto interno do quadro embutido para leitura assistiva.</p><input type="text" id="iframe-input" /></body></html>');
      idoc.close();
      window.Allyada.bindSingleIframe(iframe);
    })()
  `);
  await sleep(250);

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-fs-6").click()');
  await evaluate('window.Allyada.shadowRoot.getElementById("card-wcag-spacing").click()');
  await evaluate('window.Allyada.shadowRoot.getElementById("card-contrast-dark").click()');
  await sleep(250);

  const iframeSync = await evaluate(`
    (() => {
      const iframe = document.getElementById('test-allyada-iframe');
      const idoc = iframe.contentDocument;
      const pFont = idoc.getElementById('iframe-p').style.fontSize;
      const hasDark = idoc.documentElement.classList.contains('ally-contrast-dark');
      const hasWcag = idoc.documentElement.classList.contains('ally-wcag-spacing');
      const hasStyles = !!idoc.getElementById('allyada-host-styles');
      const extracted = window.Allyada.extractReadableText(document.body);
      return {
        pFont,
        hasDark,
        hasWcag,
        hasStyles,
        includesIframeText: extracted.includes('Texto interno do quadro embutido')
      };
    })()
  `);

  assert(
    'Estilos, contraste escuro, WCAG 1.4.12 e fonte 200% sincronizados dentro do iframe',
    iframeSync.hasStyles && iframeSync.hasDark && iframeSync.hasWcag && parseFloat(iframeSync.pFont) === 32,
    `(font: ${iframeSync.pFont}, dark: ${iframeSync.hasDark}, wcag: ${iframeSync.hasWcag})`
  );
  assert(
    'Leitor de voz (TTS) extrai texto de dentro do iframe automaticamente',
    iframeSync.includesIframeText
  );

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-reset-fixed").click()');
  await sleep(200);

  console.log('\n--- 9. Novos Recursos Inspirados no Rybená (Estrutura em Caixa, Cores Títulos/Texto/Fundo, Alinhamento Completo, Descrever Imagens IA e Voz Natural) ---');

  // 9.1 Alinhamento Completo do Texto (Esquerda, Centro, Direita, Justificado)
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-align-center").click()');
  await sleep(150);
  assert(
    'Alinhamento Centralizado aplicado na página',
    await evaluate('window.Allyada.state.textAlign === "center" && document.documentElement.classList.contains("ally-text-align-center")')
  );

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-align-right").click()');
  await sleep(150);
  assert(
    'Alinhamento à Direita aplicado na página',
    await evaluate('window.Allyada.state.textAlign === "right" && document.documentElement.classList.contains("ally-text-align-right") && !document.documentElement.classList.contains("ally-text-align-center")')
  );

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-align-justify").click()');
  await sleep(150);
  assert(
    'Alinhamento Justificado aplicado na página',
    await evaluate('window.Allyada.state.textAlign === "justify" && document.documentElement.classList.contains("ally-text-align-justify")')
  );

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-align-left").click()');
  await sleep(150);
  assert(
    'Alinhamento à Esquerda aplicado e sincronizado com textAlignLeft',
    await evaluate('window.Allyada.state.textAlign === "left" && window.Allyada.state.textAlignLeft === true && document.documentElement.classList.contains("ally-text-align-left")')
  );

  // 9.2 Personalização de Cores de Títulos, Texto e Fundo
  await evaluate(`
    (() => {
      const root = window.Allyada.shadowRoot;
      root.querySelector('.custom-swatch-btn[data-target="title"][data-color="#7956c2"]').click();
      root.querySelector('.custom-swatch-btn[data-target="text"][data-color="#0f172a"]').click();
      root.querySelector('.custom-swatch-btn[data-target="bg"][data-color="#fdf6e3"]').click();
    })()
  `);
  await sleep(200);
  const customColorsCheck = await evaluate(`
    (() => {
      const s = window.Allyada.state;
      const dynCss = (document.getElementById('allyada-dynamic-styles') || {}).textContent || '';
      return s.customTitleColor === '#7956c2' &&
             s.customTextColor === '#0f172a' &&
             s.customBgColor === '#fdf6e3' &&
             dynCss.includes('#7956c2') &&
             dynCss.includes('#0f172a') &&
             dynCss.includes('#fdf6e3');
    })()
  `);
  assert('Personalização independente de Cor dos Títulos, Cor do Texto e Cor do Fundo aplicada', customColorsCheck);

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-reset-custom-colors").click()');
  await sleep(150);
  assert(
    'Botão Restaurar limpa as cores personalizadas de Títulos, Texto e Fundo',
    await evaluate('!window.Allyada.state.customTitleColor && !window.Allyada.state.customTextColor && !window.Allyada.state.customBgColor')
  );

  // 9.3 Estrutura da Página em Caixa Flutuante Dedicada (Títulos, Regiões e Links + Busca)
  await evaluate('window.Allyada.shadowRoot.getElementById("btn-toggle-headings").click()');
  await sleep(250);
  const structModalOpened = await evaluate(`
    (() => {
      const modal = window.Allyada.shadowRoot.getElementById('allyada-structure-modal');
      const items = window.Allyada.shadowRoot.querySelectorAll('#headings-items-ul .btn-heading-target');
      return !window.Allyada.isOpen &&
             window.Allyada.isStructureOpen === true &&
             modal && modal.classList.contains('open') &&
             items.length > 0;
    })()
  `);
  assert('Estrutura da Página abre caixa flutuante dedicada, fecha o painel lateral e lista Títulos', structModalOpened);

  await evaluate('window.Allyada.shadowRoot.getElementById("struct-tab-landmarks").click()');
  await sleep(150);
  assert(
    'Aba Regiões da Estrutura da Página lista regiões semânticas da página',
    await evaluate('window.Allyada.activeStructureTab === "landmarks" && window.Allyada.shadowRoot.querySelectorAll("#headings-items-ul .btn-heading-target").length > 0')
  );

  await evaluate('window.Allyada.shadowRoot.getElementById("struct-tab-links").click()');
  await sleep(150);
  assert(
    'Aba Links da Estrutura da Página lista links navegáveis da página',
    await evaluate('window.Allyada.activeStructureTab === "links" && window.Allyada.shadowRoot.querySelectorAll("#headings-items-ul .btn-heading-target").length > 0')
  );

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-close-structure-modal").click()');
  await sleep(150);
  assert(
    'Fechar caixa de Estrutura da Página oculta o modal corretamente',
    await evaluate('!window.Allyada.isStructureOpen && !window.Allyada.shadowRoot.getElementById("allyada-structure-modal").classList.contains("open")')
  );

  // 9.4 Descrever Imagens (IA) + Voz Mais Natural e Humana (TTS)
  await evaluate('window.Allyada.openPanel()');
  await sleep(200);
  await evaluate('window.Allyada.shadowRoot.getElementById("card-image-inspector").click()');
  await sleep(200);
  const imgInspectorCheck = await evaluate(`
    (() => {
      const fig = document.createElement('figure');
      fig.id = 'test-ai-figure';
      fig.innerHTML = '<img id="test-ai-img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Equipe reunida analisando métricas de acessibilidade" /><figcaption>Relatório anual de inclusão digital 2026</figcaption>';
      document.body.appendChild(fig);
      const img = document.getElementById('test-ai-img');
      window.Allyada.showImageInspectorTooltip(img);
      const tooltip = document.getElementById('allyada-image-tooltip');
      const desc = window.Allyada.describeImageElement(img);
      return {
        active: window.Allyada.state.imageInspector,
        tooltipVisible: !!(tooltip && tooltip.style.display === 'block'),
        hasAlt: typeof desc === 'string' && desc.includes('Equipe reunida analisando métricas'),
        hasContext: typeof desc === 'string' && desc.includes('Relatório anual de inclusão digital 2026')
      };
    })()
  `);
  assert(
    'Descrever Imagens (IA) analisa imagem + contexto semântico e exibe tooltip flutuante com botão Ouvir',
    !!(imgInspectorCheck && imgInspectorCheck.active && imgInspectorCheck.tooltipVisible && imgInspectorCheck.hasAlt && imgInspectorCheck.hasContext)
  );

  const naturalVoiceCheck = await evaluate(`
    (() => {
      const sel1 = window.Allyada.shadowRoot.getElementById('select-tts-voice');
      const sel2 = window.Allyada.shadowRoot.getElementById('q-select-tts-voice');
      return !!sel1 && !!sel2 && typeof window.Allyada.getRankedPortugueseVoices === 'function';
    })()
  `);
  assert('Motor de Voz Natural/Humana (Neural/Online) e seletores de timbre presentes no TTS', naturalVoiceCheck);

  await evaluate('window.Allyada.shadowRoot.getElementById("btn-reset-fixed").click()');
  await sleep(200);

  console.log(`\n========================================`);
  console.log(`📊 RESULTADO FINAL: ${passed}/${total} testes passaram (${Math.round((passed/total)*100)}%)`);
  console.log(`🚨 Total de exceções na página: ${pageErrors.length}`);
  console.log(`========================================\n`);

  chrome.kill();
  process.exit(pageErrors.length === 0 && passed === total ? 0 : 1);
}

main().catch(err => {
  console.error('Erro na execução dos testes:', err);
  process.exit(1);
});
