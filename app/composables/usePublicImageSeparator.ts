export const usePublicImageSeparator = () => {
  return useFetch('/api/public/image-separator', {
    key: 'public-image-separator',
  })
}
