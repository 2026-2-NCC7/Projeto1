from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field

class InterviewQuestionResponse(BaseModel):
    id: str
    text: str
    category: str
    target_competencies: Optional[List[str]] = []
    rubric: Optional[str] = None
    order_index: int

    class Config:
        from_attributes = True

class TranscriptResponse(BaseModel):
    id: str
    model_name: str
    raw_transcript: str
    segments: Optional[List[dict]] = None
    language: str
    created_at: datetime

    class Config:
        from_attributes = True

class InterviewAnswerResponse(BaseModel):
    id: str
    session_id: str
    question_id: str
    input_type: str # "AUDIO" or "TEXT"
    audio_file_path: Optional[str] = None
    audio_duration_seconds: Optional[float] = None
    raw_text: Optional[str] = None
    edited_text: Optional[str] = None
    final_text: Optional[str] = None
    status: str
    created_at: datetime
    transcripts: List[TranscriptResponse] = []

    class Config:
        from_attributes = True

class InterviewSessionCreate(BaseModel):
    candidate_id: str
    interview_type: str = Field(default="TIPO_A_GERAL", description="'TIPO_A_GERAL' or 'TIPO_B_VAGA'")
    job_id: Optional[str] = None

class InterviewSessionResponse(BaseModel):
    id: str
    candidate_id: str
    job_id: Optional[str] = None
    interview_type: str
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    answers: List[InterviewAnswerResponse] = []

    class Config:
        from_attributes = True

class TextAnswerSubmit(BaseModel):
    session_id: str
    question_id: str
    text: str = Field(min_length=10)

class EditAnswerSubmit(BaseModel):
    edited_text: str = Field(min_length=5)
