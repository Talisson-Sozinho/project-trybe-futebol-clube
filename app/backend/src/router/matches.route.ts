import { Router } from 'express';
import 'express-async-errors';

import MatchesController from '../controllers/matches.controller';

const router = Router();

const matchesController = new MatchesController();

router.get('/', matchesController.matches);

export default router;
