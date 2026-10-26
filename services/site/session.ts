import { queryOptions } from "@tanstack/react-query"
import { siteHttp } from "@/lib/http/client"
import { queryKeys } from "@/lib/query/keys"
import type { SiteApiResponse } from "@/types/api"

export const siteSessionService = {
  /** Sets the API's session cookie for this visitor */
  start: (signal?: AbortSignal) => siteHttp.get<SiteApiResponse>("/contact/onload/token/api/", { signal }),
}

export const siteSessionQuery = () =>
  queryOptions({
    queryKey: queryKeys.site.session(),
    queryFn: ({ signal }) => siteSessionService.start(signal),
    // The cookie lasts for the visit; no need to re-request it
    staleTime: Infinity,
  })
