/**
 * Calculates the distance between the user's location
 * and the location of apartments. Based on coordinates
 * gathered from the user's IP.
 */

function calculateDistance(coord1, coord2) {
    console.log("Coordinates: ", coord1, coord2);

    if (!coord1 || !coord2 || typeof coord1.lat !== 'number' || typeof coord1.lon !== 'number' || typeof coord2.lat !== 'number' || typeof coord2.lon !== 'number') {
        console.error('Invalid coordinates for distance calculation.');
        return Infinity;
    }
    const R = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(coord2.lat - coord1.lat);
    const dLon = degreesToRadians(coord2.lon - coord1.lon);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(coord1.lat)) * Math.cos(degreesToRadians(coord2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Calculates the completeness score of a listing.
 * Essentially, how much information is present
 * in a listing, the more important it is.
 */

function calculateCompletenessScore(apartment) {
    let score = 0;
    if (apartment.bedrooms) score += 1;
    if (apartment.bathrooms) score += 1;
    if (apartment.squareFootage) score += 1;
    if (apartment.propertyType) score += 1;

    return score;
}

/**
 * Finally, sorts apartments based on distance and
 * completeness.
 */

export function sortApartments(apartments, userCoords) {
    return apartments.sort((a, b) => {
        const distanceA = calculateDistance(userCoords, a.coords);
        const distanceB = calculateDistance(userCoords, b.coords);
        const completenessA = calculateCompletenessScore(a);
        const completenessB = calculateCompletenessScore(b);

        if (distanceA !== distanceB) {
            return distanceA - distanceB;
        } else {
            return completenessB - completenessA; 
        }
    })
}