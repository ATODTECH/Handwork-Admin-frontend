import { ApiDataRes } from '@/types/site/contact-us';
import { api } from '../lib/axios-config';

export type res = {
  data: ApiDataRes
  status: string
}

export const Onload = async () => {
  const { data } = await api.get<res>('/contact/onload/token/api/')
  return data
}
