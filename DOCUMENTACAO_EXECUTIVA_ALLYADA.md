# ♿ ALLYADA — DOCUMENTAÇÃO EXECUTIVA, TÉCNICA & DE PRODUTO
**"Acessibilidade Web Inteligente, Tecnologia Assistiva com IA e Conformidade Legal (LBI & WCAG 2.2)"**

---

## 1. VISÃO GERAL DO PRODUTO

A **Allyada** é uma suíte completa de tecnologia assistiva e acessibilidade web projetada para tornar qualquer site, portal, sistema em `<iframe>`, cartório ou e-commerce imediatamente acessível para pessoas com deficiência visual, auditiva, motora, cognitiva ou neurodivergência (TDAH, Dislexia, Daltonismo, Epilepsia Fotossensível) e idosos.

Instalada com **apenas 1 linha de código (`<script>`)**, a Allyada opera de forma **100% isolada via Shadow DOM**, garantindo que **nenhum estilo ou cabeçalho do site original seja quebrado**.

---

## 2. ARQUITETURA DE UX/UI SÊNIOR (FOCO EM ACESSIBILIDADE REAL)

O painel da Allyada foi desenhado segundo princípios rigorosos de **Ergonomia Cognitiva** e **WCAG 2.2 Nível AAA**:
- **Zero Duplicação de Botões:** Cada ferramenta aparece em um único lugar lógico, reduzindo a fadiga visual e o número de cliques com `Tab`.
- **Ordem de Prioridade Clínica:** Os recursos mais urgentes ficam no topo da aba **Início**, seguidos pelos ajustes finos.
- **Barra de Busca Instantânea no Topo:** Permite localizar qualquer ferramenta digitando palavras simples (*"voz"*, *"libras"*, *"fonte"*, *"cor"*, *"cursor"*).
- **Botão Fixo de Emergência no Rodapé:** O botão vermelho **"Desfazer preferências"** fica sempre visível na base do painel para restaurar o site ao padrão original a qualquer instante.

---

## 3. CATÁLOGO COMPLETO DE FUNCIONALIDADES (POR SEÇÃO)

### 🥇 Seção 1: Perfis Prontos (1 Clique)
Combinações clínicas inteligentes que ativam múltiplos recursos simultaneamente com apenas um clique:
1. **Modo Ampliação (Baixa Visão):** Aumenta o texto em `130%`, ativa o contraste escuro confortável, destaca links clicáveis e ativa o **Cursor Grande (`44px`) na cor branca de alto contraste**.
2. **Leitura Fácil (Dislexia):** Aplica a fonte especializada **Lexend**, amplia o espaçamento entre linhas (`1.9x`) e entre letras, e alinha os parágrafos à esquerda.
3. **Modo Foco (TDAH / Concentração):** Ativa a **Régua Guia de Leitura**, congela animações/carrosséis que causam distração e ajusta o espaçamento textual.
4. **Sem Movimento (Calma / Epilepsia Fotossensível):** Bloqueia instantaneamente animações CSS, transições bruscas e vídeos em reprodução automática (WCAG 2.2.2).
5. **Modo Cores (Daltonismo):** Realça links e abre o seletor de filtros cromáticos SVG em tempo real para **Deuteranopia**, **Protanopia** e **Tritanopia**.

---

### 🥈 Seção 2: Guia de Foco, Teclado & Mouse
Ferramentas para auxílio motor, rastreamento ocular e navegação por teclado:
- **Régua Guia:** Faixa horizontal luminosa que acompanha o mouse, o toque na tela ou o foco da tecla `Tab`.
- **Máscara de Foco (`✨ PRO`):** Escurece o restante da página mantendo iluminada apenas a faixa de leitura atual.
- **Destacar Links:** Sublinha e contorna todos os links e botões interativos com alto contraste.
- **Foco Teclado (WCAG 2.4.13 AAA):** Adiciona contorno duplo de alta visibilidade ao navegar com a tecla `Tab`.
- **Teclado Virtual:** Teclado completo na tela para usuários que navegam apenas com mouse ou *head-tracker* preencherem formulários.
- **Sem Animação:** Pausa animações e vídeos em 1 clique.
- **Tamanho e Cor do Cursor:**
  - Três tamanhos calibrados: **Normal**, **Grande (`44px`)** e **Extra (`60px`)**.
  - **7 cores de alto contraste + Seletor Livre (Color Picker)**.
  - **Adaptação Inteligente ao Modo Escuro:** Se a página estiver com fundo escuro e o cursor estiver preto, ele muda automaticamente para branco com contorno duplo para nunca desaparecer na tela.

---

### 🥉 Seção 3: Voz, Libras & Estrutura (com IA Visual e OCR)
- **Tradutor de Libras (VLibras 3D Oficial):**
  - Sincronização inteligente: o avatar do VLibras posiciona-se automaticamente no **lado oposto** ao painel da Allyada (evitando sobreposição de botões) e fecha o menu da Allyada ao abrir.
- **Ler em Voz Alta (TTS Neural Contínuo):**
  - Seleciona automaticamente as **vozes neurais/humanas mais naturais em Português (`pt-BR`)** disponíveis no dispositivo.
  - **5 Velocidades (`0.75x`, `1x`, `1.25x`, `1.5x`, `2x`) com Retomada Exata:** Ao trocar a velocidade ou a voz, a leitura continua exatamente da palavra onde estava, sem voltar ao início do parágrafo.
  - **Modo Apontar e Ler:** Permite clicar em qualquer parágrafo ou imagem da página para ouvi-lo imediatamente.
- **Descrever Imagens com IA Visual + OCR (`✨ PRO`):**
  - **Visão Computacional Neural no Navegador (`TensorFlow.js` + `COCO-SSD`):** Analisa os pixels reais da imagem em um `<canvas>` (com tratamento automático de CORS) para identificar pessoas (`Homem`, `Mulher`, `Pessoa`), ações e objetos (ex.: `segurando o celular`, `utilizando um notebook`, `segurando um livro`, veículos, animais, objetos).
  - **Reconhecimento Óptico de Caracteres (`Tesseract.js` OCR em 2 passadas) + Camadas DOM:** Lê textos e títulos desenhados dentro da própria imagem (incluindo títulos claros sobre fotos) ou sobrepostos via HTML.
  - **Descrição Natural Combinada:** Em vez de ler apenas um `alt` genérico, gera e fala frases completas como:
    > *"Homem segurando o celular com o título na imagem 'Exemplo'"*
  - Suporte adicional opcional à API multimodal **Google Gemini 2.0 Flash Vision** via chave de configuração.
- **Estrutura da Página (Modal Flutuante):**
  - Mapeia todos os **Títulos (`H1` a `H6`)**, **Regiões (`Landmarks`)** e **Links** da página com busca instantânea.
  - Possui botão **`← Voltar`** no cabeçalho para retornar direto ao painel principal da Allyada.
- **Ir ao Conteúdo:** Pula cabeçalhos e menus diretamente para o conteúdo principal (`<main>`).

---

### 4️⃣ Seção 4: Texto & Leitura (WCAG 1.4.4 e 1.4.12)
- **Tamanho do Texto (até 200%):** 7 níveis progressivos (`100%`, `115%`, `130%`, `145%`, `160%`, `180%`, `200%`) com proteção cirúrgica de cabeçalhos (`header`, `nav`, `topbar`) para nunca quebrar menus do site.
- **Espaçamento WCAG 1.4.12 em 1 Clique:** Aplica simultaneamente altura de linha `1.5`, espaço entre letras `0.12em`, espaço entre palavras `0.16em` e margem entre parágrafos `2em`.
- **Controles Granulares:** Altura da Linha (`Normal`, `1.9x`, `2.3x`), Espaço entre Letras (`Normal`, `+0.08em`, `+0.16em`), Separar Palavras e Fonte **Lexend**.
- **Alinhamento do Texto:** `Padrão`, `Esquerda`, `Centro`, `Direita` e `Justificado`.

---

### 5️⃣ Seção 5: Cores & Contraste + Cores Personalizadas
- **Modos de Contraste:** `Escuro` (WCAG AAA), `Claro`, `Monocromático` e `Alto Contraste (Inversão Inteligente que preserva fotos e vídeos)`.
- **Personalizar Cores da Página (`✨ PRO`):** Permite ao usuário escolher individualmente a **Cor dos Títulos**, **Cor dos Textos** e **Cor do Fundo** através de paletas rápidas ou seletor de cores livre.
- **Filtro para Daltonismo:** `Nenhum`, `Deuteranopia`, `Protanopia` e `Tritanopia`.

---

### 6️⃣ Seção 6: Intérprete VLibras (3D)
- Posicionado ao final da aba principal para permitir a troca rápida entre os avatares oficiais **Hosana**, **Ícaro** e **Guga**.

---

### ⚙️ Aba 2: Configurações & Posicionamento `✨ PRO`
- **Posição nos Cantos (`✨ PRO`):**
  - Permite posicionar o botão flutuante e o painel em **3 alturas verticais**:
    1. **Fim da Página** (Canto inferior tradicional)
    2. **Centro Lateral** (Centralizado verticalmente na borda esquerda ou direita — **ideal para não colidir com botões de WhatsApp e Chatbots**)
    3. **Topo Lateral** (Canto superior esquerdo ou direito)
  - Alternância de lado: **Direito** ou **Esquerdo** (também disponível em 1 clique no cabeçalho do painel).
- **Tamanho do Painel:** `Compacto (90%)`, `Padrão (100%)`, `Grande (115%)` e `Muito Grande (130%)`, com cálculo dinâmico que nunca corta o painel em telas menores.
- **Persistência & Atalhos:** Opção de *Lembrar minhas escolhas* (`localStorage`), ativação/desativação do atalho `Alt + A` e lista de chips com todos os ajustes ativos no momento.

---

## 4. GUIA TÉCNICO DE INSTALAÇÃO E CONFIGURAÇÃO

### 1. Instalação Padrão em 1 Linha (HTML / WordPress / Shopify / Nuvemshop / Sistemas)
Adicione antes do fechamento da tag `</body>`:

```html
<script src="https://seu-dominio.com.br/dist/allyada.js" defer></script>
```

### 2. Instalação Personalizada (Plano PRO)
Você pode personalizar o lado inicial, a posição vertical nos cantos, a cor da marca do cliente e até integrar uma chave opcional do Gemini Vision:

```html
<script src="https://seu-dominio.com.br/dist/allyada.js"></script>
<script>
  window.Allyada.init({
    position: 'right',          // 'right' (Direita) ou 'left' (Esquerda)
    verticalPosition: 'middle', // 'bottom' (Fim da página), 'middle' (Centro Lateral ✨ PRO) ou 'top' (Topo Lateral ✨ PRO)
    primaryColor: '#7956c2',    // Cor principal da marca do cliente
    shortcutKey: 'a',           // Atalho Alt + A
    speechLang: 'pt-BR'         // Idioma da síntese de voz
  });
</script>
```

### 3. Métodos da API JavaScript (`window.Allyada`)
```javascript
// Controle do Painel
window.Allyada.openPanel();
window.Allyada.closePanel();
window.Allyada.togglePanel();

// Mudar posição nos cantos em tempo real (✨ PRO)
window.Allyada.setVerticalPosition('middle'); // 'bottom' | 'middle' | 'top'
window.Allyada.setDockPosition('left');       // 'right' | 'left'

// Redefinir todas as preferências do usuário
window.Allyada.resetState();
```
