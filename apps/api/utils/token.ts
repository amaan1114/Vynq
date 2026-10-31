import jwt from "jsonwebtoken";
import { config } from "./config.js";
import type { TokenPayload } from "../types/http.js";


export const refreshToken = (id: string, userEmail: string) => {
    const payload = { id, userEmail };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

export const accessToken = (id: string, userEmail: string) => {
    const payload = { id, userEmail };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
    return token;
}


export const emailVerificationToken = (id: string, userEmail: string) => {
    const payload = { id, userEmail };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1d' });
    return token;
}
export const verifyToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}