import { Router } from 'express';
import 'express-async-errors';

import TeamsController from '../controllers/teams.controller';

const router = Router();

const teamsController = new TeamsController();

router.get('/', teamsController.teams);

export default router;
