import type { Response, Request } from 'express'

export interface HttpResponse<T = unknown> {
    success: boolean
    res: Response
    req: Request
    data: T
    statusCode: number
    message: string
}

export interface TokenPayload {
    id:string,
    userEmail: string
}

export interface HttpErrorOptions<T = unknown> {
    data?: T
    statusCode: number
    message: string
}
