/**
 * @fileoverview This is the main file for the backend. It contains the API calls to the YGL API.
 * It also contains the route to fetch the user's IP address and the route to fetch properties based on latitude and longitude.
 */
require('dotenv').config();
const express = require('express');
// helmet is for csp headers and general web security.
const helmet = require('helmet');
const axios = require('axios');
const apiKey = process.env.YGL_API_KEY;
const cors = require('cors');
const { redirectToCognitoUI } = require('./cognito');
const { signIn } = require('./cognito');

const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Login logic.
app.use(cookieParser());

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    signIn(username, password, (err, tokens) => {
        if (err) {
            // Handle error (invalid credentials, Cognito errors, etc.)
            res.status(401).json({ error: err.message });
        } else {
            // Set tokens in HTTP-only cookies
            res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.cookie('idToken', tokens.idToken, { httpOnly: true, secure: true, sameSite: 'Strict' });

            // Send a success response
            res.status(200).json({ message: 'Logged in successfully' });
        }
    });
});

app.get('/api/check-login-status', (req, res) => {
    if (req.cookies.accessToken) {
        res.json({ isLoggedIn: true });
    } else {
        res.json({ isLoggedIn: false });
    }
});

app.get('/api/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('idToken');
    res.json({ message: 'Logged out successfully.' });
});

// Setting CSP headers to allow Cognito scripts.
app.use('/auth-route', helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://d1lcia0inyjsq.cloudfront.net", "https://alexanderrentals-login.auth.us-east-2.amazoncognito.com"]
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

// Only allowing access from certain origin points.
const allowedOrigins = [
    'http://localhost:8080', 
    'http://localhost:3000', 
    'https://softdevschatzl.github.io', 
    'https://alexandersrentals.com', 
    'https://d1lcia0inyjsq.cloudfront.net', 
    'https://alexanderrentals-login.auth.us-east-2.amazoncognito.com'
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

app.use(express.json());

// Creating route to fetch data (YGL API)
app.post('/properties', async (req, res) => {
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

        // Add parameters to the request if they are not blank.
        // Coordinate parameters for ApartmentList.
        if (latitude_start) params.latitude_start = latitude_start;
        if (latitude_end) params.latitude_end = latitude_end;
        if (longitude_start) params.longitude_start = longitude_start;
        if (longitude_end) params.longitude_end = longitude_end;
        // Other parameters.
        if (street_name) params.street_name = street_name;
        if (city_neighborhood) params.city_neighborhood = city_neighborhood;
        if (zip) params.zip = zip;
        if (beds) params.beds = beds;
        if (min_bed) params.min_bed = min_bed;
        if (max_bed) params.max_bed = max_bed;
        if (baths) params.baths = baths;
        if (min_bath) params.min_bath = min_bath;
        if (max_bath) params.max_bath = max_bath;
        if (square_footage_min) params.square_footage_min = square_footage_min;
        if (square_footage_max) params.square_footage_max = square_footage_max;
        if (pet) params.pet = pet;
        if (parking) params.parking = parking;
        if (max_rent) params.max_rent = max_rent;
        if (min_rent) params.min_rent = min_rent;
        if (listing_fee) params.listing_fee = listing_fee;
        if (avail_from) params.avail_from = avail_from;
        if (avail_to) params.avail_to = avail_to;
        if (photo) params.photo = photo;
        if (tours) params.tours = tours;
        if (features) params.features = features;
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
        // const userIp = '149.40.50.212'; // Coordinates returned: 42.3562, -71.0631
        const userIp = '98.118.50.209'; // Coordinates returned: 42.2518, -71.0805
        // const userIp = req.ip; 
        const response = await axios.get(`http://ip-api.com/json/${userIp}`);
        // console.log("Response data:", response.data)
        return res.json(response.data);
    } catch (error) {
        console.error("Failed to fetch user location:", error.message);
        return res.status(500).json({ error: "Failed to fetch user location." });
    }
});

// Creates endpoint for Cognito login.
app.get('/api/login', (req, res) => {
    const url = redirectToCognitoUI();
    res.json({ url });
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
