import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface UserProfile {
  id: string
  role: 'admin' | 'manager' | 'technician' | 'sales_rep'
  full_name: string
  phone?: string
  department?: string
  language: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  source_id?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost'
  priority: 'low' | 'medium' | 'high'
  notes?: string
  assigned_to?: string
  created_at: string
  updated_at: string
  lead_sources?: {
    name: string
  }
  user_profiles?: {
    full_name: string
  }
  tags?: {
    id: string
    name: string
    color: string
  }[]
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  address?: string
  tax_id?: string
  customer_type: 'residential' | 'commercial' | 'industrial'
  converted_from_lead?: string
  assigned_to?: string
  created_at: string
  updated_at: string
  user_profiles?: {
    full_name: string
  }
}

export interface Project {
  id: string
  name: string
  description?: string
  customer_id: string
  project_type_id: string
  status: 'planning' | 'design' | 'approval' | 'procurement' | 'installation' | 'commissioning' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  start_date?: string
  end_date?: string
  budget_amount?: number
  actual_cost?: number
  project_manager?: string
  created_by: string
  created_at: string
  updated_at: string
  customers?: {
    name: string
    customer_type: string
  }
  project_types?: {
    name: string
    category: string
  }
  user_profiles?: {
    full_name: string
  }
}

export interface Task {
  id: string
  title: string
  description?: string
  project_id: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  start_date?: string
  due_date?: string
  estimated_hours?: number
  actual_hours?: number
  assigned_to?: string
  created_by: string
  created_at: string
  updated_at: string
  projects?: {
    name: string
  }
  user_profiles?: {
    full_name: string
  }
}

export interface Communication {
  id: string
  lead_id?: string
  customer_id?: string
  type: 'email' | 'phone' | 'meeting' | 'note'
  subject: string
  content: string
  status: 'sent' | 'received' | 'scheduled' | 'completed'
  created_by: string
  created_at: string
  updated_at: string
  user_profiles?: {
    full_name: string
  }
}

export interface FollowUpTask {
  id: string
  title: string
  description?: string
  lead_id?: string
  customer_id?: string
  assigned_to: string
  due_date?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  created_by: string
  created_at: string
  updated_at: string
  user_profiles?: {
    full_name: string
  }
}

export interface Tag {
  id: string
  name: string
  color: string
  description?: string
  created_at: string
  updated_at: string
}