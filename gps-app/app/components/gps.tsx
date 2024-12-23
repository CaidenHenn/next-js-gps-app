import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Navigation from './navigation'
import getCompassHeading from './map'

interface GpsProps {
  compassBearing?: number; // Define the prop type here
}
 
const Gps: React.FC<GpsProps>= ({ position,accuracy,compassBearing, mapRef }) => {
  const navigation = Navigation();
  
  // const [position, setPosition] = useState<L.LatLng | null>(null);
  // const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const map = mapRef;
  const currentHeading = compassBearing;

  
  const manIcon = new L.Icon({
    iconUrl: '/man.png',
    iconSize: [64, 64],
    iconAnchor: [16, 32], // Adjust based on the icon
  });

  const directionIcon = new L.Icon({
    iconUrl: '/direction_marker.png',
    iconSize: [128, 128],
    iconAnchor: [48, 64], // Adjust based on the icon
  });
  



  
  
  const normalizeAngle = (angle) => {
    let normalizedAngle = angle % 360;
    if (normalizedAngle < 0) {
      normalizedAngle += 360;
    }
    return normalizedAngle;
  };
  function degrees_to_radians(degrees)
{
  // Store the value of pi.
  var pi = Math.PI;
  // Multiply degrees by pi divided by 180 to convert to radians.
  return degrees * (pi/180);
}
  const RotatingMarker = ({ position, angle }) => {
    const markerRef = useRef(null);
  
    useEffect(() => {
      if (markerRef.current) {
        const normalized_compass_angle= normalizeAngle(angle);



        markerRef.current.setRotationAngle(degrees_to_radians(normalized_compass_angle)); // Set rotation angle
        //console.log('raw positon', position)
        //console.log('normalized angle:',normalized_compass_angle)
        markerRef.current.setRotationOrigin('center')
      }
    }, [angle]);
  
    return (
      <Marker
        ref={markerRef}
        position={position}
        rotation={degrees_to_radians(angle)}
        
        icon={directionIcon}
      >
        <Popup>Initial Position Marker</Popup>
      </Marker>
    );
  };




  if (error) {
    return <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '5px' }}>{error}</div>;
  }

  






  return position === null ? null : (
    <>
      <Marker position={position} icon={manIcon}>
        <Popup>
          You are here. <br />
          {accuracy !== null && `Accuracy: ${accuracy.toFixed(2)} meters.`}
        </Popup>
      </Marker>
      <RotatingMarker
        position={position}
        angle={currentHeading}
      />
    </>
  );
};

export default Gps;
