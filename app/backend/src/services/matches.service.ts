import { errorObjectConstructor, BAD_REQUEST } from '../helpers/error.helper';
import Teams from '../database/models/teams.model';
import Matches from '../database/models/matches.model';

class MatchesService {
  constructor(private _model = Matches) {}

  public async getAllMatches(): Promise<Matches[]> {
    const result = await this._model.findAll({
      include: [
        {
          model: Teams, as: 'teamHome', attributes: { exclude: ['id'] },
        },
        {
          model: Teams, as: 'teamAway', attributes: { exclude: ['id'] },
        },
      ],
    });
    return result;
  }

  public async getMatchesInProgress(inProgress:string): Promise<Matches[]> {
    if (inProgress !== 'true' && inProgress !== 'false') {
      throw errorObjectConstructor(BAD_REQUEST, 'query unknown');
    }

    const result = await this._model.findAll({
      where: { inProgress: inProgress === 'true' },
      include: [
        {
          model: Teams, as: 'teamHome', attributes: { exclude: ['id'] },
        },
        {
          model: Teams, as: 'teamAway', attributes: { exclude: ['id'] },
        },
      ],
    });
    return result;
  }

  public async newMatch(
    homeTeam:number,
    awayTeam:number,
    homeTeamGoals:number,
    awayTeamGoals:number,
  ): Promise<Matches> {
    const result = await this._model.create({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals });
    return result;
  }
}

export default MatchesService;
