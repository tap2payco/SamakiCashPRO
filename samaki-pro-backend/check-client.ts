import { PrismaClient } from '@prisma/client'

async function main() {
    console.log('Testing Prisma Client...');
    try {
        // Standard client picks up env("DATABASE_URL")
        const prisma = new PrismaClient({
            log: ['info']
        });
        console.log('Client created standard');
        await prisma.$connect();
        console.log('Connected!');
    } catch (e) {
        console.log('Constructor failed or connect failed');
        console.error(e);

        try {
            console.log('Trying fallback: no args');
            const p2 = new PrismaClient();
            await p2.$connect();
            console.log('Connected with no args!');
        } catch (e2) {
            console.error(e2);
        }
    }
}
main();
