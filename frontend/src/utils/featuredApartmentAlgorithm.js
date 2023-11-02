/**
 * Calculates the distance between the user's location
 * and the location of apartments. Based on coordinates
 * gathered from the user's IP.
 */

function calculateDistance(coord1, coord2) {
    if (!coord1 || !coord2) {
        console.error('Invalid coordinates for distance calculation.');
        return Infinity;
    }
    return Math.sqrt(Math.pow(coord1.lat - coord2.lat, 2) + Math.pow(coord1.lon - coord2.lon, 2));
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