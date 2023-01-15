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
}

export default MatchesController;
