export default defineEventHandler(async () => {
  const testimonials = await prisma.testimonial.findMany({
    select: {
      id: true,
      title: true,
      subtitle: true,
      quote: true,
      embedUrl: true,
    },
    orderBy: {
      displayOrder: 'asc',
    },
  })

  return testimonials || []
})
