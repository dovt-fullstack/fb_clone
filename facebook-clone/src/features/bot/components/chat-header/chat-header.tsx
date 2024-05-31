interface ChatHeaderProps {
  name: string
  numberOfMessages: number
  showDrawer: () => void
  showDrawerChat? : () => void
}
import React, { useEffect, useState } from "react"
import { useAppSelector } from "../../../../store"
import axios from "axios"
export const ChatHeader = ({ name, numberOfMessages = 0, showDrawer ,showDrawerChat }: ChatHeaderProps) => {
  console.log(showDrawerChat)
  const [nameUser, setNameUser] = useState<{ username: string, avatar: string }[]>([]);

  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  useEffect(() => {
    const getDataUser = async () => {
      const dataIdUser = await axios.get(
        'http://localhost:8000/api/users/' + user._id
      );

      setNameUser([dataIdUser.data.user]); 


      console.log(dataIdUser.data.user, 'huyfefef data.user');
    };
    getDataUser();
  }, [user._id]);
  console.log("deome",nameUser)
  return (
    <div className='border-b-gray-200 flex flex-row items-center justify-between py-3 px-5 border-b-2'>
      {nameUser.map((items:any)=>{
        return(
          <>


      <div className='flex flex-row items-center space-x-1.5'>
        {/* avata */}
        <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full'>
          <svg
            className='-left-1 absolute w-12 h-12 text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd'></path>
          </svg>
        </div>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col flex-1'>
            <p className='text-xs text-gray-600'>{items.username}</p>
            <p className='text-xs text-gray-400'>{numberOfMessages} messages</p>
          </div>
        </div>
      </div>
      <div className='cursor-pointer' onClick={()=>{
        showDrawer()
        if (showDrawerChat) {
          showDrawerChat()
        }
      }}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
        </svg>
      </div>
      </>
        )
      })}
    </div>
  )
}
