export type Database = {
  public: {
    Tables: {
      communes: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          city: string | null
          created_at: string
        }
      }
      members: {
        Row: {
          id: string
          commune_id: string
          user_id: string
          created_at: string
        }
      }
      events: {
        Row: {
          id: string
          commune_id: string
          title: string
          description: string | null
          event_date: string
          location: string | null
          created_at: string
        }
      }
    }
  }
}

type CommuneRow = Database['public']['Tables']['communes']['Row']
export type CommuneWithMemberCount = CommuneRow & { member_count: number }
