export const useAdminCrud = () => {
  const loading = ref(false)
  const saved = ref(false)

  const showSuccess = () => {
    saved.value = true
    setTimeout(() => (saved.value = false), 3000)
  }

  return { loading, saved, showSuccess }
}
