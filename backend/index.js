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

const app = express();
const PORT = 3000;

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
const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000', 'https://softdevschatzl.github.io', 'https://alexandersrentals.com', 'https://d1lcia0inyjsq.cloudfront.net', 'https://alexanderrentals-login.auth.us-east-2.amazoncognito.com']
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

// Creating route to fetch data (YGL API)
app.post('/properties', async (req, res) => {
    try {
        const { latitude_start, latitude_end, longitude_start, longitude_end, street_name, 
            city_neighborhood, zip, state = 'MA', beds, baths, square_footage_min, max_rent, min_rent, 
            listing_fee, avail_from, avail_to, photo, tours } = req.body;

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
        if (beds) params.min_bed = beds;
        if (baths) params.min_bath = baths;
        if (square_footage_min) params.square_footage_min = square_footage_min;
        if (max_rent) params.max_rent = max_rent;
        if (min_rent) params.min_rent = min_rent;
        if (listing_fee) params.listing_fee = listing_fee;
        if (avail_from) params.avail_from = avail_from;
        if (avail_to) params.avail_to = avail_to;
        if (photo) params.photo = photo;
        if (tours) params.tours = tours;

        console.log("Full Params:", params)

        const response = await axios.post(`https://www.yougotlistings.com/api/rentals/search.php?key=${apiKey}`, params);
        
        console.log("Response data:", response.data) 
        
        return res.json(response.data);

    } catch (error) {
        console.error("API call failed:", error);
        return res.status(500).json({ error: "Failed to fetch data" });
    }
});

// Fetch user's IP to show featured apartments closest to them.
app.get('/api/location', async (req, res) => {
    console.log("Location route hit.")
    try {
        // const userIp = '149.40.50.212'; // Coordinates returned: 42.3562, -71.0631
        const userIp = '76.19.221.189'; // Coordinates returned: 42.2518, -71.0805
        // const userIp = req.ip; 
        const response = await axios.get(`http://ip-api.com/json/${userIp}`);
        console.log("Response data:", response.data)
        return res.json(response.data);
    } catch (error) {
        console.error("Failed to fetch user location:", error.message);
        return res.status(500).json({ error: "Failed to fetch user location." });
    }
});

// Fetch properties based on latitude and longitude.
// app.post('/api/apartments', async (req, res) => {
//     try {
//         const coords = req.body;
//         const params = {
//             key: apiKey,
//             detail_level: 2,
//             ...coords,
//             request_type: 'JSON',
//         }

//         const response = await axios.post(`https://www.yougotlistings.com/api/rentals/search.php?key=${apiKey}`, params);

//         return res.json(response.data);

//     } catch (error) {
//         console.error("API call failed:", error.message);
//         return res.status(500).json({ error: "Failed to fetch data." });
//     }
// });

// Creates endpoint for Cognito login.
app.get('/api/login', (req, res) => {
    const url = redirectToCognitoUI();
    res.json({ url });
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
