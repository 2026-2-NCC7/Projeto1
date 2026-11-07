---
name: privacy-consent-qa
description: Valida a conformidade estrita com a LGPD, o mecanismo de Double Opt-In e o isolamento entre perfis público e privado.
---

# Privacy & Consent QA Skill

## Finalidade
Garantir que os princípios de Privacy by Design, Double Opt-In e direitos do titular previstos na LGPD (Artigos 18 e 20) sejam rigorosamente cumpridos na interface e nas chamadas de dados.

## Responsabilidades
1. Verificar se dados de contato do candidato (nome real, e-mail, telefone, links de redes sociais) permanecem estritamente mascarados antes do consentimento individual por vaga.
2. Validar que o aceite do convite ("Autorizar compartilhamento") explique com clareza quais dados serão revelados à empresa.
3. Assegurar que o perfil comunitário público não vaze pretensão salarial, status de busca de emprego ou processos seletivos.
4. Validar o canal e o fluxo de Direito de Réplica (Art. 20 LGPD) para relatórios gerados por inteligência artificial.

## Checklist de Execução
- [ ] Antes do aceite, o card do candidato exibe apenas identificador anônimo, senioridade, competências e score explicável.
- [ ] O diálogo de autorização detalha explicitamente os dados liberados.
- [ ] A recusa mantém a identidade 100% anônima e encerra o processo de forma segura.
- [ ] O laudo de avaliação por IA possui opção acessível de solicitação de revisão.

