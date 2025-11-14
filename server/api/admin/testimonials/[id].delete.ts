export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required',
    })
  }

  await prisma.testimonial.delete({
    where: { id },
  })

  return { success: true }
})
