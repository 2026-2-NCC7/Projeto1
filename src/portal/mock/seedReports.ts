import { AssessmentReport } from '../../types';

export const SEED_ASSESSMENT_REPORTS: AssessmentReport[] = [
  {
    "id": "39311cb5-c3a8-4ade-889d-a3722b447a0b",
    "candidate_id": "b395007c-8a03-4dde-8507-d8a51607caea",
    "interview_id": "49e99340-649e-497a-af30-33dd21bbd046",
    "status": "PRELIMINAR",
    "active_version_number": 1,
    "model_metadata": {
      "whisper_model": "small",
      "llm_model": "qwen3:4b",
      "embedding_model": "intfloat/multilingual-e5-small",
      "created_at": "2026-10-17T23:57:35.864851"
    },
    "created_at": "2026-10-17 23:57:35.864851",
    "updated_at": "2026-10-17 23:57:35.864851",
    "candidate_name": "Lucas Silva",
    "versions": [
      {
        "id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
        "report_id": "39311cb5-c3a8-4ade-889d-a3722b447a0b",
        "version_number": 1,
        "status": "ATIVO",
        "summary": "Perfil processado com 5 competências analisadas.",
        "created_at": "2026-10-17 23:57:35.864851",
        "assessments": [
          {
            "id": "11108331-695a-4f1f-84eb-41f5e6971b44",
            "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Python'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:35.873164",
            "evidences": [
              {
                "id": "e6475237-4230-4a7d-b846-6dcc55919919",
                "assessment_id": "11108331-695a-4f1f-84eb-41f5e6971b44",
                "answer_id": "322d6e41-f682-4532-8efa-431c8e9191b2",
                "exact_quote": "No meu projeto mais recente, desenvolvi um pipeline de dados em Python utilizando Pandas e Fastparquet para processar 50 milhões de registros diários",
                "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:35.874195"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "24eb490e-e0c5-46d3-b28e-71e738923941",
            "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
            "skill_id": "hard-sql",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'SQL & Bancos Relacionais'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:35.874195",
            "evidences": [
              {
                "id": "53462a23-b492-498f-b1aa-db5b7140f877",
                "assessment_id": "24eb490e-e0c5-46d3-b28e-71e738923941",
                "answer_id": "402af974-149e-4d59-b109-4c5c2e9d540e",
                "exact_quote": "Utilizei o comando EXPLAIN ANALYZE no PostgreSQL, identifiquei sequential scans em tabelas volumosas e criei índices B-tree parciais com reescrita da query SQL, diminuindo a latência de 14 segundos para menos de 100 milissegundos",
                "explanation": "O candidato cita explicitamente 'SQL' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:35.876104"
              },
              {
                "id": "e134d0c9-1582-417c-86e7-3eb5935305b5",
                "assessment_id": "24eb490e-e0c5-46d3-b28e-71e738923941",
                "answer_id": "402af974-149e-4d59-b109-4c5c2e9d540e",
                "exact_quote": "Utilizei o comando EXPLAIN ANALYZE no PostgreSQL, identifiquei sequential scans em tabelas volumosas e criei índices B-tree parciais com reescrita da query SQL, diminuindo a latência de 14 segundos para menos de 100 milissegundos",
                "explanation": "O candidato cita explicitamente 'PostgreSQL' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:35.876104"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "769e0f48-c5d8-439f-a562-f97c4d738b97",
            "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
            "skill_id": "hard-etl",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:35.875488",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "201e29a8-4b38-4e23-b4fb-ca62acdcf397",
            "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
            "skill_id": "hard-docker",
            "declared": true,
            "declared_level": 3,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Docker & Contêineres' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:35.876104",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "1ef94e1f-473c-45b2-a361-4ace655ce688",
            "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
            "skill_id": "soft-comunicacao",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Comunicação Profissional' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:35.876104",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      }
    ],
    "active_version": {
      "id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
      "report_id": "39311cb5-c3a8-4ade-889d-a3722b447a0b",
      "version_number": 1,
      "status": "ATIVO",
      "summary": "Perfil processado com 5 competências analisadas.",
      "created_at": "2026-10-17 23:57:35.864851",
      "assessments": [
        {
          "id": "11108331-695a-4f1f-84eb-41f5e6971b44",
          "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
          "skill_id": "hard-python",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "EVIDENCIADA",
          "estimated_level": 4,
          "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Python'.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:35.873164",
          "evidences": [
            {
              "id": "e6475237-4230-4a7d-b846-6dcc55919919",
              "assessment_id": "11108331-695a-4f1f-84eb-41f5e6971b44",
              "answer_id": "322d6e41-f682-4532-8efa-431c8e9191b2",
              "exact_quote": "No meu projeto mais recente, desenvolvi um pipeline de dados em Python utilizando Pandas e Fastparquet para processar 50 milhões de registros diários",
              "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:35.874195"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "24eb490e-e0c5-46d3-b28e-71e738923941",
          "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
          "skill_id": "hard-sql",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "EVIDENCIADA",
          "estimated_level": 4,
          "explanation": "O relato apresenta ações concretas e implementação prática da competência 'SQL & Bancos Relacionais'.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:35.874195",
          "evidences": [
            {
              "id": "53462a23-b492-498f-b1aa-db5b7140f877",
              "assessment_id": "24eb490e-e0c5-46d3-b28e-71e738923941",
              "answer_id": "402af974-149e-4d59-b109-4c5c2e9d540e",
              "exact_quote": "Utilizei o comando EXPLAIN ANALYZE no PostgreSQL, identifiquei sequential scans em tabelas volumosas e criei índices B-tree parciais com reescrita da query SQL, diminuindo a latência de 14 segundos para menos de 100 milissegundos",
              "explanation": "O candidato cita explicitamente 'SQL' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:35.876104"
            },
            {
              "id": "e134d0c9-1582-417c-86e7-3eb5935305b5",
              "assessment_id": "24eb490e-e0c5-46d3-b28e-71e738923941",
              "answer_id": "402af974-149e-4d59-b109-4c5c2e9d540e",
              "exact_quote": "Utilizei o comando EXPLAIN ANALYZE no PostgreSQL, identifiquei sequential scans em tabelas volumosas e criei índices B-tree parciais com reescrita da query SQL, diminuindo a latência de 14 segundos para menos de 100 milissegundos",
              "explanation": "O candidato cita explicitamente 'PostgreSQL' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:35.876104"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "769e0f48-c5d8-439f-a562-f97c4d738b97",
          "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
          "skill_id": "hard-etl",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:35.875488",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "201e29a8-4b38-4e23-b4fb-ca62acdcf397",
          "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
          "skill_id": "hard-docker",
          "declared": true,
          "declared_level": 3,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Docker & Contêineres' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:35.876104",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "1ef94e1f-473c-45b2-a361-4ace655ce688",
          "version_id": "468dccbc-d1bd-4ffc-b8a4-65f730899c15",
          "skill_id": "soft-comunicacao",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Comunicação Profissional' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:35.876104",
          "evidences": [],
          "skill_category": "SOFT"
        }
      ],
      "reviews": []
    }
  },
  {
    "id": "32ee09d2-fa72-4015-b13d-f5b91cf5059e",
    "candidate_id": "e2c45b64-3483-4716-a2c0-cc579a371b0f",
    "interview_id": "272bdc51-dc7a-499d-a044-eee92e43470a",
    "status": "PRELIMINAR",
    "active_version_number": 1,
    "model_metadata": {
      "whisper_model": "small",
      "llm_model": "qwen3:4b",
      "embedding_model": "intfloat/multilingual-e5-small",
      "created_at": "2026-10-17T23:57:38.404295"
    },
    "created_at": "2026-10-17 23:57:38.404936",
    "updated_at": "2026-10-17 23:57:38.404936",
    "candidate_name": "Beatriz Souza",
    "versions": [
      {
        "id": "224287df-81e1-49f4-9840-9c83dbd86534",
        "report_id": "32ee09d2-fa72-4015-b13d-f5b91cf5059e",
        "version_number": 1,
        "status": "ATIVO",
        "summary": "Perfil processado com 5 competências analisadas.",
        "created_at": "2026-10-17 23:57:38.408335",
        "assessments": [
          {
            "id": "fb24f361-3fc2-4c1e-bb98-f0e1015cde88",
            "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "DIVERGENCIA_IDENTIFICADA",
            "estimated_level": 2,
            "explanation": "Autodeclaração avançada (nível 4), porém os relatos apresentaram evidências básicas (nível 2).",
            "requires_review": true,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:38.408978",
            "evidences": [
              {
                "id": "41bc83b1-192c-4897-aebe-62fda0abf613",
                "assessment_id": "fb24f361-3fc2-4c1e-bb98-f0e1015cde88",
                "answer_id": "4b2baa74-5dc1-44cd-a47b-c1613aa3d3cd",
                "exact_quote": "Construí uma aplicação web utilizando React no frontend com gerenciamento via Context API e backend em Python com FastAPI para autenticação de clientes",
                "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:38.408978"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "a0eb7c60-b4eb-423b-8fa6-766a5f6ece4a",
            "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
            "skill_id": "hard-sql",
            "declared": true,
            "declared_level": 3,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'SQL & Bancos Relacionais' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:38.408978",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "44d7b094-f248-425b-861a-8a35961aff50",
            "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
            "skill_id": "hard-react",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "DIVERGENCIA_IDENTIFICADA",
            "estimated_level": 2,
            "explanation": "Autodeclaração avançada (nível 4), porém os relatos apresentaram evidências básicas (nível 2).",
            "requires_review": true,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:38.409620",
            "evidences": [
              {
                "id": "c2004163-98c4-4aa1-903c-91d7927e01ec",
                "assessment_id": "44d7b094-f248-425b-861a-8a35961aff50",
                "answer_id": "4b2baa74-5dc1-44cd-a47b-c1613aa3d3cd",
                "exact_quote": "Construí uma aplicação web utilizando React no frontend com gerenciamento via Context API e backend em Python com FastAPI para autenticação de clientes",
                "explanation": "O candidato cita explicitamente 'React' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:38.409620"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "6037c2fb-49dd-407d-8e5c-803cc946e803",
            "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
            "skill_id": "hard-security",
            "declared": false,
            "declared_level": null,
            "evidence_status": "PARCIALMENTE_EVIDENCIADA",
            "estimated_level": 2,
            "explanation": "[Nova competência sugerida] Identificada a partir de relatos espontâneos na entrevista: 'O candidato menciona 'Segurança da Informação & DevSecOps', mas o relato é introdutório ou sem detalhamento de impacto.'",
            "requires_review": false,
            "is_suggested": true,
            "created_at": "2026-10-17 23:57:38.409620",
            "evidences": [
              {
                "id": "15959d85-546d-456d-9ff5-976656ea7d99",
                "assessment_id": "6037c2fb-49dd-407d-8e5c-803cc946e803",
                "answer_id": "4b2baa74-5dc1-44cd-a47b-c1613aa3d3cd",
                "exact_quote": "Construí uma aplicação web utilizando React no frontend com gerenciamento via Context API e backend em Python com FastAPI para autenticação de clientes",
                "explanation": "O candidato cita explicitamente 'Autenticação' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:38.410258"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "69d3ba53-4719-4e92-b588-aa255e841610",
            "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
            "skill_id": "soft-lideranca-tecnica",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Liderança Técnica' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:38.410258",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      }
    ],
    "active_version": {
      "id": "224287df-81e1-49f4-9840-9c83dbd86534",
      "report_id": "32ee09d2-fa72-4015-b13d-f5b91cf5059e",
      "version_number": 1,
      "status": "ATIVO",
      "summary": "Perfil processado com 5 competências analisadas.",
      "created_at": "2026-10-17 23:57:38.408335",
      "assessments": [
        {
          "id": "fb24f361-3fc2-4c1e-bb98-f0e1015cde88",
          "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
          "skill_id": "hard-python",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "DIVERGENCIA_IDENTIFICADA",
          "estimated_level": 2,
          "explanation": "Autodeclaração avançada (nível 4), porém os relatos apresentaram evidências básicas (nível 2).",
          "requires_review": true,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:38.408978",
          "evidences": [
            {
              "id": "41bc83b1-192c-4897-aebe-62fda0abf613",
              "assessment_id": "fb24f361-3fc2-4c1e-bb98-f0e1015cde88",
              "answer_id": "4b2baa74-5dc1-44cd-a47b-c1613aa3d3cd",
              "exact_quote": "Construí uma aplicação web utilizando React no frontend com gerenciamento via Context API e backend em Python com FastAPI para autenticação de clientes",
              "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:38.408978"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "a0eb7c60-b4eb-423b-8fa6-766a5f6ece4a",
          "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
          "skill_id": "hard-sql",
          "declared": true,
          "declared_level": 3,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'SQL & Bancos Relacionais' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:38.408978",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "44d7b094-f248-425b-861a-8a35961aff50",
          "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
          "skill_id": "hard-react",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "DIVERGENCIA_IDENTIFICADA",
          "estimated_level": 2,
          "explanation": "Autodeclaração avançada (nível 4), porém os relatos apresentaram evidências básicas (nível 2).",
          "requires_review": true,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:38.409620",
          "evidences": [
            {
              "id": "c2004163-98c4-4aa1-903c-91d7927e01ec",
              "assessment_id": "44d7b094-f248-425b-861a-8a35961aff50",
              "answer_id": "4b2baa74-5dc1-44cd-a47b-c1613aa3d3cd",
              "exact_quote": "Construí uma aplicação web utilizando React no frontend com gerenciamento via Context API e backend em Python com FastAPI para autenticação de clientes",
              "explanation": "O candidato cita explicitamente 'React' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:38.409620"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "6037c2fb-49dd-407d-8e5c-803cc946e803",
          "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
          "skill_id": "hard-security",
          "declared": false,
          "declared_level": null,
          "evidence_status": "PARCIALMENTE_EVIDENCIADA",
          "estimated_level": 2,
          "explanation": "[Nova competência sugerida] Identificada a partir de relatos espontâneos na entrevista: 'O candidato menciona 'Segurança da Informação & DevSecOps', mas o relato é introdutório ou sem detalhamento de impacto.'",
          "requires_review": false,
          "is_suggested": true,
          "created_at": "2026-10-17 23:57:38.409620",
          "evidences": [
            {
              "id": "15959d85-546d-456d-9ff5-976656ea7d99",
              "assessment_id": "6037c2fb-49dd-407d-8e5c-803cc946e803",
              "answer_id": "4b2baa74-5dc1-44cd-a47b-c1613aa3d3cd",
              "exact_quote": "Construí uma aplicação web utilizando React no frontend com gerenciamento via Context API e backend em Python com FastAPI para autenticação de clientes",
              "explanation": "O candidato cita explicitamente 'Autenticação' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:38.410258"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "69d3ba53-4719-4e92-b588-aa255e841610",
          "version_id": "224287df-81e1-49f4-9840-9c83dbd86534",
          "skill_id": "soft-lideranca-tecnica",
          "declared": true,
          "declared_level": 5,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Liderança Técnica' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:38.410258",
          "evidences": [],
          "skill_category": "SOFT"
        }
      ],
      "reviews": []
    }
  },
  {
    "id": "e6bfb43c-4f29-447f-9671-7745f4e17da7",
    "candidate_id": "b41044b8-e3e9-45b1-9e86-5ffb8553290a",
    "interview_id": "4ae5c922-adc8-4641-a45b-e8e62ca5ec45",
    "status": "EM_REVISAO",
    "active_version_number": 2,
    "model_metadata": {
      "whisper_model": "small",
      "llm_model": "qwen3:4b",
      "embedding_model": "intfloat/multilingual-e5-small",
      "created_at": "2026-10-17T23:57:40.940763"
    },
    "created_at": "2026-10-17 23:57:40.940763",
    "updated_at": "2026-10-17 23:57:40.966276",
    "candidate_name": "Carlos Eduardo Mendes",
    "versions": [
      {
        "id": "3d6e6b8d-0696-4b8d-99d1-052e9a9a81a3",
        "report_id": "e6bfb43c-4f29-447f-9671-7745f4e17da7",
        "version_number": 1,
        "status": "ARQUIVADO",
        "summary": "Perfil processado com 5 competências analisadas.",
        "created_at": "2026-10-17 23:57:40.943154",
        "assessments": [
          {
            "id": "da66390c-fb70-4e8c-8769-3259f9d8ea67",
            "version_id": "3d6e6b8d-0696-4b8d-99d1-052e9a9a81a3",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Python'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.943154",
            "evidences": [
              {
                "id": "8471635e-804e-4efc-a6a5-6ffa9f49243b",
                "assessment_id": "da66390c-fb70-4e8c-8769-3259f9d8ea67",
                "answer_id": "83d9b9db-040a-4afe-aa5d-a23fcc374b0d",
                "exact_quote": "Liderei a modernização de um data lake corporativo, arquitetando pipelines com Python e Apache Airflow integrados a bancos PostgreSQL e S3",
                "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:40.943826"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "670bd132-3936-42c0-ad00-6fbc169f93d4",
            "version_id": "3d6e6b8d-0696-4b8d-99d1-052e9a9a81a3",
            "skill_id": "hard-sql",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'SQL & Bancos Relacionais'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.943826",
            "evidences": [
              {
                "id": "0e68d0a0-cd9b-4fd2-921d-2e435278a29d",
                "assessment_id": "670bd132-3936-42c0-ad00-6fbc169f93d4",
                "answer_id": "83d9b9db-040a-4afe-aa5d-a23fcc374b0d",
                "exact_quote": "Liderei a modernização de um data lake corporativo, arquitetando pipelines com Python e Apache Airflow integrados a bancos PostgreSQL e S3",
                "explanation": "O candidato cita explicitamente 'PostgreSQL' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:40.944465"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "ffc51356-9243-4b31-a28c-b7fd607ff6f2",
            "version_id": "3d6e6b8d-0696-4b8d-99d1-052e9a9a81a3",
            "skill_id": "hard-etl",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.944465",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "0e8a06a6-aa90-4412-be3f-e88054bbc6e8",
            "version_id": "3d6e6b8d-0696-4b8d-99d1-052e9a9a81a3",
            "skill_id": "hard-aws",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'AWS Cloud' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.944465",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "e8a096bc-e328-4b4b-a456-a9bd065db846",
            "version_id": "3d6e6b8d-0696-4b8d-99d1-052e9a9a81a3",
            "skill_id": "soft-resolucao-problemas",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Resolução de Problemas Complexos' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.945101",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      },
      {
        "id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
        "report_id": "e6bfb43c-4f29-447f-9671-7745f4e17da7",
        "version_number": 2,
        "status": "ATIVO",
        "summary": "Versão 2 gerada após réplica do candidato a respeito de: hard-aws.",
        "created_at": "2026-10-17 23:57:40.960733",
        "assessments": [
          {
            "id": "e37d22d2-9819-4288-bf3e-bf4679b5dec7",
            "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Python'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.962362",
            "evidences": [
              {
                "id": "c99bb58c-f642-4ee0-bc2c-5a4f537e21f1",
                "assessment_id": "e37d22d2-9819-4288-bf3e-bf4679b5dec7",
                "answer_id": "83d9b9db-040a-4afe-aa5d-a23fcc374b0d",
                "exact_quote": "Liderei a modernização de um data lake corporativo, arquitetando pipelines com Python e Apache Airflow integrados a bancos PostgreSQL e S3",
                "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:40.964046"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "1f4e267e-e8fc-4249-be3e-629ed7f157f4",
            "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
            "skill_id": "hard-sql",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'SQL & Bancos Relacionais'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.964046",
            "evidences": [
              {
                "id": "64eda0a6-3b19-4d30-8a4f-0bd5c2bdd825",
                "assessment_id": "1f4e267e-e8fc-4249-be3e-629ed7f157f4",
                "answer_id": "83d9b9db-040a-4afe-aa5d-a23fcc374b0d",
                "exact_quote": "Liderei a modernização de um data lake corporativo, arquitetando pipelines com Python e Apache Airflow integrados a bancos PostgreSQL e S3",
                "explanation": "O candidato cita explicitamente 'PostgreSQL' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:40.965164"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "636035a7-5952-4a82-af50-e051b2ce8b63",
            "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
            "skill_id": "hard-etl",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.964624",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "32ddfe5a-355c-461a-a374-bc22178be76f",
            "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
            "skill_id": "hard-aws",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "DIVERGENCIA_IDENTIFICADA",
            "estimated_level": null,
            "explanation": "A competência 'AWS Cloud' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista. [Contestação registrada pelo candidato: 'Gostaria de solicitar revisão na avaliação da competência AWS Cloud. Embora na resposta curta eu ten...']",
            "requires_review": true,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.965740",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "07654e93-a084-40ce-9920-ac5689511492",
            "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
            "skill_id": "soft-resolucao-problemas",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Resolução de Problemas Complexos' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:40.965740",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      }
    ],
    "active_version": {
      "id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
      "report_id": "e6bfb43c-4f29-447f-9671-7745f4e17da7",
      "version_number": 2,
      "status": "ATIVO",
      "summary": "Versão 2 gerada após réplica do candidato a respeito de: hard-aws.",
      "created_at": "2026-10-17 23:57:40.960733",
      "assessments": [
        {
          "id": "e37d22d2-9819-4288-bf3e-bf4679b5dec7",
          "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
          "skill_id": "hard-python",
          "declared": true,
          "declared_level": 5,
          "evidence_status": "EVIDENCIADA",
          "estimated_level": 4,
          "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Python'.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:40.962362",
          "evidences": [
            {
              "id": "c99bb58c-f642-4ee0-bc2c-5a4f537e21f1",
              "assessment_id": "e37d22d2-9819-4288-bf3e-bf4679b5dec7",
              "answer_id": "83d9b9db-040a-4afe-aa5d-a23fcc374b0d",
              "exact_quote": "Liderei a modernização de um data lake corporativo, arquitetando pipelines com Python e Apache Airflow integrados a bancos PostgreSQL e S3",
              "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:40.964046"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "1f4e267e-e8fc-4249-be3e-629ed7f157f4",
          "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
          "skill_id": "hard-sql",
          "declared": true,
          "declared_level": 5,
          "evidence_status": "EVIDENCIADA",
          "estimated_level": 4,
          "explanation": "O relato apresenta ações concretas e implementação prática da competência 'SQL & Bancos Relacionais'.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:40.964046",
          "evidences": [
            {
              "id": "64eda0a6-3b19-4d30-8a4f-0bd5c2bdd825",
              "assessment_id": "1f4e267e-e8fc-4249-be3e-629ed7f157f4",
              "answer_id": "83d9b9db-040a-4afe-aa5d-a23fcc374b0d",
              "exact_quote": "Liderei a modernização de um data lake corporativo, arquitetando pipelines com Python e Apache Airflow integrados a bancos PostgreSQL e S3",
              "explanation": "O candidato cita explicitamente 'PostgreSQL' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:40.965164"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "636035a7-5952-4a82-af50-e051b2ce8b63",
          "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
          "skill_id": "hard-etl",
          "declared": true,
          "declared_level": 5,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:40.964624",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "32ddfe5a-355c-461a-a374-bc22178be76f",
          "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
          "skill_id": "hard-aws",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "DIVERGENCIA_IDENTIFICADA",
          "estimated_level": null,
          "explanation": "A competência 'AWS Cloud' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista. [Contestação registrada pelo candidato: 'Gostaria de solicitar revisão na avaliação da competência AWS Cloud. Embora na resposta curta eu ten...']",
          "requires_review": true,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:40.965740",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "07654e93-a084-40ce-9920-ac5689511492",
          "version_id": "7c325d22-9ba7-4294-8024-313e1c13cc62",
          "skill_id": "soft-resolucao-problemas",
          "declared": true,
          "declared_level": 5,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Resolução de Problemas Complexos' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:40.965740",
          "evidences": [],
          "skill_category": "SOFT"
        }
      ],
      "reviews": []
    }
  },
  {
    "id": "5407d9aa-7f6c-4f47-980c-b36bb04826d6",
    "candidate_id": "87230444-ba95-49c9-b114-983f2c8068da",
    "interview_id": "123a576a-e882-4df2-9d33-f67ba068ff58",
    "status": "PRELIMINAR",
    "active_version_number": 1,
    "model_metadata": {
      "whisper_model": "small",
      "llm_model": "qwen3:4b",
      "embedding_model": "intfloat/multilingual-e5-small",
      "created_at": "2026-10-17T23:57:43.512209"
    },
    "created_at": "2026-10-17 23:57:43.512822",
    "updated_at": "2026-10-17 23:57:43.512822",
    "candidate_name": "Mariana Albuquerque",
    "versions": [
      {
        "id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
        "report_id": "5407d9aa-7f6c-4f47-980c-b36bb04826d6",
        "version_number": 1,
        "status": "ATIVO",
        "summary": "Perfil processado com 6 competências analisadas.",
        "created_at": "2026-10-17 23:57:43.516523",
        "assessments": [
          {
            "id": "432ca720-fe91-4366-9b92-d113e8ad0b7a",
            "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
            "skill_id": "hard-docker",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Docker & Contêineres'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:43.517202",
            "evidences": [
              {
                "id": "0b0605c9-1e65-4b20-ab2b-ce682d6e65ad",
                "assessment_id": "432ca720-fe91-4366-9b92-d113e8ad0b7a",
                "answer_id": "feda0b3b-43de-4040-890b-06c5df52921f",
                "exact_quote": "Arquitetei esteiras de CI/CD completas com GitHub Actions que constroem imagens Docker seguras sem root e realizam deploy contínuo em clusters Kubernetes gerenciados, com testes de carga e monitoramento em tempo real",
                "explanation": "O candidato cita explicitamente 'Docker' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:43.517873"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "5b72ed8c-b583-428f-8ec3-ed7ab2c03be7",
            "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
            "skill_id": "hard-git",
            "declared": false,
            "declared_level": null,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 3,
            "explanation": "[Nova competência sugerida] Identificada a partir de relatos espontâneos na entrevista: 'O relato apresenta ações concretas e implementação prática da competência 'Git & Controle de Versão'.'",
            "requires_review": false,
            "is_suggested": true,
            "created_at": "2026-10-17 23:57:43.517873",
            "evidences": [
              {
                "id": "fe1ddc3f-633f-44c0-845a-8c85f38eb876",
                "assessment_id": "5b72ed8c-b583-428f-8ec3-ed7ab2c03be7",
                "answer_id": "feda0b3b-43de-4040-890b-06c5df52921f",
                "exact_quote": "Arquitetei esteiras de CI/CD completas com GitHub Actions que constroem imagens Docker seguras sem root e realizam deploy contínuo em clusters Kubernetes gerenciados, com testes de carga e monitoramento em tempo real",
                "explanation": "O candidato cita explicitamente 'GitHub' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:43.518537"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "2a7e860e-fea7-40f9-a759-b24bf48dc5d0",
            "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
            "skill_id": "hard-linux",
            "declared": true,
            "declared_level": 5,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Linux & Shell Scripting' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:43.517873",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "eb8edd99-5bbc-4ff5-a027-95d013940361",
            "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
            "skill_id": "hard-kubernetes",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Kubernetes'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:43.518537",
            "evidences": [
              {
                "id": "663b55c7-b555-4722-85a4-c1ca92f9c33d",
                "assessment_id": "eb8edd99-5bbc-4ff5-a027-95d013940361",
                "answer_id": "feda0b3b-43de-4040-890b-06c5df52921f",
                "exact_quote": "Arquitetei esteiras de CI/CD completas com GitHub Actions que constroem imagens Docker seguras sem root e realizam deploy contínuo em clusters Kubernetes gerenciados, com testes de carga e monitoramento em tempo real",
                "explanation": "O candidato cita explicitamente 'Kubernetes' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:43.519099"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "7004e35e-cea6-401c-9b17-8071fbe74b91",
            "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
            "skill_id": "hard-cicd",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "EVIDENCIADA",
            "estimated_level": 4,
            "explanation": "O relato apresenta ações concretas e implementação prática da competência 'CI/CD & Automação de Deploy'.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:43.519099",
            "evidences": [
              {
                "id": "3411756f-9f4a-47cd-a98b-bcfef064171a",
                "assessment_id": "7004e35e-cea6-401c-9b17-8071fbe74b91",
                "answer_id": "feda0b3b-43de-4040-890b-06c5df52921f",
                "exact_quote": "Arquitetei esteiras de CI/CD completas com GitHub Actions que constroem imagens Docker seguras sem root e realizam deploy contínuo em clusters Kubernetes gerenciados, com testes de carga e monitoramento em tempo real",
                "explanation": "O candidato cita explicitamente 'GitHub Actions' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:43.519695"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "f60a44d2-6352-4988-9755-5ce02f5324b2",
            "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
            "skill_id": "soft-lideranca-tecnica",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Liderança Técnica' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:43.519695",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      }
    ],
    "active_version": {
      "id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
      "report_id": "5407d9aa-7f6c-4f47-980c-b36bb04826d6",
      "version_number": 1,
      "status": "ATIVO",
      "summary": "Perfil processado com 6 competências analisadas.",
      "created_at": "2026-10-17 23:57:43.516523",
      "assessments": [
        {
          "id": "432ca720-fe91-4366-9b92-d113e8ad0b7a",
          "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
          "skill_id": "hard-docker",
          "declared": true,
          "declared_level": 5,
          "evidence_status": "EVIDENCIADA",
          "estimated_level": 4,
          "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Docker & Contêineres'.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:43.517202",
          "evidences": [
            {
              "id": "0b0605c9-1e65-4b20-ab2b-ce682d6e65ad",
              "assessment_id": "432ca720-fe91-4366-9b92-d113e8ad0b7a",
              "answer_id": "feda0b3b-43de-4040-890b-06c5df52921f",
              "exact_quote": "Arquitetei esteiras de CI/CD completas com GitHub Actions que constroem imagens Docker seguras sem root e realizam deploy contínuo em clusters Kubernetes gerenciados, com testes de carga e monitoramento em tempo real",
              "explanation": "O candidato cita explicitamente 'Docker' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:43.517873"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "5b72ed8c-b583-428f-8ec3-ed7ab2c03be7",
          "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
          "skill_id": "hard-git",
          "declared": false,
          "declared_level": null,
          "evidence_status": "EVIDENCIADA",
          "estimated_level": 3,
          "explanation": "[Nova competência sugerida] Identificada a partir de relatos espontâneos na entrevista: 'O relato apresenta ações concretas e implementação prática da competência 'Git & Controle de Versão'.'",
          "requires_review": false,
          "is_suggested": true,
          "created_at": "2026-10-17 23:57:43.517873",
          "evidences": [
            {
              "id": "fe1ddc3f-633f-44c0-845a-8c85f38eb876",
              "assessment_id": "5b72ed8c-b583-428f-8ec3-ed7ab2c03be7",
              "answer_id": "feda0b3b-43de-4040-890b-06c5df52921f",
              "exact_quote": "Arquitetei esteiras de CI/CD completas com GitHub Actions que constroem imagens Docker seguras sem root e realizam deploy contínuo em clusters Kubernetes gerenciados, com testes de carga e monitoramento em tempo real",
              "explanation": "O candidato cita explicitamente 'GitHub' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:43.518537"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "2a7e860e-fea7-40f9-a759-b24bf48dc5d0",
          "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
          "skill_id": "hard-linux",
          "declared": true,
          "declared_level": 5,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Linux & Shell Scripting' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:43.517873",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "eb8edd99-5bbc-4ff5-a027-95d013940361",
          "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
          "skill_id": "hard-kubernetes",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "EVIDENCIADA",
          "estimated_level": 4,
          "explanation": "O relato apresenta ações concretas e implementação prática da competência 'Kubernetes'.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:43.518537",
          "evidences": [
            {
              "id": "663b55c7-b555-4722-85a4-c1ca92f9c33d",
              "assessment_id": "eb8edd99-5bbc-4ff5-a027-95d013940361",
              "answer_id": "feda0b3b-43de-4040-890b-06c5df52921f",
              "exact_quote": "Arquitetei esteiras de CI/CD completas com GitHub Actions que constroem imagens Docker seguras sem root e realizam deploy contínuo em clusters Kubernetes gerenciados, com testes de carga e monitoramento em tempo real",
              "explanation": "O candidato cita explicitamente 'Kubernetes' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:43.519099"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "7004e35e-cea6-401c-9b17-8071fbe74b91",
          "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
          "skill_id": "hard-cicd",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "EVIDENCIADA",
          "estimated_level": 4,
          "explanation": "O relato apresenta ações concretas e implementação prática da competência 'CI/CD & Automação de Deploy'.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:43.519099",
          "evidences": [
            {
              "id": "3411756f-9f4a-47cd-a98b-bcfef064171a",
              "assessment_id": "7004e35e-cea6-401c-9b17-8071fbe74b91",
              "answer_id": "feda0b3b-43de-4040-890b-06c5df52921f",
              "exact_quote": "Arquitetei esteiras de CI/CD completas com GitHub Actions que constroem imagens Docker seguras sem root e realizam deploy contínuo em clusters Kubernetes gerenciados, com testes de carga e monitoramento em tempo real",
              "explanation": "O candidato cita explicitamente 'GitHub Actions' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:43.519695"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "f60a44d2-6352-4988-9755-5ce02f5324b2",
          "version_id": "1865a866-78c1-42fd-be85-4657c2b41cb3",
          "skill_id": "soft-lideranca-tecnica",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Liderança Técnica' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:43.519695",
          "evidences": [],
          "skill_category": "SOFT"
        }
      ],
      "reviews": []
    }
  },
  {
    "id": "a18889cb-9d48-4505-8327-a993a66ca8ab",
    "candidate_id": "1b5e7a01-ceea-4b6f-b62b-584f3a07eab2",
    "interview_id": "201b5e73-a41f-46aa-b0bf-9e1d7cd1d1a3",
    "status": "PRELIMINAR",
    "active_version_number": 1,
    "model_metadata": {
      "whisper_model": "small",
      "llm_model": "qwen3:4b",
      "embedding_model": "intfloat/multilingual-e5-small",
      "created_at": "2026-10-17T23:57:46.053400"
    },
    "created_at": "2026-10-17 23:57:46.054043",
    "updated_at": "2026-10-17 23:57:46.054043",
    "candidate_name": "Rafael Costa",
    "versions": [
      {
        "id": "1ac04bb0-a70e-40ff-9f5f-d0b971784619",
        "report_id": "a18889cb-9d48-4505-8327-a993a66ca8ab",
        "version_number": 1,
        "status": "ATIVO",
        "summary": "Perfil processado com 1 competências analisadas.",
        "created_at": "2026-10-17 23:57:46.057462",
        "assessments": [
          {
            "id": "973bf805-e3f5-4a24-9f9a-fc34ce29768f",
            "version_id": "1ac04bb0-a70e-40ff-9f5f-d0b971784619",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 2,
            "evidence_status": "PARCIALMENTE_EVIDENCIADA",
            "estimated_level": 2,
            "explanation": "O candidato menciona 'Python', mas o relato é introdutório ou sem detalhamento de impacto.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-17 23:57:46.058124",
            "evidences": [
              {
                "id": "97d10db6-05b0-47cc-ba64-64bc6d6dfccd",
                "assessment_id": "973bf805-e3f5-4a24-9f9a-fc34ce29768f",
                "answer_id": "f71affda-07b3-4d0a-b77a-add9f58af6d5",
                "exact_quote": "Em meu projeto acadêmico escrevi alguns scripts básicos em Python para processar planilhas",
                "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-17 23:57:46.058124"
              }
            ],
            "skill_category": "HARD"
          }
        ],
        "reviews": []
      }
    ],
    "active_version": {
      "id": "1ac04bb0-a70e-40ff-9f5f-d0b971784619",
      "report_id": "a18889cb-9d48-4505-8327-a993a66ca8ab",
      "version_number": 1,
      "status": "ATIVO",
      "summary": "Perfil processado com 1 competências analisadas.",
      "created_at": "2026-10-17 23:57:46.057462",
      "assessments": [
        {
          "id": "973bf805-e3f5-4a24-9f9a-fc34ce29768f",
          "version_id": "1ac04bb0-a70e-40ff-9f5f-d0b971784619",
          "skill_id": "hard-python",
          "declared": true,
          "declared_level": 2,
          "evidence_status": "PARCIALMENTE_EVIDENCIADA",
          "estimated_level": 2,
          "explanation": "O candidato menciona 'Python', mas o relato é introdutório ou sem detalhamento de impacto.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-17 23:57:46.058124",
          "evidences": [
            {
              "id": "97d10db6-05b0-47cc-ba64-64bc6d6dfccd",
              "assessment_id": "973bf805-e3f5-4a24-9f9a-fc34ce29768f",
              "answer_id": "f71affda-07b3-4d0a-b77a-add9f58af6d5",
              "exact_quote": "Em meu projeto acadêmico escrevi alguns scripts básicos em Python para processar planilhas",
              "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-17 23:57:46.058124"
            }
          ],
          "skill_category": "HARD"
        }
      ],
      "reviews": []
    }
  },
  {
    "id": "6da1a072-f4f4-45a8-b2ee-8968508c7d25",
    "candidate_id": "b395007c-8a03-4dde-8507-d8a51607caea",
    "interview_id": "04bb2cff-b256-41ca-806a-bda1d09373f6",
    "status": "EM_REVISAO",
    "active_version_number": 3,
    "model_metadata": {
      "whisper_model": "small",
      "llm_model": "qwen3:4b",
      "embedding_model": "intfloat/multilingual-e5-small",
      "created_at": "2026-10-19T21:53:03.204216"
    },
    "created_at": "2026-10-19 21:53:03.220053",
    "updated_at": "2026-11-09 13:55:46.487534",
    "candidate_name": "Lucas Silva",
    "versions": [
      {
        "id": "b6a4dc38-aac7-4ff9-8625-054ab10219ca",
        "report_id": "6da1a072-f4f4-45a8-b2ee-8968508c7d25",
        "version_number": 1,
        "status": "ARQUIVADO",
        "summary": "Perfil processado com 5 competências analisadas.",
        "created_at": "2026-10-19 21:53:03.235865",
        "assessments": [
          {
            "id": "5ec71b0f-2e55-42d8-b396-5f1d3e412260",
            "version_id": "b6a4dc38-aac7-4ff9-8625-054ab10219ca",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Python' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:53:03.235865",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "8619a15b-7587-438c-9ef8-0b40d59d3afb",
            "version_id": "b6a4dc38-aac7-4ff9-8625-054ab10219ca",
            "skill_id": "hard-sql",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'SQL & Bancos Relacionais' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:53:03.235865",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "be22addf-be40-4849-8c95-c6d6b7c1ebf7",
            "version_id": "b6a4dc38-aac7-4ff9-8625-054ab10219ca",
            "skill_id": "hard-etl",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:53:03.235865",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "0f1fddbb-360b-441f-9f56-2b15bed61b97",
            "version_id": "b6a4dc38-aac7-4ff9-8625-054ab10219ca",
            "skill_id": "hard-docker",
            "declared": true,
            "declared_level": 3,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Docker & Contêineres' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:53:03.235865",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "1f1d8861-110c-45e6-8d3d-b1f74f50c6ac",
            "version_id": "b6a4dc38-aac7-4ff9-8625-054ab10219ca",
            "skill_id": "soft-comunicacao",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Comunicação Profissional' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:53:03.235865",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      },
      {
        "id": "3d03ce89-c714-40ad-ad88-8005b3fd92bd",
        "report_id": "6da1a072-f4f4-45a8-b2ee-8968508c7d25",
        "version_number": 2,
        "status": "ARQUIVADO",
        "summary": "Versão 2 gerada após réplica do candidato a respeito de: relatório geral.",
        "created_at": "2026-10-19 21:54:43.458452",
        "assessments": [
          {
            "id": "40e461fb-56e6-4ea0-b7e7-95cf194b04e0",
            "version_id": "3d03ce89-c714-40ad-ad88-8005b3fd92bd",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Python' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:54:43.458452",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "59c05add-8d6d-49d6-82a7-7b049c7c53f0",
            "version_id": "3d03ce89-c714-40ad-ad88-8005b3fd92bd",
            "skill_id": "hard-sql",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'SQL & Bancos Relacionais' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:54:43.458452",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "c2dcd85e-b4f5-4b52-92d8-85278b385a5f",
            "version_id": "3d03ce89-c714-40ad-ad88-8005b3fd92bd",
            "skill_id": "hard-etl",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:54:43.466374",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "ba889127-f254-44c8-b778-dd4194149464",
            "version_id": "3d03ce89-c714-40ad-ad88-8005b3fd92bd",
            "skill_id": "hard-docker",
            "declared": true,
            "declared_level": 3,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Docker & Contêineres' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:54:43.468391",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "72c675b2-59f8-4005-98ba-2b3e716d7217",
            "version_id": "3d03ce89-c714-40ad-ad88-8005b3fd92bd",
            "skill_id": "soft-comunicacao",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Comunicação Profissional' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:54:43.470532",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      },
      {
        "id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
        "report_id": "6da1a072-f4f4-45a8-b2ee-8968508c7d25",
        "version_number": 3,
        "status": "ATIVO",
        "summary": "Versão 3 gerada após réplica do candidato a respeito de: hard-python.",
        "created_at": "2026-11-09 13:55:46.449513",
        "assessments": [
          {
            "id": "70c5860c-e5f0-4c26-b946-b90c14bf7aaa",
            "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "DIVERGENCIA_IDENTIFICADA",
            "estimated_level": null,
            "explanation": "A competência 'Python' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista. [Contestação registrada pelo candidato: 'testeando, porque eu sou experiente em python. Realizei levantamento de kpis que consolidaram e melh...']",
            "requires_review": true,
            "is_suggested": false,
            "created_at": "2026-11-09 13:55:46.457987",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "302eed34-9167-4fcd-be20-ff7fcfe1a1eb",
            "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
            "skill_id": "hard-sql",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'SQL & Bancos Relacionais' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-11-09 13:55:46.457987",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "c82ba583-a588-43ad-bd9e-232a521b1d3e",
            "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
            "skill_id": "hard-etl",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-11-09 13:55:46.457987",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "61a00316-b281-4aa5-82d6-7b3fa637118f",
            "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
            "skill_id": "hard-docker",
            "declared": true,
            "declared_level": 3,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Docker & Contêineres' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-11-09 13:55:46.457987",
            "evidences": [],
            "skill_category": "HARD"
          },
          {
            "id": "fa135491-7388-49ff-9e23-159caf47478e",
            "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
            "skill_id": "soft-comunicacao",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Comunicação Profissional' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-11-09 13:55:46.469581",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      }
    ],
    "active_version": {
      "id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
      "report_id": "6da1a072-f4f4-45a8-b2ee-8968508c7d25",
      "version_number": 3,
      "status": "ATIVO",
      "summary": "Versão 3 gerada após réplica do candidato a respeito de: hard-python.",
      "created_at": "2026-11-09 13:55:46.449513",
      "assessments": [
        {
          "id": "70c5860c-e5f0-4c26-b946-b90c14bf7aaa",
          "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
          "skill_id": "hard-python",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "DIVERGENCIA_IDENTIFICADA",
          "estimated_level": null,
          "explanation": "A competência 'Python' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista. [Contestação registrada pelo candidato: 'testeando, porque eu sou experiente em python. Realizei levantamento de kpis que consolidaram e melh...']",
          "requires_review": true,
          "is_suggested": false,
          "created_at": "2026-11-09 13:55:46.457987",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "302eed34-9167-4fcd-be20-ff7fcfe1a1eb",
          "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
          "skill_id": "hard-sql",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'SQL & Bancos Relacionais' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-11-09 13:55:46.457987",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "c82ba583-a588-43ad-bd9e-232a521b1d3e",
          "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
          "skill_id": "hard-etl",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Pipelines de Dados & ETL/ELT' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-11-09 13:55:46.457987",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "61a00316-b281-4aa5-82d6-7b3fa637118f",
          "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
          "skill_id": "hard-docker",
          "declared": true,
          "declared_level": 3,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Docker & Contêineres' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-11-09 13:55:46.457987",
          "evidences": [],
          "skill_category": "HARD"
        },
        {
          "id": "fa135491-7388-49ff-9e23-159caf47478e",
          "version_id": "402aba87-5d2e-4ae9-8378-c5d79a149cbc",
          "skill_id": "soft-comunicacao",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Comunicação Profissional' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-11-09 13:55:46.469581",
          "evidences": [],
          "skill_category": "SOFT"
        }
      ],
      "reviews": []
    }
  },
  {
    "id": "2ed6a3e5-bb99-4eb7-85bf-a7478351749e",
    "candidate_id": "83a89a70-38e4-4aac-9e36-68cf94255ce3",
    "interview_id": "6324d01c-5e8e-40b8-920b-b2f6d8a58869",
    "status": "CONSOLIDADO",
    "active_version_number": 1,
    "model_metadata": {
      "whisper_model": "small",
      "llm_model": "qwen3:4b",
      "embedding_model": "intfloat/multilingual-e5-small",
      "created_at": "2026-10-19T21:57:25.545974"
    },
    "created_at": "2026-10-19 21:57:25.545974",
    "updated_at": "2026-10-19 22:02:10.826199",
    "candidate_name": "Flavio José dos Santos",
    "versions": [
      {
        "id": "592ee24e-7175-4677-9dce-975b869f1f6e",
        "report_id": "2ed6a3e5-bb99-4eb7-85bf-a7478351749e",
        "version_number": 1,
        "status": "ATIVO",
        "summary": "Perfil processado com 4 competências analisadas.",
        "created_at": "2026-10-19 21:57:25.550525",
        "assessments": [
          {
            "id": "e43da613-7e32-4e27-85fd-afa1a511b62b",
            "version_id": "592ee24e-7175-4677-9dce-975b869f1f6e",
            "skill_id": "hard-python",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "DIVERGENCIA_IDENTIFICADA",
            "estimated_level": 2,
            "explanation": "Autodeclaração avançada (nível 4), porém os relatos apresentaram evidências básicas (nível 2).",
            "requires_review": true,
            "is_suggested": false,
            "created_at": "2026-10-19 21:57:25.550525",
            "evidences": [
              {
                "id": "298b2f65-ccf1-4aeb-9e14-97e06d7321d0",
                "assessment_id": "e43da613-7e32-4e27-85fd-afa1a511b62b",
                "answer_id": "27adbd12-a45f-4b9b-9b4c-fbd52b4017cb",
                "exact_quote": "tenho amplo conhecimento em python realizando diversos projetos com pandas, streamlit e engenharia de dados",
                "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-19 21:57:25.550525"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "17e493a6-8a8d-4351-986b-fdadef20d050",
            "version_id": "592ee24e-7175-4677-9dce-975b869f1f6e",
            "skill_id": "hard-sql",
            "declared": true,
            "declared_level": 3,
            "evidence_status": "PARCIALMENTE_EVIDENCIADA",
            "estimated_level": 2,
            "explanation": "O candidato menciona 'SQL & Bancos Relacionais', mas o relato é introdutório ou sem detalhamento de impacto.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:57:25.550525",
            "evidences": [
              {
                "id": "21416a75-9e27-41d3-ba91-02182604004c",
                "assessment_id": "17e493a6-8a8d-4351-986b-fdadef20d050",
                "answer_id": "27adbd12-a45f-4b9b-9b4c-fbd52b4017cb",
                "exact_quote": "Alem disso domino muito bem sql, criando e realizando manutenção de DBs\"",
                "explanation": "O candidato cita explicitamente 'SQL' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-19 21:57:25.550525"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "cd5dbe80-f9dd-4299-85d9-d8e05853f6f0",
            "version_id": "592ee24e-7175-4677-9dce-975b869f1f6e",
            "skill_id": "hard-etl",
            "declared": false,
            "declared_level": null,
            "evidence_status": "PARCIALMENTE_EVIDENCIADA",
            "estimated_level": 2,
            "explanation": "[Nova competência sugerida] Identificada a partir de relatos espontâneos na entrevista: 'O candidato menciona 'Pipelines de Dados & ETL/ELT', mas o relato é introdutório ou sem detalhamento de impacto.'",
            "requires_review": false,
            "is_suggested": true,
            "created_at": "2026-10-19 21:57:25.550525",
            "evidences": [
              {
                "id": "54d8b8d1-d0e8-4994-9f63-59cd831d1efb",
                "assessment_id": "cd5dbe80-f9dd-4299-85d9-d8e05853f6f0",
                "answer_id": "27adbd12-a45f-4b9b-9b4c-fbd52b4017cb",
                "exact_quote": "tenho amplo conhecimento em python realizando diversos projetos com pandas, streamlit e engenharia de dados",
                "explanation": "O candidato cita explicitamente 'Engenharia de Dados' e contextualiza sua aplicação.",
                "paraphrase": null,
                "created_at": "2026-10-19 21:57:25.550525"
              }
            ],
            "skill_category": "HARD"
          },
          {
            "id": "68af3e01-9e68-457b-ae48-4dbc14cb35da",
            "version_id": "592ee24e-7175-4677-9dce-975b869f1f6e",
            "skill_id": "soft-comunicacao",
            "declared": true,
            "declared_level": 4,
            "evidence_status": "NAO_AVALIADA",
            "estimated_level": null,
            "explanation": "A competência 'Comunicação Profissional' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
            "requires_review": false,
            "is_suggested": false,
            "created_at": "2026-10-19 21:57:25.550525",
            "evidences": [],
            "skill_category": "SOFT"
          }
        ],
        "reviews": []
      }
    ],
    "active_version": {
      "id": "592ee24e-7175-4677-9dce-975b869f1f6e",
      "report_id": "2ed6a3e5-bb99-4eb7-85bf-a7478351749e",
      "version_number": 1,
      "status": "ATIVO",
      "summary": "Perfil processado com 4 competências analisadas.",
      "created_at": "2026-10-19 21:57:25.550525",
      "assessments": [
        {
          "id": "e43da613-7e32-4e27-85fd-afa1a511b62b",
          "version_id": "592ee24e-7175-4677-9dce-975b869f1f6e",
          "skill_id": "hard-python",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "DIVERGENCIA_IDENTIFICADA",
          "estimated_level": 2,
          "explanation": "Autodeclaração avançada (nível 4), porém os relatos apresentaram evidências básicas (nível 2).",
          "requires_review": true,
          "is_suggested": false,
          "created_at": "2026-10-19 21:57:25.550525",
          "evidences": [
            {
              "id": "298b2f65-ccf1-4aeb-9e14-97e06d7321d0",
              "assessment_id": "e43da613-7e32-4e27-85fd-afa1a511b62b",
              "answer_id": "27adbd12-a45f-4b9b-9b4c-fbd52b4017cb",
              "exact_quote": "tenho amplo conhecimento em python realizando diversos projetos com pandas, streamlit e engenharia de dados",
              "explanation": "O candidato cita explicitamente 'Python' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-19 21:57:25.550525"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "17e493a6-8a8d-4351-986b-fdadef20d050",
          "version_id": "592ee24e-7175-4677-9dce-975b869f1f6e",
          "skill_id": "hard-sql",
          "declared": true,
          "declared_level": 3,
          "evidence_status": "PARCIALMENTE_EVIDENCIADA",
          "estimated_level": 2,
          "explanation": "O candidato menciona 'SQL & Bancos Relacionais', mas o relato é introdutório ou sem detalhamento de impacto.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-19 21:57:25.550525",
          "evidences": [
            {
              "id": "21416a75-9e27-41d3-ba91-02182604004c",
              "assessment_id": "17e493a6-8a8d-4351-986b-fdadef20d050",
              "answer_id": "27adbd12-a45f-4b9b-9b4c-fbd52b4017cb",
              "exact_quote": "Alem disso domino muito bem sql, criando e realizando manutenção de DBs\"",
              "explanation": "O candidato cita explicitamente 'SQL' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-19 21:57:25.550525"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "cd5dbe80-f9dd-4299-85d9-d8e05853f6f0",
          "version_id": "592ee24e-7175-4677-9dce-975b869f1f6e",
          "skill_id": "hard-etl",
          "declared": false,
          "declared_level": null,
          "evidence_status": "PARCIALMENTE_EVIDENCIADA",
          "estimated_level": 2,
          "explanation": "[Nova competência sugerida] Identificada a partir de relatos espontâneos na entrevista: 'O candidato menciona 'Pipelines de Dados & ETL/ELT', mas o relato é introdutório ou sem detalhamento de impacto.'",
          "requires_review": false,
          "is_suggested": true,
          "created_at": "2026-10-19 21:57:25.550525",
          "evidences": [
            {
              "id": "54d8b8d1-d0e8-4994-9f63-59cd831d1efb",
              "assessment_id": "cd5dbe80-f9dd-4299-85d9-d8e05853f6f0",
              "answer_id": "27adbd12-a45f-4b9b-9b4c-fbd52b4017cb",
              "exact_quote": "tenho amplo conhecimento em python realizando diversos projetos com pandas, streamlit e engenharia de dados",
              "explanation": "O candidato cita explicitamente 'Engenharia de Dados' e contextualiza sua aplicação.",
              "paraphrase": null,
              "created_at": "2026-10-19 21:57:25.550525"
            }
          ],
          "skill_category": "HARD"
        },
        {
          "id": "68af3e01-9e68-457b-ae48-4dbc14cb35da",
          "version_id": "592ee24e-7175-4677-9dce-975b869f1f6e",
          "skill_id": "soft-comunicacao",
          "declared": true,
          "declared_level": 4,
          "evidence_status": "NAO_AVALIADA",
          "estimated_level": null,
          "explanation": "A competência 'Comunicação Profissional' foi autodeclarada pelo candidato, mas não foi abordada durante a entrevista.",
          "requires_review": false,
          "is_suggested": false,
          "created_at": "2026-10-19 21:57:25.550525",
          "evidences": [],
          "skill_category": "SOFT"
        }
      ],
      "reviews": []
    }
  }
];
