// Database connection setup.

const { Pool } = require('pg');
const { getSecrets } = require('./index');

let pool;

async function initializePool() {
    const secrets = await getSecrets();
    pool = new Pool({
        user: secrets.username,
        host: secrets.host,
        database: secrets.database,
        password: secrets.password,
        port: secrets.port,
    });
}

initializePool().catch(err => console.error(err));

// Database interaction.
async function getLists() {
    try {
        const result = await pool.query(
            'SELECT * FROM lists WHERE user_id = $1', [userId]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching lists:", error);
        throw error;
    }
}

module.exports = {
    getLists,
    // Add more functions here.
}