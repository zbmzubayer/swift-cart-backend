import bcrypt from 'bcrypt';
import { config } from '../../config';

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(Number(config.BCRYPT_SALT));
  return await bcrypt.hash(password, salt);
};

const validatePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const bcryptHelper = { hashPassword, validatePassword };
