import Teams from '../database/models/teams.model';

class LoginService {
  constructor(private _model = Teams) {}

  public async getAllTeams(): Promise<Teams[]> {
    const result = await this._model.findAll();
    return result;
  }
}

export default LoginService;
