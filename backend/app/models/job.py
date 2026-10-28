import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, Float, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Company(Base):
    __tablename__ = "companies"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    name = Column(String(255), nullable=False)
    industry = Column(String(128), nullable=True) # e.g. "Fintech", "Healthtech", "E-commerce"
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship("Job", back_populates="company", cascade="all, delete-orphan")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    company_id = Column(String(36), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    tech_vertical = Column(String(64), nullable=False) # e.g. "Backend", "Data Engineering", "Cloud/DevOps", "Fullstack"
    seniority = Column(String(32), nullable=False) # "Júnior", "Pleno", "Sênior", "Especialista"
    contract_type = Column(String(32), nullable=False, default="INDIFERENTE") # "CLT", "PJ", "INDIFERENTE"
    work_model = Column(String(32), nullable=False, default="REMOTO") # "REMOTO", "HIBRIDO", "PRESENCIAL", "INDIFERENTE"
    min_salary = Column(Float, nullable=True)
    max_salary = Column(Float, nullable=True)
    min_experience_years = Column(Float, nullable=False, default=0.0)
    status = Column(String(32), nullable=False, default="ABERTA")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    skill_requirements = relationship("JobSkillRequirement", back_populates="job", cascade="all, delete-orphan")
    interviews = relationship("InterviewSession", back_populates="job")
    matching_results = relationship("MatchingResult", back_populates="job", cascade="all, delete-orphan")

class JobSkillRequirement(Base):
    __tablename__ = "job_skill_requirements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_id = Column(String(64), ForeignKey("skill_catalog.id", ondelete="RESTRICT"), nullable=False, index=True)
    is_mandatory = Column(Boolean, nullable=False, default=True) # true = eliminatório/obrigatório, false = desejável
    min_level = Column(Integer, nullable=False, default=3) # 1 to 5
    weight = Column(Float, nullable=False, default=1.0) # Importance weight (1.0 - 3.0)

    job = relationship("Job", back_populates="skill_requirements")
    skill = relationship("SkillCatalog", back_populates="job_requirements")
