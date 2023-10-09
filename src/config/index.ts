import dotenv from 'dotenv';
dotenv.config();

export const config = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  BCRYPT_SALT: process.env.BCRYPT_SALT_ROUNDS || 10,
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};
