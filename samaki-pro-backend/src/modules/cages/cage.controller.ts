import { Elysia, t } from 'elysia'
import { CageService } from './cage.service'
import { isAuthenticated } from '../../middlewares/auth.middleware'
import prisma from '../../config/prisma'

export const cageController = new Elysia({ prefix: '/cages' })
    .use(isAuthenticated)
    .decorate('cageService', new CageService())

    // Create a new cage
    .post('/', async ({ body, user, set, cageService }) => {
        if (!user) {
            set.status = 401
            return { error: 'Unauthorized' }
        }

        // Resolve profile
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id }
        })
        if (!profile) {
            set.status = 400
            return { error: 'Profile not found' }
        }

        return await cageService.createCage({
            ...body,
            farmerId: profile.id
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

        const profile = await prisma.profile.findUnique({
            where: { userId: user.id }
        })
        if (!profile) return []

        return await cageService.getFarmerCages(profile.id)
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
        return await cageService.recordReading({
            cageId: id,
            ...body
        })
    }, {
        body: t.Object({
            temperature: t.Optional(t.Number()),
            ph: t.Optional(t.Number()),
            dissolvedOxygen: t.Optional(t.Number())
        })
    })
