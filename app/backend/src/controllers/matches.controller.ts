import { Request, Response } from 'express';
import MatchesService from '../services/matches.service';

class MatchesController {
  constructor(private _MatchesService = new MatchesService()) { }

  public matches = async (req: Request, res: Response) => {
    const { query: { inProgress } } = req;

    if (inProgress && typeof inProgress === 'string') {
      const result = await this._MatchesService.getMatchesInProgress(inProgress);
      return res.status(200).json(result);
    }

    const result = await this._MatchesService.getAllMatches();
    return res.status(200).json(result);
  };

  public newMatch = async (req: Request, res: Response) => {
    const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = req.body;
    const result = await this._MatchesService
      .newMatch(homeTeam, awayTeam, homeTeamGoals, awayTeamGoals);
    return res.status(201).json(result);
  };

  public finishMatch = async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const result = await this._MatchesService.finishMatch(Number(id));
    return res.status(200).json(result);
  };

  public updateMatch = async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const result = await this._MatchesService.updateMatch(Number(id), homeTeamGoals, awayTeamGoals);
    return res.status(200).json(result);
  };
}

export default MatchesController;
