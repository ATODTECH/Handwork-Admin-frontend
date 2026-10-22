import * as Yup from "yup";

export const validationSubSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  phoneNumber: Yup.string()
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number")
    .required("Phone is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  message: Yup.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});
