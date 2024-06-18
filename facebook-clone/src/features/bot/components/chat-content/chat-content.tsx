import { Message } from '../../types';
import parse from 'html-react-parser';
import { useAppSelector } from '../../../../store/hooks';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Image } from 'antd';
interface ChatContentProps {
  messages: Message[];
}

export const ChatContent = ({ messages }: ChatContentProps) => {
  const { user: userData } = useAppSelector(
    (state) => state.persistedReducer.auth
  );
  const [queryParameters] = useSearchParams();
  const dataPageQuery: any = queryParameters.get('chat');
  const [dataUserChat, setDataUserChat] = useState<any>();
  const [dataChat, setDataChat] = useState<any[]>([]);
  const [checkErrorMessage, setCheckErrorMessage] = useState(false);

  useEffect(() => {
    const getDataUser = async () => {
      const dataIdUser = await axios.get(
        'http://localhost:8000/api/users/' + dataPageQuery
      );
      setDataUserChat(dataIdUser.data.user);
    };
    getDataUser();
  }, [dataPageQuery]);
  useEffect(() => {
    const handelGetMessageUser = async () => {
      const config = {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
      const { data } = await axios.get(
        'http://localhost:8000/get-user-chat-message?senderId=' +
          userData._id +
          '&receiverId=' +
          dataPageQuery,
        config
      );
      console.log(data);
      if (data.message == 'no message') {
        setCheckErrorMessage(true);
      } else {
        const resultGet = await axios.get(
          'http://localhost:8000/conversations-details/' + data._id
        );
        console.log(resultGet.data, 'resultGet');
        setDataChat(resultGet.data);
      }
    };
    handelGetMessageUser();
  }, [dataPageQuery, userData._id]);
  return (
    <div className="flex-1 h-full py-1 overflow-auto px-5 scrollbar-none">
      {checkErrorMessage && <div>No message</div>}
      {dataChat?.map((message: any, index: number) => {
        console.log(message, 'cc');
        return (
          <div
            key={index}
            className={`py-2 flex flex-row w-full ${
              message.senderId._id == userData._id
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div
              className={`${
                message.senderId._id == userData._id ? 'order-2' : 'order-1'
              }`}
            >
              {/* avata */}
              <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                {message.senderId._id == userData._id ? (
                  <img
                    src={
                      userData
                        ? userData.avatar
                        : 'https://png.pngtree.com/png-vector/20191027/ourlarge/pngtree-avatar-vector-icon-white-background-png-image_1884971.jpg'
                    }
                    className="w-12 object-cover h-12 text-gray-400"
                    alt="bot"
                  />
                ) : (
                  <img
                    src={dataUserChat.avatar}
                    className="w-12 object-cover h-12 text-gray-400"
                    alt="bot"
                  />
                )}
                {/* {message.receiverId._id == dataUserChat._id && (
                  <>
                    <img
                      src={dataUserChat.avatar}
                      className="w-12 object-cover h-12 text-gray-400"
                      alt="bot"
                    />
                  </>
                )} */}
              </div>
            </div>
            <div
              className={`px-2 w-fit py-3 flex flex-col bg-[#D3B673] items-start rounded-lg text-white ${
                message.senderId._id == userData._id
                  ? 'order-1 mr-2'
                  : 'order-2 ml-2'
              }`}
            >
              <span className="text-xs text-gray-200">
                {new Date(message.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="text-md">{parse(message.content)}</span>
              <div>
                {message.image && (
                  <Image
                    className="!w-[100px] !h-[100px]"
                    src={message.image}
                    alt=""
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
