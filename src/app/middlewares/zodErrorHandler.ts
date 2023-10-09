import { ZodError, ZodIssue } from 'zod';
import { GenericErrorMessages, GenericErrorResponse } from '../../shared/errorResponse';

const zodErrorHandler = (err: ZodError): GenericErrorResponse => {
  const errorMessages: GenericErrorMessages[] = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[0],
      message: issue?.message,
    };
  });
  const status = 400;
  return {
    status,
    message: 'Zod Validation Error',
    errorMessages,
  };
};

export default zodErrorHandler;
