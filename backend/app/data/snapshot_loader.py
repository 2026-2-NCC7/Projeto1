import os
import json
import logging
from sqlalchemy import text
from app.database import engine

logger = logging.getLogger("qi_matchmaker.seed_loader")

SNAPSHOT_FILE = os.path.join(os.path.dirname(__file__), "seed_snapshot.json")

def load_snapshot_if_empty(db):
    """
    Popula o banco de dados com os candidatos, vagas, entrevistas e laudos de IA
    caso a tabela assessment_reports esteja vazia (ex: em computadores novos ou clones do Git).
    """
    try:
        from app.models.assessment import AssessmentReport
        count = db.query(AssessmentReport).count()
        if count > 0:
            return  # Já possui relatórios populados

        if not os.path.exists(SNAPSHOT_FILE):
            logger.warning(f"Snapshot file not found: {SNAPSHOT_FILE}")
            return

        logger.info("Carregando snapshot inicial de laudos e candidatos de demonstração...")
        with open(SNAPSHOT_FILE, "r", encoding="utf-8") as f:
            snapshot = json.load(f)

        tables_order = [
            "companies",
            "candidates",
            "jobs",
            "job_skill_requirements",
            "interview_sessions",
            "interview_answers",
            "assessment_reports",
            "report_versions",
            "competency_assessments",
            "competency_evidences",
            "report_reviews"
        ]

        with engine.begin() as conn:
            for table in tables_order:
                rows = snapshot.get(table, [])
                if not rows:
                    continue

                for row in rows:
                    cols = list(row.keys())
                    placeholders = [f":{c}" for c in cols]
                    sql = text(f"INSERT OR IGNORE INTO {table} ({', '.join(cols)}) VALUES ({', '.join(placeholders)})")
                    conn.execute(sql, row)

        logger.info("Snapshot inicial carregado com sucesso no banco de dados!")
    except Exception as e:
        logger.error(f"Erro ao carregar snapshot inicial: {e}", exc_info=True)
