const pool = require('../database/database.config');

const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        await pool.query()
    } catch(e) {
        return res.status(500).send({ message: e });
    }
}