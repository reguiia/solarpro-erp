import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserRoleFromRequest } from '@/lib/auth-server';

// Define valid table keys and ensure type safety for dynamic access
const TABLES = {
  role: 'roles',
  permission: 'permissions',
  workflow: 'workflows',
  form: 'forms',
  language: 'languages',
} as const;

// Create a type for valid table keys
type TableKey = keyof typeof TABLES;

export async function GET(request: NextRequest) {
  const role = await getUserRoleFromRequest();
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Ensure `type` is one of the valid keys
    if (!type || !isTableKey(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(TABLES[type])
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const role = await getUserRoleFromRequest();
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { type, ...entity } = body;

    // Ensure `type` is one of the valid keys
    if (!type || !isTableKey(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(TABLES[type])
      .insert(entity)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to narrow the type
function isTableKey(key: string): key is TableKey {
  return Object.keys(TABLES).includes(key);
}
