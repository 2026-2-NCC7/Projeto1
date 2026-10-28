from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import Company, Job, JobSkillRequirement
from app.models.skill import SkillCatalog
from app.schemas.job import (
    CompanyCreate, CompanyResponse,
    JobCreate, JobUpdate, JobResponse,
    JobSkillRequirementCreate, JobSkillRequirementResponse
)

router = APIRouter(prefix="", tags=["Jobs & Companies"])

# --- Companies Endpoints ---
@router.post("/companies", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyCreate, db: Session = Depends(get_db)):
    company = Company(
        name=payload.name,
        industry=payload.industry,
        description=payload.description
    )
    db.add(company)
    db.commit()
    db.refresh(company)
    return company

@router.get("/companies", response_model=List[CompanyResponse])
def list_companies(db: Session = Depends(get_db)):
    return db.query(Company).order_by(Company.name).all()

# --- Jobs Endpoints ---
@router.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(payload: JobCreate, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == payload.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada.")

    job = Job(
        company_id=payload.company_id,
        title=payload.title,
        description=payload.description,
        tech_vertical=payload.tech_vertical,
        seniority=payload.seniority,
        contract_type=payload.contract_type,
        work_model=payload.work_model,
        min_salary=payload.min_salary,
        max_salary=payload.max_salary,
        min_experience_years=payload.min_experience_years,
        status="ABERTA"
    )
    db.add(job)
    db.flush()

    for sk in payload.skills:
        valid_skill = db.query(SkillCatalog).filter(SkillCatalog.id == sk.skill_id).first()
        if valid_skill:
            req = JobSkillRequirement(
                job_id=job.id,
                skill_id=sk.skill_id,
                is_mandatory=sk.is_mandatory,
                min_level=sk.min_level,
                weight=sk.weight
            )
            db.add(req)

    db.commit()
    db.refresh(job)
    job.company_name = company.name
    return job

@router.get("/jobs", response_model=List[JobResponse])
def list_jobs(
    tech_vertical: Optional[str] = None,
    seniority: Optional[str] = None,
    status_filter: Optional[str] = "ABERTA",
    db: Session = Depends(get_db)
):
    query = db.query(Job)
    if status_filter:
        query = query.filter(Job.status == status_filter)
    if tech_vertical:
        query = query.filter(Job.tech_vertical.ilike(f"%{tech_vertical}%"))
    if seniority:
        query = query.filter(Job.seniority == seniority)

    jobs = query.order_by(Job.created_at.desc()).all()
    for j in jobs:
        j.company_name = j.company.name if j.company else ""
    return jobs

@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada.")
    job.company_name = job.company.name if job.company else ""
    return job

@router.put("/jobs/{job_id}", response_model=JobResponse)
def update_job(job_id: str, payload: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada.")

    update_data = payload.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(job, k, v)

    db.commit()
    db.refresh(job)
    job.company_name = job.company.name if job.company else ""
    return job

@router.post("/jobs/{job_id}/requirements", response_model=JobSkillRequirementResponse)
def add_job_requirement(job_id: str, payload: JobSkillRequirementCreate, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Vaga não encontrada.")

    valid_skill = db.query(SkillCatalog).filter(SkillCatalog.id == payload.skill_id).first()
    if not valid_skill:
        raise HTTPException(status_code=404, detail="Competência não existe no catálogo.")

    req = JobSkillRequirement(
        job_id=job_id,
        skill_id=payload.skill_id,
        is_mandatory=payload.is_mandatory,
        min_level=payload.min_level,
        weight=payload.weight
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    req.skill_name = valid_skill.name
    req.skill_category = valid_skill.category
    return req
