import { ChatContent } from './chat-content'
import { ChatHeader } from './chat-header'
import { ChatInputBox } from './chat-input'
import { Message } from '../types'
import React,{ useState } from 'react'
import ReactDOM from 'react-dom'
type SupportBotProps = {
  showDrawer: () => void,
  showDrawerChat? : () => void,
}

export const SupportBot = ({ showDrawer ,showDrawerChat }: SupportBotProps) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  if (typeof document === 'undefined') return <div></div>
  const bodyElement = document.querySelector('#root')
  if (!bodyElement) {
    return null
  }
  const sendANewMessage = (message: Message) => {
    setChatMessages((prevMessages) => [...prevMessages, message])
  }

  return ReactDOM.createPortal(
    <div className='rounded-xl fixed bottom-4 shadow border border-gray-100 z-[10000] right-20 w-full max-w-lg h-full max-h-[80vh] flex flex-col bg-white'>
      <ChatHeader name={'Nhắn tin '} numberOfMessages={chatMessages.length} showDrawer={showDrawer} showDrawerChat={showDrawerChat}/>
      <ChatContent messages={chatMessages} />
      <ChatInputBox sendANewMessage={sendANewMessage} />
    </div>,
    bodyElement
  )
}
