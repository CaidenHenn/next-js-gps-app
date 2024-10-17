
export const rotateMap = (map, angle) => {
    console.log("Map instance:", map); // Confirm map instance
    if (map) {
        console.log("Rotating map by angle:", angle); // Confirm angle
		const currentBearing = map.getBearing();
        console.log("Current Bearing:", currentBearing); 
        map.setBearing(angle); // Attempt to rotate
		const currentBearing2 = map.getBearing();
        console.log("Current Bearing:", currentBearing2); 
    } else {
        console.error("Map instance is not available.");
    }
};
