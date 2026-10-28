import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.database import Base, get_db
from app.main import app, initialize_database_data
from app.models.candidate import Candidate, CandidateDeclaredSkill, ConsentRecord
from app.models.job import Company, Job, JobSkillRequirement
from app.models.interview import InterviewSession, InterviewAnswer
from app.data.seed_catalog import INITIAL_SKILLS_CATALOG
from app.models.skill import SkillCatalog, SkillAlias

# Use separate in-memory SQLite for isolated tests
TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture(scope="session")
def test_engine():
    engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)

    # Seed basic skill catalog into test DB
    Session = sessionmaker(bind=engine)
    db = Session()
    for s in INITIAL_SKILLS_CATALOG:
        skill = SkillCatalog(
            id=s["id"],
            name=s["name"],
            category=s["category"],
            area=s.get("area"),
            description=s["description"],
            behavioral_examples=s.get("behavioral_examples"),
            evaluation_criteria=s.get("evaluation_criteria")
        )
        db.add(skill)
        db.flush()
        for alias in s.get("aliases", []):
            db.add(SkillAlias(skill_id=skill.id, alias=alias))

    # Seed interview questions into test DB
    from app.data.seed_questions import GENERAL_QUESTIONS_TYPE_A, JOB_DIRECTED_QUESTIONS_BANK
    from app.models.interview import InterviewQuestion
    for q_data in (GENERAL_QUESTIONS_TYPE_A + JOB_DIRECTED_QUESTIONS_BANK):
        q = InterviewQuestion(
            id=q_data["id"],
            text=q_data["text"],
            category=q_data["category"],
            target_competencies=q_data.get("target_competencies"),
            rubric=q_data.get("rubric"),
            order_index=q_data.get("order_index", 0)
        )
        db.add(q)

    db.commit()
    db.close()

    yield engine
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def db_session(test_engine):
    connection = test_engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()

    yield session

    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
