export const usePublicTestimonials = () => {
  return useFetch('/api/public/testimonials', {
    key: 'public-testimonials',
  })
}
