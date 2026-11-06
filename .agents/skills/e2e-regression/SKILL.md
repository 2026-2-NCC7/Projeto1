---
name: e2e-regression
description: Valida fluxos ponta a ponta nas jornadas de candidato, empresa, comunidade e administrador prevenindo regressões funcionais.
---

# End-to-End Regression Skill

## Finalidade
Garantir que as melhorias visuais e de usabilidade não introduzam regressões nos fluxos críticos de negócio da plataforma Q.I. Tech.

## Responsabilidades
1. Testar os 5 cenários canônicos de validação:
   - Cenário 1: Novo candidato (onboarding em etapas, perfil e busca de vagas).
   - Cenário 2: Entrevista por IA (gravação, transcrição, edição e envio).
   - Cenário 3: Empresa contratante (cadastro de vaga em etapas, shortlist anônima e envio de convite).
   - Cenário 4: Consentimento (recebimento do convite e autorização de compartilhamento).
   - Cenário 5: Relatório contestado (visualização de evidências e solicitação de revisão).
2. Monitorar logs do console e respostas de rede para detectar eventuais falhas silenciosas.
3. Testar a consistência em diferentes larguras de tela (mobile, tablet, desktop).

## Checklist de Execução
- [ ] Cadastro e onboarding fluem sem travar.
- [ ] Gravação e transcrição de áudio funcionam sem erro.
- [ ] Vagas publicadas aparecem na shortlist e no motor de matching.
- [ ] O fluxo de autorização de compartilhamento atualiza o status de forma transparente.
- [ ] `npm run build` executa sem erros em modo de produção.
