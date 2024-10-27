import type { FC } from 'react'
import React from 'react'
import {
  Bars3Icon,
  PencilSquareIcon,
} from '@heroicons/react/24/solid'
import AppIcon from '@/app/components/base/app-icon'
export type IHeaderProps = {
  title: string
  avatarUrl?: string
  isMobile?: boolean
  onShowSideBar?: () => void
  onCreateNewChat?: () => void
}
const Header: FC<IHeaderProps> = ({
  title,
  avatarUrl,
}) => {
  return (
    <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
      <div className='flex items-center space-x-3'>
        {avatarUrl ? (
          <img src={avatarUrl} alt={title} className="w-10 h-10 rounded-full" />
        ) : (
          <AppIcon size="large" />
        )}
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
    </div>
  )
}

export default React.memo(Header)
