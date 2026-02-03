import { Elysia, t } from 'elysia'
import { marketInsightAgent } from './market-insight.agent'
import { pricingAlgorithm } from './pricing.algorithm'

export const agentsController = new Elysia({ prefix: '/agents' })
    // Market Insights
    .get('/market/prices', async () => {
        return await marketInsightAgent.getCurrentPrices()
    })

    .get('/market/insights', async () => {
        return await marketInsightAgent.getInsights()
    })

    .get('/market/history/:species', async ({ params: { species } }) => {
        return await marketInsightAgent.getPriceHistory(decodeURIComponent(species))
    })

    // Price Suggestions
    .post('/pricing/suggest', async ({ body }) => {
        return await marketInsightAgent.suggestPrice(
            body.species,
            body.quantity,
            body.quality
        )
    }, {
        body: t.Object({
            species: t.String(),
            quantity: t.Number(),
            quality: t.Union([t.Literal('premium'), t.Literal('standard'), t.Literal('economy')])
        })
    })

    // Pricing Algorithm
    .post('/pricing/calculate', async ({ body }) => {
        return pricingAlgorithm.calculatePrice({
            species: body.species,
            quantity: body.quantity,
            quality: body.quality,
            urgency: body.urgency,
            location: body.location,
        })
    }, {
        body: t.Object({
            species: t.String(),
            quantity: t.Number(),
            quality: t.Union([t.Literal('premium'), t.Literal('standard'), t.Literal('economy')]),
            urgency: t.Union([t.Literal('high'), t.Literal('normal'), t.Literal('low')]),
            location: t.String(),
        })
    })

    // Market Matching Optimization
    .post('/pricing/optimize', async ({ body }) => {
        return pricingAlgorithm.optimizeForMarket(
            body.sellerPrice,
            body.buyerBudget,
            body.quantity
        )
    }, {
        body: t.Object({
            sellerPrice: t.Number(),
            buyerBudget: t.Number(),
            quantity: t.Number(),
        })
    })
