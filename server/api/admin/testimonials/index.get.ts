export default defineEventHandler(async () => {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      displayOrder: 'asc',
    },
  })

  return testimonials
})
