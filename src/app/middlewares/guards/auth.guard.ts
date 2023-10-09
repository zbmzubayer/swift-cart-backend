import { NextFunction, Request, Response } from 'express';
import { jwtHelper } from '../../helpers/jwtHelper';
import { ApiError } from '../globalErrorHandler';

const authGuard =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      console.log(typeof token);
      if (!token) throw new ApiError(401, 'Unauthorized');
      let decoded = null;
      decoded = jwtHelper.verifyAccessToken(token);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) throw new ApiError(403, 'Access denied');
      next();
    } catch (err) {
      next(err);
    }
  };

export default authGuard;
