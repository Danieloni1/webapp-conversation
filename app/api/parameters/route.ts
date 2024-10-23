import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession, getAppCredentials } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const { searchParams } = new URL(request.url)
  const shadow = searchParams.get('shadow')

  if (!shadow) {
    return NextResponse.json({ error: 'Missing shadow parameter' }, { status: 400 })
  }

  try {
    const { appId, apiKey } = getAppCredentials(shadow)
    const { data } = await client.getApplicationParameters(user, appId, apiKey)
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  }
  catch (error) {
    return NextResponse.json({ error: 'Failed to fetch parameters' }, { status: 500 })
  }
}
