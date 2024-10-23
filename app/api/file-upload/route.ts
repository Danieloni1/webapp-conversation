import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const { user } = getInfo(request)
    const appId = formData.get('app_id')
    const apiKey = formData.get('api_key')

    if (!appId || !apiKey) {
      return new Response(JSON.stringify({ error: 'Missing app_id or api_key' }), { status: 400 })
    }

    formData.append('user', user)
    const res = await client.fileUpload(formData, appId as string, apiKey as string)
    return new Response(res.data.id as any)
  }
  catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}
