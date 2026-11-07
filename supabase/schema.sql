-- ==============================================================================
-- Q.I. TECH - SCHEMA COMPLETO SUPABASE (POSTGRESQL + RLS + TRIGGERS + SEEDS)
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
-- 11. COMUNIDADE E GAMIFICAÇÃO (ESTALECAS)
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

-- 13.8. COMUNIDADE E ESTALECAS
CREATE POLICY "Posts da comunidade visíveis para todos" ON public.community_posts
    FOR SELECT USING (true);

CREATE POLICY "Usuário publica seus próprios posts" ON public.community_posts
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

CREATE POLICY "Usuário consulta seu extrato de Estalecas" ON public.reward_transactions
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
