require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: 'rakshith-raj',       // Make sure the username is enclosed in quotes
  host: 'localhost',
  database: 'meal-match',
  password: 'Pip432po0', 
    port: 5432
});


module.exports = pool;