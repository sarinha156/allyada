# Allyada - Suite de Acessibilidade Web & Conformidade Legal ♿⚖️

> **"Das diretrizes WCAG 2.2 à ADA, EAA e leis regionais – tudo desenvolvido para monitorar, corrigir e comprovar a conformidade digital."**

**Allyada** (em referência a *A11Y* e *Aliada*) é uma plataforma corporativa e moderna de tecnologia assistiva e conformidade jurídica digital. Projetada sob três pilares operacionais essenciais:

1. 🔍 **Monitorar:** Motor de auditoria contínua em tempo real que analisa o DOM da página contra critérios essenciais da WCAG 2.2 AA.
2. ⚡ **Corrigir:** Motor de auto-remediação do DOM e ferramentas assistivas personalizáveis pelo usuário (design UX/UI Senior, tipografia granular e perfis neurodivergentes).
3. 📜 **Comprovar:** Emissão e exportação em 1 clique da Declaração de Conformidade Oficial (*Accessibility Statement*), fornecendo respaldo jurídico e transparência regulatória.

---

## 🏛️ Matriz de Conformidade e Normas Suportadas

A **Allyada** foi desenvolvida para atender integralmente aos principais padrões técnicos e marcos regulatórios mundiais:

| Norma / Legislação | Âmbito / Jurisdição | Descrição & Cobertura |
| :--- | :--- | :--- |
| **WCAG 2.2 Nível AA** | Internacional (W3C / WAI) | Conformidade com os 4 princípios fundamentais (Perceptível, Operável, Compreensível e Robusto) e novos critérios de foco e alvo mínimo (2.5.8). |
| **PDF/A** | Internacional (ISO 19005) | Diretrizes e suporte à disponibilização de documentos acessíveis e de preservação digital de longo prazo. |
| **HÁ** | Internacional / Setor Público | Diretrizes de Acessibilidade no Ensino Superior e Serviços Públicos de Informação. |
| **Título II da ADA** | Estados Unidos | Obrigatoriedade de acessibilidade digital para governos estaduais, municipais e serviços públicos essenciais. |
| **Título III da ADA** | Estados Unidos | Acomodações públicas e empresas que oferecem produtos/serviços ao público através da web. |
| **Seção 508** | EUA (Rehabilitation Act) | Critérios obrigatórios de acessibilidade para contratações de TIC pelo Governo Federal dos EUA. |
| **Seção 504** | EUA (Rehabilitation Act) | Proibição de discriminação baseada em deficiência em quaisquer programas com assistência financeira federal. |
| **Lei Unruh (Civil Rights Act)** | Califórnia (EUA) | Proteção rigorosa contra discriminação em locais de acomodação pública, aplicada extensivamente a sites de e-commerce e portais. |
| **Colorado HB 21-1110** | Colorado (EUA) | Exigência legal de conformidade com padrões WCAG para todas as entidades governamentais estaduais e locais. |
| **AODA** | Ontário (Canadá) | *Accessibility for Ontarians with Disabilities Act* - Padrão mandatário de informações e comunicações acessíveis. |
| **ACA** | Canadá (Federal) | *Accessible Canada Act* - Legislação federal canadense para um país livre de barreiras até 2040. |
| **EN 301 549** | União Europeia | Norma técnica europeia que estabelece os requisitos funcionais de acessibilidade para compras públicas de TIC. |
| **EAA (European Accessibility Act)** | União Europeia | Diretiva Europeia 2019/882 obrigatória a partir de 2025 para comércios eletrônicos, serviços bancários e produtos digitais. |
| **Lei da Igualdade do Reino Unido** | Reino Unido (*Equality Act 2010*) | Dever legal de implementar "ajustes razoáveis" (*reasonable adjustments*) para evitar discriminação contra pessoas com deficiência. |
| **IS 5568** | Israel | Padrão governamental de Israel para diretrizes de acessibilidade na internet baseado na WCAG. |
| **LBI (Lei 13.146/2015)** | Brasil | Art. 63 da Lei Brasileira de Inclusão, que torna obrigatória a acessibilidade nos sítios da internet mantidos por empresas e órgãos públicos. |

---

## 🗂️ Arquitetura em 3 Abas Integradas

O drawer da Allyada é organizado em abas com navegação intuitiva:

### 1. 🎛️ Aba Ferramentas Assistivas
* **Design UX/UI Senior:** Ícones vetoriais SVG nítidos, switches táteis inspirados no ecossistema Apple/Linear, layout responsivo e acessível por teclado.
* **Tipografia Granular:**
  - *Tamanho de Fonte (5 Níveis):* 100%, 115%, 130%, 145%, 160% com stepper e barra de progresso visual.
  - *Espaçamento de Linhas (3 Níveis):* Padrão (1.5x), Confortável (1.9x) e Amplo (2.3x).
  - *Espaçamento de Letras (3 Níveis):* Normal, Médio (+0.08em) e Amplo (+0.16em).
  - *Alinhamento à Esquerda:* Corrige textos justificados sem impactar alinhamentos de botões ou menus.
  - *Fonte para Dislexia:* Ativação cirúrgica da tipografia Lexend, preservando fontes de ícones (Material Icons, FontAwesome, etc.).
* **Contraste Não-Destrutivo:** Alto Contraste Escuro (WCAG AAA `#121212`), Contraste Claro, Monocromático e Inversão Inteligente (preservando fotos e vídeos).
* **Foco & Navegação:** Régua de Leitura dinâmica (60fps), realce de links em âmbar, cursor extra grande e congelamento instantâneo de animações.
* **Leitor de Texto TTS (Voz):** Síntese nativa em português (`pt-BR`) com contorno dourado em tempo real no elemento em leitura.
* **VLibras Integrado:** Carregamento automático e posicionamento vertical empilhado (`bottom: 96px`), eliminando conflitos de clique.
* **Perfis em 1 Clique:** TDAH & Concentração, Daltonismo (Deuteranopia, Protanopia, Tritanopia), Anti-Crises/Epilepsia, Baixa Visão e Dislexia.

### 2. 🔍 Aba Auditoria WCAG 2.2 em Tempo Real
* **Escaneamento ao Vivo:** Analisa a página atual em busca de inconformidades:
  - `Critério 1.1.1`: Imagens sem texto alternativo (`alt`).
  - `Critério 1.3.1`: Estrutura hierárquica e marcos semânticos (`header`, `main`, `nav`, `footer`).
  - `Critério 4.1.2`: Botões e controles interativos sem nome acessível (`aria-label`).
  - `Critério 3.3.2`: Campos de formulário sem rótulo associado.
  - `Critério 2.5.8 (WCAG 2.2)`: Alvos de toque com área mínima de 24x24px.
* **Pontuação de Conformidade:** Cálculo percentual (0 a 100%) da integridade técnica da página.
* **Botão "Corrigir Problemas":** Executa auto-remediação instantânea do DOM via injeção de marcos ARIA, skip links e ajuste de alvos reduzidos.

### 3. 📜 Aba Declaração Legal
* **Laudo Legal e Respaldo Regulatório:** Texto formal de compromisso com a acessibilidade cobrindo nominalmente as 13 legislações globais.
* **Cópia em 1 Clique:** Permite aos administradores e equipes de compliance copiar o laudo oficial para publicação imediata no rodapé do portal.

---

## 🛡️ Motor Anti-Quebra (Layout Shield)

Diferente de widgets convencionais que injetam estilos genéricos que quebram layouts modernos, a **Allyada** adota salvaguardas rigorosas:
* **Isolamento via Shadow DOM (`mode: 'open'`):** O widget reside diretamente em `document.documentElement`, imune a filtros CSS no `<body>` e impedindo vazamento de CSS para o portal.
* **Sem Seletores Cegos de `div`:** Estilizações de contraste e tipografia são aplicadas estritamente em elementos semânticos (`p`, `h1`-`h6`, `article`, `section`, etc.), mantendo grids e flexbox perfeitamente intactos.
* **Cache Proporcional de Fontes:** Armazena os tamanhos computados no atributo `data-ally-orig-font`, evitando o efeito bola de neve em redimensionamentos sucessivos.

---

## 🚀 Como Instalar

Basta carregar o script antes do encerramento da tag `</body>`:

```html
<script src="path/to/dist/allyada.js"></script>
<script>
  Allyada.init({
    position: 'right',        // 'right' ou 'left'
    primaryColor: '#0052cc',  // Cor primária dos componentes
    accentColor: '#f59e0b',   // Cor de realce e foco acessível
    shortcutKey: 'a'          // Atalho Alt + A
  });
</script>
```

### API JavaScript Disponível
```javascript
// Abrir / Fechar Painel
Allyada.openPanel();
Allyada.closePanel();
Allyada.togglePanel();

// Alternar Abas programaticamente
Allyada.switchTab('assistive');  // Ferramentas
Allyada.switchTab('audit');      // Auditoria WCAG
Allyada.switchTab('statement');  // Declaração Legal

// Executar Auditoria do DOM
const resultado = Allyada.runAudit();
console.log(`Pontuação: ${resultado.score}%`);

// Disparar Auto-Remediação do DOM
Allyada.remediateDOM();

// Redefinir todas as preferências
Allyada.resetAll();
```

---

## ⌨️ Navegação Acessível por Teclado

* <kbd>Alt</kbd> + <kbd>A</kbd>: Alterna a abertura do painel.
* <kbd>Esc</kbd>: Fecha o painel e devolve o foco para o botão flutuante.
* <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd>: Navegação sequencial acessível com indicador visual evidente.
* <kbd>Enter</kbd> / <kbd>Espaço</kbd>: Ativa e desativa botões e toggles.

---

## 📂 Estrutura do Repositório

```text
allyada/
├── dist/
│   ├── allyada.js            # Build de produção independente (vanilla JS)
│   └── acessibilidade.js     # Alias legado para retrocompatibilidade
├── src/
│   └── allyada.js            # Código-fonte principal com Shadow DOM e Suite v3.0
├── demo/
│   ├── index.html            # Portal demonstrativo com laboratório de auditoria
│   └── demo.css              # Estilos do portal modelo
└── README.md                 # Documentação técnica e jurídica
```
