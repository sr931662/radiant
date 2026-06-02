import { QueryClient, keepPreviousData } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 min: data is "fresh", no background refetch
      gcTime: 1000 * 60 * 10,          // 10 min: keep in memory even when unused
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,            // still refetch when stale
      placeholderData: keepPreviousData, // show old page while new page loads (pagination)
    },
  },
})

export default queryClient
