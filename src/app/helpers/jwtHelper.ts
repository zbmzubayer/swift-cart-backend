import { JwtPayload, Secret, sign, verify } from 'jsonwebtoken';
import { config } from '../../config';
import { CustomJwtPayload } from '../../types';

const createAccessToken = (payload: JwtPayload) => {
  const secret = config.JWT.ACCESS_SECRET as Secret;
  const expiration = config.JWT.ACCESS_EXPIRES_IN as string;
  const token = sign(payload, secret, {
    expiresIn: expiration,
  });
  return token;
};

const createRefreshToken = (payload: JwtPayload) => {
  const secret = config.JWT.REFRESH_SECRET as Secret;
  const expiration = config.JWT.REFRESH_EXPIRES_IN as string;
  const token = sign(payload, secret, {
    expiresIn: expiration,
  });
  return token;
};

const verifyAccessToken = (token: string) => {
  const secret = config.JWT.ACCESS_SECRET as Secret;
  return verify(token, secret) as CustomJwtPayload;
};

const verifyRefreshToken = (token: string) => {
  const secret = config.JWT.REFRESH_SECRET as Secret;
  return verify(token, secret) as JwtPayload;
};

export const jwtHelper = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
