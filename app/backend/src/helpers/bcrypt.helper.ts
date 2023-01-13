import * as bcrypt from 'bcryptjs';

const comparePassword = (password: string, hash: string): boolean => (
  bcrypt.compareSync(password, hash)
);

export default {
  comparePassword,
};
