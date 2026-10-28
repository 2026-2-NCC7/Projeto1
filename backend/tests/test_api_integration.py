import pytest

def test_system_health_endpoint(client):
    res = client.get("/api/v1/system/health")
    assert res.status_code == 200
    data = res.json()
    assert data["database_connected"] is True
    assert len(data["models"]) == 3

def test_skills_catalog_endpoint(client):
    res = client.get("/api/v1/skills")
    assert res.status_code == 200
    skills = res.json()
    assert len(skills) >= 40
    # Check both HARD and SOFT categories exist
    categories = {s["category"] for s in skills}
    assert "HARD" in categories
    assert "SOFT" in categories

def test_candidate_registration_and_flow(client):
    # 1. Register candidate
    cand_payload = {
        "name": "Mariana Teste",
        "email": "mariana.teste@exemplo.com",
        "tech_area": "Engenharia de Dados",
        "declared_seniority": "Pleno",
        "years_of_experience": 3.0,
        "contract_preference": "CLT",
        "work_model_preference": "REMOTO",
        "declared_skills": [
            {"skill_id": "hard-python", "declared_level": 4},
            {"skill_id": "hard-sql", "declared_level": 3}
        ],
        "consent": {
            "purpose": "Triagem para vagas",
            "legal_basis": "CONSENTIMENTO_LGPD",
            "granted": True
        }
    }
    create_res = client.post("/api/v1/candidates", json=cand_payload)
    assert create_res.status_code == 201
    cand_data = create_res.json()
    cand_id = cand_data["id"]

    # 2. Start Interview Session
    sess_res = client.post("/api/v1/interviews", json={
        "candidate_id": cand_id,
        "interview_type": "TIPO_A_GERAL"
    })
    assert sess_res.status_code == 201
    sess_id = sess_res.json()["id"]

    # 3. Get Questions
    q_res = client.get(f"/api/v1/interviews/{sess_id}/questions")
    assert q_res.status_code == 200
    questions = q_res.json()
    assert len(questions) >= 6

    # 4. Submit Answer
    ans_res = client.post("/api/v1/interviews/answers/text", json={
        "session_id": sess_id,
        "question_id": questions[0]["id"],
        "text": "Desenvolvi scripts e pipelines em Python para ingestão de dados em bancos relacionais com SQL."
    })
    assert ans_res.status_code == 200
    ans_id = ans_res.json()["id"]

    # 5. Candidate edits/reviews transcript before analysis
    edit_res = client.put(f"/api/v1/interviews/answers/{ans_id}", json={
        "edited_text": "Desenvolvi scripts e pipelines robustos em Python para ingestão de dados em bancos relacionais com SQL e PostgreSQL."
    })
    assert edit_res.status_code == 200
    assert "robustos" in edit_res.json()["edited_text"]

    # 6. Analyze Interview
    analyze_res = client.post(f"/api/v1/interviews/{sess_id}/analyze")
    assert analyze_res.status_code == 200
    report_id = analyze_res.json()["report_id"]

    # 7. Get Report
    rep_res = client.get(f"/api/v1/reports/{report_id}")
    assert rep_res.status_code == 200
    report_data = rep_res.json()
    assert report_data["active_version_number"] == 1
    assert len(report_data["active_version"]["assessments"]) >= 1

    # 8. Submit Replica (Cenário F)
    replica_res = client.post(f"/api/v1/reports/{report_id}/replica", json={
        "skill_id": "hard-sql",
        "replica_text": "Solicito revisão na competência SQL pois tenho experiência prática em PostgreSQL demonstrada."
    })
    assert replica_res.status_code == 201
    assert replica_res.json()["status"] == "ENCAMINHADA_HUMANO"

    # Verify Report is now on Version 2
    rep_v2_res = client.get(f"/api/v1/reports/{report_id}")
    assert rep_v2_res.json()["active_version_number"] == 2

def test_job_creation_and_matching(client):
    # 1. Create Company
    comp_res = client.post("/api/v1/companies", json={
        "name": "Fintech Alpha",
        "industry": "Fintech"
    })
    assert comp_res.status_code == 201
    comp_id = comp_res.json()["id"]

    # 2. Create Job
    job_res = client.post("/api/v1/jobs", json={
        "company_id": comp_id,
        "title": "Engenheiro Python",
        "description": "Vaga para desenvolvedor Python Pleno",
        "tech_vertical": "Backend",
        "seniority": "Pleno",
        "contract_type": "CLT",
        "work_model": "REMOTO",
        "skills": [
            {"skill_id": "hard-python", "is_mandatory": True, "min_level": 3, "weight": 2.0}
        ]
    })
    assert job_res.status_code == 201
    job_id = job_res.json()["id"]

    # 3. Run Matching
    match_res = client.post(f"/api/v1/matching/jobs/{job_id}/run")
    assert match_res.status_code == 200
    ranking = match_res.json()
    assert "ranking" in ranking
    assert "algorithm_weights" in ranking
