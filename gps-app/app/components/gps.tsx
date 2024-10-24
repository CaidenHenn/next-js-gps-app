import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import useDeviceOrientation from './direction';
import './map_components.css';
import L from 'leaflet';

const Gps: React.FC = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const zAxis = useDeviceOrientation();
  const map = useMap();
  
  const manIcon = new L.Icon({
    iconUrl: '/man.png',
    iconSize: [64, 64],
    iconAnchor: [16, 32], // Point of the icon that corresponds to the marker's location
  });

  const directionIcon = new L.Icon({
    iconUrl: '/direction_marker.png',
    iconSize: [128, 128],
    iconAnchor: [48, 64], // Point of the icon that corresponds to the marker's location
  });

  const directionMarkerRef = useRef<L.Marker | null>(null);
  const heading = useDeviceOrientation();

  useEffect(() => {
    let watchId: number;

    const successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const newPosition = new L.LatLng(latitude, longitude);
      setPosition(newPosition);
      setAccuracy(accuracy);
      map.setView(newPosition, 16);
      setError(null);
    };


    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    
    // Cleanup function
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [map]);

  useEffect(() => {
    if (directionMarkerRef.current) {
      directionMarkerRef.current.setRotation(0);
      
    }
    console.log("Heading is : ",heading)
  }, [heading]);

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
      <Marker position={position} icon={directionIcon} ref={directionMarkerRef} />
    </>
  );
};

export default Gps;
