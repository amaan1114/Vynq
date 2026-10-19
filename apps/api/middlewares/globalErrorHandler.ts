import type { NextFunction, Request, Response } from 'express'
import { httpResponse } from '../utils/httpResponse.js'
import HttpError from '../utils/httpError.js'

// Express only treats a middleware as an error handler when it takes exactly
// four arguments, in this order: (err, req, res, next).
export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err)
    }

    if (err instanceof HttpError) {
        return httpResponse({
            success: false,
            res,
            req,
            data: err.data,
            statusCode: err.statusCode,
            message: err.message
        })
    }

    console.error(err)
    return httpResponse({
        success: false,
        res,
        req,
        data: null,
        statusCode: 500,
        message: 'Internal Server Error'
    })
}
