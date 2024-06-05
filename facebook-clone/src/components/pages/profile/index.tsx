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
  const [checkOnChangle, setCheckOnChangle] = useState(false);
  const [checkEditDescription, setCheckEditDescription] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('posts');





  const showDrawer = () => {
    setOpen(!open);
  };
  const checkAddbane = () => {
    setCheckAddBanner(!checkAddBanner);
  }

  const [userPosts, setUserPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get<any[]>(`http://localhost:8000/api/get-all-post/by-user/${user._id}`);
        setUserPosts(response.data); // Lưu các bài đăng của người dùng vào state
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);
  const filllterrr = userPosts.filter(items => items.image != null)
  console.log("ok mà ", filllterrr) // Sử dụng user._id làm phần tử phụ thuộc để gọi API mỗi khi user thay đổi

  const [valueDescription, setValueDescription] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
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
  useEffect(() => {
    const getDataUser = async () => {
      const dataIdUser = await axios.get(
        'http://localhost:8000/api/users/' + id
      );
      setData(dataIdUser.data.user);
      console.log("ở đây", dataIdUser.data.user)
    };
    getDataUser();


  }, [id]);
  // ở đây
  console.log("ko ổn", dataFile)

  useEffect(() => {
    const handelGetStatusFriend = async () => {
      const status = await axios.get(
        'http://localhost:8000/get-status-friend/' + user._id + '?idUser=' + id
      );
      console.log(status.data.status, 'status');
      setStatusFriend(status.data.status);
    };
    handelGetStatusFriend();
  }, [id, user._id]);


  const handelUpdateBanner = (event: any) => {
    event.preventDefault();
    axios
      .post('http://localhost:8000/update-corver-image/' + user._id, {
        data: dataFile,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handelUpdateAvatar = (event: any) => {
    event.preventDefault();
    axios
      .post('http://localhost:8000/update-avatar-image/' + user._id, {
        data: dataFile,
      })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handelEditDescription = (event: any) => {
    event.preventDefault();
    axios
      .post('http://localhost:8000/update/description-user/' + user._id, {
        description: valueDescription,
      })
      .then((response) => {
        toast.success(' updated');
        setCheckEditDescription(false);
        setValueDescription('');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const actionFriend = (action: any) => {
    console.log(action);
    switch (action) {
      case 3:
        //send request to friend
        axios
          .post(
            'http://localhost:8000/send-request-makefriend/' +
            id +
            '?idUser=' +
            user._id
          )
          .then((response) => {
            toast.success('Đã gửi yêu cầu kết bạn');
            // đây này 
            setTimeout(() => {
              window.location.reload();
            }, 400);
          })
          .catch((error) => {
            console.log(error);
          });

        break;
      case 2: // accepted request
        axios
          .post(
            'http://localhost:8000/approve-makefriend/' +
            user._id +
            '?idUser=' +
            id +
            '&accept=1'
          )
          .then((response) => {
            toast.success('Đã chấp nhận yêu cầu kết bạn');
            setTimeout(() => {
              window.location.reload();
            }, 400);
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      case 1: // remove request
        axios
          .post(
            'http://localhost:8000/approve-makefriend/' +
            user._id +
            '?idUser=' +
            id +
            '&remove=1'
          )
          .then((response) => {
            toast.success('Đã xoá bạn bè');
            setTimeout(() => {
              window.location.reload();
            }, 400);
          })
          .catch((error) => {
            console.log(error);
          });
        break;
      default:
        message.error(`Action not found: ${action}`);
    }
  };
  const showMessageFriend = () => {
    navigate({
      search: createSearchParams({
        chat: id as string
      }).toString()
    })
    setOpen(!open);
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span
          onClick={() => {
            navigate({
              search: createSearchParams({
                isDelete: '1',
              }).toString(),
            });
          }}
          rel="noopener noreferrer"
        >
          Danh sách đã xoá
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span
          onClick={() => {
            navigate({
              search: createSearchParams({
                isDelete: '0',
              }).toString(),
            });
          }}
          rel="noopener noreferrer"
        >
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
              className="absolute  w-full flex items-center justify-center"
              style={{ bottom: '-15px' }}
            >
              <form
                onSubmit={handelUpdateAvatar}
                onMouseEnter={() => setCheckHover(true)}
                onMouseLeave={() => setCheckHover(false)}
                className="w-44 h-44 relative rounded-full bg-gray-300 border-4 border-white"
              >
                <img
                  className="w-full h-full   rounded-full cursor-pointer hover:opacity-20"
                  src={data?.avatar}
                  alt="dp"
                />
                {checkHover && id == user._id && (
                  <label
                    className="text-xl absolute cursor-pointer font-bold bg-white text-black top-[30%] left-[5%] p-[10px]"
                    htmlFor="updateAvatars"
                  >
                    upload avatar
                  </label>
                )}
                {checkOnChangle && (
                  <button
                    type="submit"
                    className="w-[80px] h-[35px]  absolute bg-green-500 bottom-[10%] left-[25%]"
                  >
                    upload
                  </button>
                )}
                <input
                  onChange={(event: any) => {
                    handleFileChange(event);
                    setCheckOnChangle(true);
                  }}
                  type="file"
                  name=""
                  id="updateAvatars"
                  className="hidden"
                />
              </form>
              <div className="absolute" style={{ bottom: 30, right: 30 }}>
                {id == user._id && (
                  <button
                    onClick={() => checkAddbane()}
                    className="focus:outline-none px-3 py-2 hover:bg-gray-50 font-semibold bg-white rounded-md"
                  >
                    <i className="fas fa-camera mr-2"></i>Edit Cover Photo
                  </button>
                )}
                {checkAddBanner && (
                  <div>
                    <div style={{ margin: "auto" }} className="w-[400px] h-[170px] absolute -right-7 top-14  bg-[#8b939f] rounded-md z-50">
                      <form
                        style={{ justifyContent: "space-between", margin: "14px 0px 0px 48px" }}
                        onSubmit={handelUpdateBanner}
                        className=""
                      >
                        <span style={{}} className="text-white font-bold text-xl c">Upload photos</span>
                        <div style={{ width: "50px" }}>

                          <input
                            style={{ padding: "20px 0px" }}
                            onChange={(event: any) => handleFileChange(event)}
                            type="file"
                            name=""
                            id="updateBanner"


                          />
                          <button
                            type="submit"
                            className="w-[80px] h-[35px] bg-green-500"
                          >
                            submit
                          </button>
                        </div>

                      </form>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="max-w-5xl h-full mx-auto">
            <div className="flex flex-col space-y-2 mt-3 items-center justify-center pb-3 border-b-2">
              <p className="text-4xl font-bold">{data?.username}</p>
              <p className="text-sm text-gray-500">{data?.description}</p>
              {checkEditDescription && (
                <form onSubmit={handelEditDescription}>
                  <input
                    onChange={(e: any) => setValueDescription(e.target.value)}
                    className="border border-[#ccc] h-[32px]  rounded-md pl-3"
                    type="text"
                    placeholder="enter your description"
                  />
                  <Button
                    className="ml-3 bg-green-500 text-white"
                    htmlType="submit"
                  >
                    submit
                  </Button>
                </form>
              )}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <div className="flex space-x-8">
                <button
                  onClick={() => setSelectedTab('posts')}
                  className={`text-lg font-semibold ${selectedTab === 'posts' ? 'text-blue-600' : 'text-gray-600'}`}
                >
                  Posts 
                </button>
                <button
                  onClick={() => setSelectedTab('friends')}
                  className={`text-lg font-semibold ${selectedTab === 'friends' ? 'text-blue-600' : 'text-gray-600'}`}
                >
                  Friends 
                </button>
                <button
                  onClick={() => setSelectedTab('gallery')}
                  className={`text-lg font-semibold ${selectedTab === 'gallery' ? 'text-blue-600' : 'text-gray-600'}`}
                >
                  Albums 
                </button>
              </div>
              {id == user._id ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCheckEditDescription(!checkEditDescription)
                    }
                    className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-semibold focus:outline-none"
                  >
                    <i className="fas fa-plus-circle  mr-2"></i>Thêm tiểu sử
                  </button>

                  <button className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 font-semibold focus:outline-none">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {statusFriend == '1' && (
                    <>
                      <button
                        onClick={() => actionFriend(1)}
                        className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-semibold focus:outline-none"
                      >
                        Huỷ kết bạn
                      </button>
                      <button className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-semibold focus:outline-none">
                        Bạn bè
                      </button>
                    </>
                  )}
                  {statusFriend == '2' && (
                    <button
                      onClick={() => actionFriend(2)}
                      className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-semibold focus:outline-none"
                    >
                      Chấp nhận lời mời kết bạn
                    </button>
                  )}
                  {statusFriend == '3' && (
                    <button
                      onClick={() => actionFriend(3)}
                      className="px-3 py-1.5 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-semibold focus:outline-none"
                    >
                      Gửi lời mời kết bạn
                    </button>
                  )}
                  <button
                    onClick={() => showMessageFriend()}
                    className="px-3 py-1.5 rounded-md bg-primary hover:bg-blue-600 text-white font-semibold focus:outline-none"
                  >
                    Tin nhắn
                  </button>
                  <button className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 font-semibold focus:outline-none">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>





      {/* phần dưới */}
      {selectedTab === 'posts' &&
      <div className="max-w-6xl h-full mx-auto my-3">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <div className="bg-white rounded-lg p-3 text-sm text-gray-600 shadow">
              <div className="mb-2 ">
                <p className="font-bold text-xl text-gray-800">Intro</p>
              </div>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fas fa-briefcase"></i>
                  </span>
                  <p>
                    Full Stack Web Developer at{' '}
                    <span className="font-semibold">Fiverr</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fas fa-graduation-cap"></i>
                  </span>
                  <p>
                    Studiend B.Sc in SWE at{' '}
                    <span className="font-semibold">
                      Daffodil International University
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fas fa-home"></i>
                  </span>
                  <p>
                    Lives in <span className="font-semibold">Dhaka</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fas fa-map-marker-alt"></i>
                  </span>
                  <p>
                    From{' '}
                    <span className="font-semibold">
                      Chandpur, Chittagong, Bangladesh
                    </span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fas fa-heart"></i>
                  </span>
                  <p>
                    <span className="font-semibold">Single</span>
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fab fa-facebook"></i>
                  </span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={'https://facebook.com/saifulshihab'}
                  >
                    <p>saifulshihab</p>
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fab fa-instagram"></i>
                  </span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={'https://instagram.com/_shiha6'}
                  >
                    <p>_shiha6</p>
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fab fa-twitter"></i>
                  </span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={'https://twitter.com/ShihabSWE'}
                  >
                    <p>ShihabSWE</p>
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fab fa-github"></i>
                  </span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={'https://github.com/saifulshihab'}
                  >
                    <p>saifulshihab</p>
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span>
                    <i className="fab fa-behance"></i>
                  </span>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={'https://www.behance.net/saifulis1am'}
                  >
                    <p>saifulis1am</p>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <PrevFriend />
            </div>
          </div>
          <div className="col-span-3">
            {/* Create post */}
            {id == user._id && <CreatePostBox />}
            {/* post filter box */}
            <div className="bg-white rounded-md shadow p-2 mt-4 px-3 text-sm">
              <div className="flex items-center justify-between pb-2 border-b">
                <div>
                  <p className="text-xl text-gray-700 font-bold">Posts</p>
                </div>
                {id == user._id && (
                  <div className="flex items-center space-x-2">
                    <Dropdown
                      menu={{ items }}
                      placement="bottomLeft"
                      arrow={{ pointAtCenter: true }}
                    >
                      <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md font-semibold focus:outline-none">
                        <i className="fas fa-sliders-h mr-2"></i>Filters
                      </button>
                    </Dropdown>
                    <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-md font-semibold focus:outline-none">
                      <i className="fas fa-cog mr-2"></i>Manage Posts
                    </button>
                  </div>
                )}
              </div>
              <div className="flex space-x-3 text-gray-500 mt-1 -mb-1">
                <button
                  className={`font-semibold flex-1 h-8 focus:outline-none justify-center space-x-2 hover:bg-gray-100 rounded-md ${postsView === 'listView' ? 'bg-gray-200' : undefined
                    }`}
                  onClick={() => setPostsView('listView')}
                >
                  <i className="fas fa-bars mr-2"></i>List View
                </button>
                <button
                  className={`font-semibold flex-1 h-8 focus:outline-none justify-center space-x-2 hover:bg-gray-100 rounded-md  ${postsView === 'gridView' ? 'bg-gray-200' : undefined
                    }`}
                  onClick={() => setPostsView('gridView')}
                >

                  <i className="fas fa-th-large mr-2"></i>Grid View
                </button>
              </div>
            </div>

            {/* user posts */}
            <PostContainer postsView={postsView}

            />

          </div>
        </div>
      </div>
      }
      {/* After bio content */}
      {selectedTab === 'friends' &&
        <div className="max-w-6xl h-full mx-auto my-3">
          <PrevFriend />
        </div>
      }

      {/* Bộ sưu tập */}
      {selectedTab === 'gallery' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          width: "70%",
          margin: "auto",
          marginTop: "40px",
          background: "#FFFFFF",
          boxShadow: "0 1px 2px 0 rgba(60, 64, 67, .102), 0 2px 6px 2px rgba(60, 64, 67, .149)",
          borderRadius: "20px"

        }}
          className="">

          {filllterrr.map((itemss) => {
            return (
              <div style={{ marginLeft: "30px" }}>
                <img style={{ borderRadius: "10px", marginTop: "30px" }} src={itemss.image} alt="" />
              </div>
            )
          })}
        </div>
      )}


    </div>


  );
};

export default ProfilePage;
