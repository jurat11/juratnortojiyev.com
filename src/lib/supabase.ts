import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qxaojjjbzvbhqcnwxrpg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4YW9qampienZiaHFjbnd4cnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzI3MzQsImV4cCI6MjA3MjIwODczNH0._GtUD7v9B5HxEHNY8f_r-ChGaShwiE7lUEEU4QBTKvM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Experience {
  id: number
  period: string
  company: string
  job_title: string
  description: string | null
  link: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: number
  title: string
  description: string
  image: string
  skills: string
  github: string | null
  live: string | null
  display_order: number
  created_at: string
  updated_at: string
}
