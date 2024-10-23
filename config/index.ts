import type { AppInfo } from '@/types/app'

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`

// Update APP_ID and API_KEY to use values from props
export let APP_ID = ''
export let API_KEY = ''

export const setAppCredentials = (appId: string, apiKey: string) => {
  console.log(`Updating APP_ID from '${APP_ID}' to '${appId}'`);
  console.log(`Updating API_KEY from '${API_KEY}' to '${apiKey}'`);
  APP_ID = appId
  API_KEY = apiKey
}

export const APP_INFO: AppInfo = {
  title: 'Chat APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'en',
}

export const isShowPrompt = false
export const promptTemplate = 'I want you to act as a javascript console.'

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
