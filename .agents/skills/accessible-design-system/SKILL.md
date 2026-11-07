---
name: accessible-design-system
description: Garante consistência visual, padrões de componentes reutilizáveis, responsividade e acessibilidade conforme diretrizes WCAG 2.2 AA.
---

# Accessible Design System Skill

## Finalidade
Assegurar padrões consistentes de layout, espaçamento, tipografia, cores semânticas e acessibilidade WCAG 2.2 AA em toda a plataforma.

## Responsabilidades
1. Padronizar componentes fundamentais:
   - `PageHeader`, `PrimaryAction`, `MetricCard`, `StatusBadge`, `EmptyState`, `LoadingState`, `ConfirmationDialog`, `DetailDisclosure`, `StepProgress`.
2. Validar o contraste de cores (mínimo 4.5:1 para texto normal, 3:1 para texto grande e componentes UI) nos modos Claro e Escuro.
3. Garantir acessibilidade via teclado (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`), foco visível e rótulos para leitores de tela (`aria-label`, `aria-expanded`).
4. Testar a responsividade para Mobile (360–390px), Tablet (~768px) e Desktop (1280–1440px), eliminando rolagem horizontal acidental.

## Checklist de Execução
- [ ] O foco de navegação por teclado é claramente visível em todos os botões e links.
- [ ] Formulários possuem `<label>` associado semanticamente a cada `<input>` ou `<textarea>`.
- [ ] Botões e áreas de toque possuem alvos confortáveis (mínimo 44x44px em mobile).
- [ ] Não há perda de legibilidade no alternador de temas Claro / Escuro.

