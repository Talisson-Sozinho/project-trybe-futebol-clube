import { Request, Response } from 'express';
import MatchesService from '../services/matches.service';

class MatchesController {
  constructor(private _MatchesService = new MatchesService()) { }

  public matches = async (_req: Request, res: Response) => {
    const result = await this._MatchesService.getAllMatches();
    res.status(200).json(result);
  };
}

export default MatchesController;
