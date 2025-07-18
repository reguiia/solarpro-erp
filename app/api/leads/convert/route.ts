import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { leadId, customerData } = await request.json()

    // Start a transaction-like operation
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError) throw leadError

    // Create customer from lead
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert({
        name: customerData.name || lead.name,
        email: customerData.email || lead.email,
        phone: customerData.phone || lead.phone,
        company: customerData.company || lead.company,
        address: customerData.address || lead.address,
        customer_type: customerData.customer_type || 'residential',
        converted_from_lead: leadId,
        assigned_to: lead.assigned_to
      })
      .select()
      .single()

    if (customerError) throw customerError

    // Update lead status to converted
    const { error: updateError } = await supabase
      .from('leads')
      .update({ status: 'converted' })
      .eq('id', leadId)

    if (updateError) throw updateError

    return NextResponse.json({ data: customer })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}