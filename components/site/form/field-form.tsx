import { useRegister } from "@/hooks/site/use-register";
import { COUNTRIES, RegisterFormValues, registerSchema } from "@/schema/validation-site";
import { FieldConfig, FieldName } from "@/types/site/register";
import { FormikHelpers, useFormik } from "formik";
import { useState } from "react";
import FieldShell from "./field-shell";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import Link from "next/link";


const NAME_FIELD: FieldConfig = { name: "name", label: "Name" }
/** for both `email` and `password` */
const FIELDS: FieldConfig[] = [
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" }
]
const PHONE_FIELD: FieldConfig = { name: "phone", label: "Phone", type: "tel", autoComplete: "tel-national" }
const LEGAL_FIELD: FieldConfig = { name: "agreeToTerms", type: "checkbox" }


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
          <Link href="/privacy-policy" className={"text-hw-primary"}>
            Attic Privacy Policy
          </Link>{" "}&amp;{" "}
          <Link href="/terms" className={"text-hw-primary"}>
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
              <a href="/login" className={"text-hw-primary"}>
                Login
              </a>
            </p>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  )
}


export const LoginFormField = () => {
  return (
    <></>
  )
}