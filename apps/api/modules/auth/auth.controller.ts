import type { CookieOptions, NextFunction, Request, Response } from 'express';
import {httpResponse} from '../../utils/httpResponse.js';
import { config } from '../../utils/config.js';
import { signUpService, signInService, verifyUserService, refreshTokenService,getMeService } from './auth.services.js';


// httpOnly keeps tokens out of reach of client JS; secure is only enforced in production so cookies still work over http://localhost
const authCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
};


export const signUpController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const {email,password} = req.body;
        await signUpService(email, password);
        return httpResponse({
            success: true,
            req,
            res,
            data: null,
            statusCode: 201,
            message: 'User created successfully and verification email sent'
        });
    }catch(err){
        // Let globalErrorHandler turn HttpErrors into their status code and anything else into a 500
        return next(err);
    }
}

export const signInController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const {email,password} = req.body;
        const {accessToken, refreshToken} = await signInService(email, password);
        res.cookie('accessToken', accessToken, {...authCookieOptions, maxAge: 60 * 60 * 1000}); // 1h, matches token expiry
        res.cookie('refreshToken', refreshToken, {...authCookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000}); // 7d, matches token expiry
        return httpResponse({
            success: true,
            req,
            res,
            data: null,
            statusCode: 200,
            message: 'User signed in successfully'
        });
    }catch(err){
        return next(err);
    }
}


export const verifyUserController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const {token} = req.body;
        await verifyUserService(token as string);
        return httpResponse({
            success: true,
            req,
            res,
            data: null,
            statusCode: 200,
            message: 'User verified successfully'
        });
    }catch(err){
        return next(err);
    }
}

export const refreshTokenController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const {accessToken} = await refreshTokenService(req.cookies?.refreshToken);
        res.cookie('accessToken', accessToken, {...authCookieOptions, maxAge: 60 * 60 * 1000}); // 1h, matches token expiry
        return httpResponse({
            success: true,
            req,
            res,
            data: null,
            statusCode: 200,
            message: 'Tokens refreshed successfully'
        });
    }catch(err){
        return next(err);
    }
}

export const signOutController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        // clearCookie only removes a cookie when path/sameSite/secure/httpOnly match the ones it was set with
        res.clearCookie('accessToken', authCookieOptions);
        res.clearCookie('refreshToken', authCookieOptions);
        return httpResponse({
            success: true,
            req,
            res,
            data: null,
            statusCode: 200,
            message: 'User signed out successfully'
        });
    }catch(err){
        return next(err);
    }
}

export const getMeController = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const user = await getMeService(req.user?.userEmail as string);

        return httpResponse({
            success: true,
            req,
            res,
            data: user,
            statusCode: 200,
            message: 'User retrieved successfully'
        });
    }catch(err){
        return next(err);
    }
}