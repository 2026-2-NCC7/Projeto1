from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class MatchedSkillDetail(BaseModel):
    skill_id: str
    skill_name: str
    category: str # "HARD" or "SOFT"
    is_mandatory: bool
    required_level: int
    weight: float
    candidate_declared_level: Optional[int] = None
    candidate_evidence_status: str # "EVIDENCIADA", "PARCIALMENTE_EVIDENCIADA", "EVIDENCIA_INSUFICIENTE", "NAO_AVALIADA", "DIVERGENCIA_IDENTIFICADA", "NAO_DECLARADA"
    candidate_estimated_level: Optional[int] = None
    alignment_status: str # "ATENDIDO", "PARCIALMENTE_ATENDIDO", "NAO_ATENDIDO", "PENDENTE_AVALIACAO"
    score_contribution: float
    gap_notes: Optional[str] = None

class CandidateMatchingResponse(BaseModel):
    id: str
    job_id: str
    candidate_id: str
    candidate_name: str
    candidate_seniority: str
    candidate_experience_years: float
    report_version_id: Optional[str] = None
    overall_score: float = Field(ge=0.0, le=100.0)
    hard_skills_score: float = Field(ge=0.0, le=100.0)
    soft_skills_score: float = Field(ge=0.0, le=100.0)
    experience_score: float = Field(ge=0.0, le=100.0)
    conditions_score: float = Field(ge=0.0, le=100.0)
    evaluation_coverage: float = Field(ge=0.0, le=100.0)
    is_objectively_incompatible: bool = False
    incompatibility_reasons: List[str] = []
    matched_skills: List[MatchedSkillDetail] = []
    partial_skills: List[MatchedSkillDetail] = []
    missing_skills: List[MatchedSkillDetail] = []
    pending_skills: List[MatchedSkillDetail] = []
    textual_justification: str
    algorithm_version: str
    evaluated_at: datetime

    class Config:
        from_attributes = True

class JobMatchingRankingResponse(BaseModel):
    job_id: str
    job_title: str
    company_name: str
    algorithm_weights: Dict[str, float]
    total_candidates_evaluated: int
    ranking: List[CandidateMatchingResponse] = []

class CandidateComparisonRequest(BaseModel):
    job_id: str
    candidate_ids: List[str] = Field(min_length=2, max_length=5)

class CandidateComparisonItem(BaseModel):
    candidate: CandidateMatchingResponse
    competency_matrix: Dict[str, MatchedSkillDetail] # keyed by skill_id

class CandidateComparisonResponse(BaseModel):
    job_id: str
    job_title: str
    required_skills: List[dict]
    candidates: List[CandidateComparisonItem] = []
    comparison_summary: str
