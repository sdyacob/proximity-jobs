from fastapi import APIRouter, Query, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel

from ..schemas.job import JobResponse, CommuteMode
from ..core.commute import get_cached_commute, cache_commute, cost_saving_fallback

router = APIRouter(prefix="/jobs", tags=["jobs"])

# Dummy data for Phase 2A/2B
mock_jobs = [
    {
        "id": 1,
        "title": "Software Engineer",
        "company_name": "TechCorp",
        "office_address": "OMR, Chennai",
        "office_lat": 12.9716,
        "office_lng": 80.2496,
        "candidate_radius_km": 30,
        "enforce_radius": False,
        "distance_km": 5.2
    },
    {
        "id": 2,
        "title": "Product Manager",
        "company_name": "Startup Inc",
        "office_address": "Guindy, Chennai",
        "office_lat": 13.0067,
        "office_lng": 80.2206,
        "candidate_radius_km": 15,
        "enforce_radius": True,
        "distance_km": 12.4
    }
]

@router.get("/", response_model=List[JobResponse])
def get_jobs(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: int = Query(30),
    mode: CommuteMode = Query(CommuteMode.driving),
    page: int = Query(1)
):
    """
    Phase 2A: REST GET endpoint using POSTGIS `ST_DWithin` logic.
    For this scaffold, returning mock jobs conditionally based on distance.
    In Phase 2C, this integrates the actual ST_DWithin query.
    """
    results = []
    for job in mock_jobs:
        # Mock calculation: if distance_km is within radius_km, return
        if float(job["distance_km"]) <= radius_km:
            results.append(job)
    return results

@router.post("/")
def create_job():
    """Phase 2B: Recruiter job posting"""
    # 1. Geocode location to lat/lng
    # 2. Extract enforce boolean
    # 3. Write to PostgreSQL using `geoalchemy2` types (WKBElement)
    return {"status": "Job created. Backend schema needed."}

# Simulate dependency injection configuration
def check_api_quota() -> bool:
    """If returning True, proxy the call to Google Distance Matrix.
       If False, use ST_Distance straight-line fallback."""
    return False # Returning False to demonstrate Phase 2C Cost fallbacks.

@router.get("/{id}/commute")
def get_job_commute(
    id: int, 
    origin_lat: float, 
    origin_lng: float,
    mode: CommuteMode = Query(CommuteMode.driving),
    # db: Session = Depends(get_db)
):
    """Phase 1B/2C: Real-time commute from user home to job office"""
    # 1. Look up job from Postgres by {id} to get office_lat & office_lng
    job = next((j for j in mock_jobs if j["id"] == id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    dest_lat = job["office_lat"]
    dest_lng = job["office_lng"]

    # 2. Check cache first to avoid expensive API calls
    cached_data = get_cached_commute(origin_lat, origin_lng, dest_lat, dest_lng, mode.value)
    if cached_data:
        return {**cached_data, "source": "redis_cache"}
        
    # 3. Simulate checking if API quota is reached
    has_quota = check_api_quota()
    
    if has_quota:
        # 4A. Perform real Google Distance Matrix API Call
        # import requests
        # resp = requests.get(f"https://maps.googleapis.com/maps/api/distancematrix/json?...mode={mode.value}")
        # results = resp.json()
        
        # Simulate result
        commute_data = {
            "time_mins": 45 if mode == CommuteMode.driving else 75,
            "distance_km": 14.2,
            "misery_score": 4.1 if mode == CommuteMode.driving else 6.3,
            "source": "google_api"
        }
    else:
        # 4B. Fallback to Haversine straight-line heuristic to save costs
        commute_data = cost_saving_fallback(origin_lat, origin_lng, dest_lat, dest_lng, mode.value)
        
    # 5. Cache result for 24h
    cache_commute(origin_lat, origin_lng, dest_lat, dest_lng, commute_data, mode.value)
        
    return commute_data
