import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, getAppCredentials } from '@/app/api/utils/common'

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
  const shadow = searchParams.get('shadow')

  if (!shadow) {
    return NextResponse.json({ error: 'Missing shadow parameter' }, { status: 400 })
  }

  const { appId, apiKey } = getAppCredentials(shadow)
  const { data } = await client.renameConversation(user, conversationId, name, appId, apiKey, auto_generate)
  return NextResponse.json(data)
}
