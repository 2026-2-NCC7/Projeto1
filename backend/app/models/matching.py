import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class MatchingResult(Base):
    __tablename__ = "matching_results"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True)
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    report_version_id = Column(String(36), nullable=True) # the specific version evaluated

    # Heuristic Scores (0.0 to 100.0)
    overall_score = Column(Float, nullable=False, default=0.0)
    hard_skills_score = Column(Float, nullable=False, default=0.0)
    soft_skills_score = Column(Float, nullable=False, default=0.0)
    experience_score = Column(Float, nullable=False, default=0.0)
    conditions_score = Column(Float, nullable=False, default=0.0)

    # Coverage of Evidenced Evaluation (0.0 to 100.0)
    evaluation_coverage = Column(Float, nullable=False, default=0.0)

    # Objective Constraints Check
    is_objectively_incompatible = Column(Boolean, nullable=False, default=False)
    incompatibility_reasons = Column(JSON, nullable=True) # list of strings

    # Detailed Skill Breakdown
    matched_skills = Column(JSON, nullable=True) # list of details
    partial_skills = Column(JSON, nullable=True)
    missing_skills = Column(JSON, nullable=True)
    pending_skills = Column(JSON, nullable=True) # competencies required but not yet evaluated

    textual_justification = Column(Text, nullable=False)
    algorithm_version = Column(String(32), nullable=False, default="v1.0-heuristic")
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="matching_results")
    candidate = relationship("Candidate", back_populates="matching_results")
