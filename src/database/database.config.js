//imports
const { Pool } = require('pg'); 

//config without dotenv and local db for tests
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
    /*
    PARA USO DE BANCO LOCAL:
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
    */
});

module.exports = pool;