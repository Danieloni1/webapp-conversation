import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest, { params }: {
  params: { conversationId: string }
}) {
  const body = await request.json()
  const {
    auto_generate,
    name,
  } = body
  const { conversationId } = params
  const { user } = getInfo(request)

  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('app_id')
  const apiKey = searchParams.get('api_key')

  if (!appId || !apiKey) {
    return NextResponse.json({ error: 'Missing app_id or api_key' }, { status: 400 })
  }

  const { data } = await client.renameConversation(user, conversationId, name, appId, apiKey, auto_generate)
  return NextResponse.json(data)
}
