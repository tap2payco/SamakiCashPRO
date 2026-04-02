import prisma from '../../config/prisma'

export class AuthService {
    async register(data: { phone: string, password: string, fullName: string, role: string }) {
        const existing = await prisma.profile.findUnique({ where: { phone: data.phone } })
        if (existing) throw new Error("Phone number already registered")
        
        const passwordHash = await Bun.password.hash(data.password)

        const profile = await prisma.profile.create({
            data: {
                fullName: data.fullName,
                phone: data.phone,
                role: data.role as any,
                passwordHash
            }
        })
        return profile
    }

    async login(phone: string, password: string) {
        const profile = await prisma.profile.findUnique({
            where: { phone }
        })
        if (!profile) throw new Error('Invalid phone number or password')
        
        const isMatch = await Bun.password.verify(password, profile.passwordHash)
        if (!isMatch) throw new Error('Invalid phone number or password')

        return profile
    }

    async getProfile(id: string) {
        return prisma.profile.findUnique({
            where: { id }
        })
    }
}
