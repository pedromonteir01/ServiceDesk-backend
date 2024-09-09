//imports
const { Pool } = require('pg'); 

//config without dotenv and local db for tests
const pool = new Pool({
    host: 'localhost',
    port: 7777,
    user: 'postgres',
    password: '1234',
    database: 'bflow'
});

module.exports = pool;