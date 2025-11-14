export default defineEventHandler(async () => {
  const separator = await prisma.imageSeparator.findFirst({
    select: {
      id: true,
      desktopImage: true,
      mobileImage: true,
      updatedAt: true,
    },
  })

  if (!separator) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Image separator not found',
    })
  }

  return separator
})
