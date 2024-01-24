/**
 * Calculates the distance between the user's location
 * and the location of apartments. Based on coordinates
 * gathered from the user's IP.
 */

import { toRaw } from 'vue'; // To destructure the coordinates received from ip-api.

function calculateDistance(coord1, coord2) {
    console.log("Coordinates: ", coord1, coord2);

    if (!coord1 || !coord2 || typeof coord1.latitude !== 'number' || typeof coord1.longitude !== 'number' || typeof coord2.latitude !== 'number' || typeof coord2.longitude !== 'number') {
        console.error('Invalid coordinates for distance calculation. Types: ', typeof coord1.latitude, typeof coord1.longitude, typeof coord2.latitude, typeof coord2.longitude);
        return Infinity;
    }
    const R = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(coord2.latitude - coord1.latitude);
    const dLon = degreesToRadians(coord2.longitude - coord1.longitude);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(coord1.latitude)) * Math.cos(degreesToRadians(coord2.latitude)) *
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
    if (apartment.beds) score += 1;
    if (apartment.baths) score += 1;
    if (apartment.squareFootage) score += 1;

    return score;
}

/**
 * Finally, sorts apartments based on distance and
 * completeness.
 */

export function sortApartments(apartments, userCoords) {
    const rawUserCoords = toRaw(userCoords) || userCoords; // Converts ProxyObject to values in case that's causing the issue. Otherwise, revert to userCoords if toRaw returns undefined.
    return apartments.sort((a, b) => {
        const distanceA = calculateDistance(rawUserCoords, { latitude: a.latitude, longitude: a.longitude });
        const distanceB = calculateDistance(rawUserCoords, { latitude: b.latitude, longitude: b.longitude });
        const completenessA = calculateCompletenessScore(a);
        const completenessB = calculateCompletenessScore(b);

        if (distanceA !== distanceB) {
            return distanceA - distanceB;
        } else {
            return completenessB - completenessA; 
        }
    })
}