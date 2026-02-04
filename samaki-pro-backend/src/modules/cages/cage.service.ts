import prisma from '../../config/prisma'

export class CageService {
    // Create a new cage
    async createCage(data: {
        name: string
        type: string
        capacity: number
        location?: string
        farmerId: string
    }) {
        return prisma.cage.create({
            data: {
                name: data.name,
                type: data.type,
                capacity: data.capacity,
                location: data.location,
                farmerId: data.farmerId,
                status: 'ACTIVE'
            }
        })
    }

    // Get all cages for a farmer
    async getFarmerCages(farmerId: string) {
        return prisma.cage.findMany({
            where: { farmerId },
            include: {
                batches: {
                    where: { status: 'ACTIVE' },
                    take: 1
                },
                sensors: {
                    orderBy: { timestamp: 'desc' },
                    take: 1
                }
            }
        })
    }

    // Get single cage details
    async getCageById(id: string) {
        return prisma.cage.findUnique({
            where: { id },
            include: {
                batches: { orderBy: { stockingDate: 'desc' } },
                sensors: { orderBy: { timestamp: 'desc' }, take: 10 }
            }
        })
    }

    // Stock a batch of fish
    async stockBatch(data: {
        cageId: string
        species: string
        quantity: number
        estimatedHarvestDate?: string // ISO date string
    }) {
        return prisma.batch.create({
            data: {
                cageId: data.cageId,
                species: data.species,
                quantity: data.quantity,
                currentQuantity: data.quantity,
                stockingDate: new Date(),
                estimatedHarvestDate: data.estimatedHarvestDate ? new Date(data.estimatedHarvestDate) : undefined,
                status: 'ACTIVE'
            }
        })
    }

    // Record sensor reading
    async recordReading(data: {
        cageId: string
        temperature?: number
        ph?: number
        dissolvedOxygen?: number
    }) {
        return prisma.sensorReading.create({
            data: {
                cageId: data.cageId,
                temperature: data.temperature,
                ph: data.ph,
                dissolvedOxygen: data.dissolvedOxygen,
                timestamp: new Date()
            }
        })
    }
}
