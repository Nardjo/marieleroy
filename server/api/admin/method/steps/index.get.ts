import { prisma } from '../../../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const steps = await prisma.methodStep.findMany({
      orderBy: { stepOrder: 'asc' },
    })
    return steps
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch method steps',
    })
  }
})
