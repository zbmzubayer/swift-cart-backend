import compression from 'compression';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import { config } from './config';

const app: Application = express();

// cors
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));

// compression
app.use(compression());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.send('Hello World!');
});
app.use('/api/v1', router);

// error handler
app.use(globalErrorHandler);

// Handle not found routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: `Can't find ${req.originalUrl} on this server!`,
      },
    ],
  });
  next();
});

export default app;
