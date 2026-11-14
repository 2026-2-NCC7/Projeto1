# Q.I. Tech — MVP Funcional e Demonstrável

Aplicação web responsiva que demonstra o ciclo completo de recrutamento técnico invertido (*Reverse Job Board*), avaliação estruturada por IA com explicabilidade, processo seletivo em 8 etapas com **Double Opt-In nativo** e **Comunidade Técnica exclusiva para pessoas físicas**.

Desenvolvido para apresentação acadêmica de Ciência da Computação no Centro Universitário FECAP (2026).

---

## 1. Como Executar a Aplicação Localmente

### Pré-requisitos
- Node.js versão 18 ou superior
- Gerenciador de pacotes npm, yarn ou pnpm

### Instalação e Execução
```bash
# 1. Clone ou descompacte os arquivos na pasta do projeto
cd qitech

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

---

## 2. Como Atualizar o Deploy na Vercel (Instrução Permanente)

> **IMPORTANTE (Para o Usuário e Agentes de IA):**
> Como este repositório pertence à Organização do GitHub da faculdade (`2026-2-NCC7/Projeto1`), a publicação na Vercel é feita **diretamente a partir da pasta `dist`** na conta pessoal (`jenifermarques42s-projects/qi-match-fecap`), contornando a trava de permissão da Organização do GitHub e sem nenhum custo.

Sempre que quiser atualizar o endereço oficial (**https://qi-match-fecap.vercel.app**), basta rodar:

```bash
npm run deploy:vercel
```

Ou os dois comandos equivalentes:

```bash
npm run build
npx vercel deploy dist --prod --yes
```

### Links Publicados
- **Apresentação Principal (Mercado & Vídeo):** `https://qi-match-fecap.vercel.app`
- **Defesa Técnica & Arquitetura (Banca FECAP):** `https://qi-match-fecap.vercel.app/#/banca-tecnica`

