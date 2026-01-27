import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
    .use(swagger())
    .use(cors())
    .get('/', () => 'Samaki PRO Backend API')
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

export type App = typeof app
