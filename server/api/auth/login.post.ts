import { z } from 'zod'
import bcrypt from 'bcryptjs'
import prisma from '../../utils/prisma'

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { email, password } = loginSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      })
    }

    const { password: _password, ...userWithoutPassword } = user

    await setUserSession(event, {
      user: userWithoutPassword,
      loggedInAt: new Date(),
    })

    return {
      success: true,
      user: userWithoutPassword,
    }
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        data: (error as any).errors,
      })
    }
    throw error
  }
})
