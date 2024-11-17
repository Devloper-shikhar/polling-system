const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URI,
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
