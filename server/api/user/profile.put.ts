import { prisma } from '../../utils/prisma'
import { userProfileUpdateSchema } from '../../utils/validation'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  const body = await readBody(event)

  const validation = userProfileUpdateSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  // Check if email is already taken by another user
  if (validation.data.email.toLowerCase() !== session.user.email.toLowerCase()) {
    const existingUser = await prisma.user.findUnique({
      where: { email: validation.data.email.toLowerCase() },
    })

    if (existingUser && existingUser.id !== session.user.id) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Email already in use',
      })
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName: validation.data.firstName,
      lastName: validation.data.lastName,
      email: validation.data.email.toLowerCase(),
      name: `${validation.data.firstName} ${validation.data.lastName || ''}`.trim(),
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      name: true,
      role: true,
      updatedAt: true,
    },
  })

  // Update session with new user data
  await setUserSession(event, {
    user: updatedUser,
    loggedInAt: session.loggedInAt,
  })

  return updatedUser
})
