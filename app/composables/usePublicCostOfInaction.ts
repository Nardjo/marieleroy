export const usePublicCostOfInaction = () => {
  return useFetch('/api/public/cost-of-inaction', { key: 'public-cost-of-inaction' })
}
