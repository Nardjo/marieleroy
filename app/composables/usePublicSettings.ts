export const usePublicSettings = () => {
  return useFetch('/api/public/settings', {
    key: 'public-settings',
  })
}
