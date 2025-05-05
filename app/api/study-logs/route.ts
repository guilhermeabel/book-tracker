import { studyLogSchema } from '@/lib/validations/study-log'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Add this to ensure the route is properly configured
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  console.log('API route hit')
  
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Get the current user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Request body:', body)
    
    const validatedData = studyLogSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Log Supabase configuration
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase table check...')

    // First, check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('study_logs')
      .select('id')
      .limit(1)

    if (tableError) {
      console.error('Table check error:', tableError)
      return NextResponse.json(
        { error: 'Database table error', details: tableError.message },
        { status: 500 }
      )
    }

    console.log('Table exists, proceeding with insert...')

    const { data, error } = await supabase
      .from('study_logs')
      .insert({
        subject: validatedData.subject,
        description: validatedData.description,
        minutes: validatedData.minutes,
        group: validatedData.group,
        created_at: new Date().toISOString(),
        user_id: session.user.id,
      })
      .select()
      .single()

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: error.message, details: error.details },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Request error:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message, stack: error.stack },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
