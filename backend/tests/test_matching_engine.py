import pytest
from app.models.job import Company, Job, JobSkillRequirement
from app.models.candidate import Candidate, CandidateDeclaredSkill
from app.models.interview import InterviewSession
from app.models.assessment import AssessmentReport, ReportVersion, CompetencyAssessment
from app.core.matching_engine import (
    QIMatchmakerEngine, MatchingWeights, AlignmentRatio, ObjectivePenalty
)

def test_matching_weights_value_object_validation():
    # Valid default weights
    weights = MatchingWeights()
    assert weights.hard_skills == 0.50
    assert weights.soft_skills == 0.25
    assert weights.experience == 0.15
    assert weights.conditions == 0.10
    weights.validate() # Should not raise

    # Valid custom weights
    custom_valid = MatchingWeights(
        hard_skills=0.60,
        soft_skills=0.20,
        experience=0.10,
        conditions=0.10
    )
    custom_valid.validate() # Total 1.0 -> Valid

    # Invalid weights (sum = 1.30 != 1.0)
    invalid_weights = MatchingWeights(
        hard_skills=0.70,
        soft_skills=0.30,
        experience=0.20,
        conditions=0.10
    )
    with pytest.raises(ValueError, match="A soma dos pesos deve totalizar 1.0"):
        invalid_weights.validate()

def test_engine_initialization_with_matching_weights_vo():
    custom_weights = MatchingWeights(
        hard_skills=0.40,
        soft_skills=0.30,
        experience=0.20,
        conditions=0.10
    )
    engine = QIMatchmakerEngine(weights=custom_weights)
    assert engine.w_hard == 0.40
    assert engine.w_soft == 0.30
    assert engine.w_exp == 0.20
    assert engine.w_cond == 0.10
    assert engine.algorithm_version == "v1.1-refactored-xp"

def test_compute_overall_score_pure_function():
    engine = QIMatchmakerEngine() # 0.50, 0.25, 0.15, 0.10
    # Perfect score across all dimensions
    assert engine.compute_overall_score(100.0, 100.0, 100.0, 100.0) == 100.0

    # Zero score
    assert engine.compute_overall_score(0.0, 0.0, 0.0, 0.0) == 0.0

    # Weighted calculation: 0.50*80 + 0.25*60 + 0.15*70 + 0.10*90
    # = 40 + 15 + 10.5 + 9 = 74.5
    score = engine.compute_overall_score(80.0, 60.0, 70.0, 90.0)
    assert score == 74.5

def test_alignment_ratio_constants_bounds():
    assert AlignmentRatio.FULL_MATCH == 1.0
    assert AlignmentRatio.PARTIAL_HIGH_BOUND == 0.75
    assert AlignmentRatio.PARTIAL_MID_BOUND == 0.50
    assert AlignmentRatio.PARTIAL_LOW_BOUND == 0.40
    assert AlignmentRatio.PENDING_DECLARED == 0.50
    assert AlignmentRatio.INSUFFICIENT_EVIDENCE == 0.15


def test_objective_conditions_evaluation():
    engine = QIMatchmakerEngine()

    job = Job(
        title="Vaga Remota CLT",
        description="Teste",
        tech_vertical="Backend",
        seniority="Pleno",
        contract_type="CLT",
        work_model="REMOTO",
        max_salary=10000.0,
        min_experience_years=2.0
    )

    # Candidate 1: Perfect match on conditions
    cand1 = Candidate(
        name="Cand Compativel",
        email="c1@test.com",
        tech_area="Backend",
        declared_seniority="Pleno",
        years_of_experience=3.0,
        contract_preference="CLT",
        work_model_preference="REMOTO",
        salary_expectation=9500.0
    )
    is_incomp1, reasons1, score1 = engine._evaluate_objective_conditions(job, cand1)
    assert is_incomp1 is False
    assert len(reasons1) == 0
    assert score1 == 100.0

    # Candidate 2: Incompatible work model (Onsite vs Remote) and salary
    cand2 = Candidate(
        name="Cand Incompativel",
        email="c2@test.com",
        tech_area="Backend",
        declared_seniority="Pleno",
        years_of_experience=3.0,
        contract_preference="PJ",
        work_model_preference="REMOTO",
        salary_expectation=15000.0 # 50% above max salary
    )
    job_presencial = Job(
        title="Vaga Presencial CLT",
        description="Teste",
        tech_vertical="Backend",
        seniority="Pleno",
        contract_type="CLT",
        work_model="PRESENCIAL",
        max_salary=10000.0,
        min_experience_years=2.0
    )
    is_incomp2, reasons2, score2 = engine._evaluate_objective_conditions(job_presencial, cand2)
    assert is_incomp2 is True
    assert len(reasons2) >= 2
    assert score2 < 50.0

def test_matching_score_formula_and_coverage(db_session):
    engine = QIMatchmakerEngine(
        weight_hard=0.50,
        weight_soft=0.25,
        weight_exp=0.15,
        weight_cond=0.10
    )

    comp = Company(name="Empresa Teste")
    db_session.add(comp)
    db_session.flush()

    job = Job(
        company_id=comp.id,
        title="Engenharia de Dados",
        description="Teste",
        tech_vertical="Data",
        seniority="Pleno",
        contract_type="CLT",
        work_model="REMOTO",
        min_experience_years=3.0
    )
    db_session.add(job)
    db_session.flush()

    # Requisitos: Python (hard, mand), SQL (hard, mand), AWS (hard, mand - Cenário E: pendente), Comunicacao (soft)
    reqs = [
        JobSkillRequirement(job_id=job.id, skill_id="hard-python", is_mandatory=True, min_level=3, weight=2.0),
        JobSkillRequirement(job_id=job.id, skill_id="hard-sql", is_mandatory=True, min_level=3, weight=2.0),
        JobSkillRequirement(job_id=job.id, skill_id="hard-aws", is_mandatory=True, min_level=3, weight=1.0),
        JobSkillRequirement(job_id=job.id, skill_id="soft-comunicacao", is_mandatory=False, min_level=3, weight=1.0)
    ]
    db_session.add_all(reqs)

    cand = Candidate(
        name="Candidato Cenário E",
        email="candE@test.com",
        tech_area="Data",
        declared_seniority="Pleno",
        years_of_experience=4.0,
        contract_preference="CLT",
        work_model_preference="REMOTO"
    )
    db_session.add(cand)
    db_session.flush()

    # Create report where Python and SQL are EVIDENCIADA, but AWS is not addressed
    report = AssessmentReport(candidate_id=cand.id, interview_id="dummy-session", status="CONSOLIDADO", active_version_number=1)
    db_session.add(report)
    db_session.flush()

    v1 = ReportVersion(report_id=report.id, version_number=1, status="ATIVO")
    db_session.add(v1)
    db_session.flush()

    db_session.add_all([
        CompetencyAssessment(version_id=v1.id, skill_id="hard-python", declared=True, declared_level=4, evidence_status="EVIDENCIADA", estimated_level=4, explanation="Evidência consistente"),
        CompetencyAssessment(version_id=v1.id, skill_id="hard-sql", declared=True, declared_level=4, evidence_status="EVIDENCIADA", estimated_level=4, explanation="Evidência consistente"),
        CompetencyAssessment(version_id=v1.id, skill_id="soft-comunicacao", declared=True, declared_level=4, evidence_status="EVIDENCIADA", estimated_level=4, explanation="Evidência consistente")
    ])
    db_session.commit()

    # Run matching
    match_result = engine.match_candidate_to_job(db=db_session, job=job, candidate=cand, persist=False)

    # Assertions
    assert match_result.overall_score > 70.0
    # AWS should be in pending_skills, not missing! (Cenário E requirement)
    pending_ids = [p.skill_id for p in match_result.pending_skills]
    assert "hard-aws" in pending_ids

    # Evaluation coverage: 3 out of 4 skills evaluated = 75.0%
    assert match_result.evaluation_coverage == 75.0

    # Justification text includes breakdown
    assert "Hard Skills" in match_result.textual_justification
    assert "Avaliações Pendentes" in match_result.textual_justification

def test_candidate_comparison_side_by_side(db_session):
    engine = QIMatchmakerEngine()

    comp = Company(name="Empresa Teste 2")
    db_session.add(comp)
    db_session.flush()

    job = Job(
        company_id=comp.id,
        title="Full Stack Python",
        description="Teste",
        tech_vertical="Fullstack",
        seniority="Pleno",
        contract_type="INDIFERENTE",
        work_model="REMOTO",
        min_experience_years=2.0
    )
    db_session.add(job)
    db_session.flush()

    db_session.add(JobSkillRequirement(job_id=job.id, skill_id="hard-python", is_mandatory=True, min_level=3, weight=1.0))
    db_session.add(JobSkillRequirement(job_id=job.id, skill_id="hard-react", is_mandatory=True, min_level=3, weight=1.0))

    cand_a = Candidate(name="Candidato A", email="ca@test.com", tech_area="Fullstack", declared_seniority="Pleno", years_of_experience=3.0)
    cand_b = Candidate(name="Candidato B", email="cb@test.com", tech_area="Fullstack", declared_seniority="Júnior", years_of_experience=1.5)
    db_session.add_all([cand_a, cand_b])
    db_session.commit()

    comparison = engine.compare_candidates(db=db_session, job_id=job.id, candidate_ids=[cand_a.id, cand_b.id])

    assert len(comparison.candidates) == 2
    assert "hard-python" in comparison.candidates[0].competency_matrix
    assert "hard-react" in comparison.candidates[0].competency_matrix
    assert len(comparison.required_skills) == 2
