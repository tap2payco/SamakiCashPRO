import { Elysia } from 'elysia'
import { jwt } from '@elysiajs/jwt'

export const isAuthenticated = (app: Elysia) =>
    app
        .use(
            jwt({
                name: 'jwt',
                secret: process.env.JWT_SECRET || 'samakipro-fallback-secret'
            })
        )
        .derive(async ({ headers, jwt }) => {
            // Offline Mode Bypass
            if (process.env.SKIP_AUTH === 'true') {
                return {
                    user: {
                        id: 'offline-user-id',
                        role: 'FARMER'
                    }
                }
            }

            const authHeader = headers['authorization']
            if (!authHeader) {
                return { user: null }
            }

            const token = authHeader.split(' ')[1]
            if (!token) {
                return { user: null }
            }

            const payload = await jwt.verify(token)
            if (!payload) {
                return { user: null }
            }

            return { 
                user: { 
                    id: payload.id as string, 
                    role: payload.role as string 
                } 
            }
        })
