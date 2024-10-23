import type { FC } from 'react'
import React from 'react'

import Main from '@/app/components'
import type { IMainProps } from '@/app/components'
import { getAppCredentials } from '@/app/api/utils/common'

// Update the IMainProps interface
interface ExtendedMainProps extends IMainProps {
  searchParams: { shadow?: string };
}

const App: FC<ExtendedMainProps> = ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: { shadow?: string };
}) => {
  const shadow = searchParams.shadow?.toLowerCase()
  // TODO: Replace to an actual fallback?
  const { appId, apiKey } = getAppCredentials(shadow ?? 'jim')
  return (
    <Main
      params={params}
      app_id={appId ?? ''}
      api_key={apiKey ?? ''}
      shadow={searchParams.shadow ?? ''}
    />
  )
}

export default React.memo(App)
