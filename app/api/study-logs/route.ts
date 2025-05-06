import { studyLogSchema } from '@/lib/validations/study-log'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Add this to ensure the route is properly configured
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate the request body
    const validatedData = studyLogSchema.parse(body)

    // Insert the study log
    const { data, error } = await supabase
      .from('study_logs')
      .insert({
        user_id: session.user.id,
        subject: validatedData.subject,
        description: validatedData.description,
        minutes: validatedData.minutes,
        group_id: validatedData.group || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating study log:', error)
      return NextResponse.json(
        { error: 'Failed to create study log' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in study log creation:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get the current user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('group_id')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    // Build the query
    let query = supabase
      .from('study_logs')
      .select('*, user:users(name, avatar_url)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    // Add group filter if specified
    if (groupId) {
      query = query.eq('group_id', groupId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching study logs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch study logs' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in study log fetch:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
