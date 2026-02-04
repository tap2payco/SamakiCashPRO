import { Elysia, t } from 'elysia'
import { OrderService } from './order.service'

export const ordersController = new Elysia({ prefix: '/orders' })
    .decorate('orderService', new OrderService())

    // Create new order (Buy Now)
    .post('/', async ({ body, orderService }) => {
        return await orderService.createOrder(body)
    }, {
        body: t.Object({
            buyerId: t.String(),
            listingId: t.String(),
            quantity: t.Number(),
            paymentProvider: t.Union([t.Literal('MPESA'), t.Literal('TIGOPESA')]),
            phoneNumber: t.String()
        })
    })

    // Get order details
    .get('/:id', async ({ params: { id }, orderService }) => {
        const order = await orderService.getOrderById(id)
        if (!order) throw new Error('Order not found')
        return order
    })

    // Get orders for a buyer
    .get('/buyer/:buyerId', async ({ params: { buyerId }, orderService }) => {
        return await orderService.getBuyerOrders(buyerId)
    })

    // Get orders for a seller (Vendor Hub)
    .get('/seller/:sellerId', async ({ params: { sellerId }, orderService }) => {
        return await orderService.getSellerOrders(sellerId)
    })
