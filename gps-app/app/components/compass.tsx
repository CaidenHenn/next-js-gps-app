"use client";
import { useEffect, useState } from "react";

const useCompass = () => {
  const [angle, setAngle] = useState(0);
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handler = (e) => {
      // Check if the properties are available
      if (e.webkitCompassHeading !== undefined) {
        setAngle(e.webkitCompassHeading);
      } else if (e.alpha !== null) {
        setAngle(Math.abs(e.alpha - 360));
      } else {
        console.log("Device orientation data not available");
      }
    };

    const startCompassIOS = async () => {
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        try {
          const response = await DeviceOrientationEvent.requestPermission();
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("Permission to access device orientation is required!");
          }
        } catch (error) {
          console.error("Error requesting device orientation permission:", error);
          alert("Device orientation is not supported");
        }
      } else {
        console.log("DeviceOrientationEvent.requestPermission is not a function");
      }
    };

    if (isIOS) {
      startCompassIOS();
    } else {
      window.addEventListener("deviceorientationabsolute", handler, true);
    }

    return () => {
      if (isIOS) {
        window.removeEventListener("deviceorientation", handler, true);
      } else {
        window.removeEventListener("deviceorientationabsolute", handler, true);
      }
    };
  }, []);

  return angle; // Return the heading value from the hook
};

export default useCompass;
