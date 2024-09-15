require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,       // Make sure the username is enclosed in quotes
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD, 
    port: process.env.DB_PORT
});


module.exports = pool;