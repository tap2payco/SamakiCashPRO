import { Elysia, t } from 'elysia'
import prisma from '../../config/prisma'

export class EscrowService {
    async createEscrow(data: { orderId: string, buyerId: string, sellerId: string, amount: number }) {
        return prisma.escrow.create({
            data: {
                orderId: data.orderId,
                buyerId: data.buyerId,
                sellerId: data.sellerId,
                amount: data.amount,
                status: 'AWAITING_PAYMENT'
            }
        })
    }

    async confirmPayment(escrowId: string, transactionId: string) {
        const escrow = await prisma.escrow.findUnique({ where: { id: escrowId } })
        if (!escrow) throw new Error('Escrow record not found')

        return prisma.escrow.update({
            where: { id: escrowId },
            data: {
                status: 'FUNDS_HELD',
                transactionId
            }
        })
    }

    async releaseFunds(escrowId: string) {
        const escrow = await prisma.escrow.findUnique({ where: { id: escrowId } })
        if (!escrow) throw new Error('Escrow record not found')

        if (escrow.status !== 'FUNDS_HELD') throw new Error('Funds are not currently held')

        return prisma.escrow.update({
            where: { id: escrowId },
            data: { status: 'RELEASED_TO_SELLER' }
        })
    }

    async refundBuyer(escrowId: string) {
        const escrow = await prisma.escrow.findUnique({ where: { id: escrowId } })
        if (!escrow) throw new Error('Escrow record not found')

        return prisma.escrow.update({
            where: { id: escrowId },
            data: { status: 'REFUNDED' }
        })
    }

    async getByOrderId(orderId: string) {
        return prisma.escrow.findUnique({ where: { orderId } })
    }
}

export const escrowController = new Elysia({ prefix: '/escrow' })
    .decorate('escrowService', new EscrowService())
    .post('/create', ({ body, escrowService }) => escrowService.createEscrow(body), {
        body: t.Object({
            orderId: t.String(),
            buyerId: t.String(),
            sellerId: t.String(),
            amount: t.Number()
        })
    })
    .post('/confirm-payment', ({ body, escrowService }) => escrowService.confirmPayment(body.escrowId, body.transactionId), {
        body: t.Object({
            escrowId: t.String(),
            transactionId: t.String()
        })
    })
    .post('/release', ({ body, escrowService }) => escrowService.releaseFunds(body.escrowId), {
        body: t.Object({
            escrowId: t.String()
        })
    })
