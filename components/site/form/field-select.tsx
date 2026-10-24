import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/schema/validation-site";
import { COUNTRIESType } from "@/types/site/register";


const FieldSelect = ({
  value,
  isPending,
  selectedCountry,
  onValueChange,
}: {
  value: string
  isPending: boolean
  selectedCountry: Pick<COUNTRIESType, "dial" | "flag">
  onValueChange: (value: string | null) => void
}) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={isPending}
    >
      <SelectTrigger
        aria-label="Country code"
        className="h-full max-h-full shrink-0 gap-1 rounded-none border-0 absolute inset-y-0 left-0 px-2 text-xs py-5 shadow-none focus:ring-0 focus:ring-offset-0"
      >
        <SelectValue>
          <span className="flex items-center gap-1 text-primary-text">
            <span className="text-base leading-none mb-1">{selectedCountry.flag}</span>
            <span className="text-muted-foreground">{selectedCountry.dial}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {COUNTRIES.map((c) => (
            <SelectItem key={c.code} value={c.dial}>
              <span className="flex items-center gap-2">
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="text-muted-foreground">{c.dial}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default FieldSelect