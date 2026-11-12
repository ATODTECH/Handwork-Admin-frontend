export type RewardKind = "CUSTOMER_DISCOUNT" | "ARTISAN_FEE_CUT"

/** AVAILABLE: ready; RESERVED: held for a booking being paid for; USED: spent */
export type RewardStatus = "AVAILABLE" | "RESERVED" | "USED"

/** From `GET /api/referrals/me` */
export interface MyReferrals {
  code: string
  role: "USER" | "ARTISAN"
  /** "5" */
  percent: string
  referrals: {
    id: number
    /** "Femi N." */
    name: string
    /** QUALIFIED once their first job was paid out */
    status: "SIGNED_UP" | "QUALIFIED"
    joined_at: string
    qualified_at: string | null
  }[]
  rewards: {
    id: number
    kind: RewardKind
    percent: string
    status: RewardStatus
    /** Who earned it for them */
    from: string
    booking_id: number | null
    earned_at: string
    used_at: string | null
  }[]
  /** Rewards ready to use */
  available: number
}
