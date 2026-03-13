import prisma from './src/config/prisma'
// import { ListingStatus, UserRole } from '@prisma/client'

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Create a Seed Farmer Profile (linked to a fake auth ID for now)
    // In production, auth ID comes from Supabase. We'll use a placeholder.
    const farmerId = 'user_seed_farmer_001'

    console.log('Using database URL:', process.env.DATABASE_URL ? 'Loaded ✅' : 'Missing ❌')

    let farmer;
    try {
        farmer = await prisma.profile.upsert({
            where: { userId: farmerId },
            update: {},
            create: {
                userId: farmerId,
                fullName: 'Juma K',
                phone: '+255700000001',
                role: 'FARMER',
                location: 'Mwanza, Kirumba'
            }
        })
    } catch (err) {
        console.error('❌ Failed to upsert farmer profile:', err)
        process.exit(1)
    }

    console.log('👨‍🌾 Created Farmer:', farmer.fullName)

    // 2. Create Sample Listings
    const listings = [
        {
            title: 'Fresh Tilapia (Sato)',
            description: 'Premium quality Tilapia harvested this morning from Lake Victoria cages.',
            price: 12000,
            quantity: 50,
            unit: 'kg',
            status: 'AVAILABLE',
            sellerId: farmer.id
        },
        {
            title: 'Nile Perch (Sangara)',
            description: 'Large Nile Perch, suitable for fillet processing.',
            price: 18000,
            quantity: 100,
            unit: 'kg',
            status: 'AVAILABLE',
            sellerId: farmer.id
        },
        {
            title: 'Dried Dagaa',
            description: 'Sun-dried high quality dagaa, sand-free.',
            price: 4000,
            quantity: 200,
            unit: 'kg',
            status: 'AVAILABLE',
            sellerId: farmer.id
        }
    ]

    for (const l of listings) {
        await prisma.listing.create({ data: l })
    }

    console.log(`📦 Seeded ${listings.length} listings`)

    // 3. Create Sample Cages
    const cage1 = await prisma.cage.create({
        data: {
            name: 'Cage A1',
            type: 'circular',
            capacity: 1000,
            location: 'Zone 1, Lake Victoria',
            farmerId: farmer.id,
            status: 'ACTIVE'
        }
    })

    const cage2 = await prisma.cage.create({
        data: {
            name: 'Cage B2',
            type: 'rectangular',
            capacity: 500,
            location: 'Zone 2, Lake Victoria',
            farmerId: farmer.id,
            status: 'ACTIVE'
        }
    })

    await prisma.cage.create({
        data: {
            name: 'Cage C3',
            type: 'circular',
            capacity: 750,
            location: 'Zone 1, Lake Victoria',
            farmerId: farmer.id,
            status: 'ACTIVE'
        }
    })

    console.log('🏗️ Seeded 3 cages')

    // 4. Stock batches
    await prisma.batch.create({
        data: {
            cageId: cage1.id,
            species: 'Tilapia',
            quantity: 800,
            currentQuantity: 780,
            stockingDate: new Date('2025-12-01'),
            estimatedHarvestDate: new Date('2026-06-01'),
            status: 'ACTIVE'
        }
    })

    await prisma.batch.create({
        data: {
            cageId: cage2.id,
            species: 'Nile Perch',
            quantity: 300,
            currentQuantity: 295,
            stockingDate: new Date('2026-01-15'),
            estimatedHarvestDate: new Date('2026-08-15'),
            status: 'ACTIVE'
        }
    })

    console.log('🐟 Seeded 2 batches')

    // 5. Add sensor readings for cage1 (last 7 days)
    const now = Date.now()
    for (let i = 6; i >= 0; i--) {
        await prisma.sensorReading.create({
            data: {
                cageId: cage1.id,
                temperature: 25 + Math.random() * 4,    // 25-29°C
                ph: 6.8 + Math.random() * 1.5,           // 6.8-8.3
                dissolvedOxygen: 5.5 + Math.random() * 3, // 5.5-8.5 mg/L
                timestamp: new Date(now - i * 86400000)
            }
        })
    }

    // Add a few readings for cage2
    for (let i = 2; i >= 0; i--) {
        await prisma.sensorReading.create({
            data: {
                cageId: cage2.id,
                temperature: 24 + Math.random() * 5,
                ph: 7.0 + Math.random() * 1.0,
                dissolvedOxygen: 6.0 + Math.random() * 2.5,
                timestamp: new Date(now - i * 86400000)
            }
        })
    }

    console.log('📊 Seeded sensor readings')
    console.log('✅ Seeding complete')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
