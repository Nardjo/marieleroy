export const usePublicAbout = () => {
  return useFetch('/api/public/about', {
    key: 'public-about',
  })
}
