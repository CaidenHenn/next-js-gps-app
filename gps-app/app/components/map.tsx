// app/components/Map.tsx
"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup ,Polyline  } from 'react-leaflet';

import { useEffect, useState,useRef } from 'react';
import { EditControl } from 'react-leaflet-draw';
import ReactDOM from "react-dom";
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { rotateMap } from './rotate_map';
import 'leaflet-draw'; // Import Leaflet Draw
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import RoutingMachine from './map_router';
import Gps from './gps';
import 'leaflet-rotate';

//Sets the icons to different marker types
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
//ist->Barc Path coordinates

//defiens the map component

// const defaultRotation = 0;
const Map = ({ showRoutingPath }) => {

  const bounds = [
    [28.143425 , -81.8540972222], // Southwest coordinates
    [28.1531166667, -81.84305]  // Northeast coordinates
  ];

  const lines =[[0.675986819291919,-1.180686950683594],
[0.5990872890098071,-1.136741638183594],
[0.5661300090071965,-1.1827468872070315]];

 // const setMap = useMap();
  
 const mapRef = useRef();
  // defines position component as Center of the map
  const position = [28.143425 , -81.8540972222]; 
  //local image path
  const imageUrl = '/satellite_poly_gps.jpg';
  // Define bounds component
 // const imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]]; 
 const imageBounds = [
  [28.143540, -81.853317],// Southwest coordinates
  [28.153644 , -81.843268] // Northeast coordinates
    
];
 
const MapEvents = () => {
  const map= useMap();
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.fitBounds(bounds); // Automatically adjust to bounds
    }
  }, []);
  useEffect(() => {
    mapRef.current = map;
    // Rotate the map by 45 degrees on initial load
        console.log(map); // Check the methods on the map instance
        rotateMap(map, -47.5);
    
        return () => {
          // Cleanup if necessary
          console.log('Cleanup');
        };
      }, [map]);
  
      return null; // No rendering needed
    };

  const polylineRef = useRef<L.Polyline | null>(null);

  //event handler triggered when a shape or marker is added
  const onCreated = (e) => {
    const layer = e.layer; // Get the layer that was created
    console.log("On created function running");
    console.log(layer); // Log the entire layer object
  
    // Check if the created layer is a polyline
    if (e.layerType === 'polyline') {
        const latlngs = layer.getLatLngs(); 
        console.log('Polyline coordinates:', latlngs);
        // Add the polyline to the map
        layer.addTo(mapRef.current); // Add to the map instance
    } else if (e.layerType === 'polygon') {
        const latlngs = layer.getLatLngs(); 
        console.log('Polygon coordinates:', latlngs);
        // Add the polygon to the map
        layer.addTo(mapRef.current); // Add to the map instance
    } else if (e.layerType === 'marker') {
        const latlng = layer.getLatLng(); 
        console.log('Marker coordinates:', latlng);
        // Add the marker to the map
        layer.addTo(mapRef.current); // Add to the map instance
    } else {
        console.log('Layer type created:', e.layerType);
    }
  };

  
  
  



  
  // const ImageOverlay = () => {
  //   //defines map as the curreent leaflet map instance
  //   const map = useMap();
    
  //   //when the image is mounted, a image overlay is added and when it unmounts it is removed
  //   useEffect(() => {
      
  //     // Creates an image overlay on the map
  //     const overlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);
  //     map.fitBounds(imageBounds); // Fit the map to the bounds of the image
      
  //     return () => {
  //       map.removeLayer(overlay); // Clean up the overlay on unmount
  //     };
  //   }, [map]);

  //   return null; // This component doesn't render anything visible
  // };

    //render();

  //
  return (
    
    <MapContainer whenCreated={mapInstance => 
    { mapRef.current = mapInstance; }} 
    center={position} 
    //minZoom={17}
    zoom ={15}
    rotate={true}
   // bounds={bounds}
    // maxBounds={bounds}
    style={{ height: '800px', width: '100%' }}  >
      
      <RoutingMachine waypoints={lines} showRoutingPath={showRoutingPath} />
      {/* <ImageOverlay /> */}
      <TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
/>


      <FeatureGroup>
      <EditControl
        position="topright"
        //onCreated={onCreated}
        draw={{
          rectangle: true, // Enable drawing rectangles
          polyline: true,   // Enable drawing polylines
          polygon: true,    // Enable drawing polygons
          circle: true,     // Enable drawing circles
          marker: true,     // Enable adding markers
        }}
        edit={{
          remove: true,     // Allow removing shapes
        }}
      />
      </FeatureGroup>
      <MapEvents />
      <Gps />
      {/* Markers */}
      {/* <Polygon
  coordinates={[ [0.675986819291919,-1.180686950683594],[0.677703313285104,-1.180686950683594],[0.7521985455550926,-1.1360549926757815],[0.759750988692249,-1.0691070556640627],[0.675986819291919,-1.180686950683594]]} 
  fillOpacity={0.5}
  strokeWidth={1}
/> */}

      /*
      
      <Marker position={[28.150288374131215, -81.85080528259279]}>
        <Popup>IST Entrance.</Popup>
      </Marker>
      <Marker position={[28.14961672938298, -81.85145437717439]}>
        <Popup>BARC Entrance.</Popup>
      </Marker>
      
      
      
      


    </MapContainer>
  );
};

export default Map;
