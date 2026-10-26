import { mutationOptions } from "@tanstack/react-query"
import { siteHttp } from "@/lib/http/client"
import { mutationKeys } from "@/lib/query/keys"
import type { SiteApiResponse } from "@/types/api"
import type { ContactUsType, SubscribeType } from "@/types/site/contact-us"

export const contactService = {
  send: (payload: ContactUsType) => siteHttp.post<SiteApiResponse>("/contact/api/", payload),
  subscribe: (payload: SubscribeType) => siteHttp.post<SiteApiResponse>("/contact/subscribe/api/", payload),
}

export const contactMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.contact,
    mutationFn: contactService.send,
  })

export const subscribeMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.site.subscribe,
    mutationFn: contactService.subscribe,
  })
