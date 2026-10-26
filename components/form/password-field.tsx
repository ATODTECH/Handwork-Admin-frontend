"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { InputGroupButton } from "@/components/ui/input-group"
import FormField, { FormFieldProps } from "./form-field"

/** FormField with a show/hide password toggle. */
const PasswordField = (props: Omit<FormFieldProps, "type" | "endAddon">) => {
  const [visible, setVisible] = useState(false)

  return (
    <FormField
      {...props}
      type={visible ? "text" : "password"}
      endAddon={
        <InputGroupButton
          size="icon-xs"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          disabled={props.disabled}
        >
          {visible ? <EyeOff /> : <Eye />}
        </InputGroupButton>
      }
    />
  )
}

export default PasswordField
