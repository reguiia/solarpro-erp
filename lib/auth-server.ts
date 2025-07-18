// lib/auth-server.ts

import { createServerClient } from '@supabase/ssr'
import { Database } from './supabase' // Adjust this path if needed

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']

// Create a server-side Supabase client
export const createServerSupabaseClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  )
}

// Auth functions
export async function signIn(email: string, password: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, fullName: string, role: UserProfile['role'] = 'technician') {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  if (data.user) {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        full_name: fullName,
        role,
        language: 'en'
      })
    if (profileError) throw profileError
  }

  return data
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// User functions
export async function getCurrentUser() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

export async function updateUserProfile(updates: Partial<UserProfile>) {
  const supabase = createServerSupabaseClient()
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Role helpers
export function hasRole(userRole: string | undefined, requiredRoles: string[]): boolean {
  return !!userRole && requiredRoles.includes(userRole)
}

export function isAdmin(userRole: string | undefined): boolean {
  return hasRole(userRole, ['admin'])
}

export function isManager(userRole: string | undefined): boolean {
  return hasRole(userRole, ['admin', 'manager'])
}

// Get user role from request (for middleware or server components)
export async function getUserRoleFromRequest(): Promise<string | null> {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error) return null
  return profile.role
}
