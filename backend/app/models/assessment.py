import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class AssessmentReport(Base):
    __tablename__ = "assessment_reports"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    interview_id = Column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(32), nullable=False, default="PRELIMINAR") # PRELIMINAR, CONSOLIDADO, EM_REVISAO
    active_version_number = Column(Integer, nullable=False, default=1)
    model_metadata = Column(JSON, nullable=True) # versions of whisper, qwen3, embeddings
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="reports")
    interview = relationship("InterviewSession", back_populates="reports")
    versions = relationship("ReportVersion", back_populates="report", cascade="all, delete-orphan")
    reviews = relationship("ReportReview", back_populates="report", cascade="all, delete-orphan")

class ReportVersion(Base):
    __tablename__ = "report_versions"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    report_id = Column(String(36), ForeignKey("assessment_reports.id", ondelete="CASCADE"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False) # 1, 2, 3...
    status = Column(String(32), nullable=False, default="ATIVO") # ATIVO, ARQUIVADO, REVISADO
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    report = relationship("AssessmentReport", back_populates="versions")
    assessments = relationship("CompetencyAssessment", back_populates="version", cascade="all, delete-orphan")
    reviews = relationship("ReportReview", back_populates="version")

class CompetencyAssessment(Base):
    __tablename__ = "competency_assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    version_id = Column(String(36), ForeignKey("report_versions.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(64), ForeignKey("skill_catalog.id", ondelete="RESTRICT"), nullable=False, index=True)
    declared = Column(Boolean, nullable=False, default=False)
    declared_level = Column(Integer, nullable=True) # 1 to 5
    evidence_status = Column(String(32), nullable=False) # EVIDENCIADA, PARCIALMENTE_EVIDENCIADA, EVIDENCIA_INSUFICIENTE, NAO_AVALIADA, DIVERGENCIA_IDENTIFICADA
    estimated_level = Column(Integer, nullable=True) # 1 to 5, or null if insufficient
    explanation = Column(Text, nullable=False)
    requires_review = Column(Boolean, default=False)
    is_suggested = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    version = relationship("ReportVersion", back_populates="assessments")
    skill = relationship("SkillCatalog", back_populates="assessments")
    evidences = relationship("CompetencyEvidence", back_populates="assessment", cascade="all, delete-orphan")

class CompetencyEvidence(Base):
    __tablename__ = "competency_evidences"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    assessment_id = Column(String(36), ForeignKey("competency_assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    answer_id = Column(String(36), ForeignKey("interview_answers.id", ondelete="SET NULL"), nullable=True, index=True)
    exact_quote = Column(Text, nullable=False) # MUST exist verbatim in answer
    explanation = Column(Text, nullable=True)
    paraphrase = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assessment = relationship("CompetencyAssessment", back_populates="evidences")
    answer = relationship("InterviewAnswer", back_populates="evidences")

class ReportReview(Base):
    __tablename__ = "report_reviews"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    report_id = Column(String(36), ForeignKey("assessment_reports.id", ondelete="CASCADE"), nullable=False, index=True)
    version_id = Column(String(36), ForeignKey("report_versions.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(64), nullable=True) # specific skill contested
    replica_text = Column(Text, nullable=False)
    status = Column(String(32), nullable=False, default="SUBMETIDA") # SUBMETIDA, EM_ANALISE, RESOLVIDA, ENCAMINHADA_HUMANO
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    report = relationship("AssessmentReport", back_populates="reviews")
    version = relationship("ReportVersion", back_populates="reviews")
