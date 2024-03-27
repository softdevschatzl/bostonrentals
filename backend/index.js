/**
 * @fileoverview This is the main file for the backend. It contains the API calls to the YGL API.
 * It also contains the route to fetch the user's IP address and the route to fetch properties based on latitude and longitude.
 */

const express = require('express');
const xssFilters = require('xss-filters');
const validator = require('validator');
// helmet is for csp headers and general web security.
const helmet = require('helmet');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const AWS = require('aws-sdk');
const { SecretsManagerClient, GetSecretValueCommand, } = require("@aws-sdk/client-secrets-manager");
const path = require('path');

// import allNeighborhoods from '../frontend/src/utils/dataSets.js';
// allNeighborhoods is an array that is exported from that file.
const allNeighborhoods = require('./dataSets');

const secretName = "AlexandersRentalsSecrets";
const secretClient = new SecretsManagerClient({ region: 'us-east-2' });

const cognito = require('./cognito');
cognito.init();

// Implement SecretsManager
async function getSecrets() {
    try {
    const response = await secretClient.send(new GetSecretValueCommand({ SecretId: secretName }));
    const secrets = JSON.parse(response.SecretString);
    return secrets;
    } catch (error) {
        console.error("Failed to fetch secrets:", error);
        throw error;
    }
}

const app = express();
const PORT = 3000;

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Only allowing access from certain origin points.
// const allowedOrigins = [
//     'http://localhost:8080', 
//     'http://localhost:3000', 
//     'https://alexandersrentals.com', 
//     'https://alexandersrentals.com/',
//     'https://www.alexandersrentals.com',
//     'https://d1lcia0inyjsq.cloudfront.net', 
//     'https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com'
// ];
// app.use(cors({
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));

// Defines the root path to serve my frontend from.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.post('/api/token', async (req, res) => {
    console.log("Received request:", req);
    const secrets = await getSecrets();
    const cognitoClientId = secrets.COGNITO_CLIENT_ID;
    const { code } = req.body;

    try {
        // Exchange code for tokens
        const urlSearchParams = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: cognitoClientId,
            code,
            redirect_uri: 'https://alexandersrentals.com',
        });
        
        const response = await axios.post(`https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com/oauth2/token?${urlSearchParams}`, null, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const tokens = response.data;

        // Set tokens in HTTP-only cookies.
        const fifteenMinutes = 1000 * 60 * 15;
        res.cookie('access_token', tokens.access_token, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'Strict', 
            maxAge: fifteenMinutes
        });
        res.cookie('id_token', tokens.id_token, { 
            httpOnly: true, 
            secure: true, 
            sameSite: 'Strict' 
        });
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: true, 
            sameSite: 'Strict',
            maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
        });

        res.json({ message: 'Authentication successful', tokens: response.data});
    } catch (error) {
        console.error('Failed to exchange code for tokens:', error);
        res.status(500).json({ error: 'Failed to exchange code for tokens' });
    }
});

// Endpoint for refreshing the access token.
app.post('/api/refresh', async (req, res) => {
    const { cognitoClientId } = await getSecrets();
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ error: 'No refresh token found' });
    }

    try {
        // Use Cognito to validate the refresh token and get a new access token.
        // Replace the URL and headers with the correct values.
        const response = await axios.post('https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com/oauth2/token', querystring.stringify({
            grant_type: 'refresh_token',
            client_id: cognitoClientId,
            refresh_token: refreshToken,
        }), {
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    const tokens = response.data;

    // Set the new access token in an HTTP-only cookie.
    res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'Lax',
        maxAge: 1000 * 60 * 10 // 10 minutes
    });
    

    res.json({ success: true });

    } catch (error) {
        console.error('Failed to refresh token:', error);
        res.status(500).json({ error: 'Failed to refresh token' });
    }
});

// We validate the token using the public key provided by Cognito.
async function setUpClient () {
    const secrets = await getSecrets();
    const cognitoUserPoolId = secrets.COGNITO_USER_POOL_ID;

    const client = jwksClient({
        jwksUri: `https://cognito-idp.us-east-2.amazonaws.com/${cognitoUserPoolId}/.well-known/jwks.json`
    });

    return client;
}

setUpClient();

async function getKey(header, callback) {
    const client = await setUpClient();
    client.getSigningKey(header.kid, function(err, key) {
        if (err) {
            callback(err, null);
        } else {
            // Use getPublicKey() to get the actual key
            var signingKey = key.getPublicKey();
            callback(null, signingKey);
        }
    });
}

// And then check the login status.
app.get('/api/check-login-status', (req, res) => {
    console.log("Received cookies: ", req.cookies);
    const accessToken = req.cookies.access_token;

    if (accessToken) {
        jwt.verify(accessToken, getKey, { algorithm: ['RS256'] }, function(err, decoded) {
            if (err) {
                console.error("Token validation error:", err.message);
                res.clearCookie('accessToken'); // Clear the invalid token
                res.json({ isLoggedIn: false });
            } else {
                res.json({ isLoggedIn: true });
            }
        });
    } else {
        res.json({ isLoggedIn: false });
    }
});

app.get('/api/user', async (req, res) => {
    const idToken = req.cookies.id_token;
    console.log("ID Token:", idToken);
    if (!idToken) {
        return res.status(401).json({ error: 'No ID token found' });
    }

    try {
        const decodedToken = jwt.decode(idToken);
        console.log("Decoded Token:", decodedToken);
        res.json({ user: decodedToken });
    } catch (error) {
        console.error('Failed to decode token:', error);
        res.status(500).json({ error: 'Failed to decode token' });
    }
});

app.get('/api/logout', (req, res) => {
    res.clearCookie('accessToken', { path: '/', domain: 'https://alexandersrentals.com'}); // Change this for production.
    res.clearCookie('idToken', { path: '/', domain: 'https://alexandersrentals.com'}); // Change this for production.
    res.json({ message: 'Logged out successfully.' });
    window.alert('You have been logged out.');
});

// Endpoint for fetching cognito client id and domain.
app.get('/api/cognito-config', async (req, res) => {
    const secrets = await getSecrets();
    const cognitoClientId = secrets.COGNITO_CLIENT_ID;
    const cognitoUserPoolId = secrets.COGNITO_USER_POOL_ID;
    
    res.json({
        cognitoRegion: 'us-east-2',
        cognitoClientId: cognitoClientId,
        cognitoUserPoolId: cognitoUserPoolId,
        cognitoDomain: 'https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com',
        redirectUri: 'https://alexandersrentals.com/'
    });
});

//Test

// Setting CSP headers to allow Cognito scripts.
app.use('/auth-route', helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://d1lcia0inyjsq.cloudfront.net", "https://alexanderrentals-login.auth.us-east-2.amazoncognito.com"]
    },
    reportOnly: true,
    reportUri: '/report-violation',
}));

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://d1lcia0inyjsq.cloudfront.net", "https://alexanderrentals-login.auth.us-east-2.amazoncognito.com"]
    },
    reportOnly: true,
    reportUri: '/report-violation',
}));

// Creating route to fetch data (YGL API)
app.post('/api/properties', async (req, res) => {
    const secrets = await getSecrets();
    const apiKey = secrets.YGL_API_KEY;
    try {
        const { latitude_start, latitude_end, longitude_start, longitude_end, street_name, 
            city_neighborhood, zip, state = 'MA', beds, min_bed, max_bed, baths, min_bath, max_bath, 
            square_footage_min, square_footage_max, max_rent, min_rent, pet, parking, features,
            listing_fee, avail_from, avail_to, photo, tours, laundry } = req.body;

        // Needed a workaround for the API to work with blank query params.
        // If the query param is blank, it will not be included in the API call.
        let params = { 
            key: apiKey, 
            state, 
            detail_level: 2,
            request_type: 'JSON', 
        };

        // let allowedYNValues = ['Parking Included', 'Only Listings With Photos', 'Only Listings With Virtual Tours'];
        // let allowedPetValues = ['Cats', 'Dogs', 'Friendly'];
        // let allowedFeeValues = ['1 Month Fee', 'No Fee'];

        // Use escape to sanitize the input.
        // Use validateInt to check if the input is a valid integer.
        // Add parameters to the request if they are not blank.
        // Coordinate parameters for ApartmentList.
        if (latitude_start) params.latitude_start = latitude_start;
        if (latitude_end) params.latitude_end = latitude_end;
        if (longitude_start) params.longitude_start = longitude_start;
        if (longitude_end) params.longitude_end = longitude_end;
        // Other parameters.
        if (street_name !== null) {
            if (!validator.isAlpha(street_name)) return res.status(400).json({ error: "Invalid street name." });
                if (street_name) params.street_name = xssFilters.inHTMLData(street_name);
        }

        // if city_neighborhood is not found in allNeighborhoods, return 400 error.
        if (!allNeighborhoods.find(neighborhood => neighborhood.apiValue === city_neighborhood)) return res.status(400).json({ error: "Invalid neighborhood." });
            if (city_neighborhood) params.city_neighborhood = city_neighborhood;

        if (zip && !validator.isPostalCode(zip)) return res.status(400).json({ error: "Invalid zip code." });
            if (zip) params.zip = xssFilters.inHTMLData(zip);

        if (beds && !validator.isInt(beds)) return res.status(400).json({ error: "Invalid number of beds." });
            if (beds) params.beds = beds;

        if (min_bed && !validator.isInt(min_bed)) return res.status(400).json({ error: "Invalid number of minimum beds." });
            if (min_bed) params.min_bed = min_bed;

        if (max_bed && !validator.isInt(max_bed)) return res.status(400).json({ error: "Invalid number of maximum beds." });
            if (max_bed) params.max_bed = max_bed;

        if (baths && !validator.isInt(baths)) return res.status(400).json({ error: "Invalid number of baths." });
            if (baths) params.baths = baths;

        if (min_bath && !validator.isInt(min_bath)) return res.status(400).json({ error: "Invalid number of minimum baths." });
            if (min_bath) params.min_bath = min_bath;

        if (max_bath && !validator.isInt(max_bath)) return res.status(400).json({ error: "Invalid number of maximum baths." });
            if (max_bath) params.max_bath = max_bath;

        if (square_footage_min && !validator.isInt(square_footage_min)) return res.status(400).json({ error: "Invalid minimum square footage." });
            if (square_footage_min) params.square_footage_min = square_footage_min;

        if (square_footage_max && !validator.isInt(square_footage_max)) return res.status(400).json({ error: "Invalid maximum square footage." });
            if (square_footage_max) params.square_footage_max = square_footage_max;

        // if (pet && !validator.isIn(pet, ['Cats', 'Dogs', 'Friendly', ''])) return res.status(400).json({ error: "Invalid pet value." });
            if (pet) params.pet = pet;
        if (parking && !validator.isIn(parking, ['Y', ''])) return res.status(400).json({ error: "Invalid parking value." });
            if (parking) params.parking = parking;

        if (max_rent && !validator.isInt(max_rent)) return res.status(400).json({ error: "Invalid maximum rent." });
        if (max_rent) params.max_rent = xssFilters.inHTMLData(max_rent);
        if (min_rent && !validator.isInt(min_rent)) return res.status(400).json({ error: "Invalid minimum rent." });
        if (min_rent) params.min_rent = xssFilters.inHTMLData(min_rent);
        if (listing_fee) params.listing_fee = xssFilters.inHTMLData(listing_fee);
        if (avail_from) params.avail_from = xssFilters.inHTMLData(avail_from);
        if (avail_to) params.avail_to = xssFilters.inHTMLData(avail_to);
        if (photo && !validator.isIn(photo, ['Y', ''])) return res.status(400).json({ error: "Invalid photo value." });
            if (photo) params.photo = xssFilters.inHTMLData(photo);
        if (tours && !validator.isIn(tours, ['Y', ''])) return res.status(400).json({ error: "Invalid tours value." });
            if (tours) params.tours = xssFilters.inHTMLData(tours);
        if (features && !validator.isAlpha(features)) return res.status(400).json({ error: "Invalid features value." });
            if (features) params.features = xssFilters.inHTMLData(features);
        if (laundry && !validator.isIn(laundry, ['In Unit', 'On Site', 'None', ''])) return res.status(400).json({ error: "Invalid laundry value." });
            if (laundry) params.laundry = xssFilters.inHTMLData(laundry);

        console.log("Full Params:", params)

        const response = await axios.post(`https://www.yougotlistings.com/api/rentals/search.php?key=${apiKey}`, params);
                
        return res.json(response.data);

    } catch (error) {
        console.error("API call failed:", error);
        return res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Fetch user's IP to show featured apartments closest to them.
app.get('/api/location', async (req, res) => {
    // console.log("Location route hit.")
    try {
        const userIp = req.headers['x-real-ip']?.split(',').shift(); // Coordinates returned: 42.2518, -71.0805
        const response = await axios.get(`http://ip-api.com/json/${userIp}`);
        return res.json(response.data);
    } catch (error) {
        console.error("Failed to fetch user location:", error.message);
        return res.status(500).json({ error: "Failed to fetch user location." });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
