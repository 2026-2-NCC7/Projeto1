from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.assessment import AssessmentReport, ReportVersion, CompetencyAssessment, ReportReview
from app.schemas.assessment import (
    AssessmentReportResponse, ReportVersionResponse,
    ReportReviewCreate, ReportReviewResponse
)
from app.core.profile_consolidator import ProfileConsolidator

router = APIRouter(prefix="/reports", tags=["Assessment Reports & Replicas"])

@router.get("", response_model=List[AssessmentReportResponse])
def list_reports(candidate_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(AssessmentReport)
    if candidate_id:
        query = query.filter(AssessmentReport.candidate_id == candidate_id)
    reports = query.order_by(AssessmentReport.created_at.desc()).all()

    # Hydrate candidate name and active version
    for r in reports:
        r.candidate_name = r.candidate.name if r.candidate else ""
        r.active_version = next((v for v in r.versions if v.version_number == r.active_version_number), None)
    return reports

@router.get("/{report_id}", response_model=AssessmentReportResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(AssessmentReport).filter(AssessmentReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Relatório não encontrado.")

    report.candidate_name = report.candidate.name if report.candidate else ""
    report.active_version = next((v for v in report.versions if v.version_number == report.active_version_number), None)
    return report

@router.get("/{report_id}/versions", response_model=List[ReportVersionResponse])
def get_report_versions(report_id: str, db: Session = Depends(get_db)):
    report = db.query(AssessmentReport).filter(AssessmentReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Relatório não encontrado.")
    return report.versions

@router.get("/{report_id}/versions/{version_number}", response_model=ReportVersionResponse)
def get_report_version_by_number(report_id: str, version_number: int, db: Session = Depends(get_db)):
    version = db.query(ReportVersion).filter(
        ReportVersion.report_id == report_id,
        ReportVersion.version_number == version_number
    ).first()
    if not version:
        raise HTTPException(status_code=404, detail=f"Versão {version_number} do relatório não encontrada.")
    return version

@router.post("/{report_id}/replica", response_model=ReportReviewResponse, status_code=status.HTTP_201_CREATED)
def submit_candidate_replica(
    report_id: str,
    payload: ReportReviewCreate,
    db: Session = Depends(get_db)
):
    """
    Candidate submits replica/contest on a specific skill.
    Creates a new report version (e.g. v2) while strictly preserving v1 intact!
    """
    report = db.query(AssessmentReport).filter(AssessmentReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Relatório não encontrado.")

    review = ProfileConsolidator.process_candidate_replica(
        db=db,
        report_id=report.id,
        candidate_id=report.candidate_id,
        skill_id=payload.skill_id,
        replica_text=payload.replica_text
    )
    return review

@router.post("/{report_id}/consolidate")
def consolidate_report(report_id: str, authorized_by: str = "recrutador", db: Session = Depends(get_db)):
    report = ProfileConsolidator.consolidate_authorized_version(
        db=db,
        report_id=report_id,
        authorized_by=authorized_by
    )
    return {
        "success": True,
        "report_id": report.id,
        "status": report.status,
        "active_version": report.active_version_number,
        "message": f"Versão {report.active_version_number} consolidada e autorizada com sucesso."
    }
