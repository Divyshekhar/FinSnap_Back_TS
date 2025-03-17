import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const dotenv = require("dotenv");
dotenv.config();

interface AuthenticatedRequest extends Request {
    user: JwtPayload; 
}
const authenticateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.cookies?.token;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized: No Token" });
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(" ")[1] : authHeader;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Token error" });
    }
}
module.exports = authenticateJwt;