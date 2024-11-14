// app/components/Map.tsx
"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup ,Polyline  } from 'react-leaflet';
import { useEffect, useState,useRef } from 'react';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { rotateMap } from './rotate_map';
import 'leaflet-draw'; // Import Leaflet Draw
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import Gps from './gps';
import calculateBearing from './calculate_bearing';
import 'leaflet-rotate';
import 'leaflet-rotatedmarker';
import useCompass from './compass';
import { useGps } from './GpsProvider';
import Navigation from './navigation'

//Sets the icons to different marker types
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const Map = ({ onMarkerPlaced, showRoutingPath }) => {
  const navigation = Navigation();
  const {  position: GPSposition, accuracy} = useGps();;
  const initialPosition = [28.14961672938298, -81.85145437717439];
  const initialAngle = 0.0;
  const [linePositions, setLinePositions] = useState([])
  const [markerPosition, setMarkerPosition] = useState(initialPosition);
  const [markerAngle, setMarkerAngle] = useState(initialAngle)
  //internal
  const heading = useCompass();
  const mapRef = useRef();
  // defines position component as Center of the map
  const position = [28.143425 , -81.8540972222]; 
  //local image path
  const imageUrl = '/satellite_poly_gps.jpg';
  const gpsElement = <Gps position= {GPSposition} accuracy={accuracy} compassBearing={heading} mapRef={mapRef.current} />;
  // Define bounds component
 const imageBounds = [
  [28.143540, -81.853317],// Southwest coordinates
  [28.153644 , -81.843268] // Northeast coordinates
    
];
 
const MapEvents = () => {
  const map= useMap();
  
  useEffect(() => {
    console.log("Position", GPSposition)
    if (GPSposition && mapRef.current) {
      map.setView([GPSposition.lat, GPSposition.lng], 40);
    }
  }, [position]);
  useEffect(() => {
    mapRef.current = map;
    // Rotate the map by 45 degrees on initial load
        rotateMap(map, -47.5);
      }, [map]);
      return null;
    };



  useEffect(() => {
    if (GPSposition != null){
    
    const markerPosition=[GPSposition.lat,GPSposition.lng];
    const nextPoint=navigation.Navigate(markerPosition)[0];
    setLinePositions([markerPosition,nextPoint]);
    const expectedBearing=calculateBearing([markerPosition,nextPoint]);
    }
  }, [GPSposition]);

  //gets called on creation of leaflet draw elements
  const onCreated = (e) => {
    const layer = e.layer; 
    if (e.layerType === 'polyline') {
        const latlngs = layer.getLatLngs(); 
        console.log('Polyline coordinates:', latlngs);
        // Add the polyline to the map
        layer.addTo(mapRef.current); // Add to the map instance
    } else if (e.layerType === 'polygon') {
        const latlngs = layer.getLatLngs(); 
        console.log('Polygon coordinates:', latlngs);
        // Add the polygon to the map
        layer.addTo(mapRef.current); 

    } 
  };
  const DynamicLine = ({ line_positions }) => {
    return <Polyline positions={line_positions} color="blue" />;
  };


  //method ffor handling rotated compass marker
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
    zoom ={17}
    rotate={true}
    style={{ height: '800px', width: '100%' }}  >
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
      
      {gpsElement}
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
