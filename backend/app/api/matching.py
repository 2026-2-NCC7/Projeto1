from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import Job
from app.models.candidate import Candidate
from app.schemas.matching import (
    CandidateMatchingResponse, JobMatchingRankingResponse,
    CandidateComparisonRequest, CandidateComparisonResponse
)
from app.core.matching_engine import matching_engine_service

router = APIRouter(prefix="/matching", tags=["Q.I. Matchmaker Engine"])

@router.post("/jobs/{job_id}/run", response_model=JobMatchingRankingResponse)
def run_job_matching(job_id: str, db: Session = Depends(get_db)):
    """
    Executes 5-stage explainable matching pipeline for all candidates against the specified job.
    """
    try:
        ranking_response = matching_engine_service.rank_candidates_for_job(db=db, job_id=job_id)
        return ranking_response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro durante o matching: {str(e)}")

@router.get("/jobs/{job_id}/ranking", response_model=JobMatchingRankingResponse)
def get_job_ranking(job_id: str, db: Session = Depends(get_db)):
    """
    Retrieves ranked candidates for a job with explainable scores, coverage %, and justifications.
    """
    try:
        return matching_engine_service.rank_candidates_for_job(db=db, job_id=job_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/candidates/{candidate_id}/jobs/{job_id}", response_model=CandidateMatchingResponse)
def match_single_candidate(candidate_id: str, job_id: str, db: Session = Depends(get_db)):
    """
    Evaluates compatibility between a single candidate and a specific job.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada.")

    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidato não encontrado.")

    result = matching_engine_service.match_candidate_to_job(db=db, job=job, candidate=candidate, persist=True)
    return result

@router.post("/compare", response_model=CandidateComparisonResponse)
def compare_candidates(payload: CandidateComparisonRequest, db: Session = Depends(get_db)):
    """
    Stage 5: Side-by-side comparison of 2 or more candidates against the exact same job requirements.
    """
    try:
        return matching_engine_service.compare_candidates(
            db=db,
            job_id=payload.job_id,
            candidate_ids=payload.candidate_ids
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao comparar candidatos: {str(e)}")
