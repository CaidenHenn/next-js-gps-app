export const KalmanFilter = ({ Q_metres_per_second, MinAccuracy }) => {
  //initializing variables
  let lat = null;
  let lng = null;
  let variance = -1;
  let timeStamp = null;
  //kalman filter proccesing part
  const process = (latMeasurement, lngMeasurement, accuracy, timeStampMilliseconds) => {
    console.log("New measurement received:", { latMeasurement, lngMeasurement, accuracy, timeStampMilliseconds });

    if (accuracy < MinAccuracy) accuracy = MinAccuracy;
    console.log("Adjusted accuracy:", accuracy);

    if (variance < 0) {
      console.log("Initializing filter with first measurement");
      timeStamp = timeStampMilliseconds;
      lat = latMeasurement;
      lng = lngMeasurement;
      variance = accuracy * accuracy;
      console.log("Initial values set:", { lat, lng, variance });
    } else {
      const timeIncMilliseconds = timeStampMilliseconds - timeStamp;
      console.log("Time since last update (ms):", timeIncMilliseconds);

      if (timeIncMilliseconds > 0) {
        console.log("Updating variance based on time increment and process noise");
        variance += (timeIncMilliseconds * Q_metres_per_second ** 2) / 1000;
        timeStamp = timeStampMilliseconds;
      }

      const K = variance / (variance + accuracy * accuracy);
      console.log("Kalman gain (K):", K);

      lat = lat + K * (latMeasurement - lat);
      lng = lng + K * (lngMeasurement - lng);
      variance = (1 - K) * variance;

      console.log("Updated latitude:", lat);
      console.log("Updated longitude:", lng);
      console.log("Updated variance:", variance);
    }
    return { lat, lng, variance };
  };

  return { process };
};
