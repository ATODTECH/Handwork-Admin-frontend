import { api } from "@/lib/axios-config"
import { res } from "../onload"
import { RegisterType } from "@/types/site/register"


export const RegisterationPost = async (payload: RegisterType) => {
  const { data } = await api.post<res>('/api/register/', payload)
  return data
}