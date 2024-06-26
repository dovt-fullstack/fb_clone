import React, { useEffect, useState } from 'react';
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAppSelector } from '../../../store';
import { RootState } from '@reduxjs/toolkit/query';
import axios from 'axios';
import { useLogoutMutation } from '../../../api/Auth';
import { Button, Drawer, Space } from 'antd';
import { SupportBot } from '../../../features';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openChat, setOpenChat] = useState(false);

  const [data, setData] = useState<any>({});
  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [dataChat, setDataChat] = useState([]);
  // conversations
  const showDrawer = () => {
    setOpen(!open);

  };
  const showDrawerChat = () => {
    setOpenChat(!openChat);
  };
  const onClose = () => {
    setOpen(false);
    setOpenChat(false)
    navigate({
      search: createSearchParams({
        chat: "",
      }).toString(),
    });
  };
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);

  const pathName = location?.pathname.split('/')[1];
  const [isClick, setIsClick] = useState(false);
  const logOut = () => {
    localStorage.clear();
    logout()
      .unwrap()
      .then(() => {
        window.location.href = '/login';
      });
  };
  useEffect(() => {
    const getDataUser = async () => {
      const dataIdUser = await axios.get(
        'http://localhost:8000/api/users/' + user._id
      );
      setData(dataIdUser.data.user);
      console.log(dataIdUser.data.user, 'data.user');
    };
    getDataUser();
  }, [user._id]);
  useEffect(() => {
    const getDataChatUser = async () => {
      const dataIdUser = await axios.get(
        'http://localhost:8000/conversations/' + user._id
      );
      console.log(dataIdUser.data, 'getDataChatUser');
      setDataChat(dataIdUser.data);
    };
    getDataChatUser();
  }, [user._id]);
  const showMessageFriend = (id: string) => {
    navigate({
      search: createSearchParams({
        chat: id as string,
      }).toString(),
    });
    setOpen(false);
    setOpenChat(!openChat);
  };
  return (
    <div className="relative">
      {openChat && <SupportBot showDrawer={showDrawerChat} showDrawerChat={showDrawerChat}/>}
      <Drawer
        title="Danh sách tin nhăns"
        placement={'right'}
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        {dataChat &&
          dataChat.map((dataChat: any, index: number) => {
            return (
              <div key={index} className=" mt-5">
                <div
                  onClick={() => {
                    showMessageFriend(dataChat._id);
                  }}
                  className="flex cursor-pointer mt-5  border border-[#ccc] rounded-md p-2 gap-5 items-center ml-5 mb-5"
                >
                  <img
                    className="w-[60px] rounded-full"
                    src={dataChat.avatar}
                    alt=""
                  />
                  <p className="text-lg text-black font-bold">
                    {dataChat?.username}
                  </p>
                </div>
              </div>
            );
          })}
      </Drawer>
      {isClick && (
        <div className="flex justify-end absolute top-[62px] right-0">
          <div className="w-[400px] h-[200px] bg-[#a7a8ab] rounded-md z-50">
            <div
              onClick={() => navigate('/profile/' + user._id)}
              className="flex cursor-pointer mt-3 border-b border-[#ccc] gap-5 items-center ml-5 mb-3"
            >
              <img className="w-[60px] rounded-full" src={data.avatar} alt="" />
              <p className="text-lg text-white font-bold">{user?.username}</p>
            </div>
       
              <div className='flex cursor-pointer mt-5 border-b border-[#ccc] gap-5 items-center ml-5 mb-3'>
              <Link to={'/change-pass'}  className="text-lg text-white font-bold">
                Đổi mật khẩu
              </Link>
              </div>
            <div className="flex cursor-pointer mt-5 border-b border-[#ccc] gap-5 items-center ml-5 mb-3">
              <div className="text-white">
                <i
                  data-visualcompletion="css-img"
                  className="color-white"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      'url("https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/JcQFsJ6VPIo.png")',
                    backgroundPosition: '0px -209px',
                    backgroundSize: '41px 419px',
                    width: 20,
                    height: 20,
                    backgroundRepeat: 'no-repeat',
                    display: 'inline-block',
                  }}
                />
              </div>
             
              <p onClick={logOut} className="text-lg text-white font-bold">
                Đăng xuất
              </p>

            </div>

          </div>
        </div>
      )}
      <div className="w-full h-14 bg-white grid grid-cols-7 gap-4 fixed z-50">
        <div className="col-span-2 flex items-center">
          <div className="flex items-center ml-2">
            <div className="h-10 text-primary">
              <Link to="/">
                <i className="fab fa-facebook" style={{ fontSize: 40 }}></i>
              </Link>
            </div>
            <div className="h-10">
              <input
                placeholder="Search Facebook"
                className="bg-gray-100 rounded-full h-full focus:outline-none ml-2 px-3 pr-4"
              />
            </div>
          </div>
        </div>
        <div className="col-span-3 flex items-center justify-center space-x-2">
          <Link to="/">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className="w-14 h-auto relative flex items-center justify-center">
                <div
                  className={`${
                    pathName === '' || undefined
                      ? 'text-primary'
                      : 'text-gray-400'
                  }`}
                >
                  <i className="text-2xl fas fa-home"></i>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/watch">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className="w-14 h-auto relative flex items-center justify-center">
                <div className="absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0">
                  9+
                </div>
                <div
                  className={`${
                    pathName === 'watch' ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  <i className="text-2xl fas fa-tv"></i>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/marketplace">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className="w-14 h-auto relative flex items-center justify-center">
                <div className="hidden absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0">
                  9+
                </div>
                <div
                  className={`${
                    pathName === 'marketplace'
                      ? 'text-primary'
                      : 'text-gray-400'
                  }`}
                >
                  <i className="text-2xl fas fa-store"></i>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/groups">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className="w-14 h-auto relative flex items-center justify-center">
                <div className="absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0">
                  2
                </div>
                <div
                  className={`${
                    pathName === 'groups' ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  <i className="text-2xl fas fa-users"></i>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/gaming">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className="w-14 h-auto relative flex items-center justify-center">
                <div className="absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0">
                  9+
                </div>
                <div
                  className={`${
                    pathName === 'gaming' ? 'text-primary' : 'text-gray-400'
                  }`}
                >
                  <i className="text-2xl fas fa-gamepad"></i>
                </div>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <div className="h-10 w-auto flex items-center space-x-2 pr-2">
            <Link to={`/profile/${user._id}`}>
              <button className="h-10 px-2 flex space-x-1 items-center justify-center focus:outline-none hover:bg-gray-300 rounded-full">
                <div className="h-8">
                  <img
                    src={user?.avatar}
                    className="w-8 h-8 rounded-full"
                    alt="dp"
                  />
                </div>
                <div className="h-8 flex items-center justify-content">
                  <p className="font-semibold text-sm">{user?.username}</p>
                </div>
              </button>
            </Link>
            <button className="w-10 h-10 bg-gray-200 focus:outline-none hover:bg-gray-300 rounded-full">
              <i className="fas fa-plus"></i>
            </button>
            <button
              onClick={showDrawer}
              className="w-10 h-10 bg-gray-200 focus:outline-none hover:bg-gray-300 rounded-full"
            >
              <i className="fab fa-facebook-messenger"></i>
            </button>
            <button className="w-10 h-10 bg-gray-200 focus:outline-none hover:bg-gray-300 rounded-full">
              <i className="fas fa-bell"></i>
            </button>
            <button
              onClick={() => setIsClick(!isClick)}
              className="w-10 h-10 bg-gray-200 focus:outline-none hover:bg-gray-300 rounded-full"
            >
              <i className="fas fa-sort-down"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
