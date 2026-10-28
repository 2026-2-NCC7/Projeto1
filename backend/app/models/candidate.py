import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Integer, Float, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    tech_area = Column(String(64), nullable=False) # e.g. "Engenharia de Software", "Ciência de Dados", "DevOps"
    declared_seniority = Column(String(32), nullable=False) # "Júnior", "Pleno", "Sênior", "Especialista"
    years_of_experience = Column(Float, nullable=False, default=0.0)
    contract_preference = Column(String(32), nullable=False, default="INDIFERENTE") # "CLT", "PJ", "INDIFERENTE"
    work_model_preference = Column(String(32), nullable=False, default="INDIFERENTE") # "REMOTO", "HIBRIDO", "PRESENCIAL", "INDIFERENTE"
    salary_expectation = Column(Float, nullable=True)
    bio_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    declared_skills = relationship("CandidateDeclaredSkill", back_populates="candidate", cascade="all, delete-orphan")
    consent_records = relationship("ConsentRecord", back_populates="candidate", cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="candidate", cascade="all, delete-orphan")
    reports = relationship("AssessmentReport", back_populates="candidate", cascade="all, delete-orphan")
    matching_results = relationship("MatchingResult", back_populates="candidate", cascade="all, delete-orphan")

class CandidateDeclaredSkill(Base):
    __tablename__ = "candidate_declared_skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(64), ForeignKey("skill_catalog.id", ondelete="RESTRICT"), nullable=False, index=True)
    declared_level = Column(Integer, nullable=False) # 1 to 5
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="declared_skills")
    skill = relationship("SkillCatalog", back_populates="declared_skills")

class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    purpose = Column(String(255), nullable=False) # e.g. "Mapeamento de competências e matching de vagas"
    legal_basis = Column(String(64), nullable=False, default="CONSENTIMENTO_LGPD")
    granted = Column(Boolean, nullable=False, default=True)
    ip_address = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="consent_records")
