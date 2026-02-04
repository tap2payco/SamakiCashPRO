import { Elysia, t } from 'elysia'
import { AuthService } from './auth.service'
import { UserRole } from '@prisma/client'

export const authController = new Elysia({ prefix: '/auth' })
    .decorate('authService', new AuthService())

    .post('/register', async ({ body, authService }) => {
        return await authService.register({
            ...body,
            role: body.role as UserRole
        })
    }, {
        body: t.Object({
            phone: t.String(),
            password: t.String(),
            fullName: t.String(),
            role: t.Union([t.Literal('FARMER'), t.Literal('VENDOR')])
        })
    })

    .post('/login', async ({ body, authService }) => {
        return await authService.login(body.phone, body.password)
    }, {
        body: t.Object({
            phone: t.String(),
            password: t.String()
        })
    })
