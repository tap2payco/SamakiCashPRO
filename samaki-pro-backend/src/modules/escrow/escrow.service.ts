import { Elysia, t } from 'elysia'

// Mock Escrow Database
const escrowLedger = new Map<string, any>()

export class EscrowService {
    async createEscrow(data: { listingId: string, buyerId: string, sellerId: string, amount: number }) {
        const escrowId = `ESC_${Date.now()}`

        const escrow = {
            id: escrowId,
            ...data,
            status: 'AWAITING_PAYMENT',
            createdAt: new Date().toISOString()
        }

        escrowLedger.set(escrowId, escrow)
        return escrow
    }

    async confirmPayment(escrowId: string, transactionId: string) {
        const escrow = escrowLedger.get(escrowId)
        if (!escrow) throw new Error('Escrow record not found')

        // In a real app, we would verify transactionId with PaymentService here
        escrow.status = 'FUNDS_HELD'
        escrow.transactionId = transactionId

        escrowLedger.set(escrowId, escrow)
        return escrow
    }

    async releaseFunds(escrowId: string) {
        const escrow = escrowLedger.get(escrowId)
        if (!escrow) throw new Error('Escrow record not found')

        if (escrow.status !== 'FUNDS_HELD') throw new Error('Funds are not currently held')

        escrow.status = 'RELEASED_TO_SELLER'
        escrowLedger.set(escrowId, escrow)
        return escrow
    }

    async refundBuyer(escrowId: string) {
        const escrow = escrowLedger.get(escrowId)
        if (!escrow) throw new Error('Escrow record not found')

        escrow.status = 'REFUNDED'
        escrowLedger.set(escrowId, escrow)
        return escrow
    }
}

export const escrowController = new Elysia({ prefix: '/escrow' })
    .decorate('escrowService', new EscrowService())
    .post('/create', ({ body, escrowService }) => escrowService.createEscrow(body), {
        body: t.Object({
            listingId: t.String(),
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
