"""
Catalog of 44 Tech Hard Skills and Soft Skills with detailed rubrics and aliases.
"""

INITIAL_SKILLS_CATALOG = [
    # ==================== HARD SKILLS (26 skills) ====================
    {
        "id": "hard-python",
        "name": "Python",
        "category": "HARD",
        "area": "Linguagens & Backend",
        "description": "Desenvolvimento de software, automação, análise de dados e APIs utilizando a linguagem Python e seu ecossistema.",
        "aliases": ["Python 3", "Python Programming", "Linguagem Python", "Py"],
        "behavioral_examples": [
            "Construção de APIs REST assíncronas utilizando FastAPI ou Flask",
            "Criação de scripts para automação de tarefas e rotinas ETL",
            "Manipulação e processamento de dados tabulares utilizando Pandas e NumPy",
            "Implementação de testes unitários com pytest e cobertura de código"
        ],
        "evaluation_criteria": {
            "1": "Conhecimento de sintaxe básica, tipos de dados primitivos e controle de fluxo.",
            "2": "Criação de scripts funcionais, manipulação de arquivos e uso de módulos padrão.",
            "3": "Desenvolvimento de rotinas orientadas a objetos, uso de pacotes de terceiros (Pandas, Requests) e tratamento de erros.",
            "4": "Arquitetura de APIs robustas, programação concorrente/assíncrona, boas práticas (PEP8, type hinting) e empacotamento.",
            "5": "Otimização de baixo nível (C-extensions, profiling), metaprogramação, design de frameworks internos e liderança técnica na linguagem."
        }
    },
    {
        "id": "hard-sql",
        "name": "SQL & Bancos Relacionais",
        "category": "HARD",
        "area": "Banco de Dados",
        "description": "Consulta, modelagem, manipulação e otimização de bancos de dados relacionais (PostgreSQL, MySQL, SQLite, Oracle).",
        "aliases": ["SQL", "Structured Query Language", "PostgreSQL", "MySQL", "Queries SQL"],
        "behavioral_examples": [
            "Escrita de queries complexas com múltiplos JOINs, subqueries e Window Functions",
            "Análise e otimização de planos de execução (EXPLAIN ANALYZE) e índices",
            "Criação de DDL, migrations versionadas e integridade referencial",
            "Implementação de procedures, triggers e controle transacional ACID"
        ],
        "evaluation_criteria": {
            "1": "Comandos básicos SELECT, WHERE, INSERT, UPDATE, DELETE.",
            "2": "Uso de INNER/LEFT JOINs, agregações (GROUP BY, HAVING) e funções escalares.",
            "3": "Modelagem relacional (3FN), criação de índices, subqueries e transações.",
            "4": "Window functions (ROW_NUMBER, RANK), CTEs complexas, otimização de planos de execução e tunning de queries.",
            "5": "Arquitetura de alta disponibilidade, particionamento de tabelas gigantes, replicação e governança corporativa de dados."
        }
    },
    {
        "id": "hard-javascript",
        "name": "JavaScript",
        "category": "HARD",
        "area": "Linguagens & Web",
        "description": "Programação moderna em JavaScript (ES6+), tanto para navegadores quanto para ambientes de servidor (Node.js).",
        "aliases": ["JS", "ECMAScript", "ES6+", "Vanilla JS"],
        "behavioral_examples": [
            "Manipulação assíncrona com Promises e async/await",
            "Implementação de lógica de interface reativa e consumo de APIs REST",
            "Compreensão de closures, event loop, protótipos e escopos"
        ],
        "evaluation_criteria": {
            "1": "Sintaxe fundamental, manipulação básica de variáveis e DOM.",
            "2": "Funções, arrays, manipulação de objetos e eventos simples.",
            "3": "Promises, async/await, desestruturação ES6, módulos e consumo de HTTP.",
            "4": "Domínio do event loop, Web APIs, metaprogramação e modularização avançada.",
            "5": "Contribuição para runtimes/motores JS (V8), tooling de build e arquitetura de larga escala."
        }
    },
    {
        "id": "hard-typescript",
        "name": "TypeScript",
        "category": "HARD",
        "area": "Linguagens & Web",
        "description": "Desenvolvimento tipado estaticamente sobre JavaScript para aplicações escaláveis e seguras.",
        "aliases": ["TS", "Type Script", "TypeScript Language"],
        "behavioral_examples": [
            "Definição de interfaces, types genéricos e union types avançados",
            "Configuração do tsconfig e integração com linters e bundlers",
            "Refatoração de código com inferência de tipos sem perder performance"
        ],
        "evaluation_criteria": {
            "1": "Tipagem de tipos primitivos e funções simples.",
            "2": "Criação de interfaces e tipos personalizados.",
            "3": "Uso de generics, enums, utility types (Partial, Omit, Pick).",
            "4": "Conditional types, mapped types, template literal types e criação de bibliotecas tipadas.",
            "5": "Arquitetura corporativa de tipos distribuídos e desenvolvimento de plugins para o compilador TS."
        }
    },
    {
        "id": "hard-react",
        "name": "React",
        "category": "HARD",
        "area": "Frontend",
        "description": "Construção de interfaces de usuário dinâmicas, componentizadas e reativas com React e seu ecossistema.",
        "aliases": ["React.js", "ReactJS", "React framework"],
        "behavioral_examples": [
            "Criação de componentes funcionais com Hooks personalizados",
            "Gerenciamento de estado global com Context API, Redux ou Zustand",
            "Otimização de renderização com useMemo, useCallback e React.memo"
        ],
        "evaluation_criteria": {
            "1": "Criação de componentes JSX simples e passagem de props.",
            "2": "Uso de useState e useEffect para estados locais e ciclos de vida.",
            "3": "Criação de custom hooks, consumo de APIs e roteamento com React Router.",
            "4": "Performance profiling, server-side rendering (SSR), suspense e arquitetura de design systems.",
            "5": "Core contributor ou arquiteto de microfrontends de altíssima escala com React."
        }
    },
    {
        "id": "hard-nodejs",
        "name": "Node.js",
        "category": "HARD",
        "area": "Backend",
        "description": "Desenvolvimento backend escalável e orientado a eventos no ambiente de execução Node.js.",
        "aliases": ["Node", "NodeJS", "Node runtime"],
        "behavioral_examples": [
            "Construção de microsserviços com Express, NestJS ou Fastify",
            "Manipulação de streams, buffers e concorrência no event loop",
            "Integração com bancos de dados e mensageria assíncrona"
        ],
        "evaluation_criteria": {
            "1": "Execução de scripts Node e gerenciamento de pacotes com NPM/Yarn.",
            "2": "Criação de servidores HTTP básicos e rotas com Express.",
            "3": "Autenticação JWT, middlewares, conexão com ORM/bancos e tratamento de erros.",
            "4": "Manipulação de streams, clusterização, worker threads e profiling de memória.",
            "5": "Arquitetura distribuída de microsserviços Node de altíssima vazão (milhões de req/s)."
        }
    },
    {
        "id": "hard-java",
        "name": "Java",
        "category": "HARD",
        "area": "Linguagens & Backend",
        "description": "Desenvolvimento corporativo robusto com Java e ecossistema Spring Boot.",
        "aliases": ["Linguagem Java", "Java 17", "Java 21", "JVM"],
        "behavioral_examples": [
            "Desenvolvimento de microsserviços com Spring Boot e Spring Cloud",
            "Persistência com JPA/Hibernate e gerenciamento de transações",
            "Concorrência com Java Threads, ExecutorService e Virtual Threads"
        ],
        "evaluation_criteria": {
            "1": "Sintaxe POO básica (classes, objetos, herança, encapsulamento).",
            "2": "Collections framework, tratamento de exceções e I/O básico.",
            "3": "Spring Boot (REST controllers, services, repositories) e Maven/Gradle.",
            "4": "Streams e lambdas avançadas, concorrência, otimização de GC da JVM e Spring Security.",
            "5": "Arquitetura enterprise, tuning profundo da JVM e sistemas de missão crítica de altíssima tolerância a falhas."
        }
    },
    {
        "id": "hard-apis",
        "name": "Desenvolvimento de APIs REST",
        "category": "HARD",
        "area": "Engenharia de Software",
        "description": "Concepção, design, implementação e documentação de APIs HTTP/RESTful escaláveis e seguras.",
        "aliases": ["REST APIs", "RESTful", "Web APIs", "OpenAPI", "Swagger"],
        "behavioral_examples": [
            "Modelagem de recursos HTTP seguindo métodos e status codes semânticos",
            "Documentação padronizada com OpenAPI/Swagger e contratos tipados",
            "Implementação de versionamento, paginação, filtros e rate limiting"
        ],
        "evaluation_criteria": {
            "1": "Conceito de endpoints, requisições GET/POST simples.",
            "2": "Uso correto de métodos HTTP (GET, POST, PUT, DELETE) e códigos de status.",
            "3": "Autenticação segura, validação de payload com schemas e documentação OpenAPI.",
            "4": "Idempotência, HATEOAS quando cabível, caching (ETag, Cache-Control) e webhooks.",
            "5": "Estratégias de API Gateway, governança corporativa de APIs e backwards compatibility em grande escala."
        }
    },
    {
        "id": "hard-data-modeling",
        "name": "Modelagem de Dados",
        "category": "HARD",
        "area": "Dados",
        "description": "Concepção conceitual, lógica e física de esquemas de dados relacionais e dimensionais.",
        "aliases": ["Modelagem Relacional", "Data Modeling", "Star Schema", "Snowflake Schema"],
        "behavioral_examples": [
            "Desenho de diagramas entidade-relacionamento (DER) normalizados",
            "Modelagem dimensional para data warehouses (tabelas fato e dimensões)",
            "Trade-offs entre normalização e desnormalização para performance de leitura"
        ],
        "evaluation_criteria": {
            "1": "Identificação de entidades, atributos e chaves primárias.",
            "2": "Relacionamentos 1:1, 1:N, N:M e chaves estrangeiras.",
            "3": "Normalização até a 3ª Forma Normal e diagramação DER.",
            "4": "Modelagem dimensional de Kimball (fatos e dimensões), SCD (Slowly Changing Dimensions).",
            "5": "Arquitetura de Lakehouse, modelagem de grafos/documentos e governança em ecossistemas de petabytes."
        }
    },
    {
        "id": "hard-etl",
        "name": "Pipelines de Dados & ETL/ELT",
        "category": "HARD",
        "area": "Engenharia de Dados",
        "description": "Extração, transformação, carga e orquestração de fluxos contínuos e batch de dados.",
        "aliases": ["ETL", "ELT", "Data Pipelines", "Engenharia de Dados", "Orquestração de Dados"],
        "behavioral_examples": [
            "Desenvolvimento de DAGs de orquestração com Apache Airflow ou Prefect",
            "Processamento batch e streaming com Spark ou Pandas",
            "Monitoramento de qualidade e linagem de dados"
        ],
        "evaluation_criteria": {
            "1": "Execução de scripts de extração simples em arquivos CSV/JSON.",
            "2": "Criação de pipelines sequenciais em Python ou ferramentas visuais.",
            "3": "Uso de orquestradores (Airflow), tratamento de falhas e reprocessamento idempotente.",
            "4": "Pipelines distribuídos com PySpark/dbt, testes de dados automatizados e particionamento eficiente.",
            "5": "Arquitetura lambda/kappa, streaming em tempo real com Kafka/Flink e observabilidade ponta a ponta."
        }
    },
    {
        "id": "hard-aws",
        "name": "AWS Cloud",
        "category": "HARD",
        "area": "Cloud & Infra",
        "description": "Provisionamento, arquitetura e gerenciamento de serviços na nuvem Amazon Web Services.",
        "aliases": ["Amazon Web Services", "Cloud AWS", "AWS"],
        "behavioral_examples": [
            "Configuração de instâncias EC2, buckets S3 e bancos gerenciados RDS",
            "Criação de funções serverless Lambda integradas com API Gateway e SQS",
            "Gerenciamento de segurança e políticas com AWS IAM e VPCs"
        ],
        "evaluation_criteria": {
            "1": "Navegação no console AWS e conceitos básicos de nuvem.",
            "2": "Uso de S3, EC2 básico e compreensão de regiões e zonas.",
            "3": "Configuração de RDS, Lambda, IAM roles e grupos de segurança.",
            "4": "Arquitetura serverless completa, VPCs com subnets públicas/privadas e CloudWatch.",
            "5": "Certificação AWS Solutions Architect Pro, multi-account com AWS Organizations e otimização FinOps."
        }
    },
    {
        "id": "hard-docker",
        "name": "Docker & Contêineres",
        "category": "HARD",
        "area": "DevOps",
        "description": "Empacotamento, distribuição e execução de aplicações em contêineres isolados com Docker.",
        "aliases": ["Docker", "Containers", "Dockerfile", "Docker Compose"],
        "behavioral_examples": [
            "Escrita de Dockerfiles multi-stage para gerar imagens enxutas e seguras",
            "Orquestração de ambientes locais com múltiplos serviços no Docker Compose",
            "Gerenciamento de volumes, redes virtuais e variáveis de ambiente"
        ],
        "evaluation_criteria": {
            "1": "Execução de comandos docker run, docker ps, docker stop.",
            "2": "Criação de Dockerfile básico e build de imagens.",
            "3": "Uso de docker-compose para múltiplos serviços, gerenciamento de volumes e variáveis.",
            "4": "Multi-stage builds, otimização de camadas, execução sem root (security hardening).",
            "5": "Custom runtimes (containerd/runc), auditoria de vulnerabilidades e arquiteturas avançadas de contêineres."
        }
    },
    {
        "id": "hard-git",
        "name": "Git & Controle de Versão",
        "category": "HARD",
        "area": "Engenharia de Software",
        "description": "Gestão de código-fonte, versionamento distribuído, resolução de conflitos e fluxos de trabalho colaborativos.",
        "aliases": ["Git", "GitHub", "GitLab", "Controle de Versão"],
        "behavioral_examples": [
            "Uso de branching strategies como Git Flow, Trunk-based Development ou GitHub Flow",
            "Resolução de conflitos em merges e rebase interativo",
            "Revisão de Pull Requests com comentários construtivos e rastreabilidade de commits"
        ],
        "evaluation_criteria": {
            "1": "Comandos básicos git clone, git add, git commit, git push.",
            "2": "Criação e troca de branches, git pull e resolução simples de conflitos.",
            "3": "Rebase, cherry-pick, git stash e condução de Pull Requests com boas mensagens.",
            "4": "Rebase interativo complexo, git bisect para encontrar bugs, hooks de pré-commit.",
            "5": "Governança corporativa de monorepos, estratégias de release branching e automações de repositório."
        }
    },
    {
        "id": "hard-testes",
        "name": "Testes Automatizados",
        "category": "HARD",
        "area": "Engenharia de Software",
        "description": "Garantia de qualidade contínua através de testes unitários, de integração, ponta a ponta (E2E) e TDD.",
        "aliases": ["Testes de Software", "QA", "Pytest", "Jest", "TDD", "Testes Unitários"],
        "behavioral_examples": [
            "Escrita de suítes de testes unitários isolados com mocks e fixtures",
            "Testes de integração de endpoints de API com bancos em memória ou contêineres de teste",
            "Aferição e manutenção de métricas de cobertura de código nos pipelines"
        ],
        "evaluation_criteria": {
            "1": "Conceito de teste manual vs automatizado, asserts simples.",
            "2": "Criação de testes unitários básicos em funções isoladas.",
            "3": "Uso de frameworks (pytest, Jest), fixtures, mocks e testes de rotas da API.",
            "4": "Testes de integração com dependências reais/Testcontainers, pirâmide de testes e TDD consistente.",
            "5": "Estratégia corporativa de QA, testes de carga/stress (k6), testes de mutação e chaos engineering."
        }
    },
    {
        "id": "hard-software-architecture",
        "name": "Arquitetura de Software",
        "category": "HARD",
        "area": "Engenharia de Software",
        "description": "Definição de padrões de projeto, estruturação modular, desacoplamento e design de sistemas escaláveis.",
        "aliases": ["System Design", "Design Patterns", "Clean Architecture", "Hexagonal Architecture", "Microsserviços"],
        "behavioral_examples": [
            "Aplicação prática de princípios SOLID e Clean Architecture",
            "Decisão fundamentada entre arquiteturas monolíticas modulares e microsserviços",
            "Implementação de padrões de projeto (Factory, Strategy, Repository, Observer)"
        ],
        "evaluation_criteria": {
            "1": "Conhecimento conceitual de organização em camadas (MVC).",
            "2": "Separação de responsabilidades e organização de pastas/módulos.",
            "3": "Aplicação de princípios SOLID, padrão Repository e injeção de dependências.",
            "4": "Arquitetura Hexagonal/Ports & Adapters, Event-driven architecture e escalabilidade horizontal.",
            "5": "Arquitetura corporativa de alta escala, resiliência (Circuit Breaker, Bulkhead) e governança técnica."
        }
    },
    {
        "id": "hard-data-visualization",
        "name": "Visualização de Dados & BI",
        "category": "HARD",
        "area": "Dados",
        "description": "Comunicação visual de dados e insights através de dashboards, relatórios e bibliotecas gráficas.",
        "aliases": ["Power BI", "Tableau", "Metabase", "Dashboards", "Data Viz"],
        "behavioral_examples": [
            "Criação de dashboards interativos no Power BI ou Metabase com métricas de negócio",
            "Visualização programática com Matplotlib, Seaborn ou Plotly",
            "Escolha apropriada de gráficos de acordo com a distribuição e propósito analítico"
        ],
        "evaluation_criteria": {
            "1": "Criação de gráficos básicos (barras, linhas, pizza).",
            "2": "Construção de relatórios com filtros e segmentações no Power BI ou similar.",
            "3": "Cálculos analíticos (DAX básico), storytelling com dados e visualizações interativas em Python.",
            "4": "Modelagem para relatórios analíticos, otimização de renderização e design centrado no usuário.",
            "5": "Governança corporativa de BI, catálogo de métricas unificado e visualizações avançadas customizadas."
        }
    },
    {
        "id": "hard-linux",
        "name": "Linux & Shell Scripting",
        "category": "HARD",
        "area": "Infra & DevOps",
        "description": "Operação de sistemas operacionais baseados em Linux, comandos de terminal e automação com Bash.",
        "aliases": ["Linux", "Bash", "Shell", "Terminal Unix", "Ubuntu"],
        "behavioral_examples": [
            "Gerenciamento de processos, serviços systemd e monitoramento de recursos (top, htop, df)",
            "Manipulação avançada de texto e logs com grep, sed, awk e pipes",
            "Automação de rotinas com scripts Bash e agendamento via Cron"
        ],
        "evaluation_criteria": {
            "1": "Comandos básicos de navegação (cd, ls, mkdir, rm).",
            "2": "Permissões de arquivos (chmod, chown), redirecionamentos e pipes.",
            "3": "Scripts Bash com variáveis, loops, condicionais e automações simples.",
            "4": "Gerenciamento de daemons (systemd), diagnóstico de rede (netstat, curl, tcpdump) e análise de logs com awk/sed.",
            "5": "Kernel tuning, segurança avançada (SELinux/AppArmor) e administração de frotas de servidores Linux."
        }
    },
    {
        "id": "hard-kubernetes",
        "name": "Kubernetes",
        "category": "HARD",
        "area": "DevOps & Cloud",
        "description": "Orquestração de contêineres em produção, gerenciamento de clusters, deployments e autoscaling.",
        "aliases": ["K8s", "Kubernetes cluster", "kubectl", "Helm"],
        "behavioral_examples": [
            "Criação de manifests de Pods, Deployments, Services e Ingress",
            "Gerenciamento de configurações com ConfigMaps e Secrets",
            "Empacotamento de aplicações com Helm charts"
        ],
        "evaluation_criteria": {
            "1": "Conceito de orquestração de contêineres e o que é um Pod.",
            "2": "Comandos básicos com kubectl (get pods, describe, logs).",
            "3": "Criação de manifests YAML para Deployments, Services e ConfigMaps.",
            "4": "Horizontal Pod Autoscaling (HPA), Ingress Controllers, Helm charts e StatefulSets.",
            "5": "Operação de clusters multi-region, service mesh (Istio), custom resource definitions (CRDs) e operators."
        }
    },
    {
        "id": "hard-cicd",
        "name": "CI/CD & Automação de Deploy",
        "category": "HARD",
        "area": "DevOps",
        "description": "Construção de esteiras automatizadas de integração e entrega contínua (GitHub Actions, GitLab CI, Jenkins).",
        "aliases": ["Integração Contínua", "Continuous Integration", "GitHub Actions", "GitLab CI", "Pipelines CI/CD"],
        "behavioral_examples": [
            "Criação de workflows no GitHub Actions para rodar linters, testes e builds automáticos",
            "Publicação automatizada de imagens Docker e deploy em ambientes de staging/produção",
            "Implementação de aprovações manuais e segredos de ambiente criptografados"
        ],
        "evaluation_criteria": {
            "1": "Conceito de integração contínua e entrega contínua.",
            "2": "Execução de jobs básicos para rodar testes a cada commit.",
            "3": "Workflows completos no GitHub Actions com steps de build, teste e publicação de artefato.",
            "4": "Estratégias de deploy Blue/Green ou Canary, cache eficiente de dependências e segurança de secrets.",
            "5": "Arquitetura corporativa de GitOps (ArgoCD), governança de compliance e esteiras multi-cloud."
        }
    },
    {
        "id": "hard-nosql",
        "name": "Bancos de Dados NoSQL",
        "category": "HARD",
        "area": "Banco de Dados",
        "description": "Trabalho com modelos de dados não-relacionais (documentos, chave-valor, grafos e colunas).",
        "aliases": ["NoSQL", "MongoDB", "Redis", "DynamoDB", "Document DB"],
        "behavioral_examples": [
            "Modelagem orientada a agregados no MongoDB",
            "Implementação de camada de cache de alta performance com Redis",
            "Uso de TTL (Time to Live) e estruturas de dados nativas do Redis (hashes, sets, sorted sets)"
        ],
        "evaluation_criteria": {
            "1": "Diferença entre relacional e não-relacional, CRUD simples em MongoDB.",
            "2": "Consultas com filtros e ordenações em bancos de documentos.",
            "3": "Indexação em coleções NoSQL e uso do Redis para cache de sessões.",
            "4": "Aggregation pipelines avançadas no MongoDB, estratégias de sharding e invalidação de cache.",
            "5": "Arquitetura distribuída com modelos híbridos Polyglot Persistence em larga escala."
        }
    },
    {
        "id": "hard-graphql",
        "name": "GraphQL",
        "category": "HARD",
        "area": "Backend & APIs",
        "description": "Linguagem de consulta e runtime para APIs com tipagem forte e resolução flexível de dados.",
        "aliases": ["GraphQL API", "Apollo Server", "GQL"],
        "behavioral_examples": [
            "Definição de schemas com Queries, Mutations e Subscriptions",
            "Implementação de resolvers e resolução do problema N+1 com DataLoader"
        ],
        "evaluation_criteria": {
            "1": "Conceito de consultas no GraphQL e vantagens sobre REST.",
            "2": "Escrita de queries com seleção de campos e passagem de variáveis.",
            "3": "Criação de mutations, tipos customizados e resolvers básicos.",
            "4": "Uso de DataLoaders para evitar N+1, diretivas e autenticação de contexto.",
            "5": "GraphQL Federation corporativo unificando múltiplos microsserviços."
        }
    },
    {
        "id": "hard-nlp",
        "name": "Processamento de Linguagem Natural (NLP)",
        "category": "HARD",
        "area": "Inteligência Artificial",
        "description": "Aplicação de técnicas computacionais para análise, extração, classificação e representação de textos humanos.",
        "aliases": ["NLP", "PLN", "Natural Language Processing", "Embeddings Semânticos", "Transformers"],
        "behavioral_examples": [
            "Geração e comparação de vetores semânticos com Sentence Transformers",
            "Pré-processamento textual, tokenização e extração de entidades nomeadas",
            "Avaliação de modelos com métricas de precisão, revocação e similaridade cosseno"
        ],
        "evaluation_criteria": {
            "1": "Conceito de tokenização, stop words e análise de sentimento básica.",
            "2": "Uso de bibliotecas como NLTK, spaCy ou scikit-learn para TF-IDF.",
            "3": "Geração de embeddings densos com modelos pré-treinados e busca por similaridade.",
            "4": "Fine-tuning de modelos Transformers, engenharia de prompts estruturados e avaliação semântica.",
            "5": "Pesquisa e arquitetura de sistemas RAG avançados e LLMs proprietários em produção."
        }
    },
    {
        "id": "hard-machine-learning",
        "name": "Machine Learning & Modelos Preditivos",
        "category": "HARD",
        "area": "Inteligência Artificial",
        "description": "Desenvolvimento, treinamento, validação e implantação de algoritmos de aprendizado de máquina supervisionado e não supervisionado.",
        "aliases": ["ML", "Aprendizado de Máquina", "Scikit-Learn", "Modelos Preditivos"],
        "behavioral_examples": [
            "Treinamento e validação de modelos de regressão, classificação e clustering",
            "Engenharia de features, normalização e prevenção de overfitting",
            "Avaliação rigorosa com validação cruzada, ROC-AUC, precisão e F1-Score"
        ],
        "evaluation_criteria": {
            "1": "Conceito de aprendizado supervisionado vs não supervisionado.",
            "2": "Treinamento de modelos básicos (Regressão Linear, Árvore de Decisão) no scikit-learn.",
            "3": "Pré-processamento de features, divisão treino/teste e cálculo de métricas de avaliação.",
            "4": "Modelos ensemble (Random Forest, XGBoost), hyperparameter tuning e pipelines de ML.",
            "5": "MLOps ponta a ponta, monitoramento de data drift e explicabilidade de modelos (SHAP/LIME)."
        }
    },
    {
        "id": "hard-data-warehousing",
        "name": "Data Warehousing & Analytics Engineering",
        "category": "HARD",
        "area": "Dados",
        "description": "Armazenamento analítico estruturado e transformação de dados em escala com dbt, Snowflake, BigQuery ou Redshift.",
        "aliases": ["DW", "Data Warehouse", "dbt", "BigQuery", "Snowflake"],
        "behavioral_examples": [
            "Criação de modelos analíticos modularizados com dbt e testes de dados",
            "Particionamento e clustering em BigQuery ou Snowflake para economia de custos"
        ],
        "evaluation_criteria": {
            "1": "Conceito de banco transacional (OLTP) vs analítico (OLAP).",
            "2": "Consultas analíticas em data warehouses na nuvem.",
            "3": "Construção de tabelas analíticas com dbt e documentação de linagem.",
            "4": "Otimização de custos de computação/armazenamento e governança de dados.",
            "5": "Arquitetura empresarial de Modern Data Stack com federação de dados."
        }
    },
    {
        "id": "hard-security",
        "name": "Segurança da Informação & DevSecOps",
        "category": "HARD",
        "area": "Segurança",
        "description": "Práticas de proteção de dados, autenticação segura, criptografia e mitigação de vulnerabilidades (OWASP).",
        "aliases": ["AppSec", "Segurança", "OWASP", "Criptografia", "Autenticação"],
        "behavioral_examples": [
            "Implementação de autenticação OAuth2 / JWT e controle de acesso RBAC",
            "Prevenção ativa de vulnerabilidades OWASP Top 10 (SQL Injection, XSS, CSRF)",
            "Auditoria de conformidade com LGPD e anonimização de dados sensíveis"
        ],
        "evaluation_criteria": {
            "1": "Conceito de senhas criptografadas (hashing com bcrypt) e HTTPS.",
            "2": "Uso correto de tokens JWT e variáveis de ambiente para segredos.",
            "3": "Validação rigorosa de inputs, controle de permissões por perfil (RBAC).",
            "4": "Varredura automatizada de vulnerabilidades (SAST/DAST) e criptografia em trânsito e repouso.",
            "5": "Arquitetura Zero Trust, modelagem de ameaças (Threat Modeling) e conformidade LGPD/ISO 27001."
        }
    },
    {
        "id": "hard-observability",
        "name": "Observabilidade & Monitoramento",
        "category": "HARD",
        "area": "DevOps",
        "description": "Coleta, análise e correlação dos pilares de observabilidade: métricas, logs e traces distribuídos.",
        "aliases": ["Monitoring", "Prometheus", "Grafana", "OpenTelemetry", "Logs"],
        "behavioral_examples": [
            "Instrumentação de código com OpenTelemetry para rastreamento de requisições",
            "Criação de alertas acionáveis e painéis no Grafana baseados em Prometheus",
            "Padronização de logs estruturados em formato JSON"
        ],
        "evaluation_criteria": {
            "1": "Leitura de logs de aplicação para identificação de erros.",
            "2": "Adição de logs estruturados informativos no código.",
            "3": "Instrumentação básica com métricas de tempo de resposta e taxas de erro.",
            "4": "Rastreamento distribuído (Distributed Tracing), dashboards de SLO/SLA no Grafana.",
            "5": "Engenharia de confiabilidade (SRE), análise proativa de anomalias e esteiras de auto-healing."
        }
    },

    # ==================== SOFT SKILLS (18 skills) ====================
    {
        "id": "soft-comunicacao",
        "name": "Comunicação Profissional",
        "category": "SOFT",
        "area": "Interpessoal",
        "description": "Capacidade de expressar ideias técnicas e de negócios com clareza, objetividade e empatia para diversos públicos.",
        "aliases": ["Comunicação", "Clareza de Expressão", "Comunicação Verbal e Escrita", "Storytelling Técnico"],
        "behavioral_examples": [
            "Explicação de decisões arquiteturais complexas para stakeholders não-técnicos",
            "Escrita de documentação técnica, RFCs e pull requests didáticos",
            "Escuta ativa durante reuniões para absorver feedbacks e requisitos"
        ],
        "evaluation_criteria": {
            "1": "Transmite mensagens simples, porém com dificuldades ocasionais de clareza ou prolixidade.",
            "2": "Comunica-se satisfatoriamente com pares imediatos da mesma área técnica.",
            "3": "Estrutura ideias de forma lógica, adapta o discurso para não-técnicos e mantém documentações claras.",
            "4": "Facilita alinhamentos estratégicos, apresenta soluções com segurança e domina comunicação assíncrona.",
            "5": "Referência em persuasão técnica, mediação com executivos e oratória em grandes fóruns."
        }
    },
    {
        "id": "soft-colaboracao",
        "name": "Colaboração em Equipe",
        "category": "SOFT",
        "area": "Trabalho em Equipe",
        "description": "Trabalho conjunto eficaz com colegas multidisciplinares para atingir objetivos coletivos.",
        "aliases": ["Trabalho em Equipe", "Teamwork", "Cooperação", "Espírito de Equipe"],
        "behavioral_examples": [
            "Apoio a colegas bloqueados em tarefas ou pareamento (Pair Programming)",
            "Compartilhamento voluntário de conhecimento em workshops e post-mortems",
            "Priorização do sucesso da entrega coletiva em relação a metas individuais"
        ],
        "evaluation_criteria": {
            "1": "Trabalha bem isolado, mas com pouca iniciativa de integração com o time.",
            "2": "Cumpre suas tarefas em equipe e atende solicitações de apoio quando demandado.",
            "3": "Atua proativamente em pareamento, auxilia pares e compartilha boas práticas espontaneamente.",
            "4": "Fomenta ambiente de confiança mútua, conecta times diferentes e remove silos organizacionais.",
            "5": "Constrói e dissemina cultura de excelência colaborativa em nível de diretoria ou tribo."
        }
    },
    {
        "id": "soft-resolucao-problemas",
        "name": "Resolução de Problemas Complexos",
        "category": "SOFT",
        "area": "Pensamento & Ação",
        "description": "Capacidade de investigar, isolar e resolver desafios técnicos ambíguos de maneira metódica.",
        "aliases": ["Problem Solving", "Troubleshooting", "Diagnóstico de Problemas", "Resolução Analítica"],
        "behavioral_examples": [
            "Identificação da causa raiz de incidentes críticos em produção (análise dos 5 porquês)",
            "Decomposição de problemas grandes e complexos em partes menores acionáveis",
            "Busca de alternativas pragmáticas diante de restrições de tempo ou recursos"
        ],
        "evaluation_criteria": {
            "1": "Resolve problemas pontuais e conhecidos com instruções passo a passo.",
            "2": "Investiga bugs conhecidos com pesquisa e tentativa e erro organizada.",
            "3": "Aplica método científico, reproduz cenários de erro e ataca a causa raiz comprovada.",
            "4": "Resolve incidentes graves sob pressão com precisão cirúrgica e propõe ações preventivas.",
            "5": "Encontra soluções inovadoras e econômicas para gargalos estruturais sistêmicos."
        }
    },
    {
        "id": "soft-organizacao",
        "name": "Organização & Gestão de Tempo",
        "category": "SOFT",
        "area": "Produtividade",
        "description": "Planejamento estruturado das próprias atividades, gerenciamento de prioridades e cumprimento de prazos.",
        "aliases": ["Gestão de Tempo", "Planejamento", "Produtividade Pessoal", "Organização"],
        "behavioral_examples": [
            "Quebra de épicos em tarefas com estimativas realistas no Jira/Trello",
            "Priorização eficaz entre demandas urgentes e importantes (Matriz de Eisenhower)",
            "Comunicação antecipada de eventuais impedimentos ou riscos de atraso"
        ],
        "evaluation_criteria": {
            "1": "Necessita de supervisão frequente para organizar cronograma e entregas.",
            "2": "Entrega tarefas dentro do prazo, mas tem dificuldade quando surgem urgências simultâneas.",
            "3": "Auto-gerencia prazos, prioriza demandas e comunica desvios antecipadamente.",
            "4": "Otimiza fluxos do time, identifica gargalos de processo e melhora a cadência da sprint.",
            "5": "Planejamento estratégico de roadmaps complexos com sincronização de múltiplos projetos."
        }
    },
    {
        "id": "soft-gestao-conflitos",
        "name": "Gestão de Conflitos",
        "category": "SOFT",
        "area": "Interpessoal",
        "description": "Habilidade de lidar com divergências técnicas e interpessoais de forma profissional, equilibrada e construtiva.",
        "aliases": ["Mediação de Conflitos", "Resolução de Divergências", "Negociação Interna"],
        "behavioral_examples": [
            "Mediação de discordâncias sobre escolhas arquiteturais com base em prós e contras objetivos",
            "Condução de conversas difíceis com postura receptiva e foco em soluções sem ataques pessoais",
            "Criação de consensos e alinhamentos de expectativas entre pessoas com visões opostas"
        ],
        "evaluation_criteria": {
            "1": "Evita conflitos ou reage de forma defensiva diante de discordâncias.",
            "2": "Aceita opiniões contrárias quando expostas de forma branda.",
            "3": "Separa o problema da pessoa, fundamenta argumentos em dados e busca soluções de consenso.",
            "4": "Atua como mediador imparcial em debates inflamados entre colegas, restabelecendo a harmonia produtiva.",
            "5": "Transforma conflitos institucionais crônicos em oportunidades de aprendizado e evolução cultural."
        }
    },
    {
        "id": "soft-pensamento-critico",
        "name": "Pensamento Crítico",
        "category": "SOFT",
        "area": "Cognitivo",
        "description": "Capacidade de questionar premissas, avaliar evidências e analisar trade-offs antes de tomar decisões técnicas.",
        "aliases": ["Critical Thinking", "Análise de Trade-offs", "Rigor Analítico"],
        "behavioral_examples": [
            "Avaliação cautelosa antes de adotar uma nova biblioteca ou tecnologia apenas por hype",
            "Identificação de falhas lógicas e riscos potenciais em propostas técnicas",
            "Questionamento saudável dos requisitos do produto para garantir valor real ao usuário"
        ],
        "evaluation_criteria": {
            "1": "Aceita orientações e decisões sem questionar viabilidade ou consequências.",
            "2": "Faz perguntas básicas sobre o porquê de certas soluções.",
            "3": "Avalia prós e contras de diferentes abordagens e valida premissas com dados concretos.",
            "4": "Prevê impactos colaterais a médio/longo prazo e desafia consensos superficiais com rigor.",
            "5": "Define critérios analíticos que orientam tomadas de decisão de alto impacto corporativo."
        }
    },
    {
        "id": "soft-adaptabilidade",
        "name": "Adaptabilidade & Flexibilidade",
        "category": "SOFT",
        "area": "Resiliência",
        "description": "Capacidade de se ajustar com rapidez a mudanças de escopo, tecnologias, processos e prioridades.",
        "aliases": ["Flexibilidade", "Resiliência", "Ajuste a Mudanças", "Agilidade de Aprendizado"],
        "behavioral_examples": [
            "Adaptação rápida a pivotagens estratégicas de negócio sem perda de produtividade",
            "Transição fluida entre projetos com stacks tecnológicas diferentes",
            "Acolhimento de novos processos ágeis e ferramentas corporativas"
        ],
        "evaluation_criteria": {
            "1": "Resiste a mudanças de rotina ou tecnologia, demandando longo tempo de adaptação.",
            "2": "Adapta-se a mudanças quando devidamente guiado e com tempo hábil.",
            "3": "Lida com mudanças de requisitos com naturalidade e mantém postura positiva.",
            "4": "Prospera em ambientes dinâmicos e ajuda a equipe a navegar em períodos de incerteza.",
            "5": "Lidera transformações organizacionais profundas, atuando como agente catalisador de mudanças."
        }
    },
    {
        "id": "soft-lideranca-tecnica",
        "name": "Liderança Técnica",
        "category": "SOFT",
        "area": "Liderança",
        "description": "Capacidade de guiar a direção tecnológica do time, influenciar decisões e elevar a barra de engenharia.",
        "aliases": ["Tech Lead", "Liderança", "Influência Técnica", "Mentoria Técnica"],
        "behavioral_examples": [
            "Condução de sessões de design técnico e alinhamento de padrões de código",
            "Mentoria contínua de engenheiros menos experientes para acelerar sua evolução",
            "Representação técnica do time em fóruns e alinhamentos com lideranças de produto"
        ],
        "evaluation_criteria": {
            "1": "Foca apenas nas suas entregas individuais, sem pretensão de influenciar pares.",
            "2": "Auxilia estagiários e juniores em tarefas operacionais quando solicitado.",
            "3": "Orienta decisões técnicas locais, revisa PRs com foco formativo e assume responsabilidade técnica.",
            "4": "Define diretrizes técnicas do time, desenvolve novos talentos e garante alto padrão de entrega.",
            "5": "Inspira comunidades técnicas, molda a visão de tecnologia da empresa e é referência na indústria."
        }
    },
    {
        "id": "soft-autonomia",
        "name": "Autonomia & Proatividade",
        "category": "SOFT",
        "area": "Produtividade",
        "description": "Capacidade de agir com independência, tomar iniciativa e propor soluções sem depender de ordens diretas.",
        "aliases": ["Proatividade", "Independência", "Iniciativa", "Ownership"],
        "behavioral_examples": [
            "Antecipação de problemas potenciais e proposição de melhorias antes que falhas ocorram",
            "Busca autônoma por respostas, documentações e alinhamentos para destravar o próprio trabalho",
            "Sentimento de dono (ownership) do início ao fim da entrega em produção"
        ],
        "evaluation_criteria": {
            "1": "Aguarda instruções explícitas antes de qualquer ação.",
            "2": "Executa tarefas bem definidas com autonomia moderada.",
            "3": "Destrava-se sozinho na maioria dos cenários, antecipa pequenos riscos e traz soluções propostas.",
            "4": "Assume ownership total de iniciativas complexas, liderando da concepção à operação sem supervisão.",
            "5": "Identifica oportunidades estratégicas não exploradas pelo negócio e cria iniciativas de alto impacto."
        }
    },
    {
        "id": "soft-aprendizado-continuo",
        "name": "Aprendizado Contínuo & Curiosidade",
        "category": "SOFT",
        "area": "Desenvolvimento Pessoal",
        "description": "Vontade constante de aprender novas tecnologias, metodologias e aplicar conhecimentos inovadores.",
        "aliases": ["Lifelong Learning", "Curiosidade Intelectual", "Autoaprendizado"],
        "behavioral_examples": [
            "Estudo autodidata de novidades do ecossistema e compartilhamento com o time",
            "Busca ativa por certificações, leituras técnicas e participação em comunidades",
            "Aplicação de lições aprendidas após retrospectivas e post-mortems"
        ],
        "evaluation_criteria": {
            "1": "Estuda apenas o estritamente necessário para cumprir o trabalho básico.",
            "2": "Aprende novas ferramentas quando exigido pelo projeto atual.",
            "3": "Mantém rotina ativa de estudos, acompanha novidades da área e experimenta novas abordagens.",
            "4": "Domina rapidamente novos conceitos complexos e dissemina o conhecimento na organização.",
            "5": "Pioneiro na introdução de paradigmas tecnológicos disruptivos na organização."
        }
    },
    {
        "id": "soft-empatia",
        "name": "Empatia & Inteligência Emocional",
        "category": "SOFT",
        "area": "Interpessoal",
        "description": "Compreensão dos sentimentos, limitações e perspectivas dos outros, agindo com consideração e respeito.",
        "aliases": ["Inteligência Emocional", "Empatia", "Sensibilidade Interpessoal"],
        "behavioral_examples": [
            "Oferecimento de feedbacks construtivos focados em comportamento e aprendizado, não em ataques",
            "Consideração das dores dos usuários finais ao projetar soluções de software",
            "Acolhimento de colegas em momentos de alta pressão ou dificuldades pessoais"
        ],
        "evaluation_criteria": {
            "1": "Dificuldade em reconhecer o impacto de suas atitudes nos sentimentos dos pares.",
            "2": "Demonstra respeito e cordialidade básica no dia a dia.",
            "3": "Ouve atentamente, valida as preocupações alheias e adapta seu comportamento com sensibilidade.",
            "4": "Excelente em feedback construtivo, apoia a saúde mental do time e constrói segurança psicológica.",
            "5": "Cria ambientes institucionais acolhedores, diversos e altamente colaborativos."
        }
    },
    {
        "id": "soft-negociacao",
        "name": "Negociação & Alinhamento de Expectativas",
        "category": "SOFT",
        "area": "Comunicação & Negócios",
        "description": "Habilidade de negociar escopo, prazos e recursos com bom senso técnico e comercial.",
        "aliases": ["Negociação", "Alinhamento de Escopo", "Trade-offs de Negócio"],
        "behavioral_examples": [
            "Proposição de entregas faseadas (MVP) para conciliar restrições de prazo com qualidade técnica",
            "Negociação equilibrada entre pagamento de débitos técnicos e entrega de novas features"
        ],
        "evaluation_criteria": {
            "1": "Cede a qualquer pressão de prazo ou resiste de forma intransigente a qualquer alteração.",
            "2": "Explica limitações de tempo de forma reativa.",
            "3": "Propõe soluções intermediárias (redução de escopo, entregas em fases) mantendo bom relacionamento.",
            "4": "Negocia habilmente com stakeholders de produto, demonstrando o ROI de decisões técnicas.",
            "5": "Alinha expectativas estratégicas corporativas entre engenharia, produto e diretoria executiva."
        }
    },
    {
        "id": "soft-foco-usuario",
        "name": "Foco no Usuário & Visão de Produto",
        "category": "SOFT",
        "area": "Negócios & Produto",
        "description": "Preocupação genuína com a experiência do cliente final e o valor de negócio gerado pelo software.",
        "aliases": ["Customer Centricity", "Visão de Produto", "Foco no Cliente"],
        "behavioral_examples": [
            "Questionamento do impacto de uma funcionalidade na usabilidade e satisfação do usuário",
            "Uso de métricas de uso e comportamento do usuário para orientar melhorias técnicas",
            "Busca pela entrega contínua de valor em vez de focar apenas na sofisticação do código"
        ],
        "evaluation_criteria": {
            "1": "Foca exclusivamente na tarefa técnica sem compreender para que serve a funcionalidade.",
            "2": "Entende o fluxo básico do usuário na aplicação.",
            "3": "Contribui com sugestões de usabilidade e prioriza a experiência do cliente final.",
            "4": "Conecta decisões técnicas diretamente a métricas de negócio (conversão, retenção, NPS).",
            "5": "Co-desenha a visão de produto junto à liderança, antecipando necessidades dos clientes."
        }
    },
    {
        "id": "soft-atencao-detalhes",
        "name": "Atenção a Detalhes & Rigor de Qualidade",
        "category": "SOFT",
        "area": "Produtividade",
        "description": "Cuidado meticuloso com consistência, casos de borda (edge cases) e padrão de excelência nas entregas.",
        "aliases": ["Rigor Técnico", "Atenção a Casos de Borda", "Capricho"],
        "behavioral_examples": [
            "Mapeamento e tratamento cuidadoso de cenários de erro e exceções raras",
            "Garantia de consistência visual, textual e semântica em interfaces e documentações",
            "Revisão minuciosa antes de submeter código para avaliação de pares"
        ],
        "evaluation_criteria": {
            "1": "Frequentemente comete descuidos evitáveis e esquece casos óbvios.",
            "2": "Corrige deslizes quando apontados na revisão de pares.",
            "3": "Prevê a maioria dos casos de borda e entrega código limpo, consistente e bem testado.",
            "4": "Padrão de qualidade impecável, identifica inconsistências sutis que passariam despercebidas.",
            "5": "Institui programas e práticas de qualidade de software que reduzem drasticamente defeitos corporativos."
        }
    },
    {
        "id": "soft-resiliencia",
        "name": "Resiliência & Gestão de Estresse",
        "category": "SOFT",
        "area": "Resiliência",
        "description": "Capacidade de manter a compostura, o foco e a produtividade sob pressão e diante de adversidades.",
        "aliases": ["Resiliência", "Controle Emocional", "Gestão sob Pressão"],
        "behavioral_examples": [
            "Manutenção da calma durante salas de crise e incidentes de alta severidade em produção",
            "Recuperação rápida após erros ou falhas em projetos, focando no aprendizado",
            "Administração sustentável da carga de trabalho para evitar burnout"
        ],
        "evaluation_criteria": {
            "1": "Fica paralisado ou perde a compostura diante de momentos de alta tensão.",
            "2": "Consegue lidar com estresse moderado com apoio da liderança.",
            "3": "Mantém foco e serenidade em situações críticas, priorizando ações lógicas.",
            "4": "Transmite tranquilidade e segurança ao time durante grandes crises ou prazos apertados.",
            "5": "Cultiva ambientes resilientes, equilibrando intensidade de entrega com saúde e sustentabilidade."
        }
    },
    {
        "id": "soft-mentoria",
        "name": "Mentoria & Desenvolvimento de Pessoas",
        "category": "SOFT",
        "area": "Liderança",
        "description": "Dedicação voluntária em apoiar o crescimento profissional e técnico de outras pessoas.",
        "aliases": ["Mentoria", "Coaching Técnico", "Desenvolvimento de Talentos"],
        "behavioral_examples": [
            "Realização periódica de 1:1s técnicos e planos de desenvolvimento com novatos",
            "Criação de trilhas de onboarding e documentação para acelerar novos membros",
            "Celebração genuína do progresso e das conquistas de colegas orientados"
        ],
        "evaluation_criteria": {
            "1": "Pouco interesse em orientar outros colegas.",
            "2": "Responde dúvidas pontuais quando perguntado diretamente.",
            "3": "Dedica tempo regular para guiar colegas, tirar dúvidas e acelerar o onboarding.",
            "4": "Atua como mentor ativo, estruturando desafios formativos que aceleram promoções.",
            "5": "Cria programas formais de mentoria e formação de engenharia em larga escala."
        }
    },
    {
        "id": "soft-humildade-intelectual",
        "name": "Humildade Intelectual & Receptividade a Feedback",
        "category": "SOFT",
        "area": "Desenvolvimento Pessoal",
        "description": "Reconhecimento das próprias limitações, disposição para admitir erros e abertura sincera para aprender com críticas.",
        "aliases": ["Abertura a Feedback", "Humildade", "Receptividade"],
        "behavioral_examples": [
            "Acolhimento construtivo de comentários em code reviews sem apego ao próprio código",
            "Transparência imediata ao admitir falhas e proposição de correções",
            "Disposição para mudar de opinião quando confrontado com dados melhores"
        ],
        "evaluation_criteria": {
            "1": "Demonstra forte apego às próprias ideias e reage defensivamente a críticas.",
            "2": "Aceita feedbacks com relutância inicial, mas implementa as mudanças solicitadas.",
            "3": "Pede ativamente feedbacks, recebe sugestões com gratidão e ajusta atitudes com prontidão.",
            "4": "Estimula debate aberto sobre seus próprios pontos cegos e dá o exemplo de vulnerabilidade positiva.",
            "5": "Fomenta cultura corporativa sem culpabilização individual (blameless culture), focada em aprendizado contínuo."
        }
    },
    {
        "id": "soft-orientacao-resultados",
        "name": "Orientação a Resultados & Eficiência",
        "category": "SOFT",
        "area": "Negócios & Produtividade",
        "description": "Compromisso em gerar impacto mensurável e entregar soluções eficientes com uso inteligente de recursos.",
        "aliases": ["Foco em Resultados", "Pragmatismo", "Eficiência", "Impacto Mensurável"],
        "behavioral_examples": [
            "Equilíbrio entre perfeccionismo técnico e necessidade de entrega rápida de valor",
            "Definição e acompanhamento de indicadores-chave de desempenho (KPIs/OKRs) para os projetos",
            "Descarte rápido de abordagens ineficientes que não trazem ganho comprovado"
        ],
        "evaluation_criteria": {
            "1": "Perde-se em detalhes cosméticos ou otimizações prematuras sem foco no objetivo.",
            "2": "Cumpre metas quando rigidamente estipuladas por outrem.",
            "3": "Mantém foco claro no objetivo final da entrega e prioriza o que traz maior retorno com menor esforço.",
            "4": "Entrega consistentemente impacto de negócio relevante, quantificável e sustentável.",
            "5": "Define direcionamentos estratégicos que maximizam eficiência operacional e receita em toda a empresa."
        }
    }
]
