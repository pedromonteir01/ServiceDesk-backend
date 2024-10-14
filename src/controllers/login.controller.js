const pool = require('../database/database.config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = process.env.SECRET;

// Função para gerar access token
function generateAccessToken(user) {
    return jwt.sign(user, authConfig, { expiresIn: '2m' }); // Expira em 2 minutos
}

// Função para gerar refresh token
function generateRefreshToken(user) {
    return jwt.sign(user, authConfig, { expiresIn: '7d' }); // Expira em 7 dias
}

// Login de usuário
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = (await pool.query('SELECT * FROM users WHERE email=$1', [email])).rows[0];
        if (!user) {
            return res.status(400).send({ error: 'credenciais inválidas' });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ error: 'credenciais inválidas' });
        }

        const accessToken = generateAccessToken({ email: user.email, isAdmin: user.isadmin });
        const refreshToken = generateRefreshToken({ email: user.email });

        // Verifica se já existe um refresh token para este usuário
        const existingToken = (await pool.query('SELECT * FROM refreshToken WHERE email=$1', [email])).rows[0];

        if (existingToken) {
            // Atualiza o token existente
            await pool.query('UPDATE refreshToken SET token=$1, expires=$2 WHERE email=$3', [refreshToken, 604800, email]);
        } else {
            // Insere um novo token se não existir
            await pool.query('INSERT INTO refreshToken (token, expires, email) VALUES ($1, $2, $3)', [refreshToken, 604800, email]);
        }

        return res.status(200).send({
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (e) {
        return res.status(500).send({ error: 'Erro no servidor', details: e.message });
    }
};

// Refresh Token
const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).send({ message: 'Refresh token é necessário' });
        }

        const tokenRecord = (await pool.query('SELECT token, email FROM refreshToken WHERE token=$1', [refreshToken])).rows[0];
        if (!tokenRecord) {
            return res.status(401).send({ message: 'Token expirado ou inválido' });
        }

        jwt.verify(refreshToken, authConfig, (err, user) => {
            if (err) return res.status(403).send({ error: 'Token inválido' });

            const newAccessToken = generateAccessToken({ email: user.email });
            return res.status(200).send({ accessToken: newAccessToken, refreshToken: refreshToken });
        });
    } catch (e) {
        return res.status(500).send({ error: 'Erro no servidor', details: e.message });
    }
};

module.exports = { login, refresh };
