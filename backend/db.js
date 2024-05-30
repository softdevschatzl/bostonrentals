// Database connection setup.

const { Pool } = require('pg');
const { getSecrets } = require('./index');

let pool;

async function initializePool() {
    let secrets;
    if (process.env.NODE_ENV === 'production') {
        secrets = await getSecrets('rds!db-ffb0f2ee-a5f5-457f-8195-0383cd55502d');
    } else {
        secrets = await getSecrets('rds!db-48e4c0b3-373c-4d20-8018-40553229b595');
    }
    let regSecrets = await getSecrets('database-values');

    // console.log("database credentials: ", secrets.username, secrets.password, regSecrets.testHost, regSecrets.port, regSecrets.database);

    // pool = new Pool({
    //     user: secrets.username,
    //     host: secrets.host,
    //     database: regSecrets.database,
    //     password: secrets.password,
    //     port: regSecrets.port,
    // });
    pool = new Pool({
        connectionString: `postgresql://${secrets.username}:${secrets.password}@${regSecrets.testHost}:${regSecrets.port}/${regSecrets.database}`,
        ssl: {
            rejectUnauthorized: false
        }
    });
}

initializePool().catch(err => console.error(err));

// Database interaction.
async function getLists(userId) {
    try {
        const result = await pool.query(
            'SELECT * FROM lists WHERE user_id = $1', [userId]
        );
        return result.rows;
        console.log("result.rows: ", result.rows);
    } catch (error) {
        console.error("Error fetching lists:", error);
        throw error;
    }
}

async function getList(listId) {
    try {
        const result = await pool.query(
            'SELECT * FROM lists WHERE id = $1', [listId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching list:", error);
        throw error;
    }
}

async function createList(userId, name) {
    try {
        const existingList = await pool.query(
            'SELECT * FROM lists WHERE user_id = $1 AND name = $2', [userId, name]
        );

        if (existingList.rows.length > 0) {
            throw new Error('A list with this name already exists for this user.');
        }

        const result = await pool.query(
            'INSERT INTO lists (user_id, name) VALUES ($1, $2) RETURNING *', [userId, name]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error creating list:", error);
        throw error;
    }
}

async function deleteList(listId) {
    try {
        const result = await pool.query(
            'DELETE FROM lists WHERE id = $1 RETURNING *', [listId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting list:", error);
        throw error;
    }
}

async function updateList(listId, name) {
    try {
        const result = await pool.query(
            'UPDATE lists SET name = $1 WHERE id = $2 RETURNING *', [name, listId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error updating list:", error);
        throw error;
    }
}

async function getItems(listId) {
    try {
        const result = await pool.query(
            'SELECT * FROM list_items WHERE list_id = $1', [listId]
        );
        return result.rows;
    } catch (error) {
        console.error("Error fetching items:", error);
        throw error;
    }
}

async function createItem(listId, propertyId) {
    try {
        const result = await pool.query(
            'INSERT INTO list_items (list_id, property_id) VALUES ($1, $2) RETURNING *', [listId, propertyId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error creating item:", error);
        throw error;
    }
}

async function deleteItem(itemId) {
    try {
        const result = await pool.query(
            'DELETE FROM items WHERE id = $1 RETURNING *', [itemId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
}

async function updateItem(name, quantity, itemId) {
    try {
        const result = await pool.query(
            'UPDATE items SET name = $1, quantity = $2 WHERE id = $3 RETURNING *', [name, quantity, itemId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error updating item:", error);
        throw error;
    }
}

module.exports = {
    getLists,
    getList,
    createList,
    deleteList,
    updateList,
    getItems,
    createItem,
    deleteItem,
    updateItem
}