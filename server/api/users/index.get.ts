import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      createdAt: true,
    },
  })

  return users
})
