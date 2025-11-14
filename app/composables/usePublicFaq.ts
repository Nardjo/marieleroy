export const usePublicFaq = () => {
  return useFetch('/api/public/faq', {
    key: 'public-faq',
  })
}
