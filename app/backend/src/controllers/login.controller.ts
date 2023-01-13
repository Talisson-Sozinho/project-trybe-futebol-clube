import { Request, Response } from 'express';
import LoginService from '../services/login.service';

class LoginController {
  constructor(private _LoginService = new LoginService()) { }

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this._LoginService.verifyLogin(email, password);
    return res.status(200).json({ token: result });
  };

  public loginValidate = (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const result = LoginService.validateLogin(authorization);
    return res.status(200).json(result);
  };
}

export default LoginController;
