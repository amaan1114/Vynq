import {getUserByEmail,addUser, markUserAsVerified} from './auth.repo.js';
import bcrypt from 'bcryptjs'
import HttpError from '../../utils/httpError.js';
import { sendVerificationEmail } from '../../utils/verificationEmail.js';
import { accessToken, refreshToken, emailVerificationToken, verifyToken } from '../../utils/token.js';


export const signUpService = async(email: string, password: string)=>{
    const existingUser = await getUserByEmail(email);
    if(existingUser){
        throw new HttpError({statusCode: 400, message: 'User already exists'});
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await addUser({email, password: hashedPassword});
    const token = emailVerificationToken(user.user_id.toString(), email);
    await sendVerificationEmail(email, token);
}

export const signInService = async(email: string, password: string)=>{
    const user = await getUserByEmail(email);
    if(!user){
        throw new HttpError({statusCode: 401, message: 'Invalid credentials'});
    }
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if(!isPasswordValid){
        throw new HttpError({statusCode: 401, message: 'Invalid credentials'});
    }
    if(!user.is_verified){
        await sendVerificationEmail(email, emailVerificationToken(user.user_id.toString(), email)); // Resend verification email
        throw new HttpError({statusCode: 403, message: 'Email not verified. Verification email resent.'});
    }
    return {
        accessToken: accessToken(user.user_id.toString(), email),
        refreshToken: refreshToken(user.user_id.toString(), email),
    };
}

export const verifyUserService = async(token: string)=>{
    if(!token){
        throw new HttpError({statusCode: 400, message: 'Verification token is required'});
    }
    let userEmail: string;
    try{
        userEmail = verifyToken(token).userEmail;
    }catch{
        throw new HttpError({statusCode: 400, message: 'Invalid or expired verification token'});
    }
    const user = await getUserByEmail(userEmail);
    if(!user){
        throw new HttpError({statusCode: 404, message: 'User not found'});
    }
    await markUserAsVerified(user.user_id);
}


export const refreshTokenService = async(refreshToken: string)=>{
    if(!refreshToken){
        throw new HttpError({statusCode: 401, message: 'Refresh token is required'});
    }
    let userEmail: string;
    try{
        userEmail = verifyToken(refreshToken).userEmail;
    }catch{
        throw new HttpError({statusCode: 401, message: 'Invalid or expired refresh token'});
    }
    const user = await getUserByEmail(userEmail);
    if(!user){
        throw new HttpError({statusCode: 401, message: 'User not found'});
    }
    return {
        accessToken: accessToken(user.user_id.toString(), userEmail),
    };
}

export const getMeService = async(userEmail:string)=>{
    const user = await getUserByEmail(userEmail);
    if(!user){
        throw new HttpError({statusCode: 404, message: 'User not found'});
    }
    const correctUser = {
        id: user.user_id.toString(),
        email: user.email,
        name: user.name,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
    return correctUser;
}