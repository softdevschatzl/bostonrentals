/**
 * Calculates the distance between the user's location
 * and the location of apartments. Based on coordinates
 * gathered from the user's IP.
 * 
 * Biggest waste of time ever. I'm so sorry.
 */

/**
 * 
 * @param {Number} latitude 
 * @param {Number} longitude 
 * @returns 
 */

export function calculateFullCoordinates(latitude, longitude) {
    // const earthRadiusInMiles = 3958.8; // Earth's radius in miles
    // const distanceInRadians = distanceInMiles / earthRadiusInMiles;

    // const latitudeInRadians = degreesToRadians(latitude);
    // const longitudeInRadians = degreesToRadians(longitude);

    // // Calculate new latitude
    // const newLatitudeInRadians = Math.asin(Math.sin(latitudeInRadians) * Math.cos(distanceInRadians) + Math.cos(latitudeInRadians) * Math.sin(distanceInMiles / earthRadiusInMiles) * Math.cos(Math.PI / 2));
    // const newLatitude = Number(radiansToDegrees(newLatitudeInRadians).toFixed(4));

    // // Calculate new longitude
    // const newLongitudeInRadians = longitudeInRadians + Math.atan2(Math.sin(Math.PI / 2) * Math.sin(distanceInMiles / earthRadiusInMiles) * Math.cos(latitudeInRadians), Math.cos(distanceInMiles / earthRadiusInMiles) - Math.sin(latitudeInRadians) * Math.sin(newLatitudeInRadians));
    // const newLongitude = Number(radiansToDegrees(newLongitudeInRadians).toFixed(4));

    const bostonLatitude = 42.3383;
    const bostonLongitude = -70.9596;

    return {
        latitude_start: latitude,
        longitude_start: longitude,
        latitude_end: bostonLatitude,
        longitude_end: bostonLongitude,
    };
}

// function degreesToRadians(degrees) {
//     return degrees * (Math.PI / 180);
// }
// function radiansToDegrees(radians) {
//     return radians * (180 / Math.PI);
// }

/**
 * Calculates the completeness score of a listing.
 * Essentially, how much information is present
 * in a listing, the more important it is.
 */

export function calculateCompletenessScore(apartment) {
    let score = 0;
    if (apartment.beds) score += 1;
    if (apartment.baths) score += 1;
    if (apartment.squareFootage) score += 1;
    if (apartment.photo) score += apartment.photo / 2;
    if (apartment.virtualTours) score += 1;
    if (apartment.price) score += 1;
    if (apartment.pet) score += 1;
    if (apartment.parking) score += 1;
    if (apartment.description) score += 1;
    if (apartment.laundry) score += 1;

    if (apartment.source === "MLS") score += 100;

    return score;
}
