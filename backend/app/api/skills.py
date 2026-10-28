from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.skill import SkillCatalog, SkillAlias
from app.schemas.skill import SkillResponse
from app.core.semantic_embedder import vector_store

router = APIRouter(prefix="/skills", tags=["Competency Catalog"])

@router.get("", response_model=List[SkillResponse])
def list_skills(
    category: Optional[str] = Query(None, description="'HARD' or 'SOFT'"),
    area: Optional[str] = Query(None, description="Filter by area e.g. 'Backend', 'Dados'"),
    search: Optional[str] = Query(None, description="Search term in name, description or aliases"),
    db: Session = Depends(get_db)
):
    query = db.query(SkillCatalog)
    if category:
        query = query.filter(SkillCatalog.category == category.upper())
    if area:
        query = query.filter(SkillCatalog.area.ilike(f"%{area}%"))
    if search:
        query = query.filter(
            (SkillCatalog.name.ilike(f"%{search}%")) |
            (SkillCatalog.description.ilike(f"%{search}%"))
        )
    return query.order_by(SkillCatalog.category.desc(), SkillCatalog.name).all()

@router.get("/{skill_id}", response_model=SkillResponse)
def get_skill(skill_id: str, db: Session = Depends(get_db)):
    skill = db.query(SkillCatalog).filter(SkillCatalog.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Competência não encontrada no catálogo.")
    return skill

@router.post("/search-semantic")
def search_skills_semantically(
    query: str = Query(..., description="Termo ou frase para busca semântica"),
    top_k: int = Query(5, ge=1, le=20)
):
    """
    Searches skill catalog using vector embeddings (intfloat/multilingual-e5-small)
    and cosine similarity.
    """
    matches = vector_store.search_similar_skills(query=query, top_k=top_k)
    return {
        "query": query,
        "total_results": len(matches),
        "results": matches
    }
