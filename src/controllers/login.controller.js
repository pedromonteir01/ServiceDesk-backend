const pool = require('../database/database.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const authConfig = process.env.SECRET;
const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const user = (await pool.query('SELECT * FROM users WHERE email=$1', [email])).rows[0];
        if(!user) {
            return res.status(400).send({ error: 'usuário não encontrado' });
        }

        if(!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ message: 'senha incorreta' });
        }

        const refreshToken = {
            token: jwt.sign({ email: user.email }, authConfig, {
                expiresIn: 604800
            }),
            expires: 604800
        }

        const accessToken = jwt.sign({ email: user.email }, authConfig, {
            expiresIn: 120
        });

        await pool.query('INSERT INTO refreshToken(token, expires, email) VALUES($1, $2, $3)', [refreshToken.token, refreshToken.expires, email]);

        return res.status(200).send({ user: user, refreshToken: refreshToken.token, accessToken: accessToken });
    } catch(e) {
        return res.status(500).send({ error: e });
    }
}

const refresh = async(req, res) => {
    try {
        const { refreshToken } = req.body;

        const token =(await pool.query('SELECT token, email FROM refreshToken WHERE token=$1', [refreshToken])).rows[0];

        if(!token) {
            return res.status(401).send({ message: 'token expirado' });
        }

        const accessToken = jwt.sign({ email: token.email }, authConfig, {
            expiresIn: 120
        });

        return res.status(200).send({ accessToken: accessToken });

    } catch(e) {
        return res.status(500).send({ error: e });
    }
}

module.exports = {login, refresh} ;