import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    event_type = Column(String(64), nullable=False, index=True) # e.g. "TRANSCRIPTION_STARTED", "EXTRACTION_COMPLETED", "REPLICA_SUBMITTED", "MATCHING_EXECUTED"
    entity_name = Column(String(64), nullable=False) # "Candidate", "Interview", "AssessmentReport", "Job"
    entity_id = Column(String(36), nullable=False, index=True)
    model_version = Column(String(64), nullable=True) # e.g. "whisper-small-int8", "qwen3:4b", "e5-small"
    payload = Column(JSON, nullable=True) # event details
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
