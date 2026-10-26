import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { COUNTRIESType, FieldConfig } from "@/types/site/register";
import { cn } from "cn";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import FieldSelect from "./field-select";
import { Button } from "@/components/ui/button";


const FieldShell = ({
  config,
  value,
  focused,
  error,
  touched,
  isPending,
  autoComplete,
  isCheckboxCont,
  isIconRight,
  className,
  selectValue,
  selectedCountry,
  forgotPassword,
  onFocus,
  onBlur,
  onChange,
  onValueChange,
  onCheckedChanged,
}: {
  config: FieldConfig
  value: string | boolean | number
  focused: boolean
  error?: string
  touched?: boolean
  isPending: boolean
  autoComplete?: string
  isCheckboxCont?: React.ReactNode
  isIconRight?: React.ReactNode
  className?: string
  selectValue?: string
  selectedCountry?: Pick<COUNTRIESType, "dial" | "flag">
  forgotPassword?: (val: string) => void
  onFocus: () => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string | null) => void
  onCheckedChanged?: (value: boolean | "indeterminate") => void
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // const active = focused || value.length > 0;
  const inputType = showPassword ? "text" : config.type
  const isCheckbox = config.type === "checkbox";
  const vetValue = value as string | number;
  const showError = touched && !!error;

  return (
    <Field data-invalid={showError} orientation={isCheckbox?"horizontal": "vertical"}>
      {config.label && (
        <FieldLabel
          htmlFor={config.name}
          className={"font-semibold max-w-fit text-hw-grey-text-900"}
        >{config.label}</FieldLabel>
      )}
      <div className="relative flex">
        {isCheckbox ? (
          <>
            <Checkbox
              id={config.name}
              checked={!!value}
              onCheckedChange={onCheckedChanged}
              disabled={isPending}
              aria-invalid={showError}
              className={"mt-0.5"}
              required
            />
            {isCheckboxCont??<></>}
          </>
        ) : (
            <>
              {(config.name === "phone" && onValueChange) && (
                <FieldSelect
                  value={selectValue as string}
                  onValueChange={onValueChange}
                  selectedCountry={selectedCountry!}
                  isPending={isPending}
                />
              )}
              <Input
                id={config.name}
                name={config.name}
                type={inputType ?? "text"}
                value={vetValue}
                placeholder={config.placeholder ?? config.label ?? config.name}
                autoComplete={autoComplete}
                disabled={isPending}
                aria-invalid={showError}
                className={cn(config.name==="phone"? "pl-24": "pl-2", isIconRight||config.name==="password"? "pr-10": "pr-2", "py-5 text-hw-grey-text-900 text-[13px] xl:text-sm", className)}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                required
              />
              {(config.name==="password") ? (
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              ) : ( isIconRight )}
            </>
          )
        }
      </div>
      {showError && (
        <FieldError id={`${config.name}-id`} errors={[{message: error}]} className="text-xs xl:text-[13px]" />
      )}
      {(forgotPassword && (config.name==="password")) && (
        <button type="button" onClick={()=> forgotPassword("active")} className="flex text-sm max-w-fit font-medium text-hw-primary">
          Forgot Password
        </button>
      )}
    </Field>
  )
}

export default FieldShell