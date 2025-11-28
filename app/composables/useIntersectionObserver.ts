import { onUnmounted } from 'vue'

export function useIntersectionObserver(
  targets: Ref<HTMLElement[] | null[]>,
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit,
) {
  const observer = new IntersectionObserver(callback, options)

  // Observe all targets
  targets.value.forEach(target => {
    if (target) {
      observer.observe(target)
    }
  })

  // Cleanup function to stop observing
  const stop = () => {
    observer.disconnect()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stop()
  })

  return stop
}
