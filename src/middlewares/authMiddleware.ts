import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
  }

  export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
  
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido. Acesso negado." });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token inválido ou expirado." });
    }
  };