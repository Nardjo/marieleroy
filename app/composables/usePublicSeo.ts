export const usePublicSeo = () => {
  return useFetch('/api/public/seo', {
    key: 'public-seo',
    lazy: true,
    server: true,
  })
}
