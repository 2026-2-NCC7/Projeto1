from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

# Schema for Evidence Extraction from Model
class ExtractedEvidenceItem(BaseModel):
    question_id: str
    answer_id: Optional[str] = None
    exact_quote: str = Field(description="Exact substring quoted from candidate transcript")
    paraphrase: Optional[str] = None
    explanation: Optional[str] = None

class ExtractedCompetencyItem(BaseModel):
    skill_id: str
    skill_name: str
    evidence_status: str = Field(
        description="'EVIDENCIADA', 'PARCIALMENTE_EVIDENCIADA', 'EVIDENCIA_INSUFICIENTE', 'NAO_AVALIADA', or 'DIVERGENCIA_IDENTIFICADA'"
    )
    estimated_level: Optional[int] = Field(default=None, ge=1, le=5, description="Level 1 to 5, or null if insufficient evidence")
    evidence: List[ExtractedEvidenceItem] = []
    explanation: str
    requires_review: bool = False
    is_suggested: bool = False

class LLMExtractionResult(BaseModel):
    candidate_id: str
    interview_id: str
    competencies: List[ExtractedCompetencyItem] = []
    overall_summary: Optional[str] = None

# API Response Schemas
class CompetencyEvidenceResponse(BaseModel):
    id: str
    assessment_id: str
    answer_id: Optional[str] = None
    exact_quote: str
    explanation: Optional[str] = None
    paraphrase: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CompetencyAssessmentResponse(BaseModel):
    id: str
    skill_id: str
    skill_name: Optional[str] = None
    skill_category: Optional[str] = None
    declared: bool
    declared_level: Optional[int] = None
    evidence_status: str
    estimated_level: Optional[int] = None
    explanation: str
    requires_review: bool
    is_suggested: bool
    evidences: List[CompetencyEvidenceResponse] = []

    class Config:
        from_attributes = True

class ReportReviewResponse(BaseModel):
    id: str
    report_id: str
    version_id: str
    candidate_id: str
    skill_id: Optional[str] = None
    skill_name: Optional[str] = None
    replica_text: str
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ReportVersionResponse(BaseModel):
    id: str
    report_id: str
    version_number: int
    status: str
    summary: Optional[str] = None
    created_at: datetime
    assessments: List[CompetencyAssessmentResponse] = []
    reviews: List[ReportReviewResponse] = []

    class Config:
        from_attributes = True

class AssessmentReportResponse(BaseModel):
    id: str
    candidate_id: str
    candidate_name: Optional[str] = None
    interview_id: str
    status: str
    active_version_number: int
    model_metadata: Optional[dict] = None
    created_at: datetime
    updated_at: datetime
    active_version: Optional[ReportVersionResponse] = None
    versions: List[ReportVersionResponse] = []

    class Config:
        from_attributes = True

class ReportReviewCreate(BaseModel):
    skill_id: Optional[str] = None # skill being contested
    replica_text: str = Field(min_length=15, description="Justificativa e fatos adicionais trazidos pelo candidato")
