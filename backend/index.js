require('dotenv').config();
const express = require('express');
const axios = require('axios');
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

app.use(express.json());

// // Limits API queries. Remove when upgrading API.
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 30 days in milliseconds.
//     max: 50, // Limiting API calls to 50 every month.
//     message: "Too many requests from this IP."
// });

// Creating route to fetch data (YGL API)
app.post('/properties', async (req, res) => {
    try {
        const { street_name, city_neighborhood, zip, state, beds, baths, square_footage_min, max_rent, min_rent, listing_fee, avail_from, avail_to, limit = 30 } = req.body;
        console.log("Query body:", req.body)

        // Needed a workaround for the API to work with blank query params.
        // If the query param is blank, it will not be included in the API call.
        let params = { 
            key: apiKey, 
            state, 
            limit,
            request_type: 'JSON', 
        };

        // Add parameters to the request if they are not blank.
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


        const response = await axios.post(`https://www.yougotlistings.com/api/rentals/search.php?key=${apiKey}`, params);
        
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
app.get('/api/apartments', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        const response = await axios.get(`https://www.yougotlistings.com/api/rentals/search.php?key=${apiKey}`, {
            params: {
                latitude_start,
                longitude_start
            },
            headers: {
                'Accept': 'application.json',
                'X-Api-Key': apiKey
            }
        });

        return res.json(response.data);
    } catch (error) {
        console.error("API call failed:", error.message);
        return res.status(500).json({ error: "Failed to fetch data." });
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
