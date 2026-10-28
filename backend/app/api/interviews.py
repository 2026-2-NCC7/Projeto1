import os
import shutil
import uuid
from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.interview import InterviewSession, InterviewQuestion, InterviewAnswer, Transcript
from app.models.candidate import Candidate
from app.models.job import Job
from app.models.skill import SkillCatalog
from app.models.audit import AuditEvent
from app.schemas.interview import (
    InterviewSessionCreate, InterviewSessionResponse,
    InterviewQuestionResponse, InterviewAnswerResponse,
    TextAnswerSubmit, EditAnswerSubmit
)
from app.core.audio_transcriber import transcriber_service
from app.core.llm_extractor import llm_extractor_service
from app.core.profile_consolidator import ProfileConsolidator
from app.config import settings

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.post("", response_model=InterviewSessionResponse, status_code=status.HTTP_201_CREATED)
def create_interview_session(payload: InterviewSessionCreate, db: Session = Depends(get_db)):
    cand = db.query(Candidate).filter(Candidate.id == payload.candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidato não encontrado.")

    if payload.job_id:
        job = db.query(Job).filter(Job.id == payload.job_id).first()
        if not job:
            raise HTTPException(status_code=404, detail="Vaga especificada não encontrada.")

    session = InterviewSession(
        candidate_id=payload.candidate_id,
        job_id=payload.job_id,
        interview_type=payload.interview_type,
        status="INICIADA"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@router.get("", response_model=List[InterviewSessionResponse])
def list_interview_sessions(
    candidate_id: Optional[str] = None,
    job_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(InterviewSession)
    if candidate_id:
        query = query.filter(InterviewSession.candidate_id == candidate_id)
    if job_id:
        query = query.filter(InterviewSession.job_id == job_id)
    return query.order_by(InterviewSession.created_at.desc()).all()

@router.get("/{session_id}", response_model=InterviewSessionResponse)
def get_interview_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sessão de entrevista não encontrada.")
    return session

@router.get("/{session_id}/questions", response_model=List[InterviewQuestionResponse])
def get_session_questions(session_id: str, db: Session = Depends(get_db)):
    """
    Returns appropriate questions:
    - If Type A (General): Returns Type A general mapping questions.
    - If Type B (Job-directed): Returns questions tailored to the job requirements.
    """
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sessão de entrevista não encontrada.")

    if session.interview_type == "TIPO_B_VAGA" and session.job_id:
        job = db.query(Job).filter(Job.id == session.job_id).first()
        req_skill_ids = [r.skill_id for r in job.skill_requirements] if job else []

        # Find questions matching target skills
        all_q = db.query(InterviewQuestion).all()
        matched_q = []
        for q in all_q:
            if q.target_competencies:
                if any(sk in req_skill_ids for sk in q.target_competencies):
                    matched_q.append(q)
        if matched_q:
            return matched_q

    # Default: return Type A questions
    return db.query(InterviewQuestion).filter(InterviewQuestion.id.startswith("q-geral")).order_by(InterviewQuestion.order_index).all()

@router.post("/answers/text", response_model=InterviewAnswerResponse)
def submit_text_answer(payload: TextAnswerSubmit, db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.id == payload.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sessão de entrevista não encontrada.")

    # Check if answer exists for this question
    answer = db.query(InterviewAnswer).filter(
        InterviewAnswer.session_id == payload.session_id,
        InterviewAnswer.question_id == payload.question_id
    ).first()

    if not answer:
        answer = InterviewAnswer(
            session_id=payload.session_id,
            question_id=payload.question_id,
            input_type="TEXT",
            raw_text=payload.text,
            edited_text=payload.text,
            status="CONFIRMADO"
        )
        db.add(answer)
    else:
        answer.raw_text = payload.text
        answer.edited_text = payload.text
        answer.status = "CONFIRMADO"

    session.status = "EM_ANDAMENTO"
    db.commit()
    db.refresh(answer)
    return answer

@router.post("/answers/audio", response_model=InterviewAnswerResponse)
async def submit_audio_answer(
    session_id: str = Form(...),
    question_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Receives recorded audio, runs faster-whisper transcription, preserves raw text and timestamps.
    """
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sessão de entrevista não encontrada.")

    # Save audio file to storage directory
    ext = Path(file.filename or "recording.webm").suffix or ".webm"
    audio_filename = f"{uuid.uuid4()}{ext}"
    audio_path = Path(settings.STORAGE_DIR) / "audio" / audio_filename

    with open(audio_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Transcribe with faster-whisper
    transcription_data = transcriber_service.transcribe(str(audio_path), language="pt")

    # Create or update Answer
    answer = db.query(InterviewAnswer).filter(
        InterviewAnswer.session_id == session_id,
        InterviewAnswer.question_id == question_id
    ).first()

    if not answer:
        answer = InterviewAnswer(
            session_id=session_id,
            question_id=question_id,
            input_type="AUDIO",
            audio_file_path=str(audio_path),
            audio_duration_seconds=transcription_data.get("duration"),
            raw_text=transcription_data["raw_transcript"],
            edited_text=transcription_data["raw_transcript"], # pre-fill for user review
            status="TRANSCRITO"
        )
        db.add(answer)
        db.flush()
    else:
        answer.input_type = "AUDIO"
        answer.audio_file_path = str(audio_path)
        answer.audio_duration_seconds = transcription_data.get("duration")
        answer.raw_text = transcription_data["raw_transcript"]
        answer.edited_text = transcription_data["raw_transcript"]
        answer.status = "TRANSCRITO"

    # Save Transcript record
    transcript = Transcript(
        answer_id=answer.id,
        model_name=transcription_data["model_name"],
        raw_transcript=transcription_data["raw_transcript"],
        segments=transcription_data.get("segments"),
        language=transcription_data.get("language", "pt"),
        compute_type=transcription_data.get("compute_type", "int8")
    )
    db.add(transcript)

    session.status = "EM_ANDAMENTO"
    db.commit()
    db.refresh(answer)
    return answer

@router.put("/answers/{answer_id}", response_model=InterviewAnswerResponse)
def edit_answer_text(answer_id: str, payload: EditAnswerSubmit, db: Session = Depends(get_db)):
    """
    Enables candidate to review and correct the transcript or text prior to final AI analysis.
    Preserves original raw_text intact for auditability!
    """
    answer = db.query(InterviewAnswer).filter(InterviewAnswer.id == answer_id).first()
    if not answer:
        raise HTTPException(status_code=404, detail="Resposta não encontrada.")

    answer.edited_text = payload.edited_text
    answer.status = "CONFIRMADO"
    db.commit()
    db.refresh(answer)
    return answer

@router.post("/{session_id}/analyze")
async def analyze_interview_session(session_id: str, db: Session = Depends(get_db)):
    """
    Core AI Extraction Pipeline:
    1. Collects candidate declared skills and confirmed answers
    2. Executes Qwen3 LLM extraction via Ollama (or deterministic fallback)
    3. Programmatically verifies exact quotes in transcript
    4. Generates Version 1 of Assessment Report
    """
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada.")

    candidate = session.candidate
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato associado não encontrado.")

    answers = db.query(InterviewAnswer).filter(InterviewAnswer.session_id == session_id).all()
    if not answers:
        raise HTTPException(status_code=400, detail="Nenhuma resposta registrada para esta sessão.")

    session.status = "PROCESSANDO"
    db.commit()

    try:
        # Prepare inputs
        declared_skills_data = [
            {"skill_id": ds.skill_id, "declared_level": ds.declared_level}
            for ds in candidate.declared_skills
        ]

        answers_data = [
            {
                "id": a.id,
                "question_id": a.question_id,
                "question_text": a.question.text if a.question else "",
                "raw_text": a.raw_text,
                "edited_text": a.edited_text
            }
            for a in answers
        ]

        skills_catalog = db.query(SkillCatalog).all()
        catalog_data = [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "description": s.description,
                "aliases": [al.alias for al in s.aliases]
            }
            for s in skills_catalog
        ]

        # Call LLM Extractor
        extraction_result = await llm_extractor_service.extract_competencies(
            candidate_id=candidate.id,
            interview_id=session.id,
            declared_skills=declared_skills_data,
            answers_data=answers_data,
            skill_catalog=catalog_data
        )

        # Consolidate and create preliminary report (v1)
        report = ProfileConsolidator.create_preliminary_report(
            db=db,
            candidate_id=candidate.id,
            interview_id=session.id,
            extraction_result=extraction_result
        )

        session.status = "ANALISADA"
        db.commit()

        return {
            "success": True,
            "session_id": session.id,
            "report_id": report.id,
            "version_number": 1,
            "total_competencies_evaluated": len(extraction_result.competencies),
            "message": "Entrevista analisada com sucesso. Relatório preliminar (v1) gerado."
        }

    except Exception as e:
        session.status = "ERRO"
        db.commit()
        logger.error(f"Error analyzing interview: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Erro durante o processamento da análise: {str(e)}")

@router.get("/{session_id}/status")
def get_interview_status(session_id: str, db: Session = Depends(get_db)):
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Sessão não encontrada.")

    answers_count = db.query(InterviewAnswer).filter(InterviewAnswer.session_id == session_id).count()
    return {
        "session_id": session.id,
        "status": session.status,
        "answers_count": answers_count,
        "completed_at": session.completed_at
    }
