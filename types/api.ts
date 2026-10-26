/** Body returned by the public-site (`/v2`) endpoints */
export interface SiteApiResponse {
  data: "success" | "error"
  status?: string
}
