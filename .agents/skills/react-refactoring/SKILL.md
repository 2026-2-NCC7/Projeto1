---
name: react-refactoring
description: Executa refatorações seguras no código React e TypeScript, preservando contratos de API, tipagem e estabilidade de estado.
---

# React Refactoring Skill

## Finalidade
Realizar refatorações limpas e modulares nos componentes React da plataforma Q.I. Match, preservando 100% da lógica de negócio e estabilidade de execução.

## Responsabilidades
1. Reduzir duplicações e linhas de código desnecessárias.
2. Manter tipagem estrita em TypeScript, sem uso indevido de `any`.
3. Preservar contratos de API existentes (`api.ts`) e o estado global compartilhado (`AppContext.tsx`).
4. Evitar renderizações redundantes e loops de efeitos colaterais (`useEffect`).
5. Assegurar que o build de produção (`npm run build`) execute com código de saída 0 e sem avisos impeditivos.

## Checklist de Execução
- [ ] O código compila com sucesso (`tsc && vite build`).
- [ ] Props e contratos de funções permanecem compatíveis.
- [ ] Os estados de carregamento, erro e dados vazios são tratados explicitamente.
- [ ] Nenhum mock silencioso substitui dados reais do backend.

