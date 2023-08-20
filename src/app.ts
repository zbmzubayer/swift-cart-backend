import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';

const app: Application = express();

// cors
app.use(cors({ origin: true, credentials: true }));

// compression
app.use(compression());

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', (req, res) => res.send('Hello World!'));

export default app;
