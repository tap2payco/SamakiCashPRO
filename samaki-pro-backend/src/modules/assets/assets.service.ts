import { Elysia, t } from 'elysia'
import prisma from '../../config/prisma'

export class AssetService {
    /**
     * Vendor applies for a new Solar Cold Chain lease.
     */
    async applyForLease(vendorId: string, assetType: string) {
        // Standardize cost based on type
        let totalCost = 0
        if (assetType === 'Solar Cooler 50L') totalCost = 850000 // TZS
        else if (assetType === 'Solar Cooler 100L') totalCost = 1500000
        else throw new Error("Invalid asset type")

        return await prisma.coldChainAsset.create({
            data: {
                vendorId,
                assetType,
                totalCost
            }
        })
    }

    /**
     * Fetch a vendor's active / historical assets
     */
    async getVendorAssets(vendorId: string) {
        return prisma.coldChainAsset.findMany({
            where: { vendorId },
            orderBy: { createdAt: 'desc' }
        })
    }

    /**
     * Simulate a PAYG payment against the lease (e.g. daily M-Pesa deduction)
     */
    async makePayment(assetId: string, amount: number) {
        const asset = await prisma.coldChainAsset.findUnique({ where: { id: assetId }})
        if (!asset) throw new Error("Asset not found")
        if (asset.status !== 'LEASING') throw new Error("Asset is not in leasing status")

        const newAmountPaid = Number(asset.amountPaid) + amount
        
        // If fully paid, change status to OWNED
        let newStatus = asset.status
        if (newAmountPaid >= Number(asset.totalCost)) {
            newStatus = 'OWNED'
        }

        return await prisma.coldChainAsset.update({
             where: { id: assetId },
             data: {
                 amountPaid: newAmountPaid,
                 status: newStatus
             }
        })
    }
}

export const assetsController = new Elysia({ prefix: '/assets' })
    .decorate('assetService', new AssetService())
    .post('/apply', async ({ body, assetService }) => {
         return await assetService.applyForLease(body.vendorId, body.assetType)
    }, {
        body: t.Object({
            vendorId: t.String(),
            assetType: t.String()
        })
    })
    .get('/:vendorId', async ({ params: { vendorId }, assetService }) => {
         return await assetService.getVendorAssets(vendorId)
    })
    .post('/payment', async ({ body, assetService }) => {
         return await assetService.makePayment(body.assetId, body.amount)
    }, {
        body: t.Object({
            assetId: t.String(),
            amount: t.Numeric()
        })
    })
