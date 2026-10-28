from typing import List, Dict, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class SkillAliasBase(BaseModel):
    alias: str

class SkillAliasResponse(SkillAliasBase):
    id: int
    skill_id: str

    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    id: str
    name: str
    category: str = Field(description="'HARD' or 'SOFT'")
    area: Optional[str] = None
    description: str
    behavioral_examples: Optional[List[str]] = None
    evaluation_criteria: Optional[Dict[str, str]] = None

class SkillResponse(SkillBase):
    aliases: List[SkillAliasResponse] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
