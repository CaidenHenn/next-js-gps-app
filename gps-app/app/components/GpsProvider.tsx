import React, { createContext, useContext, useEffect, useState } from 'react';

const GpsContext = createContext();

export const GpsProvider = ({ children }) => {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);

  const startGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    // Define a function to get the position
    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setAccuracy(position.coords.accuracy);
          setError(null);
        },
        (err) => setError(err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    // Start with an immediate position update
    getPosition();

    // Set an interval for periodic updates
    const intervalId = setInterval(getPosition, 500); // Update every 5 seconds (5000 ms)

    // Cleanup interval on component unmount or when GPS is no longer needed
    return () => clearInterval(intervalId);
  };

  // Automatically start GPS tracking when the provider mounts
  useEffect(() => {
    const stopGeolocation = startGeolocation();

    // Cleanup function to stop geolocation updates when the component unmounts
    return stopGeolocation;
  }, []);

  return (
    <GpsContext.Provider value={{ position, accuracy, error, startGeolocation }}>
      {children}
    </GpsContext.Provider>
  );
};

export const useGps = () => {
  const context = useContext(GpsContext);
  if (!context) {
    throw new Error('useGps must be used within a GpsProvider');
  }
  return context;
};
