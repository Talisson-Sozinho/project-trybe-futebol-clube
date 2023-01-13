const BAD_REQUEST = 'BAD_REQUEST';
const UNAUTHORIZED = 'UNAUTHORIZED';
const NOT_FOUND = 'NOT_FOUND';
const UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY';

const errorObjectConstructor = (type: string, message: string): Error => {
  const error = new Error(message);
  error.name = type;
  return error;
};

const errorCode = (type: string): number => {
  switch (type) {
    case BAD_REQUEST:
      return 400;
    case UNAUTHORIZED:
      return 401;
    case NOT_FOUND:
      return 404;
    case UNPROCESSABLE_ENTITY:
      return 422;
    default:
      return 500;
  }
};

export {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
  errorObjectConstructor,
  errorCode,
};
