import { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import SatelliteList from '../components/SatelliteList';
import SearchBar from '../components/Searchbar';
import { fetchSatellites } from '../utils/api';

// Import the 3D Earth component dynamically with no SSR
// This is necessary because Three.js requires the window object
const EarthVisualization = dynamic(
  () => import('../components/EarthVisualization'),
  { ssr: false }
);

export default function Home() {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSatellites, setSelectedSatellites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch satellite data on component mount
  useEffect(() => {
    const loadSatellites = async () => {
      try {
        setLoading(true);
        const data = await fetchSatellites();
        setSatellites(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load satellite data');
        setLoading(false);
        console.error('Error fetching satellites:', err);
      }
    };
    
    loadSatellites();
  }, []);
  
  // Filter satellites based on search query
  const filteredSatellites = satellites.filter(sat => 
    sat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle satellite selection
  const toggleSatellite = (satelliteId) => {
    setSelectedSatellites(prev => {
      if (prev.includes(satelliteId)) {
        return prev.filter(id => id !== satelliteId);
      } else {
        return [...prev, satelliteId];
      }
    });
  };
  
  return (
    <Layout>
      <Head>
        <title>Satellite Tracking Portal</title>
        <meta name="description" content="Track satellites in real-time" />
      </Head>
      
      <div className="flex flex-col md:flex-row h-screen">
        {/* Left sidebar with search and satellite list */}
        <div className="w-full md:w-1/3 bg-gray-100 p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Satellite Tracker</h1>
          <SearchBar 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          
          {loading ? (
            <div className="flex justify-center mt-8">
              <p>Loading satellites...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 mt-4">{error}</div>
          ) : (
            <SatelliteList 
              satellites={filteredSatellites} 
              selectedSatellites={selectedSatellites}
              onToggle={toggleSatellite}
            />
          )}
        </div>
        
        {/* Main content area with Earth visualization */}
        <div className="w-full md:w-2/3 h-full">
          <EarthVisualization 
            satellites={satellites.filter(sat => selectedSatellites.includes(sat.id))} 
          />
        </div>
      </div>
    </Layout>
  );
}