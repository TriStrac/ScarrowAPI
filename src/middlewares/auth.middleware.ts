import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string } & JwtPayload;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err || typeof decoded !== 'object' || !('userId' in decoded)) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = {
      ...(decoded as JwtPayload),
      id: (decoded as any).userId, // force assign the `id` field
    };

    next();
  });
};
