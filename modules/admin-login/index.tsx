"use client"

import { FormikHelpers, useFormik } from "formik"
import { Lock, Mail } from "lucide-react"
import LogoIndex from "@/components/logo"
import FormField from "@/components/form/form-field"
import PasswordField from "@/components/form/password-field"
import SubmitButton from "@/components/form/submit-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup } from "@/components/ui/field"
import { useAdminSignIn } from "@/hooks/admin/use-admin-auth"
import { LoginFormValues, loginSchema } from "@/schema/validation-site"

const AdminLogin = () => {
  const { mutate: signIn, isPending } = useAdminSignIn()

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values, { setFieldValue, setFieldTouched }: FormikHelpers<LoginFormValues>) => {
      signIn(loginSchema.cast(values), {
        onError: () => {
          void setFieldValue("password", "", false)
          void setFieldTouched("password", false, false)
        },
      })
    },
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-hw-grey-200/40 px-4 py-10">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <LogoIndex />
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-hw-grey-900">Sign in to Admin</CardTitle>
            <CardDescription>Enter your admin email and password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <form noValidate onSubmit={formik.handleSubmit}>
              <FieldGroup className="gap-5">
                <FormField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@handworkexpert.com"
                  startAddon={<Mail />}
                  disabled={isPending}
                  error={formik.errors.email}
                  touched={formik.touched.email}
                  {...formik.getFieldProps("email")}
                />
                <PasswordField
                  label="Password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  startAddon={<Lock />}
                  disabled={isPending}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                  {...formik.getFieldProps("password")}
                />
                <SubmitButton pending={isPending} pendingText="Signing in…" className="w-full">
                  Sign in
                </SubmitButton>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <p className="text-xs text-hw-grey-500">Restricted to HandworkExpert staff.</p>
      </div>
    </main>
  )
}

export default AdminLogin
