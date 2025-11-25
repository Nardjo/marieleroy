export const useTestimonials = () => {
  const loading = ref(false)

  // Header operations
  const fetchHeader = async () => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/testimonials/header')
      return response
    } finally {
      loading.value = false
    }
  }

  const updateHeader = async (header: {
    title: string
    subtitle?: string | null
    description?: string | null
  }) => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/testimonials/header', {
        method: 'PUT',
        body: header,
      })
      return response
    } finally {
      loading.value = false
    }
  }

  // Testimonials operations
  const fetchTestimonials = async () => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/testimonials')
      return response
    } finally {
      loading.value = false
    }
  }

  const createTestimonial = async (data: {
    title: string
    quote: string
    embedUrl: string
    displayOrder?: number
  }) => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/testimonials', {
        method: 'POST',
        body: data,
      })
      return response
    } finally {
      loading.value = false
    }
  }

  const updateTestimonial = async (
    id: string,
    data: { title: string; quote: string; embedUrl: string; displayOrder: number },
  ) => {
    try {
      loading.value = true
      const response = await $fetch(`/api/admin/testimonials/${id}`, {
        method: 'PUT',
        body: data,
      })
      return response
    } finally {
      loading.value = false
    }
  }

  const deleteTestimonial = async (id: string) => {
    try {
      loading.value = true
      await $fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      })
    } finally {
      loading.value = false
    }
  }

  const reorderTestimonials = async (
    testimonials: Array<{ id: string; displayOrder: number }>,
  ) => {
    try {
      loading.value = true
      const response = await $fetch('/api/admin/testimonials/reorder', {
        method: 'PUT',
        body: { testimonials },
      })
      return response
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    fetchHeader,
    updateHeader,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    reorderTestimonials,
  }
}
