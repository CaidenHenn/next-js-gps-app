import React, { useEffect } from 'react';
import { Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';

const RoutingMachine = ({ waypoints, showRoutingPath }) => {
  const map = useMap(); // Get the map instance from react-leaflet
  const lines = waypoints; // Assuming waypoints are provided as lat/lng pairs

  // Effect to handle routing visibility based on showRoutingPath
  useEffect(() => {
    if (showRoutingPath) {
      // Additional logic can be added here if needed
    }
  }, [showRoutingPath]); // Run when the showRoutingPath prop changes

  return showRoutingPath && lines.length > 0 ? (
    <Polyline positions={lines} color="blue" />
  ) : null; // Render Polyline only if showRoutingPath is true
};

export default RoutingMachine;
