import React, { useEffect, useState } from 'react';
import { TPostView } from '../../../types/post';
import CreatePostBox from '../../atoms/post/CreatePostBox';
import PostContainer from '../../container/PostContainer';
import { useAppSelector } from '../../../store';
import axios from 'axios';
import PrevFriend from '../friend/PrevFriend';
import { Button, Dropdown, MenuProps, message } from 'antd';
import { toast } from 'react-toastify';
import { createSearchParams, useNavigate, useParams } from 'react-router-dom';
import { SupportBot } from '../../../features';

const ProfilePage: React.FC = () => {
  const [postsView, setPostsView] = useState<TPostView>('listView');
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  const [data, setData] = useState<any>({});
  const [dataFile, setDataFile] = useState<any>(null);
  const [checkHover, setCheckHover] = useState(false);
  const [statusFriend, setStatusFriend] = useState('0');
  const [checkAddBanner, setCheckAddBanner] = useState(false);
  const [checkOnChange, setCheckOnChange] = useState(false);
  const [checkEditDescription, setCheckEditDescription] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('posts');
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [valueDescription, setValueDescription] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const showDrawer = () => {
    setOpen(!open);
  };

  const checkAddBannerHandler = () => {
    setCheckAddBanner(!checkAddBanner);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setDataFile(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get<any[]>(`http://localhost:8000/api/get-all-post/by-user/${user._id}`);
      setUserPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const filteredPosts = userPosts.filter(post => post.image != null);

  const getUserData = async () => {
    const response = await axios.get(`http://localhost:8000/api/users/${id}`);
    setData(response.data.user);
  };

  useEffect(() => {
    getUserData();
  }, [id]);

  const getStatusFriend = async () => {
    const response = await axios.get(`http://localhost:8000/get-status-friend/${user._id}?idUser=${id}`);
    setStatusFriend(response.data.status);
  };

  useEffect(() => {
    getStatusFriend();
  }, [id, user._id]);

  const handleUpdateBanner = async (event: any) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:8000/update-cover-image/${user._id}`, { data: dataFile });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAvatar = async (event: any) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:8000/update-avatar-image/${user._id}`, { data: dataFile });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditDescription = async (event: any) => {
    event.preventDefault();
    try {
      await axios.post(`http://localhost:8000/update/description-user/${user._id}`, { description: valueDescription });
      toast.success('Updated');
      setCheckEditDescription(false);
      setValueDescription('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleFriendAction = async (action: number) => {
    try {
      switch (action) {
        case 3: // Send request to friend
          await axios.post(`http://localhost:8000/send-request-makefriend/${id}?idUser=${user._id}`);
          toast.success('Đã gửi yêu cầu kết bạn');
          setTimeout(() => window.location.reload(), 400);
          break;
        case 2: // Accept request
          await axios.post(`http://localhost:8000/approve-makefriend/${user._id}?idUser=${id}&accept=1`);
          toast.success('Đã chấp nhận yêu cầu kết bạn');
          setTimeout(() => window.location.reload(), 400);
          break;
        case 1: // Remove request
          await axios.post(`http://localhost:8000/approve-makefriend/${user._id}?idUser=${id}&remove=1`);
          toast.success('Đã xoá bạn bè');
          setTimeout(() => window.location.reload(), 400);
          break;
        default:
          message.error(`Action not found: ${action}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = () => {
    navigate({ search: createSearchParams({ chat: id as string }).toString() });
    setOpen(!open);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span onClick={() => navigate({ search: createSearchParams({ isDelete: '1' }).toString() })}>
          Danh sách đã xoá
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span onClick={() => navigate({ search: createSearchParams({ isDelete: '0' }).toString() })}>
          Mặc định
        </span>
      ),
    },
  ];

  return (
    <div className="w-full h-full" style={{ position: "relative" }}>
      {open && <SupportBot showDrawer={showDrawer} />}
      <div className="w-full h-auto shadow bg-white rounded-md">
        <div className="max-w-6xl h-full mx-auto bg-white p-2">
          <div
            className="h-96 max-h-96 w-full rounded-lg relative"
            style={{
              backgroundImage: `url(${data.coverImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div
              className="absolute w-full flex items-center justify-center"
              style={{ bottom: '-15px' }}
            >
              <form
                onSubmit={handleUpdateAvatar}
                onMouseEnter={() => setCheckHover(true)}
                onMouseLeave={() => setCheckHover(false)}
                className="w-44 h-44 relative rounded-full bg-gray-300 border-4 border-white"
              >
                <img
                  className="w-full h-full rounded-full cursor-pointer hover:opacity-20"
                  src={data?.avatar}
                  alt="dp"
                />
                {checkHover && id === user._id && (
                  <label
                    className="text-xl absolute cursor-pointer font-bold bg-white text-black top-[30%] left-[5%] p-[10px]"
                    htmlFor="updateAvatars"
                  >
                    Upload Avatar
                  </label>
                )}
                {checkOnChange && (
                  <button
                    type="submit"
                    className="w-[80px] h-[35px] absolute bg-green-500 bottom-[10%] left-[25%]"
                  >
                    Upload
                  </button>
                )}
                <input
                  onChange={(event: any) => {
                    handleFileChange(event);
                    setCheckOnChange(true);
                  }}
                  type="file"
                  name=""
                  id="updateAvatars"
                  className="hidden"
                />
              </form>
              <div className="absolute" style={{ bottom: 30, right: 30 }}>
                {id === user._id && (
                  <button
                    onClick={checkAddBannerHandler}
                    className="focus:outline-none px-3 py-2 hover:bg-gray-50 font-semibold bg-white rounded-md"
                  >
                    <i className="fas fa-camera mr-2"></i>Edit Cover Photo
                  </button>
                )}
                {checkAddBanner && (
                  <div>
                    <div style={{ margin: "auto" }} className="w-[400px] h-[170px] absolute -right-7 top-14 bg-[#8b939f] rounded-md z-50">
                      <form
                        onSubmit={handleUpdateBanner}
                        className="flex justify-between items-center m-4"
                      >
                        <span className="text-white font-bold text-xl">Upload Photo</span>
                        <input
                          onChange={handleFileChange}
                          type="file"
                          className="text-white"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1 rounded-lg bg-green-500 hover:opacity-80"
                        >
                          Save
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center my-6">
            {statusFriend === '2' && (
              <button
                className="mr-3 px-3 py-2 text-lg border font-semibold border-gray-400 hover:bg-gray-50 rounded-md"
                onClick={() => handleFriendAction(2)}
              >
                Chấp nhận yêu cầu kết bạn
              </button>
            )}
            <button
              className="mr-3 px-3 py-2 text-lg border font-semibold border-gray-400 hover:bg-gray-50 rounded-md"
              onClick={() => handleSendMessage()}
            >
              Nhắn tin
            </button>
            {statusFriend === '1' ? (
              <button
                className="mr-3 px-3 py-2 text-lg border font-semibold border-gray-400 hover:bg-gray-50 rounded-md"
                onClick={() => handleFriendAction(1)}
              >
                Huỷ kết bạn
              </button>
            ) : (
              statusFriend !== '2' && (
                <button
                  className="mr-3 px-3 py-2 text-lg border font-semibold border-gray-400 hover:bg-gray-50 rounded-md"
                  onClick={() => handleFriendAction(3)}
                >
                  Kết bạn
                </button>
              )
            )}
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold text-3xl">{data.username}</div>
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <Button>
                <i className="fa-solid fa-ellipsis"></i>
              </Button>
            </Dropdown>
          </div>
          <div className="mt-4 w-full flex flex-col">
            {id === user._id && checkEditDescription ? (
              <form
                onSubmit={handleEditDescription}
                className="flex justify-start items-center"
              >
                <textarea
                  onChange={(e) => setValueDescription(e.target.value)}
                  rows={3}
                  placeholder="Add your description..."
                  className="w-1/2 p-3 border border-gray-400"
                />
                <button
                  type="submit"
                  className="ml-3 px-3 py-2 text-lg font-semibold bg-blue-600 text-white rounded-md"
                >
                  Save
                </button>
                <button
                  onClick={() => setCheckEditDescription(false)}
                  className="ml-3 px-3 py-2 text-lg font-semibold bg-gray-300 text-black rounded-md"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div className="text-lg">{data.description}</div>
                {id === user._id && (
                  <button
                    onClick={() => setCheckEditDescription(true)}
                    className="px-3 py-2 text-lg font-semibold bg-blue-600 text-white rounded-md"
                  >
                    Edit Description
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white mt-6 rounded-md shadow">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('posts')}
              className={`text-lg font-semibold ${selectedTab === 'posts' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Bài viết
            </button>
            <button
              onClick={() => setSelectedTab('friends')}
              className={`text-lg font-semibold ${selectedTab === 'friends' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Bạn bè 
            </button>
            <button
              onClick={() => setSelectedTab('gallery')}
              className={`text-lg font-semibold ${selectedTab === 'gallery' ? 'text-blue-600' : 'text-gray-600'}`}
            >
              Bộ sưu tập
            </button>
          </div>
        </div>
        <div className="p-4">
          {selectedTab === 'posts' && (
            <>
              {user._id === id && <CreatePostBox />}
              <PostContainer postsView={postsView} />
            </>
          )}
          {selectedTab === 'friends' && <PrevFriend />}
          {selectedTab === 'gallery' && (
            <div className="grid grid-cols-3 gap-4">
              {filteredPosts.map(post => (
                <div key={post._id} className="relative">
                  <img src={post.image} alt="Gallery Item" className="w-full h-40 object-cover rounded-md" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
