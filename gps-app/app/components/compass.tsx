"use client";
import { useEffect, useState } from "react";

const useCompass = () => {
  //initialize angle
  const [angle, setAngle] = useState(0);
  //bool if device type is IOS
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handler = (e) => {
      ///webkitCompassHeading is IOS
      if (e.webkitCompassHeading !== undefined) {
        setAngle(e.webkitCompassHeading);
        //alpha is android
      } else if (e.alpha !== null) {
        //find angle by subtracting it from 360
        setAngle(Math.abs(e.alpha - 360));
      } else {
        console.log("Device orientation data not available");
      }
    };
    //code to start IOS compass
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
      //listens to deviceorientationabsolute if not IOS
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
//NOTE: Deviceorientation event provides orientation relative to the starting orientation,
//Deviceorientationabsolute event provides orientation relative to earth
    return () => {
      //cleanup functions
      if (isIOS) {
        window.removeEventListener("deviceorientation", handler, true);
      } else {
        window.removeEventListener("deviceorientationabsolute", handler, true);
      }
    };
  }, []);

  return angle-47.5; // subtracting for map rotation
};

export default useCompass;
