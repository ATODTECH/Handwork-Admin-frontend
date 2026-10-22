import { ApiDataRes, ContactUsType, SubscribeType } from '@/types/contact-us';
import { api } from '../lib/axios-config';

type res = {
  data: ApiDataRes
  status: string
}

export const ContactPost = async (value: ContactUsType) => {
  const { data } = await api.post<res>('/contact/api/', value)
  return data
}

export const SubscribePost = async (value: SubscribeType) => {
  const { data } = await api.post<res>('/contact/subscribe/api/', value)
  return data
}
