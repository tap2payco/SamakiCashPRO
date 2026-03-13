import { PrismaClient } from '@prisma/client'
import prisma from '../../config/prisma'
import { EscrowService } from '../escrow/escrow.service'
import { PaymentSimulationService } from '../payments/payment.simulation'

export class OrderService {
    async createOrder(data: {
        buyerId: string
        listingId: string
        quantity: number
        paymentProvider?: string
        phoneNumber?: string
    }) {
        // 1. Get listing to verify availability and price
        const listing = await prisma.listing.findUnique({
            where: { id: data.listingId },
            include: { seller: true }
        })

        if (!listing) throw new Error('Listing not found')
        if (listing.quantity < data.quantity) throw new Error('Insufficient stock')

        // Calculate totals
        const unitPrice = listing.price
        const totalAmount = Number(unitPrice) * data.quantity

        return prisma.$transaction(async (tx) => {
            // 2. Create the Order
            const order = await tx.order.create({
                data: {
                    buyerId: data.buyerId,
                    sellerId: listing.sellerId,
                    listingId: data.listingId,
                    quantity: data.quantity,
                    unitPrice: unitPrice,
                    totalAmount: totalAmount,
                    paymentProvider: data.paymentProvider,
                    status: 'PENDING'
                }
            })

            // 3. Create the Escrow record holding the funds
            await tx.escrow.create({
                data: {
                    orderId: order.id,
                    buyerId: data.buyerId,
                    sellerId: listing.sellerId,
                    amount: totalAmount,
                    status: 'AWAITING_PAYMENT'
                }
            })

            // 4. Initiate the Mobile Money Payment (Simulation)
            if (data.paymentProvider && data.phoneNumber) {
                const paymentSim = new PaymentSimulationService()
                const paymentReq = await paymentSim.initiatePayment({
                    amount: totalAmount,
                    phoneNumber: data.phoneNumber,
                    provider: data.paymentProvider as 'MPESA' | 'TIGOPESA'
                })
                
                // For MVP, if payment is initiated, we simulate that they approved it successfully immediately
                await paymentSim.simulateCallback(paymentReq.transactionId, true)

                // Now update Escrow to FUNDS_HELD to indicate successful payment
                await tx.escrow.update({
                    where: { orderId: order.id },
                    data: { 
                        status: 'FUNDS_HELD',
                        transactionId: paymentReq.transactionId
                    }
                })

                // And update Order to PAID / PROCESSING
                const paidOrder = await tx.order.update({
                    where: { id: order.id },
                    data: { 
                        status: 'PAID',
                        transactionId: paymentReq.transactionId
                    }
                })
                return paidOrder
            }

            return order
        })
    }

    async getOrderById(id: string) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                buyer: true,
                seller: true,
                listing: true
            }
        })
    }

    async getBuyerOrders(buyerId: string) {
        return prisma.order.findMany({
            where: { buyerId },
            include: { listing: true, seller: true },
            orderBy: { createdAt: 'desc' }
        })
    }

    async getSellerOrders(sellerId: string) {
        return prisma.order.findMany({
            where: { sellerId },
            include: { listing: true, buyer: true },
            orderBy: { createdAt: 'desc' }
        })
    }

    async updateOrderStatus(id: string, status: string) {
        return prisma.order.update({
            where: { id },
            data: { status: status as any }
        })
    }
}
