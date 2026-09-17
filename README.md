# Allyada - Sua Aliada em Acessibilidade Web ♿✨

**Allyada** (em referência a *A11Y* e *Aliada*) é uma plataforma moderna, modular e de alto desempenho para transformar qualquer website em um ambiente digital acessível, inclusivo e em total conformidade com a **Lei Brasileira de Inclusão (LBI)** e as diretrizes internacionais **WCAG 2.1 / 2.2**.

---

## 💎 Destaques da Versão 2.5 (Design UX/UI Senior & Motor Anti-Quebra)

### 1. Novo Design System UX/UI
* **Ícones Vetoriais SVG Nativos:** Substituição de emojis por ícones desenhados em vetor, garantindo nitidez e consistência visual em qualquer tela e resolução.
* **Micro-interações e Feedback Tátil:** Cada card possui indicador visual de estado ativo (toggle led), animações suaves e elevação controlada.
* **Estética Moderna:** Paleta equilibrada, tipografia limpa, sombras suaves inspiradas nas melhores referências de design de produto (Apple, Vercel, Linear).

### 2. Controles Tipográficos Granulares
* **Tamanho de Texto (5 Níveis):** `Padrão (100%)`, `+15%`, `+30%`, `+45%` e `+60%`, com botões `-` e `+` e barra de progresso visual de 5 etapas.
* **Espaçamento de Linhas (Segmented Stepper):**
  - *Padrão (1.5x)*
  - *Confortável (1.9x)*
  - *Amplo (2.3x)*
* **Espaçamento de Letras (Segmented Stepper):**
  - *Normal*
  - *Médio (+0.08em)*
  - *Amplo (+0.16em)*
* **Alinhamento Cirúrgico:** Força alinhamento à esquerda apenas em textos justificados, preservando botões, cabeçalhos e banners centralizados.

### 3. Motor Anti-Quebra (Layout Shield)
* **Zero interferência destrutiva:** Não aplica estilos cegos em tags `div`, garantindo integridade de layouts complexos (flexbox, CSS grid, wrappers transparentes).
* **Proteção de Ícones:** Fontes de ícones (FontAwesome, Material Icons, SVG) são preservadas e nunca substituídas pela fonte de dislexia.
* **Preservação de Formulários:** Inputs, botões, labels e textareas escalam proporcionalmente sem estourar o padding ou cortar bordas.

### 4. Perfis de Acessibilidade em 1 Clique
* 🧠 **TDAH & Atenção:** Régua de leitura dinâmica, bloqueio total de animações e destaque de links.
* 👁️ **Daltonismo com Matriz SVG:** Filtros clínicos de matiz com seletor rápido para **Deuteranopia** (verde), **Protanopia** (vermelho) e **Tritanopia** (azul).
* ⚡ **Anti-Crises / Epilepsia:** Congela animações, transições e reduz o estresse visual com tema escuro.
* 👓 **Baixa Visão / Idoso:** Zoom de +30%, tema escuro WCAG AAA, cursor grande e links destacados.
* 📖 **Dislexia:** Tipografia Lexend com espaçamento amplo e confortável.

### 5. VLibras e Leitor de Voz Integrados
* **VLibras Harmonizado:** Botão 3D empilhado perfeitamente acima do botão da Allyada (`bottom: 96px`), eliminando conflitos de clique.
* **Leitor de Texto TTS:** Síntese nativa em português com destaque visual dourado em tempo real (`.allyada-reading-highlight`).

---

## 🚀 Como Instalar em Qualquer Site

Basta incluir o script antes de fechar a tag `</body>`:

```html
<script src="path/to/dist/allyada.js"></script>
<script>
  Allyada.init({
    position: 'right',        // 'right' ou 'left'
    primaryColor: '#0052cc',  // Cor principal da marca
    accentColor: '#ffab00',   // Cor de foco acessível
    shortcutKey: 'a'          // Atalho Alt + A para abrir/fechar
  });
</script>
```

---

## ⌨️ Acessibilidade por Teclado

* <kbd>Alt</kbd> + <kbd>A</kbd>: Abre ou fecha o menu.
* <kbd>Esc</kbd>: Fecha o painel e restaura o foco anterior.
* <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>: Navegação sequencial acessível.
* <kbd>Enter</kbd> / <kbd>Espaço</kbd>: Ativa ou desativa recursos.
