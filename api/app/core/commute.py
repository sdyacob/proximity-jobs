import os
import redis
import json
import logging
import math
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
try:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
except Exception as e:
    logger.error(f"Failed to connect to Redis: {e}")
    redis_client = None

def get_route_hash(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float, mode: str) -> str:
    """Generate a consistent cache key for a route"""
    # Rounding to 3 decimal places gives roughly ~100m accuracy grouping 
    # which is good enough for commute estimates and increases cache hits.
    olat, olng = round(origin_lat, 3), round(origin_lng, 3)
    dlat, dlng = round(dest_lat, 3), round(dest_lng, 3)
    return f"route:{olat},{olng}:{dlat},{dlng}:{mode}"

def get_cached_commute(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float, mode: str = "driving") -> Optional[Dict[str, Any]]:
    """Retrieve pre-calculated commute from Redis"""
    if not redis_client:
        return None
    
    route_hash = get_route_hash(origin_lat, origin_lng, dest_lat, dest_lng, mode)
    cached = redis_client.get(route_hash)
    if cached:
        return json.loads(cached)
    return None

def cache_commute(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float, data: Dict[str, Any], mode: str = "driving", ttl_seconds: int = 86400):
    """Save commute calculation to Redis for 24h (86400s) default"""
    if not redis_client:
        return
        
    route_hash = get_route_hash(origin_lat, origin_lng, dest_lat, dest_lng, mode)
    redis_client.setex(route_hash, ttl_seconds, json.dumps(data))

def calculate_straight_line_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Fallback mechanism using Haversine formula (meters)"""
    R = 6371000 # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi/2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda/2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

def cost_saving_fallback(origin_lat: float, origin_lng: float, dest_lat: float, dest_lng: float, mode: str) -> Dict[str, Any]:
    """If API quota is hit or to save costs, use a heuristic"""
    distance_meters = calculate_straight_line_distance(origin_lat, origin_lng, dest_lat, dest_lng)
    
    # Very rough heuristics for commute times given straight line distance.
    # Assumes driving ~30km/h in city traffic, transit ~20km/h.
    speed_kmh = 30.0 if mode == "driving" else 20.0
    distance_km = distance_meters / 1000.0
    
    # Time in minutes 
    time_mins = (distance_km / speed_kmh) * 60.0
    
    # Calculate misery score formula
    transit_transfers = 1 if mode == "driving" else 2 # heuristic
    miseryScore = (time_mins / 60.0) * transit_transfers * 1.2
    
    return {
        "time_mins": round(time_mins),
        "distance_km": round(distance_km, 1),
        "misery_score": round(min(miseryScore, 10.0), 1),
        "source": "fallback_heuristic"
    }
