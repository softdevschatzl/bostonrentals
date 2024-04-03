const fs = require('fs');
const dataFilePath = './savedListings.json';

const loadSavedListings = () => {
  try {
      const dataBuffer = fs.readFileSync(dataFilePath);
      return JSON.parse(dataBuffer.toString());
  } catch (err) {
      console.error('Error loading saved listings:', err);
      return {}; // Return an empty object if file doesn't exist or has errors
  }
};

const saveListings = (listingsData) => {
  try {
      const dataJSON = JSON.stringify(listingsData);
      fs.writeFileSync(dataFilePath, dataJSON);
  } catch (err) {
      console.error('Error saving listings:', err);
  }
};

module.exports = { loadSavedListings, saveListings };