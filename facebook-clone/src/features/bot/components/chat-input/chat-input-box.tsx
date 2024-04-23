import { DebouncedInput } from '../debounce-input';
import { Message } from '../../types';
// import { sendMessage } from '../../api'
import { useAppSelector } from '../../../../store/hooks';
import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import fileIcons from '../../../../assets/attach-file.png';
import { Image } from 'antd';

interface ChatInputBoxProps {
  sendANewMessage: (message: Message) => void;
}
// init

export const ChatInputBox = ({ sendANewMessage }: ChatInputBoxProps) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [dataFile, setDataFile] = useState<any>(null);

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
        image : dataFile
      };
      axios
        .post('http://localhost:8000/messages-cra', data)
        .then((res: any) => {
          console.log(res);
          setNewMessage('');
          setDataFile(null)
        })
        .catch((error) => console.log(error));
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setDataFile(base64String);
        console.log(base64String, base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <div className="relative -bottom-10 ">
        <label htmlFor="fileMessage">
          {!dataFile && (
            <img src={fileIcons} className="w-4 h-4 cursor-pointer" alt="" />
          )}
        </label>
        <input
          onChange={(event: any) => {
            handleFileChange(event);
          }}
          type="file"
          name=""
          className="hidden"
          id="fileMessage"
        />
      </div>
      <div className="w-100 rounded-bl-xl rounded-br-xl py-3 overflow-hidden bg-white px-5">
        {dataFile && <Image className="!w-[100px] !h-[100px] mt-5" src={dataFile} />}
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
    </>
  );
};
