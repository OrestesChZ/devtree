import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    origin: (origin, callback) => {
        const whiteList = [
            process.env.FRONTEND_URL,
            'http://localhost:5173'
        ]

        // Permitir herramientas como Postman
        if (!origin) {
            return callback(null, true)
        }

        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    },
    credentials: true
}
