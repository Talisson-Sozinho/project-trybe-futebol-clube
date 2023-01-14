import * as jwt from 'jsonwebtoken';
import { Secret, SignOptions } from 'jsonwebtoken';

const secret: Secret = <string>process.env.JWT_SECRET;

const jwtConfig: SignOptions = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

const tokenGenerator = (id: number, email: string, role: string, username: string) => (
  jwt.sign({ user: { id, username, email, role } }, secret, jwtConfig)
);

interface TokenInterface {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

const tokenValidator = (token: string): TokenInterface => (
  jwt.verify(token, secret) as TokenInterface
);

export default {
  tokenGenerator,
  tokenValidator,
};
