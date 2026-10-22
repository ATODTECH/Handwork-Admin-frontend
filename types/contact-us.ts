export type ApiDataRes = 'success'|'error'
export type FieldName = "name" | "phoneNumber" | "email" | "message";

export interface FieldConfig {
  name: FieldName;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
}

export interface ContactUsType {
  name: string,
  phoneNumber: string,
  email: string,
  message: string,
}

export interface SubscribeType {
  email: string
}