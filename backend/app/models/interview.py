import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, JSON, ForeignKey, Integer, Float
from sqlalchemy.orm import relationship
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    candidate_id = Column(String(36), ForeignKey("candidates.id", ondelete="CASCADE"), nullable=False, index=True)
    job_id = Column(String(36), ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True, index=True)
    interview_type = Column(String(32), nullable=False) # "TIPO_A_GERAL" or "TIPO_B_VAGA"
    status = Column(String(32), nullable=False, default="INICIADA") # INICIADA, EM_ANDAMENTO, CONCLUIDA, PROCESSANDO, ANALISADA
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    candidate = relationship("Candidate", back_populates="interviews")
    job = relationship("Job", back_populates="interviews")
    answers = relationship("InterviewAnswer", back_populates="session", cascade="all, delete-orphan")
    reports = relationship("AssessmentReport", back_populates="interview", cascade="all, delete-orphan")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"

    id = Column(String(64), primary_key=True, index=True) # e.g. "q-geral-001"
    text = Column(Text, nullable=False)
    category = Column(String(32), nullable=False) # "GERAL", "TECNICA", "COMPORTAMENTAL"
    target_competencies = Column(JSON, nullable=True) # list of skill_ids
    rubric = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    answers = relationship("InterviewAnswer", back_populates="question")

class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    session_id = Column(String(36), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(64), ForeignKey("interview_questions.id", ondelete="RESTRICT"), nullable=False, index=True)
    audio_file_path = Column(String(512), nullable=True)
    audio_duration_seconds = Column(Float, nullable=True)
    input_type = Column(String(16), nullable=False, default="TEXT") # "AUDIO" or "TEXT"
    raw_text = Column(Text, nullable=True) # original transcription or typed text
    edited_text = Column(Text, nullable=True) # corrected version by candidate prior to submission
    status = Column(String(32), nullable=False, default="CONFIRMADO") # PENDENTE, GRAVADO, TRANSCRITO, CONFIRMADO
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    session = relationship("InterviewSession", back_populates="answers")
    question = relationship("InterviewQuestion", back_populates="answers")
    transcripts = relationship("Transcript", back_populates="answer", cascade="all, delete-orphan")
    evidences = relationship("CompetencyEvidence", back_populates="answer")

class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    answer_id = Column(String(36), ForeignKey("interview_answers.id", ondelete="CASCADE"), nullable=False, index=True)
    model_name = Column(String(64), nullable=False, default="faster-whisper-small")
    raw_transcript = Column(Text, nullable=False)
    segments = Column(JSON, nullable=True) # list of {start, end, text}
    language = Column(String(16), default="pt")
    compute_type = Column(String(16), default="int8")
    created_at = Column(DateTime, default=datetime.utcnow)

    answer = relationship("InterviewAnswer", back_populates="transcripts")
