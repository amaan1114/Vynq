import express, { type Express } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { httpResponse } from "./utils/httpResponse.js";
import helmet from "helmet";
import authRouter from './modules/auth/auth.route.js';
import { apiReference } from '@scalar/express-api-reference';
import { openApiSpec } from './docs/openapi.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from './utils/config.js';
export const app: Express = express();

// Allow the frontend to call the API with cookies; credentials requires an explicit origin, not '*'
app.use(cors({ origin: config.CLIENT_URL, credentials: true }));

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Scalar API docs at /docs; registered before helmet because Scalar loads its script from a CDN, which helmet's Content-Security-Policy would block
app.use('/docs', apiReference({ content: openApiSpec }));

// Middleware to set security-related HTTP headers
app.use(helmet());

// Populates req.cookies so checkAuth and /refresh can read the auth cookies
app.use(cookieParser());

// Define your routes here
// Example route
app.get("/health", (req, res) => {
    httpResponse({
        success: true,
        res,
        req,
        data: { status: "OK" },
        statusCode: 200,
        message: "Health check successful"
    })
});
app.use('/api/v1/auth', authRouter);



// Global error handling middleware
app.use(globalErrorHandler);