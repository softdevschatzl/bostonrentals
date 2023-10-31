require('dotenv').config();
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const apiKey = process.env.RENTCAST_API_KEY;
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());

// Limits API queries. Remove when upgrading API.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 30 days in milliseconds.
    max: 50, // Limiting API calls to 50 every month.
    message: "Too many requests from this IP."
});

app.use('/properties', limiter);

// Creating route to fetch data (RentCast API)
app.get('/properties', async (req, res) => {
    try {
        const { city, state, limit = 20 } = req.query;

        const response = await axios.get('https://api.rentcast.io/v1/properties', {
            params: {
                city,
                state,
                limit
            },
            headers: {
                'Accept': 'application.json',
                'X-Api-Key': apiKey
            }
        });

        return res.json(response.data);
    } catch (error) {
        console.error("API call failed:", error.message);
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

        const response = await axios.get('https://api.rentcast.io/v1/properties', {
            params: {
                lat,
                lon
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});