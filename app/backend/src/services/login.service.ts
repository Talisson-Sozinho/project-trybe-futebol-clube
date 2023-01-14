import { BAD_REQUEST, errorObjectConstructor, UNAUTHORIZED } from '../helpers/error.helper';
import Users from '../database/models/users.model';
import bcrypt from '../helpers/bcrypt.helper';
import jwt from '../helpers/jwt.helper';

class LoginService {
  constructor(private _model = Users) {}

  public async verifyLogin(email: string, password: string): Promise<string> {
    const result = await this._model.findOne({ where: { email } });

    if (!result) {
      throw errorObjectConstructor(UNAUTHORIZED, 'Incorrect email or password');
    }

    if (!bcrypt.comparePassword(password, result.password)) {
      throw errorObjectConstructor(UNAUTHORIZED, 'Incorrect email or password');
    }

    const { id, username, role } = result;

    return jwt.tokenGenerator(id, username, role, email);
  }

  public static validateLogin(authorization: string | undefined): object {
    if (!authorization) {
      throw errorObjectConstructor(BAD_REQUEST, 'Token não encontrado');
    }
    const { user: { role } } = jwt.tokenValidator(authorization);

    return { role };
  }
}

export default LoginService;
