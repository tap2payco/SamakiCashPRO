import { OrderStatus, PrismaClient } from '@prisma/client'
import prisma from '../../config/prisma'
import { EscrowService } from '../escrow/escrow.service'
import { PaymentSimulationService } from '../payments/payment.simulation'

const escrowService = new EscrowService()
const paymentService = new PaymentSimulationService()

export class OrderService {
    async createOrder(data: {
        buyerId: string
        listingId: string
        quantity: number
        paymentProvider: 'MPESA' | 'TIGOPESA'
        phoneNumber: string
    }) {
        // 1. Get listing to verify availability and price
        const listing = await prisma.listing.findUnique({
            where: { id: data.listingId },
            include: { seller: true }
        })

        if (!listing) throw new Error('Listing not found')
        if (listing.quantity < data.quantity) throw new Error('Insufficient stock')

        const totalAmount = Number(listing.price) * data.quantity

        // 2. Create Order in Database
        const order = await prisma.order.create({
            data: {
                buyerId: data.buyerId,
                sellerId: listing.sellerId,
                listingId: listing.id,
                quantity: data.quantity,
                unitPrice: listing.price,
                totalAmount: totalAmount,
                paymentProvider: data.paymentProvider,
                status: OrderStatus.PENDING
            }
        })

        // 3. Initiate Payment
        const payment = await paymentService.initiatePayment({
            amount: totalAmount,
            phoneNumber: data.phoneNumber,
            provider: data.paymentProvider
        })

        // 4. Create Escrow Record
        const escrow = await escrowService.createEscrow({
            orderId: order.id,
            buyerId: data.buyerId,
            sellerId: listing.sellerId,
            amount: totalAmount
        })

        // 5. Update Order with Escrow ID & Transaction ID
        const updatedOrder = await prisma.order.update({
            where: { id: order.id },
            data: {
                escrowId: escrow.id,
                transactionId: payment.transactionId
            }
        })

        return {
            order: updatedOrder,
            paymentInstruction: payment.message,
            simulationNote: payment.simulationNote
        }
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

    async updateOrderStatus(id: string, status: OrderStatus) {
        return prisma.order.update({
            where: { id },
            data: { status }
        })
    }
}
