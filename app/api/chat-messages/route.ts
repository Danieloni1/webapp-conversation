import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    response_mode: responseMode,
  } = body
  const { user } = getInfo(request)

  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('app_id')
  const apiKey = searchParams.get('api_key')

  if (!appId || !apiKey) {
    return new Response(JSON.stringify({ error: 'Missing app_id or api_key' }), { status: 400 })
  }

  const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files, appId, apiKey)
  return new Response(res.data as any)
}
