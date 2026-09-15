# Allyada - Sua Aliada em Acessibilidade Web ♿✨

**Allyada** (em referência a *A11Y* e *Aliada*) é um plugin moderno, leve, modular e sem dependências externas para transformar qualquer website em um ambiente digital acessível, inclusivo e em total conformidade com a **Lei Brasileira de Inclusão (LBI)** e as diretrizes internacionais **WCAG 2.1 / 2.2**.

Inspirado nos pontos fortes da **Perto Digital**, **EqualWeb**, **VLibras** e **UserWay**, a **Allyada** se destaca pelo isolamento total via **Shadow DOM**, integração inteligente com o VLibras oficial sem sobreposição visual, e remediações não destrutivas de layout.

---

## 🚀 Como Instalar em Qualquer Site

Basta adicionar o arquivo `allyada.js` antes do fechamento da tag `</body>` do seu site:

```html
<!-- 1. Script da Allyada -->
<script src="path/to/dist/allyada.js"></script>

<!-- 2. Inicialização (Opcional) -->
<script>
  Allyada.init({
    position: 'right',        // 'right' ou 'left'
    primaryColor: '#0052cc',  // Cor do botão e do cabeçalho
    accentColor: '#ffab00',   // Cor de foco acessível
    shortcutKey: 'a'          // Atalho Alt + A para abrir/fechar
  });
</script>
```

> **Compatibilidade retroativa:** Se o seu código antigo chamar `AcessiWeb.init()`, ele continuará funcionando normalmente como um apelido para `Allyada.init()`.

---

## 🛠️ Recursos Aprimorados e Lapidados

### 1. Tipografia e Escalonamento Universal
- **Escalonador Dinâmico Universal:** Redimensiona títulos (`h1`-`h6`), parágrafos, botões, links e campos de formulário (`input`, `textarea`, `select`) proporcionalmente (100%, 115%, 130%, 145%) com travas visuais nos botões.
- **Fonte para Dislexia:** Aplica a tipografia **Lexend** (pesquisada cientificamente para fluência de leitura) preservando ícones e fontes de símbolos.
- **Espaçamentos de Entrelinhas e Letras:** Restritos estritamente aos blocos de leitura e parágrafos, sem deformar a barra de navegação nem logotipos.
- **Alinhamento à Esquerda Limpo:** Remove textos justificados sem quebrar banners centralizados.

### 2. Visão e Contraste Não Destrutivo
- **Alto Contraste Escuro (WCAG AAA):** Fundo `#121212`, texto `#f8fafc`, títulos em amarelo `#fde047` e links em azul celeste `#38bdf8`, mantendo a transparência e hierarquia de flexbox e grids.
- **Alto Contraste Claro:** Fundo branco puro com tipografia e bordas em preto reforçado.
- **Modo Monocromático:** Converte toda a página para escala de cinza para descanso sensorial.
- **Inversão Inteligente:** Inverte o DOM preservando imagens, vídeos e canvas, com o painel isolado fora do `<body>`.

### 3. Foco e Navegação
- **Guia / Régua de Leitura Suave:** Faixa translúcida com aceleração por `requestAnimationFrame` que segue o cursor ou toque sem latência, ideal para usuários com TDAH.
- **Destaque de Links com Contorno Âmbar:** Sublinhado e contorno luminoso de 3px que garantem visibilidade tanto em fundo claro quanto escuro.
- **Cursor Ampliado:** Cursor SVG preto com contorno branco visível em qualquer fundo.
- **Parar Animações:** Pausa instantaneamente animações CSS, transições e efeitos pulsantes.

### 4. Leitor de Tela Nativo com Realce Visual (TTS)
- Síntese de voz em português (`pt-BR`) via Web Speech API.
- Destaca o bloco de texto atualmente em leitura com uma borda dourada (`.allyada-reading-highlight`).

### 5. VLibras com Posicionamento Integrado
- Ativação sob demanda do avatar 3D oficial do VLibras (Governo Federal).
- **Posicionamento Harmonizado:** O botão flutuante do VLibras é posicionado automaticamente empilhado logo acima do botão da Allyada (`bottom: 92px`), evitando sobreposição ou bloqueio de cliques.

---

## ⌨️ Acessibilidade por Teclado

- <kbd>Alt</kbd> + <kbd>A</kbd>: Abre ou fecha o painel Allyada.
- <kbd>Esc</kbd>: Fecha o painel e devolve o foco para o elemento disparador.
- <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>: Navegação sequencial entre os botões.
- <kbd>Enter</kbd> / <kbd>Espaço</kbd>: Aciona o recurso selecionado.
