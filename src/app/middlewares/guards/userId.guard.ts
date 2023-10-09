import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../globalErrorHandler';

const userIdGuard =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const role = req.user?.role;
      roles.forEach((r) => {
        if (r === role && userId !== req.params.id) throw new ApiError(403, 'Access denied');
      });
      next();
    } catch (err) {
      next(err);
    }
  };

export default userIdGuard;
