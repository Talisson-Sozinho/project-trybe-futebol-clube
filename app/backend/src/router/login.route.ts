import { Router } from 'express';
import LoginController from '../controllers/login.controller';
import 'express-async-errors';

const router = Router();

const loginController = new LoginController();

router.post('/', loginController.login);

export default router;
