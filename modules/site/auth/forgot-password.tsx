"use client"

import { useState } from "react"
import Link from "next/link"
import { useFormik } from "formik"
import { CircleCheck } from "lucide-react"
import { toast } from "sonner"
import FormField from "@/components/form/form-field"
import { textFieldProps } from "@/components/form/formik-field-props"
import PasswordField from "@/components/form/password-field"
import SubmitButton from "@/components/form/submit-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRequestResetCode, useResetPassword, useVerifyResetCode } from "@/hooks/site/use-password-reset"
import { isApiError } from "@/lib/http/errors"
import { ACCOUNT_ROUTES } from "@/lib/routes"
import { newPasswordSchema, resetCodeSchema, validationSubSchema } from "@/schema/validation-site"

type Step = "email" | "code" | "password" | "done"

const HEADINGS: Record<Step, { title: string, description: string }> = {
  email: { title: "Forgot your password?", description: "Enter your account's email and we'll send you a code to reset it." },
  code: { title: "Check your email", description: "" },
  password: { title: "Choose a new password", description: "Use at least 8 characters, with an uppercase letter, a lowercase letter, a number and a symbol." },
  done: { title: "Password changed", description: "You can now sign in with your new password." },
}

const EmailStep = ({ onSent }: { onSent: (email: string) => void }) => {
  const { mutate, isPending } = useRequestResetCode()
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: validationSubSchema,
    onSubmit: (values) => {
      const { email } = validationSubSchema.cast(values)
      mutate(email, { onSuccess: () => onSent(email) })
    },
  })

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
      <FormField label="Email" type="email" autoComplete="email" autoFocus {...textFieldProps(formik, "email")} disabled={isPending} />
      <SubmitButton pending={isPending} pendingText="Sending code…" className="w-full">Send code</SubmitButton>
    </form>
  )
}

const CodeStep = ({ email, onVerified, onChangeEmail }: { email: string, onVerified: () => void, onChangeEmail: () => void }) => {
  const verify = useVerifyResetCode()
  const resend = useRequestResetCode()
  const formik = useFormik({
    initialValues: { code: "" },
    validationSchema: resetCodeSchema,
    onSubmit: ({ code }, { setErrors }) => {
      verify.mutate({ email, code }, {
        onSuccess: onVerified,
        onError: (error) => setErrors({ code: error.message }),
      })
    },
  })

  const sendAgain = () =>
    resend.mutate(email, {
      onSuccess: () => {
        formik.resetForm()
        toast.success("We've sent a new code. Only the newest one works.")
      },
    })

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
      <FormField
        label="6-digit code"
        autoFocus
        maxLength={6}
        {...textFieldProps(formik, "code", { digits: true })}
        autoComplete="one-time-code"
        className="tracking-[0.5em] tabular-nums"
        disabled={verify.isPending}
      />
      <SubmitButton pending={verify.isPending} pendingText="Checking…" className="w-full">Continue</SubmitButton>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <Button type="button" variant="link" className="h-auto p-0" onClick={onChangeEmail}>
          Use a different email
        </Button>
        <Button type="button" variant="link" className="h-auto p-0" onClick={sendAgain} disabled={resend.isPending}>
          {resend.isPending ? "Sending…" : "Send a new code"}
        </Button>
      </div>
    </form>
  )
}

const PasswordStep = ({ email, onDone, onExpired }: { email: string, onDone: () => void, onExpired: () => void }) => {
  const { mutate, isPending } = useResetPassword()
  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: newPasswordSchema,
    onSubmit: ({ password }, { setErrors }) => {
      mutate({ email, password }, {
        onSuccess: onDone,
        onError: (error) => {
          // The verified code only allows a reset for 10 minutes
          if (isApiError(error) && error.status === 403) {
            toast.error("That took a little too long. Please ask for a new code.")
            onExpired()
            return
          }
          setErrors({ password: error.message })
        },
      })
    },
  })

  return (
    <form noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
      <PasswordField label="New password" autoComplete="new-password" autoFocus {...textFieldProps(formik, "password")} disabled={isPending} />
      <PasswordField label="Confirm new password" autoComplete="new-password" {...textFieldProps(formik, "confirmPassword")} disabled={isPending} />
      <SubmitButton pending={isPending} pendingText="Saving…" className="w-full">Change password</SubmitButton>
    </form>
  )
}

/** Email → code → new password, using the API's emailed one-time code */
export const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const heading = HEADINGS[step]

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        {step === "done" && <CircleCheck className="mx-auto mb-2 size-10 text-hw-text-green-solid" aria-hidden />}
        <CardTitle className="text-2xl font-bold text-hw-grey-900">{heading.title}</CardTitle>
        <CardDescription>
          {step === "code" ? (
            <>
              If <span className="font-medium text-hw-grey-900">{email}</span> has an account, we&apos;ve emailed it a code. It expires in 10 minutes.
            </>
          ) : (
            heading.description
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "email" && (
          <EmailStep
            onSent={(address) => {
              setEmail(address)
              setStep("code")
            }}
          />
        )}
        {step === "code" && <CodeStep email={email} onVerified={() => setStep("password")} onChangeEmail={() => setStep("email")} />}
        {step === "password" && <PasswordStep email={email} onDone={() => setStep("done")} onExpired={() => setStep("email")} />}
        {step === "done" && (
          <Button size="lg" className="w-full" render={<Link href={ACCOUNT_ROUTES.login} />} nativeButton={false}>
            Sign in
          </Button>
        )}
      </CardContent>
      {step !== "done" && (
        <CardFooter className="justify-center text-sm">
          <span>
            Remembered it?{" "}
            <Link href={ACCOUNT_ROUTES.login} className="text-hw-primary">
              Back to login
            </Link>
          </span>
        </CardFooter>
      )}
    </Card>
  )
}
