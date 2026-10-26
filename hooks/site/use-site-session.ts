import { useQuery } from "@tanstack/react-query"
import { siteSessionQuery } from "@/services/site/session"

/** Starts the visitor's API session (cookie) when a page that needs it loads */
export const useSiteSession = () => useQuery(siteSessionQuery())
