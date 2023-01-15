import { NextFunction, Request, Response } from 'express';
import { errorObjectConstructor, UNAUTHORIZED } from '../helpers/error.helper';
import jwt from '../helpers/jwt.helper';

export default (req:Request, _res:Response, next:NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw errorObjectConstructor(UNAUTHORIZED, 'Token não encontrado');
  }

  jwt.tokenValidator(authorization);

  return next();
};
