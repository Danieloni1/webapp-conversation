import { type NextRequest } from 'next/server'
import { ChatClient } from 'dify-client'
import { v4 } from 'uuid'
import { API_URL } from '@/config'

const userPrefix = 'user_'

export const getInfo = (request: NextRequest) => {
  const sessionId = request.cookies.get('session_id')?.value || v4()
  const user = userPrefix + sessionId
  return {
    sessionId,
    user,
  }
}

export const setSession = (sessionId: string) => {
  return { 'Set-Cookie': `session_id=${sessionId}` }
}

class DynamicChatClient {
  private clients: Map<string, InstanceType<typeof ChatClient>> = new Map()

  getClient(appId: string, apiKey: string): InstanceType<typeof ChatClient> {
    const clientKey = `${appId}:${apiKey}`
    if (!this.clients.has(clientKey)) {
      this.clients.set(clientKey, new ChatClient(apiKey, API_URL || undefined))
    }
    return this.clients.get(clientKey)!
  }

  async getConversationMessages(user: string, conversationId: string, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).getConversationMessages(user, conversationId)
  }

  async getApplicationParameters(user: string, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).getApplicationParameters(user)
  }

  async createChatMessage(inputs: any, query: string, user: string, responseMode: string, conversationId: string, files: any, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).createChatMessage(inputs, query, user, responseMode, conversationId, files)
  }

  async fileUpload(formData: FormData, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).fileUpload(formData)
  }

  async getConversations(user: string, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).getConversations(user)
  }

  async renameConversation(user: string, conversationId: string, newName: string, appId: string, apiKey: string, autoGenerate: boolean) {
    return this.getClient(appId, apiKey).renameConversation(conversationId, newName, user, autoGenerate)
  }

  async deleteConversation(user: string, conversationId: string, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).deleteConversation(user, conversationId)
  }

  async getConversation(user: string, conversationId: string, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).getConversation(user, conversationId)
  }

  async generateConversationName(user: string, conversationId: string, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).generateConversationName(user, conversationId)
  }

  async createCompletionMessage(inputs: any, query: string, user: string, appId: string, apiKey: string) {
    return this.getClient(appId, apiKey).createCompletionMessage(inputs, query, user)
  }
}

export const client = new DynamicChatClient()

export function getAppCredentials(shadow: string) {
  switch (shadow.toLowerCase()) {
    case 'tom':
      return {
        appId: process.env.NEXT_PUBLIC_TOM_APP_ID || '',
        apiKey: process.env.NEXT_PUBLIC_TOM_APP_KEY || '',
      };
    case 'abby':
      return {
        appId: process.env.NEXT_PUBLIC_ABBY_APP_ID || '',
        apiKey: process.env.NEXT_PUBLIC_ABBY_APP_KEY || '',
      };
    case 'jim':
      return {
        appId: process.env.NEXT_PUBLIC_JIM_APP_ID || '',
        apiKey: process.env.NEXT_PUBLIC_JIM_APP_KEY || '',
      };
    default:
      return { appId: '', apiKey: '' }
  }
}
