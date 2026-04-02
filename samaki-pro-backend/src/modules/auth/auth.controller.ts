import { Elysia, t } from 'elysia'
import { jwt } from '@elysiajs/jwt'
import { AuthService } from './auth.service'

export const authController = new Elysia({ prefix: '/auth' })
    .use(
        jwt({
            name: 'jwt',
            secret: process.env.JWT_SECRET || 'samakipro-fallback-secret'
        })
    )
    .decorate('authService', new AuthService())
    .post('/register', async ({ body, jwt, authService }) => {
        const profile = await authService.register({
            ...body,
            role: body.role as string
        })
        const token = await jwt.sign({ id: profile.id, role: profile.role })
        return { profile, token, session: { access_token: token } }
    }, {
        body: t.Object({
            phone: t.String(),
            password: t.String(),
            fullName: t.String(),
            role: t.Union([t.Literal('FARMER'), t.Literal('VENDOR')])
        })
    })
    .post('/login', async ({ body, jwt, authService }) => {
        const profile = await authService.login(body.phone, body.password)
        const token = await jwt.sign({ id: profile.id, role: profile.role })
        return { profile, token, session: { access_token: token } }
    }, {
        body: t.Object({
            phone: t.String(),
            password: t.String()
        })
    })
