import { Elysia, t } from 'elysia'
import prisma from '../../config/prisma'

export class InsuranceService {
    /**
     * Get or create a default policy for a farmer's cage
     */
    async getPolicy(cageId: string, farmerId: string) {
        let policy = await prisma.insurancePolicy.findUnique({
            where: { cageId }
        })

        if (!policy) {
            // Create a default climate coverage policy for MVP demo
            const nextYear = new Date()
            nextYear.setFullYear(nextYear.getFullYear() + 1)

            policy = await prisma.insurancePolicy.create({
                data: {
                    cageId,
                    farmerId,
                    premiumAmount: 50000,   // 50k TZS annual
                    coverageLimit: 1000000, // 1M TZS coverage
                    startDate: new Date(),
                    endDate: nextYear,
                    status: 'ACTIVE'
                }
            })
        }

        return policy
    }

    /**
     * Checks all Active policies against recent sensor readings.
     * If Dissolved Oxygen < 3.0 or Temp > 32 on the latest reading, trigger payout!
     */
    async evaluateConditions() {
        const activePolicies = await prisma.insurancePolicy.findMany({
            where: { status: 'ACTIVE' }
        })

        const triggered = []

        for (const policy of activePolicies) {
            // Get latest sensor reading for this cage
            const latestReading = await prisma.sensorReading.findFirst({
                where: { cageId: policy.cageId },
                orderBy: { timestamp: 'desc' }
            })

            if (latestReading) {
                if ((latestReading.dissolvedOxygen && latestReading.dissolvedOxygen < 3.0) ||
                    (latestReading.temperature && latestReading.temperature > 32)) {
                    
                    // Trigger the policy!
                    const updated = await prisma.insurancePolicy.update({
                        where: { id: policy.id },
                        data: {
                            status: 'TRIGGERED',
                            triggerData: JSON.stringify(latestReading)
                        }
                    })
                    triggered.push(updated)
                }
            }
        }

        return { evaluated: activePolicies.length, triggered: triggered.length, triggeredPolicies: triggered }
    }
}

export const insuranceController = new Elysia({ prefix: '/insurance' })
    .decorate('insuranceService', new InsuranceService())
    .get('/:cageId/farmer/:farmerId', async ({ params: { cageId, farmerId }, insuranceService }) => {
         return await insuranceService.getPolicy(cageId, farmerId)
    })
    .post('/evaluate', async ({ insuranceService }) => {
         return await insuranceService.evaluateConditions()
    })
