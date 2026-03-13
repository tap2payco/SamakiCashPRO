import { Elysia, t } from 'elysia'
import prisma from '../../config/prisma'

// Simulated cryptographic hasher
const generateMockHash = (farmerId: string, batchId: string) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let hash = 'tz_'
    for (let i = 0; i < 40; i++) hash += chars[Math.floor(Math.random() * chars.length)]
    return `${hash}_${farmerId.substring(0, 4)}_${batchId.substring(0, 4)}`
}

export class TraceabilityService {
    /**
     * Attempts to generate an export passport for a harvested batch
     */
    async generatePassport(farmerId: string, batchId: string) {
        // 1. Check if passport already exists
        const existing = await prisma.exportPassport.findUnique({
             where: { batchId }
        })
        if (existing) return existing

        // 2. Verify Batch and fetch its Sensor history
        const batch = await prisma.batch.findUnique({
            where: { id: batchId },
            include: { cage: true }
        })

        if (!batch) throw new Error("Batch not found")

        const readings = await prisma.sensorReading.findMany({
            where: { cageId: batch.cageId, timestamp: { gte: batch.stockingDate } }
        })

        // 3. Determine Water Quality Status
        // A sustainable ledger entry requires DO > 4.0 and Temp < 30 on average
        let doSum = 0, tempSum = 0, validReadings = 0
        
        for (const r of readings) {
            if (r.dissolvedOxygen && r.temperature) {
                doSum += r.dissolvedOxygen
                tempSum += r.temperature
                validReadings++
            }
        }

        let waterQuality = 'Pass'
        if (validReadings > 0) {
            const avgDO = doSum / validReadings
            const avgTemp = tempSum / validReadings
            if (avgDO < 4.0 || avgTemp > 30) {
                waterQuality = 'Fail - Violates EU Aquaculture Standards'
            }
        } else {
            waterQuality = 'Fail - Insufficient Sensor Data'
        }

        // 4. Record to "Ledger" (Database)
        const hashData = generateMockHash(farmerId, batchId)

        return await prisma.exportPassport.create({
            data: {
                batchId,
                farmerId,
                hashData,
                waterQuality
            }
        })
    }

    async getPassport(batchId: string) {
        return prisma.exportPassport.findUnique({ where: { batchId }})
    }
}

export const traceabilityController = new Elysia({ prefix: '/traceability' })
    .decorate('traceabilityService', new TraceabilityService())
    .post('/generate', async ({ body, traceabilityService }) => {
         return await traceabilityService.generatePassport(body.farmerId, body.batchId)
    }, {
        body: t.Object({
            farmerId: t.String(),
            batchId: t.String()
        })
    })
    .get('/:batchId', async ({ params: { batchId }, traceabilityService }) => {
         return await traceabilityService.getPassport(batchId)
    })
