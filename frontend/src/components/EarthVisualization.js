import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { calculateSatellitePositionFromTLE } from '../utils/orbitalCalculations';

// Earth component with texture
function Earth() {
  const earthRef = useRef();
  
  // Load Earth texture
  const earthTexture = useLoader(THREE.TextureLoader, '/earth_texture.jpg');
  
  // Slowly rotate the Earth
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005;
    }
  });
  
  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={earthTexture} />
    </mesh>
  );
}

// Satellite component
function Satellite({ position, color = 'red', name }) {
  const satRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      {/* Satellite point */}
      <mesh 
        ref={satRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Label that appears on hover */}
      {hovered && (
        <Html position={[0, 0.05, 0]}>
          <div className="bg-black text-white p-1 text-xs rounded">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
}

// Satellite orbit path
function OrbitPath({ satelliteTLE, color = 'rgba(255, 255, 255, 0.3)' }) {
  const points = [];
  
  // Generate points for the orbit path (360 points for a full orbit)
  for (let i = 0; i < 360; i += 5) {
    const position = calculateSatellitePositionFromTLE(satelliteTLE, new Date(Date.now() + i * 60000));
    points.push(new THREE.Vector3(position.x, position.y, position.z));
  }
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} opacity={0.7} transparent />
    </line>
  );
}

// Import for the Html component
import { Html } from '@react-three/drei';

export default function EarthVisualization({ satellites }) {
  // This component is loaded dynamically with no SSR, so we can use Three.js
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Earth */}
        <Earth />
        
        {/* Satellites */}
        {satellites.map((satellite) => {
          // Calculate current position based on TLE data
          const position = calculateSatellitePositionFromTLE(satellite.tle, new Date());
          
          return (
            <group key={satellite.id}>
              <Satellite 
                position={[position.x, position.y, position.z]}
                color={satellite.category === 'ISS' ? 'yellow' : 'red'}
                name={satellite.name}
              />
              <OrbitPath satelliteTLE={satellite.tle} />
            </group>
          );
        })}
        
        {/* Background stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        
        {/* Controls to rotate and zoom the view */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
}