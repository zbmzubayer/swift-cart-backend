import { Prisma } from '@prisma/client';
import { GenericErrorMessages, GenericErrorResponse } from '../../shared/errorResponse';

const prismaErrorHandler = (err: Prisma.PrismaClientKnownRequestError): GenericErrorResponse => {
  const status = 400;
  let message = 'Prisma Error';
  let errorMessages: GenericErrorMessages[] = [];
  if (err.code === 'P2002' && err.meta?.target && Array.isArray(err.meta?.target)) {
    message = 'Prisma Unique Constraint Violation';
    errorMessages = [
      {
        path: err.meta.target[0],
        message: err.meta.target[0] + ' already exists',
      },
    ];
  }
  return {
    status,
    message,
    errorMessages,
  };
};

export default prismaErrorHandler;
