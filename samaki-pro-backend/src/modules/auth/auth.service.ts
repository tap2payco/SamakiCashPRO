import { supabase } from '../../config/supabase'
import prisma from '../../config/prisma'

export class AuthService {
    async register(data: { phone: string, password: string, fullName: string, role: string }) {
        // 1. Create Supabase auth user
        const { data: authData, error } = await supabase.auth.signUp({
            phone: data.phone,
            password: data.password
        })

        if (error) throw error
        if (!authData.user) throw new Error('User creation failed')

        // 2. Create profile in our database
        // Note: In a real production app, this might be better handled by a Supabase Trigger
        // but explicit creation works for this architecture.
        const profile = await prisma.profile.create({
            data: {
                userId: authData.user.id,
                fullName: data.fullName,
                phone: data.phone,
                role: data.role
            }
        })

        return { user: authData.user, profile }
    }

    async login(phone: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            phone,
            password
        })

        if (error) throw error
        if (!data.user) throw new Error('Login failed')

        const profile = await prisma.profile.findUnique({
            where: { userId: data.user.id }
        })

        return { session: data.session, profile }
    }

    async getProfile(userId: string) {
        return prisma.profile.findUnique({
            where: { userId }
        })
    }
}
