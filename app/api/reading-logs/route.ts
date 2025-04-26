import { supabase } from '@/lib/supabase'
import { readingLogSchema } from '@/lib/validations/reading-log'
import { NextResponse } from 'next/server'

// Add this to ensure the route is properly configured
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  console.log('API route hit')
  
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const body = await request.json()
    console.log('Request body:', body)
    
    const validatedData = readingLogSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Log Supabase configuration
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase table check...')

    // First, check if the table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('reading_logs')
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
      .from('reading_logs')
      .insert({
        book_title: validatedData.bookTitle,
        description: validatedData.description,
        minutes: validatedData.minutes,
        group: validatedData.group,
        created_at: new Date().toISOString(),
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
