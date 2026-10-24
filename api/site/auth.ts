import { api } from "@/lib/axios-config"
import { res } from "../onload"
import { LoginType } from "@/types/site/auth"

export const LoginPost = async (payload: LoginType) => {
  const { data } = await api.post<res>('/api/auth/login/', payload)
  return data
}