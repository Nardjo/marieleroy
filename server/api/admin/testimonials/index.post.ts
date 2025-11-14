export default defineEventHandler(async event => {
  const body = await readBody(event)

  const testimonial = await prisma.testimonial.create({
    data: {
      title: body.title,
      quote: body.quote,
      embedUrl: body.embedUrl,
      displayOrder: body.displayOrder ?? 0,
    },
  })

  return testimonial
})
