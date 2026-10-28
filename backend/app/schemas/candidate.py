from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class CandidateSkillInput(BaseModel):
    skill_id: str
    declared_level: int = Field(ge=1, le=5, description="Proficiency from 1 (Básico) to 5 (Especialista)")
    notes: Optional[str] = None

class CandidateSkillResponse(BaseModel):
    id: int
    skill_id: str
    skill_name: Optional[str] = None
    skill_category: Optional[str] = None
    declared_level: int
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class ConsentInput(BaseModel):
    purpose: str = "Mapeamento de competências e correspondência com oportunidades de trabalho"
    legal_basis: str = "CONSENTIMENTO_LGPD"
    granted: bool = True

class ConsentResponse(BaseModel):
    id: str
    purpose: str
    legal_basis: str
    granted: bool
    created_at: datetime

    class Config:
        from_attributes = True

class CandidateCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    tech_area: str = Field(example="Engenharia de Software")
    declared_seniority: str = Field(example="Pleno")
    years_of_experience: float = Field(ge=0.0, example=3.5)
    contract_preference: str = Field(default="INDIFERENTE", description="CLT, PJ, or INDIFERENTE")
    work_model_preference: str = Field(default="REMOTO", description="REMOTO, HIBRIDO, PRESENCIAL, or INDIFERENTE")
    salary_expectation: Optional[float] = Field(default=None, ge=0.0)
    bio_summary: Optional[str] = None
    declared_skills: Optional[List[CandidateSkillInput]] = []
    consent: Optional[ConsentInput] = None

class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    tech_area: Optional[str] = None
    declared_seniority: Optional[str] = None
    years_of_experience: Optional[float] = None
    contract_preference: Optional[str] = None
    work_model_preference: Optional[str] = None
    salary_expectation: Optional[float] = None
    bio_summary: Optional[str] = None

class CandidateResponse(BaseModel):
    id: str
    name: str
    email: str
    tech_area: str
    declared_seniority: str
    years_of_experience: float
    contract_preference: str
    work_model_preference: str
    salary_expectation: Optional[float] = None
    bio_summary: Optional[str] = None
    created_at: datetime
    declared_skills: List[CandidateSkillResponse] = []

    class Config:
        from_attributes = True
