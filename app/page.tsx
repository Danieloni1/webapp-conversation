import type { FC } from 'react'
import React from 'react'

import Main from '@/app/components'
import type { IMainProps } from '@/app/components'

// Update the IMainProps interface
interface ExtendedMainProps extends IMainProps {
  searchParams: { app_id?: string; api_key?: string };
}

const App: FC<ExtendedMainProps> = ({
  params,
  searchParams,
}: {
  params: any;
  searchParams: { app_id?: string; api_key?: string };
}) => {
  return (
    <Main
      params={params}
      app_id={searchParams.app_id ?? ''}
      api_key={searchParams.api_key ?? ''}
    />
  )
}

export default React.memo(App)
