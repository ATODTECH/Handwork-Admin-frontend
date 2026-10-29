import { mutationOptions, queryOptions } from "@tanstack/react-query"
import axios from "axios"
import { accountHttp } from "@/lib/http/client"
import { isApiError, toApiError } from "@/lib/http/errors"
import { COUNTRY } from "@/lib/locations"
import { mutationKeys, queryKeys } from "@/lib/query/keys"
import type {
  ArtisanProfile,
  Bank,
  BankDetailsPayload,
  IdentityPayload,
  LocationPayload,
  ServiceOption,
  SkillPayload,
  WorkAvailability,
} from "@/types/account/artisan"

// Uploads go to Cloudinary through the API, so give them longer than the default timeout
const UPLOAD_TIMEOUT_MS = 120_000

const AVAILABILITY_FLAGS: WorkAvailability[] = ["weekdays_only", "weekends_only", "weekdays_and_weekends"]

const toFormData = (fields: Record<string, string | Blob>) => {
  const body = new FormData()
  for (const [key, value] of Object.entries(fields)) body.append(key, value)
  return body
}

// Router routes have no trailing slash (see `setup/urls.py` on the API)
export const artisanOnboardingService = {
  profile: (id: string, signal?: AbortSignal) => accountHttp.get<ArtisanProfile>(`/api/artisan/${id}`, { signal }),

  /** The API answers 404 instead of `[]` when no services exist yet */
  serviceOptions: (signal?: AbortSignal) =>
    accountHttp.get<ServiceOption[]>("/api/get_services", { signal }).catch((error) => {
      if (isApiError(error) && error.status === 404) return []
      throw error
    }),

  /** Same-origin route handler, not the API */
  banks: (signal?: AbortSignal) =>
    axios
      .get<Bank[]>("/api/banks", { signal })
      .then(({ data }) => data)
      .catch((error) => Promise.reject(toApiError(error))),

  saveIdentity: (userId: string, { nin, documentType, document }: IdentityPayload) =>
    accountHttp.patch<ArtisanProfile>(
      `/api/artisan/${userId}`,
      toFormData({ nin, document_type: documentType, document }),
      { timeout: UPLOAD_TIMEOUT_MS },
    ),

  saveLocation: (userId: string, location: LocationPayload) =>
    accountHttp.patch<ArtisanProfile>(`/api/artisan/${userId}`, { ...location, country: COUNTRY }),

  saveSkill: ({ description, baseCharge, capCharge, serviceIds, availability, photos }: SkillPayload) => {
    const body = toFormData({
      description,
      base_charge: String(baseCharge),
      cap_charge: String(capCharge),
      // The API parses this as a JSON array
      services: JSON.stringify(serviceIds),
    })
    for (const flag of AVAILABILITY_FLAGS) body.append(flag, String(flag === availability))
    photos.forEach((photo, index) => body.append(`image${index + 1}`, photo))
    return accountHttp.post("/api/skill", body, { timeout: UPLOAD_TIMEOUT_MS })
  },

  /** The API checks the account with Paystack and fills in the holder's name */
  saveBankDetails: ({ bankName, bankCode, accountNumber }: BankDetailsPayload) =>
    accountHttp.post("/api/bank_details", toFormData({ name: bankName, bank_code: bankCode, account_number: accountNumber })),
}

export const artisanProfileQuery = (id: string) =>
  queryOptions({
    queryKey: queryKeys.account.artisanProfile(id),
    queryFn: ({ signal }) => artisanOnboardingService.profile(id, signal),
  })

export const serviceOptionsQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.serviceOptions(),
    queryFn: ({ signal }) => artisanOnboardingService.serviceOptions(signal),
    staleTime: 10 * 60_000,
  })

export const banksQuery = () =>
  queryOptions({
    queryKey: queryKeys.account.banks(),
    queryFn: ({ signal }) => artisanOnboardingService.banks(signal),
    staleTime: Infinity,
  })

export const saveIdentityMutation = (userId: string) =>
  mutationOptions({
    mutationKey: mutationKeys.account.saveIdentity,
    mutationFn: (payload: IdentityPayload) => artisanOnboardingService.saveIdentity(userId, payload),
  })

export const saveLocationMutation = (userId: string) =>
  mutationOptions({
    mutationKey: mutationKeys.account.saveLocation,
    mutationFn: (payload: LocationPayload) => artisanOnboardingService.saveLocation(userId, payload),
  })

export const saveSkillMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.saveSkill,
    mutationFn: artisanOnboardingService.saveSkill,
  })

export const saveBankDetailsMutation = () =>
  mutationOptions({
    mutationKey: mutationKeys.account.saveBankDetails,
    mutationFn: artisanOnboardingService.saveBankDetails,
  })
