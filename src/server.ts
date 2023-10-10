import { Server, createServer } from 'http';
import app from './app';
import { config } from './config';

const server: Server = createServer(app);

export async function bootstrap() {
  try {
    server.listen(config.PORT, () => {
      console.log(`🚀 Server is listening on port ${config.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();

export default server;
