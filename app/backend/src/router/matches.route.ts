import { Router } from 'express';
import 'express-async-errors';
import jwtValidateMiddleware from '../middlewares/jwtValidate.middleware';

import MatchesController from '../controllers/matches.controller';

const router = Router();

const matchesController = new MatchesController();

router.get('/', matchesController.matches);

router.post('/', jwtValidateMiddleware, matchesController.newMatch);

export default router;
