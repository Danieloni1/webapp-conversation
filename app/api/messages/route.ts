import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversation_id')
  const appId = searchParams.get('app_id')
  const apiKey = searchParams.get('api_key')

  if (!appId || !apiKey) {
    return NextResponse.json({ error: 'Missing app_id or api_key' }, { status: 400 })
  }

  const { data }: any = await client.getConversationMessages(user, conversationId as string, appId, apiKey)
  return NextResponse.json(data, {
    headers: setSession(sessionId),
  })
}
