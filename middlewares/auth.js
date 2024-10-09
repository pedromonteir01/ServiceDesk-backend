const pool = require('../src/database/database.config');

const authenticate = (req, res) => {
    try {
        
    } catch(e) {
        return res.status(500).send({ error: e });
    }
}

