import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  id: string;
  userId: string;
  role: string;
  // Add other user-related properties here
}

declare global {
  namespace Express {
    interface Request {
      user: CustomJwtPayload | null;
    }
  }
}
