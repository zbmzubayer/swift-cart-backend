export type GenericErrorResponse = {
  status: number;
  message: string;
  errorMessages: GenericErrorMessages[];
};

export type GenericErrorMessages = {
  path: string | number;
  message: string;
};
