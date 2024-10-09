const pool = require('../database/database.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');
const authMiddleware = require('../middlewares/auth');

const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = (await pool.query('SELECT * FROM users WHERE email=$1', [email])).rows[0];
        console.log(user);
        if(!user) {
            return res.status(400).send({ error: 'usuário não encontrado' });
        }

        if(!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ message: 'senha incorreta' });
        }

        const token = jwt.sign({ email: user.email }, authConfig.secret, {
            expiresIn: 604800
        });

        return res.status(200).send({ user: user, token: token });
    } catch(e) {
        return res.status(500).send({ error: e });
    }
}

module.exports = login;