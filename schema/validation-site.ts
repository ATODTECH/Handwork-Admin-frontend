import { COUNTRIESType } from "@/types/site/register";
import * as Yup from "yup";



// For Client
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

const nameField = (label: string) =>
  Yup.string()
    .trim()
    .required(`${label} is required`)
    .min(2, `${label} must be at least 2 characters`)
    .max(100, `${label} is too long`)

export const registerSchema = Yup.object({
  firstName: nameField("First name"),
  lastName: nameField("Last name"),
  email: Yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  // Mirrors the API's rule, so users aren't bounced after submitting
  password: Yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).+$/,
      "Use an uppercase letter, a lowercase letter, a number and a symbol"
    ),
  countryCode: Yup.string().required(),
  phone: Yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number can only contain digits")
    .test("valid-phone", "Enter a valid phone number", function (value) {
      if (!value) return true; // `required` handles empty
      const country = COUNTRIES.find((c) => c.dial === this.parent.countryCode);
      if (!country) return true;
      const local = value.replace(/^0/, "");
      return (
        country.pattern.test(local) ||
        this.createError({ message: `Enter a valid ${country.name} phone number` })
      );
    }),
  agreeToTerms: Yup
    .boolean()
    .required()
    .oneOf([true], "You must agree to the Privacy Policy and Terms"),
});

export const loginSchema = Yup.object({
  email: Yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: Yup.string().required("Password is required")
})



export type LoginFormValues = Yup.InferType<typeof loginSchema>
export type RegisterFormValues = Yup.InferType<typeof registerSchema>


// `pattern` validates the local number WITHOUT the leading 0 / dial code.
export const COUNTRIES: COUNTRIESType[] = [
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬", pattern: /^[789][01]\d{8}$/ },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭", pattern: /^[235]\d{8}$/ },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪", pattern: /^[17]\d{8}$/ },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦", pattern: /^[6-8]\d{8}$/ },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧", pattern: /^7\d{9}$/ },
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸", pattern: /^\d{10}$/ },
] as const
