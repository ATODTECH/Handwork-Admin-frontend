
export interface LoginType {
  email: string
  password: string
}

export interface OnboardingLevel {
  level_1: boolean
  level_2: boolean
  level_3: boolean
}

/** Response from the API's JWT sign-in (`/signin/client`), after the envelope is unwrapped */
export interface AccountLoginRes {
  id: string
  access: string
  refresh: string
  name: string
  role: string
  onboardingComplete: boolean
  /** `[]` when the user has no onboarding record yet */
  onboarding_level: OnboardingLevel | []
}

/** Created user, as returned by `POST /api/user` and `POST /api/artisan` */
export interface AccountRegisterRes {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
}
