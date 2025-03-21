/**
 * This is a simplified version of orbital calculations for the MVP.
 * In a real-world application, you would use a robust orbital mechanics library 
 * like satellite.js or implement SGP4/SDP4 propagation algorithms.
 */

/**
 * Utility functions for satellite orbital calculations
 */

/**
 * Converts degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
export const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculates the current position of a satellite based on simplified orbital parameters
 * @param {Object} satellite - Satellite object with orbital parameters
 * @param {number} time - Current time in milliseconds since epoch
 * @returns {Object} Position vector {x, y, z} in Earth-centered coordinates
 */
export const calculateSatellitePosition = (satellite, time = Date.now()) => {
  // Default orbital parameters if not provided
  const {
    semiMajorAxis = 7000, // km (approx. altitude + Earth radius)
    eccentricity = 0,     // circular orbit
    inclination = satellite.inclination_deg || 51.6, // ISS-like inclination if not specified
    rightAscension = 0,   // RAAN
    argOfPerigee = 0,     // argument of perigee
    meanAnomaly = 0,      // mean anomaly at epoch
    period = satellite.period_minutes || 90 // orbital period in minutes
  } = satellite;

  // Convert angles to radians
  const incRad = degreesToRadians(inclination);
  const raanRad = degreesToRadians(rightAscension);
  const argpRad = degreesToRadians(argOfPerigee);
  
  // Calculate time since epoch in minutes
  const timeElapsed = (time - (satellite.epoch || 0)) / (1000 * 60);
  
  // Calculate mean anomaly at current time
  const currentMeanAnomaly = meanAnomaly + (timeElapsed * (360 / period));
  const currentMeanAnomalyRad = degreesToRadians(currentMeanAnomaly % 360);
  
  // For circular orbits (e=0), true anomaly equals mean anomaly
  // For eccentric orbits, we'd need to solve Kepler's equation
  const trueAnomalyRad = currentMeanAnomalyRad;
  
  // Calculate position in orbital plane
  const r = semiMajorAxis * (1 - eccentricity * Math.cos(trueAnomalyRad));
  const xOrbit = r * Math.cos(trueAnomalyRad);
  const yOrbit = r * Math.sin(trueAnomalyRad);
  
  // Rotate to account for inclination and other orbital elements
  // First, rotation by argument of perigee
  const xPeri = xOrbit * Math.cos(argpRad) - yOrbit * Math.sin(argpRad);
  const yPeri = xOrbit * Math.sin(argpRad) + yOrbit * Math.cos(argpRad);
  const zPeri = 0;
  
  // Then, rotation by inclination
  const xIncl = xPeri;
  const yIncl = yPeri * Math.cos(incRad);
  const zIncl = yPeri * Math.sin(incRad);
  
  // Finally, rotation by RAAN
  const x = xIncl * Math.cos(raanRad) - yIncl * Math.sin(raanRad);
  const y = xIncl * Math.sin(raanRad) + yIncl * Math.cos(raanRad);
  const z = zIncl;
  
  return { x, y, z };
};

/**
 * Calculates satellite ground track (position on Earth's surface)
 * @param {Object} satellite - Satellite object
 * @param {number} time - Current time
 * @returns {Object} Latitude and longitude in degrees
 */
export const calculateGroundTrack = (satellite, time = Date.now()) => {
  // Get satellite position in 3D space
  const { x, y, z } = calculateSatellitePosition(satellite, time);
  
  // Convert to latitude and longitude
  const longitude = (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
  
  // Distance from Earth center
  const r = Math.sqrt(x*x + y*y + z*z);
  
  // Calculate latitude (accounting for Earth's rotation)
  const latitude = Math.asin(z / r) * (180 / Math.PI);
  
  return { latitude, longitude };
};

/**
 * Calculates the position of a satellite at a given time based on TLE data.
 * This is a highly simplified model for demonstration purposes.
 * 
 * @param {Object} tle - The Two-Line Element set for the satellite
 * @param {Date} time - The time at which to calculate the position
 * @returns {Object} Position as {x, y, z} coordinates relative to Earth center
 */
export function calculateSatellitePositionFromTLE(tle, time) {
    // For the MVP, we'll use a simple circular orbit approximation
    // In reality, you would use the SGP4/SDP4 algorithm with the TLE data
    
    // Extract basic orbital elements from TLE (simplified)
    const inclination = parseFloat(tle.line2.substring(8, 16)) * (Math.PI / 180); // Convert to radians
    const rightAscension = parseFloat(tle.line2.substring(17, 25)) * (Math.PI / 180);
    const eccentricity = parseFloat(`0.${tle.line2.substring(26, 33)}`);
    const meanAnomaly = parseFloat(tle.line2.substring(43, 51)) * (Math.PI / 180);
    const meanMotion = parseFloat(tle.line2.substring(52, 63)); // Revolutions per day
    
    // Calculate orbital period in milliseconds
    const period = (24 * 60 * 60 * 1000) / meanMotion;
    
    // Calculate time since epoch
    const epoch = parseFloat(tle.line1.substring(18, 32));
    const epochDate = new Date(Date.UTC(2000 + parseInt(epoch), 0, 1));
    epochDate.setDate(epochDate.getDate() + (epoch % 1000) - 1);
    
    const timeSinceEpoch = time.getTime() - epochDate.getTime();
    
    // Calculate current mean anomaly
    const currentMeanAnomaly = meanAnomaly + (2 * Math.PI * (timeSinceEpoch % period)) / period;
    
    // Simplified orbit calculation (circular orbit approximation)
    // For a proper implementation, you would solve Kepler's equation and compute position vectors
    
    // Earth radius in km (simplified)
    const earthRadius = 6371;
    
    // Satellite altitude in km (simplified estimation)
    const semiMajorAxis = Math.pow(6378.137 * 6378.137 * 86400 / (meanMotion * 2 * Math.PI), 1/3);
    const altitude = semiMajorAxis - earthRadius;
    
    // Calculate position in orbital plane
    const radius = earthRadius + altitude;
    const x = radius * Math.cos(currentMeanAnomaly);
    const y = radius * Math.sin(currentMeanAnomaly);
    
    // Rotate to account for inclination and right ascension
    const xInc = x;
    const yInc = y * Math.cos(inclination);
    const zInc = y * Math.sin(inclination);
    
    const xEci = xInc * Math.cos(rightAscension) - yInc * Math.sin(rightAscension);
    const yEci = xInc * Math.sin(rightAscension) + yInc * Math.cos(rightAscension);
    const zEci = zInc;
    
    // Scale for visualization (Earth radius = 1 in the 3D model)
    const scaleFactor = 1 / earthRadius;
    
    return {
      x: xEci * scaleFactor,
      y: zEci * scaleFactor, // Switch y and z for Three.js coordinate system
      z: yEci * scaleFactor
    };
  }
  
  /**
   * Predicts visible passes of a satellite over a given location
   * @param {Object} tle - The Two-Line Element set for the satellite
   * @param {Object} location - Observer location
   * @param {number} location.latitude - Observer latitude in degrees
   * @param {number} location.longitude - Observer longitude in degrees
   * @param {number} location.elevation - Observer elevation in meters
   * @param {number} days - Number of days to predict passes for
   * @returns {Array} Array of pass objects with start, max elevation, and end times
   */
  export function predictPasses(tle, location, days = 7) {
    // This is a placeholder for the MVP
    // In a real implementation, you would use a proper pass prediction algorithm
    
    // For now, we'll return some dummy data
    const passes = [];
    const now = new Date();
    
    for (let i = 0; i < 5; i++) {
      const passStart = new Date(now.getTime() + (i * 24 + Math.random() * 12) * 3600000);
      const maxElevation = new Date(passStart.getTime() + 3 * 60000);
      const passEnd = new Date(passStart.getTime() + 6 * 60000);
      
      passes.push({
        start: passStart,
        maxElevation: maxElevation,
        end: passEnd,
        startAzimuth: Math.floor(Math.random() * 360),
        maxElevationDegrees: Math.floor(Math.random() * 70) + 10,
        endAzimuth: Math.floor(Math.random() * 360),
      });
    }
    
    return passes;
  }