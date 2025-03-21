from fastapi import APIRouter, HTTPException, Body
from typing import List
from app.models.pass_prediction import PassPrediction, LocationInput
from app.services.pass_service import predict_satellite_passes
from app.services.satellite_service import get_satellite_by_id

router = APIRouter()

@router.post("/{satellite_id}", response_model=List[PassPrediction])
async def get_satellite_passes(
    satellite_id: str,
    location: LocationInput = Body(...),
    days: int = Body(7, description="Number of days to predict passes for")
):
    """
    Predict visible passes of a satellite over a given location
    """
    # Check if satellite exists
    satellite = get_satellite_by_id(satellite_id)
    if not satellite:
        raise HTTPException(status_code=404, detail="Satellite not found")
    
    # Predict passes
    passes = predict_satellite_passes(satellite, location, days)
    
    return passes