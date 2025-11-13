import bcrypt from 'bcryptjs'
import { prisma } from '../../utils/prisma'
import { passwordChangeSchema } from '../../utils/validation'

export default defineEventHandler(async event => {
  const session = await requireUserSession(event)
  const body = await readBody(event)

  const validation = passwordChangeSchema.safeParse(body)

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request data',
      data: validation.error.flatten(),
    })
  }

  // Get current user with password
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(validation.data.currentPassword, user.password)

  if (!isPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Current password is incorrect',
    })
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(validation.data.newPassword, 10)

  // Update password
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  })

  return { success: true, message: 'Password updated successfully' }
})
