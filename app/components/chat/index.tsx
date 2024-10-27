'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import Answer from './answer'
import Question from './question'
import type { FeedbackFunc } from './type'
import type { ChatItem, VisionFile, VisionSettings } from '@/types/app'
import { TransferMethod } from '@/types/app'
import Toast from '@/app/components/base/toast'
import ChatImageUploader from '@/app/components/base/image-uploader/chat-image-uploader'
import ImageList from '@/app/components/base/image-uploader/image-list'
import { useImageFiles } from '@/app/components/base/image-uploader/hooks'

export type IChatProps = {
  chatList: ChatItem[]
  /**
   * Whether to display the editing area and rating status
   */
  feedbackDisabled?: boolean
  /**
   * Whether to display the input area
   */
  isHideSendInput?: boolean
  onFeedback?: FeedbackFunc
  checkCanSend?: () => boolean
  onSend?: (message: string, files: VisionFile[]) => void
  useCurrentUserAvatar?: boolean
  isResponding?: boolean
  controlClearQuery?: number
  visionConfig?: VisionSettings
  avatarUrl?: string
}

const Chat: FC<IChatProps> = ({
  chatList,
  feedbackDisabled = false,
  isHideSendInput = false,
  onFeedback,
  checkCanSend,
  onSend = () => { },
  useCurrentUserAvatar,
  isResponding,
  controlClearQuery,
  visionConfig,
  avatarUrl,
}) => {
  const { t } = useTranslation()
  const { notify } = Toast
  const isUseInputMethod = useRef(false)

  const [query, setQuery] = React.useState('')
  const [showHints, setShowHints] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const hints = [
    "How do you work?",
    "What's your expertise and use cases?",
    "What if I want to pause you?",
    "Show me an example use case you can do."
  ];

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (showHints && value.trim() !== '') {
      setShowHints(false);
    }
  };

  const logError = (message: string) => {
    notify({ type: 'error', message, duration: 3000 })
  }

  const valid = () => {
    if (!query || query.trim() === '') {
      logError('Message cannot be empty')
      return false
    }
    return true
  }

  useEffect(() => {
    if (controlClearQuery)
      setQuery('')
  }, [controlClearQuery])
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()

  const handleSend = () => {
    if (!valid() || (checkCanSend && !checkCanSend()))
      return
    onSend(query, files.filter(file => file.progress !== -1).map(fileItem => ({
      type: 'image',
      transfer_method: fileItem.type,
      url: fileItem.url,
      upload_file_id: fileItem.fileId,
    })))
    if (!files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
      if (files.length)
        onClear()
      if (!isResponding)
        setQuery('')
    }
  }

  const handleKeyUp = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault()
      // prevent send message when using input method enter
      if (!e.shiftKey && !isUseInputMethod.current)
        handleSend()
    }
  }

  const handleKeyDown = (e: any) => {
    isUseInputMethod.current = e.nativeEvent.isComposing
    if (e.code === 'Enter' && !e.shiftKey) {
      setQuery(query.replace(/\n$/, ''))
      e.preventDefault()
    }
  }

  const handleHintClick = (hint: string) => {
    setShowHints(false);
    onSend(hint, []);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatList, showHints]);

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Chat List */}
      <div className="flex-grow overflow-y-auto py-6 space-y-6" ref={chatContainerRef}>
        {chatList.map((item) => (
          <div key={item.id} className="mb-6">
            {item.isAnswer ? (
              <Answer
                item={item}
                feedbackDisabled={feedbackDisabled}
                onFeedback={onFeedback}
                isResponding={isResponding && item.id === chatList[chatList.length - 1].id}
                avatarUrl={avatarUrl}
              />
            ) : (
              <Question
                id={item.id}
                content={item.content}
                useCurrentUserAvatar={useCurrentUserAvatar}
                imgSrcs={(item.message_files && item.message_files?.length > 0) ? item.message_files.map(item => item.url) : []}
              />
            )}
          </div>
        ))}

        {/* Hints */}
        {showHints && (
          <div className="grid grid-cols-2 gap-4 mt-4 mx-8">
            {hints.map((hint, index) => (
              <button
                key={index}
                className="p-3 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                onClick={() => handleHintClick(hint)}
              >
                {hint}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Footer (Input Bar) */}
      {!isHideSendInput && (
        <div className="flex-shrink-0 bg-white border-t border-gray-200">
          <div className='p-4'>
            <div className='flex items-center space-x-2'>
              {visionConfig?.enabled && (
                <ChatImageUploader
                  settings={visionConfig}
                  onUpload={onUpload}
                  disabled={files.length >= visionConfig.number_limits}
                />
              )}
              <input
                type='text'
                className='flex-grow p-2 pl-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
                placeholder='Talk to me...'
                value={query}
                onChange={handleContentChange}
                onKeyUp={handleKeyUp}
                onKeyDown={handleKeyDown}
              />
              <button
                className='w-10 h-10 flex items-center justify-center text-white bg-indigo-600 rounded-full hover:bg-indigo-700'
                onClick={() => setShowHints(!showHints)}
              >
                ?
              </button>
              <button
                className='p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700'
                onClick={handleSend}
              >
                Submit
              </button>
            </div>
            {visionConfig?.enabled && (
              <ImageList
                list={files}
                onRemove={onRemove}
                onReUpload={onReUpload}
                onImageLinkLoadSuccess={onImageLinkLoadSuccess}
                onImageLinkLoadError={onImageLinkLoadError}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default React.memo(Chat)
