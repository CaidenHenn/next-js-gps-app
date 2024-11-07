import React, { createContext, useContext, useState } from 'react';

interface GpsContextType {
  position: L.LatLng | null;
  accuracy: number | null;
  setPosition: React.Dispatch<React.SetStateAction<L.LatLng | null>>;
  setAccuracy: React.Dispatch<React.SetStateAction<number | null>>;
}

const GpsContext = createContext<GpsContextType | undefined>(undefined);

export const GpsProvider: React.FC = ({ children }) => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  return (
    <GpsContext.Provider value={{ position, accuracy, setPosition, setAccuracy }}>
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
