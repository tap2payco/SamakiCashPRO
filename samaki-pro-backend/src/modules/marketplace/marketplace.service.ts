import { ListingStatus } from '@prisma/client'

// In-memory mock database for simulation mode
const listingsMap = new Map<string, any>()

export class MarketplaceService {
    // Create a new listing
    async createListing(data: any) {
        const id = `LIST_${Date.now()}`
        const listing = {
            id,
            title: data.title,
            description: data.description,
            price: data.price,
            quantity: data.quantity,
            unit: data.unit,
            sellerId: data.sellerId,
            status: ListingStatus.AVAILABLE,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            seller: { // Mock seller expansion
                id: data.sellerId,
                fullName: "Simulated Farmer",
                location: "Mwanza, Tanzania",
                role: "FARMER"
            }
        }
        listingsMap.set(id, listing)
        return listing
    }

    // Get all listings with optional filters
    async getListings(filters: { status?: ListingStatus, minPrice?: number, maxPrice?: number }) {
        let results = Array.from(listingsMap.values())

        if (filters.status) {
            results = results.filter(l => l.status === filters.status)
        }
        if (filters.minPrice) {
            results = results.filter(l => Number(l.price) >= filters.minPrice!)
        }
        if (filters.maxPrice) {
            results = results.filter(l => Number(l.price) <= filters.maxPrice!)
        }

        return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Get single listing details
    async getListingById(id: string) {
        return listingsMap.get(id) || null
    }
}
