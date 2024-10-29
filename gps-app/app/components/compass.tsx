import React, { useEffect, useState,useRef } from 'react';

interface CompassProps {
  onHeadingChange?: (heading: number) => void;
}

const Compass: React.FC<CompassProps> = ({ onHeadingChange }) => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);
  const headingHistory = useRef<number[]>([]);
  const lastHeading = useRef<number | null>(null);
  const HISTORY_SIZE = 5;

  const requestPermission = async () => {
    try {
      // Request permission for device orientation
      if (DeviceOrientationEvent.requestPermission) {
        const permission = await DeviceOrientationEvent.requestPermission();
        setPermissionState(permission);
        if (permission === 'granted') {
          window.addEventListener('deviceorientationabsolute', handleOrientation);
          // Fallback to regular deviceorientation event if absolute is not available
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } else {
        // For devices that don't require permission (mostly non-iOS)
        window.addEventListener('deviceorientationabsolute', handleOrientation);
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } catch (err) {
      setError('Error requesting device orientation permission');
      console.error(err);
    }
  };

  const smoothHeading = (newHeading: number): number => {
    if (lastHeading.current === null) {
      lastHeading.current = newHeading;
      return newHeading;
    }

    // Handle the 0/360 degree wrap-around
    let delta = newHeading - lastHeading.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    // Apply smoothing
    const smoothedHeading = lastHeading.current + delta * 0.1; // Adjust this factor to change smoothing amount
    lastHeading.current = smoothedHeading;

    // Normalize to 0-360
    return ((smoothedHeading + 360) % 360);
  };

  // Add moving average function
  const calculateMovingAverage = (newHeading: number): number => {
    headingHistory.current.push(newHeading);
    if (headingHistory.current.length > HISTORY_SIZE) {
      headingHistory.current.shift();
    }

    // Calculate average considering the circular nature of angles
    let sinSum = 0;
    let cosSum = 0;
    headingHistory.current.forEach(h => {
      const rad = (h * Math.PI) / 180;
      sinSum += Math.sin(rad);
      cosSum += Math.cos(rad);
    });

    const avgHeading = Math.atan2(sinSum / headingHistory.current.length, 
                                 cosSum / headingHistory.current.length);
    return ((avgHeading * 180 / Math.PI) + 360) % 360;
  };
  const handleOrientation = (event: DeviceOrientationEvent) => {
    let newHeading: number;
    let accuracy: number | null = null;

    if ('webkitCompassHeading' in event) {
      newHeading = (event as any).webkitCompassHeading;
      accuracy = (event as any).webkitCompassAccuracy;
    } else if (event.alpha !== null) {
      // For Android, we need to handle different screen orientations
      const alpha = event.alpha;
      const beta = event.beta;
      const gamma = event.gamma;

      // Only update heading if device is relatively flat
      if (beta && gamma && Math.abs(beta) < 30 && Math.abs(gamma) < 30) {
        newHeading = 360 - alpha;
      } else {
        return; // Skip updating if device isn't flat enough
      }
    } else {
      setError('Compass heading not available');
      return;
    }

    // Normalize and smooth the heading
    newHeading = (newHeading + 360) % 360;
    const smoothedHeading = smoothHeading(newHeading);
    const averagedHeading = calculateMovingAverage(smoothedHeading);
    
    setHeading(averagedHeading);
    if (onHeadingChange) {
      onHeadingChange(averagedHeading);
    }

    console.log('Compass Heading:', {
      raw: newHeading.toFixed(1) + '°',
      smoothed: averagedHeading.toFixed(1) + '°',
      accuracy: accuracy ? accuracy + '°' : 'unknown'
    });
  };

  useEffect(() => {
    // Check if device orientation is supported
    if (!window.DeviceOrientationEvent) {
      setError('Device orientation not supported');
      return;
    }

    // Request permission and set up listeners
    requestPermission();

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Compass</h3>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <p className="text-2xl font-bold">
              {heading !== null ? `${heading.toFixed(1)}°` : 'No heading'}
            </p>
            {permissionState === null && (
              <button
                onClick={requestPermission}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enable Compass
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Compass;