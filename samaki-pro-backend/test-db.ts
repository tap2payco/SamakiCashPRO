import prisma from './src/config/prisma'

async function main() {
    console.log('🔌 Testing database connection...')
    try {
        const count = await prisma.profile.count()
        console.log('✅ Connection successful! Profile count:', count)
    } catch (e) {
        console.error('❌ Connection failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
