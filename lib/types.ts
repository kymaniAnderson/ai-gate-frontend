export interface Visitor {
  id: string
  name: string
  location: string
  validFrom: string
  validTo?: string
  validTimeFrom: string
  validTimeTo?: string
  usageLimit?: number
  usageCount: number
  status: "active" | "expired" | "revoked" | "pending"
  pin: string
}

