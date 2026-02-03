/**
 * Market Insight Agent
 * 
 * Provides real-time market intelligence for the Mwanza fish economy.
 * In production, this would scrape/integrate with:
 * - Kirumba Fish Market prices
 * - Mwaloni Beach prices
 * - Ferry/logistics schedules
 * 
 * Currently uses simulated data for development.
 */

// Simulated market data for Mwanza fish markets
const SIMULATED_MARKET_DATA = {
    kirumba: {
        name: 'Kirumba Fish Market',
        location: 'Mwanza City',
        lastUpdated: new Date().toISOString(),
        prices: [
            { species: 'Tilapia (Sato)', price: 12000, unit: 'kg', trend: 'up', change: 5.2 },
            { species: 'Nile Perch (Sangara)', price: 18000, unit: 'kg', trend: 'stable', change: 0.3 },
            { species: 'Dagaa (Sardines)', price: 3500, unit: 'kg', trend: 'down', change: -2.1 },
            { species: 'Catfish (Kambare)', price: 8000, unit: 'kg', trend: 'up', change: 3.8 },
        ]
    },
    mwaloni: {
        name: 'Mwaloni Beach Market',
        location: 'Ilemela District',
        lastUpdated: new Date().toISOString(),
        prices: [
            { species: 'Tilapia (Sato)', price: 11500, unit: 'kg', trend: 'up', change: 4.8 },
            { species: 'Nile Perch (Sangara)', price: 17500, unit: 'kg', trend: 'stable', change: 0.1 },
            { species: 'Dagaa (Sardines)', price: 3200, unit: 'kg', trend: 'down', change: -3.0 },
            { species: 'Catfish (Kambare)', price: 7500, unit: 'kg', trend: 'stable', change: 0.5 },
        ]
    }
};

// Historical price simulation (last 7 days)
const generateHistoricalPrices = (species: string) => {
    const basePrice = species === 'Tilapia (Sato)' ? 12000 :
        species === 'Nile Perch (Sangara)' ? 18000 :
            species === 'Dagaa (Sardines)' ? 3500 : 8000;

    return Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: Math.round(basePrice * (0.95 + Math.random() * 0.1)),
    }));
};

export class MarketInsightAgent {
    /**
     * Get current prices from all markets
     */
    async getCurrentPrices() {
        // Simulate API delay
        await new Promise(r => setTimeout(r, 100));

        return {
            timestamp: new Date().toISOString(),
            markets: SIMULATED_MARKET_DATA,
            summary: {
                bestPriceFor: {
                    'Tilapia (Sato)': 'kirumba',
                    'Nile Perch (Sangara)': 'kirumba',
                    'Dagaa (Sardines)': 'mwaloni',
                    'Catfish (Kambare)': 'mwaloni',
                },
                marketTrend: 'bullish',
                recommendation: 'Good time to sell Tilapia - prices trending up by 5% this week.',
            }
        };
    }

    /**
     * Get price history for a specific species
     */
    async getPriceHistory(species: string) {
        return {
            species,
            history: generateHistoricalPrices(species),
            forecast: {
                nextWeekTrend: 'up',
                confidence: 0.72,
                predictedPrice: Math.round((species === 'Tilapia (Sato)' ? 12000 : 18000) * 1.05),
            }
        };
    }

    /**
     * Get market insights and recommendations
     */
    async getInsights() {
        const currentData = await this.getCurrentPrices();

        return {
            timestamp: currentData.timestamp,
            insights: [
                {
                    type: 'opportunity',
                    title: 'Tilapia Demand Surge',
                    description: 'Hotel bookings in Mwanza increased 15% - expect higher demand for fresh Tilapia this weekend.',
                    confidence: 0.85,
                    actionable: true,
                },
                {
                    type: 'warning',
                    title: 'Dagaa Price Drop',
                    description: 'Increased supply from Bukoba region. Consider holding stock for 3-5 days.',
                    confidence: 0.68,
                    actionable: true,
                },
                {
                    type: 'info',
                    title: 'Ferry Schedule Update',
                    description: 'MV Mwanza adding extra trip on Fridays - better logistics opportunity.',
                    confidence: 1.0,
                    actionable: false,
                }
            ],
            marketHealth: {
                overallScore: 78,
                liquidityIndex: 'high',
                volatilityIndex: 'moderate',
            }
        };
    }

    /**
     * Suggest optimal selling price for a listing
     */
    async suggestPrice(species: string, quantity: number, quality: 'premium' | 'standard' | 'economy') {
        const qualityMultiplier = quality === 'premium' ? 1.15 : quality === 'economy' ? 0.9 : 1.0;
        const bulkDiscount = quantity > 100 ? 0.95 : quantity > 50 ? 0.97 : 1.0;

        const basePrice = species.toLowerCase().includes('tilapia') ? 12000 :
            species.toLowerCase().includes('perch') ? 18000 :
                species.toLowerCase().includes('dagaa') ? 3500 : 10000;

        const suggestedPrice = Math.round(basePrice * qualityMultiplier * bulkDiscount);

        return {
            species,
            quantity,
            quality,
            suggestedPrice,
            priceRange: {
                min: Math.round(suggestedPrice * 0.9),
                max: Math.round(suggestedPrice * 1.1),
            },
            competitorAnalysis: {
                averageMarketPrice: basePrice,
                yourPricePosition: suggestedPrice > basePrice ? 'above-market' : 'competitive',
                estimatedSaleTime: suggestedPrice > basePrice * 1.05 ? '3-5 days' : '1-2 days',
            }
        };
    }
}

export const marketInsightAgent = new MarketInsightAgent();
