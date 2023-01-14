import { errorObjectConstructor, NOT_FOUND } from '../helpers/error.helper';
import Teams from '../database/models/teams.model';

class TeamsService {
  constructor(private _model = Teams) {}

  public async getAllTeams(): Promise<Teams[]> {
    const result = await this._model.findAll();
    return result;
  }

  public async getTeamById(id: number): Promise<Teams> {
    const result = await this._model.findByPk(id);
    if (!result) {
      throw errorObjectConstructor(NOT_FOUND, 'id not found');
    }
    return result;
  }
}

export default TeamsService;
