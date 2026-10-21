import {verifyToken} from '../../utils/token.js';
import type { NextFunction, Request, Response } from 'express';
import HttpError from '../../utils/httpError.js';
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Browsers send the accessToken cookie; the Bearer header is a fallback for Postman/mobile clients
        const token = req.cookies?.accessToken ?? req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new HttpError({ statusCode: 401, message: 'Access token missing' });
        }

        try {
            // Attach user info to request object for further use
            req.user = verifyToken(token);
        } catch {
            // 401 tells the client to call /auth/refresh and retry
            throw new HttpError({ statusCode: 401, message: 'Invalid or expired access token' });
        }

        return next();
    } catch (err) {
        return next(err);
    }
}
