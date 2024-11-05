interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  /**
   * Calculate the bearing between two points on the Earth's surface.
   * @param start - Starting coordinates {latitude, longitude}
   * @param end - Ending coordinates {latitude, longitude}
   * @returns bearing in degrees from true north (0-360°)
   */
  export default function calculateBearing(coordinates: number[][]): number {
    const [lat1, lon1] = coordinates[0];
    const [lat2, lon2] = coordinates[1];
  
    // Convert latitude and longitude to radians
    const lat1Rad = toRadians(lat1);
    const lon1Rad = toRadians(lon1);
    const lat2Rad = toRadians(lat2);
    const lon2Rad = toRadians(lon2);
  
    // Calculate the difference in longitude
    const deltaLon = lon2Rad - lon1Rad;
  
    // Calculate bearing using the haversine formula
    const x = Math.cos(lat2Rad) * Math.sin(deltaLon);
    const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);
  
    // Calculate initial bearing and convert to degrees
    const bearing = toDegrees(Math.atan2(x, y));
  
    // Normalize to 0-360°
    console.log(bearing);
    return (bearing + 360) % 360;

  }
  
  function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  

  function toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }
  