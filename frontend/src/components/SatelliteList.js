export default function SatelliteList({ satellites, selectedSatellites, onToggle }) {
    if (satellites.length === 0) {
      return <div className="mt-4">No satellites found</div>;
    }
  
    return (
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Available Satellites ({satellites.length})</h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {satellites.map((satellite) => (
            <div 
              key={satellite.id}
              className={`p-3 rounded-lg cursor-pointer ${
                selectedSatellites.includes(satellite.id) 
                  ? 'bg-blue-100 border border-blue-500' 
                  : 'bg-white border border-gray-200'
              }`}
              onClick={() => onToggle(satellite.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{satellite.name}</h3>
                  <p className="text-sm text-gray-600">NORAD ID: {satellite.norad_id}</p>
                </div>
                <div className="text-xs bg-gray-200 px-2 py-1 rounded">
                  {satellite.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }