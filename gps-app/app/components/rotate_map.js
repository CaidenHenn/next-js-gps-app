
export const rotateMap = (map, angle) => {
    
    if (map) {
        
		const currentBearing = map.getBearing();
        
        map.setBearing(angle); // Attempt to rotate
		const currentBearing2 = map.getBearing();
  
    } else {
        console.error("Map instance is not available.");
    }
};
