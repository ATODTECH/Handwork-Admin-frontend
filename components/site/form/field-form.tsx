import { useRegister, useSiteSignIn } from "@/hooks/site/use-auth";
import { COUNTRIES, LoginFormValues, loginSchema, RegisterFormValues, registerSchema } from "@/schema/validation-site";
import { FieldConfig, FieldName } from "@/types/site/register";
import { FormikHelpers, useFormik } from "formik";
import { useState } from "react";
import FieldShell from "./field-shell";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import type { AccountRole } from "@/lib/auth/session";


const NAME_FIELDS: FieldConfig[] = [
  { name: "firstName", label: "First name", autoComplete: "given-name" },
  { name: "lastName", label: "Last name", autoComplete: "family-name" },
]
const EMAIL_FIELD: FieldConfig = { name: "email", label: "Email", type: "email", autoComplete: "email" }
const NEW_PASSWORD_FIELD: FieldConfig = { name: "password", label: "Password", type: "password", autoComplete: "new-password" }
const PASSWORD_FIELD: FieldConfig = { name: "password", label: "Password", type: "password", autoComplete: "current-password" }
const PHONE_FIELD: FieldConfig = { name: "phone", label: "Phone", type: "tel", autoComplete: "tel-national" }
const LEGAL_FIELD: FieldConfig = { name: "agreeToTerms", type: "checkbox" }

/** API stores `contact` in international form, e.g. +2348012345678 */
const toContact = (dial: string, phone: string) => `${dial}${phone.replace(/^0/, "")}`

const API_FIELD_TO_FORM: Record<string, keyof RegisterFormValues> = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  password: "password",
  contact: "phone",
}


/** Register formfield */
export const RegisterFormField = ({
  role,
  onLogin,
}: {
  role: AccountRole
  /** In a dialog: switch to the login dialog instead of navigating to /login */
  onLogin?: () => void
}) => {
  const { mutate: RegisterUser, isPending} = useRegister()
  const [focusedField, setFocusedField] = useState<FieldName | null>(null)


  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      countryCode: "+234",
      phone: "",
      agreeToTerms: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values: RegisterFormValues, { setFieldValue, setFieldTouched, resetForm }: FormikHelpers<RegisterFormValues>) => {
      const { firstName, lastName, email, password, countryCode, phone } = registerSchema.cast(values)
      RegisterUser({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        contact: toContact(countryCode, phone),
        role,
      }, {
        onSuccess: () => resetForm(),
				onError: (error) => {
          void setFieldValue("password", "", false);
					void setFieldTouched("password", false, false);
          // Show the API's field errors (e.g. email or phone already taken) under the matching inputs
          const errors: Partial<Record<keyof RegisterFormValues, string>> = {}
          for (const [apiField, formField] of Object.entries(API_FIELD_TO_FORM)) {
            const message = error.fieldErrors[apiField]?.[0]
            if (message) errors[formField] = message
          }
          formik.setErrors(errors)
				},
      })
    },
  })

  
  const renderField = (config: FieldConfig) => (
    <FieldShell
      key={config.name}
      config={config}
      value={formik.values[config.name]}
      focused={focusedField === config.name}
      error={formik.errors[config.name]}
      touched={formik.touched[config.name]}
      isPending={isPending}
      autoComplete={config.autoComplete}
      onFocus={() => setFocusedField(config.name)}
      onBlur={(e) => {
        setFocusedField(null);
        formik.handleBlur(e);
      }}
      /** for other `input` element change of value */
      onChange={formik.handleChange}
      /** for `select` value change; countryCode e.g +234 */
      selectValue={formik.values["countryCode"]}
      selectedCountry={COUNTRIES.find((c) => c.dial === formik.values["countryCode"]) ?? COUNTRIES[0]}
      onValueChange={(value) => formik.setFieldValue("countryCode", value)}
      /** for `checkbox` change */
      onCheckedChanged={(checked)=>{formik.setFieldValue(config.name, checked)}}
      /** checkbox content */
      isCheckboxCont={(
        <div className="ml-1.5 text-[13px] lg:text-sm font-normal leading-normal">
          I agree to Artisan&apos;s{" "}
          <Link href="/policy" target="_blank" className={"text-hw-primary"}>
            Attic Privacy Policy
          </Link>{" "}&amp;{" "}
          <Link href="/terms" target="_blank" className={"text-hw-primary"}>
            Terms and Conditions.
          </Link>
        </div>
      )}
    />
  )

  return (
    <div className="py-2 p-5 overflow-y-auto scrollbar-thin">
      <form
        method="post"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <FieldGroup>
          <FieldSet className="space-y-1">
            <div className="grid gap-4 sm:grid-cols-2">
              {NAME_FIELDS.map(renderField)}
            </div>
            {renderField(EMAIL_FIELD)}
            {renderField(NEW_PASSWORD_FIELD)}
            {renderField(PHONE_FIELD)}
            {renderField(LEGAL_FIELD)}
            <button
              type="submit"
              // Can't register until the terms are accepted
              disabled={!formik.values.agreeToTerms || isPending}
              aria-busy={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg tracking-[2%] bg-secondary-blue px-10 py-3 text-sm font-bold text-hw-base-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60 hover:bg-secondary-blue/90"
            >
              {isPending && <Spinner />}
              {isPending ? "Creating your account…" : "Register"}
            </button>
            <p className="text-center text-[13px] lg:text-sm mb-10">
              Already have an account?{" "}
              {onLogin ? (
                <button type="button" onClick={onLogin} className={"text-hw-primary"}>
                  Login
                </button>
              ) : (
                <Link href="/login" className={"text-hw-primary"}>
                  Login
                </Link>
              )}
            </p>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  )
}


/** Login formfield */
export const LoginFormField = ({
  onclick,
}: {
  /** In a dialog: open the register dialog instead of navigating to /register */
  onclick?: (val: string, mode: string) => void
}) => {
  const {mutate: LoginUser, isPending} = useSiteSignIn()
  const [focusedField, setFocusedField] = useState<FieldName | null>(null)

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values: LoginFormValues, { setFieldValue, setFieldTouched, resetForm }: FormikHelpers<LoginFormValues>) => {
      LoginUser(loginSchema.cast(values), {
        onSuccess: () => resetForm(),
				onError: () => {
          void setFieldValue("password", "", false);
					void setFieldTouched("password", false, false);
				},
      })
    },
  })

  const renderField = (config: FieldConfig) => (
    <FieldShell
      key={config.name}
      config={config}
      value={formik.values[config.name as keyof typeof formik.values]}
      focused={focusedField === config.name}
      error={formik.errors[config.name as keyof typeof formik.values]}
      touched={formik.touched[config.name as keyof typeof formik.values]}
      isPending={isPending}
      forgotPassword={(val)=> toast("coming soon!")}
      autoComplete={config.autoComplete}
      onFocus={() => setFocusedField(config.name)}
      onBlur={(e) => {
        setFocusedField(null);
        formik.handleBlur(e);
      }}
      onChange={formik.handleChange}
    />
  )


  return (
    <div className="py-2 p-5 overflow-y-auto scrollbar-thin">
      <form
        method="post"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <FieldGroup>
          <FieldSet className="space-y-2">
            {renderField(EMAIL_FIELD)}
            {renderField(PASSWORD_FIELD)}
            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg tracking-[2%] bg-secondary-blue px-10 py-3 text-sm font-bold text-hw-base-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60 hover:bg-secondary-blue/90"
            >
              {isPending && <Spinner />}
              {isPending ? "Signing in…" : "Login"}
            </button>
            <div className="flex flex-col gap-15 text-center text-[13px] lg:text-sm mb-10">
              <span>Don&apos;t have an account?</span>
              <div className="flex flex-col 425xl:flex-row flex-wrap items-center justify-between gap-y-2 gap-x-3 text-base font-semibold">
                {onclick ? (
                  <>
                    <Button type="button" variant={"outline"} onClick={()=> onclick("register", "Become a Professional")} className={"text-hw-primary"}>
                      Join as a Professional
                    </Button>
                    <Button type="button" variant={"outline"} onClick={()=> onclick("register", "Become a User")} className={"text-hw-primary"}>
                      Join as a User
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant={"outline"} render={<Link href="/register?role=artisan" />} nativeButton={false} className={"text-hw-primary"}>
                      Join as a Professional
                    </Button>
                    <Button variant={"outline"} render={<Link href="/register" />} nativeButton={false} className={"text-hw-primary"}>
                      Join as a User
                    </Button>
                  </>
                )}
              </div>
            </div>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  )
}