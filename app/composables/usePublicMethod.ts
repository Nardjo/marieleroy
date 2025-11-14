export const usePublicMethod = () => {
  return useFetch('/api/public/method', {
    key: 'public-method',
  })
}
