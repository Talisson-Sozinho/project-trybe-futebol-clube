import { Request, Response } from 'express';
import TeamsService from '../services/teams.service';

class TeamsController {
  constructor(private _TeamService = new TeamsService()) { }

  public teams = async (req: Request, res: Response) => {
    const result = await this._TeamService.getAllTeams();
    return res.status(200).json(result);
  };

  public teamsById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this._TeamService.getTeamById(Number(id));
    return res.status(200).json(result);
  };
}

export default TeamsController;
