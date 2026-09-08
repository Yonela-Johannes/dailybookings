import { z } from 'zod'
import { isPlatformAdmin } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { UserRole } from '@prisma/client'
import { serverSupabaseServiceRole } from '#supabase/server'

const createUserSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  fullName: z.string().min(2).trim(),
  password: z.string().min(8),
  role: z.nativeEnum(UserRole).default(UserRole.CUSTOMER),
})

export default defineEventHandler(async (event) => {
  await isPlatformAdmin(event)
  const body = await readBody(event)

  try {
    const data = createUserSchema.parse(body)

    // 1. Create Supabase Auth User
    const adminClient = serverSupabaseServiceRole(event)
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName,
        role: data.role
      }
    })

    if (authError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Failed to create auth account: ' + authError.message
      })
    }

    // 2. Create Database User
    const dbUser = await prisma.user.create({
      data: {
        id: authUser.user.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        profile: {
          create: {}
        }
      },
      include: {
        profile: true
      }
    })

    return dbUser
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: error.errors
      })
    }
    throw error
  }
})
