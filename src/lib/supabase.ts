import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kqvczkrzrrwnwnkvygfl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxdmN6a3J6cnJ3bndua3Z5Z2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMjA3OTQsImV4cCI6MjA3NTc5Njc5NH0.n408Y0DCT8q26GCthBr1sGG3nDcilwZNon-6UnwXwDM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)