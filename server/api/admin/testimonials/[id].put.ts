export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required',
    })
  }

  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: {
      title: body.title,
      quote: body.quote,
      embedUrl: body.embedUrl,
      displayOrder: body.displayOrder,
    },
  })

  return testimonial
})
