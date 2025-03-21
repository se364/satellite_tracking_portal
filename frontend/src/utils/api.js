import axios from 'axios';

// Base URL for our backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetches all available satellites from the API
 * @returns {Promise<Array>} Array of satellite objects
 */
export async function fetchSatellites() {
  try {
    const response = await axios.get(`${API_BASE_URL}/satellites`);
    return response.data;
  } catch (error) {
    console.error('Error fetching satellites:', error);
    throw error;
  }
}

/**
 * Fetches detailed information for a specific satellite
 * @param {string} id - Satellite ID
 * @returns {Promise<Object>} Satellite details
 */
export async function fetchSatelliteDetails(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/satellites/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching satellite details for ID ${id}:`, error);
    throw error;
  }
}

/**
 * Fetches future passes of a satellite over a specific location
 * @param {string} satelliteId - Satellite ID
 * @param {Object} location - Observer location
 * @param {number} location.latitude - Observer latitude
 * @param {number} location.longitude - Observer longitude
 * @param {number} location.elevation - Observer elevation in meters
 * @returns {Promise<Array>} Array of pass prediction objects
 */
export async function fetchSatellitePasses(satelliteId, location) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/satellites/${satelliteId}/passes`, 
      location
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching passes for satellite ${satelliteId}:`, error);
    throw error;
  }
}