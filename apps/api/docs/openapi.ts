import { config } from '../utils/config.js';
import { authPaths } from '../modules/auth/auth.docs.js';

// Root OpenAPI spec rendered by Scalar at /docs; add each module's paths here
export const openApiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'Vynq API',
        version: '0.1.0',
    },
    servers: [{ url: `http://localhost:${config.PORT}` }],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            // Shape every route returns via httpResponse / globalErrorHandler
            ApiResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: { nullable: true },
                    message: { type: 'string' },
                },
            },
        },
    },
    paths: {
        ...authPaths,
    },
};
