// Database connection setup.

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => console.log('Database pool connected.'));
pool.on('error', (err) => console.error('Unexpected database pool error:', err));

// ── Users ─────────────────────────────────────────────────────────────────────

async function getUserByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
}

async function getUserById(id) {
    const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
}

async function createUser(email, name, passwordHash) {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
        throw new Error('An account with that email already exists.');
    }
    const result = await pool.query(
        'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, name, passwordHash]
    );
    return result.rows[0];
}

// ── Lists ─────────────────────────────────────────────────────────────────────

async function getLists(userId) {
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
            'DELETE FROM list_items WHERE id = $1 RETURNING *', [itemId]
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

// Function to remove items from the database if they are removed from MLS/API
async function removeItemsFromList(propertyId) {
    try {
        const result = await pool.query(
            'DELETE FROM list_items WHERE property_id = $1 RETURNING *', [propertyId]
        );
        return result.rows[0];
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
}

module.exports = {
    getUserByEmail,
    getUserById,
    createUser,
    getLists,
    getList,
    createList,
    deleteList,
    updateList,
    getItems,
    createItem,
    deleteItem,
    updateItem,
    removeItemsFromList,
}