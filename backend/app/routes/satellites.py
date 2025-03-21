# from fastapi import APIRouter, HTTPException, Depends
# from typing import List, Optional
# from pydantic import BaseModel
# from datetime import datetime

# router = APIRouter(
#     prefix="/satellites",
#     tags=["satellites"],
#     responses={404: {"description": "Not found"}},
# )

# # Satellite Pydantic model (for API)
# class SatelliteBase(BaseModel):
#     norad_id: int
#     name: str
#     tle_line1: str
#     tle_line2: str
    
# class SatelliteCreate(SatelliteBase):
#     pass

# class Satellite(SatelliteBase):
#     id: int
#     launch_date: Optional[datetime] = None
#     country: Optional[str] = None
#     orbit_type: Optional[str] = None
#     period_minutes: Optional[float] = None
#     inclination_deg: Optional[float] = None
#     apogee_km: Optional[float] = None
#     perigee_km: Optional[float] = None
#     last_updated: datetime
    
#     class Config:
#         orm_mode = True

# # Sample data for development
# SAMPLE_SATELLITES = [
#     {
#         "id": 1,
#         "norad_id": 25544,
#         "name": "ISS (ZARYA)",
#         "tle_line1": "1 25544U 98067A   23001.28641541  .00008420  00000+0  15678-3 0  9996",
#         "tle_line2": "2 25544  51.6415 148.7129 0006947  72.2362  30.3543 15.50309561375691",
#         "launch_date": datetime(1998, 11, 20),
#         "country": "International",
#         "orbit_type": "LEO",
#         "period_minutes": 92.9,
#         "inclination_deg": 51.64,
#         "apogee_km": 424.0,
#         "perigee_km": 408.0,
#         "last_updated": datetime.now()
#     }
# ]

# @router.get("/", response_model=List[Satellite])
# async def get_satellites():
#     """
#     Get all satellites.
#     """
#     return SAMPLE_SATELLITES

# @router.get("/{satellite_id}", response_model=Satellite)
# async def get_satellite(satellite_id: int):
#     """
#     Get a specific satellite by ID.
#     """
#     for satellite in SAMPLE_SATELLITES:
#         if satellite["id"] == satellite_id:
#             return satellite
#     raise HTTPException(status_code=404, detail="Satellite not found") 

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.satellite import Satellite, SatelliteDetail
from app.services.satellite_service import get_satellites, get_satellite_by_id

router = APIRouter()

@router.get("/", response_model=List[Satellite])
async def read_satellites(
    category: Optional[str] = Query(None, description="Filter by satellite category"),
    search: Optional[str] = Query(None, description="Search by satellite name")
):
    """
    Get a list of all satellites with optional filtering
    """
    satellites = get_satellites()
    
    # Apply filters if provided
    if category:
        satellites = [sat for sat in satellites if sat.category.lower() == category.lower()]
    
    if search:
        satellites = [sat for sat in satellites if search.lower() in sat.name.lower()]
    
    return satellites

@router.get("/{satellite_id}", response_model=SatelliteDetail)
async def read_satellite(satellite_id: str):
    """
    Get detailed information about a specific satellite
    """
    satellite = get_satellite_by_id(satellite_id)
    if not satellite:
        raise HTTPException(status_code=404, detail="Satellite not found")
    return satellite