import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { User } from '../models/user.js';
import { AuthenticatedRequest } from '../types/express.js';

export const userAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        //Read the token from req cookies
        const { Token } = req.cookies;
        
        if (!Token) {
            res.status(401).json({ message: 'Authentication required. Please log in.' });
            return;
        }

        const secret = process.env.VITE_JSON_TOKEN_KEY;

        if (!secret) {
            throw new Error('JWT secret key is not defined in environment variables');
        }

        //Validate the token
        const decodedObj = jwt.verify(Token, secret as string) as jwt.JwtPayload;
        const { _id } = decodedObj;

        // Find the user
        const user = await User.findById(_id)
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
            return;
        }
        res.status(500).json({ message: 'Internal server error during authentication.' });
    }
}