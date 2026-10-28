/** Handwork Expert only operates in Nigeria for now */
export const COUNTRY = "Nigeria"

/** The 36 states plus the FCT, as stored in `User.state` */
export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
  "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const

/** "Ikeja, Lagos", or null when neither is set */
export const formatLocation = ({ city, state }: { city?: string | null, state?: string | null }) =>
  [city, state].filter(Boolean).join(", ") || null
