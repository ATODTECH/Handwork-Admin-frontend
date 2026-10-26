import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/** Submit button that disables itself and shows a spinner while `pending`. */
const SubmitButton = ({
  pending,
  pendingText,
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & {
  pending?: boolean
  pendingText?: string
}) => (
  <Button type="submit" size="lg" disabled={pending || disabled} aria-busy={pending} {...props}>
    {pending && <Spinner data-icon="inline-start" />}
    {pending ? (pendingText ?? children) : children}
  </Button>
)

export default SubmitButton
