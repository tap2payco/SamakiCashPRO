import { Elysia, t } from 'elysia'
import { MarketplaceService } from './marketplace.service'

const service = new MarketplaceService()

export const marketplaceController = new Elysia({ prefix: '/marketplace' })
    .model({
        createListing: t.Object({
            title: t.String(),
            description: t.Optional(t.String()),
            price: t.Number(),
            quantity: t.Number(),
            unit: t.String(),
            sellerId: t.String()
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
    .post('/listings', async ({ body }) => {
        return await service.createListing(body)
    }, {
        body: 'createListing'
    })
