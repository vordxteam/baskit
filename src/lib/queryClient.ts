import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache data for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Mark as stale after 2 minutes - triggers background refresh
        staleTime: 2 * 60 * 1000,
        // Retry failed requests once with exponential backoff
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't throw errors automatically - handle in component
        throwOnError: false,
      },
      mutations: {
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        throwOnError: false,
      },
    },
  })
}

// Create a singleton instance for client-side usage
let queryClientInstance: QueryClient | undefined

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always create a new instance
    return createQueryClient()
  }

  // Client: use singleton
  if (!queryClientInstance) {
    queryClientInstance = createQueryClient()
  }

  return queryClientInstance
}
