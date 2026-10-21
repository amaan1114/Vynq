import type { TokenPayload } from './http.js'

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload
        }
    }
}
