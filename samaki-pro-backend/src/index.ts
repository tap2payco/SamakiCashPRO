import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'

import { marketplaceController } from './modules/marketplace/marketplace.controller'
import { paymentController } from './modules/payments/payment.simulation'
import { escrowController } from './modules/escrow/escrow.service'
import { agentsController } from './modules/agents/agents.controller'
import { ordersController } from './modules/orders/order.controller'
import { authController } from './modules/auth/auth.controller'
import { cageController } from './modules/cages/cage.controller'
import { creditController } from './modules/credit/credit.service'
import { insuranceController } from './modules/insurance/insurance.service'
import { visionController } from './modules/ai-vision/vision.controller'
import { traceabilityController } from './modules/traceability/traceability.service'
import { carbonController } from './modules/carbon/carbon.service'
import { assetsController } from './modules/assets/assets.service'

const app = new Elysia()
    .use(swagger())
    .use(cors())
    .use(marketplaceController)
    .use(paymentController)
    .use(escrowController)
    .use(agentsController)
    .use(ordersController)
    .use(authController)
    .use(cageController)
    .use(creditController)
    .use(insuranceController)
    .use(visionController)
    .use(traceabilityController)
    .use(carbonController)
    .use(assetsController)
    .get('/', () => 'Samaki PRO Backend API')
    .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)

export type App = typeof app
