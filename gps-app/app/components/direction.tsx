import { useState, useEffect } from 'react';

const useDeviceOrientation = (): number | null => {
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setCompassHeading(event.alpha ?? null); // Set to null if event.alpha is undefined
    };

    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const response = await DeviceOrientationEvent.requestPermission();
          if (response === 'granted') {
            setPermissionGranted(true);
          } else {
            console.error('Permission not granted');
          }
        } catch (error) {
          console.error('Error requesting permission:', error);
        }
      } else {
        // No permission required for non-iOS or older iOS devices
        setPermissionGranted(true);
      }
    };

    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      requestPermission();
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [permissionGranted]);

  return compassHeading; // Return the compassHeading value or null if permission not granted
};

export default useDeviceOrientation;
