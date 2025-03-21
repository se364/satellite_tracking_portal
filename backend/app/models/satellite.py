# from sqlalchemy import Column, Integer, String, Float, DateTime
# from sqlalchemy.ext.declarative import declarative_base

# Base = declarative_base()

# class Satellite(Base):
#     __tablename__ = "satellites"

#     id = Column(Integer, primary_key=True, index=True)
#     norad_id = Column(Integer, unique=True, index=True)
#     name = Column(String, index=True)
#     tle_line1 = Column(String)
#     tle_line2 = Column(String)
#     launch_date = Column(DateTime, nullable=True)
#     country = Column(String, nullable=True)
#     orbit_type = Column(String, nullable=True)
#     period_minutes = Column(Float, nullable=True)
#     inclination_deg = Column(Float, nullable=True)
#     apogee_km = Column(Float, nullable=True)
#     perigee_km = Column(Float, nullable=True)
#     last_updated = Column(DateTime)

#     def __repr__(self):
#         return f"<Satellite(id={self.id}, name='{self.name}', norad_id={self.norad_id})>" 

from pydantic import BaseModel, Field
from typing import Optional, List

class TLE(BaseModel):
    """Two-Line Element set model"""
    line1: str
    line2: str

class Satellite(BaseModel):
    """Basic satellite information model"""
    id: str
    name: str
    norad_id: str
    category: str

class SatelliteDetail(Satellite):
    """Detailed satellite information model"""
    tle: TLE
    launch_date: Optional[str] = None
    country: Optional[str] = None
    orbital_period: Optional[float] = None  # in minutes
    inclination: Optional[float] = None  # in degrees
    apogee: Optional[float] = None  # in kilometers
    perigee: Optional[float] = None  # in kilometers
    description: Optional[str] = None