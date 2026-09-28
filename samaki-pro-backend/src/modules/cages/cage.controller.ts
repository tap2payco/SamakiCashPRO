import { Elysia, t } from 'elysia'
import { CageService } from './cage.service'
import { isAuthenticated } from '../../middlewares/auth.middleware'
import prisma from '../../config/prisma'
import { InsuranceService } from '../insurance/insurance.service'

export const cageController = new Elysia({ prefix: '/cages' })
    .use(isAuthenticated)
    .decorate('cageService', new CageService())

    // Create a new cage
    .post('/', async ({ body, user, set, cageService }) => {
        if (!user) {
            set.status = 401
            return { error: 'Unauthorized' }
        }

        return await cageService.createCage({
            ...body,
            farmerId: user.id
        })
    }, {
        body: t.Object({
            name: t.String(),
            type: t.String(),
            capacity: t.Number(),
            location: t.Optional(t.String())
        })
    })

    // Get my cages
    .get('/', async ({ user, set, cageService }) => {
        if (!user) {
            set.status = 401
            return { error: 'Unauthorized' }
        }

        return await cageService.getFarmerCages(user.id)
    })

    // Get cage details
    .get('/:id', async ({ params: { id }, cageService }) => {
        return await cageService.getCageById(id)
    })

    // Stock a batch
    .post('/:id/stock', async ({ params: { id }, body, cageService }) => {
        return await cageService.stockBatch({
            cageId: id,
            ...body
        })
    }, {
        body: t.Object({
            species: t.String(),
            quantity: t.Number(),
            estimatedHarvestDate: t.Optional(t.String())
        })
    })

    // Record sensor reading ( IoT )
    .post('/:id/readings', async ({ params: { id }, body, cageService }) => {
        const reading = await cageService.recordReading(id, body as any)
        
        // Phase 3: Trigger Parametric Insurance Check on every new reading
        const insuranceService = new InsuranceService()
        await insuranceService.evaluateConditions()

        return reading
    }, {
        body: t.Object({
            temperature: t.Optional(t.Number()),
            ph: t.Optional(t.Number()),
            dissolvedOxygen: t.Optional(t.Number())
        })
    })
