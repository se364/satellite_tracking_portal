from pydantic import BaseModel, Field
from datetime import datetime

class LocationInput(BaseModel):
    """Observer location input model"""
    latitude: float = Field(..., description="Observer latitude in degrees")
    longitude: float = Field(..., description="Observer longitude in degrees")
    elevation: float = Field(0, description="Observer elevation in meters")

class PassPrediction(BaseModel):
    """Satellite pass prediction model"""
    satellite_id: str
    start_time: datetime
    max_elevation_time: datetime
    end_time: datetime
    start_azimuth: float  # in degrees
    max_elevation: float  # in degrees
    end_azimuth: float  # in degrees
    duration: float  # in seconds