import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { KalmanFilter } from './KalmanFilter';

const GpsContext = createContext();

export const GpsProvider = ({ children }) => {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [error, setError] = useState(null);

  // Create a ref to store the Kalman filter
  const kalmanFilterRef = useRef(null);
  // Initialize Kalman filter once when the component mounts
  useEffect(() => {
    kalmanFilterRef.current = KalmanFilter({
      Q_metres_per_second: 4,  // Adjust as needed
      MinAccuracy: 5,  // Minimum acceptable accuracy in meters
    });
  }, []);  // Empty dependency array ensures this effect runs only once

  const startGeolocation = () => {
    console.log("StartingLocation!");
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;  // Return if geolocation is not available
    }

    // Check if the Kalman filter is initialized
    if (!kalmanFilterRef.current) {
      setError('Kalman filter is not initialized');
      return;  // Return if Kalman filter is not initialized
    }

    
    const { process } = kalmanFilterRef.current;

    // Define a function to get the position
    const getPosition = () => {
      //web API that retrieves geographical data
      navigator.geolocation.getCurrentPosition(
        //if the position callback is succesful, this is ran
        (position) => {
          if (
            //verify that some of these are null before
            //running through the filter
            position &&
            position.coords &&
            position.coords.latitude != null &&
            position.coords.longitude != null &&
            position.coords.accuracy != null &&
            position.timestamp != null
          ) {
            // Apply the Kalman filter to smooth the GPS data
            //proccess is the filter method
            const { lat, lng, variance } = process(
              position.coords.latitude,
              position.coords.longitude,
              position.coords.accuracy,
              position.timestamp
            );

            // Check if filtered values are non-null before updating the state
            if (lat != null && lng != null) {
              setPosition({
                lat, // using the filtered lat value
                lng, // using the filtered lng value
              });
            }
            setAccuracy(position.coords.accuracy);
            setError(null);
          } else {
            setError('Position data is incomplete or null');
          }
        },
        //if a error is returned instead, error is set
        (err) => setError(err.message),
        //enable high accuracy gets the best accuracy it can, even if it takes longer
        //timeout is the amount of time it will take to give up
        //maximumAge makes sure its fresh data, not cached
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    // Start with an immediate position update
    getPosition();

    // Set an interval for periodic updates
    const intervalId = setInterval(getPosition, 500); // Update every 500 ms

    return () => {
      clearInterval(intervalId); // This will clear the interval on unmount
    };
  };

  // Automatically start GPS tracking when the provider mounts
  useEffect(() => {
    const stopGeolocation = startGeolocation(); 
    
    return () => {
      stopGeolocation(); // Call the returned cleanup function
    };
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
