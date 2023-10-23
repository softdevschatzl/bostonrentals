require('dotenv').config();
const express = require('express');
const axios = require('axios');
const apiKey = process.env.RENTCAST_API_KEY;

const app = express();
const PORT = 3000;

// Creating route to fetch data (RentCast API)
app.get('/properties', async (req, res) => {
    try {
        const { cty, state, limit = 20 } = req.query;

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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})