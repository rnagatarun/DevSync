import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { User } from '../models/user.js';
import { AuthenticatedRequest } from '../types/express.js';

export const userAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        //Read the token from req cookies
        const { Token } = req.cookies;
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
        next(error);
    }
}