import { Database } from '@/lib/types'

type CommuneRow = Database['public']['Tables']['communes']['Row']

export type CommuneQueryRow = CommuneRow & { members: [{ count: number }] }
export type CommuneWithMemberCount = CommuneRow & { member_count: number }

export function parseCommuneWithMemberCount(row: CommuneQueryRow): CommuneWithMemberCount {
  const { members, ...commune } = row
  return { ...commune, member_count: members[0]?.count ?? 0 }
}
