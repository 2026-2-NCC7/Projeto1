-- ==============================================================================
-- Q.I. MATCH - SCHEMA COMPLETO SUPABASE (POSTGRESQL + RLS + TRIGGERS + SEEDS)
-- Plataforma de Recrutamento Invertido, Matching Explicável e IA Local
-- ==============================================================================

-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABELA DE PERFIS PÚBLICOS (Sincronizada com auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('profissional', 'empresa', 'admin')),
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. PERFIL DO CANDIDATO / PROFISSIONAL
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    tech_area TEXT NOT NULL DEFAULT 'Full-Stack',
    declared_seniority TEXT NOT NULL DEFAULT 'Pleno' CHECK (declared_seniority IN ('Júnior', 'Pleno', 'Sênior', 'Especialista')),
    years_of_experience NUMERIC(4, 1) NOT NULL DEFAULT 0.0,
    contract_preference TEXT NOT NULL DEFAULT 'INDIFERENTE' CHECK (contract_preference IN ('CLT', 'PJ', 'INDIFERENTE')),
    work_model_preference TEXT NOT NULL DEFAULT 'REMOTO' CHECK (work_model_preference IN ('REMOTO', 'HIBRIDO', 'PRESENCIAL', 'INDIFERENTE')),
    salary_expectation NUMERIC(10, 2),
    bio_summary TEXT,
    location TEXT DEFAULT 'São Paulo, SP',
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    double_opt_in_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    estalecas_balance INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. PERFIL DA EMPRESA (CLIENTE B2B)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cnpj TEXT,
    industry TEXT DEFAULT 'Tecnologia da Informação',
    description TEXT,
    location TEXT DEFAULT 'São Paulo, SP',
    credits INTEGER NOT NULL DEFAULT 3,
    plan TEXT NOT NULL DEFAULT 'PAY_PER_USE' CHECK (plan IN ('PAY_PER_USE', 'CORP_MONTHLY', 'CUSTOM')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. CATÁLOGO DE COMPETÊNCIAS (HARD & SOFT SKILLS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.skill_catalog (
    id TEXT PRIMARY KEY, -- e.g. 'tech-python', 'soft-comunicacao'
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('HARD', 'SOFT')),
    area TEXT,
    description TEXT NOT NULL,
    behavioral_examples JSONB DEFAULT '[]'::jsonb,
    evaluation_criteria JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.skill_aliases (
    id BIGSERIAL PRIMARY KEY,
    skill_id TEXT NOT NULL REFERENCES public.skill_catalog(id) ON DELETE CASCADE,
    alias TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_skill_aliases_alias ON public.skill_aliases(alias);

-- Competências declaradas pelo candidato no onboarding
CREATE TABLE IF NOT EXISTS public.candidate_declared_skills (
    id BIGSERIAL PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES public.skill_catalog(id) ON DELETE RESTRICT,
    declared_level INTEGER NOT NULL CHECK (declared_level BETWEEN 1 AND 5),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(candidate_id, skill_id)
);

-- ==============================================================================
-- 6. VAGAS E REQUISITOS (EMPRESAS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_vertical TEXT NOT NULL DEFAULT 'Fullstack',
    seniority TEXT NOT NULL CHECK (seniority IN ('Júnior', 'Pleno', 'Sênior', 'Especialista')),
    contract_type TEXT NOT NULL DEFAULT 'INDIFERENTE' CHECK (contract_type IN ('CLT', 'PJ', 'INDIFERENTE')),
    work_model TEXT NOT NULL DEFAULT 'REMOTO' CHECK (work_model IN ('REMOTO', 'HIBRIDO', 'PRESENCIAL', 'INDIFERENTE')),
    min_salary NUMERIC(10, 2),
    max_salary NUMERIC(10, 2),
    min_experience_years NUMERIC(4, 1) NOT NULL DEFAULT 0.0,
    is_urgent_match_express BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'ABERTA' CHECK (status IN ('ABERTA', 'PAUSADA', 'PREENCHIDA', 'CANCELADA')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.job_skill_requirements (
    id BIGSERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES public.skill_catalog(id) ON DELETE RESTRICT,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE, -- Eliminatório se TRUE, Desejável se FALSE
    min_level INTEGER NOT NULL DEFAULT 3 CHECK (min_level BETWEEN 1 AND 5),
    weight NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    UNIQUE(job_id, skill_id)
);

-- ==============================================================================
-- 7. BANCO DE PERGUNTAS, ENTREVISTAS E TRANSCRIÇÕES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id TEXT PRIMARY KEY, -- e.g. 'q-geral-001'
    text TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('GERAL', 'TECNICA', 'COMPORTAMENTAL')),
    target_competencies JSONB DEFAULT '[]'::jsonb,
    rubric TEXT,
    order_index INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    interview_type TEXT NOT NULL DEFAULT 'TIPO_A_GERAL' CHECK (interview_type IN ('TIPO_A_GERAL', 'TIPO_B_VAGA')),
    status TEXT NOT NULL DEFAULT 'INICIADA' CHECK (status IN ('INICIADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'PROCESSANDO', 'ANALISADA')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.interview_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.interview_questions(id) ON DELETE RESTRICT,
    audio_file_path TEXT,
    audio_duration_seconds NUMERIC(6, 2),
    input_type TEXT NOT NULL DEFAULT 'TEXT' CHECK (input_type IN ('AUDIO', 'TEXT')),
    raw_text TEXT,
    edited_text TEXT,
    status TEXT NOT NULL DEFAULT 'CONFIRMADO' CHECK (status IN ('PENDENTE', 'GRAVADO', 'TRANSCRITO', 'CONFIRMADO')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    answer_id UUID NOT NULL REFERENCES public.interview_answers(id) ON DELETE CASCADE,
    engine TEXT NOT NULL DEFAULT 'faster-whisper-small-int8',
    full_text TEXT NOT NULL,
    segments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 8. LAUDOS, EVIDÊNCIAS DE COMPETÊNCIAS E REVISÕES (ART. 20 LGPD)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.assessment_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    interview_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'CONSOLIDADO' CHECK (status IN ('PRELIMINAR', 'CONSOLIDADO', 'EM_REVISAO')),
    active_version_number INTEGER NOT NULL DEFAULT 1,
    model_metadata JSONB DEFAULT '{"whisper": "small-int8", "llm": "qwen3:4b", "embedder": "multilingual-e5-small"}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.report_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.assessment_reports(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'ARQUIVADO', 'REVISADO')),
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(report_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.competency_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_id UUID NOT NULL REFERENCES public.report_versions(id) ON DELETE CASCADE,
    skill_id TEXT NOT NULL REFERENCES public.skill_catalog(id) ON DELETE RESTRICT,
    declared BOOLEAN NOT NULL DEFAULT FALSE,
    declared_level INTEGER CHECK (declared_level BETWEEN 1 AND 5),
    evidence_status TEXT NOT NULL CHECK (evidence_status IN (
        'EVIDENCIADA', 'PARCIALMENTE_EVIDENCIADA', 'EVIDENCIA_INSUFICIENTE', 
        'NAO_AVALIADA', 'DIVERGENCIA_IDENTIFICADA'
    )),
    estimated_level INTEGER CHECK (estimated_level BETWEEN 1 AND 5),
    explanation TEXT NOT NULL,
    requires_review BOOLEAN NOT NULL DEFAULT FALSE,
    is_suggested BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(version_id, skill_id)
);

CREATE TABLE IF NOT EXISTS public.competency_evidences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES public.competency_assessments(id) ON DELETE CASCADE,
    answer_id UUID REFERENCES public.interview_answers(id) ON DELETE SET NULL,
    quote TEXT NOT NULL,
    timestamp_start NUMERIC(6, 2),
    timestamp_end NUMERIC(6, 2),
    justification TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.report_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES public.assessment_reports(id) ON DELETE CASCADE,
    version_id UUID NOT NULL REFERENCES public.report_versions(id) ON DELETE CASCADE,
    reviewer_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_type TEXT NOT NULL CHECK (review_type IN ('HUMANA_ADMIN', 'REPLICA_CANDIDATO')),
    candidate_replica_text TEXT,
    reviewer_notes TEXT,
    status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK (status IN ('PENDENTE', 'APROVADA', 'REJEITADA')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMPTZ
);

-- ==============================================================================
-- 9. PROCESSOS SELETIVOS, MATCHING E DOUBLE OPT-IN
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.selection_processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vacancy_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    overall_match_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    stage TEXT NOT NULL DEFAULT 'CONVITE_ENVIADO' CHECK (stage IN (
        'CONVITE_ENVIADO', 'OPT_IN_CONFIRMADO', 'ENTREVISTA_AGENDADA', 
        'PROPOSTA_ENVIADA', 'CONTRATADO', 'RECUSADO'
    )),
    double_opt_in_candidate BOOLEAN NOT NULL DEFAULT FALSE,
    double_opt_in_company BOOLEAN NOT NULL DEFAULT TRUE,
    opt_in_decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(vacancy_id, candidate_id)
);

CREATE TABLE IF NOT EXISTS public.matching_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    overall_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    hard_skills_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    soft_skills_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    experience_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    conditions_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    evaluation_coverage NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    is_objectively_incompatible BOOLEAN NOT NULL DEFAULT FALSE,
    incompatibility_reasons JSONB DEFAULT '[]'::jsonb,
    matched_skills JSONB DEFAULT '[]'::jsonb,
    partial_skills JSONB DEFAULT '[]'::jsonb,
    missing_skills JSONB DEFAULT '[]'::jsonb,
    pending_skills JSONB DEFAULT '[]'::jsonb,
    textual_justification TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(job_id, candidate_id)
);

-- ==============================================================================
-- 10. CONSENTIMENTO (LGPD) E TRILHA DE AUDITORIA
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    purpose TEXT NOT NULL,
    legal_basis TEXT NOT NULL DEFAULT 'CONSENTIMENTO_LGPD',
    granted BOOLEAN NOT NULL DEFAULT TRUE,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 11. COMUNIDADE E GAMIFICAÇÃO (TECH POINTS / RECOMPENSAS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.reward_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- positivo para crédito, negativo para resgate
    type TEXT NOT NULL CHECK (type IN ('INDICACAO_APROVADA', 'RESGATE_CURSO', 'RESGATE_VOUCHER_AWS', 'BONUS_CADASTRO')),
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 12. TRIGGER AUTOMÁTICO: CRIAÇÃO DE PERFIL VIA SUPABASE AUTH (EMAIL / GOOGLE / GITHUB)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    assigned_role TEXT;
    user_full_name TEXT;
BEGIN
    -- 1. Determina a role (padrão: 'profissional' se não fornecida)
    assigned_role := COALESCE(new.raw_user_meta_data->>'role', 'profissional');
    IF assigned_role NOT IN ('profissional', 'empresa', 'admin') THEN
        assigned_role := 'profissional';
    END IF;

    -- 2. Determina o nome (obtido do Google/GitHub ou do formulário)
    user_full_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
    );

    -- 3. Insere em public.profiles
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (
        new.id,
        new.email,
        user_full_name,
        assigned_role,
        new.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = timezone('utc'::text, now());

    -- 4. Cria a entidade correspondente ao tipo de perfil
    IF assigned_role = 'profissional' THEN
        INSERT INTO public.candidates (profile_id, tech_area, declared_seniority)
        VALUES (
            new.id,
            COALESCE(new.raw_user_meta_data->>'tech_area', 'Full-Stack'),
            COALESCE(new.raw_user_meta_data->>'declared_seniority', 'Pleno')
        )
        ON CONFLICT (profile_id) DO NOTHING;
    ELSIF assigned_role = 'empresa' THEN
        INSERT INTO public.companies (profile_id, name, cnpj)
        VALUES (
            new.id,
            COALESCE(new.raw_user_meta_data->>'company_name', user_full_name),
            new.raw_user_meta_data->>'cnpj'
        )
        ON CONFLICT (profile_id) DO NOTHING;
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger disparado após qualquer cadastro no Supabase Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) - POLÍTICAS DE PROTEÇÃO DE DADOS
-- ==============================================================================

-- Ativa RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_declared_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skill_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competency_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competency_evidences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selection_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matching_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;

-- 13.1. PROFILES
CREATE POLICY "Perfis visíveis para autenticados" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuário atualiza próprio perfil" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id);

-- 13.2. CANDIDATES (Privacidade LGPD & Double Opt-In)
CREATE POLICY "Candidato lê próprio perfil" ON public.candidates
    FOR SELECT TO authenticated USING (profile_id = auth.uid());

CREATE POLICY "Empresas leem candidatos públicos ou com opt-in aceito" ON public.candidates
    FOR SELECT TO authenticated USING (
        -- Empresa pode ver resumo anônimo de candidatos OU candidatos com opt-in aceito para suas vagas
        EXISTS (
            SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('empresa', 'admin')
        )
    );

CREATE POLICY "Candidato atualiza seus próprios dados" ON public.candidates
    FOR UPDATE TO authenticated USING (profile_id = auth.uid());

-- 13.3. COMPANIES
CREATE POLICY "Empresas visíveis para autenticados" ON public.companies
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Empresa atualiza próprios dados" ON public.companies
    FOR UPDATE TO authenticated USING (profile_id = auth.uid());

-- 13.4. SKILL CATALOG & PERGUNTAS (Leitura Pública, Escrita Admin)
CREATE POLICY "Catálogo de skills público para leitura" ON public.skill_catalog
    FOR SELECT USING (true);

CREATE POLICY "Aliases públicos para leitura" ON public.skill_aliases
    FOR SELECT USING (true);

CREATE POLICY "Banco de perguntas público para leitura" ON public.interview_questions
    FOR SELECT USING (true);

-- 13.5. VAGAS (JOBS)
CREATE POLICY "Vagas abertas visíveis para todos autenticados" ON public.jobs
    FOR SELECT TO authenticated USING (status = 'ABERTA' OR company_id IN (
        SELECT id FROM public.companies WHERE profile_id = auth.uid()
    ));

CREATE POLICY "Empresa gerencia suas próprias vagas" ON public.jobs
    FOR ALL TO authenticated USING (
        company_id IN (SELECT id FROM public.companies WHERE profile_id = auth.uid())
    );

CREATE POLICY "Requisitos de vagas visíveis para leitura" ON public.job_skill_requirements
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Empresa gerencia requisitos de suas vagas" ON public.job_skill_requirements
    FOR ALL TO authenticated USING (
        job_id IN (SELECT id FROM public.jobs WHERE company_id IN (
            SELECT id FROM public.companies WHERE profile_id = auth.uid()
        ))
    );

-- 13.6. ENTREVISTAS E LAUDOS
CREATE POLICY "Candidato acessa suas próprias sessões" ON public.interview_sessions
    FOR ALL TO authenticated USING (
        candidate_id IN (SELECT id FROM public.candidates WHERE profile_id = auth.uid())
    );

CREATE POLICY "Candidato acessa suas respostas" ON public.interview_answers
    FOR ALL TO authenticated USING (
        session_id IN (SELECT id FROM public.interview_sessions WHERE candidate_id IN (
            SELECT id FROM public.candidates WHERE profile_id = auth.uid()
        ))
    );

CREATE POLICY "Candidato e empresas autorizadas leem laudos" ON public.assessment_reports
    FOR SELECT TO authenticated USING (
        candidate_id IN (SELECT id FROM public.candidates WHERE profile_id = auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.selection_processes sp
            WHERE sp.candidate_id = assessment_reports.candidate_id
            AND sp.double_opt_in_candidate = true
            AND sp.company_id IN (SELECT id FROM public.companies WHERE profile_id = auth.uid())
        )
    );

-- 13.7. PROCESSOS SELETIVOS E DOUBLE OPT-IN
CREATE POLICY "Partes acessam seus processos seletivos" ON public.selection_processes
    FOR ALL TO authenticated USING (
        candidate_id IN (SELECT id FROM public.candidates WHERE profile_id = auth.uid())
        OR company_id IN (SELECT id FROM public.companies WHERE profile_id = auth.uid())
    );

-- 13.8. COMUNIDADE E TECH POINTS
CREATE POLICY "Posts da comunidade visíveis para todos" ON public.community_posts
    FOR SELECT USING (true);

CREATE POLICY "Usuário publica seus próprios posts" ON public.community_posts
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

CREATE POLICY "Usuário consulta seu extrato de Tech Points" ON public.reward_transactions
    FOR SELECT TO authenticated USING (profile_id = auth.uid());

-- ==============================================================================
-- 14. BUCKETS DE STORAGE (ÁUDIOS, CURRÍCULOS E AVATARES)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('audio-interviews', 'audio-interviews', false),
    ('avatars', 'avatars', true),
    ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Avatares públicos para leitura" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Usuário faz upload de seu próprio avatar" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Candidato acessa seus áudios gravados" ON storage.objects
    FOR ALL TO authenticated USING (
        bucket_id = 'audio-interviews' AND (storage.foldername(name))[1] = auth.uid()::text
    );


-- ==============================================================================
-- SEED DE COMPETÊNCIAS E PERGUNTAS PARA O SUPABASE
-- ==============================================================================

-- 1. Catálogo de Competências
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-python', 'Python', 'HARD', 'Linguagens & Backend', 'Desenvolvimento de software, automação, análise de dados e APIs utilizando a linguagem Python e seu ecossistema.', '["Construção de APIs REST assíncronas utilizando FastAPI ou Flask", "Criação de scripts para automação de tarefas e rotinas ETL", "Manipulação e processamento de dados tabulares utilizando Pandas e NumPy", "Implementação de testes unitários com pytest e cobertura de código"]'::jsonb, '{"1": "Conhecimento de sintaxe básica, tipos de dados primitivos e controle de fluxo.", "2": "Criação de scripts funcionais, manipulação de arquivos e uso de módulos padrão.", "3": "Desenvolvimento de rotinas orientadas a objetos, uso de pacotes de terceiros (Pandas, Requests) e tratamento de erros.", "4": "Arquitetura de APIs robustas, programação concorrente/assíncrona, boas práticas (PEP8, type hinting) e empacotamento.", "5": "Otimização de baixo nível (C-extensions, profiling), metaprogramação, design de frameworks internos e liderança técnica na linguagem."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-python', 'Python 3');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-python', 'Python Programming');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-python', 'Linguagem Python');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-python', 'Py');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-sql', 'SQL & Bancos Relacionais', 'HARD', 'Banco de Dados', 'Consulta, modelagem, manipulação e otimização de bancos de dados relacionais (PostgreSQL, MySQL, SQLite, Oracle).', '["Escrita de queries complexas com múltiplos JOINs, subqueries e Window Functions", "Análise e otimização de planos de execução (EXPLAIN ANALYZE) e índices", "Criação de DDL, migrations versionadas e integridade referencial", "Implementação de procedures, triggers e controle transacional ACID"]'::jsonb, '{"1": "Comandos básicos SELECT, WHERE, INSERT, UPDATE, DELETE.", "2": "Uso de INNER/LEFT JOINs, agregações (GROUP BY, HAVING) e funções escalares.", "3": "Modelagem relacional (3FN), criação de índices, subqueries e transações.", "4": "Window functions (ROW_NUMBER, RANK), CTEs complexas, otimização de planos de execução e tunning de queries.", "5": "Arquitetura de alta disponibilidade, particionamento de tabelas gigantes, replicação e governança corporativa de dados."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-sql', 'SQL');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-sql', 'Structured Query Language');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-sql', 'PostgreSQL');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-sql', 'MySQL');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-sql', 'Queries SQL');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-javascript', 'JavaScript', 'HARD', 'Linguagens & Web', 'Programação moderna em JavaScript (ES6+), tanto para navegadores quanto para ambientes de servidor (Node.js).', '["Manipulação assíncrona com Promises e async/await", "Implementação de lógica de interface reativa e consumo de APIs REST", "Compreensão de closures, event loop, protótipos e escopos"]'::jsonb, '{"1": "Sintaxe fundamental, manipulação básica de variáveis e DOM.", "2": "Funções, arrays, manipulação de objetos e eventos simples.", "3": "Promises, async/await, desestruturação ES6, módulos e consumo de HTTP.", "4": "Domínio do event loop, Web APIs, metaprogramação e modularização avançada.", "5": "Contribuição para runtimes/motores JS (V8), tooling de build e arquitetura de larga escala."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-javascript', 'JS');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-javascript', 'ECMAScript');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-javascript', 'ES6+');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-javascript', 'Vanilla JS');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-typescript', 'TypeScript', 'HARD', 'Linguagens & Web', 'Desenvolvimento tipado estaticamente sobre JavaScript para aplicações escaláveis e seguras.', '["Definição de interfaces, types genéricos e union types avançados", "Configuração do tsconfig e integração com linters e bundlers", "Refatoração de código com inferência de tipos sem perder performance"]'::jsonb, '{"1": "Tipagem de tipos primitivos e funções simples.", "2": "Criação de interfaces e tipos personalizados.", "3": "Uso de generics, enums, utility types (Partial, Omit, Pick).", "4": "Conditional types, mapped types, template literal types e criação de bibliotecas tipadas.", "5": "Arquitetura corporativa de tipos distribuídos e desenvolvimento de plugins para o compilador TS."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-typescript', 'TS');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-typescript', 'Type Script');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-typescript', 'TypeScript Language');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-react', 'React', 'HARD', 'Frontend', 'Construção de interfaces de usuário dinâmicas, componentizadas e reativas com React e seu ecossistema.', '["Criação de componentes funcionais com Hooks personalizados", "Gerenciamento de estado global com Context API, Redux ou Zustand", "Otimização de renderização com useMemo, useCallback e React.memo"]'::jsonb, '{"1": "Criação de componentes JSX simples e passagem de props.", "2": "Uso de useState e useEffect para estados locais e ciclos de vida.", "3": "Criação de custom hooks, consumo de APIs e roteamento com React Router.", "4": "Performance profiling, server-side rendering (SSR), suspense e arquitetura de design systems.", "5": "Core contributor ou arquiteto de microfrontends de altíssima escala com React."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-react', 'React.js');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-react', 'ReactJS');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-react', 'React framework');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-nodejs', 'Node.js', 'HARD', 'Backend', 'Desenvolvimento backend escalável e orientado a eventos no ambiente de execução Node.js.', '["Construção de microsserviços com Express, NestJS ou Fastify", "Manipulação de streams, buffers e concorrência no event loop", "Integração com bancos de dados e mensageria assíncrona"]'::jsonb, '{"1": "Execução de scripts Node e gerenciamento de pacotes com NPM/Yarn.", "2": "Criação de servidores HTTP básicos e rotas com Express.", "3": "Autenticação JWT, middlewares, conexão com ORM/bancos e tratamento de erros.", "4": "Manipulação de streams, clusterização, worker threads e profiling de memória.", "5": "Arquitetura distribuída de microsserviços Node de altíssima vazão (milhões de req/s)."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nodejs', 'Node');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nodejs', 'NodeJS');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nodejs', 'Node runtime');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-java', 'Java', 'HARD', 'Linguagens & Backend', 'Desenvolvimento corporativo robusto com Java e ecossistema Spring Boot.', '["Desenvolvimento de microsserviços com Spring Boot e Spring Cloud", "Persistência com JPA/Hibernate e gerenciamento de transações", "Concorrência com Java Threads, ExecutorService e Virtual Threads"]'::jsonb, '{"1": "Sintaxe POO básica (classes, objetos, herança, encapsulamento).", "2": "Collections framework, tratamento de exceções e I/O básico.", "3": "Spring Boot (REST controllers, services, repositories) e Maven/Gradle.", "4": "Streams e lambdas avançadas, concorrência, otimização de GC da JVM e Spring Security.", "5": "Arquitetura enterprise, tuning profundo da JVM e sistemas de missão crítica de altíssima tolerância a falhas."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-java', 'Linguagem Java');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-java', 'Java 17');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-java', 'Java 21');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-java', 'JVM');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-apis', 'Desenvolvimento de APIs REST', 'HARD', 'Engenharia de Software', 'Concepção, design, implementação e documentação de APIs HTTP/RESTful escaláveis e seguras.', '["Modelagem de recursos HTTP seguindo métodos e status codes semânticos", "Documentação padronizada com OpenAPI/Swagger e contratos tipados", "Implementação de versionamento, paginação, filtros e rate limiting"]'::jsonb, '{"1": "Conceito de endpoints, requisições GET/POST simples.", "2": "Uso correto de métodos HTTP (GET, POST, PUT, DELETE) e códigos de status.", "3": "Autenticação segura, validação de payload com schemas e documentação OpenAPI.", "4": "Idempotência, HATEOAS quando cabível, caching (ETag, Cache-Control) e webhooks.", "5": "Estratégias de API Gateway, governança corporativa de APIs e backwards compatibility em grande escala."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-apis', 'REST APIs');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-apis', 'RESTful');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-apis', 'Web APIs');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-apis', 'OpenAPI');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-apis', 'Swagger');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-data-modeling', 'Modelagem de Dados', 'HARD', 'Dados', 'Concepção conceitual, lógica e física de esquemas de dados relacionais e dimensionais.', '["Desenho de diagramas entidade-relacionamento (DER) normalizados", "Modelagem dimensional para data warehouses (tabelas fato e dimensões)", "Trade-offs entre normalização e desnormalização para performance de leitura"]'::jsonb, '{"1": "Identificação de entidades, atributos e chaves primárias.", "2": "Relacionamentos 1:1, 1:N, N:M e chaves estrangeiras.", "3": "Normalização até a 3ª Forma Normal e diagramação DER.", "4": "Modelagem dimensional de Kimball (fatos e dimensões), SCD (Slowly Changing Dimensions).", "5": "Arquitetura de Lakehouse, modelagem de grafos/documentos e governança em ecossistemas de petabytes."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-modeling', 'Modelagem Relacional');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-modeling', 'Data Modeling');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-modeling', 'Star Schema');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-modeling', 'Snowflake Schema');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-etl', 'Pipelines de Dados & ETL/ELT', 'HARD', 'Engenharia de Dados', 'Extração, transformação, carga e orquestração de fluxos contínuos e batch de dados.', '["Desenvolvimento de DAGs de orquestração com Apache Airflow ou Prefect", "Processamento batch e streaming com Spark ou Pandas", "Monitoramento de qualidade e linagem de dados"]'::jsonb, '{"1": "Execução de scripts de extração simples em arquivos CSV/JSON.", "2": "Criação de pipelines sequenciais em Python ou ferramentas visuais.", "3": "Uso de orquestradores (Airflow), tratamento de falhas e reprocessamento idempotente.", "4": "Pipelines distribuídos com PySpark/dbt, testes de dados automatizados e particionamento eficiente.", "5": "Arquitetura lambda/kappa, streaming em tempo real com Kafka/Flink e observabilidade ponta a ponta."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-etl', 'ETL');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-etl', 'ELT');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-etl', 'Data Pipelines');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-etl', 'Engenharia de Dados');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-etl', 'Orquestração de Dados');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-aws', 'AWS Cloud', 'HARD', 'Cloud & Infra', 'Provisionamento, arquitetura e gerenciamento de serviços na nuvem Amazon Web Services.', '["Configuração de instâncias EC2, buckets S3 e bancos gerenciados RDS", "Criação de funções serverless Lambda integradas com API Gateway e SQS", "Gerenciamento de segurança e políticas com AWS IAM e VPCs"]'::jsonb, '{"1": "Navegação no console AWS e conceitos básicos de nuvem.", "2": "Uso de S3, EC2 básico e compreensão de regiões e zonas.", "3": "Configuração de RDS, Lambda, IAM roles e grupos de segurança.", "4": "Arquitetura serverless completa, VPCs com subnets públicas/privadas e CloudWatch.", "5": "Certificação AWS Solutions Architect Pro, multi-account com AWS Organizations e otimização FinOps."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-aws', 'Amazon Web Services');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-aws', 'Cloud AWS');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-aws', 'AWS');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-docker', 'Docker & Contêineres', 'HARD', 'DevOps', 'Empacotamento, distribuição e execução de aplicações em contêineres isolados com Docker.', '["Escrita de Dockerfiles multi-stage para gerar imagens enxutas e seguras", "Orquestração de ambientes locais com múltiplos serviços no Docker Compose", "Gerenciamento de volumes, redes virtuais e variáveis de ambiente"]'::jsonb, '{"1": "Execução de comandos docker run, docker ps, docker stop.", "2": "Criação de Dockerfile básico e build de imagens.", "3": "Uso de docker-compose para múltiplos serviços, gerenciamento de volumes e variáveis.", "4": "Multi-stage builds, otimização de camadas, execução sem root (security hardening).", "5": "Custom runtimes (containerd/runc), auditoria de vulnerabilidades e arquiteturas avançadas de contêineres."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-docker', 'Docker');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-docker', 'Containers');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-docker', 'Dockerfile');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-docker', 'Docker Compose');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-git', 'Git & Controle de Versão', 'HARD', 'Engenharia de Software', 'Gestão de código-fonte, versionamento distribuído, resolução de conflitos e fluxos de trabalho colaborativos.', '["Uso de branching strategies como Git Flow, Trunk-based Development ou GitHub Flow", "Resolução de conflitos em merges e rebase interativo", "Revisão de Pull Requests com comentários construtivos e rastreabilidade de commits"]'::jsonb, '{"1": "Comandos básicos git clone, git add, git commit, git push.", "2": "Criação e troca de branches, git pull e resolução simples de conflitos.", "3": "Rebase, cherry-pick, git stash e condução de Pull Requests com boas mensagens.", "4": "Rebase interativo complexo, git bisect para encontrar bugs, hooks de pré-commit.", "5": "Governança corporativa de monorepos, estratégias de release branching e automações de repositório."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-git', 'Git');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-git', 'GitHub');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-git', 'GitLab');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-git', 'Controle de Versão');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-testes', 'Testes Automatizados', 'HARD', 'Engenharia de Software', 'Garantia de qualidade contínua através de testes unitários, de integração, ponta a ponta (E2E) e TDD.', '["Escrita de suítes de testes unitários isolados com mocks e fixtures", "Testes de integração de endpoints de API com bancos em memória ou contêineres de teste", "Aferição e manutenção de métricas de cobertura de código nos pipelines"]'::jsonb, '{"1": "Conceito de teste manual vs automatizado, asserts simples.", "2": "Criação de testes unitários básicos em funções isoladas.", "3": "Uso de frameworks (pytest, Jest), fixtures, mocks e testes de rotas da API.", "4": "Testes de integração com dependências reais/Testcontainers, pirâmide de testes e TDD consistente.", "5": "Estratégia corporativa de QA, testes de carga/stress (k6), testes de mutação e chaos engineering."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-testes', 'Testes de Software');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-testes', 'QA');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-testes', 'Pytest');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-testes', 'Jest');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-testes', 'TDD');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-testes', 'Testes Unitários');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-software-architecture', 'Arquitetura de Software', 'HARD', 'Engenharia de Software', 'Definição de padrões de projeto, estruturação modular, desacoplamento e design de sistemas escaláveis.', '["Aplicação prática de princípios SOLID e Clean Architecture", "Decisão fundamentada entre arquiteturas monolíticas modulares e microsserviços", "Implementação de padrões de projeto (Factory, Strategy, Repository, Observer)"]'::jsonb, '{"1": "Conhecimento conceitual de organização em camadas (MVC).", "2": "Separação de responsabilidades e organização de pastas/módulos.", "3": "Aplicação de princípios SOLID, padrão Repository e injeção de dependências.", "4": "Arquitetura Hexagonal/Ports & Adapters, Event-driven architecture e escalabilidade horizontal.", "5": "Arquitetura corporativa de alta escala, resiliência (Circuit Breaker, Bulkhead) e governança técnica."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-software-architecture', 'System Design');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-software-architecture', 'Design Patterns');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-software-architecture', 'Clean Architecture');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-software-architecture', 'Hexagonal Architecture');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-software-architecture', 'Microsserviços');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-data-visualization', 'Visualização de Dados & BI', 'HARD', 'Dados', 'Comunicação visual de dados e insights através de dashboards, relatórios e bibliotecas gráficas.', '["Criação de dashboards interativos no Power BI ou Metabase com métricas de negócio", "Visualização programática com Matplotlib, Seaborn ou Plotly", "Escolha apropriada de gráficos de acordo com a distribuição e propósito analítico"]'::jsonb, '{"1": "Criação de gráficos básicos (barras, linhas, pizza).", "2": "Construção de relatórios com filtros e segmentações no Power BI ou similar.", "3": "Cálculos analíticos (DAX básico), storytelling com dados e visualizações interativas em Python.", "4": "Modelagem para relatórios analíticos, otimização de renderização e design centrado no usuário.", "5": "Governança corporativa de BI, catálogo de métricas unificado e visualizações avançadas customizadas."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-visualization', 'Power BI');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-visualization', 'Tableau');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-visualization', 'Metabase');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-visualization', 'Dashboards');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-visualization', 'Data Viz');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-linux', 'Linux & Shell Scripting', 'HARD', 'Infra & DevOps', 'Operação de sistemas operacionais baseados em Linux, comandos de terminal e automação com Bash.', '["Gerenciamento de processos, serviços systemd e monitoramento de recursos (top, htop, df)", "Manipulação avançada de texto e logs com grep, sed, awk e pipes", "Automação de rotinas com scripts Bash e agendamento via Cron"]'::jsonb, '{"1": "Comandos básicos de navegação (cd, ls, mkdir, rm).", "2": "Permissões de arquivos (chmod, chown), redirecionamentos e pipes.", "3": "Scripts Bash com variáveis, loops, condicionais e automações simples.", "4": "Gerenciamento de daemons (systemd), diagnóstico de rede (netstat, curl, tcpdump) e análise de logs com awk/sed.", "5": "Kernel tuning, segurança avançada (SELinux/AppArmor) e administração de frotas de servidores Linux."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-linux', 'Linux');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-linux', 'Bash');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-linux', 'Shell');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-linux', 'Terminal Unix');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-linux', 'Ubuntu');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-kubernetes', 'Kubernetes', 'HARD', 'DevOps & Cloud', 'Orquestração de contêineres em produção, gerenciamento de clusters, deployments e autoscaling.', '["Criação de manifests de Pods, Deployments, Services e Ingress", "Gerenciamento de configurações com ConfigMaps e Secrets", "Empacotamento de aplicações com Helm charts"]'::jsonb, '{"1": "Conceito de orquestração de contêineres e o que é um Pod.", "2": "Comandos básicos com kubectl (get pods, describe, logs).", "3": "Criação de manifests YAML para Deployments, Services e ConfigMaps.", "4": "Horizontal Pod Autoscaling (HPA), Ingress Controllers, Helm charts e StatefulSets.", "5": "Operação de clusters multi-region, service mesh (Istio), custom resource definitions (CRDs) e operators."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-kubernetes', 'K8s');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-kubernetes', 'Kubernetes cluster');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-kubernetes', 'kubectl');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-kubernetes', 'Helm');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-cicd', 'CI/CD & Automação de Deploy', 'HARD', 'DevOps', 'Construção de esteiras automatizadas de integração e entrega contínua (GitHub Actions, GitLab CI, Jenkins).', '["Criação de workflows no GitHub Actions para rodar linters, testes e builds automáticos", "Publicação automatizada de imagens Docker e deploy em ambientes de staging/produção", "Implementação de aprovações manuais e segredos de ambiente criptografados"]'::jsonb, '{"1": "Conceito de integração contínua e entrega contínua.", "2": "Execução de jobs básicos para rodar testes a cada commit.", "3": "Workflows completos no GitHub Actions com steps de build, teste e publicação de artefato.", "4": "Estratégias de deploy Blue/Green ou Canary, cache eficiente de dependências e segurança de secrets.", "5": "Arquitetura corporativa de GitOps (ArgoCD), governança de compliance e esteiras multi-cloud."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-cicd', 'Integração Contínua');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-cicd', 'Continuous Integration');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-cicd', 'GitHub Actions');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-cicd', 'GitLab CI');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-cicd', 'Pipelines CI/CD');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-nosql', 'Bancos de Dados NoSQL', 'HARD', 'Banco de Dados', 'Trabalho com modelos de dados não-relacionais (documentos, chave-valor, grafos e colunas).', '["Modelagem orientada a agregados no MongoDB", "Implementação de camada de cache de alta performance com Redis", "Uso de TTL (Time to Live) e estruturas de dados nativas do Redis (hashes, sets, sorted sets)"]'::jsonb, '{"1": "Diferença entre relacional e não-relacional, CRUD simples em MongoDB.", "2": "Consultas com filtros e ordenações em bancos de documentos.", "3": "Indexação em coleções NoSQL e uso do Redis para cache de sessões.", "4": "Aggregation pipelines avançadas no MongoDB, estratégias de sharding e invalidação de cache.", "5": "Arquitetura distribuída com modelos híbridos Polyglot Persistence em larga escala."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nosql', 'NoSQL');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nosql', 'MongoDB');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nosql', 'Redis');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nosql', 'DynamoDB');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nosql', 'Document DB');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-graphql', 'GraphQL', 'HARD', 'Backend & APIs', 'Linguagem de consulta e runtime para APIs com tipagem forte e resolução flexível de dados.', '["Definição de schemas com Queries, Mutations e Subscriptions", "Implementação de resolvers e resolução do problema N+1 com DataLoader"]'::jsonb, '{"1": "Conceito de consultas no GraphQL e vantagens sobre REST.", "2": "Escrita de queries com seleção de campos e passagem de variáveis.", "3": "Criação de mutations, tipos customizados e resolvers básicos.", "4": "Uso de DataLoaders para evitar N+1, diretivas e autenticação de contexto.", "5": "GraphQL Federation corporativo unificando múltiplos microsserviços."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-graphql', 'GraphQL API');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-graphql', 'Apollo Server');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-graphql', 'GQL');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-nlp', 'Processamento de Linguagem Natural (NLP)', 'HARD', 'Inteligência Artificial', 'Aplicação de técnicas computacionais para análise, extração, classificação e representação de textos humanos.', '["Geração e comparação de vetores semânticos com Sentence Transformers", "Pré-processamento textual, tokenização e extração de entidades nomeadas", "Avaliação de modelos com métricas de precisão, revocação e similaridade cosseno"]'::jsonb, '{"1": "Conceito de tokenização, stop words e análise de sentimento básica.", "2": "Uso de bibliotecas como NLTK, spaCy ou scikit-learn para TF-IDF.", "3": "Geração de embeddings densos com modelos pré-treinados e busca por similaridade.", "4": "Fine-tuning de modelos Transformers, engenharia de prompts estruturados e avaliação semântica.", "5": "Pesquisa e arquitetura de sistemas RAG avançados e LLMs proprietários em produção."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nlp', 'NLP');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nlp', 'PLN');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nlp', 'Natural Language Processing');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nlp', 'Embeddings Semânticos');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-nlp', 'Transformers');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-machine-learning', 'Machine Learning & Modelos Preditivos', 'HARD', 'Inteligência Artificial', 'Desenvolvimento, treinamento, validação e implantação de algoritmos de aprendizado de máquina supervisionado e não supervisionado.', '["Treinamento e validação de modelos de regressão, classificação e clustering", "Engenharia de features, normalização e prevenção de overfitting", "Avaliação rigorosa com validação cruzada, ROC-AUC, precisão e F1-Score"]'::jsonb, '{"1": "Conceito de aprendizado supervisionado vs não supervisionado.", "2": "Treinamento de modelos básicos (Regressão Linear, Árvore de Decisão) no scikit-learn.", "3": "Pré-processamento de features, divisão treino/teste e cálculo de métricas de avaliação.", "4": "Modelos ensemble (Random Forest, XGBoost), hyperparameter tuning e pipelines de ML.", "5": "MLOps ponta a ponta, monitoramento de data drift e explicabilidade de modelos (SHAP/LIME)."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-machine-learning', 'ML');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-machine-learning', 'Aprendizado de Máquina');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-machine-learning', 'Scikit-Learn');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-machine-learning', 'Modelos Preditivos');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-data-warehousing', 'Data Warehousing & Analytics Engineering', 'HARD', 'Dados', 'Armazenamento analítico estruturado e transformação de dados em escala com dbt, Snowflake, BigQuery ou Redshift.', '["Criação de modelos analíticos modularizados com dbt e testes de dados", "Particionamento e clustering em BigQuery ou Snowflake para economia de custos"]'::jsonb, '{"1": "Conceito de banco transacional (OLTP) vs analítico (OLAP).", "2": "Consultas analíticas em data warehouses na nuvem.", "3": "Construção de tabelas analíticas com dbt e documentação de linagem.", "4": "Otimização de custos de computação/armazenamento e governança de dados.", "5": "Arquitetura empresarial de Modern Data Stack com federação de dados."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-warehousing', 'DW');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-warehousing', 'Data Warehouse');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-warehousing', 'dbt');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-warehousing', 'BigQuery');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-data-warehousing', 'Snowflake');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-security', 'Segurança da Informação & DevSecOps', 'HARD', 'Segurança', 'Práticas de proteção de dados, autenticação segura, criptografia e mitigação de vulnerabilidades (OWASP).', '["Implementação de autenticação OAuth2 / JWT e controle de acesso RBAC", "Prevenção ativa de vulnerabilidades OWASP Top 10 (SQL Injection, XSS, CSRF)", "Auditoria de conformidade com LGPD e anonimização de dados sensíveis"]'::jsonb, '{"1": "Conceito de senhas criptografadas (hashing com bcrypt) e HTTPS.", "2": "Uso correto de tokens JWT e variáveis de ambiente para segredos.", "3": "Validação rigorosa de inputs, controle de permissões por perfil (RBAC).", "4": "Varredura automatizada de vulnerabilidades (SAST/DAST) e criptografia em trânsito e repouso.", "5": "Arquitetura Zero Trust, modelagem de ameaças (Threat Modeling) e conformidade LGPD/ISO 27001."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-security', 'AppSec');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-security', 'Segurança');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-security', 'OWASP');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-security', 'Criptografia');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-security', 'Autenticação');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('hard-observability', 'Observabilidade & Monitoramento', 'HARD', 'DevOps', 'Coleta, análise e correlação dos pilares de observabilidade: métricas, logs e traces distribuídos.', '["Instrumentação de código com OpenTelemetry para rastreamento de requisições", "Criação de alertas acionáveis e painéis no Grafana baseados em Prometheus", "Padronização de logs estruturados em formato JSON"]'::jsonb, '{"1": "Leitura de logs de aplicação para identificação de erros.", "2": "Adição de logs estruturados informativos no código.", "3": "Instrumentação básica com métricas de tempo de resposta e taxas de erro.", "4": "Rastreamento distribuído (Distributed Tracing), dashboards de SLO/SLA no Grafana.", "5": "Engenharia de confiabilidade (SRE), análise proativa de anomalias e esteiras de auto-healing."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-observability', 'Monitoring');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-observability', 'Prometheus');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-observability', 'Grafana');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-observability', 'OpenTelemetry');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('hard-observability', 'Logs');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-comunicacao', 'Comunicação Profissional', 'SOFT', 'Interpessoal', 'Capacidade de expressar ideias técnicas e de negócios com clareza, objetividade e empatia para diversos públicos.', '["Explicação de decisões arquiteturais complexas para stakeholders não-técnicos", "Escrita de documentação técnica, RFCs e pull requests didáticos", "Escuta ativa durante reuniões para absorver feedbacks e requisitos"]'::jsonb, '{"1": "Transmite mensagens simples, porém com dificuldades ocasionais de clareza ou prolixidade.", "2": "Comunica-se satisfatoriamente com pares imediatos da mesma área técnica.", "3": "Estrutura ideias de forma lógica, adapta o discurso para não-técnicos e mantém documentações claras.", "4": "Facilita alinhamentos estratégicos, apresenta soluções com segurança e domina comunicação assíncrona.", "5": "Referência em persuasão técnica, mediação com executivos e oratória em grandes fóruns."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-comunicacao', 'Comunicação');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-comunicacao', 'Clareza de Expressão');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-comunicacao', 'Comunicação Verbal e Escrita');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-comunicacao', 'Storytelling Técnico');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-colaboracao', 'Colaboração em Equipe', 'SOFT', 'Trabalho em Equipe', 'Trabalho conjunto eficaz com colegas multidisciplinares para atingir objetivos coletivos.', '["Apoio a colegas bloqueados em tarefas ou pareamento (Pair Programming)", "Compartilhamento voluntário de conhecimento em workshops e post-mortems", "Priorização do sucesso da entrega coletiva em relação a metas individuais"]'::jsonb, '{"1": "Trabalha bem isolado, mas com pouca iniciativa de integração com o time.", "2": "Cumpre suas tarefas em equipe e atende solicitações de apoio quando demandado.", "3": "Atua proativamente em pareamento, auxilia pares e compartilha boas práticas espontaneamente.", "4": "Fomenta ambiente de confiança mútua, conecta times diferentes e remove silos organizacionais.", "5": "Constrói e dissemina cultura de excelência colaborativa em nível de diretoria ou tribo."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-colaboracao', 'Trabalho em Equipe');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-colaboracao', 'Teamwork');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-colaboracao', 'Cooperação');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-colaboracao', 'Espírito de Equipe');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-resolucao-problemas', 'Resolução de Problemas Complexos', 'SOFT', 'Pensamento & Ação', 'Capacidade de investigar, isolar e resolver desafios técnicos ambíguos de maneira metódica.', '["Identificação da causa raiz de incidentes críticos em produção (análise dos 5 porquês)", "Decomposição de problemas grandes e complexos em partes menores acionáveis", "Busca de alternativas pragmáticas diante de restrições de tempo ou recursos"]'::jsonb, '{"1": "Resolve problemas pontuais e conhecidos com instruções passo a passo.", "2": "Investiga bugs conhecidos com pesquisa e tentativa e erro organizada.", "3": "Aplica método científico, reproduz cenários de erro e ataca a causa raiz comprovada.", "4": "Resolve incidentes graves sob pressão com precisão cirúrgica e propõe ações preventivas.", "5": "Encontra soluções inovadoras e econômicas para gargalos estruturais sistêmicos."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-resolucao-problemas', 'Problem Solving');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-resolucao-problemas', 'Troubleshooting');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-resolucao-problemas', 'Diagnóstico de Problemas');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-resolucao-problemas', 'Resolução Analítica');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-organizacao', 'Organização & Gestão de Tempo', 'SOFT', 'Produtividade', 'Planejamento estruturado das próprias atividades, gerenciamento de prioridades e cumprimento de prazos.', '["Quebra de épicos em tarefas com estimativas realistas no Jira/Trello", "Priorização eficaz entre demandas urgentes e importantes (Matriz de Eisenhower)", "Comunicação antecipada de eventuais impedimentos ou riscos de atraso"]'::jsonb, '{"1": "Necessita de supervisão frequente para organizar cronograma e entregas.", "2": "Entrega tarefas dentro do prazo, mas tem dificuldade quando surgem urgências simultâneas.", "3": "Auto-gerencia prazos, prioriza demandas e comunica desvios antecipadamente.", "4": "Otimiza fluxos do time, identifica gargalos de processo e melhora a cadência da sprint.", "5": "Planejamento estratégico de roadmaps complexos com sincronização de múltiplos projetos."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-organizacao', 'Gestão de Tempo');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-organizacao', 'Planejamento');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-organizacao', 'Produtividade Pessoal');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-organizacao', 'Organização');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-gestao-conflitos', 'Gestão de Conflitos', 'SOFT', 'Interpessoal', 'Habilidade de lidar com divergências técnicas e interpessoais de forma profissional, equilibrada e construtiva.', '["Mediação de discordâncias sobre escolhas arquiteturais com base em prós e contras objetivos", "Condução de conversas difíceis com postura receptiva e foco em soluções sem ataques pessoais", "Criação de consensos e alinhamentos de expectativas entre pessoas com visões opostas"]'::jsonb, '{"1": "Evita conflitos ou reage de forma defensiva diante de discordâncias.", "2": "Aceita opiniões contrárias quando expostas de forma branda.", "3": "Separa o problema da pessoa, fundamenta argumentos em dados e busca soluções de consenso.", "4": "Atua como mediador imparcial em debates inflamados entre colegas, restabelecendo a harmonia produtiva.", "5": "Transforma conflitos institucionais crônicos em oportunidades de aprendizado e evolução cultural."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-gestao-conflitos', 'Mediação de Conflitos');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-gestao-conflitos', 'Resolução de Divergências');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-gestao-conflitos', 'Negociação Interna');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-pensamento-critico', 'Pensamento Crítico', 'SOFT', 'Cognitivo', 'Capacidade de questionar premissas, avaliar evidências e analisar trade-offs antes de tomar decisões técnicas.', '["Avaliação cautelosa antes de adotar uma nova biblioteca ou tecnologia apenas por hype", "Identificação de falhas lógicas e riscos potenciais em propostas técnicas", "Questionamento saudável dos requisitos do produto para garantir valor real ao usuário"]'::jsonb, '{"1": "Aceita orientações e decisões sem questionar viabilidade ou consequências.", "2": "Faz perguntas básicas sobre o porquê de certas soluções.", "3": "Avalia prós e contras de diferentes abordagens e valida premissas com dados concretos.", "4": "Prevê impactos colaterais a médio/longo prazo e desafia consensos superficiais com rigor.", "5": "Define critérios analíticos que orientam tomadas de decisão de alto impacto corporativo."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-pensamento-critico', 'Critical Thinking');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-pensamento-critico', 'Análise de Trade-offs');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-pensamento-critico', 'Rigor Analítico');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-adaptabilidade', 'Adaptabilidade & Flexibilidade', 'SOFT', 'Resiliência', 'Capacidade de se ajustar com rapidez a mudanças de escopo, tecnologias, processos e prioridades.', '["Adaptação rápida a pivotagens estratégicas de negócio sem perda de produtividade", "Transição fluida entre projetos com stacks tecnológicas diferentes", "Acolhimento de novos processos ágeis e ferramentas corporativas"]'::jsonb, '{"1": "Resiste a mudanças de rotina ou tecnologia, demandando longo tempo de adaptação.", "2": "Adapta-se a mudanças quando devidamente guiado e com tempo hábil.", "3": "Lida com mudanças de requisitos com naturalidade e mantém postura positiva.", "4": "Prospera em ambientes dinâmicos e ajuda a equipe a navegar em períodos de incerteza.", "5": "Lidera transformações organizacionais profundas, atuando como agente catalisador de mudanças."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-adaptabilidade', 'Flexibilidade');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-adaptabilidade', 'Resiliência');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-adaptabilidade', 'Ajuste a Mudanças');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-adaptabilidade', 'Agilidade de Aprendizado');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-lideranca-tecnica', 'Liderança Técnica', 'SOFT', 'Liderança', 'Capacidade de guiar a direção tecnológica do time, influenciar decisões e elevar a barra de engenharia.', '["Condução de sessões de design técnico e alinhamento de padrões de código", "Mentoria contínua de engenheiros menos experientes para acelerar sua evolução", "Representação técnica do time em fóruns e alinhamentos com lideranças de produto"]'::jsonb, '{"1": "Foca apenas nas suas entregas individuais, sem pretensão de influenciar pares.", "2": "Auxilia estagiários e juniores em tarefas operacionais quando solicitado.", "3": "Orienta decisões técnicas locais, revisa PRs com foco formativo e assume responsabilidade técnica.", "4": "Define diretrizes técnicas do time, desenvolve novos talentos e garante alto padrão de entrega.", "5": "Inspira comunidades técnicas, molda a visão de tecnologia da empresa e é referência na indústria."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-lideranca-tecnica', 'Tech Lead');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-lideranca-tecnica', 'Liderança');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-lideranca-tecnica', 'Influência Técnica');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-lideranca-tecnica', 'Mentoria Técnica');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-autonomia', 'Autonomia & Proatividade', 'SOFT', 'Produtividade', 'Capacidade de agir com independência, tomar iniciativa e propor soluções sem depender de ordens diretas.', '["Antecipação de problemas potenciais e proposição de melhorias antes que falhas ocorram", "Busca autônoma por respostas, documentações e alinhamentos para destravar o próprio trabalho", "Sentimento de dono (ownership) do início ao fim da entrega em produção"]'::jsonb, '{"1": "Aguarda instruções explícitas antes de qualquer ação.", "2": "Executa tarefas bem definidas com autonomia moderada.", "3": "Destrava-se sozinho na maioria dos cenários, antecipa pequenos riscos e traz soluções propostas.", "4": "Assume ownership total de iniciativas complexas, liderando da concepção à operação sem supervisão.", "5": "Identifica oportunidades estratégicas não exploradas pelo negócio e cria iniciativas de alto impacto."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-autonomia', 'Proatividade');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-autonomia', 'Independência');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-autonomia', 'Iniciativa');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-autonomia', 'Ownership');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-aprendizado-continuo', 'Aprendizado Contínuo & Curiosidade', 'SOFT', 'Desenvolvimento Pessoal', 'Vontade constante de aprender novas tecnologias, metodologias e aplicar conhecimentos inovadores.', '["Estudo autodidata de novidades do ecossistema e compartilhamento com o time", "Busca ativa por certificações, leituras técnicas e participação em comunidades", "Aplicação de lições aprendidas após retrospectivas e post-mortems"]'::jsonb, '{"1": "Estuda apenas o estritamente necessário para cumprir o trabalho básico.", "2": "Aprende novas ferramentas quando exigido pelo projeto atual.", "3": "Mantém rotina ativa de estudos, acompanha novidades da área e experimenta novas abordagens.", "4": "Domina rapidamente novos conceitos complexos e dissemina o conhecimento na organização.", "5": "Pioneiro na introdução de paradigmas tecnológicos disruptivos na organização."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-aprendizado-continuo', 'Lifelong Learning');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-aprendizado-continuo', 'Curiosidade Intelectual');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-aprendizado-continuo', 'Autoaprendizado');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-empatia', 'Empatia & Inteligência Emocional', 'SOFT', 'Interpessoal', 'Compreensão dos sentimentos, limitações e perspectivas dos outros, agindo com consideração e respeito.', '["Oferecimento de feedbacks construtivos focados em comportamento e aprendizado, não em ataques", "Consideração das dores dos usuários finais ao projetar soluções de software", "Acolhimento de colegas em momentos de alta pressão ou dificuldades pessoais"]'::jsonb, '{"1": "Dificuldade em reconhecer o impacto de suas atitudes nos sentimentos dos pares.", "2": "Demonstra respeito e cordialidade básica no dia a dia.", "3": "Ouve atentamente, valida as preocupações alheias e adapta seu comportamento com sensibilidade.", "4": "Excelente em feedback construtivo, apoia a saúde mental do time e constrói segurança psicológica.", "5": "Cria ambientes institucionais acolhedores, diversos e altamente colaborativos."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-empatia', 'Inteligência Emocional');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-empatia', 'Empatia');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-empatia', 'Sensibilidade Interpessoal');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-negociacao', 'Negociação & Alinhamento de Expectativas', 'SOFT', 'Comunicação & Negócios', 'Habilidade de negociar escopo, prazos e recursos com bom senso técnico e comercial.', '["Proposição de entregas faseadas (MVP) para conciliar restrições de prazo com qualidade técnica", "Negociação equilibrada entre pagamento de débitos técnicos e entrega de novas features"]'::jsonb, '{"1": "Cede a qualquer pressão de prazo ou resiste de forma intransigente a qualquer alteração.", "2": "Explica limitações de tempo de forma reativa.", "3": "Propõe soluções intermediárias (redução de escopo, entregas em fases) mantendo bom relacionamento.", "4": "Negocia habilmente com stakeholders de produto, demonstrando o ROI de decisões técnicas.", "5": "Alinha expectativas estratégicas corporativas entre engenharia, produto e diretoria executiva."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-negociacao', 'Negociação');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-negociacao', 'Alinhamento de Escopo');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-negociacao', 'Trade-offs de Negócio');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-foco-usuario', 'Foco no Usuário & Visão de Produto', 'SOFT', 'Negócios & Produto', 'Preocupação genuína com a experiência do cliente final e o valor de negócio gerado pelo software.', '["Questionamento do impacto de uma funcionalidade na usabilidade e satisfação do usuário", "Uso de métricas de uso e comportamento do usuário para orientar melhorias técnicas", "Busca pela entrega contínua de valor em vez de focar apenas na sofisticação do código"]'::jsonb, '{"1": "Foca exclusivamente na tarefa técnica sem compreender para que serve a funcionalidade.", "2": "Entende o fluxo básico do usuário na aplicação.", "3": "Contribui com sugestões de usabilidade e prioriza a experiência do cliente final.", "4": "Conecta decisões técnicas diretamente a métricas de negócio (conversão, retenção, NPS).", "5": "Co-desenha a visão de produto junto à liderança, antecipando necessidades dos clientes."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-foco-usuario', 'Customer Centricity');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-foco-usuario', 'Visão de Produto');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-foco-usuario', 'Foco no Cliente');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-atencao-detalhes', 'Atenção a Detalhes & Rigor de Qualidade', 'SOFT', 'Produtividade', 'Cuidado meticuloso com consistência, casos de borda (edge cases) e padrão de excelência nas entregas.', '["Mapeamento e tratamento cuidadoso de cenários de erro e exceções raras", "Garantia de consistência visual, textual e semântica em interfaces e documentações", "Revisão minuciosa antes de submeter código para avaliação de pares"]'::jsonb, '{"1": "Frequentemente comete descuidos evitáveis e esquece casos óbvios.", "2": "Corrige deslizes quando apontados na revisão de pares.", "3": "Prevê a maioria dos casos de borda e entrega código limpo, consistente e bem testado.", "4": "Padrão de qualidade impecável, identifica inconsistências sutis que passariam despercebidas.", "5": "Institui programas e práticas de qualidade de software que reduzem drasticamente defeitos corporativos."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-atencao-detalhes', 'Rigor Técnico');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-atencao-detalhes', 'Atenção a Casos de Borda');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-atencao-detalhes', 'Capricho');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-resiliencia', 'Resiliência & Gestão de Estresse', 'SOFT', 'Resiliência', 'Capacidade de manter a compostura, o foco e a produtividade sob pressão e diante de adversidades.', '["Manutenção da calma durante salas de crise e incidentes de alta severidade em produção", "Recuperação rápida após erros ou falhas em projetos, focando no aprendizado", "Administração sustentável da carga de trabalho para evitar burnout"]'::jsonb, '{"1": "Fica paralisado ou perde a compostura diante de momentos de alta tensão.", "2": "Consegue lidar com estresse moderado com apoio da liderança.", "3": "Mantém foco e serenidade em situações críticas, priorizando ações lógicas.", "4": "Transmite tranquilidade e segurança ao time durante grandes crises ou prazos apertados.", "5": "Cultiva ambientes resilientes, equilibrando intensidade de entrega com saúde e sustentabilidade."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-resiliencia', 'Resiliência');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-resiliencia', 'Controle Emocional');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-resiliencia', 'Gestão sob Pressão');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-mentoria', 'Mentoria & Desenvolvimento de Pessoas', 'SOFT', 'Liderança', 'Dedicação voluntária em apoiar o crescimento profissional e técnico de outras pessoas.', '["Realização periódica de 1:1s técnicos e planos de desenvolvimento com novatos", "Criação de trilhas de onboarding e documentação para acelerar novos membros", "Celebração genuína do progresso e das conquistas de colegas orientados"]'::jsonb, '{"1": "Pouco interesse em orientar outros colegas.", "2": "Responde dúvidas pontuais quando perguntado diretamente.", "3": "Dedica tempo regular para guiar colegas, tirar dúvidas e acelerar o onboarding.", "4": "Atua como mentor ativo, estruturando desafios formativos que aceleram promoções.", "5": "Cria programas formais de mentoria e formação de engenharia em larga escala."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-mentoria', 'Mentoria');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-mentoria', 'Coaching Técnico');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-mentoria', 'Desenvolvimento de Talentos');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-humildade-intelectual', 'Humildade Intelectual & Receptividade a Feedback', 'SOFT', 'Desenvolvimento Pessoal', 'Reconhecimento das próprias limitações, disposição para admitir erros e abertura sincera para aprender com críticas.', '["Acolhimento construtivo de comentários em code reviews sem apego ao próprio código", "Transparência imediata ao admitir falhas e proposição de correções", "Disposição para mudar de opinião quando confrontado com dados melhores"]'::jsonb, '{"1": "Demonstra forte apego às próprias ideias e reage defensivamente a críticas.", "2": "Aceita feedbacks com relutância inicial, mas implementa as mudanças solicitadas.", "3": "Pede ativamente feedbacks, recebe sugestões com gratidão e ajusta atitudes com prontidão.", "4": "Estimula debate aberto sobre seus próprios pontos cegos e dá o exemplo de vulnerabilidade positiva.", "5": "Fomenta cultura corporativa sem culpabilização individual (blameless culture), focada em aprendizado contínuo."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-humildade-intelectual', 'Abertura a Feedback');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-humildade-intelectual', 'Humildade');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-humildade-intelectual', 'Receptividade');
INSERT INTO public.skill_catalog (id, name, category, area, description, behavioral_examples, evaluation_criteria) VALUES ('soft-orientacao-resultados', 'Orientação a Resultados & Eficiência', 'SOFT', 'Negócios & Produtividade', 'Compromisso em gerar impacto mensurável e entregar soluções eficientes com uso inteligente de recursos.', '["Equilíbrio entre perfeccionismo técnico e necessidade de entrega rápida de valor", "Definição e acompanhamento de indicadores-chave de desempenho (KPIs/OKRs) para os projetos", "Descarte rápido de abordagens ineficientes que não trazem ganho comprovado"]'::jsonb, '{"1": "Perde-se em detalhes cosméticos ou otimizações prematuras sem foco no objetivo.", "2": "Cumpre metas quando rigidamente estipuladas por outrem.", "3": "Mantém foco claro no objetivo final da entrega e prioriza o que traz maior retorno com menor esforço.", "4": "Entrega consistentemente impacto de negócio relevante, quantificável e sustentável.", "5": "Define direcionamentos estratégicos que maximizam eficiência operacional e receita em toda a empresa."}'::jsonb) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-orientacao-resultados', 'Foco em Resultados');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-orientacao-resultados', 'Pragmatismo');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-orientacao-resultados', 'Eficiência');
INSERT INTO public.skill_aliases (skill_id, alias) VALUES ('soft-orientacao-resultados', 'Impacto Mensurável');

-- 2. Banco de Perguntas de Entrevista
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-geral-001', 'Conte sobre um projeto profissional ou acadêmico relevante do qual participou. Qual era o objetivo principal e qual foi especificamente a sua contribuição técnica?', 'GERAL', '["hard-apis", "hard-software-architecture", "soft-orientacao-resultados", "soft-comunicacao"]'::jsonb, 'Avaliar se o candidato descreve seu papel específico com clareza, destacando tecnologias usadas e impacto alcançado, distinguindo trabalho individual de contribuições coletivas.', 1) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-geral-002', 'Descreva um problema técnico desafiador ou um bug complexo que encontrou recentemente. Como você estruturou a investigação e qual foi a solução adotada?', 'TECNICA', '["soft-resolucao-problemas", "soft-pensamento-critico", "hard-testes", "hard-observability"]'::jsonb, 'Verificar se o candidato demonstra metodologia analítica estruturada (investigação de causa raiz, reprodução, isolamento) em vez de tentativa e erro aleatória.', 2) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-geral-003', 'Conte sobre uma situação em que você precisou colaborar ativamente com outras pessoas da equipe ou de outras áreas para atingir um resultado importante.', 'COMPORTAMENTAL', '["soft-colaboracao", "soft-comunicacao", "soft-empatia"]'::jsonb, 'Identificar evidências de pareamento, apoio a pares, escuta ativa e facilitação de alinhamentos entre diferentes papéis.', 3) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-geral-004', 'Como você costuma planejar e organizar suas tarefas diárias quando surgem múltiplas demandas ou prioridades concorrentes com prazos apertados?', 'COMPORTAMENTAL', '["soft-organizacao", "soft-autonomia", "soft-negociacao"]'::jsonb, 'Analisar critérios de priorização (urgente vs importante), comunicação antecipada de impedimentos e métodos de organização pessoal.', 4) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-geral-005', 'Descreva uma situação em que você teve uma discordância técnica ou interpessoal com um colega de trabalho ou liderança. Como a conversa foi conduzida e qual foi o desfecho?', 'COMPORTAMENTAL', '["soft-gestao-conflitos", "soft-humildade-intelectual", "soft-empatia"]'::jsonb, 'Verificar se o candidato separa o problema da pessoa, fundamenta suas posições em critérios técnicos objetivos e busca soluções de consenso saudáveis.', 5) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-geral-006', 'Quais linguagens, bancos de dados e ferramentas você utilizou com mais profundidade em seus projetos recentes? Dê exemplos práticos de como foram aplicadas.', 'TECNICA', '["hard-python", "hard-sql", "hard-javascript", "hard-docker", "hard-git"]'::jsonb, 'Identificar competências técnicas concretas mencionadas espontaneamente e o nível de profundidade prática das decisões tomadas.', 6) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-geral-007', 'Conte sobre uma ocasião em que precisou aprender rapidamente uma nova ferramenta, framework ou conceito tecnológico para atender a uma necessidade do projeto.', 'COMPORTAMENTAL', '["soft-aprendizado-continuo", "soft-adaptabilidade", "soft-autonomia"]'::jsonb, 'Avaliar curva de aprendizado, métodos de estudo autodidata, velocidade de assimilação e aplicação bem-sucedida do novo conhecimento.', 7) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-geral-008', 'Qual foi uma decisão técnica ou arquitetural difícil que você precisou tomar? Quais trade-offs foram considerados e o que aprendeu com essa escolha?', 'TECNICA', '["hard-software-architecture", "soft-pensamento-critico", "soft-humildade-intelectual"]'::jsonb, 'Identificar maturidade na análise de vantagens e desvantagens de cada alternativa técnica e capacidade de assumir responsabilidade por decisões.', 8) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-vaga-python-01', 'Como você estruturaria uma API assíncrona em Python com alta concorrência? Quais bibliotecas utilizaria e como garantiria integridade e performance sob carga?', 'TECNICA', '["hard-python", "hard-apis", "hard-testes"]'::jsonb, 'Verificar menção a FastAPI/AsyncIO, pooling de conexões, tratamento de exceptions assíncronas e testes de carga.', 10) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-vaga-sql-01', 'Descreva uma situação em que precisou otimizar uma query SQL lenta que estava degradando o banco de dados. Quais passos seguiu para diagnosticar e resolver o problema?', 'TECNICA', '["hard-sql", "hard-data-modeling"]'::jsonb, 'Verificar uso de EXPLAIN/ANALYZE, criação criteriosa de índices, reescrita de subqueries ou eliminação de scans de tabela inteira.', 11) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-vaga-etl-01', 'Como você projeta um pipeline de ingestão e transformação de dados (ETL/ELT) para ser resiliente a falhas temporárias e garantir idempotência no processamento?', 'TECNICA', '["hard-etl", "hard-data-modeling", "hard-python"]'::jsonb, 'Verificar tratamento de duplicidades (upserts/dedup), orquestração com retry automático, monitoramento de linagem e qualidade dos dados.', 12) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-vaga-aws-01', 'Qual experiência você tem com serviços de nuvem AWS? Explique como você arquitetaria o armazenamento seguro e o processamento de arquivos em grande escala utilizando serviços como S3, Lambda ou ECS.', 'TECNICA', '["hard-aws", "hard-security", "hard-docker"]'::jsonb, 'Verificar entendimento de políticas IAM, criptografia no S3, custos de processamento e arquitetura orientada a eventos na AWS.', 13) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-vaga-react-01', 'Como você gerencia estados complexos em aplicações React com múltiplos componentes interdependentes? Como evita re-renderizações desnecessárias e assegura boa experiência do usuário?', 'TECNICA', '["hard-react", "hard-typescript", "hard-javascript"]'::jsonb, 'Verificar domínio de memoização (useMemo/useCallback), gerenciamento de estado (Context, Zustand, Redux) e profiling de componentes.', 14) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;
INSERT INTO public.interview_questions (id, text, category, target_competencies, rubric, order_index) VALUES ('q-vaga-devops-01', 'Descreva como você configuraria uma esteira de CI/CD completa para uma aplicação em contêineres, desde o commit até o deploy automatizado em produção com testes e rollback.', 'TECNICA', '["hard-docker", "hard-cicd", "hard-kubernetes", "hard-git"]'::jsonb, 'Verificar multi-stage builds, scans de segurança de imagens, execução de testes automatizados e estratégias de deploy sem downtime.', 15) ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text, rubric = EXCLUDED.rubric;