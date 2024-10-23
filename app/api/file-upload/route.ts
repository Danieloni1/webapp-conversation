import { type NextRequest } from 'next/server'
import { client, getInfo, getAppCredentials } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const { user } = getInfo(request)
    const shadow = formData.get('shadow')

    if (!shadow) {
      return new Response(JSON.stringify({ error: 'Missing shadow parameter' }), { status: 400 })
    }

    const { appId, apiKey } = getAppCredentials(shadow as string)
    formData.append('user', user)
    const res = await client.fileUpload(formData, appId, apiKey)
    return new Response(res.data.id as any)
  }
  catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}
