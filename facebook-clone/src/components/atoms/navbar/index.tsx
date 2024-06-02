import React, { useEffect, useState } from 'react';
import {
  createSearchParams,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import userheader from "../../../assets/userheader.jpg"


import { useAppSelector } from '../../../store';
import { RootState } from '@reduxjs/toolkit/query';
import axios from 'axios';
import { useLogoutMutation } from '../../../api/Auth';
import { Button, Drawer, Space } from 'antd';
import { SupportBot } from '../../../features';
import logo from "../../../assets/logoweb.png"

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openChat, setOpenChat] = useState(false);
  const [notificatio, setNotification] = useState(false)
  const [data, setData] = useState<any>({});
  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const [dataChat, setDataChat] = useState([]);
  


  const showDrawer = () => {
    setOpen(!open);

  };
  const notification = () => {
    setNotification(!notificatio)
  }
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
      {openChat && <SupportBot showDrawer={showDrawerChat} showDrawerChat={showDrawerChat} />}
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
              {/* đây này */}
            </div>

            <div className='flex cursor-pointer mt-5 border-b border-[#ccc] gap-5 items-center ml-5 mb-3'>
              <Link to={'/change-pass'} className="text-lg text-white font-bold">
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
      <div style={{ background: "#15894c", position: 'relative' }} className="w-full h-14 bg-white grid grid-cols-7 gap-4 fixed z-50">
        <div className="col-span-2 flex items-center">
          <div className="flex items-center ml-2">
            <div className="h-10 text-primary">
              <Link to="/">
                <img style={{ width: "40px", height: "40px" }} src={logo} alt="" />
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
              <div className="">
                <div
                  className={`${pathName === '' || undefined
                      ? 'text-primary'
                      : 'text-gray-400'
                    }`}
                >
                  <span style={{ color: "black", fontWeight: "800", width: '50px' }}>Trang Chủ</span>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/watch">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className=" h-auto relative flex items-center justify-center">
                <div style={{ margin: "20px -14px 0px 4px" }} className="absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0">
                  9+
                </div>
                <div

                  className={`${pathName === 'watch' ? 'text-primary' : 'text-gray-400'
                    }`}
                >
                  <span style={{ color: "black", fontWeight: "800", width: '50px' }}> Bảng tin</span>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/marketplace">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className=" h-auto relative flex items-center justify-center">
                <div className="hidden absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0">
                  9+
                </div>
                <div
                  className={`${pathName === 'marketplace'
                      ? 'text-primary'
                      : 'text-gray-400'
                    }`}
                >
                  <span style={{ color: "black", fontWeight: "800", width: '50px' }}>Trao đổi</span>
                </div>
              </div>
            </div>
          </Link>
          <Link to="/groups">
            <div className="w-24 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
              <div className=" h-auto relative flex items-center justify-center">
                <div style={{ margin: "20px -14px 0px 4px" }} className="absolute bg-red-500 text-white text-xs font-bold px-1 rounded-lg top-0 right-0">
                  2
                </div>
                <div
                  className={`${pathName === 'groups' ? 'text-primary' : 'text-gray-400'
                    }`}
                >
                  <span style={{ color: "black", fontWeight: "800", width: '50px' }}>Diễn đàn</span>
                </div>
              </div>
            </div>
          </Link>
          <Link to={`/profile/${user._id}`}>
            <button className="h-10 px-2 flex space-x-1 items-center justify-center focus:outline-none hover:bg-gray-300 rounded-full">
              <div className="h-8">

              </div>
              <div className="h-8 flex items-center justify-content">
                <span style={{ color: "black", fontWeight: "800" }}>Trang cá nhân</span>

              </div>
            </button>
          </Link>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <div className="h-10 w-auto flex items-center space-x-2 pr-2">


            <button
              onClick={showDrawer}
              className="w-10 h-10 bg-gray-200 focus:outline-none hover:bg-gray-300 rounded-full"
            >
              <i className="fab fa-facebook-messenger"></i>
            </button>
            <button onClick={notification} className="w-10 h-10 bg-gray-200 focus:outline-none hover:bg-gray-300 rounded-full">
              <i className="fas fa-bell"></i>
              {/* đây này  */}
            </button>

            <button
              onClick={() => setIsClick(!isClick)}
              className="w-10 h-10 bg-gray-200 focus:outline-none hover:bg-gray-300 rounded-full"
            >
              <img style={{ borderRadius: "30px" }} src={userheader} alt="" />
            </button>

          </div>




        </div>
        {notificatio ?
          <div style={{ width: "300px", height: "300px", borderRadius: "10px", background: "#FFFFFF", position: "absolute", margin: "56px -1px 0px 0px", right: "0", boxShadow: '0 1px 2px 0 rgba(60, 64, 67, .102), 0 2px 6px 2px rgba(60, 64, 67, .149)' }}>
            <span style={{ fontWeight: "600", padding: "10px" }}>Thông báo</span>
          </div> : ""
        }
      </div>
      {/* <div style={{ background: "#FFFFFF", borderRadius: "5px", width: "300px", position: "absolute", marginLeft: "55px", boxShadow: ' 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 7px rgb(0 0 0 / 0.1)' }}>
        <div style={{display:"flex",alignItems:'center',padding:"10px 10px",borderBottom:"1px solid black"}}>
          <img style={{width:"40px",height:"40px",borderRadius:"30px"}} src="data:image/png;base64,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" alt="" />
          <h1>fefefffffffffffffffffff</h1>
        </div>
      </div> */}

    </div>

  );
};

export default Navbar;
