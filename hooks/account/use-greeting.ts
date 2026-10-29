import { useAccountProfile } from "@/hooks/site/use-auth"

const greeting = (hour: number) => (hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening")

/** "Good morning, Ada"; "Welcome back" until hydrated, so it never mismatches the server render */
export const useGreeting = () => {
  const profile = useAccountProfile()
  const firstName = profile?.name.split(" ")[0]
  return profile ? `${greeting(new Date().getHours())}${firstName ? `, ${firstName}` : ""}` : "Welcome back"
}
