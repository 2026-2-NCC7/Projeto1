from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db
from app.models.audit import AuditEvent
from app.schemas.system import HealthResponse, ModelStatus, AuditEventResponse
from app.core.audio_transcriber import transcriber_service
from app.core.llm_extractor import llm_extractor_service
from app.core.semantic_embedder import embedder_service
from app.config import settings

router = APIRouter(prefix="/system", tags=["System & Diagnostics"])

@router.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint checking DB connectivity and local ML models."""
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    models_status = await get_all_models_status()

    return HealthResponse(
        status="healthy" if db_ok else "degraded",
        version=settings.APP_VERSION,
        timestamp=datetime.utcnow(),
        database_connected=db_ok,
        models=models_status
    )

@router.get("/models", response_model=List[ModelStatus])
async def get_models_status_endpoint():
    """Detailed status of all local AI models."""
    return await get_all_models_status()

async def get_all_models_status() -> List[ModelStatus]:
    # Model 1: Whisper
    whisper_avail = transcriber_service.is_available()
    whisper_status = ModelStatus(
        name="faster-whisper",
        role="Transcrição de Áudio",
        target_engine=f"{settings.WHISPER_MODEL_SIZE} ({settings.WHISPER_COMPUTE_TYPE})",
        available=whisper_avail,
        device=settings.WHISPER_DEVICE,
        details="Pronto para transcrição em português com timestamps." if whisper_avail else "Falha ao carregar faster-whisper."
    )

    # Model 2: Qwen3 / Ollama
    ollama_check = await llm_extractor_service.check_ollama_status()
    ollama_avail = ollama_check.get("available") and ollama_check.get("model_present")
    ollama_details = (
        f"Ollama ativo com modelo '{settings.OLLAMA_MODEL}' pronto."
        if ollama_avail else
        f"Ollama local em '{settings.OLLAMA_BASE_URL}' offline ou modelo '{settings.OLLAMA_MODEL}' ausente. Operando com motor determinístico de contingência."
    )
    qwen_status = ModelStatus(
        name="Qwen3 (via Ollama)",
        role="Extração Inteligente de Competências",
        target_engine=settings.OLLAMA_MODEL,
        available=ollama_avail,
        device="cpu",
        details=ollama_details
    )

    # Model 3: Embeddings
    embedder_avail = embedder_service.is_available()
    embedder_status = ModelStatus(
        name="multilingual-e5-small",
        role="Representações Semânticas e Similaridade",
        target_engine=settings.EMBEDDING_MODEL_NAME,
        available=embedder_avail,
        device=settings.EMBEDDING_DEVICE,
        details="Sentence Transformers pronto com prefixos query: e passage:." if embedder_avail else "Usando gerador de vetores normalizados de fallback."
    )

    return [whisper_status, qwen_status, embedder_status]

@router.get("/audit-events", response_model=List[AuditEventResponse])
def list_audit_events(limit: int = 50, db: Session = Depends(get_db)):
    """Retrieves recent audit events for LGPD and traceability."""
    return db.query(AuditEvent).order_by(AuditEvent.created_at.desc()).limit(limit).all()
