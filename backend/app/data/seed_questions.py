"""
Structured interview questions bank:
- Type A: General Competency Mapping (8 structured open questions)
- Type B: Job-directed specialized questions mapped to technical requirements
"""

GENERAL_QUESTIONS_TYPE_A = [
    {
        "id": "q-geral-001",
        "text": "Conte sobre um projeto profissional ou acadêmico relevante do qual participou. Qual era o objetivo principal e qual foi especificamente a sua contribuição técnica?",
        "category": "GERAL",
        "target_competencies": ["hard-apis", "hard-software-architecture", "soft-orientacao-resultados", "soft-comunicacao"],
        "rubric": "Avaliar se o candidato descreve seu papel específico com clareza, destacando tecnologias usadas e impacto alcançado, distinguindo trabalho individual de contribuições coletivas.",
        "order_index": 1
    },
    {
        "id": "q-geral-002",
        "text": "Descreva um problema técnico desafiador ou um bug complexo que encontrou recentemente. Como você estruturou a investigação e qual foi a solução adotada?",
        "category": "TECNICA",
        "target_competencies": ["soft-resolucao-problemas", "soft-pensamento-critico", "hard-testes", "hard-observability"],
        "rubric": "Verificar se o candidato demonstra metodologia analítica estruturada (investigação de causa raiz, reprodução, isolamento) em vez de tentativa e erro aleatória.",
        "order_index": 2
    },
    {
        "id": "q-geral-003",
        "text": "Conte sobre uma situação em que você precisou colaborar ativamente com outras pessoas da equipe ou de outras áreas para atingir um resultado importante.",
        "category": "COMPORTAMENTAL",
        "target_competencies": ["soft-colaboracao", "soft-comunicacao", "soft-empatia"],
        "rubric": "Identificar evidências de pareamento, apoio a pares, escuta ativa e facilitação de alinhamentos entre diferentes papéis.",
        "order_index": 3
    },
    {
        "id": "q-geral-004",
        "text": "Como você costuma planejar e organizar suas tarefas diárias quando surgem múltiplas demandas ou prioridades concorrentes com prazos apertados?",
        "category": "COMPORTAMENTAL",
        "target_competencies": ["soft-organizacao", "soft-autonomia", "soft-negociacao"],
        "rubric": "Analisar critérios de priorização (urgente vs importante), comunicação antecipada de impedimentos e métodos de organização pessoal.",
        "order_index": 4
    },
    {
        "id": "q-geral-005",
        "text": "Descreva uma situação em que você teve uma discordância técnica ou interpessoal com um colega de trabalho ou liderança. Como a conversa foi conduzida e qual foi o desfecho?",
        "category": "COMPORTAMENTAL",
        "target_competencies": ["soft-gestao-conflitos", "soft-humildade-intelectual", "soft-empatia"],
        "rubric": "Verificar se o candidato separa o problema da pessoa, fundamenta suas posições em critérios técnicos objetivos e busca soluções de consenso saudáveis.",
        "order_index": 5
    },
    {
        "id": "q-geral-006",
        "text": "Quais linguagens, bancos de dados e ferramentas você utilizou com mais profundidade em seus projetos recentes? Dê exemplos práticos de como foram aplicadas.",
        "category": "TECNICA",
        "target_competencies": ["hard-python", "hard-sql", "hard-javascript", "hard-docker", "hard-git"],
        "rubric": "Identificar competências técnicas concretas mencionadas espontaneamente e o nível de profundidade prática das decisões tomadas.",
        "order_index": 6
    },
    {
        "id": "q-geral-007",
        "text": "Conte sobre uma ocasião em que precisou aprender rapidamente uma nova ferramenta, framework ou conceito tecnológico para atender a uma necessidade do projeto.",
        "category": "COMPORTAMENTAL",
        "target_competencies": ["soft-aprendizado-continuo", "soft-adaptabilidade", "soft-autonomia"],
        "rubric": "Avaliar curva de aprendizado, métodos de estudo autodidata, velocidade de assimilação e aplicação bem-sucedida do novo conhecimento.",
        "order_index": 7
    },
    {
        "id": "q-geral-008",
        "text": "Qual foi uma decisão técnica ou arquitetural difícil que você precisou tomar? Quais trade-offs foram considerados e o que aprendeu com essa escolha?",
        "category": "TECNICA",
        "target_competencies": ["hard-software-architecture", "soft-pensamento-critico", "soft-humildade-intelectual"],
        "rubric": "Identificar maturidade na análise de vantagens e desvantagens de cada alternativa técnica e capacidade de assumir responsabilidade por decisões.",
        "order_index": 8
    }
]

JOB_DIRECTED_QUESTIONS_BANK = [
    {
        "id": "q-vaga-python-01",
        "text": "Como você estruturaria uma API assíncrona em Python com alta concorrência? Quais bibliotecas utilizaria e como garantiria integridade e performance sob carga?",
        "category": "TECNICA",
        "target_competencies": ["hard-python", "hard-apis", "hard-testes"],
        "rubric": "Verificar menção a FastAPI/AsyncIO, pooling de conexões, tratamento de exceptions assíncronas e testes de carga.",
        "order_index": 10
    },
    {
        "id": "q-vaga-sql-01",
        "text": "Descreva uma situação em que precisou otimizar uma query SQL lenta que estava degradando o banco de dados. Quais passos seguiu para diagnosticar e resolver o problema?",
        "category": "TECNICA",
        "target_competencies": ["hard-sql", "hard-data-modeling"],
        "rubric": "Verificar uso de EXPLAIN/ANALYZE, criação criteriosa de índices, reescrita de subqueries ou eliminação de scans de tabela inteira.",
        "order_index": 11
    },
    {
        "id": "q-vaga-etl-01",
        "text": "Como você projeta um pipeline de ingestão e transformação de dados (ETL/ELT) para ser resiliente a falhas temporárias e garantir idempotência no processamento?",
        "category": "TECNICA",
        "target_competencies": ["hard-etl", "hard-data-modeling", "hard-python"],
        "rubric": "Verificar tratamento de duplicidades (upserts/dedup), orquestração com retry automático, monitoramento de linagem e qualidade dos dados.",
        "order_index": 12
    },
    {
        "id": "q-vaga-aws-01",
        "text": "Qual experiência você tem com serviços de nuvem AWS? Explique como você arquitetaria o armazenamento seguro e o processamento de arquivos em grande escala utilizando serviços como S3, Lambda ou ECS.",
        "category": "TECNICA",
        "target_competencies": ["hard-aws", "hard-security", "hard-docker"],
        "rubric": "Verificar entendimento de políticas IAM, criptografia no S3, custos de processamento e arquitetura orientada a eventos na AWS.",
        "order_index": 13
    },
    {
        "id": "q-vaga-react-01",
        "text": "Como você gerencia estados complexos em aplicações React com múltiplos componentes interdependentes? Como evita re-renderizações desnecessárias e assegura boa experiência do usuário?",
        "category": "TECNICA",
        "target_competencies": ["hard-react", "hard-typescript", "hard-javascript"],
        "rubric": "Verificar domínio de memoização (useMemo/useCallback), gerenciamento de estado (Context, Zustand, Redux) e profiling de componentes.",
        "order_index": 14
    },
    {
        "id": "q-vaga-devops-01",
        "text": "Descreva como você configuraria uma esteira de CI/CD completa para uma aplicação em contêineres, desde o commit até o deploy automatizado em produção com testes e rollback.",
        "category": "TECNICA",
        "target_competencies": ["hard-docker", "hard-cicd", "hard-kubernetes", "hard-git"],
        "rubric": "Verificar multi-stage builds, scans de segurança de imagens, execução de testes automatizados e estratégias de deploy sem downtime.",
        "order_index": 15
    }
]
