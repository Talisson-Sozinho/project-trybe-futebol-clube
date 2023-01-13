import { Request, Response } from 'express';
import LoginService from '../services/login.service';

class LoginController {
  constructor(private _LoginService = new LoginService()) { }

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this._LoginService.verifyLogin(email, password);
    res.status(200).json({ token: result });
  };
}

export default LoginController;
