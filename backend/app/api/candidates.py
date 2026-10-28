from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.candidate import Candidate, CandidateDeclaredSkill, ConsentRecord
from app.models.skill import SkillCatalog
from app.models.assessment import AssessmentReport, ReportVersion
from app.schemas.candidate import (
    CandidateCreate, CandidateUpdate, CandidateResponse,
    CandidateSkillInput, CandidateSkillResponse
)
from app.schemas.assessment import AssessmentReportResponse

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.post("", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
def create_candidate(payload: CandidateCreate, db: Session = Depends(get_db)):
    # Check if email is already registered
    existing = db.query(Candidate).filter(Candidate.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado no sistema.")

    candidate = Candidate(
        name=payload.name,
        email=payload.email,
        tech_area=payload.tech_area,
        declared_seniority=payload.declared_seniority,
        years_of_experience=payload.years_of_experience,
        contract_preference=payload.contract_preference,
        work_model_preference=payload.work_model_preference,
        salary_expectation=payload.salary_expectation,
        bio_summary=payload.bio_summary
    )
    db.add(candidate)
    db.flush()

    # Register consent record
    if payload.consent:
        consent = ConsentRecord(
            candidate_id=candidate.id,
            purpose=payload.consent.purpose,
            legal_basis=payload.consent.legal_basis,
            granted=payload.consent.granted
        )
        db.add(consent)

    # Register declared skills
    if payload.declared_skills:
        for sk in payload.declared_skills:
            # Validate skill existence
            valid_skill = db.query(SkillCatalog).filter(SkillCatalog.id == sk.skill_id).first()
            if valid_skill:
                declared_skill = CandidateDeclaredSkill(
                    candidate_id=candidate.id,
                    skill_id=sk.skill_id,
                    declared_level=sk.declared_level,
                    notes=sk.notes
                )
                db.add(declared_skill)

    db.commit()
    db.refresh(candidate)
    return candidate

@router.get("", response_model=List[CandidateResponse])
def list_candidates(
    skip: int = 0,
    limit: int = 100,
    tech_area: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Candidate)
    if tech_area:
        query = query.filter(Candidate.tech_area.ilike(f"%{tech_area}%"))
    return query.offset(skip).limit(limit).all()

@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: str, db: Session = Depends(get_db)):
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidato não encontrado.")
    return cand

@router.put("/{candidate_id}", response_model=CandidateResponse)
def update_candidate(candidate_id: str, payload: CandidateUpdate, db: Session = Depends(get_db)):
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidato não encontrado.")

    update_data = payload.dict(exclude_unset=True)
    for field, val in update_data.items():
        setattr(cand, field, val)

    db.commit()
    db.refresh(cand)
    return cand

@router.post("/{candidate_id}/skills", response_model=CandidateSkillResponse)
def add_or_update_declared_skill(candidate_id: str, payload: CandidateSkillInput, db: Session = Depends(get_db)):
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidato não encontrado.")

    skill = db.query(SkillCatalog).filter(SkillCatalog.id == payload.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Competência não existe no catálogo.")

    declared = db.query(CandidateDeclaredSkill).filter(
        CandidateDeclaredSkill.candidate_id == candidate_id,
        CandidateDeclaredSkill.skill_id == payload.skill_id
    ).first()

    if declared:
        declared.declared_level = payload.declared_level
        declared.notes = payload.notes
    else:
        declared = CandidateDeclaredSkill(
            candidate_id=candidate_id,
            skill_id=payload.skill_id,
            declared_level=payload.declared_level,
            notes=payload.notes
        )
        db.add(declared)

    db.commit()
    db.refresh(declared)
    return declared

@router.get("/{candidate_id}/skills", response_model=List[CandidateSkillResponse])
def get_candidate_skills(candidate_id: str, db: Session = Depends(get_db)):
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidato não encontrado.")
    return cand.declared_skills

@router.get("/{candidate_id}/latest-report")
def get_candidate_latest_report(candidate_id: str, db: Session = Depends(get_db)):
    """Retrieves candidate's latest consolidated or preliminary assessment report."""
    report = db.query(AssessmentReport).filter(
        AssessmentReport.candidate_id == candidate_id
    ).order_by(AssessmentReport.created_at.desc()).first()

    if not report:
        raise HTTPException(status_code=404, detail="Nenhum relatório de competências encontrado para este candidato.")

    active_version = db.query(ReportVersion).filter(
        ReportVersion.report_id == report.id,
        ReportVersion.version_number == report.active_version_number
    ).first()

    return {
        "report_id": report.id,
        "candidate_id": report.candidate_id,
        "candidate_name": report.candidate.name if report.candidate else "",
        "interview_id": report.interview_id,
        "status": report.status,
        "active_version_number": report.active_version_number,
        "model_metadata": report.model_metadata,
        "version": active_version,
        "created_at": report.created_at
    }
