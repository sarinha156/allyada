# ♿ Allyada — Suíte de Acessibilidade Web, IA Assistiva & Conformidade Legal (LBI / WCAG 2.2)

> **"Acessibilidade completa em 1 linha de código, 100% pensada para o Brasil (LBI + e-MAG + VLibras 3D + Voz Neural + IA Visual de Imagens com OCR), com isolamento total em Shadow DOM que nunca quebra o layout do site."**

---

## 📚 Documentos Estratégicos do Projeto

- 📈 **[Plano de Vendas, Precificação (Free vs. PRO) & Go-to-Market](./PLANO_DE_VENDAS_ALLYADA.md)** — Estrutura comercial SaaS, gatilhos de upgrade `✨ PRO`, nichos-alvo (Cartórios, Clínicas, E-commerces, Agências) e scripts de abordagem.
- 📖 **[Documentação Executiva, Funcional & Técnica](./DOCUMENTACAO_EXECUTIVA_ALLYADA.md)** — Catálogo completo de funcionalidades por seção, arquitetura UX/UI Sênior e guia de configuração.

---

## ✨ Principais Diferenciais da Allyada

1. **UX/UI Sênior Focada em Acessibilidade Real (Zero Duplicação):**
   - Organização clínica por prioridade de uso na aba **Início**:
     1. **Perfis Prontos (1 Clique):** *Modo Ampliação (Baixa Visão)*, *Leitura Fácil (Dislexia)*, *Modo Foco (TDAH)*, *Sem Movimento (Calma)* e *Modo Cores (Daltonismo)*.
     2. **Guia de Foco, Teclado & Mouse:** *Régua Guia*, *Máscara de Foco (`✨ PRO`)*, *Destacar Links*, *Foco de Teclado AAA*, *Teclado Virtual*, *Sem Animação* e *Tamanho/Cor do Cursor* (`44px` e `60px` com adaptação automática para branco em fundos escuros).
     3. **Voz, Libras & Estrutura:** *Tradutor VLibras 3D* (sempre posicionado no lado oposto ao Allyada), *Leitor de Voz Neural (TTS)* com retomada contínua da palavra exata, *Descritor Visual de Imagens com IA + OCR (`✨ PRO`)* e *Estrutura da Página* (modal flutuante com botão `← Voltar`).
     4. **Texto & Leitura:** *Tamanho do Texto até 200% (WCAG 1.4.4)* sem quebrar cabeçalhos/menus, *Espaçamento WCAG 1.4.12*, *Altura da Linha*, *Espaço entre Letras*, *Separar Palavras*, *Fonte Lexend* e *Alinhamento Completo*.
     5. **Cores & Contraste:** Modos *Escuro*, *Claro*, *Monocromático*, *Alto Contraste* e *Cores Personalizadas para Títulos, Textos e Fundo (`✨ PRO`)*.
     6. **Intérprete VLibras (3D):** Escolha entre *Hosana*, *Ícaro* e *Guga* ao final do painel.
2. **🧠 Descritor Visual de Imagens com IA + OCR em Tempo Real (`✨ PRO`):**
   - Combina Visão Computacional Neural no navegador (`TensorFlow.js` + `COCO-SSD`) + Reconhecimento Óptico de Caracteres (`Tesseract.js` OCR em 2 passadas) + inspeção de camadas HTML sobrepostas.
   - Analisa os pixels reais da foto para descrever pessoas, ações, objetos (como celulares, notebooks, livros) e qualquer título escrito na imagem (ex.: *"Homem segurando o celular com o título na imagem 'Exemplo'"*).
3. **📐 Posicionamento Inteligente nos Cantos (`✨ PRO`):**
   - Além de alternar entre **Direita** e **Esquerda**, permite fixar o botão e o painel no **Centro Lateral da Tela** (`middle`) ou **Topo Lateral** (`top`), evitando colisões com botões flutuantes de WhatsApp e chatbots no fim da página.
4. **🛡️ Blindagem Total de Layout (Shadow DOM + Header Shield):**
   - Interface isolada em Shadow DOM e seletores cirúrgicos que preservam `header`, `nav` e `topbar` do site hospedeiro, com suporte nativo inclusive a conteúdos dentro de `<iframe>`.

---

## 🚀 Instalação Rápida

### 1 Linha de Código (Configuração Automática)
Insira antes do fechamento da tag `</body>`:

```html
<script src="dist/allyada.js" defer></script>
```

### Configuração Personalizada (`✨ PRO`)
```html
<script src="dist/allyada.js"></script>
<script>
  window.Allyada.init({
    position: 'right',          // 'right' | 'left'
    verticalPosition: 'middle', // 'bottom' | 'middle' (Centro Lateral ✨ PRO) | 'top'
    primaryColor: '#7956c2',    // Cor da marca
    shortcutKey: 'a',           // Atalho Alt + A
    speechLang: 'pt-BR'
  });
</script>
```

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
| :--- | :--- |
| <kbd>Alt</kbd> + <kbd>A</kbd> | Abre ou fecha o painel principal da Allyada |
| <kbd>Esc</kbd> | Fecha o modal de Estrutura da Página ou o painel principal |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | Navegação sequencial com Focus Trap seguro dentro do painel |

---

## 📂 Estrutura do Repositório

```text
allyada/
├── src/
│   ├── allyada.js                        # Código-fonte principal completo
│   └── acessibilidade.js                 # Espelho de compatibilidade
├── dist/
│   ├── allyada.js                        # Build de distribuição pronto para produção
│   └── acessibilidade.js                 # Alias de distribuição
├── demo/
│   ├── index.html                        # Página de demonstração interativa
│   └── demo.css                          # Estilos da demonstração
├── PLANO_DE_VENDAS_ALLYADA.md            # Estratégia comercial, preços Free/PRO e scripts de venda
├── DOCUMENTACAO_EXECUTIVA_ALLYADA.md     # Documentação executiva e técnica detalhada
├── README.md                             # Visão geral do repositório
└── LICENSE                               # Licença MIT
```
