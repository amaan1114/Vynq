import type { HttpResponse } from '../types/http.js'

export const httpResponse = <T>({ success,res,req, data, statusCode, message }: HttpResponse<T>) => {
    if(success) {
        console.log(`
            Response: ${statusCode} - ${message}
            Request: ${req.method} ${req.url}
            Data: ${JSON.stringify(data)}
        `);
    } else {
        console.error(`
            Response: ${statusCode} - ${message}
            Request: ${req.method} ${req.url}
            Data: ${JSON.stringify(data)}
        `);
    }
    
    
    return res.status(statusCode).json({
        success,
        data,
        message
    })

}
