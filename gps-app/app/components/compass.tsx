import React, { useEffect, useState } from 'react';

interface CompassProps {
  onHeadingChange?: (heading: number) => void;
}

const Compass: React.FC<CompassProps> = ({ onHeadingChange }) => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null);

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

  
  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Get compass heading from device
    let newHeading: number;

    if ('webkitCompassHeading' in event) {
      // iOS devices
      newHeading = (event as any).webkitCompassHeading;
    } else if (event.alpha !== null) {
      // Android devices
      // Convert alpha angle to compass heading
      newHeading = 360 - event.alpha;
    } else {
      setError('Compass heading not available');
      return;
    }

    // Normalize heading to 0-360 range
    newHeading = (newHeading + 360) % 360;
    
    setHeading(newHeading);
    if (onHeadingChange) {
      onHeadingChange(newHeading);
    }

    console.log('Compass Heading:', newHeading.toFixed(1) + '°');
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