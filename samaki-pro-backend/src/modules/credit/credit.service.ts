import { Elysia, t } from 'elysia'
import prisma from '../../config/prisma'

export class CreditService {
    /**
     * Calculates or retrieves a farmer's credit score based on their history
     */
    async calculateCreditScore(farmerId: string) {
        // 1. Check if score already exists and was updated recently
        const existingInfo = await prisma.creditScore.findUnique({
             where: { farmerId }
        })

        if (existingInfo && existingInfo.lastUpdated.getTime() > Date.now() - 24 * 60 * 60 * 1000) {
            return existingInfo
        }

        // 2. Aggregate Data to Calculate Score
        // A. Cage & Biomass History (simulated logic based on DB)
        const cages = await prisma.cage.findMany({
            where: { farmerId },
            include: { batches: true }
        })

        // B. Sales History
        const completedSales = await prisma.order.count({
            where: { sellerId: farmerId, status: 'COMPLETED' }
        })

        let score = 300 // Base Score
        
        // Add points for each active/completed batch
        let totalBatches = 0
        cages.forEach(c => {
            totalBatches += c.batches.length
            score += c.batches.length * 50
        })

        // Add points for successful sales
        score += completedSales * 20

        // Cap at 1000
        score = Math.min(score, 1000)

        // Determine Risk and Limits
        let riskLevel = 'HIGH'
        let loanLimit = 0

        if (score >= 750) {
            riskLevel = 'LOW'
            loanLimit = 5000000 // 5M TZS
        } else if (score >= 500) {
            riskLevel = 'MEDIUM'
            loanLimit = 1500000 // 1.5M TZS
        } else {
            riskLevel = 'HIGH'
            loanLimit = 250000 // 250k TZS
        }

        const metricsInfo = JSON.stringify({
             cagesCount: cages.length,
             batchesRecorded: totalBatches,
             successfulSales: completedSales
        })

        // 3. Save or Update Record
        const result = await prisma.creditScore.upsert({
             where: { farmerId },
             update: {
                 score,
                 riskLevel,
                 loanLimit,
                 lastUpdated: new Date(),
                 history: metricsInfo
             },
             create: {
                 farmerId,
                 score,
                 riskLevel,
                 loanLimit,
                 history: metricsInfo
             }
        })

        return result
    }

    async getScore(farmerId: string) {
         return prisma.creditScore.findUnique({ where: { farmerId }})
    }
}

export const creditController = new Elysia({ prefix: '/credit' })
    .decorate('creditService', new CreditService())
    .get('/:farmerId', async ({ params: { farmerId }, creditService }) => {
         // Automatically calculate/refresh on fetch for MVP
         return await creditService.calculateCreditScore(farmerId)
    })
