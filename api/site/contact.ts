import { ContactUsType, SubscribeType } from '@/types/site/contact-us';
import { api } from '../../lib/axios-config';
import { res } from '../onload';


export const ContactPost = async (value: ContactUsType) => {
  const { data } = await api.post<res>('/contact/api/', value)
  return data
}

export const SubscribePost = async (value: SubscribeType) => {
  const { data } = await api.post<res>('/contact/subscribe/api/', value)
  return data
}
