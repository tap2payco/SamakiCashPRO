import { Elysia, t } from 'elysia'
import { MarketplaceService } from './marketplace.service'
import { isAuthenticated } from '../../middlewares/auth.middleware'
import prisma from '../../config/prisma'

const service = new MarketplaceService()

export const marketplaceController = new Elysia({ prefix: '/marketplace' })
    .use(isAuthenticated)
    .model({
        createListing: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            price: t.Number(),
            quantity: t.Number(),
            unit: t.String()
        })
    })
    .get('/listings', async ({ query }) => {
        const filters = {
            status: query.status as any,
            minPrice: query.minPrice ? Number(query.minPrice) : undefined,
            maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined
        }
        return await service.getListings(filters)
    })
    .get('/listings/:id', async ({ params: { id } }) => {
        const listing = await service.getListingById(id)
        if (!listing) throw new Error('Listing not found')
        return listing
    })
    .post('/listings', async ({ body, user, set }) => {
        if (!user) {
            set.status = 401
            return { error: 'Unauthorized' }
        }

        // Look up the Profile ID using the Auth User ID
        const profile = await prisma.profile.findUnique({
            where: { userId: user.id }
        })

        if (!profile) {
            set.status = 400
            return { error: 'User profile not found. Please complete registration.' }
        }

        return await service.createListing({
            ...body,
            sellerId: profile.id
        })
    }, {
        body: 'createListing'
    })
