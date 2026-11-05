"use client"

import { useState } from "react"
import { toast } from "sonner"
import SubmitButton from "@/components/form/submit-button"
import { useRequestResetCode } from "@/hooks/site/use-password-reset"
import { CodeStep, PasswordStep } from "@/modules/site/auth/forgot-password"

type Step = "start" | "code" | "password"

/** Changing the password uses the same emailed code as Forgot password */
const PasswordSection = ({ email }: { email: string }) => {
  const [step, setStep] = useState<Step>("start")
  const { mutate: requestCode, isPending } = useRequestResetCode()

  if (step === "code") {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-hw-grey-700">We&apos;ve emailed a 6-digit code to {email}. It expires in 10 minutes.</p>
        <CodeStep email={email} onVerified={() => setStep("password")} onChangeEmail={() => setStep("start")} changeEmailLabel="Cancel" />
      </div>
    )
  }

  if (step === "password") {
    return (
      <PasswordStep
        email={email}
        onDone={() => {
          setStep("start")
          toast.success("Your password has been changed.")
        }}
        onExpired={() => setStep("start")}
      />
    )
  }

  return (
    <form
      className="flex flex-wrap items-center justify-between gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        requestCode(email, { onSuccess: () => setStep("code") })
      }}
    >
      <p className="max-w-md text-sm text-hw-grey-700">We&apos;ll email a code to {email} to confirm it&apos;s you.</p>
      <SubmitButton variant="outline" pending={isPending} pendingText="Sending code…">Change password</SubmitButton>
    </form>
  )
}

export default PasswordSection
