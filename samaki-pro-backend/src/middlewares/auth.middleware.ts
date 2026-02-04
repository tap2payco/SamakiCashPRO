import { Elysia } from 'elysia'
import { supabase } from '../config/supabase'

export const isAuthenticated = (app: Elysia) =>
    app.derive(async ({ headers, set }) => {
        // Offline Mode Bypass
        if (process.env.SKIP_AUTH === 'true') {
            return {
                user: {
                    id: 'offline-user-id', 
                    email: 'offline@samakipro.com',
                    aud: 'authenticated',
                    role: 'authenticated',
                    app_metadata: {},
                    user_metadata: {},
                    created_at: new Date().toISOString()
                }
            }
        }

        const authHeader = headers['authorization']
        // ... (rest of logic)
        if (!authHeader) {
            return { user: null }
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return { user: null }
        }

        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error || !user) {
            return { user: null }
        }

        return { user }
    })
