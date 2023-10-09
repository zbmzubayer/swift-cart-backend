import { Server, createServer } from 'http';
import app from './app';
import { config } from './config';

const server: Server = createServer(app);

async function bootstrap() {
  try {
    app.listen(config.PORT, () => {
      console.log(`🚀 Server is listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();

export default app;

// export default bootstrap;
