import prisma from '../../config/prisma'

export class MarketplaceService {
    // Create a new listing
    async createListing(data: {
        title: string
        description?: string
        price: number
        quantity: number
        unit: string
        sellerId: string
        imageUrl?: string
    }) {
        return prisma.listing.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                quantity: data.quantity,
                unit: data.unit,
                sellerId: data.sellerId,
                imageUrl: data.imageUrl,
                status: 'AVAILABLE'
            },
            include: { seller: true }
        })
    }

    // Get all listings with optional filters
    async getListings(filters: { status?: string, minPrice?: number, maxPrice?: number }) { // Changed type to string
        return prisma.listing.findMany({
            where: {
                status: filters.status || 'AVAILABLE',
                price: {
                    gte: filters.minPrice,
                    lte: filters.maxPrice
                }
            },
            include: { seller: true },
            orderBy: { createdAt: 'desc' }
        })
    }

    // ... (rest of methods)

    // Update listing status
    async updateListingStatus(id: string, status: string) { // Changed type
        return prisma.listing.update({
            where: { id },
            data: { status }
        })
    }

    // Update listing quantity after purchase
    async decrementQuantity(id: string, quantity: number) {
        const listing = await prisma.listing.findUnique({ where: { id } })
        if (!listing) throw new Error('Listing not found')

        const newQuantity = listing.quantity - quantity
        if (newQuantity < 0) throw new Error('Insufficient quantity')

        return prisma.listing.update({
            where: { id },
            data: {
                quantity: newQuantity,
                status: newQuantity === 0 ? 'SOLD' : 'AVAILABLE'
            }
        })
    }
}
