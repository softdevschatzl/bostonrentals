const express = require('express');
const router = express.Router();
const { loadSavedListings } = require('../utils/savedListingsHelper');
const axios = require('axios');

router.get('/get-saved-listings', async (req, res) => {
    const userId = req.user.id;
    const savedListings = loadSavedListings();

    const listingIds = savedListings[userId] || []; 
    
    try {
      // Fetch details for each listing in parallel for speed.
      const listingPromises = listingIds.map((listingId) => 
        axios.post(`/api/properties/${listingId}`)
      );
      const listingResponses = await Promise.all(listingPromises);

      const savedListingsData = listingResponses.map((response) => response.data);
      res.json(savedListingsData);
    } catch (err) {
      console.error('Error fetching saved listings:', err);
      res.status(500).json({ error: 'Error fetching saved listings' });
    }
});

module.exports = router;
