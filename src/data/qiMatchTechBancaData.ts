export interface C4LayerSpec {
  id: string;
  layer: string;
  title: string;
  tech: string;
  description: string;
  metrics: string[];
  codeSnippet: string;
}

export interface PipelineStageSpec {
  step: string;
  name: string;
  engine: string;
  input: string;
  output: string;
  latency: string;
  privacyRule: string;
  details: string;
}

export interface ScaleTierSpec {
  interviewsPerMonth: number;
  label: string;
  cloudFixedBrl: number;
  inferenceVariableBrl: number;
  totalMonthlyBrl: number;
  unitCostBrl: string;
  optimizations: string[];
}

export interface BancaFaqItem {
  question: string;
  category: 'IA & Ética' | 'Arquitetura & Escala' | 'Segurança & LGPD' | 'Custos & Infra';
  shortAnswer: string;
  technicalDeepDive: string;
}

export const C4_ARCHITECTURE_LAYERS: C4LayerSpec[] = [
  {
    id: 'layer-client',
    layer: 'Camada 01 · Edge & Cliente Web',
    title: 'SPA Reativa & Captura Assíncrona',
    tech: 'React 18 · TypeScript · Vite · TailwindCSS · Web Audio API',
    description:
      'Interface desacoplada para Candidatos e Empresas. Realiza gravação de áudio local em chunks comprimidos (.webm/opus) e aplica pré-validação de schema antes do envio.',
    metrics: ['Bundle < 150 KB gzip', 'TTFB < 80ms via CDN', 'Zero armazenamento de biometria no browser'],
    codeSnippet: `// Captura segura com descarte de stream pós-upload
const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
recorder.ondataavailable = (e) => chunks.push(e.data);
recorder.onstop = async () => {
  const payload = new Blob(chunks, { type: 'audio/webm' });
  await api.post('/v1/interviews/async-ingest', payload, { headers: { 'X-Consent-Token': token } });
  stream.getTracks().forEach((t) => t.stop()); // Libera hardware imediatamente
};`,
  },
  {
    id: 'layer-api',
    layer: 'Camada 02 · API Gateway & Orquestração',
    title: 'Backend Assíncrono & Controle de Consentimento',
    tech: 'Python 3.12 · FastAPI (ASGI / Uvicorn) · Pydantic v2 · JWT + HMAC',
    description:
      'Gerencia autenticação por papéis (RBAC), emissão de convites em lote (Match Express), máquina de estados do Double Opt-In e roteamento de tarefas pesadas para fila.',
    metrics: ['Throughput > 1.200 req/s', 'Resposta HTTP 202 em < 35ms', 'Validação estrita Pydantic v2'],
    codeSnippet: `@router.post("/v1/match-express/{vacancy_id}/opt-in", status_code=200)
async def confirm_double_opt_in(
    vacancy_id: UUID,
    candidate_token: str = Depends(verify_hmac_consent),
    db: AsyncSession = Depends(get_db)
):
    # Somente após assinatura criptográfica do candidato libera o cofre PII
    match = await repo.unlock_mutual_match(db, vacancy_id, candidate_token)
    await audit_log.record(event="DOUBLE_OPT_IN_GRANTED", hash=match.audit_sha256)
    return {"status": "UNLOCKED", "company_access": True}`,
  },
  {
    id: 'layer-workers',
    layer: 'Camada 03 · Fila & Pipeline de IA Explicável',
    title: 'Workers Assíncronos de Transcrição, Extração e Vetorização',
    tech: 'pg-boss / Celery · Faster-Whisper (pt-BR) · Qwen 2.5/3 (4B INT8) · Multilingual-E5',
    description:
      'Processa entrevistas em background sem bloquear a API. Converte voz em texto puro, descarta o áudio original, extrai evidências citáveis e gera vetores de 768 dimensões.',
    metrics: ['Transcrição 4x mais rápida (CTranslate2)', '0% peso para tom de voz ou sotaque', 'Verificador anti-alucinação'],
    codeSnippet: `async def process_interview_pipeline(job_id: str, audio_path: str):
    # 1. Transcrição fonética pura e descarte imediato do binário de voz
    segments = whisper_model.transcribe(audio_path, language="pt", beam_size=5)
    os.remove(audio_path)  # Garantia física de não-retenção biométrica
    
    # 2. Extração estruturada com citação obrigatória de trecho (EvidenceVerifier)
    synthesis = await slm_qwen.extract_competencies(segments.text)
    verified = evidence_verifier.validate_quotes(synthesis, source_text=segments.text)
    
    # 3. Embedding semântico para busca vetorial
    embedding = e5_model.encode(verified.summary_text, normalize_embeddings=True)
    await db.save_anonymized_profile(job_id, verified, embedding)`,
  },
  {
    id: 'layer-data',
    layer: 'Camada 04 · Persistência Segregada & Vetorial',
    title: 'Banco Relacional + Busca Vetorial + Cofre PII (LGPD)',
    tech: 'PostgreSQL 16 · pgvector (HNSW Index) · Esquema Segregado Vault PII',
    description:
      'Separa fisicamente os dados públicos anonimizados (vetores, skills, scores) do cofre de identidade pessoal (nome, e-mail, telefone, CNPJ bloqueado), garantindo Privacy by Design.',
    metrics: ['Busca HNSW < 12ms para 100k perfis', 'Isolamento de schema public vs vault', 'Trilha de auditoria SHA-256'],
    codeSnippet: `-- Esquema Segregado: A shortlist corporativa consulta APENAS public.candidate_vectors
SELECT c.anon_id, c.seniority, c.tech_summary,
       1 - (c.embedding <=> :vacancy_embedding) AS semantic_similarity
FROM public.candidate_vectors c
WHERE c.blocked_cnpj_hash != :company_cnpj_hash -- Modo Discreto Automático
  AND c.salary_min <= :vacancy_budget_max
ORDER BY c.embedding <=> :vacancy_embedding LIMIT 15;`,
  },
];

export const AI_PIPELINE_STAGES: PipelineStageSpec[] = [
  {
    step: '01',
    name: 'Ingestão & Sanitização de Áudio',
    engine: 'Web Audio API + FastAPI Stream',
    input: 'Áudio bruto (.webm) ou Texto estruturado',
    output: 'Buffer temporário isolado em RAM/Tmp',
    latency: '~150 ms',
    privacyRule: 'Vinculado apenas a um UUID efêmero; sem vínculo direto ao nome do candidato.',
    details: 'Normalização de taxa de amostragem para 16kHz mono para otimizar a inferência acústica.',
  },
  {
    step: '02',
    name: 'Transcrição Acústica Desenviesada',
    engine: 'Faster-Whisper (CTranslate2 INT8 · pt-BR)',
    input: 'Buffer de áudio 16kHz',
    output: 'Transcrição textual com timestamps + Exclusão do áudio',
    latency: '~2,4 s (para 1 min de fala)',
    privacyRule: 'Descarte definitivo do arquivo de voz logo após gerar o texto.',
    details: 'Timbre vocal, sotaque regional, pausas acústicas ou gênero nunca são repassados adiante.',
  },
  {
    step: '03',
    name: 'Extração de Competências & Evidências',
    engine: 'SLM Qwen 4B (Prompt Estruturado JSON)',
    input: 'Texto transcrito sanitizado',
    output: 'JSON de Hard/Soft Skills + Citações literais',
    latency: '~1,8 s',
    privacyRule: 'Remoção automática de menções acidentais a nomes, idades ou empresas (NER Masking).',
    details: 'Gera a síntese explicável exigindo que cada competência aponte o trecho exato dito pelo candidato.',
  },
  {
    step: '04',
    name: 'Verificação Anti-Alucinação (EvidenceVerifier)',
    engine: 'Algoritmo Determinístico de Substring & Levenshtein',
    input: 'JSON gerado pela IA + Texto original',
    output: 'Síntese homologada com selo de integridade',
    latency: '< 15 ms',
    privacyRule: 'Se a citação não existir literalmente no texto original, a inferência é rejeitada.',
    details: 'Garante determinismo acadêmico: a IA organiza, mas nunca inventa experiências não declaradas.',
  },
  {
    step: '05',
    name: 'Vetorização & Match Ponderado 50/30/20',
    engine: 'Multilingual-E5-Large + PostgreSQL pgvector',
    input: 'Síntese homologada + Requisitos da vaga',
    output: 'Score Explicável (0–100%) + Justificativa auditável',
    latency: '< 25 ms',
    privacyRule: 'Direito de revisão e contestação garantido (Art. 20 da LGPD).',
    details: 'Combina similaridade de cosseno técnica (50%), aderência comportamental (30%) e faixa salarial (20%).',
  },
];

export const INFERENCE_SCALE_TIERS: ScaleTierSpec[] = [
  {
    interviewsPerMonth: 250,
    label: 'Cenário Inicial MVP (250 entrevistas/mês)',
    cloudFixedBrl: 320,
    inferenceVariableBrl: 90,
    totalMonthlyBrl: 409,
    unitCostBrl: 'R$ 1,64',
    optimizations: [
      'Infraestrutura enxuta em nuvem (~R$ 409/mês conforme apresentado no vídeo)',
      'Workers compartilhados com alocação sob demanda para absorver picos',
      'Banco PostgreSQL + pgvector unificado reduzindo custo de serviços gerenciados',
    ],
  },
  {
    interviewsPerMonth: 750,
    label: 'Tração Intermediária (750 entrevistas/mês)',
    cloudFixedBrl: 450,
    inferenceVariableBrl: 240,
    totalMonthlyBrl: 690,
    unitCostBrl: 'R$ 0,92',
    optimizations: [
      'Ativação de Dynamic Batching: agrupa transcrições em janelas de 5 segundos',
      'Cache de embeddings de vagas recorrentes (evita recalcular vetores da empresa)',
      'Ddiluição do custo fixo da instância base por 3x mais candidatos processados',
    ],
  },
  {
    interviewsPerMonth: 2000,
    label: 'Escala Comercial (2.000 entrevistas/mês)',
    cloudFixedBrl: 680,
    inferenceVariableBrl: 580,
    totalMonthlyBrl: 1260,
    unitCostBrl: 'R$ 0,63',
    optimizations: [
      'Queda de 61,5% no custo unitário por entrevista (de R$ 1,64 para R$ 0,63)',
      'Quantização INT8/FP16 nos modelos Faster-Whisper e Qwen reduzindo VRAM em 50%',
      'Fila pg-boss com agendamento inteligente em janelas de menor custo computacional',
    ],
  },
];

export const CLOUD_COST_BREAKDOWN_MVP = [
  { item: 'Compute API & Workers Assíncronos (Container PaaS 2 vCPU / 4GB)', costBrl: 'R$ 145/mês', share: '35%' },
  { item: 'Worker GPU Spot / Serverless Inference (Whisper + Qwen sob demanda)', costBrl: 'R$ 110/mês', share: '27%' },
  { item: 'PostgreSQL 16 Managed + Extensão pgvector (Armazenamento + Índices)', costBrl: 'R$ 115/mês', share: '28%' },
  { item: 'Object Storage Efêmero (TTL 24h) + Monitoramento & Logs', costBrl: 'R$ 39/mês', share: '10%' },
];

export const BANCA_TECHNICAL_FAQS: BancaFaqItem[] = [
  {
    category: 'IA & Ética',
    question: '1. Como vocês provam tecnicamente que a IA não discrimina por sotaque, gênero ou tom de voz?',
    shortAnswer:
      'Porque o modelo de decisão nunca recebe o áudio nem metadados acústicos; ele recebe exclusivamente a transcrição textual sanitizada.',
    technicalDeepDive:
      'O pipeline é dividido em dois estágios isolados: primeiro, o Faster-Whisper converte os fonemas em texto plano UTF-8 e o arquivo de áudio (.webm) é deletado do disco (`os.remove`). Em seguida, um filtro de entidades nomeadas (NER) remove nomes próprios ou referências demográficas antes de enviar o texto ao modelo Qwen e ao gerador de embeddings Multilingual-E5. Assim, duas pessoas com sotaques, idades ou timbres completamente diferentes que expressem a mesma solução técnica geram exatamente o mesmo vetor matemático.',
  },
  {
    category: 'IA & Ética',
    question: '2. Como evitar que a LLM "alucine" competências que o candidato não possui?',
    shortAnswer:
      'Utilizamos o módulo determinístico EvidenceVerifier, que exige citação literal da transcrição e valida sua existência exata.',
    technicalDeepDive:
      'O prompt do Qwen obriga o retorno em JSON contendo o campo `evidence_quote`. Antes de persistir no banco, o `EvidenceVerifier` executa uma verificação algorítmica de substring e distância de edição (Levenshtein normalizada) contra o texto original transcrito. Se a frase citada pela IA não existir na fala real do candidato, a competência é descartada automaticamente.',
  },
  {
    category: 'Custos & Infra',
    question: '3. De onde vem a redução do custo técnico por entrevista de R$ 1,64 para R$ 0,63 citada no vídeo?',
    shortAnswer:
      'Da diluição da infraestrutura base (~R$ 409/mês) combinada com Dynamic Batching, quantização INT8 e cache de vetores.',
    technicalDeepDive:
      'No volume inicial de 250 entrevistas/mês, o custo fixo de disponibilidade da nuvem (R$ 409/mês) representa ~78% do custo de cada entrevista (R$ 409 / 250 = R$ 1,636). Quando escalamos para 2.000 entrevistas/mês, aplicamos quantização CTranslate2 INT8 (que dobra a vazão por vCPU/GPU) e processamos entrevistas em lotes assíncronos via fila, levando o custo total mensal para ~R$ 1.260, o que resulta em R$ 0,63 por entrevista analisada.',
  },
  {
    category: 'Segurança & LGPD',
    question: '4. Como o banco de dados garante o Double Opt-In e o Modo Discreto (bloqueio da empresa atual)?',
    shortAnswer:
      'Através de segregação física de schemas (`public` vs `vault`) e comparação de CNPJ por hash criptográfico SHA-256.',
    technicalDeepDive:
      'A tabela consultada pelo motor de busca (`public.candidate_vectors`) não possui colunas de nome, e-mail ou telefone — apenas um `anon_id` e o `blocked_cnpj_hash`. Quando uma empresa abre uma vaga, o sistema calcula o hash do CNPJ contratante e filtra na cláusula `WHERE` todos os candidatos que bloquearam aquele CNPJ. Os dados reais de contato ficam na tabela `vault.pii_identities`, cuja chave estrangeira só é descriptografada quando o candidato assina digitalmente o token de aceite (Double Opt-In).',
  },
  {
    category: 'Arquitetura & Escala',
    question: '5. Por que usar PostgreSQL com pgvector e pg-boss em vez de Pinecone + RabbitMQ no MVP?',
    shortAnswer:
      'Para reduzir a complexidade operacional, eliminar latência de rede entre múltiplos serviços e manter a nuvem em R$ 409/mês.',
    technicalDeepDive:
      'Em um cenário de até 100.000 candidatos, o índice HNSW do `pgvector` no PostgreSQL 16 entrega buscas de similaridade de cosseno em menos de 12ms com transações ACID completas entre os vetores e os filtros relacionais (como faixa salarial e senioridade). Usar o `pg-boss` para filas no mesmo banco evita pagar instâncias dedicadas de Redis/RabbitMQ e Pinecone, viabilizando a operação real com R$ 409/mês.',
  },
  {
    category: 'Segurança & LGPD',
    question: '6. Como funciona na prática o direito de contestação previsto no Art. 20 da LGPD?',
    shortAnswer:
      'O candidato visualiza sua síntese antes de qualquer empresa e pode editar, regravar ou acionar revisão humana auditada.',
    technicalDeepDive:
      'Diferente de plataformas caixa-preta onde o candidato não sabe por que foi reprovado, na Q.I. Match o relatório gerado pela IA é exibido primeiro ao próprio profissional. Caso discorde de alguma interpretação semântica, ele pode abrir um evento de `CONTESTATION_REQUEST` que invalida o vetor anterior, registra o diff na tabela de auditoria e recalcula o perfil sem penalização.',
  },
];
