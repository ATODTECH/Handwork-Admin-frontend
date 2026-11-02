import { useMutation } from "@tanstack/react-query"
import { requestResetCodeMutation, resetPasswordMutation, verifyResetCodeMutation } from "@/services/site/auth"

/** Emails a reset code; errors show as a toast */
export const useRequestResetCode = () => useMutation(requestResetCodeMutation())

/** Errors show under the code field */
export const useVerifyResetCode = () => useMutation({ ...verifyResetCodeMutation(), meta: { silentError: true } })

/** Errors show under the password field */
export const useResetPassword = () => useMutation({ ...resetPasswordMutation(), meta: { silentError: true } })
