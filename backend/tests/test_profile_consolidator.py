import pytest
from app.models.candidate import Candidate, CandidateDeclaredSkill
from app.models.interview import InterviewSession, InterviewAnswer
from app.schemas.assessment import LLMExtractionResult, ExtractedCompetencyItem, ExtractedEvidenceItem
from app.core.profile_consolidator import ProfileConsolidator

def test_preliminary_report_and_replica_versioning(db_session):
    # 1. Setup candidate and interview
    candidate = Candidate(
        name="Teste Candidato",
        email="teste.cand@exemplo.com",
        tech_area="Engenharia de Software",
        declared_seniority="Pleno",
        years_of_experience=3.0
    )
    db_session.add(candidate)
    db_session.flush()

    db_session.add(CandidateDeclaredSkill(candidate_id=candidate.id, skill_id="hard-python", declared_level=4))
    db_session.add(CandidateDeclaredSkill(candidate_id=candidate.id, skill_id="hard-sql", declared_level=3))

    session = InterviewSession(candidate_id=candidate.id, interview_type="TIPO_A_GERAL", status="CONCLUIDA")
    db_session.add(session)
    db_session.flush()

    # 2. Simulate extraction result
    extraction = LLMExtractionResult(
        candidate_id=candidate.id,
        interview_id=session.id,
        competencies=[
            ExtractedCompetencyItem(
                skill_id="hard-python",
                skill_name="Python",
                evidence_status="EVIDENCIADA",
                estimated_level=4,
                evidence=[
                    ExtractedEvidenceItem(
                        question_id="q-001",
                        exact_quote="Desenvolvi uma API REST com FastAPI e Python.",
                        explanation="Citação concreta de desenvolvimento com Python."
                    )
                ],
                explanation="O candidato demonstrou domínio prático em Python.",
                requires_review=False,
                is_suggested=False
            ),
            ExtractedCompetencyItem(
                skill_id="hard-sql",
                skill_name="SQL & Bancos Relacionais",
                evidence_status="NAO_AVALIADA",
                estimated_level=None,
                evidence=[],
                explanation="A competência não foi abordada na entrevista.",
                requires_review=False,
                is_suggested=False
            ),
            ExtractedCompetencyItem(
                skill_id="soft-gestao-conflitos",
                skill_name="Gestão de Conflitos",
                evidence_status="EVIDENCIADA",
                estimated_level=3,
                evidence=[
                    ExtractedEvidenceItem(
                        question_id="q-005",
                        exact_quote="Mediei uma divergência técnica entre colegas de forma construtiva.",
                        explanation="Exemplo concreto de mediação."
                    )
                ],
                explanation="Competência sugerida a partir de relato da entrevista.",
                requires_review=False,
                is_suggested=True
            )
        ]
    )

    # 3. Create Preliminary Report (Version 1)
    report = ProfileConsolidator.create_preliminary_report(
        db=db_session,
        candidate_id=candidate.id,
        interview_id=session.id,
        extraction_result=extraction
    )

    assert report.active_version_number == 1
    assert len(report.versions) == 1
    v1 = report.versions[0]
    assert v1.version_number == 1
    assert v1.status == "ATIVO"
    assert len(v1.assessments) == 3

    # Check state assignments
    py_ass = next(a for a in v1.assessments if a.skill_id == "hard-python")
    assert py_ass.evidence_status == "EVIDENCIADA"
    assert py_ass.declared is True
    assert len(py_ass.evidences) == 1

    sql_ass = next(a for a in v1.assessments if a.skill_id == "hard-sql")
    assert sql_ass.evidence_status == "NAO_AVALIADA"
    assert sql_ass.estimated_level is None

    conf_ass = next(a for a in v1.assessments if a.skill_id == "soft-gestao-conflitos")
    assert conf_ass.is_suggested is True
    assert conf_ass.declared is False

    # 4. Test Scenario F: Candidate submits Replica -> Creates Version 2 while preserving Version 1!
    review = ProfileConsolidator.process_candidate_replica(
        db=db_session,
        report_id=report.id,
        candidate_id=candidate.id,
        skill_id="hard-sql",
        replica_text="Gostaria de registrar que possuo 3 anos de experiência com SQL e PostgreSQL em produção."
    )

    assert review.status == "ENCAMINHADA_HUMANO"
    assert report.active_version_number == 2
    assert len(report.versions) == 2

    # Check that Version 1 remains intact in archive
    v1_recheck = next(v for v in report.versions if v.version_number == 1)
    assert v1_recheck.status == "ARQUIVADO"

    # Check Version 2 reflects the contested skill
    v2 = next(v for v in report.versions if v.version_number == 2)
    assert v2.status == "ATIVO"
    contested_in_v2 = next(a for a in v2.assessments if a.skill_id == "hard-sql")
    assert contested_in_v2.evidence_status == "DIVERGENCIA_IDENTIFICADA"
    assert contested_in_v2.requires_review is True
    assert "Contestação registrada pelo candidato" in contested_in_v2.explanation
