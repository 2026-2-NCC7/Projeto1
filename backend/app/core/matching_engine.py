import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.job import Job, JobSkillRequirement
from app.models.candidate import Candidate
from app.models.assessment import AssessmentReport, ReportVersion, CompetencyAssessment
from app.models.matching import MatchingResult
from app.schemas.matching import (
    MatchedSkillDetail, CandidateMatchingResponse,
    JobMatchingRankingResponse, CandidateComparisonResponse, CandidateComparisonItem
)
from app.core.semantic_embedder import embedder_service
from app.config import settings

from dataclasses import dataclass
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

@dataclass(frozen=True)
class MatchingWeights:
    """
    XP Refactoring - Value Object:
    Encapsulates heuristic weights for the 4-dimensional explainable matching model.
    Guarantees validation and immutability.
    """
    hard_skills: float = 0.50
    soft_skills: float = 0.25
    experience: float = 0.15
    conditions: float = 0.10

    def validate(self) -> None:
        """Validates that weights sum to 1.0 (within float tolerance)."""
        total = self.hard_skills + self.soft_skills + self.experience + self.conditions
        if not (0.98 <= total <= 1.02):
            raise ValueError(f"A soma dos pesos deve totalizar 1.0 (valor atual: {total:.2f})")

class AlignmentRatio:
    """
    XP Refactoring - Replace Magic Numbers:
    Explicit constants defining alignment score proportions.
    """
    FULL_MATCH = 1.0
    PARTIAL_HIGH_BOUND = 0.75
    PARTIAL_MID_BOUND = 0.50
    PARTIAL_LOW_BOUND = 0.40
    PENDING_DECLARED = 0.50
    PENDING_UNDECLARED = 0.35
    PENDING_UNADDRESSED = 0.25
    DISCREPANCY = 0.30
    INSUFFICIENT_EVIDENCE = 0.15

class ObjectivePenalty:
    """
    XP Refactoring - Replace Magic Numbers:
    Constants defining objective incompatibility deductions.
    """
    CONTRACT_MISMATCH = 40.0
    WORK_MODEL_CONFLICT = 50.0
    WORK_MODEL_MISMATCH = 20.0
    SALARY_EXCESS = 30.0
    SALARY_TOLERANCE_RATIO = 1.25

class QIMatchmakerEngine:
    """
    Q.I. Matchmaker Engine:
    5-stage explainable matching pipeline (Refactored via Extreme Programming):
    1. Objective Constraints Filter
    2. Competency Matching (Hard & Soft, Evidenced, Partial, Gaps, Semantic Similarity)
    3. Heuristic Weighted Scoring & Evaluation Coverage
    4. Ranking with Transparent Explanations
    5. Side-by-Side Candidate Comparison Matrix
    """

    def __init__(
        self,
        weight_hard: float = None,
        weight_soft: float = None,
        weight_exp: float = None,
        weight_cond: float = None,
        weights: Optional[MatchingWeights] = None
    ):
        if weights is not None:
            weights.validate()
            self.weights = weights
        else:
            w_hard = weight_hard if weight_hard is not None else settings.WEIGHT_HARD_SKILLS
            w_soft = weight_soft if weight_soft is not None else settings.WEIGHT_SOFT_SKILLS
            w_exp = weight_exp if weight_exp is not None else settings.WEIGHT_EXPERIENCE
            w_cond = weight_cond if weight_cond is not None else settings.WEIGHT_CONDITIONS
            self.weights = MatchingWeights(
                hard_skills=w_hard,
                soft_skills=w_soft,
                experience=w_exp,
                conditions=w_cond
            )

        self.w_hard = self.weights.hard_skills
        self.w_soft = self.weights.soft_skills
        self.w_exp = self.weights.experience
        self.w_cond = self.weights.conditions
        self.algorithm_version = "v1.1-refactored-xp"

    def compute_overall_score(
        self,
        hard_score: float,
        soft_score: float,
        exp_score: float,
        conditions_score: float
    ) -> float:
        """
        Pure mathematical scoring function (SRP):
        Fórmula Heurística: MATCH = (w_hard * HARD) + (w_soft * SOFT) + (w_exp * EXP) + (w_cond * COND)
        Bounded between 0.0 and 100.0, rounded to 1 decimal place.
        """
        score = (
            (self.w_hard * hard_score) +
            (self.w_soft * soft_score) +
            (self.w_exp * exp_score) +
            (self.w_cond * conditions_score)
        )
        return round(max(0.0, min(100.0, score)), 1)


    def match_candidate_to_job(
        self,
        db: Session,
        job: Job,
        candidate: Candidate,
        persist: bool = True
    ) -> CandidateMatchingResponse:
        """
        Executes matching evaluation for a single candidate against a specific job.
        """
        # --- Stage 1: Objective Filters ---
        is_incompatible, incompatibilities, conditions_score = self._evaluate_objective_conditions(job, candidate)

        # Experience score (0 - 100)
        exp_score = self._evaluate_experience(job, candidate)

        # Retrieve candidate's latest valid report version
        report = db.query(AssessmentReport).filter(
            AssessmentReport.candidate_id == candidate.id
        ).order_by(AssessmentReport.created_at.desc()).first()

        assessments_map: Dict[str, CompetencyAssessment] = {}
        report_version_id = None

        if report:
            active_version = db.query(ReportVersion).filter(
                ReportVersion.report_id == report.id,
                ReportVersion.version_number == report.active_version_number
            ).first()
            if active_version:
                report_version_id = active_version.id
                for ass in active_version.assessments:
                    assessments_map[ass.skill_id] = ass

        # Fallback to declared skills if no assessment report exists yet
        declared_map = {ds.skill_id: ds.declared_level for ds in candidate.declared_skills}

        # --- Stage 2 & 3: Competency Matching & Weighted Scoring ---
        hard_details, soft_details, hard_score, soft_score, coverage_pct = self._evaluate_competencies(
            job.skill_requirements,
            assessments_map,
            declared_map
        )

        # Compute overall explainable match score using refactored SRP method
        overall_score = self.compute_overall_score(
            hard_score=hard_score,
            soft_score=soft_score,
            exp_score=exp_score,
            conditions_score=conditions_score
        )

        # Group skill details
        all_details = hard_details + soft_details
        matched = [d for d in all_details if d.alignment_status == "ATENDIDO"]
        partial = [d for d in all_details if d.alignment_status == "PARCIALMENTE_ATENDIDO"]
        missing = [d for d in all_details if d.alignment_status == "NAO_ATENDIDO"]
        pending = [d for d in all_details if d.alignment_status == "PENDENTE_AVALIACAO"]

        # Build textual justification
        justification = self._generate_justification(
            candidate=candidate,
            job=job,
            overall_score=overall_score,
            hard_score=hard_score,
            soft_score=soft_score,
            exp_score=exp_score,
            conditions_score=conditions_score,
            coverage_pct=coverage_pct,
            is_incompatible=is_incompatible,
            incompatibilities=incompatibilities,
            matched=matched,
            partial=partial,
            missing=missing,
            pending=pending
        )

        # Save result to DB if requested
        if persist:
            match_rec = MatchingResult(
                job_id=job.id,
                candidate_id=candidate.id,
                report_version_id=report_version_id,
                overall_score=overall_score,
                hard_skills_score=hard_score,
                soft_skills_score=soft_score,
                experience_score=exp_score,
                conditions_score=conditions_score,
                evaluation_coverage=coverage_pct,
                is_objectively_incompatible=is_incompatible,
                incompatibility_reasons=incompatibilities,
                matched_skills=[m.dict() for m in matched],
                partial_skills=[p.dict() for p in partial],
                missing_skills=[mi.dict() for mi in missing],
                pending_skills=[pe.dict() for pe in pending],
                textual_justification=justification,
                algorithm_version=self.algorithm_version
            )
            db.add(match_rec)
            db.commit()

        return CandidateMatchingResponse(
            id=f"match-{job.id[:8]}-{candidate.id[:8]}",
            job_id=job.id,
            candidate_id=candidate.id,
            candidate_name=candidate.name,
            candidate_seniority=candidate.declared_seniority,
            candidate_experience_years=candidate.years_of_experience,
            report_version_id=report_version_id,
            overall_score=overall_score,
            hard_skills_score=hard_score,
            soft_skills_score=soft_score,
            experience_score=exp_score,
            conditions_score=conditions_score,
            evaluation_coverage=coverage_pct,
            is_objectively_incompatible=is_incompatible,
            incompatibility_reasons=incompatibilities,
            matched_skills=matched,
            partial_skills=partial,
            missing_skills=missing,
            pending_skills=pending,
            textual_justification=justification,
            algorithm_version=self.algorithm_version,
            evaluated_at=datetime.now(timezone.utc)
        )

    def _evaluate_objective_conditions(self, job: Job, candidate: Candidate) -> Tuple[bool, List[str], float]:
        """
        Stage 1: Evaluates contract type, work model, salary expectations.
        Distinguishes absolute incompatibility from negotiable preference using ObjectivePenalty constants.
        """
        incompatibilities = []
        score = 100.0

        # Contract Type (CLT / PJ)
        if job.contract_type != "INDIFERENTE" and candidate.contract_preference != "INDIFERENTE":
            if job.contract_type != candidate.contract_preference:
                incompatibilities.append(
                    f"Modalidade de contratação incompatível: Vaga exige '{job.contract_type}', candidato prefere '{candidate.contract_preference}'."
                )
                score -= ObjectivePenalty.CONTRACT_MISMATCH

        # Work Model (Remoto / Híbrido / Presencial)
        if job.work_model != "INDIFERENTE" and candidate.work_model_preference != "INDIFERENTE":
            if job.work_model == "PRESENCIAL" and candidate.work_model_preference == "REMOTO":
                incompatibilities.append("Regime de trabalho conflitante: Vaga presencial e candidato busca exclusivamente remoto.")
                score -= ObjectivePenalty.WORK_MODEL_CONFLICT
            elif job.work_model != candidate.work_model_preference:
                score -= ObjectivePenalty.WORK_MODEL_MISMATCH

        # Salary Expectation vs Job Range
        if candidate.salary_expectation and job.max_salary:
            if candidate.salary_expectation > (job.max_salary * ObjectivePenalty.SALARY_TOLERANCE_RATIO):
                incompatibilities.append(
                    f"Pretensão salarial (R$ {candidate.salary_expectation:,.2f}) substancialmente acima do teto da vaga (R$ {job.max_salary:,.2f})."
                )
                score -= ObjectivePenalty.SALARY_EXCESS

        score = max(0.0, score)
        is_incompatible = len(incompatibilities) > 0
        return is_incompatible, incompatibilities, score

    def _evaluate_experience(self, job: Job, candidate: Candidate) -> float:
        """Evaluates candidate years of experience against job requirement."""
        req_exp = job.min_experience_years
        cand_exp = candidate.years_of_experience

        if req_exp <= 0:
            return 100.0

        if cand_exp >= req_exp:
            # Bonus for exceeding experience, up to 100
            ratio = min(1.0, cand_exp / req_exp)
            return round(80.0 + (ratio * 20.0), 1)
        else:
            # Proportional penalty
            ratio = max(0.0, cand_exp / req_exp)
            return round(ratio * 75.0, 1)

    def _evaluate_competencies(
        self,
        requirements: List[JobSkillRequirement],
        assessments_map: Dict[str, CompetencyAssessment],
        declared_map: Dict[str, int]
    ) -> Tuple[List[MatchedSkillDetail], List[MatchedSkillDetail], float, float, float]:
        """
        Stage 2 & 3: Matches requirements against assessments and declared skills.
        Returns:
            (hard_details, soft_details, hard_score, soft_score, coverage_pct)
        """
        hard_reqs = [r for r in requirements if (r.skill and r.skill.category == "HARD") or (not r.skill and r.skill_id.startswith("hard"))]
        soft_reqs = [r for r in requirements if (r.skill and r.skill.category == "SOFT") or (not r.skill and r.skill_id.startswith("soft"))]

        total_evaluated_skills = 0
        total_required_skills = len(requirements)

        hard_details, hard_sum_score, hard_sum_weight, hard_eval = self._process_req_group(hard_reqs, assessments_map, declared_map)
        soft_details, soft_sum_score, soft_sum_weight, soft_eval = self._process_req_group(soft_reqs, assessments_map, declared_map)

        total_evaluated_skills = hard_eval + soft_eval

        hard_score = round((hard_sum_score / hard_sum_weight) * 100.0, 1) if hard_sum_weight > 0 else 100.0
        soft_score = round((soft_sum_score / soft_sum_weight) * 100.0, 1) if soft_sum_weight > 0 else 100.0

        coverage_pct = round((total_evaluated_skills / total_required_skills) * 100.0, 1) if total_required_skills > 0 else 100.0

        return hard_details, soft_details, hard_score, soft_score, coverage_pct

    def _process_req_group(
        self,
        reqs: List[JobSkillRequirement],
        assessments_map: Dict[str, CompetencyAssessment],
        declared_map: Dict[str, int]
    ) -> Tuple[List[MatchedSkillDetail], float, float, int]:
        details: List[MatchedSkillDetail] = []
        weighted_score_accum = 0.0
        total_weight = 0.0
        evaluated_count = 0

        for req in reqs:
            weight = req.weight * (1.5 if req.is_mandatory else 1.0)
            total_weight += weight

            skill_name = req.skill.name if req.skill else req.skill_id
            category = req.skill.category if req.skill else ("HARD" if req.skill_id.startswith("hard") else "SOFT")

            assessment = assessments_map.get(req.skill_id)
            declared_level = declared_map.get(req.skill_id)

            evidence_status = assessment.evidence_status if assessment else ("NAO_DECLARADA" if declared_level is None else "NAO_AVALIADA")
            estimated_level = assessment.estimated_level if assessment else None

            # Calculate alignment and score contribution
            alignment_status, skill_score_ratio, gap_notes = self._calculate_skill_alignment(
                req=req,
                evidence_status=evidence_status,
                estimated_level=estimated_level,
                declared_level=declared_level
            )

            if evidence_status in ["EVIDENCIADA", "PARCIALMENTE_EVIDENCIADA", "DIVERGENCIA_IDENTIFICADA"]:
                evaluated_count += 1

            weighted_score_accum += (skill_score_ratio * weight)

            details.append(MatchedSkillDetail(
                skill_id=req.skill_id,
                skill_name=skill_name,
                category=category,
                is_mandatory=req.is_mandatory,
                required_level=req.min_level,
                weight=req.weight,
                candidate_declared_level=declared_level,
                candidate_evidence_status=evidence_status,
                candidate_estimated_level=estimated_level,
                alignment_status=alignment_status,
                score_contribution=round(skill_score_ratio * 100.0, 1),
                gap_notes=gap_notes
            ))

        return details, weighted_score_accum, total_weight, evaluated_count

    def _calculate_skill_alignment(
        self,
        req: JobSkillRequirement,
        evidence_status: str,
        estimated_level: Optional[int],
        declared_level: Optional[int]
    ) -> Tuple[str, float, Optional[str]]:
        """
        Determines alignment status and proportional score ratio (0.0 to 1.0).
        Notice: Never assigns automatic 0 to 'NAO_AVALIADA'; treats it with partial baseline credit and flags it.
        """
        req_level = req.min_level

        if evidence_status == "EVIDENCIADA":
            level = estimated_level or declared_level or req_level
            if level >= req_level:
                return "ATENDIDO", AlignmentRatio.FULL_MATCH, None
            else:
                ratio = max(AlignmentRatio.PARTIAL_MID_BOUND, level / req_level)
                return "PARCIALMENTE_ATENDIDO", ratio, f"Nível evidenciado ({level}) ligeiramente abaixo do exigido ({req_level})."

        elif evidence_status == "PARCIALMENTE_EVIDENCIADA":
            level = estimated_level or 2
            ratio = min(AlignmentRatio.PARTIAL_HIGH_BOUND, max(AlignmentRatio.PARTIAL_LOW_BOUND, level / req_level))
            return "PARCIALMENTE_ATENDIDO", ratio, "Evidência parcial ou introdutória na entrevista."

        elif evidence_status == "NAO_AVALIADA":
            # Candidate declared or not, but not addressed in interview
            if declared_level and declared_level >= req_level:
                # Give partial benefit of the doubt, but flag as pending evaluation!
                return "PENDENTE_AVALIACAO", AlignmentRatio.PENDING_DECLARED, f"Autodeclarado nível {declared_level}, porém não avaliado na entrevista de triagem."
            else:
                return "PENDENTE_AVALIACAO", AlignmentRatio.PENDING_UNDECLARED, "Competência pendente de avaliação na entrevista."

        elif evidence_status == "DIVERGENCIA_IDENTIFICADA":
            return "PARCIALMENTE_ATENDIDO", AlignmentRatio.DISCREPANCY, "Identificada divergência entre autodeclaração e relatos da entrevista."

        elif evidence_status == "EVIDENCIA_INSUFICIENTE":
            return "NAO_ATENDIDO", AlignmentRatio.INSUFFICIENT_EVIDENCE, "Relato superficial sem dados comprobatórios suficientes."

        else: # NAO_DECLARADA / NÃO ABORDADA
            return "PENDENTE_AVALIACAO", AlignmentRatio.PENDING_UNADDRESSED, "Competência não abordada na entrevista de triagem; pendente de avaliação técnica."

    def _generate_justification(
        self,
        candidate: Candidate,
        job: Job,
        overall_score: float,
        hard_score: float,
        soft_score: float,
        exp_score: float,
        conditions_score: float,
        coverage_pct: float,
        is_incompatible: bool,
        incompatibilities: List[str],
        matched: List[MatchedSkillDetail],
        partial: List[MatchedSkillDetail],
        missing: List[MatchedSkillDetail],
        pending: List[MatchedSkillDetail]
    ) -> str:
        paragraphs = []

        # Overview
        paragraphs.append(
            f"O candidato {candidate.name} obteve índice de compatibilidade geral de {overall_score:.1f}% para a vaga '{job.title}'."
        )

        # Dimension breakdown
        paragraphs.append(
            f"Desempenho por dimensão: Hard Skills ({hard_score:.1f}%), Soft Skills ({soft_score:.1f}%), "
            f"Experiência ({exp_score:.1f}%) e Condições Objetivas ({conditions_score:.1f}%). "
            f"A cobertura de evidências da entrevista foi de {coverage_pct:.1f}% dos requisitos da vaga."
        )

        # Incompatibilities
        if is_incompatible:
            paragraphs.append(
                f"[ATENÇÃO - INCOMPATIBILIDADE OBJETIVA]: {'; '.join(incompatibilities)}"
            )

        # Strengths
        if matched:
            matched_names = [f"{m.skill_name} ({m.candidate_evidence_status})" for m in matched]
            paragraphs.append(f"Competências Plenamente Atendidas: {', '.join(matched_names)}.")

        # Partial & Gaps
        if partial:
            partial_names = [f"{p.skill_name} ({p.gap_notes or 'atendimento parcial'})" for p in partial]
            paragraphs.append(f"Atendimento Parcial / Lacunas: {', '.join(partial_names)}.")

        # Pending
        if pending:
            pending_names = [f"{pe.skill_name} ({pe.gap_notes})" for pe in pending]
            paragraphs.append(
                f"Avaliações Pendentes: {', '.join(pending_names)}. "
                f"Recomenda-se aprofundamento específico em entrevista técnica direcionada."
            )

        paragraphs.append(
            "NOTA METODOLÓGICA: Este índice é uma ferramenta de apoio analítico explicável e não substitui a decisão humana do recrutador."
        )

        return "\n\n".join(paragraphs)

    def rank_candidates_for_job(self, db: Session, job_id: str) -> JobMatchingRankingResponse:
        """
        Stage 4: Ranks all candidates in database against a specific job.
        """
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found.")

        candidates = db.query(Candidate).all()
        results: List[CandidateMatchingResponse] = []

        for cand in candidates:
            res = self.match_candidate_to_job(db, job, cand, persist=False)
            results.append(res)

        # Sort: First non-incompatible, then by overall score descending
        results.sort(
            key=lambda x: (not x.is_objectively_incompatible, x.overall_score, x.evaluation_coverage),
            reverse=True
        )

        return JobMatchingRankingResponse(
            job_id=job.id,
            job_title=job.title,
            company_name=job.company.name if job.company else "N/A",
            algorithm_weights={
                "hard_skills": self.w_hard,
                "soft_skills": self.w_soft,
                "experience": self.w_exp,
                "conditions": self.w_cond
            },
            total_candidates_evaluated=len(candidates),
            ranking=results
        )

    def compare_candidates(
        self,
        db: Session,
        job_id: str,
        candidate_ids: List[str]
    ) -> CandidateComparisonResponse:
        """
        Stage 5: Side-by-side comparison of 2+ candidates against exact same job requirements.
        """
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            raise ValueError(f"Job {job_id} not found.")

        candidates = db.query(Candidate).filter(Candidate.id.in_(candidate_ids)).all()
        items: List[CandidateComparisonItem] = []

        for cand in candidates:
            match_res = self.match_candidate_to_job(db, job, cand, persist=False)
            all_skills = match_res.matched_skills + match_res.partial_skills + match_res.missing_skills + match_res.pending_skills
            skill_matrix = {s.skill_id: s for s in all_skills}
            items.append(CandidateComparisonItem(
                candidate=match_res,
                competency_matrix=skill_matrix
            ))

        req_summary = [
            {
                "skill_id": r.skill_id,
                "skill_name": r.skill.name if r.skill else r.skill_id,
                "category": r.skill.category if r.skill else "HARD",
                "is_mandatory": r.is_mandatory,
                "min_level": r.min_level,
                "weight": r.weight
            }
            for r in job.skill_requirements
        ]

        summary = f"Comparação de {len(candidates)} candidatos para a vaga '{job.title}' sob as mesmas rubricas e pesos."

        return CandidateComparisonResponse(
            job_id=job.id,
            job_title=job.title,
            required_skills=req_summary,
            candidates=items,
            comparison_summary=summary
        )

# Global singleton instance
matching_engine_service = QIMatchmakerEngine()
