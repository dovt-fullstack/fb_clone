import { DebouncedInput } from '../debounce-input';
import { Message } from '../../types';
import { useAppSelector } from '../../../../store/hooks';
import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import fileIcons from '../../../../assets/attach-file.png';
import { Image } from 'antd';
import pica from 'pica';

interface ChatInputBoxProps {
  sendANewMessage: (message: Message) => void;
}

export const ChatInputBox = ({ sendANewMessage }: ChatInputBoxProps) => {
  const [newMessage, setNewMessage] = useState<string>('');
  const [dataFile, setDataFile] = useState<string | null>(null);

  const [queryParameters] = useSearchParams();
  const dataPageQuery: any = queryParameters.get('chat');

  const { user: userInfo } = useAppSelector(
    (state) => state.persistedReducer.auth
  );

  const doSendMessage = async () => {
    if (newMessage || dataFile) {
      const data = {
        senderId: userInfo._id,
        receiverId: dataPageQuery,
        content: newMessage,
        image: dataFile
      };

      try {
        const res = await axios.post('http://localhost:8000/messages-cra', data);
        console.log(res);
        setNewMessage('');
        setDataFile(null);
        sendANewMessage(res.data); // Gửi tin nhắn mới lên component cha để cập nhật
      } catch (error) {
        console.log(error);
      }
    }
  };

  const resizeImage = async (file: File) => {
    const picaInstance = pica();
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const maxDimension = 800;
    
    const aspectRatio = imageBitmap.width / imageBitmap.height;
    if (aspectRatio > 1) {
      canvas.width = maxDimension;
      canvas.height = maxDimension / aspectRatio;
    } else {
      canvas.height = maxDimension;
      canvas.width = maxDimension * aspectRatio;
    }
    
    await picaInstance.resize(imageBitmap, canvas);
    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob!);
      }, 'image/jpeg');
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const resizedBase64String = await resizeImage(file);
        setDataFile(resizedBase64String);
      } catch (error) {
        console.error('Error resizing image', error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      doSendMessage();
    }
  };
  
  return (
    <>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <input
          style={{ display: 'none' }}
          onChange={handleFileChange}
          type="file"
          id="fileMessage"
        />
        {!dataFile && (
          <label htmlFor="fileMessage" style={{ cursor: 'pointer' }}>
            <img
              src={fileIcons}
              className="w-4 h-4 cursor-pointer"
              alt="Attach file"
              style={{
                position: 'absolute',
                right: "118px",
                transform: "translate(95%, 139%)",
                zIndex: 2
              }}
            />
          </label>
        )}
      </div>
      <div className="w-100 rounded-bl-xl rounded-br-xl py-3 overflow-hidden bg-white px-5">
        {dataFile && <Image className="!w-[100px] !h-[100px] mt-5" src={dataFile} />}
        <div className="flex flex-row items-center space-x-5" onKeyDown={handleKeyDown}>
          <DebouncedInput
            value={newMessage ?? ''}
            placeholder="Nội dung tin nhắn"
            debounce={100}
            onChange={(value) => setNewMessage(String(value))}
          />
          <button
            type="button"
            disabled={!newMessage && !dataFile}
            className="hover:bg-[#D3B673] focus:ring-4 focus:outline-none focus:ring-purple-300 disabled:opacity-50 px-3 py-2 text-xs font-medium text-center text-white bg-[#D3B673] rounded-lg"
            onClick={doSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};
