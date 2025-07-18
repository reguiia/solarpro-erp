import { supabase, UserProfile } from './supabase'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, fullName: string, role: UserProfile['role'] = 'technician') {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error

  if (data.user) {
    const { error: profileError } = await supabase.from('user_profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role,
      language: 'en',
    })
    if (profileError) throw profileError
  }

  return data
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (error) throw error;
  return data;
}

export function hasRole(userRole: string | undefined, requiredRoles: string[]): boolean {
  return !!userRole && requiredRoles.includes(userRole)
}

export function isAdmin(userRole: string | undefined): boolean {
  return hasRole(userRole, ['admin'])
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
