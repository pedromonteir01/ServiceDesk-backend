const jwt = require('jsonwebtoken');
const authConfig = process.env.SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Verifica se o cabeçalho Authorization está presente
    if (!authHeader) {
        return res.status(401).send({ error: 'Nenhum token fornecido' });
    }

    const parts = authHeader.split(' ');

    // Verifica se o token tem duas partes (Bearer + token)
    if (parts.length !== 2) {
        return res.status(401).send({ error: 'Erro no formato do token' });
    }

    const [scheme, token] = parts;

    // Verifica se o token tem o esquema Bearer correto
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformado' });
    }

    // Verifica e decodifica o token
    jwt.verify(token, authConfig, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ error: 'Token expirado' });
            } else {
                return res.status(401).send({ error: 'Token inválido' });
            }
        }

        // Token válido, associamos o email decodificado à requisição
        req.email = decoded.email;
        return next();
    });
};