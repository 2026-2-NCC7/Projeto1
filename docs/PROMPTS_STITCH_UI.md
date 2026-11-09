# Prompts de Design de Interface para Google Stitch & I.A. Generativa

**Projeto:** Plataforma Q.I. Match - Matchmaking & Recrutamento Tech Invertido  
**Estilo Visual:** Dark Industrial Tech / Preto & Dourado/Amarelo (#0B0F17, #12161E, #FACC15)  
**Compatibilidade:** TCC & Documentação Oficial do Produto

---

## 🎨 Prompt 0: Sistema de Design Global (Cole antes de cada tela ou configure no estilo global)

```text
Design System & Style Guidelines:
- Theme: Dark Mode Profissional e Sofisticado (Paleta Preto & Amarelo).
- Background Colors: 
  * Background Principal: #0B0F17 (Preto profundo quase carvão)
  * Cards e Superfícies: #12161E com bordas sutis #262F40
  * Destaques e Elevação: #1A2233
- Primary Accent Color: #FACC15 (Amarelo Ouro / Dourado Tech) para ações principais, badges premium e indicadores ativos.
- Secondary Accents:
  * Verde Sucesso: #10B981 (para aprovações, scores altos e microfone ativo)
  * Azul Info: #3B82F6 (para badges semânticos e tags técnicas)
  * Vermelho/Coral: #EF4444 (para cancelamentos e erros)
- Typography: Inter ou Geist Sans para corpo de texto (legibilidade alta, clean, moderna) e JetBrains Mono para números de código, métricas e tags técnicas.
- Border Radius: 10px a 14px (arredondamento moderno e sutil, sem excessos pill).
- Contrast & Accessibility: Alto contraste WCAG AAA. Textos primários em #FFFFFF, secundários em #94A3B8, bordas nítidas para não misturar containers no fundo escuro.
```

---

## 🎙️ Prompt 1: Tela de Entrevista por I.A. (Gravação, Aquecimento & Transcrição Editável)

```text
Role & Goal:
Crie a interface de usuário (UI) de uma Tela de Entrevista Técnica por I.A., focada em reduzir a ansiedade do candidato através de recursos de segurança psicológica e garantia de precisão técnica.

Layout & Structure:
1. Header da Sessão:
   - Título da pergunta: "Pergunta 2 de 5: Arquitetura de Microsserviços e Mensageria".
   - Badge com a competência avaliada: "Arquitetura Backend / Kafka & RabbitMQ".
   - Temporizador sutil no topo direito (ex: "Tempo sugerido: até 3 minutos").

2. Banner de Segurança Psicológica (Destaque no topo do card):
   - Card com fundo amarelo translúcido (#FACC15 com 10% de opacidade) e borda dourada sutil.
   - Ícone de escudo (ShieldCheck).
   - Mensagem em destaque: "Fique tranquilo: após gravar, você poderá ouvir seu áudio, ler o texto transcrito pela I.A. e regravar quantas vezes quiser antes de confirmar o envio."

3. Área de Aquecimento & Teste de Microfone (Antes de Iniciar):
   - Caixa "Teste de Áudio":
     * Botão secundário estilizado: "🎙️ Fale algo para testar o microfone".
     * Barra de Volume dinâmica (VU Meter) com 12 segmentos luminosos que reagem de verde (#10B981) a amarelo (#FACC15).
     * Indicador de status: "Microfone detectado com boa captação".

4. Controle de Gravação Principal:
   - Botão central redondo grande de microfone com anel pulsante quando ativo.
   - Contador de tempo de gravação em tempo real ("01:24 / 03:00").
   - Botão de Parar Gravação (vermelho/quadrado com cantos arredondados).
   - Opção alternativa discreta: "Ou envie um arquivo de áudio (.mp3, .wav, .webm)".

5. Player e Revisão Pré-Envio (Após Gravar):
   - Player de áudio minimalista com timeline de forma de onda (waveform) interativa e botão play/pause.
   - Botão "Regravar resposta" (com ícone de refresh e aviso sutil que descartará a gravação atual).

6. Transcrição com Edição Manual (Direito de Correção Técnica):
   - Card com título: "Transcrição Automática por Whisper I.A.".
   - Badge: "Editável".
   - Área de texto com fundo escuro #0F131C e borda focada em amarelo onde o candidato pode corrigir termos técnicos (ex: corrigir "docar" para "Docker" ou "cubernets" para "Kubernetes").
   - Dica abaixo: "Você pode ajustar a transcrição para garantir que termos e jargões técnicos fiquem 100% fiéis à sua fala."

7. Barra de Ação Inferior:
   - Botão secundário à esquerda: "Voltar à pergunta anterior".
   - Botão primário amarelo vibrante à direita: "Salvar e Avançar para Próxima Pergunta →".
```

---

## 🏢 Prompt 2: Vitrine Comercial & Landing Page (Segmentação Dev vs Empresa & Slots RN03/RN04)

```text
Role & Goal:
Crie a Landing Page / Vitrine Comercial da Q.I. Match, uma plataforma de recrutamento invertido orientada por inteligência artificial, destacando o modelo de precificação transparente e a divisão de personas.

Layout & Structure:
1. Navbar Superior:
   - Logo "Q.I. Match Matchmaker" com detalhe em amarelo tech.
   - Menu simples: "Como Funciona", "Para Empresas", "Para Desenvolvedores", "Tabela de Preços".
   - Botão no canto: "Acessar Plataforma".

2. Hero Section com Segmentador de Persona:
   - Headline imponente: "O Fim dos Processos Seletivos Cansativos e Sem Retorno".
   - Subheadline: "Matchmaking de alta precisão técnica com corte mínimo de 75% e recrutamento invertido."
   - Segmented Control / Tabs comutadoras proeminentes:
     * Aba Ativa: [ 💻 Sou Desenvolvedor ]
     * Aba Inativa: [ 🏢 Sou Empresa / RH ]
   - Mensagem dinâmica conforme a aba:
     * Para Dev: "Crie seu perfil uma vez, valide suas habilidades por I.A. e receba convites diretos de empresas já com propostas compatíveis."
     * Para Empresa: "Publique suas vagas por slots pré-pagos e receba apenas candidatos pré-ranqueados que realmente dominam a stack."

3. Os 3 Pilares do Produto (Cards em Grid de 3 colunas):
   - Card 1: "Validação por I.A. & Áudio" (Ícone Cpu/Sparkles) - Avaliação contextual de respostas técnicas, sem testes genéricos de leetcode.
   - Card 2: "Recrutamento Invertido" (Ícone RefreshCw) - Empresas abordam os talentos com base em afinidade comprovada.
   - Card 3: "Corte Rigoroso de 75%" (Ícone ShieldCheck) - Zero spam de currículos desqualificados; apenas matches com fit real.

4. Seção de Precificação Oficial de Slots (Regras RN03 / RN04):
   - Título: "Planos Transparentes e Pré-pagos para Empresas"
   - Subtítulo: "Contrate slots de vagas ativas com suporte a múltiplos perfis técnicos sem mensalidades abusivas."
   - Grid de 3 Cards de Planos:
     * Plano 1 Slot:
       - R$ 450,00 avulso.
       - "Ideal para contratações pontuais de squads em expansão".
       - 1 vaga simultânea, triagem por I.A., relatórios detalhados.
     * Plano 3 Slots (Destaque "Mais Escolhido" com borda amarela #FACC15):
       - R$ 1.200,00 (Economia de R$ 150 - sai R$ 400 por vaga).
       - Badge dourado: "Melhor Custo-Benefício".
       - 3 vagas simultâneas, substituição de candidatos desqualificados em até 48h.
     * Plano 6 Slots (Pacote Scale-up):
       - R$ 2.200,00 (Economia de R$ 500 - sai R$ 366 por vaga).
       - Suporte prioritário para preenchimento de lideranças técnicas.

5. Rodapé:
   - Em conformidade com LGPD (Art. 20 - transparência algorítmica).
   - Links institucionais e selo de segurança de dados criptografados.
```

---

## 👨‍💻 Prompt 3: Onboarding & Cadastro do Desenvolvedor (Regra RN05 GitHub Júnior & 11 Verticais)

```text
Role & Goal:
Crie o fluxo de Onboarding e Criação de Perfil para Desenvolvedores na Q.I. Match, com validações inteligentes de acordo com o nível de senioridade e controle estrito de privacidade LGPD.

Layout & Structure:
1. Stepper Superior (Barra de Progresso em 3 passos):
   - [Passo 1: Dados Pessoais & Carreira (Concluído)]
   - [Passo 2: Especialidade & Senioridade (Ativo)]
   - [Passo 3: Validação de Repositório & Portfólio (Próximo)]

2. Passo 2: Seleção de Senioridade e Vertical Técnica:
   - Seletor de Senioridade com botões de rádio estilizados em chips:
     * [ Júnior ]  [ Pleno ]  [ Sênior ]  [ Especialista ]  [ Lead ]
   - Alerta contextual se o usuário selecionar "Júnior":
     * Card informativo amarelo: "Para candidatos de nível Júnior, a vinculação de um perfil ativo no GitHub com pelo menos um repositório autoral é obrigatória (Regra RN05)."
   - Grade com as 11 Verticais Técnicas Oficiais da Plataforma (Seleção Múltipla com ícones):
     1. Frontend Web
     2. Backend & APIs
     3. Mobile (iOS / Android / Flutter)
     4. DevOps & Cloud Infrastructure
     5. Data Engineering & Big Data
     6. Machine Learning & I.A.
     7. Segurança da Informação & Cyber
     8. QA & Automação de Testes
     9. Arquitetura de Software
     10. Banco de Dados & DBA
     11. Embedded / IoT

3. Passo 3: Repositório GitHub e Validação de Código:
   - Campo para URL do GitHub (ex: https://github.com/usuario/meu-projeto).
   - Botão de validação: "Verificar Repositório".
   - Status visual de validação verde: "Repositório público validado com sucesso (Linguagens detectadas: TypeScript, Python)".

4. Seção de Privacidade e Autonomia LGPD (RF20):
   - Toggle: "Permitir que empresas visualizem meu perfil anonimizado antes do aceite mútuo".
   - Card de Governança de Dados no rodapé:
     * "Você possui total controle sobre seus dados pessoais conforme a LGPD. Você pode a qualquer momento exportar ou solicitar a exclusão irreversível do seu cadastro clicando no painel de privacidade."

5. Botões de Navegação:
   - "Voltar" (secundário escuro).
   - "Concluir Cadastro e Iniciar Entrevista de I.A. →" (amarelo de alta ênfase).
```

---

## 📬 Prompt 4: Dashboard do Desenvolvedor com Recrutamento Invertido & Explicabilidade I.A

```text
Role & Goal:
Crie a tela principal do Dashboard do Desenvolvedor na Q.I. Match, ilustrando a dinâmica de Recrutamento Invertido (empresas convidam o candidato) e a explicabilidade algorítmica exigida pela LGPD (Art. 20).

Layout & Structure:
1. Header do Painel:
   - Boas-vindas personalizadas: "Olá, Flavio. Você tem 3 convites de empresas aguardando sua resposta."
   - Status do Perfil: "Perfil Verificado por I.A. (Score Médio: 88%)".

2. Banner de Recrutamento Invertido:
   - Card moderno com gradiente escuro e detalhes em amarelo neon:
     * Ícone de seta invertida ou ímã de talentos.
     * Texto: "Modelo Invertido Ativo: Seu currículo não está disputando vagas em pilhas abertas. As empresas abaixo analisaram sua aderência técnica e enviaram propostas diretas para o seu perfil."

3. Lista de Convites e Oportunidades com Match $\ge 75\%$:
   - Card de Vaga 1 (Exemplo: "Engenheiro Backend Sênior - Fintech X"):
     * Badge de Match Score: "🎯 92% de Compatibilidade Técnica" (em destaque verde-esmeralda e amarelo).
     * Detalhes: Remuneração (R$ 15.000 - R$ 18.000 PJ / CLT), Modelo Remoto, Stack: Python, FastAPI, PostgreSQL, Docker.
     * Botão Interativo de Explicabilidade (Solução Auditada):
       - "🔍 Por que recebi este convite?" (Link com sublinhado discreto).
     * Ações de Double Opt-In:
       - Botão Vermelho/Escuro: "Recusar com discrição"
       - Botão Amarelo Dourado: "Aceitar e Liberar Contato com a Empresa"

4. Modal / Drawer de Explicabilidade Algorítmica (Quando clica em "Por que recebi este convite?"):
   - Título: "Transparência do Match Técnico (LGPD Art. 20)"
   - Radar Chart ou Barras de Peso:
     * Afinidade com a Stack: 95% (Domínio comprovado de FastAPI e PostgreSQL na entrevista)
     * Experiência com Arquitetura: 88% (Conceitos de resiliência e concorrência)
     * Senioridade & Cultura: 90%
   - Conclusão da I.A.: "Seu desempenho na pergunta 2 sobre particionamento de banco atendeu rigorosamente aos requisitos essenciais desta vaga."
```

---

## 🎁 Prompt 5: Programa de Indicação & Tech Points (RN07, RF16 - Limite de 3 Indicações)

```text
Role & Goal:
Crie a interface do Programa de Indicação Técnica (Bounty / Tech Points) da Q.I. Match, permitindo que desenvolvedores recomendem colegas de stack com limite de proteção anti-spam.

Layout & Structure:
1. Hero de Recompensas:
   - Título: "Indique Bons Desenvolvedores & Ganhe Tech Points"
   - Saldo Atual: "1.250 Tech Points Acumulados" (equivalente a R$ 1.250,00).
   - Botão: "Resgatar em Vouchers Técnicos (Alura, Udemy, Certificações AWS)".

2. Regra Anti-Spam (RN07 / RF16):
   - Alerta visual com ícone de balança ou escudo:
     * "Para garantir a máxima assertividade das indicações, cada desenvolvedor pode indicar no máximo 3 profissionais por vaga ativa."
   - Indicador de cotas de indicação: "2 de 3 indicações utilizadas para a vaga Backend Python".

3. Formulário de Nova Indicação:
   - Campo: Nome do Colega.
   - Campo: E-mail / WhatsApp.
   - Campo: Link do Perfil do GitHub ou LinkedIn.
   - Dropdown: Vaga aberta recomendada.
   - TextArea: "Por que você recomenda este profissional? (Pontos fortes técnicos comprovados)".
   - Botão Primário: "Enviar Indicação Segura".

4. Tabela de Acompanhamento das Indicações:
   - Colunas:
     * Nome do Indicado
     * Vaga
     * Data de Envio
     * Status no Funil (Badges coloridos: "Em Análise", "Entrevista Agendada", "Contratado", "Recompensa Paga")
     * Pontos a Receber (Ex: "+ 500 Tech Points").
```

---

## 📊 Prompt 6: Painel Corporativo B2B & Triagem de Vagas (RF15 - 4 Estágios Oficiais)

```text
Role & Goal:
Crie o Painel de Gestão de Vagas e Triagem de Talentos para Recrutadores e Gestores de Tecnologia de Empresas B2B na plataforma Q.I. Match.

Layout & Structure:
1. Header da Empresa & Gerenciador de Slots:
   - Nome da Empresa contratante (ex: "Banco Alfa Tech").
   - Indicador de Slots Pré-pagos: "Slots Ativos: 2 de 3 utilizados (1 slot livre para nova vaga)".
   - Botão: "+ Adicionar Nova Vaga / Consumir Slot".

2. Barra de Filtros Rápidos:
   - Filtro pelas 11 Verticais (Chips roláveis).
   - Filtro por Senioridade (Júnior, Pleno, Sênior, Especialista, Lead).
   - Slider de Match Técnico Mínimo (Default fixado em $\ge 75\%$).

3. Funil de Triagem com os 4 Estágios Oficiais (RF15):
   - Visualização em Colunas Kanban:
     * Coluna 1: "1. Apresentado (Match Realizado)" - Candidatos pré-filtrados pela I.A. acima de 75%.
     * Coluna 2: "2. Entrevista Agendada" - Convite aceito pelo candidato (Double Opt-In concluído).
     * Coluna 3: "3. Aprovado" - Candidato selecionado pela equipe técnica.
     * Coluna 4: "4. Recusado" - Candidatos descartados com feedback construtivo.

4. Card de Candidato na Coluna (Item do Kanban):
   - Nome anonimizado (ou completo caso o candidato tenha aceitado o opt-in).
   - Senioridade e Verticais principais.
   - Match Score com badge dourado ("Match: 89%").
   - Player rápido da gravação de áudio da entrevista com link para ler a transcrição revisada pelo próprio candidato.
   - Botões de transição rápida: "Mover para Entrevista", "Aprovar" ou "Recusar".
```

---

## 🚀 Como Usar no Google Stitch

1. Abra o **Google Stitch** (ou o assistente de design de UI de sua escolha).
2. Comece colando o **Prompt 0** para fixar a identidade visual (preto, dourado e cinza-escuro industrial).
3. Cole um dos prompts numerados (**Prompt 1** a **Prompt 6**) correspondente à tela que deseja gerar ou aprimorar.
<!-- 4. Peça iterações ou exportação em código (Tailwind CSS / React) para incorporar diretamente nos componentes da pasta `src/portal/views/`. -->
