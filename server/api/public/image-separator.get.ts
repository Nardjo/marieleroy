export default defineEventHandler(async () => {
  const separator = await prisma.imageSeparator.findFirst({
    select: {
      desktopImage: true,
      mobileImage: true,
    },
  })

  return separator || {
    desktopImage: null,
    mobileImage: null,
  }
})
