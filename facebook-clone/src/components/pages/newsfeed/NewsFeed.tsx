import React, { useEffect, useState } from 'react';
import { storiesData } from '../../../data';
import CreatePostBox from '../../atoms/post/CreatePostBox';
import Story from '../../atoms/story';
import PostContainer from '../../container/PostContainer';
import Post from '../../atoms/post';
import { useAppSelector } from '../../../store';
import likeIcons from '../../../assets/like.png';
import tymIcons from '../../../assets/thumbs-up.png';
import axios from 'axios';
import moment from 'moment';
import {
  Button,
  Drawer,
  DrawerProps,
  Form,
  Input,
  Popover,
  Space,
  Tabs,
  TabsProps,
} from 'antd';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { toast } from 'react-toastify';

const NewsFeed: React.FC = () => {
  const [getPostFriend, setGetPostFriend] = useState([]);
  const navigate = useNavigate();
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  const [countLike, setCountLike] = useState(0);
  const [queryParameters] = useSearchParams();
  const [form] = Form.useForm();
  const [dataCommentPost, setDataCommentPost] = useState<any[]>([]);
  const dataPageQuery: any = queryParameters.get('postId');
  const isCheckLike: any = queryParameters.get('isCheckLike');
  const isEdit: any = queryParameters.get('isEdit');
  const [open, setOpen] = useState(false);
  const [dataFile, setDataFile] = useState<any>(null);
  const [dataLike, setDataLike] = useState([]);
  const [dataTym, setDataTym] = useState([]);
  const [dataIdComment, setDataIdComment] = useState({
    comment: '',
    image: '',
  });
  const [iconsPost, setIconsPost] = useState(false)
  const handelCheckActionPost = (id: string) => {
    setIconsPost(!iconsPost);
  };

  const [userPosts, setUserPosts] = useState<any[]>([]);


  const [openPostId, setOpenPostId] = useState(null);

  const toggleCommentBox = (postId: any) => {
    setOpenPostId(prevPostId => (prevPostId === postId ? null : postId));
  };


  // useEffect(() => {
  //   const fetchUserPosts = async () => {
  //     try {
  //       const response = await axios.get<any[]>(`http://localhost:8000/api/get-all-post/by-user/${user._id}`);
  //       setUserPosts(response.data); // Lưu các bài đăng của người dùng vào state
  //     } catch (error) {
  //       console.error('Error fetching user posts:', error);
  //     }
  //   };

  //   if (user) {
  //     fetchUserPosts();
  //   }
  // }, [user]); // Sử dụng user._id làm phần tử phụ thuộc để gọi API mỗi khi user thay đổi
  const fetchDataFirend = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/get-all-post/by-user/' + user._id
    );
    console.log("huytnhes ", data);
    setUserPosts(data);
  };
  useEffect(() => {

    fetchDataFirend();
  }, [user._id, countLike]);
  const fillter = userPosts.filter(items => items.status === "0")



  const concatOk = fillter.concat(getPostFriend)
  console.log("contac", concatOk)

  const handeopen = () => {
    setOpen(!open)
  }

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

  useEffect(() => {
    const fetchDataFirend = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/post/get-post-friend/' + user._id
      );
      console.log("huytnhes ", data);
      setGetPostFriend(data);
    };
    fetchDataFirend();
  }, [user._id, countLike]);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    navigate({
      search: createSearchParams({
        postId: '',
        isCheckLike: '',
        isEdit: '',
      }).toString(),
    });
    setDataFile(null);
    setDataIdComment({
      comment: '',
      image: '',
    });
  };
  // useEffect(() => {
  //   if (isEdit == 'ok') {
  //     form.setFieldsValue({
  //       username: dataIdComment.comment,
  //     });
  //   }
  // }, [isEdit,form,dataIdComment.comment]);
  const handelGetCommentThisPost = (idPost: string) => {
    axios
      .get('http://localhost:8000/api/post/get-comment/' + idPost)
      .then((response: any) => {
        setDataCommentPost(response.data);
        console.log(response);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
  console.log("countLike", countLike)
  const onFinish = (values: any) => {
    if (!isEdit) {
      console.log('Success:', values, dataFile);
      axios
        .post('http://localhost:8000/api/post/comment-post/' + dataPageQuery, {
          message: values.username,
          image: dataFile || '',
          idUser: user._id,
        })
        .then((ok: any) => {
          toast.success(' đã gửi bình luận');
          form.resetFields();
          setDataFile(null);
          handelGetCommentThisPost(dataPageQuery);
          fetchDataFirend();
        })
        .catch((error: any) => {
          console.log('Error:', error);
        });
    } else {
      console.log('Success:', values, dataFile);
      axios
        .post('http://localhost:8000/api/post/comment-edit/' + isEdit, {
          comment: values.username,
          image: dataFile || '',
        })
        .then((ok: any) => {
          toast.success('Edited comment');
          form.resetFields();
          setDataFile(null);
          handelGetCommentThisPost(dataPageQuery);
        })
        .catch((error: any) => {
          console.log('Error:', error);
        });
    }
    // post/comment-post
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const handelActionThisPost = (action: string) => {
    console.log('This post');
    if (action == '1') {
      axios
        .get(
          'http://localhost:8000/api/post/like-post/' +
          dataPageQuery +
          '?like=1&idUser=' +
          user._id
        )
        .then((ok: any) => {
          console.log('oji post');
          countLike == 0 ? setCountLike(1) : setCountLike(0);
        })
        .catch((error: any) => {
          console.log('Error:', error);
        });
    } else if (action == '2') {
      axios
        .get(
          'http://localhost:8000/api/post/like-post/' +
          dataPageQuery +
          '?tym=1&idUser=' +
          user._id
        )
        .then((ok: any) => {
          console.log('oji post');
          countLike == 0 ? setCountLike(1) : setCountLike(0);
        })
        .catch((error: any) => {
          console.log('Error:', error);
        });
    }
    // post/like-post
  };
  const removeCommentThisPost = (id: any, idPost: any) => {
    if (window.confirm('bạn có muốn xoá bình luận này !')) {
      axios
        .get(
          'http://localhost:8000/api/post/comment-remove/' +
          id +
          '?idPost=' +
          dataPageQuery
        )
        .then((ok: any) => {
          console.log('oji post');
          handelGetCommentThisPost(idPost);
        })
        .catch((error: any) => {
          console.log('Error:', error);
        });
    }
  };
  const editCommentThisPost = (id: any, idPost: any) => {

    axios
      .get('http://localhost:8000/api/post/get-id-comments/' + id)
      .then((ok: any) => {
        console.log(ok, 'cc');
        setDataIdComment({
          comment: ok.data.comment,
          image: ok.data.image,
        });
        setDataFile(ok.data.image);
      })
      .catch((error: any) => {
        console.log(error);
      });
    // axios.get('');

  };

  const getDataLikeTymThisPost = (id: any, action: any) => {
    if (action == '0') {
      axios
        .get('http://localhost:8000/api/post/react-post/' + id + '?status=0')
        .then((res) => {
          console.log(res.data.data.like);
          setDataLike(res.data.data.like);
          setDataTym(res.data.data.tym);
        })
        .catch((error) => console.log(error));
    }
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Tất cả',
      children: (
        <>
          <div>
            {dataLike?.map((items: any) => {
              return (
                <div
                  onClick={() => navigate('/profile/' + items._id)}
                  className="flex cursor-pointer items-center gap-5"
                  key={items._id}
                >
                  <div>
                    <img src={likeIcons} className="w-[30px]" alt="" />
                  </div>
                  <img
                    src={items.avatar}
                    className="w-[80px] rounded-full"
                    alt=""
                  />
                  <p className="font-bold text-md">{items.username}</p>
                </div>
              );
            })}
          </div>
          <div>
            {dataTym?.map((items: any) => {
              return (
                <div
                  onClick={() => navigate('/profile/' + items._id)}
                  className="flex cursor-pointer items-center gap-5"
                  key={items._id}
                >
                  <div>
                    <img src={tymIcons} className="w-[30px]" alt="" />
                  </div>
                  <img
                    src={items.avatar}
                    className="w-[80px] rounded-full"
                    alt=""
                  />
                  <p className="font-bold text-md">{items.username}</p>
                </div>
              );
            })}
          </div>
        </>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <img src={likeIcons} className="w-[30px]" alt="" />
        </div>
      ),
      children: (
        <div>
          {dataLike?.map((items: any) => {
            return (
              <div
                onClick={() => navigate('/profile/' + items._id)}
                className="flex cursor-pointer items-center gap-5"
                key={items._id}
              >
                <img
                  src={items.avatar}
                  className="w-[80px] rounded-full"
                  alt=""
                />
                <p className="font-bold text-md">{items.username}</p>
              </div>
            );
          })}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div>
          <img src={tymIcons} className="w-[30px]" alt="" />
        </div>
      ),
      children: (
        <div>
          {dataTym?.map((items: any) => {
            return (
              <div
                onClick={() => navigate('/profile/' + items._id)}
                className="flex cursor-pointer items-center gap-5"
                key={items._id}
              >
                <img
                  src={items.avatar}
                  className="w-[80px] rounded-full"
                  alt=""
                />
                <p className="font-bold text-md">{items.username}</p>
              </div>
            );
          })}
        </div>
      ),
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  const content = (
    <div className="flex items-center gap-5">
      <div>
        <img
          onClick={() => handelActionThisPost('1')}
          src={likeIcons}
          className="w-[30px] cursor-pointer hover:scale-110 "
          alt=""
        />
      </div>
      <div>
        <img
          onClick={() => handelActionThisPost('2')}
          src={tymIcons}
          className="w-[30px] cursor-pointer hover:scale-110 "
          alt="2"
        />
      </div>
    </div>
  );
  return (
    <div className="mt-6 w-full h-full pb-5 relative">


      {/* Create Post       */}
      <CreatePostBox />
      {/* All posts */}
      <div className="mt-10">
        {concatOk?.map((post: any, idx) => {
          console.log('edt', post);
          const count: any = post.like.length + post.tym.length;
          const countComment: any = post.cmt.length;
          return (
            <div
              key={post._id}
              className="w-full mt-10 relative shadow h-auto bg-white rounded-md"
            >

              <div className="flex items-center space-x-2 p-2.5 px-4">
                <div className="w-10 h-10">
                  <img
                    src={post.users.avatar}
                    className="w-full h-full rounded-full"
                    alt="dp"
                  />
                </div>
                <div className="flex-grow flex flex-col">
                  <p className="font-semibold text-sm text-gray-700">
                    {post.users.username}
                  </p>
                  <span className="text-xs font-thin text-gray-400">
                    {moment(post.createdAt).fromNow()}{' '}
                    {post.status == 1 && 'deleted'}
                  </span>
                </div>
                <div
                  className="w-8 h-8">
                  <button
                    onClick={() => handelCheckActionPost(post._id)}

                    className="w-full h-full hover:bg-gray-100 rounded-full text-gray-400 focus:outline-none">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
              {iconsPost ? <div className="absolute right-5 w-[200px]  bg-gray-400 top-12 rounded-md shadow-mdh-[120px]"><div>
                <p className="border-b border-[#ccc] pb-4 text-white font-semibold text-md pl-5 pt-3 cursor-pointer hover:bg-gray-600">Sửa bài post</p>
                <p className="border-b border-[#ccc] pb-4 text-white font-semibold text-md pl-5 pt-3 cursor-pointer hover:bg-gray-600">Xoá bài post</p>
              </div>
              </div> : ""}


              {post.name ? (
                <div className="mb-1">
                  <p className="text-gray-700 max-h-10 truncate px-3 text-sm">
                    {post.name}
                  </p>
                </div>
              ) : null}
              {post.image ? (
                <div className="w-full h-76 max-h-100">
                  <img
                    src={post.image}
                    alt="postImage"
                    className="w-full h-76 max-h-100 object-cover"
                  />
                </div>
              ) : null}

              <div className="w-full flex flex-col space-y-2 p-2 px-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-300 text-gray-500 text-sm">
                  <div
                    onClick={() => {
                      navigate({
                        search: createSearchParams({
                          postId: post._id,
                          isCheckLike: 'ok',
                        }).toString(),
                      }),
                        showDrawer();
                      getDataLikeTymThisPost(post._id, '0');
                    }}
                    className="flex items-center"
                  >
                    <div className="flex items-center">
                      <button className="focus:outline-none flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white">
                        <i
                          style={{ fontSize: 10 }}
                          className="fas fa-heart"
                        ></i>
                      </button>
                      <button className="focus:outline-none flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white">
                        <i
                          style={{ fontSize: 10 }}
                          className="fas fa-thumbs-up"
                        ></i>
                      </button>

                      <span className="pl-3"> {count}</span>
                      <div className="ml-1">
                        <p>{post.likes}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="pl-3"> {countComment}</span>
                    <button>{post.comments} Comments </button>

                  </div>
                </div>
                <div style={{}} className="flex  space-x-3 text-gray-500 text-sm font-thin pb-2">
                  <Popover content={content}>
                    <button
                      onMouseEnter={() =>
                        navigate({
                          search: createSearchParams({
                            postId: post._id,
                          }).toString(),
                        })
                      }
                      // onMouseLeave={ ()=> navigate({
                      //     search: createSearchParams({
                      //       postId: "",
                      //     }).toString(),
                      //   })}
                      className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md"
                    >
                      <div>

                        {post.tym.includes(user._id) ?
                          <div className='flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md'>

                            <img style={{ width: "22px" }} src={tymIcons} alt="" />
                            <p className="font-semibold">Tym</p>
                          </div> :

                          <div className='flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md'>
                            <i className={`fas fa-thumbs-up ${post.like.includes(user._id)
                              ? 'text-blue-500'
                              : ''
                              }`}></i>
                            <div>

                              <p className="font-semibold">Like</p>
                            </div>
                          </div>}

                      </div>

                    </button>
                  </Popover>

                  <button
                    onClick={() => {
                      showDrawer();
                      handeopen();
                      navigate({
                        search: createSearchParams({
                          postId: post._id,
                        }).toString(),
                      });
                      handelGetCommentThisPost(post._id);
                      toggleCommentBox(post._id);
                    }}
                    className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md"
                  >
                    <div>
                      <i className="fas fa-comment"></i>
                    </div>
                    <div>
                      <p className="font-semibold">Comment</p>
                    </div>
                  </button>


                </div>


                {openPostId === post._id && (
                  <div>
                    {dataCommentPost?.map((itm) => (
                      <div key={itm._id} className="overflow-y-auto border-b border-[#ccc] pb-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex mt-4 items-center gap-5">
                              <div className="w-10 h-10">
                                <img
                                  onClick={() => navigate('/profile/' + itm.idUser._id)}
                                  src={itm.idUser.avatar}
                                  className="w-full cursor-pointer h-full rounded-full"
                                  alt="dp"
                                />
                              </div>
                              <p className={"font-bold text-md "}>{itm.idUser.username}</p>
                            </div>

                            <div className="flex items-center gap-5">
                              <div>
                                <p>{itm.comment}</p>
                                {itm.image && <img className="w-[80px] pt-3 rounded-md" src={itm.image} alt="" />}
                              </div>

                            </div>
                          </div>

                          <div>
                            {itm.idUser._id === user._id && (
                              <div className="space-x-5">
                                <Button onClick={() => removeCommentThisPost(itm._id, itm.idPost)} className="bg-red-400 text-white">Delete</Button>
                                <Button
                                  onClick={() => {
                                    navigate({
                                      search: createSearchParams({
                                        postId: itm.idPost,
                                        isEdit: itm._id,
                                      }).toString(),
                                    });
                                    editCommentThisPost(itm._id, itm.idPost);
                                  }}
                                  className="bg-blue-400 text-white"
                                >
                                  Chỉnh sửa
                                </Button>
                              </div>
                            )}
                          </div>

                        </div>
                        {isEdit === itm._id ? <div style={{ background: "#b8b8b8", width: "100%", height: "10px", borderRadius: "10px", marginTop: "10px" }}></div> : ""}

                      </div>

                    ))}



                    <div className="z-50 bg-white w-[100%] shadow-2xl bottom-0">
                      <Form
                        name="basic"
                        form={form}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                      >
                        <div>
                          <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please input your comment!' }]}
                          >
                            <Input.TextArea className="w-full font-bold text-black" placeholder={isEdit ? dataIdComment.comment : 'Nhập bình luận của bạn !'} />
                          </Form.Item>
                          <div>
                            <label htmlFor="enterFile" className="font-bold text-lg underline cursor-pointer">Select photo</label>
                            <input
                              onChange={(event) => handleFileChange(event)}
                              type="file"
                              className="hidden opacity-0"
                              id="enterFile"
                              name=""
                            />
                            {dataFile && <img className="w-[80px] mb-5" src={dataFile} alt="" />}
                          </div>
                          <div className="flex justify-between">
                            <Button type="primary" htmlType="submit" className="mb-2 mx-5">{isEdit ? 'Edit' : 'Submit'}</Button>
                            {isEdit && (
                              <Button
                                onClick={() => {
                                  navigate({
                                    search: createSearchParams({ postId: dataPageQuery, isEdit: '' }).toString(),
                                  });
                                  setDataFile(null);
                                  setDataIdComment({ comment: '', image: '' });
                                }}
                                htmlType="button"
                                className="mb-2 mr-5 bg-red-500 text-white font-bold"
                              >
                                {isEdit ? 'X' : ''}
                              </Button>
                            )}
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                )}








              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default NewsFeed;



