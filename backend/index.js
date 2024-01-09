require('dotenv').config();
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const apiKey = process.env.YGL_API_KEY;
const cors = require('cors');
const { redirectToCognitoUI } = require('./cognito');

const app = express();
const PORT = 3000;

// Only allowing access from certain origin points.
const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000', 'https://softdevschatzl.github.io', 'https://alexandersrentals.com']
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// // Limits API queries. Remove when upgrading API.
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 30 days in milliseconds.
//     max: 50, // Limiting API calls to 50 every month.
//     message: "Too many requests from this IP."
// });

app.use('/properties', limiter);

// Creating route to fetch data (YGL API)
app.get('/properties', async (req, res) => {
    try {
        const { address, city, state, zipCode, propertyType, bedrooms, bathrooms, limit = 20 } = req.query;
        console.log("Query params:", req.query)

        // Needed a workaround for the API to work with blank query params.
        // If the query param is blank, it will not be included in the API call.
        let params = { state, limit };

        // Add parameters to the request if they are not blank.
        if (address) params.street_name = address;
        if (city) params.city_neighborhood = city;
        if (zipCode) params.zip = zipCode;
        if (bedrooms) params.min_bed = bedrooms;
        if (bathrooms) params.min_bath = bathrooms;
        if (maxRent) params.max_rent = maxRent;
        if (minRent) params.min_rent = minRent;
        if (fee) params.listing_fee = fee;
        if (availFrom) params.avail_from = availFrom;
        if (availTo) params.avail_to = availTo;

        const response = await axios.get('https://www.yougotlistings.com/api/rentals/search.php', {
            params: params,
            headers: {
                'Accept': 'application/json',
                'X-Api-Key': apiKey
            }
        });

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
        const userIp = '43.225.189.77';
        // const userIp = req.ip; Use this after testing locally.
        const response = await axios.get(`http://ip-api.com/json/${userIp}`);
        return res.json(response.data);
    } catch (error) {
        console.error("Failed to fetch user location:", error.message);
        return res.status(500).json({ error: "Failed to fetch user location." });
    }
});

// Fetch properties based on latitude and longitude.
// app.get('/api/apartments', async (req, res) => {
//     try {
//         const { lat, lon } = req.query;

//         const response = await axios.get('https://api.rentcast.io/v1/properties', {
//             params: {
//                 lat,
//                 lon
//             },
//             headers: {
//                 'Accept': 'application.json',
//                 'X-Api-Key': apiKey
//             }
//         });

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
