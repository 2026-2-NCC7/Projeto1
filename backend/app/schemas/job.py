from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class CompanyCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    industry: Optional[str] = None
    description: Optional[str] = None

class CompanyResponse(BaseModel):
    id: str
    name: str
    industry: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class JobSkillRequirementCreate(BaseModel):
    skill_id: str
    is_mandatory: bool = True # true = obrigatória / eliminatória
    min_level: int = Field(ge=1, le=5, default=3)
    weight: float = Field(ge=0.5, le=5.0, default=1.0)

class JobSkillRequirementResponse(BaseModel):
    id: int
    skill_id: str
    skill_name: Optional[str] = None
    skill_category: Optional[str] = None
    is_mandatory: bool
    min_level: int
    weight: float

    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    company_id: str
    title: str = Field(min_length=3, max_length=255)
    description: str
    tech_vertical: str = Field(example="Data Engineering")
    seniority: str = Field(example="Pleno")
    contract_type: str = Field(default="INDIFERENTE", description="CLT, PJ, or INDIFERENTE")
    work_model: str = Field(default="REMOTO", description="REMOTO, HIBRIDO, PRESENCIAL, or INDIFERENTE")
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    min_experience_years: float = Field(default=0.0, ge=0.0)
    skills: List[JobSkillRequirementCreate] = []

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_vertical: Optional[str] = None
    seniority: Optional[str] = None
    contract_type: Optional[str] = None
    work_model: Optional[str] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    min_experience_years: Optional[float] = None
    status: Optional[str] = None

class JobResponse(BaseModel):
    id: str
    company_id: str
    company_name: Optional[str] = None
    title: str
    description: str
    tech_vertical: str
    seniority: str
    contract_type: str
    work_model: str
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    min_experience_years: float
    status: str
    created_at: datetime
    skill_requirements: List[JobSkillRequirementResponse] = []

    class Config:
        from_attributes = True
