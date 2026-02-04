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
