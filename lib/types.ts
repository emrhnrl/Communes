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
    }
  }
}
