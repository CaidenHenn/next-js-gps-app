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
import calculateBearing from './calculate_bearing';
import 'leaflet-rotate';
import 'leaflet-rotatedmarker';
import useCompass from './compass';

import Navigation from './navigation'

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

//global value for testing


const Map = ({ onMarkerPlaced, showRoutingPath }) => {
  const navigation = Navigation();
  const initialPosition = [28.14961672938298, -81.85145437717439];
  const initialAngle = 0.0;
  const [linePositions, setLinePositions] = useState([])
  const [compassHeading, setCompassHeading] = useState(initialAngle);
  const [markerPosition, setMarkerPosition] = useState(initialPosition);
  const [markerAngle, setMarkerAngle] = useState(initialAngle)
  const closest_coord_to_goal = null;
  const bounds = [
    [28.143425 , -81.8540972222], // Southwest coordinates
    [28.1531166667, -81.84305]  // Northeast coordinates
  ];
  //internal
  const heading = useCompass();
  //useRef(0);
  //useCompass(); // Correct: this is inside a functional component
  const increment = () => {
    heading.current++;
  }

  


 const mapRef = useRef();
  // defines position component as Center of the map
  const position = [28.143425 , -81.8540972222]; 
  //local image path
  const imageUrl = '/satellite_poly_gps.jpg';
  // Define bounds component
 const imageBounds = [
  [28.143540, -81.853317],// Southwest coordinates
  [28.153644 , -81.843268] // Northeast coordinates
    
];
 
const MapEvents = () => {
  const map= useMap();
  // useEffect(() => {
  //   const map = mapRef.current;
  //   if (map) {
  //     map.fitBounds(bounds); // Automatically adjust to bounds
  //   }
  // }, []);

  useEffect(() => {
    mapRef.current = map;
    // Rotate the map by 45 degrees on initial load
        //console.log(map); // Check the methods on the map instance
        rotateMap(map, -47.5);
    
        return () => {
          // Cleanup if necessary
          
        };
      }, [map]);
  
      return null; // No rendering needed
    };
  const polylineRef = useRef<L.Polyline | null>(null);

  const moveMarker = (key) => {
    const moveStep = 0.00001;
    const [lat, lng] = markerPosition;

    const angMoveStep = 0.1;
    const nextPoint=navigation.Navigate(markerPosition,closest_coord_to_goal)[0];
    setLinePositions([markerPosition,nextPoint]);
    console.log("Calling Bearing");
    const expectedBearing=calculateBearing([markerPosition,nextPoint]);


    
    switch (key) {
      case 'w':
        setMarkerPosition([lat + moveStep, lng]);
        increment();
        
        break;
      case 's':
        setMarkerPosition([lat - moveStep, lng]);
        break;
      case 'a':
        setMarkerPosition([lat, lng - moveStep]);
        break;
      case 'd':
        setMarkerPosition([lat, lng + moveStep]);
        break;
      

      default:
        break;
    }

    setMarkerAngle((ang) => {
      switch (key) {
        case 'q':
          return (ang - angMoveStep) % 360;  // Keep angle within 0–360°
          
        case 'e':
          return (ang + angMoveStep + 360) % 360; // Handle negative angles by adding 360
          
        default:
          return ang;
      }
    });
      
      
      
      

  };
  useEffect(() => {
    const handleKeyDown = (event) => {
      moveMarker(event.key);
    };

    // Add keydown event listener when the component is mounted
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [markerPosition]);


  //event handler triggered when a shape or marker is added
  const onCreated = (e) => {
    const layer = e.layer; // Get the layer that was created
    

  
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

    } if (e.layerType === 'marker') {



      



    } else {
        
    }
  };
  const DynamicLine = ({ line_positions }) => {
    return <Polyline positions={line_positions} color="blue" />;
  };
  const RotatingMarker = ({ position, angle }) => {
    const markerRef = useRef(null);
  
    useEffect(() => {
      if (markerRef.current) {
        markerRef.current.setRotationAngle(angle); // Set rotation angle
      }
    }, [angle]);
  
    return (
      <Marker
        ref={markerRef}
        position={position}
        rotation={angle}
      >
        <Popup>Initial Position Marker</Popup>
      </Marker>
    );
  };
  
  return (
    
    <MapContainer whenCreated={mapInstance => 
    { mapRef.current = mapInstance; }} 
    center={position} 
    //minZoom={17}
    zoom ={17}
    rotate={true}
   // bounds={bounds}
    // maxBounds={bounds}
    style={{ height: '800px', width: '100%' }}  >
      
    
      {/* <ImageOverlay /> */}
      <TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution='&copy; <a href="https://www.esri.com/">Esri</a> contributors'
/>


      <FeatureGroup>
      <EditControl
        position="topright"
        onCreated={onCreated}
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
      <Gps compassBearing = {heading} />
      <Marker position={[28.150288374131215, -81.85080528259279]}>
        <Popup>IST Entrance.</Popup>
      </Marker>
      <Marker position={[28.14961672938298, -81.85145437717439]}>
        <Popup>BARC Entrance.</Popup>
      </Marker>

      <RotatingMarker position={markerPosition} angle={markerAngle} />
      

      

      {linePositions.length > 0 && <DynamicLine line_positions={linePositions} />}
      
      
      

        
    </MapContainer>
  );
};




export default Map;
