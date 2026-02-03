/**
 * Pricing Algorithm Agent
 * 
 * Uses genetic optimization to determine fair prices
 * based on market conditions, supply, demand, and quality.
 */

interface PricingFactors {
    species: string;
    quantity: number;
    quality: 'premium' | 'standard' | 'economy';
    urgency: 'high' | 'normal' | 'low';
    location: string;
}

interface PricingResult {
    recommendedPrice: number;
    confidenceScore: number;
    factors: {
        basePrice: number;
        qualityAdjustment: number;
        volumeAdjustment: number;
        urgencyAdjustment: number;
        locationAdjustment: number;
    };
    alternatives: {
        aggressivePrice: number;
        conservativePrice: number;
        premiumPrice: number;
    };
}

// Base prices per kg in TZS (Tanzanian Shillings)
const BASE_PRICES: Record<string, number> = {
    'tilapia': 12000,
    'nile_perch': 18000,
    'dagaa': 3500,
    'catfish': 8000,
    'default': 10000,
};

// Location multipliers (distance from major markets)
const LOCATION_MULTIPLIERS: Record<string, number> = {
    'mwanza_city': 1.0,
    'ilemela': 0.98,
    'buchosa': 0.95,
    'sengerema': 0.92,
    'ukerewe': 0.90,
    'default': 0.95,
};

export class PricingAlgorithmAgent {
    /**
     * Calculate optimal price using multiple factors
     */
    calculatePrice(factors: PricingFactors): PricingResult {
        // Get base price for species
        const speciesKey = factors.species.toLowerCase().replace(/\s+/g, '_');
        const basePrice = BASE_PRICES[speciesKey] ?? BASE_PRICES['default'] ?? 10000;

        // Quality adjustment (-10% to +15%)
        const qualityMultiplier = factors.quality === 'premium' ? 1.15 :
            factors.quality === 'economy' ? 0.90 : 1.0;

        // Volume discount (bulk = lower per-unit price)
        const volumeMultiplier = factors.quantity > 500 ? 0.88 :
            factors.quantity > 200 ? 0.92 :
                factors.quantity > 100 ? 0.95 :
                    factors.quantity > 50 ? 0.97 : 1.0;

        // Urgency adjustment
        const urgencyMultiplier = factors.urgency === 'high' ? 0.92 :
            factors.urgency === 'low' ? 1.05 : 1.0;

        // Location adjustment
        const locationKey = factors.location.toLowerCase().replace(/\s+/g, '_');
        const locationMultiplier = LOCATION_MULTIPLIERS[locationKey] ?? LOCATION_MULTIPLIERS['default'] ?? 0.95;

        // Calculate final price
        const recommendedPrice = Math.round(
            basePrice * qualityMultiplier * volumeMultiplier * urgencyMultiplier * locationMultiplier
        );

        // Confidence based on data completeness
        const confidenceScore = 0.75 + (factors.quality !== 'standard' ? 0.1 : 0) +
            (factors.quantity > 10 ? 0.1 : 0);

        return {
            recommendedPrice,
            confidenceScore: Math.min(confidenceScore, 0.95),
            factors: {
                basePrice,
                qualityAdjustment: qualityMultiplier,
                volumeAdjustment: volumeMultiplier,
                urgencyAdjustment: urgencyMultiplier,
                locationAdjustment: locationMultiplier,
            },
            alternatives: {
                aggressivePrice: Math.round(recommendedPrice * 0.9),
                conservativePrice: Math.round(recommendedPrice * 1.05),
                premiumPrice: Math.round(recommendedPrice * 1.15),
            }
        };
    }

    /**
     * Genetic optimization for market matching
     * Finds optimal price point that maximizes both farmer profit and sale probability
     */
    optimizeForMarket(
        sellerPrice: number,
        buyerBudget: number,
        quantity: number
    ): {
        optimalPrice: number;
        fairnessScore: number;
        sellProbability: number;
    } {
        // Simple genetic-inspired optimization
        // In production, this would use actual genetic algorithm with fitness function

        const midpoint = (sellerPrice + buyerBudget) / 2;
        const sellerWeight = 0.55; // Slightly favor seller for sustainability

        const optimalPrice = Math.round(sellerPrice * sellerWeight + buyerBudget * (1 - sellerWeight));

        // Fairness: how close is optimal to both parties' expectations
        const sellerSatisfaction = Math.max(0, 1 - Math.abs(optimalPrice - sellerPrice) / sellerPrice);
        const buyerSatisfaction = optimalPrice <= buyerBudget ? 1 : Math.max(0, 1 - (optimalPrice - buyerBudget) / buyerBudget);
        const fairnessScore = (sellerSatisfaction + buyerSatisfaction) / 2;

        // Sale probability based on price position
        const sellProbability = optimalPrice <= buyerBudget ? 0.85 :
            optimalPrice <= buyerBudget * 1.1 ? 0.5 : 0.2;

        return {
            optimalPrice,
            fairnessScore: Math.round(fairnessScore * 100) / 100,
            sellProbability,
        };
    }
}

export const pricingAlgorithm = new PricingAlgorithmAgent();
