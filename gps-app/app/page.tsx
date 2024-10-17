"use client"; // This marks the component as a Client Component
import { useState, useEffect } from "react";
import Head from 'next/head';
import RoutingMachine from './RoutingMachine';
import Image from "next/image";
import Map from './components/map';
import 'leaflet-rotate';
const Dropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

  const toggleDropdown = () => setIsOpen(!isOpen);

  

  const handleSelect = (option) => {
    setSelected(option);
    onSelect(option);
    setIsOpen(false);
  };

  return (
    
    <div className="relative">
      
      <button className="bg-gray-200 p-2 rounded" onClick={toggleDropdown}>
        {selected || 'Select an option'}
      </button>
      {isOpen && (
        <ul className="absolute bg-white border border-gray-300 mt-1 rounded">
          {options.map((option) => (
            <li
              key={option}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};



export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isRoutingVisible, setRoutingVisible] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDropdownSelect = (value) => {
    console.log('Selected:', value);
  };

  const handleMapReady = (map) => {
    setMapInstance(map);
  };



  const dropdownOptions1 = ['IST'];
  const dropdownOptions2 = ['ARC'];

  const waypoints = [
    [0.675986819291919, -1.180686950683594],
    [0.5990872890098071, -1.136741638183594],
    [0.5661300090071965, -1.1827468872070315],
  ]; // Define your waypoints here

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet-draw/dist/leaflet.draw.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js" defer></script>
        <script src="https://unpkg.com/leaflet-draw/dist/leaflet.draw.js" defer></script>
      </Head>

      <Map 
        waypoints={waypoints} // Pass waypoints to the Map
        showRoutingPath={isRoutingVisible} // Pass routing visibility state to Map
      />

      <Dropdown options={dropdownOptions1} onSelect={handleDropdownSelect} />
      <Dropdown options={dropdownOptions2} onSelect={handleDropdownSelect} />

      <button onClick={() => setRoutingVisible(prev => !prev)}>
        {isRoutingVisible ? "Hide Routing Path" : "Show Routing Path"}
      </button>
      <button 
        onClick={() => {
          if (mapInstance && L.Rotate && L.Rotate.randomRotateMarkers) {
            L.Rotate.randomRotateMarkers(mapInstance);
          } else {
            console.error('Map or rotation function is not available.');
          }
        }} 
        title="Rotate Markers"
      >
        Rotate Markers
      </button>

    </div>
  );
}
