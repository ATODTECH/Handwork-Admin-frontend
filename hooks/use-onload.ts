import { Onload } from "@/api/onload";
import { useQuery } from "@tanstack/react-query";

/** Creates `Cookie` onload the page */
export const useOnload = () =>
  useQuery({
    queryKey: ["onload"],
    queryFn: Onload,
  })
