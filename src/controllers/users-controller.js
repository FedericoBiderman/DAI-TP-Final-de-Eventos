import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from './../services/users-service.js';


const router = Router();
const svc = new UserService();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const response = await svc.login(username, password);
    if (response.success) {
        return res.status(StatusCodes.OK).json(response);
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).json(response);
    }
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    try {
        const message = await svc.register(first_name, last_name, username, password);
        return res.status(StatusCodes.CREATED).send(message);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).send(error.message);
    }
});

export default router;
