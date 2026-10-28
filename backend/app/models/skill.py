from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Integer
from sqlalchemy.orm import relationship
from app.database import Base

class SkillCatalog(Base):
    __tablename__ = "skill_catalog"

    id = Column(String(64), primary_key=True, index=True) # e.g. "tech-python", "soft-comunicacao"
    name = Column(String(128), nullable=False, unique=True, index=True)
    category = Column(String(32), nullable=False, index=True) # "HARD" or "SOFT"
    area = Column(String(64), nullable=True) # e.g. "Backend", "Data", "Cloud", "Interpersonal"
    description = Column(Text, nullable=False)
    behavioral_examples = Column(JSON, nullable=True) # list of string examples
    evaluation_criteria = Column(JSON, nullable=True) # criteria by level 1-5
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    aliases = relationship("SkillAlias", back_populates="skill", cascade="all, delete-orphan")
    declared_skills = relationship("CandidateDeclaredSkill", back_populates="skill")
    job_requirements = relationship("JobSkillRequirement", back_populates="skill")
    assessments = relationship("CompetencyAssessment", back_populates="skill")

class SkillAlias(Base):
    __tablename__ = "skill_aliases"

    id = Column(Integer, primary_key=True, autoincrement=True)
    skill_id = Column(String(64), ForeignKey("skill_catalog.id", ondelete="CASCADE"), nullable=False, index=True)
    alias = Column(String(128), nullable=False, index=True)

    skill = relationship("SkillCatalog", back_populates="aliases")
