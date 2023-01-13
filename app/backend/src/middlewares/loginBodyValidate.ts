import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, errorObjectConstructor, UNAUTHORIZED } from '../helpers/error.helper';

const EMAIL_REGEX = /^[a-zA-Z0-9_!#$%&’*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;

const testEmail = (email: string) :boolean => EMAIL_REGEX.test(email);

export default (req:Request, _res:Response, next:NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    throw errorObjectConstructor(BAD_REQUEST, 'All fields must be filled');
  }

  if (!testEmail(email)) {
    throw errorObjectConstructor(UNAUTHORIZED, 'Incorrect email or password');
  }

  return next();
};
