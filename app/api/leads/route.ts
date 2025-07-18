import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const assigned_to = searchParams.get('assigned_to')

    let query = supabase
      .from('leads')
      .select(`
        *,
        lead_sources (name),
        user_profiles (full_name),
        lead_tags (
          tags (id, name, color)
        )
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (priority && priority !== 'all') {
      query = query.eq('priority', priority)
    }

    if (assigned_to) {
      query = query.eq('assigned_to', assigned_to)
    }

    const { data, error } = await query

    if (error) throw error

    // Transform the data to flatten tags
    const transformedLeads = data.map(lead => ({
      ...lead,
      tags: lead.lead_tags?.map((lt: any) => lt.tags) || []
    }))

    return NextResponse.json({ data: transformedLeads })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()

    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}