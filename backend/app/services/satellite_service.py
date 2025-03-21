# from datetime import datetime, timedelta
# from skyfield.api import load, EarthSatellite, wgs84
# from typing import List, Dict, Any, Tuple

# class SatelliteService:
#     def __init__(self):
#         # Load timescale for orbital calculations
#         self.ts = load.timescale()
    
#     def parse_tle(self, tle_line1: str, tle_line2: str) -> EarthSatellite:
#         """
#         Create a Skyfield EarthSatellite object from TLE data
#         """
#         satellite = EarthSatellite(tle_line1, tle_line2, name="", ts=self.ts)
#         return satellite
    
#     def get_current_position(self, satellite: EarthSatellite) -> Dict[str, Any]:
#         """
#         Get the current position of a satellite
#         """
#         # Current time
#         t = self.ts.now()
        
#         # Get satellite position
#         geocentric = satellite.at(t)
#         subpoint = wgs84.subpoint(geocentric)
        
#         return {
#             "latitude": subpoint.latitude.degrees,
#             "longitude": subpoint.longitude.degrees,
#             "elevation": subpoint.elevation.km,
#             "timestamp": datetime.utcnow().isoformat()
#         }
    
#     def predict_passes(self, satellite: EarthSatellite, 
#                        latitude: float, longitude: float, 
#                        elevation_m: float = 0.0, 
#                        days: int = 3) -> List[Dict[str, Any]]:
#         """
#         Predict satellite passes over a given location
#         """
#         # Create location
#         location = wgs84.latlon(latitude, longitude, elevation_m / 1000.0)
        
#         # Time span for prediction
#         t0 = self.ts.now()
#         t1 = self.ts.now() + timedelta(days=days)
        
#         # Find passes
#         t, events = satellite.find_events(location, t0, t1, altitude_degrees=10.0)
        
#         # Process results
#         passes = []
#         current_pass = {}
        
#         for ti, event in zip(t, events):
#             time_utc = ti.utc_datetime()
            
#             if event == 0:  # Rise above horizon
#                 current_pass = {
#                     "rise_time": time_utc.isoformat(),
#                     "rise_azimuth": None
#                 }
                
#                 # Calculate rise azimuth
#                 difference = satellite - location
#                 topocentric = difference.at(ti)
#                 alt, az, distance = topocentric.altaz()
#                 current_pass["rise_azimuth"] = az.degrees
                
#             elif event == 1:  # Culmination (highest point)
#                 if current_pass:
#                     current_pass["max_time"] = time_utc.isoformat()
                    
#                     # Calculate max elevation
#                     difference = satellite - location
#                     topocentric = difference.at(ti)
#                     alt, az, distance = topocentric.altaz()
#                     current_pass["max_elevation"] = alt.degrees
                    
#             elif event == 2:  # Set below horizon
#                 if current_pass:
#                     current_pass["set_time"] = time_utc.isoformat()
                    
#                     # Calculate set azimuth
#                     difference = satellite - location
#                     topocentric = difference.at(ti)
#                     alt, az, distance = topocentric.altaz()
#                     current_pass["set_azimuth"] = az.degrees
                    
#                     # Duration
#                     rise_time = datetime.fromisoformat(current_pass["rise_time"])
#                     duration = time_utc - rise_time
#                     current_pass["duration"] = duration.total_seconds()
                    
#                     passes.append(current_pass)
#                     current_pass = {}
        
#         return passes 


from typing import List, Optional
from app.models.satellite import Satellite, SatelliteDetail, TLE

# This is a mock database for the MVP
# In a real application, you would use a database like PostgreSQL
SATELLITES_DB = [
    {
        "id": "25544",
        "name": "ISS (ZARYA)",
        "norad_id": "25544",
        "category": "ISS",
        "tle": {
            "line1": "1 25544U 98067A   24077.91517237  .00014720  00000+0  26601-3 0  9992",
            "line2": "2 25544  51.6415 174.6347 0005935 283.8887  64.7968 15.50352806440713"
        },
        "launch_date": "1998-11-20",
        "country": "International",
        "orbital_period": 92.7,
        "inclination": 51.64,
        "apogee": 424.0,
        "perigee": 418.0,
        "description": "The International Space Station (ISS) is a habitable artificial satellite in low Earth orbit."
    },
    {
        "id": "28654",
        "name": "NOAA 18",
        "norad_id": "28654",
        "category": "Weather",
        "tle": {
            "line1": "1 28654U 05018A   24077.86196928  .00000136  00000+0  10901-3 0  9993",
            "line2": "2 28654  99.0427 157.6291 0014505 130.7189 229.5357 14.12614629971202"
        },
        "launch_date": "2005-05-20",
        "country": "USA",
        "orbital_period": 101.9,
        "inclination": 99.04,
        "apogee": 866.0,
        "perigee": 854.0,
        "description": "NOAA-18 is a weather forecasting satellite operated by NOAA."
    },
    {
        "id": "43013",
        "name": "STARLINK-1",
        "norad_id": "43013",
        "category": "Communications",
        "tle": {
            "line1": "1 43013U 17068A   24077.92038932  .00034392  00000+0  18272-3 0  9996",
            "line2": "2 43013  53.0512 236.5208 0001203 144.4856 215.6218 15.11108500354607"
        },
        "launch_date": "2019-05-24",
        "country": "USA",
        "orbital_period": 95.2,
        "inclination": 53.05,
        "apogee": 550.0,
        "perigee": 550.0,
        "description": "Starlink-1 is part of SpaceX's Starlink satellite constellation."
    },
    {
        "id": "27424",
        "name": "HUBBLE",
        "norad_id": "20580",
        "category": "Science",
        "tle": {
            "line1": "1 20580U 90037B   24077.50669318  .00000850  00000+0  29362-4 0  9995",
            "line2": "2 20580  28.4700 278.9193 0002620 152.8115 207.2954 15.09777333489577"
        },
        "launch_date": "1990-04-24",
        "country": "USA",
        "orbital_period": 95.4,
        "inclination": 28.47,
        "apogee": 540.0,
        "perigee": 530.0,
        "description": "The Hubble Space Telescope (HST) is a space telescope that was launched into low Earth orbit in 1990."
    },
    {
        "id": "33591",
        "name": "COSMOS 2455",
        "norad_id": "33591",
        "category": "Military",
        "tle": {
            "line1": "1 33591U 09002A   24077.57215907  .00000048  00000+0  00000+0 0  9998",
            "line2": "2 33591  67.1516  79.5200 0006836 278.6559  81.3627 14.13617770784257"
        },
        "launch_date": "2009-01-20",
        "country": "Russia",
        "orbital_period": 101.7,
        "inclination": 67.15,
        "apogee": 863.0,
        "perigee": 846.0,
        "description": "Cosmos 2455 is a Russian military satellite."
    }
]

def get_satellites() -> List[Satellite]:
    """
    Get a list of all satellites
    """
    return [Satellite(**sat) for sat in SATELLITES_DB]

def get_satellite_by_id(satellite_id: str) -> Optional[SatelliteDetail]:
    """
    Get detailed information about a specific satellite by ID
    """
    for sat in SATELLITES_DB:
        if sat["id"] == satellite_id:
            return SatelliteDetail(**sat)
    return None