// OpenAPI path definitions for /api/v1/auth, merged into the root spec in docs/openapi.ts

const credentialsBody = {
    required: true,
    content: {
        'application/json': {
            schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', format: 'password', example: 'secret123' },
                },
            },
        },
    },
};

const response = (description: string) => ({
    description,
    content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
});

export const authPaths = {
    '/api/v1/auth/signup': {
        post: {
            tags: ['Auth'],
            summary: 'Create a user and send a verification email',
            requestBody: credentialsBody,
            responses: {
                201: response('User created and verification email sent'),
                400: response('User already exists'),
            },
        },
    },
    '/api/v1/auth/signin': {
        post: {
            tags: ['Auth'],
            summary: 'Sign in with email and password',
            requestBody: credentialsBody,
            responses: {
                200: response('User signed in'),
                401: response('Invalid credentials'),
                403: response('Email not verified; verification email resent'),
            },
        },
    },
    '/api/v1/auth/verify': {
        post: {
            tags: ['Auth'],
            summary: 'Mark a user as verified',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['token'],
                            properties: {
                                token: { type: 'string', description: 'Email verification JWT from the verification link' },
                            },
                        },
                    },
                },
            },
            responses: {
                200: response('User verified'),
                400: response('Missing, invalid or expired token'),
                404: response('User not found'),
            },
        },
    },
    '/api/v1/auth/refresh': {
        post: {
            tags: ['Auth'],
            summary: 'Issue a new accessToken cookie using the refreshToken cookie',
            responses: {
                200: response('New accessToken cookie set'),
                401: response('Refresh token missing, invalid or expired, or user no longer exists'),
            },
        },
    },
};
