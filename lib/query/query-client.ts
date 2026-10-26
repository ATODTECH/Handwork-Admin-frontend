import { isServer, MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ApiError } from "@/lib/http/errors"

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError
    mutationMeta: {
      /** Skip the global error toast (the caller renders the error itself) */
      silentError?: boolean
    }
    queryMeta: {
      silentError?: boolean
    }
  }
}

const makeQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // First-load failures are rendered by the component; only surface failed background refetches
        if (query.state.data !== undefined && !query.meta?.silentError) toast.error(error.message)
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (!mutation.meta?.silentError) toast.error(error.message)
      },
    }),
    defaultOptions: {
      queries: {
        // Above 0 so data prefetched on the server isn't refetched immediately on the client
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        // Retry transient failures, never client errors (4xx)
        retry: (failureCount, error) => failureCount < 2 && (error.status === 0 || error.status >= 500),
      },
      mutations: {
        retry: false,
      },
    },
  })

let browserQueryClient: QueryClient | undefined

/**
 * Server: a fresh client per request so data never leaks between users.
 * Browser: one client for the app's lifetime, so a suspending render doesn't throw the cache away.
 */
export const getQueryClient = () => {
  if (isServer) return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
