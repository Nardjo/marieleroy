export const usePublicHero = () => {
  return useFetch('/api/public/hero', { key: 'public-hero' })
}
