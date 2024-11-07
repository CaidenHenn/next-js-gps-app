"use client"; // This marks the component as a Client Component
import { useState } from "react";
import { Polyline, Marker, Popup } from 'react-leaflet';


export const Navigation = () => {
  const sidewalk1coords = [
    [28.14960987881424, -81.85144112053221],
    [28.149603182041528, -81.8513541250505],
    [28.149595901719472, -81.85125197114455],
    [28.149579618505594, -81.85117684085435],
    [28.1495793126917, -81.85108193524498],
    [28.149572615917076, -81.85099493976325],
    [28.14966239514615, -81.85097910358517],
    [28.149748978824814, -81.85096722247091],
    [28.14981173525345, -81.85094513074287],
    [28.149881466135394, -81.85093028731144],
    [28.149940735243455, -81.85090457143511],
    [28.15001976066983, -81.85087028360003],
    [28.150064497200088, -81.8508149127063],
    [28.150104871154827, -81.85073318002786],
    [28.15017664425612, -81.85077139108132],
    [28.15024173461581, -81.85080993305033]
  ];

  const calculate_distance = (coord1, coord2) => {
    const lat_diff = coord1[0] - coord2[0];
    const long_diff = coord1[1] - coord2[1];
    return Math.sqrt(Math.pow(lat_diff, 2) + Math.pow(long_diff, 2));
  };

  const Navigate = (latlng ) => {
    if (!latlng) return;
    
    let min_distance = 10;
    let closestCoord = [0, 0];
    let point_index = 0;

    for (let i = 0; i < sidewalk1coords.length; i++) {
      const calculated_distance = calculate_distance(latlng, sidewalk1coords[i]);
      if (calculated_distance < min_distance) {
        min_distance = calculated_distance;
        closestCoord = sidewalk1coords[i];
        point_index = i;
      }
    }

    if (min_distance < 0.00009680868092807034) {
      closestCoord = sidewalk1coords[point_index + 1];
    }

    // Draw a rectangle around points A and B with a specified width
    if (sidewalk1coords[point_index - 1] != null) {
      const pointA = sidewalk1coords[point_index - 1];
      const pointB = sidewalk1coords[point_index];
      const widthMeters = 5;

      const metersPerDegreeLat = 111320;
      const metersPerDegreeLng = 111320 * Math.cos((pointA[0] * Math.PI) / 180);

      const latOffset = widthMeters / metersPerDegreeLat;
      const lngOffset = widthMeters / metersPerDegreeLng;

      const minLat = Math.min(pointA[0], pointB[0]) - latOffset;
      const maxLat = Math.max(pointA[0], pointB[0]) + latOffset;
      const minLng = Math.min(pointA[1], pointB[1]) - lngOffset;
      const maxLng = Math.max(pointA[1], pointB[1]) + lngOffset;

      const isInsideRectangle =
        latlng[0] >= minLat &&
        latlng[0] <= maxLat &&
        latlng[1] >= minLng &&
        latlng[1] <= maxLng;

      if (isInsideRectangle) {
        
        console.log("In the rectangle");
      } else {
        console.log("Not in the rectangle");
        
      }
    }


    return [closestCoord, min_distance];
  };
  // NavigationAngleReader =(current_angle, tracking_line_angle) => {

  // }
  return { Navigate };
};



export default Navigation;
