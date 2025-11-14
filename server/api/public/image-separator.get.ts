export default defineEventHandler(async () => {
  const separator = await prisma.imageSeparator.findFirst({
    select: {
      desktopImage: true,
      mobileImage: true,
    },
  })

  return separator || {
    desktopImage: '/images/separator.jpg',
    mobileImage: '/images/separator.jpg',
  }
})
