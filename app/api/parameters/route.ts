import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('app_id')
  const apiKey = searchParams.get('api_key')

  if (!appId || !apiKey) {
    return NextResponse.json({ error: 'Missing app_id or api_key' }, { status: 400 })
  }

  try {
    const { data } = await client.getApplicationParameters(user, appId, apiKey)
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  }
  catch (error) {
    return NextResponse.json({ error: 'Failed to fetch parameters' }, { status: 500 })
  }
}
