import { DebouncedInput } from '../debounce-input';
import { Message } from '../../types';
// import { sendMessage } from '../../api'
import { useAppSelector } from '../../../../store/hooks';
import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

interface ChatInputBoxProps {
  sendANewMessage: (message: Message) => void;
}
// init

export const ChatInputBox = ({ sendANewMessage }: ChatInputBoxProps) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [queryParameters] = useSearchParams();
  const dataPageQuery: any = queryParameters.get('chat');
  // const dispatch = useDispatch()
  const { user: userInfo } = useAppSelector(
    (state) => state.persistedReducer.auth
  );

  const doSendMessage = async () => {
    if (newMessage && newMessage.length > 0) {
      const data = {
        senderId: userInfo._id,
        receiverId: dataPageQuery,
        content: newMessage,
      };
      axios
        .post('http://localhost:8000/messages-cra', data)
        .then((res: any) => {
          console.log(res);
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="w-100 rounded-bl-xl rounded-br-xl py-3 overflow-hidden bg-white px-5">
      <div className="flex flex-row items-center space-x-5">
        <DebouncedInput
          value={newMessage ?? ''}
          placeholder="Nội dung tin nhắn"
          debounce={100}
          onChange={(value) => setNewMessage(String(value))}
        />
        <button
          type="button"
          disabled={!newMessage || newMessage.length === 0}
          className="hover:bg-[#D3B673] focus:ring-4 focus:outline-none focus:ring-purple-300 disabled:opacity-50 px-3 py-2 text-xs font-medium text-center text-white bg-[#D3B673] rounded-lg"
          onClick={() => doSendMessage()}
        >
          Send
        </button>
      </div>
    </div>
  );
};
