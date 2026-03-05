from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Optional

class CommuteMode(str, Enum):
    driving = "driving"
    transit = "transit"

class JobBase(BaseModel):
    title: str
    company_name: str
    office_address: str
    candidate_radius_km: Optional[int] = 30
    enforce_radius: bool = False

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    office_lat: float
    office_lng: float
    distance_km: Optional[float] = None
    
    model_config = ConfigDict(from_attributes=True)
