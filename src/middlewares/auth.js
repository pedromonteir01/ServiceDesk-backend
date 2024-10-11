const jwt = require('jsonwebtoken');
const authConfig = process.env.SECRET;

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ error: 'Nenhum token fornecido' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        return res.status(401).send({ error: 'Erro no formato do token' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformado' });
    }

    jwt.verify(token, authConfig, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token inválido' });

        req.email = decoded.email;
        return next();
    });
};
