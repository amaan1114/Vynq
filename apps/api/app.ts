import express from "express";
import { config } from "./utils/config.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { httpResponse } from "./utils/httpResponse.js";
import helmet from "helmet";



export const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to set security-related HTTP headers
app.use(helmet());

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

// Global error handling middleware
app.use(globalErrorHandler);

// Start the server
app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});