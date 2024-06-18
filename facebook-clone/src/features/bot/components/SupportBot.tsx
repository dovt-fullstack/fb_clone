import React, { useState } from 'react';
import { Message } from '../types';
import { ChatHeader } from './chat-header';
import { ChatContent } from './chat-content';
import { ChatInputBox } from './chat-input';

type SupportBotProps = {
  showDrawer: () => void;
  showDrawerChat?: () => void;
};

export const SupportBot = ({ showDrawer, showDrawerChat }: SupportBotProps) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const sendANewMessage = (message: Message) => {
    setChatMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className='rounded-xl fixed bottom-4 shadow border border-gray-100 z-[10000] right-20 w-full max-w-lg h-full max-h-[80vh] flex flex-col bg-white'>
      <ChatHeader name={'Nhắn tin '} numberOfMessages={chatMessages.length} showDrawer={showDrawer} showDrawerChat={showDrawerChat}/>
      <ChatContent messages={chatMessages}  />
      <ChatInputBox sendANewMessage={sendANewMessage} />
    </div>
  );
};
