import { Onload } from "@/api/onload";
import { useQuery } from "@tanstack/react-query";

/** Creates `Cookie` onload the contact us page */
export const useOnload = () =>
  useQuery({
    queryKey: ["onload"],
    queryFn: Onload,
  })
