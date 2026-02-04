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
