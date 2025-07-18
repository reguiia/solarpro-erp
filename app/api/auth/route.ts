import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json()

    switch (action) {
      case 'signup':
        const { email, password, full_name, role } = data
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (authError) throw authError

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              id: authData.user.id,
              full_name,
              role: role || 'technician',
              language: 'en'
            })

          if (profileError) throw profileError
        }

        return NextResponse.json({ success: true, data: authData })

      case 'signin':
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })

        if (signInError) throw signInError

        return NextResponse.json({ success: true, data: signInData })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}