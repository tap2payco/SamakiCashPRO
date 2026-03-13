import { Elysia, t } from 'elysia'
import prisma from '../../config/prisma'

export class CarbonService {
    /**
     * Mints Blue Carbon Credits for a successfully harvested batch based on
     * its biomass (quantity) and sustainable practices.
     */
    async mintCredits(farmerId: string, batchId: string) {
        // 1. Check if credits already minted
        const existing = await prisma.carbonCredit.findFirst({
             where: { batchId }
        })
        if (existing) return existing

        // 2. Load Batch
        const batch = await prisma.batch.findUnique({
             where: { id: batchId }
        })

        if (!batch) throw new Error("Batch not found")
        if (batch.status !== 'HARVESTED') throw new Error("Batch must be harvested to mint credits")

        // 3. Biomass Tokenization Logic
        // For demonstration: 1 token per 500 harvested fish
        const finalQuantity = batch.currentQuantity || batch.quantity
        const tokensToMint = Math.floor(finalQuantity / 500) * 1.5 // 1.5 multiplier for Blue Carbon

        if (tokensToMint <= 0) {
           return null; // Not enough biomass
        }

        return await prisma.carbonCredit.create({
            data: {
                farmerId,
                batchId,
                tokensEarned: tokensToMint
            }
        })
    }

    async getFarmerBalance(farmerId: string) {
        const credits = await prisma.carbonCredit.findMany({
            where: { farmerId }
        })
        
        let available = 0
        let sold = 0
        
        credits.forEach(c => {
            if (c.status === 'AVAILABLE') available += Number(c.tokensEarned)
            if (c.status === 'SOLD') sold += Number(c.tokensEarned)
        })

        return { available, sold, transactions: credits }
    }

    async sellCredits(farmerId: string, amount: number) {
        // Simplistic FIFO matching for available credits
        const availableCredits = await prisma.carbonCredit.findMany({
            where: { farmerId, status: 'AVAILABLE' }
        })

        let remainingToSell = amount
        for (const credit of availableCredits) {
            if (remainingToSell <= 0) break;
            
            const creditValue = Number(credit.tokensEarned)
            if (creditValue <= remainingToSell) {
                 await prisma.carbonCredit.update({
                     where: { id: credit.id },
                     data: { status: 'SOLD' }
                 })
                 remainingToSell -= creditValue
            } else {
                 // Partial sell isn't fully supported in this schema, so we just sell the whole block if requested amount > 0
                 // In production, we'd split the row.
                 await prisma.carbonCredit.update({
                     where: { id: credit.id },
                     data: { status: 'SOLD' }
                 })
                 remainingToSell -= creditValue
            }
        }

        // Add funds to farmer's wallet (Out of scope mocked action)
        const payout = amount * 12500 // Approx 12,500 TZS per token on voluntary market

        return { success: true, sold: amount, estimatedPayoutTZS: payout }
    }
}

export const carbonController = new Elysia({ prefix: '/carbon' })
    .decorate('carbonService', new CarbonService())
    .post('/mint', async ({ body, carbonService }) => {
         return await carbonService.mintCredits(body.farmerId, body.batchId)
    }, {
        body: t.Object({
            farmerId: t.String(),
            batchId: t.String()
        })
    })
    .get('/:farmerId/balance', async ({ params: { farmerId }, carbonService }) => {
         return await carbonService.getFarmerBalance(farmerId)
    })
    .post('/sell', async ({ body, carbonService }) => {
         return await carbonService.sellCredits(body.farmerId, body.amount)
    }, {
        body: t.Object({
            farmerId: t.String(),
            amount: t.Numeric()
        })
    })
