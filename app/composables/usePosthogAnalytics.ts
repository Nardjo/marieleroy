interface AnalyticsData {
  uniqueUsers: Array<{ date: string; count: number }>
  ctaClicks: Array<{ date: string; count: number }>
  totalUniqueUsers: number
  uniqueConvertedUsers: number
  conversionRate: number
  period: string
}

export const usePosthogAnalytics = () => {
  const getAnalyticsData = async (days: number = 30, period: string = 'day'): Promise<AnalyticsData> => {
    const emptyAnalytics: AnalyticsData = {
      uniqueUsers: [],
      ctaClicks: [],
      totalUniqueUsers: 0,
      uniqueConvertedUsers: 0,
      conversionRate: 0,
      period: 'par jour',
    }

    try {
      const response = await fetch(`/api/dashboard/analytics?days=${days}&period=${period}`)
      const data = await response.json()

      if (data.success) {
        return data.data
      }

      return emptyAnalytics
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      return emptyAnalytics
    }
  }

  return {
    getAnalyticsData,
  }
}
