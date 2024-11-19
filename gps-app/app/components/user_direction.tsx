"use client";
import useCompass from './compass';
import { useGps } from './GpsProvider';
import navigation from './navigation'
import calculateBearing from './calculate_bearing';
import Map from './map';
const {position: GPSposition} = useGps();;
import { useEffect, useState,useRef } from 'react';
const [linePositions, setLinePositions] = useState([])

export default function user_direction() {
    const [utterance, setUtterance] = useState();
    const currentBearing = useCompass();
    const markerPosition=[GPSposition.lat,GPSposition.lng];
    const nextPoint=navigation.Navigate(markerPosition)[0];
    const expectedBearing=calculateBearing([markerPosition,nextPoint]);
    const bearingCalc = currentBearing - expectedBearing;
    if (currentBearing == null || expectedBearing == null){
        console.log(Error)
    }
    
    else if(currentBearing - expectedBearing > 15){
        let utterance = new SpeechSynthesisUtterance("Turn Left");
        setUtterance(utterance);
        console.log("\nCalculation:",bearingCalc);
    }
    else if(currentBearing - expectedBearing < -15){
        let utterance = new SpeechSynthesisUtterance("Turn Right");
        setUtterance(utterance)
        console.log("\nCalculation:",bearingCalc);
    }

    return (utterance);
    };
