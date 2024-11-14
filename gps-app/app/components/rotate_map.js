
export const rotateMap = (map, angle) => {
    if (map) {
		const currentBearing = map.getBearing();
        map.setBearing(angle); // Attempt to rotate
    } else {
        console.error("Map instance is not available.");
    }
};
