import { Op } from 'sequelize';
import {
  errorObjectConstructor,
  BAD_REQUEST,
  UNPROCESSABLE_ENTITY,
  NOT_FOUND,
} from '../helpers/error.helper';
import Teams from '../database/models/teams.model';
import Matches from '../database/models/matches.model';

class MatchesService {
  constructor(private _model = Matches, private _teamsModel = Teams) {}

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
    if (homeTeam === awayTeam) {
      throw errorObjectConstructor(
        UNPROCESSABLE_ENTITY,
        'It is not possible to create a match with two equal teams',
      );
    }

    const teams = await this._teamsModel.findAll({
      where: { [Op.or]: [{ id: homeTeam }, { id: awayTeam }] },
    });

    if (!teams || teams.length !== 2) {
      throw errorObjectConstructor(NOT_FOUND, 'There is no team with such id!');
    }

    return this._model.create({ homeTeam, awayTeam, homeTeamGoals, awayTeamGoals });
  }

  public async finishMatch(id: number): Promise<object> {
    await this._model.update({ inProgress: false }, {
      where: { id },
    });
    return { message: 'Finished' };
  }

  public async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    await this._model.update({ homeTeamGoals, awayTeamGoals }, {
      where: { id },
    });
    return { message: 'Updated' };
  }
}

export default MatchesService;
