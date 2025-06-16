import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Not signed in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
        next();
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            if (err.message == "invalid signature" || err.message == "bad signature") {
                res.clearCookie('token');
                return res.status(401).json({ error: "Session expired, please log in again." });
            } else {
                res.status(400).json({ error: "Invalid token" });
            }
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};

export const authorize = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;
    const user = await User.findById(userId); // Se consulta la BD para que no haya info vieja en los tokens.

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};