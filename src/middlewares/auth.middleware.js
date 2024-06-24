import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // El token se espera en el formato "Bearer <token>"

    if (token == null) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token no proporcionado.' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Token inválido.' });
        }
        req.user = user;
        next();
    });
};

export { authenticateToken };
