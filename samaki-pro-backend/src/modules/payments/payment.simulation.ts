import { Elysia, t } from 'elysia'

// Mock Transaction Database
const mockTransactions = new Map<string, any>()

export class PaymentSimulationService {
    // Simulate organizing a payment
    async initiatePayment(data: { amount: number, phoneNumber: string, provider: 'MPESA' | 'TIGOPESA' }) {
        const transactionId = `TX_${Date.now()}_${Math.floor(Math.random() * 1000)}`

        const transaction = {
            id: transactionId,
            ...data,
            status: 'PENDING',
            createdAt: new Date().toISOString()
        }

        mockTransactions.set(transactionId, transaction)

        return {
            status: 'success',
            message: `Payment request sent to ${data.phoneNumber}`,
            transactionId,
            simulationNote: 'This is a mocked payment. No real money will be deducted.'
        }
    }

    // Simulate the user entering PIN and confirming (Callback)
    async simulateCallback(transactionId: string, success: boolean = true) {
        const tx = mockTransactions.get(transactionId)
        if (!tx) throw new Error('Transaction not found')

        tx.status = success ? 'COMPLETED' : 'FAILED'
        tx.updatedAt = new Date().toISOString()
        mockTransactions.set(transactionId, tx)

        return tx
    }

    async getTransaction(id: string) {
        return mockTransactions.get(id)
    }
}

export const paymentController = new Elysia({ prefix: '/payments' })
    .decorate('paymentService', new PaymentSimulationService())
    .post('/initiate', ({ body, paymentService }) => paymentService.initiatePayment(body), {
        body: t.Object({
            amount: t.Number(),
            phoneNumber: t.String(),
            provider: t.Union([t.Literal('MPESA'), t.Literal('TIGOPESA')])
        })
    })
    .post('/simulate-callback', ({ body, paymentService }) => paymentService.simulateCallback(body.transactionId, body.success), {
        body: t.Object({
            transactionId: t.String(),
            success: t.Boolean()
        })
    })
    .get('/:id', ({ params: { id }, paymentService }) => {
        const tx = paymentService.getTransaction(id)
        if (!tx) throw new Error('Transaction not found')
        return tx
    })
