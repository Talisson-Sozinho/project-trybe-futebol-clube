import { Router } from 'express';
import 'express-async-errors';
import LeaderboardController from '../controllers/leaderboard.controller';

const router = Router();

const leaderboardController = new LeaderboardController();

router.get('/home', leaderboardController.filterHome);
router.get('/away', leaderboardController.filterAway);
router.get('/', leaderboardController.leaderboard);

export default router;
