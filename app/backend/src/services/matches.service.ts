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
}

export default MatchesService;
