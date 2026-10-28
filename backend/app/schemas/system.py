from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class ModelStatus(BaseModel):
    name: str
    role: str
    target_engine: str
    available: bool
    device: str
    details: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    database_connected: bool
    models: List[ModelStatus] = []

class AuditEventResponse(BaseModel):
    id: str
    event_type: str
    entity_name: str
    entity_id: str
    model_version: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True
