import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({ ...req.body, ...req.params, ...req.query, ...req.cookies });
      next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
