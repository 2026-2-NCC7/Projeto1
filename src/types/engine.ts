// TypeScript interfaces matching backend models and Pydantic schemas

export interface SkillAlias {
  id: number;
  skill_id: string;
  alias: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'HARD' | 'SOFT';
  area?: string;
  description: string;
  behavioral_examples?: string[];
  evaluation_criteria?: Record<string, string>;
  aliases?: SkillAlias[];
}

export interface CandidateDeclaredSkill {
  id?: number;
  skill_id: string;
  skill_name?: string;
  skill_category?: string;
  declared_level: number;
  notes?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  tech_area: string;
  declared_seniority: string;
  years_of_experience: number;
  contract_preference: string;
  work_model_preference: string;
  salary_expectation?: number;
  bio_summary?: string;
  created_at: string;
  declared_skills: CandidateDeclaredSkill[];
}

export interface InterviewQuestion {
  id: string;
  text: string;
  category: string;
  target_competencies?: string[];
  rubric?: string;
  order_index: number;
}

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export interface Transcript {
  id: string;
  model_name: string;
  raw_transcript: string;
  segments?: TranscriptSegment[];
  language: string;
  created_at: string;
}

export interface InterviewAnswer {
  id: string;
  session_id: string;
  question_id: string;
  input_type: 'AUDIO' | 'TEXT';
  audio_file_path?: string;
  audio_duration_seconds?: number;
  raw_text?: string;
  edited_text?: string;
  status: string;
  created_at: string;
  transcripts?: Transcript[];
}

export interface InterviewSession {
  id: string;
  candidate_id: string;
  job_id?: string;
  interview_type: string;
  status: string;
  created_at: string;
  completed_at?: string;
  answers: InterviewAnswer[];
}

export interface CompetencyEvidence {
  id: string;
  assessment_id: string;
  answer_id?: string;
  exact_quote: string;
  explanation?: string;
  paraphrase?: string;
  created_at: string;
}

export interface CompetencyAssessment {
  id: string;
  skill_id: string;
  skill_name?: string;
  skill_category?: string;
  declared: boolean;
  declared_level?: number;
  evidence_status: 'EVIDENCIADA' | 'PARCIALMENTE_EVIDENCIADA' | 'EVIDENCIA_INSUFICIENTE' | 'NAO_AVALIADA' | 'DIVERGENCIA_IDENTIFICADA';
  estimated_level?: number;
  explanation: string;
  requires_review: boolean;
  is_suggested: boolean;
  evidences: CompetencyEvidence[];
}

export interface ReportReview {
  id: string;
  report_id: string;
  version_id: string;
  candidate_id: string;
  skill_id?: string;
  replica_text: string;
  status: string;
  resolution_notes?: string;
  created_at: string;
}

export interface ReportVersion {
  id: string;
  report_id: string;
  version_number: number;
  status: string;
  summary?: string;
  created_at: string;
  assessments: CompetencyAssessment[];
  reviews: ReportReview[];
}

export interface AssessmentReport {
  id: string;
  candidate_id: string;
  candidate_name?: string;
  interview_id: string;
  status: string;
  active_version_number: number;
  model_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  active_version?: ReportVersion;
  versions: ReportVersion[];
}

export interface JobSkillRequirement {
  id?: number;
  job_id?: string;
  skill_id: string;
  skill_name?: string;
  skill_category?: string;
  is_mandatory: boolean;
  min_level: number;
  weight: number;
}

export interface Job {
  id: string;
  company_id: string;
  company_name?: string;
  title: string;
  description: string;
  tech_vertical: string;
  seniority: string;
  contract_type: string;
  work_model: string;
  min_salary?: number;
  max_salary?: number;
  min_experience_years: number;
  status: string;
  created_at: string;
  skill_requirements: JobSkillRequirement[];
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  description?: string;
}

export interface MatchedSkillDetail {
  skill_id: string;
  skill_name: string;
  category: 'HARD' | 'SOFT';
  is_mandatory: boolean;
  required_level: number;
  weight: number;
  candidate_declared_level?: number;
  candidate_evidence_status: string;
  candidate_estimated_level?: number;
  alignment_status: 'ATENDIDO' | 'PARCIALMENTE_ATENDIDO' | 'NAO_ATENDIDO' | 'PENDENTE_AVALIACAO';
  score_contribution: number;
  gap_notes?: string;
}

export interface CandidateMatchingResult {
  id: string;
  job_id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_seniority: string;
  candidate_experience_years: number;
  report_version_id?: string;
  overall_score: number;
  hard_skills_score: number;
  soft_skills_score: number;
  experience_score: number;
  conditions_score: number;
  evaluation_coverage: number;
  is_objectively_incompatible: boolean;
  incompatibility_reasons: string[];
  matched_skills: MatchedSkillDetail[];
  partial_skills: MatchedSkillDetail[];
  missing_skills: MatchedSkillDetail[];
  pending_skills: MatchedSkillDetail[];
  textual_justification: string;
  algorithm_version: string;
  evaluated_at: string;
}

export interface JobMatchingRanking {
  job_id: string;
  job_title: string;
  company_name: string;
  algorithm_weights: Record<string, number>;
  total_candidates_evaluated: number;
  ranking: CandidateMatchingResult[];
}

export interface CandidateComparisonItem {
  candidate: CandidateMatchingResult;
  competency_matrix: Record<string, MatchedSkillDetail>;
}

export interface CandidateComparisonResponse {
  job_id: string;
  job_title: string;
  required_skills: {
    skill_id: string;
    skill_name: string;
    category: string;
    is_mandatory: boolean;
    min_level: number;
    weight: number;
  }[];
  candidates: CandidateComparisonItem[];
  comparison_summary: string;
}

export interface ModelStatus {
  name: string;
  role: string;
  target_engine: string;
  available: boolean;
  device: string;
  details?: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
  database_connected: boolean;
  models: ModelStatus[];
}

export interface AuditEvent {
  id: string;
  event_type: string;
  entity_name: string;
  entity_id: string;
  model_version?: string;
  payload?: any;
  created_at: string;
}
