import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api import candidates, skills, interviews, reports, jobs, matching, system
from app.data.seed_catalog import INITIAL_SKILLS_CATALOG
from app.data.seed_questions import GENERAL_QUESTIONS_TYPE_A, JOB_DIRECTED_QUESTIONS_BANK
from app.models.skill import SkillCatalog, SkillAlias
from app.models.interview import InterviewQuestion
from app.core.semantic_embedder import vector_store

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("qi_matchmaker")

def initialize_database_data():
    """Seeds skill catalog and interview questions into database on first startup."""
    logger.info("Initializing database tables and initial catalog...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Skills Catalog
        existing_skills_count = db.query(SkillCatalog).count()
        if existing_skills_count == 0:
            logger.info(f"Seeding {len(INITIAL_SKILLS_CATALOG)} skills into database...")
            for s_data in INITIAL_SKILLS_CATALOG:
                skill = SkillCatalog(
                    id=s_data["id"],
                    name=s_data["name"],
                    category=s_data["category"],
                    area=s_data.get("area"),
                    description=s_data["description"],
                    behavioral_examples=s_data.get("behavioral_examples"),
                    evaluation_criteria=s_data.get("evaluation_criteria")
                )
                db.add(skill)
                db.flush()

                for alias in s_data.get("aliases", []):
                    db.add(SkillAlias(skill_id=skill.id, alias=alias))

            db.commit()
            logger.info("Skill catalog seeded successfully.")

        # 2. Seed Interview Questions
        existing_questions_count = db.query(InterviewQuestion).count()
        if existing_questions_count == 0:
            logger.info("Seeding interview questions bank...")
            all_questions = GENERAL_QUESTIONS_TYPE_A + JOB_DIRECTED_QUESTIONS_BANK
            for q_data in all_questions:
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
            logger.info("Interview questions seeded successfully.")

        # 3. Index skills in semantic vector store
        all_skills = db.query(SkillCatalog).all()
        skills_for_indexing = [
            {
                "id": s.id,
                "name": s.name,
                "category": s.category,
                "description": s.description,
                "aliases": [a.alias for a in s.aliases]
            }
            for s in all_skills
        ]
        vector_store.index_skill_catalog(skills_for_indexing)

    except Exception as e:
        logger.error(f"Error during database initialization: {e}")
        db.rollback()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    initialize_database_data()
    yield
    # Shutdown
    logger.info(f"Shutting down {settings.APP_NAME}")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Motor Inteligente para Mapeamento de Competências e Correspondência entre Candidatos e Vagas de Tecnologia.",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Versioned API Routers
api_v1_prefix = settings.API_V1_PREFIX
app.include_router(candidates.router, prefix=api_v1_prefix)
app.include_router(skills.router, prefix=api_v1_prefix)
app.include_router(interviews.router, prefix=api_v1_prefix)
app.include_router(reports.router, prefix=api_v1_prefix)
app.include_router(jobs.router, prefix=api_v1_prefix)
app.include_router(matching.router, prefix=api_v1_prefix)
app.include_router(system.router, prefix=api_v1_prefix)

@app.get("/")
def root():
    return {
        "engine": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs_url": "/docs",
        "api_v1": api_v1_prefix
    }
