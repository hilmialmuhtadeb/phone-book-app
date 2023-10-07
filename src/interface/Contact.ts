export interface Contact {
  first_name: string
  last_name: string
  id: string
  phones: {
    number: string
  }[]
  created_at?: string
}