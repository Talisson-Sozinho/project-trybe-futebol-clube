import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.service';

class leaderboardController {
  constructor(private _leaderboardService = new LeaderboardService()) { }

  public filterHome = async (_req: Request, res: Response) => {
    const result = await this._leaderboardService.homeFilter();
    return res.status(200).json(result);
  };

  public filterAway = async (_req: Request, res: Response) => {
    const result = await this._leaderboardService.awayFilter();
    return res.status(200).json(result);
  };

  public leaderboard = async (_req: Request, res: Response) => {
    const result = await this._leaderboardService.leaderboardTable();
    return res.status(200).json(result);
  };
}

export default leaderboardController;
