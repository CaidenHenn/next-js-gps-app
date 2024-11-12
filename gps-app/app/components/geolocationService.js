// GeoLocationContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const GeoLocationContext = createContext();

export const GeoLocationProvider = ({ children }) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (GPSposition) => {
        const { latitude, longitude, accuracy } = GPSposition.coords;
        setPosition({ lat: latitude, lng: longitude, accuracy });
        setError(null);
      },
      (error) => setError(`Error: ${error.message}`),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <GeoLocationContext.Provider value={{ position, error }}>
      {children}
    </GeoLocationContext.Provider>
  );
};

export const useGeoLocation = () => useContext(GeoLocationContext);
