/**
 * auth.js
 * Local authentication using bcrypt + JWT.
 * Replaces AWS Cognito.
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '30d';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set.');
}

async function hashPassword(plaintext) {
    return bcrypt.hash(plaintext, SALT_ROUNDS);
}

async function verifyPassword(plaintext, hash) {
    return bcrypt.compare(plaintext, hash);
}

function signAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

function signRefreshToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = { hashPassword, verifyPassword, signAccessToken, signRefreshToken, verifyToken };
