"use client"; // This marks the component as a Client Component
import { useState } from "react";
import { Polyline, Marker, Popup } from 'react-leaflet';

export const Navigation = () => {
  const sidewalk1coords = [
    [28.149775748402103,  -81.85095963540586],
    [28.149944552942753, -81.85090951139267],
    [28.150050017418955, -81.85086632068324],
    [28.15009503167036, -81.85073120260438],
    [28.150155745485613, -81.85065605639146],
    [28.15024086990182, -81.85054662234343],
    [28.150300402504914, -81.85041348975786],
    [28.150319269443838, -81.85029485376542],
    [28.150341623609453, -81.85017984192132],
    [28.150355836222158, -81.85002726493207]
  ];

  const goal = [28.150288374131215, -81.85080528259279];

  const calculate_distance = (coord1, coord2) => {
    const lat_diff = coord1[0] - coord2[0];
    const long_diff = coord1[1] - coord2[1];
    return Math.sqrt(Math.pow(lat_diff, 2) + Math.pow(long_diff, 2));
  };

  const Navigate = (latlng, closest_coord_to_goal = null) => {
    console.log("LATLNG:", latlng);
    if (!latlng) return;

    // Find the closest point to the goal if not already calculated
    if (closest_coord_to_goal == null) {
      let min_distance_to_goal = 10;
      let closest_goal_point = null;

      for (let i = 0; i < sidewalk1coords.length; i++) {
        const goal_distance_calculation = calculate_distance(goal, sidewalk1coords[i]);
        if (goal_distance_calculation < min_distance_to_goal) {
          closest_goal_point = sidewalk1coords[i];
          min_distance_to_goal = goal_distance_calculation;
        }
      }
      closest_coord_to_goal = closest_goal_point; // Update the closest point to the goal
    }

    // First locate the user's closest coordinate
    let min_distance = 10;
    let closestCoord = [0, 0];

    for (let i = 0; i < sidewalk1coords.length; i++) {
      const calculated_distance = calculate_distance(latlng, sidewalk1coords[i]);
      if (calculated_distance < min_distance) {
        min_distance = calculated_distance;
        closestCoord = sidewalk1coords[i];
      }
    }

    // Greedy algorithm to route to the next coordinate
    if (min_distance < 0.00019680868092807034) {
      closestCoord = GreedyRouter(closestCoord, latlng);
    }

    console.log("This marker coordinate is closest:", closestCoord);
    console.log("DISTANCE IS:", min_distance);

    return [closestCoord, min_distance, closest_coord_to_goal];
  };

  const GreedyRouter = (currentCoord, latlng) => {
    let selected_new_coord = null;
    let min_distance_to_user = 10;
    let min_distance_to_goal = 10;

    for (let i = 0; i < sidewalk1coords.length; i++) {
      const calculated_distance_to_user = calculate_distance(latlng, sidewalk1coords[i]);
      if (calculated_distance_to_user < min_distance_to_user) {
        if (sidewalk1coords[i] === currentCoord) {
          continue;
        } else {
          const potentialCoord = sidewalk1coords[i];
          const potential_coord_to_goal = calculate_distance(potentialCoord, goal);
          if (potential_coord_to_goal < min_distance_to_goal) {
            min_distance_to_goal = potential_coord_to_goal;
            selected_new_coord = potentialCoord;
          }
        }
      }
    }

    return selected_new_coord;
  };

  return { Navigate };
};
  // const CheckForInsideCirclePoints = (currentCoord,selected_new_coord) =>{
  //   var circleCenter = [((currentCoord[0]+selected_new_coord[0])/2),((currentCoord[1]+selected_new_coord[1])/2)];
  //   var radius = calculate_distance(currentCoord,selected_new_coord);
  //   for (int isPointinCircle; i < sidewalk1coords.length; i++){
  //     if (isPointinCircle(i, circleCenter, radius)){
  //       return i;
  //     }
  //   }
  // }


  // const isPointinCircle = (point, circleCenter, radius) => {
  //   const distance = calculate_distance(point,circleCenter);
  //   return distance <= radius;
  // }

export default Navigation;
