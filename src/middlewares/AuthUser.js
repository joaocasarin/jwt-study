const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).send({ message: 'No Authorization Header.' });
        }

        const authHeaderSplit = authHeader.split(' ');

        if (!authHeaderSplit.length === 2) {
            return res.status(400).send({ message: 'Wrong Authorization Header format.'});
        }

        const [ tokenType, token ] = authHeaderSplit;

        if (!/^Bearer$/i.test(tokenType)) {
            return res.status(401).send({ message: 'Wrong token format.' });
        }

        if (!jwt.verify(token, process.env.SECRET)) {
            return res.status(403).send({ message: 'Invalid token.'});
        }

        return next();
    } catch(e) {
        return res.send({ error: e.message });
    }
}