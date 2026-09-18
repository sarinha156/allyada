# ALLYADA v3.0 — DOCUMENTO EXPLICATIVO & ESTRATÉGICO
**"Sua aliada em acessibilidade web e conformidade jurídica"**

---

## 1. VISÃO GERAL & MISSÃO DO PROJETO

A **Allyada** é uma suíte tecnológica completa de acessibilidade digital e conformidade jurídica contínua, projetada para operar diretamente no navegador do usuário em qualquer website (desde portais legados e cartórios até e-commerces e plataformas corporativas).

O projeto nasceu para resolver uma dor crítica de mercado: **sites modernos e governamentais são obrigados por lei a serem acessíveis, mas a maioria das soluções quebra o layout visual dos sites, é difícil de integrar ou é apenas cosmética**.

A Allyada foi desenvolvida sob o pilar da **Tríade da Conformidade Digital**:
1. **MONITORAR:** Auditar o código e a experiência em tempo real segundo critérios internacionais (WCAG 2.2 AA).
2. **CORRIGIR:** Aplicar auto-remediação instantânea e não-destrutiva no DOM sem quebrar o layout original do cliente.
3. **COMPROVAR:** Gerar relatórios técnicos periciais e declarações jurídicas formais para proteção contra processos, multas e fiscalizações.

---

## 2. O QUE FOI FEITO (HISTÓRICO DE EVOLUÇÃO & PROBLEMAS RESOLVIDOS)

Ao longo do desenvolvimento, superamos desafios críticos de engenharia web para transformar um protótipo básico em um produto de nível corporativo (*enterprise-ready*):

### 🛡️ 1. Escudo de Isolamento Total (Anti-Quebra de Layout)
- **O Problema:** Versões anteriores alteravam o `font-size` global no `<html>` e `<body>`. Isso quebrava menus de navegação, desalinjava logos e deformava cabeçalhos complexos em sites reais (como no [9º RCPN / cartorio9rj.com.br](https://www.cartorio9rj.com.br/)).
- **O que foi feito:** Criamos um seletor inteligente que protege 100% de `header`, `nav`, `topbar`, `navbar` e menus institucionais. Apenas o conteúdo textual legível do corpo da página é adaptado, preservando intacta a identidade visual e o design do site cliente.

### 🪟 2. Encapsulamento com Shadow DOM Blindado
- **O Problema:** Regras de CSS do site hospedeiro vazavam para dentro do widget (alterando cores e quebrando botões), ou o CSS do widget sobrescrevia estilos do próprio site. Além disso, o fundo ficava borrado e poluído.
- **O que foi feito:** Migramos toda a interface do Allyada para **Shadow DOM isolado** com reset agressivo (`all: initial !important;`), eliminamos o desfoque de fundo invasivo e transformamos o menu em um painel lateral flutuante moderno, ergonômico e limpo.

### 🔄 3. Dock Switcher (Alternância de Doca Esquerda / Direita)
- **O Problema:** O botão flutuante e o drawer ficavam fixos à direita, frequentemente cobrindo botões de atendimento via WhatsApp, chats de suporte ou rodapés críticos.
- **O que foi feito:** Implementamos um botão inteligente de doca no cabeçalho. Com 1 clique, o usuário ou visitante move todo o painel para o lado esquerdo ou direito da tela, reposicionando em conjunto o botão do VLibras.

### 🔍 4. Busca Instantânea de Recursos (*Quick Find*)
- **O Problema:** A quantidade crescente de ferramentas (contrastes, fontes, espaçamentos, leitores) dificultava a localização rápida por pessoas com baixa visão ou TDAH.
- **O que foi feito:** Adicionamos uma barra de busca em tempo real no topo do painel. Ao digitar termos como *"fonte"*, *"escuro"*, *"cursor"* ou *"daltonismo"*, as seções filtram instantaneamente apenas os cartões relevantes.

### 🧠 5. Perfis Neurodiversos em 1 Clique (Clínicos)
- **O Problema:** Usuários precisavam adivinhar quais combinações de ferramentas precisavam ligar para atender suas necessidades cognitivas ou visuais.
- **O que foi feito:** Criamos 5 perfis pré-configurados que ativam conjuntos específicos de forma limpa e sem conflito de estado:
  - **TDAH:** Régua de leitura, animações congeladas, alinhamento à esquerda, tipografia legível.
  - **Daltonismo:** Filtros SVG matemáticos aplicados na camada gráfica (Deuteranopia, Protanopia, Tritanopia).
  - **Epilepsia:** Pausa instantânea de transições, carrosséis, vídeos e animações CSS.
  - **Baixa Visão:** Alto contraste, ampliação tipográfica, destaque de hiperlinks e cursor gigante.
  - **Dislexia:** Fonte especializada *Lexend*, aumento de entrelinhas (1.9x) e espaçamento entre letras.

### ⚡ 6. Motor de Auditoria Reativo e Auto-Remediação Sincronizada
- **O Problema:** A auditoria parecia inerte/travada, pois o botão não dava feedback de carregamento, o toggle de remediação não recalculava a nota na hora, e botões de ícone com SVG/tags `<i>` não eram reconhecidos.
- **O que foi feito:**
  - Implementamos animações de escaneamento em tempo real (`Varrendo DOM...`, pulso luminoso no anel de score).
  - O switch de remediação foi diretamente acoplado à auditoria: ao ligar, ele corrige os nós do DOM e a pontuação salta ao vivo (ex: de 10% para 100%), exibindo a badge `✓ X correções aplicadas no DOM`.
  - Mecanismo 100% reversível: ao desligar o switch, todos os atributos injetados são desfeitos sem recarregar a página.

---

## 3. O QUE TEMOS HOJE (ESTRUTURA & FUNCIONALIDADES ATUAIS)

### A. Arquitetura de Arquivos
```
allyada/
├── src/
│   ├── allyada.js            # Código-fonte principal v3.0 modular e documentado
│   └── acessibilidade.js     # Arquivo legado de compatibilidade
├── dist/
│   ├── allyada.js            # Versão compilada de distribuição (UTF-8 puro)
│   └── acessibilidade.js     # Espelho para compatibilidade retroativa
├── demo/
│   ├── index.html            # Portal demonstrativo completo com laboratório interativo
│   └── demo.css              # Estilos do portal de demonstração
└── README.md                 # Guia de instalação, atalhos e especificações
```

### B. Módulos Funcionais do Painel
O drawer lateral é dividido em **3 Abas Principais**:

1. **Aba 1: Tecnologia Assistiva (Experiência do Usuário)**
   - *Busca rápida de recursos.*
   - *Perfis em 1 Clique:* TDAH, Daltonismo, Epilepsia, Baixa Visão, Dislexia.
   - *Ajustes de Tipografia:* Escala de tamanho (Padrão a +60%), Entrelinhas (1.9x e 2.3x), Espaçamento de caracteres (+0.08em e +0.16em), Fonte Lexend, Alinhamento à esquerda.
   - *Contraste e Cor:* Escuro (WCAG AAA 7:1), Claro, Monocromático, Invertido.
   - *Navegação e Foco:* Régua de Leitura com guia de foco, Cursor Ampliado de alto contraste, Destaque de hiperlinks.
   - *Leitura em Voz Alta (TTS):* Leitor de tela por síntese de voz (Web Speech API) com leitura de seleção e botão de interrupção imediata.
   - *Língua Brasileira de Sinais (VLibras):* Ativação e reposicionamento integrado do avatar 3D.
   - *Contador de modificações ativas* e botão inteligente de *Redefinir Tudo*.

2. **Aba 2: Auditoria & Auto-Remediação (Monitorar & Corrigir)**
   - *Círculo de Pontuação Dinâmico:* Cores dinâmicas (Verde >=90%, Âmbar 70-89%, Vermelho <70%).
   - *Botão "Reauditar Página":* Executa varredura visual com feedback animado no DOM do cliente.
   - *Switch "Remediação Ativa em Tempo Real":* Corrige landmarks ARIA, alvos clicáveis (24x24px), textos alternativos (`alt`), rótulos de botões (`aria-label`), campos de formulário sem etiquetas, título `<h1>` e atributo `lang`.
   - *Checklist Técnico Detalhado:* Exibição de 7 critérios WCAG com código de referência, status (Aprovado/Ajustar), diagnósticos e selo de remediação.
   - *Botão "Copiar Relatório":* Exporta um relatório técnico de conformidade formatado para compliance ou auditorias periciais.

3. **Aba 3: Declaração Legal (Comprovar)**
   - *Declaração Formal de Acessibilidade Digital:* Documento jurídico com data da auditoria e índice apurado.
   - *Cobertura de 13 Normas Nacionais e Internacionais:*
     1. **WCAG 2.2 AA** (Diretrizes Globais do W3C)
     2. **ADA Title II & Title III** (Americans with Disabilities Act - EUA)
     3. **Rehabilitation Act Section 508 & 504** (Setor Público e Federal dos EUA)
     4. **Unruh Civil Rights Act** (Califórnia)
     5. **Colorado HB 21-1110** (Legislação Estadual do Colorado para WCAG 2.2)
     6. **AODA** (Ontário, Canadá)
     7. **ACA** (Accessible Canada Act - Canadá Federal)
     8. **EN 301 549** (Padrão Europeu para Compras Públicas)
     9. **EAA** (European Accessibility Act - Diretiva UE 2019/882)
     10. **UK Equality Act 2010** (Reino Unido)
     11. **IS 5568** (Israel)
     12. **LBI** (Lei Brasileira de Inclusão nº 13.146/15 e e-MAG)
     13. **PDF/A & Documentos Acessíveis**
   - *Botão "Copiar Texto da Declaração":* Copia a minuta jurídica pronta para publicação no rodapé ou na página de conformidade do portal.

---

## 4. OBJETIVOS ESTRATÉGICOS DO ALLYADA

### 🎯 Objetivo 1: Eliminar o Risco Jurídico de Empresas e Órgãos Públicos
No Brasil, a Lei Brasileira de Inclusão (LBI - Lei 13.146/15, Art. 63) torna obrigatória a acessibilidade nos sites de empresas com sede ou representação comercial no país. Internacionalmente, leis como a ADA (EUA) e a EAA (Europa - obrigatória desde junho de 2025) têm gerado milhares de notificações e multas severas.
- **A Allyada entrega:** Uma barreira de defesa jurídica ativa, permitindo que a empresa comprove boa-fé, diligência técnica contínua e laudo comprobatório auditável.

### 🎯 Objetivo 2: Inclusão Real e Universal (Sem Depender de Redesenho do Site)
Reformar um site inteiro para torná-lo acessível pode custar centenas de milhares de reais e levar meses.
- **A Allyada entrega:** Uma solução que se acopla em **menos de 2 minutos com 1 linha de código**, remediando problemas técnicos graves de código (landmarks, formulários, botões) e fornecendo tecnologia assistiva de ponta diretamente ao usuário final.

### 🎯 Objetivo 3: Posicionamento Competitivo de Mercado
A Allyada foi arquitetada para concorrer diretamente com soluções internacionais (como *UserWay*, *AccessiBe* e *EqualWeb*), com diferenciais exclusivos:
- **Zero quebra de layout** com isolamento estrito contra CSS do host.
- **Suporte nativo a normas e ecossistema do Brasil:** LBI, e-MAG e integração nativa com o **VLibras** (avatar 3D de Língua de Sinais oficial do governo federal).
- **Conformidade de última geração WCAG 2.2** (incluindo o critério 2.5.8 de tamanho mínimo de alvo 24x24px, introduzido na versão mais recente do W3C).

---

## 5. COMO IMPLEMENTAR EM QUALQUER WEBSITE

A implementação requer apenas a inclusão de uma única linha de código antes do fechamento da tag `</body>`:

```html
<script src="https://seu-dominio.com.br/allyada.js" defer></script>
```

### Inicialização e Atalhos
- O widget se inicializa automaticamente e anexa o botão flutuante e os estilos isolados.
- **Atalho Universal de Teclado:** Pressione <kbd>Alt</kbd> + <kbd>A</kbd> para abrir ou fechar o menu a qualquer momento.
- **Link de Salto Acessível:** O Allyada injeta automaticamente o link oculto *"Pular para o conteúdo principal"* (WCAG 2.4.1), ativado ao pressionar a tecla <kbd>Tab</kbd>.

---

## 6. PRÓXIMOS PASSOS RECOMENDADOS

1. **Testes Contínuos em Clientes-Piloto:**
   - Aplicar em cartórios parceiros, órgãos públicos e clientes de e-commerce usando a injeção rápida via Console ou Google Tag Manager (GTM).
2. **Hospedagem em CDN:**
   - Publicar o bundle minificado `dist/allyada.js` em uma CDN rápida (ex: Cloudflare / AWS CloudFront) para carregamento com cache global e tempo de resposta inferior a 50ms.
3. **Painel SaaS / Dashboard Centralizado (Futuro):**
   - Criar uma interface onde gestores possam cadastrar múltiplos domínios e visualizar o histórico de notas de auditoria ao longo dos meses.

---
*Documento elaborado pela equipe de desenvolvimento e arquitetura de software da Allyada.*
