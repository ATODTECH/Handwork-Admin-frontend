
/** Response from the API's JWT sign-in */
export interface AdminLoginRes {
  id: string
  access: string
  refresh: string
  name: string
  role: string
}
