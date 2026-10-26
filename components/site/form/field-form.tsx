import { useRegister, useSiteSignIn } from "@/hooks/site/use-auth";
import { COUNTRIES, LoginFormValues, loginSchema, RegisterFormValues, registerSchema } from "@/schema/validation-site";
import { FieldConfig, FieldName } from "@/types/site/register";
import { FormikHelpers, useFormik } from "formik";
import { useState } from "react";
import FieldShell from "./field-shell";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";


const NAME_FIELD: FieldConfig = { name: "name", label: "Name" }
/** for both `email` and `password` */
const FIELDS: FieldConfig[] = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" }
]
const PHONE_FIELD: FieldConfig = { name: "phone", label: "Phone", type: "tel", autoComplete: "tel-national" }
const LEGAL_FIELD: FieldConfig = { name: "agreeToTerms", type: "checkbox" }


/** Register formfield */
export const RegisterFormField = () => {
  const { mutate: RegisterUser, isPending} = useRegister()
  const [focusedField, setFocusedField] = useState<FieldName | null>(null)


  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      countryCode: "+234",
      phone: "",
      agreeToTerms: true,
    },
    validationSchema: registerSchema,
    onSubmit: async (values: RegisterFormValues, { setFieldValue, setFieldTouched, resetForm }: FormikHelpers<RegisterFormValues>) => {
      RegisterUser(registerSchema.cast(values), {
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
            {renderField(NAME_FIELD)}
            {FIELDS.map(renderField)}
            {renderField(PHONE_FIELD)}
            {renderField(LEGAL_FIELD)}
            <button
              type="submit"
              disabled={formik.isSubmitting || isPending}
              className="w-full rounded-lg tracking-[2%] bg-secondary-blue px-10 py-3 text-sm font-bold text-hw-base-white transition-opacity disabled:cursor-not-allowed hover:bg-secondary-blue/90"
            >
              Register
            </button>
            <p className="text-center text-[13px] lg:text-sm mb-10">
              Already have an account?{" "}
              <Link href="/login" className={"text-hw-primary"}>
                Login
              </Link>
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
  onclick: (val: string, mode: string) => void
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
            {FIELDS.map(renderField)}
            <button
              type="submit"
              disabled={formik.isSubmitting || isPending}
              className="w-full rounded-lg tracking-[2%] bg-secondary-blue px-10 py-3 text-sm font-bold text-hw-base-white transition-opacity disabled:cursor-not-allowed hover:bg-secondary-blue/90"
            >
              Login
            </button>
            <div className="flex flex-col gap-15 text-center text-[13px] lg:text-sm mb-10">
              <span>Don't have an account?</span>
              <div className="flex flex-col 425xl:flex-row flex-wrap items-center justify-between gap-y-2 gap-x-3 text-base font-semibold">
                <Button variant={"outline"} onClick={()=> onclick("register", "Become a Professional")} className={"text-hw-primary"}>
                  Join as a Professional
                </Button>
                <Button variant={"outline"} onClick={()=> onclick("register", "Become a User")} className={"text-hw-primary"}>
                  Join as a User
                </Button>
              </div>
            </div>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  )
}