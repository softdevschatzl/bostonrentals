/**
 * @fileoverview This is the main file for the backend. It contains the API calls to the YGL API.
 * It also contains the route to fetch the user's IP address and the route to fetch properties based on latitude and longitude.
 */

const express = require('express');
const https = require('https');
require('dotenv').config();
const xssFilters = require('xss-filters');
const validator = require('validator');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt');
const session = require('express-session');
const jwkToPem = require('jwk-to-pem');
// helmet is for csp headers and general web security.
const helmet = require('helmet');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const jswt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const { SecretsManagerClient, GetSecretValueCommand, } = require("@aws-sdk/client-secrets-manager");
const path = require('path');

// import allNeighborhoods from '../frontend/src/utils/dataSets.js';
// allNeighborhoods is an array that is exported from that file.
const { allNeighborhoods, featureMapping } = require('./dataSets');

const secretName = "AlexandersRentalsSecrets";
const secretClient = new SecretsManagerClient({ region: 'us-east-2' });

const cognito = require('./cognito');
cognito.init();

// Implement Secrets.
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

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again in a little while.',
});

const app = express();
const PORT = 3000;

app.set('trust proxy', 1);

app.use(limiter);

// Logging middleware to an access.log file to monitor activity.
const fs = require('fs');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));

app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

let secrets;
let pems;

async function initializePems() {
    try {
        secrets = await getSecrets();
    } catch (error) {
        console.error("Failed to fetch secrets:", error);
    }

    return new Promise((resolve, reject) => {
        const jwksUrl = `https://cognito-idp.${secrets.AWS_REGION}.amazonaws.com/${secrets.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;

        https.get(jwksUrl, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const keys = JSON.parse(data).keys;
                pems = {};

                for (let i = 0; i < keys.length; i++) {
                    const keyId = keys[i].kid;
                    const modulus = keys[i].n;
                    const exponent = keys[i].e;
                    const keyType = keys[i].kty;
                    const jwk = { kty: keyType, n: modulus, e: exponent };
                    const pem = jwkToPem(jwk);
                    pems[keyId] = pem;
                }

                resolve();
            });
        }).on('error', (err) => {
            console.error('Failed to download JWKS:', err);
            reject(err);
        });
    });
}

async function initializeMiddleware() {
    try {
        secrets = await getSecrets();
        await initializePems();

        app.use(session({
            secret: secrets.SESSION_SECRET_KEY,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: true },
        }));
    } catch (error) {
        console.error("Failed to initialize middleware:", error);
    }
}

function authenticate(req, res, next) {
    const idToken = req.cookies.id_token;

    if (!idToken) {
        return res.status(401).json({ error: 'No ID token found' });
    }

    const decodedJwt = jswt.decode(idToken, { complete: true });
    const pem = pems[decodedJwt.header.kid];

    jswt.verify(idToken, pem, { issuer: `https://cognito-idp.us-east-2.amazonaws.com/${secrets.COGNITO_USER_POOL_ID}` }, (err, payload) => {
        if (err) {
            console.error('Failed to verify ID token:', err);
            res.clearCookie('accessToken');
            res.status(500).json({ error: 'Failed to verify ID token', details: err });
        } else {
            req.user = { id: payload.sub }; // Using the subject (sub) as the user ID.
            next();
        }
    });
}

initializeMiddleware().then(() => {
    const pool = require('./db');

    // Saved lists endpoints.
    // Create a new list.
    router.post('/api/list', authenticate, async (req, res) => {
        try {
            const { listName, userId } = req.body;

            const newList = await pool.createList(userId, listName);
            res.status(201).json(newList);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating list' });
        }
    });

    // Get a specific list.
    router.get('/api/list/:listId', authenticate, async (req, res) => {
        try {
            const { listId } = req.params;
            const list = await pool.getList(listId);
            res.json(list);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching list' });
        }
    });

    // Get all lists for a user.
    router.get('/api/lists', authenticate, async (req, res) => {
        try {
            const userId = req.user.id;
            const lists = await pool.getLists(userId);
            res.json(lists);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching lists' });
        }
    });

    // Get all items from a list.
    router.post('/api/lists/:listId/items', authenticate, async (req, res) => {
        try {
            const { listId } = req.params;
            const items = await pool.getItems(listId);
            res.json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error adding item' });
        }
    });

    // Update a specific list.
    router.put('/api/list/:listId', authenticate, async (req, res) => {
        try {
            const { listId } = req.params;
            const { listName } = req.body;
            const updatedList = await pool.updateList(listId, listName);
            res.json(updatedList);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating list' });
        }
    });

    // Delete a specific list.
    router.delete('/api/list/:listId', authenticate, async (req, res) => {
        try {
            const { listId } = req.params;
            const deletedList = await pool.deleteList(listId);
            res.json(deletedList);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting list' });
        }
    });

    // Create a new item in a list.
    router.post('/api/list/:listId/item', authenticate, async (req, res) => {
        try {
            const { listId } = req.params;
            const { itemName } = req.body;
            const newItem = await pool.createItem(listId, itemName);
            res.status(201).json(newItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating item' });
        }
    });

    // Get a specific item.
    router.get('/api/item/:itemId', authenticate, async (req, res) => {
        try {
            const { itemId } = req.params;
            const item = await pool.getItem(itemId);
            res.json(item);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching item' });
        }
    });

    // Update a specific item.
    router.put('/api/item/:itemId', authenticate, async (req, res) => {
        try {
            const { itemId } = req.params;
            const { itemName } = req.body;
            const updatedItem = await pool.updateItem(itemId, itemName);
            res.json(updatedItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating item' });
        }
    });

    // Delete a specific item.
    router.delete('/api/item/:itemId', authenticate, async (req, res) => {
        try {
            const { itemId } = req.params;
            const deletedItem = await pool.deleteItem(itemId);
            res.json(deletedItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting item' });
        }
    });
});

// Only allowing access from certain origin points.
const allowedOrigins = [
    'http://localhost:8080', 
    'http://localhost:3000', 
    'https://alexandersrentals.com', 
    'https://alexandersrentals.com/',
    'https://www.alexandersrentals.com',
    'https://alexandersrentals-nosms.auth.us-east-2.amazoncognito.com'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Defines the root path to serve my frontend from.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.post('/api/token', async (req, res) => {
    // console.log("Received request:", req);
    const secrets = await getSecrets();
    const cognitoClientId = secrets.COGNITO_CLIENT_ID;
    const { code } = req.body;

    // console.log("Code:", code);

    try {
        // Exchange code for tokens
        const urlSearchParams = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: cognitoClientId,
            code,
            redirect_uri: "http://localhost:8080/", // Change this for production.
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
        res.status(error.response?.status || 500).json({ error: error.message });
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
    const idToken = req.cookies.id_token;
    if (idToken) {
        res.json({ isLoggedIn: true });
    } else {
        res.json({ isLoggedIn: false });
    }
});

app.get('/api/user', async (req, res) => {
    const idToken = req.cookies.id_token;
    // console.log("ID Token:", idToken);
    if (!idToken) {
        return res.status(401).json({ error: 'No ID token found' });
    }

    try {
        const decodedToken = jswt.decode(idToken);
        // console.log("Decoded Token:", decodedToken);
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
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://d1lcia0inyjsq.cloudfront.net", "https://alexanderrentals-login.auth.us-east-2.amazoncognito.com"]
    },
    reportOnly: true,
    reportUri: '/report-violation',
}));

app.post('/submit-preapproval', async (req, res) => {
    const {income, creditScore, pets, isStudent, apartmentPreferences, isBroker } = req.body;

    // Basic Validation.
    if (!income || !validator.isNumeric(income) || income < 0) return res.status(400).json({ error: "Invalid income." });
    if (!creditScore || !validator.isInt(creditScore, { min: 300, max: 850 })) return res.status(400).json({ error: "Invalid credit score."}); 
    if (!validator.isAlphanumeric(pets) || !validator.isLength(pets, { max: 50})) return res.status(400).json({ error: "Invalid pets." });
    if (typeof isStudent !== 'boolean') return res.status(400).json({ error: "Invalid student status." });
    if (!validator.isLength(apartmentPreferences, { max: 500}) || !validator.isAlphanumeric(apartmentPreferences)) return res.status(400).json({ error: "Invalid apartment preferences." });
    if (typeof isBroker !== 'boolean') return res.status(400).json({ error: "Invalid broker status." });

    const sanitizedIncome = xssFilters.inHTMLData(income);
    const sanitizedCreditScore = xssFilters.inHTMLData(creditScore);
    const sanitizedPets = xssFilters.inHTMLData(pets);
    const sanitizedApartmentPreferences = xssFilters.inHTMLData(apartmentPreferences);
    
    // FIXME: Implement form submission here...
});

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

        // console.log("Req body:", req.body);

        // let allowedYNValues = ['Parking Included', 'Only Listings With Photos', 'Only Listings With Virtual Tours'];
        // let allowedPetValues = ['Cats', 'Dogs', 'Friendly'];
        // let allowedFeeValues = ['1 Month Fee', 'No Fee'];

        // Use escape to sanitize the input.
        // Use validateInt to check if the input is a valid integer.
        // Add parameters to the request if they are not blank.
        // Coordinate parameters for ApartmentList.
        if (latitude_start && !validator.isDecimal(latitude_start.toString())) return res.status(400).json({ error: "Invalid latitude_start.", message: "Invalid latitude_start." });
            else if (latitude_start) params.latitude_start = latitude_start;

        if (latitude_end && !validator.isDecimal(latitude_end.toString())) return res.status(400).json({ error: "Invalid latitude_end.", message: "Invalid latitude_end." });
        else if (latitude_end) params.latitude_end = latitude_end;

        if (longitude_start && !validator.isDecimal(longitude_start.toString())) return res.status(400).json({ error: "Invalid longitude_start.", message: "Invalid longitude_start." });
            else if (longitude_start) params.longitude_start = longitude_start;

        if (longitude_end && !validator.isDecimal(longitude_end.toString())) return res.status(400).json({ error: "Invalid longitude_end.", message: "Invalid longitude_end." });
            else if (longitude_end) params.longitude_end = longitude_end;

        // Other parameters.
        if (street_name && !validator.isAlpha(street_name)) return res.status(400).json({ error: "Invalid street name.", message: "Invalid street name." });
           else if (street_name) params.street_name = xssFilters.inHTMLData(street_name);

        // if city_neighborhood is not found in allNeighborhoods, return 400 error.
        if (city_neighborhood) {
            const neighborhoods = city_neighborhood.split(',');
            const allValid = neighborhoods.every(neighborhood => {
                const match = allNeighborhoods.find(n => n.apiValue === neighborhood.trim());
                return match !== undefined;
            });
        
            if (!allValid) return res.status(400).json({ error: "Invalid neighborhood.", message: "Invalid neighborhood." });
            if (city_neighborhood) params.city_neighborhood = city_neighborhood;
        }

        if (zip && !validator.isPostalCode(zip, 'US')) return res.status(400).json({ error: "Invalid zip code.", message: "Invalid zip code."});
           else if (zip) params.zip = zip;

        if (beds && !validator.isInt(beds)) return res.status(400).json({ error: "Invalid number of beds.", message: "Invalid number of beds."});
           else if (beds) params.beds = beds;

        if (min_bed && !validator.isInt(min_bed)) return res.status(400).json({ error: "Invalid number of minimum beds.", message: "Invalid number of minimum beds."});
           else if (min_bed) params.min_bed = min_bed;

        if (max_bed && !validator.isInt(max_bed)) return res.status(400).json({ error: "Invalid number of maximum beds.", message: "Invalid number of maximum beds."});
           else if (max_bed) params.max_bed = max_bed;

        if (baths && !validator.isInt(baths)) return res.status(400).json({ error: "Invalid number of baths.", message: "Invalid number of baths."});
           else if (baths) params.baths = baths;

        if (min_bath && !validator.isInt(min_bath)) return res.status(400).json({ error: "Invalid number of minimum baths.", message: "Invalid number of minimum baths."});
           else if (min_bath) params.min_bath = min_bath;

        if (max_bath && !validator.isInt(max_bath)) return res.status(400).json({ error: "Invalid number of maximum baths.", message: "Invalid number of maximum baths."});
           else if (max_bath) params.max_bath = max_bath;

        if (square_footage_min && !validator.isInt(square_footage_min)) return res.status(400).json({ error: "Invalid minimum square footage.", message: "Invalid minimum square footage."});
           else if (square_footage_min) params.square_footage_min = square_footage_min;

        if (square_footage_max && !validator.isInt(square_footage_max)) return res.status(400).json({ error: "Invalid maximum square footage.", message: "Invalid maximum square footage."});
            else if (square_footage_max) params.square_footage_max = square_footage_max;

        if (pet && !validator.isIn(pet, ['cat', 'dog', 'friendly', ''])) return res.status(400).json({ error: "Invalid pet value." });
            else if (pet) params.pet = pet;
        if (parking && !validator.isIn(parking, ['Y', ''])) return res.status(400).json({ error: "Invalid parking value.", message: "Invalid parking value."});
            else if (parking) params.parking = parking;

        if (max_rent && !validator.isInt(max_rent)) return res.status(400).json({ error: "Invalid maximum rent.", message: "Invalid maximum rent."});
        if (max_rent) params.max_rent = xssFilters.inHTMLData(max_rent);
        if (min_rent && !validator.isInt(min_rent)) return res.status(400).json({ error: "Invalid minimum rent.", message: "Invalid minimum rent."});
        if (min_rent) params.min_rent = xssFilters.inHTMLData(min_rent);

        if (listing_fee && !validator.isIn(listing_fee, ['0', '1', ''])) return res.status(400).json({ error: "Invalid listing fee.", message: "Invalid listing fee."});
            else if (listing_fee) params.listing_fee = listing_fee;

            // FIXME: Problem here with date validation.
        // if (avail_from) {
        //     if (!validator.isDate(avail_from)) return res.status(400).json({ error: "Invalid availability date.", message: "Invalid availability date."});
        //         else if (avail_from) params.avail_from = avail_from;
        // }
        // if (avail_to) {
        //     if (!validator.isDate(avail_to)) return res.status(400).json({ error: "Invalid availability date.", message: "Invalid availability date."});
        //         else if (avail_to) params.avail_to = avail_to;
        // }
        if (avail_from) params.avail_from = avail_from;
        if (avail_to) params.avail_to = avail_to;
        

        if (photo && !validator.isIn(photo, ['Y', ''])) return res.status(400).json({ error: "Invalid photo value.", message: "Invalid photo value."});
            if (photo) params.photo = photo;
        if (tours && !validator.isIn(tours, ['Y', ''])) return res.status(400).json({ error: "Invalid tours value.", message: "Invalid tours value."});
            if (tours) params.tours = tours;

        if (features) {
            const selectedFeatures = features.split(',').map(feature => feature.trim());

            for (const selectedFeature of selectedFeatures) {
                const isValidFeature = featureMapping.find(feature => feature.name === selectedFeature);
                if (!isValidFeature) return res.status(400).json({ error: "Invalid features.", message: "Invalid features." });
                    if (features) params.features = features;
            }
        }

        if (laundry && !validator.isIn(laundry, ['In Unit', 'On Site', 'None', ''])) return res.status(400).json({ error: "Invalid laundry value.", message: "Invalid laundry value."});
            if (laundry) params.laundry = laundry;

        // console.log("Full Params:", params)

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
        const userIp = '24.218.95.7'
        // const userIp = req.headers['x-real-ip']?.split(',').shift(); // Coordinates returned: 42.2518, -71.0805
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

module.exports = {
    getSecrets,
};
