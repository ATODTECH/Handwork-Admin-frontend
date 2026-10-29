/**
 * Paystack's pop-up checkout (InlineJS v2). The API starts each transaction with the secret key and
 * returns its `access_code`; the pop-up only resumes it, so the web needs no Paystack key and the
 * amount can't be changed in the browser.
 */

const SCRIPT_URL = "https://js.paystack.co/v2/inline.js"

interface PaystackTransaction {
  reference: string
}

interface PaystackCallbacks {
  onSuccess: (transaction: PaystackTransaction) => void
  onCancel: () => void
  onError?: (error: { message?: string }) => void
}

interface PaystackPopup {
  resumeTransaction: (accessCode: string, callbacks: PaystackCallbacks) => void
}

declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopup
  }
}

let loading: Promise<void> | null = null

const loadScript = () => {
  if (window.PaystackPop) return Promise.resolve()
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      loading = null
      script.remove()
      reject(new Error("Couldn't load Paystack"))
    }
    document.head.appendChild(script)
  })
  return loading
}

export type PopupResult = { status: "success", reference: string } | { status: "cancelled" }

/** Opens the pop-up for a transaction the API started; resolves when the customer pays or closes it */
export const openPaystackPopup = async (accessCode: string): Promise<PopupResult> => {
  await loadScript()
  if (!window.PaystackPop) throw new Error("Couldn't load Paystack")
  const popup = new window.PaystackPop()

  return new Promise((resolve, reject) => {
    popup.resumeTransaction(accessCode, {
      onSuccess: ({ reference }) => resolve({ status: "success", reference }),
      onCancel: () => resolve({ status: "cancelled" }),
      onError: (error) => reject(new Error(error?.message || "Paystack couldn't start the payment")),
    })
  })
}

/** Only ever leave the site for Paystack's own checkout (the fallback when the pop-up can't load) */
export const isPaystackCheckout = (url: string) => {
  try {
    const { protocol, hostname } = new URL(url)
    return protocol === "https:" && (hostname === "paystack.com" || hostname.endsWith(".paystack.com"))
  } catch {
    return false
  }
}
