import type { HttpErrorOptions } from '../types/http.js'

class HttpError extends Error {
    public statusCode: number
    public data: unknown

    constructor({ data = null, statusCode, message }: HttpErrorOptions) {
        super(message)
        this.name = 'HttpError'
        this.statusCode = statusCode
        this.data = data
    }
}

export default HttpError
