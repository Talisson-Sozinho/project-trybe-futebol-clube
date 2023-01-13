import { Router } from 'express';
import LoginController from '../controllers/login.controller';
import 'express-async-errors';
import loginBodyValidate from '../middlewares/loginBodyValidate';

const router = Router();

const loginController = new LoginController();

router.post('/', loginBodyValidate, loginController.login);

export default router;
