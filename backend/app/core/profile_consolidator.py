import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.candidate import Candidate, CandidateDeclaredSkill
from app.models.interview import InterviewSession, InterviewAnswer
from app.models.skill import SkillCatalog
from app.models.assessment import (
    AssessmentReport, ReportVersion, CompetencyAssessment,
    CompetencyEvidence, ReportReview
)
from app.models.audit import AuditEvent
from app.schemas.assessment import LLMExtractionResult
from app.config import settings

logger = logging.getLogger(__name__)

class ProfileConsolidator:
    """
    Consolidates declared candidate skills with interview evidence,
    managing report versions (v1, v2, v3) and audit events.
    """

    @staticmethod
    def create_preliminary_report(
        db: Session,
        candidate_id: str,
        interview_id: str,
        extraction_result: LLMExtractionResult
    ) -> AssessmentReport:
        """
        Creates Version 1 (Preliminary Report) from extraction results.
        """
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            raise ValueError(f"Candidate {candidate_id} not found.")

        # Check existing report for this interview or candidate
        report = db.query(AssessmentReport).filter(
            AssessmentReport.candidate_id == candidate_id,
            AssessmentReport.interview_id == interview_id
        ).first()

        if not report:
            report = AssessmentReport(
                candidate_id=candidate_id,
                interview_id=interview_id,
                status="PRELIMINAR",
                active_version_number=1,
                model_metadata={
                    "whisper_model": settings.WHISPER_MODEL_SIZE,
                    "llm_model": settings.OLLAMA_MODEL,
                    "embedding_model": settings.EMBEDDING_MODEL_NAME,
                    "created_at": datetime.utcnow().isoformat()
                }
            )
            db.add(report)
            db.flush()

        # Archive any previous version 1 if re-processing
        db.query(ReportVersion).filter(
            ReportVersion.report_id == report.id,
            ReportVersion.version_number == 1
        ).delete()

        # Create Version 1
        v1 = ReportVersion(
            report_id=report.id,
            version_number=1,
            status="ATIVO",
            summary=extraction_result.overall_summary or "Relatório preliminar de competências baseado em entrevista e autodeclaração."
        )
        db.add(v1)
        db.flush()

        # Map candidate declared skills
        declared_map = {
            ds.skill_id: ds.declared_level
            for ds in candidate.declared_skills
        }

        for comp in extraction_result.competencies:
            is_declared = comp.skill_id in declared_map
            dec_level = declared_map.get(comp.skill_id)

            assessment = CompetencyAssessment(
                version_id=v1.id,
                skill_id=comp.skill_id,
                declared=is_declared,
                declared_level=dec_level,
                evidence_status=comp.evidence_status,
                estimated_level=comp.estimated_level,
                explanation=comp.explanation,
                requires_review=comp.requires_review,
                is_suggested=comp.is_suggested
            )
            db.add(assessment)
            db.flush()

            for ev in comp.evidence:
                evidence_rec = CompetencyEvidence(
                    assessment_id=assessment.id,
                    answer_id=ev.answer_id,
                    exact_quote=ev.exact_quote,
                    explanation=ev.explanation,
                    paraphrase=ev.paraphrase
                )
                db.add(evidence_rec)

        # Audit Event
        audit = AuditEvent(
            event_type="PRELIMINARY_REPORT_GENERATED",
            entity_name="AssessmentReport",
            entity_id=report.id,
            model_version=f"{settings.OLLAMA_MODEL}+{settings.EMBEDDING_MODEL_NAME}",
            payload={
                "version_number": 1,
                "competencies_count": len(extraction_result.competencies)
            }
        )
        db.add(audit)
        db.commit()
        db.refresh(report)
        return report

    @staticmethod
    def process_candidate_replica(
        db: Session,
        report_id: str,
        candidate_id: str,
        skill_id: Optional[str],
        replica_text: str
    ) -> ReportReview:
        """
        Registers candidate replica and prepares version 2 (Report after Review).
        Preserves original Version 1 intact for complete audit history!
        """
        report = db.query(AssessmentReport).filter(AssessmentReport.id == report_id).first()
        if not report:
            raise ValueError("Relatório não encontrado.")

        # Find current active version
        current_version = db.query(ReportVersion).filter(
            ReportVersion.report_id == report.id,
            ReportVersion.version_number == report.active_version_number
        ).first()

        if not current_version:
            raise ValueError("Versão ativa não encontrada.")

        # Register Review Request
        review = ReportReview(
            report_id=report.id,
            version_id=current_version.id,
            candidate_id=candidate_id,
            skill_id=skill_id,
            replica_text=replica_text,
            status="SUBMETIDA"
        )
        db.add(review)
        db.flush()

        # Create Version 2 (Report after Revision)
        new_version_number = report.active_version_number + 1
        new_version = ReportVersion(
            report_id=report.id,
            version_number=new_version_number,
            status="ATIVO",
            summary=f"Versão {new_version_number} gerada após réplica do candidato a respeito de: {skill_id or 'relatório geral'}."
        )
        db.add(new_version)
        db.flush()

        # Copy existing assessments, marking the contested skill as under review
        for old_ass in current_version.assessments:
            is_contested = (skill_id is not None and old_ass.skill_id == skill_id)
            new_ass = CompetencyAssessment(
                version_id=new_version.id,
                skill_id=old_ass.skill_id,
                declared=old_ass.declared,
                declared_level=old_ass.declared_level,
                evidence_status=old_ass.evidence_status if not is_contested else "DIVERGENCIA_IDENTIFICADA",
                estimated_level=old_ass.estimated_level,
                explanation=old_ass.explanation if not is_contested else f"{old_ass.explanation} [Contestação registrada pelo candidato: '{replica_text[:100]}...']",
                requires_review=is_contested or old_ass.requires_review,
                is_suggested=old_ass.is_suggested
            )
            db.add(new_ass)
            db.flush()

            # Copy evidences
            for ev in old_ass.evidences:
                db.add(CompetencyEvidence(
                    assessment_id=new_ass.id,
                    answer_id=ev.answer_id,
                    exact_quote=ev.exact_quote,
                    explanation=ev.explanation,
                    paraphrase=ev.paraphrase
                ))

        # Mark previous version as archived and update active version
        current_version.status = "ARQUIVADO"
        report.active_version_number = new_version_number
        report.status = "EM_REVISAO"

        # Update review status
        review.status = "ENCAMINHADA_HUMANO"
        review.resolution_notes = "Réplica registrada e incorporada na Versão 2. Marcada para conferência por recrutador humano."

        # Audit event
        db.add(AuditEvent(
            event_type="REPLICA_SUBMITTED_AND_VERSIONED",
            entity_name="AssessmentReport",
            entity_id=report.id,
            payload={
                "previous_version": current_version.version_number,
                "new_version": new_version_number,
                "contested_skill": skill_id,
                "review_id": review.id
            }
        ))

        db.commit()
        db.refresh(review)
        return review

    @staticmethod
    def consolidate_authorized_version(
        db: Session,
        report_id: str,
        authorized_by: str = "recrutador"
    ) -> AssessmentReport:
        """Consolidates the active report version as officially authorized."""
        report = db.query(AssessmentReport).filter(AssessmentReport.id == report_id).first()
        if not report:
            raise ValueError("Relatório não encontrado.")

        report.status = "CONSOLIDADO"
        db.add(AuditEvent(
            event_type="REPORT_CONSOLIDATED_AUTHORIZED",
            entity_name="AssessmentReport",
            entity_id=report.id,
            payload={"authorized_by": authorized_by, "version": report.active_version_number}
        ))
        db.commit()
        db.refresh(report)
        return report
