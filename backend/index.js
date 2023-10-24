require('dotenv').config();
import express from 'express';
import { get } from 'axios';
import rateLimit from 'express-rate-limit';
const apiKey = process.env.RENTCAST_API_KEY;

const app = express();
const PORT = 3000;

// Limits API queries. Remove when upgrading API.
const limiter = rateLimit({
    windowMs: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds.
    max: 50, // Limiting API calls to 50 every month.
    message: "Too many requests from this IP."
});

app.use('/properties', limiter);

// Creating route to fetch data (RentCast API)
app.get('/properties', async (req, res) => {
    try {
        const { city, state, limit = 20 } = req.query;

        const response = await get('https://api.rentcast.io/v1/properties', {
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

// 