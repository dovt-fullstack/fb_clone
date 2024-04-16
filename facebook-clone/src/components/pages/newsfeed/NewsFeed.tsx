import React, { useEffect, useState } from 'react';
import { storiesData } from '../../../data';
import CreatePostBox from '../../atoms/post/CreatePostBox';
import Story from '../../atoms/story';
import PostContainer from '../../container/PostContainer';
import Post from '../../atoms/post';
import { useAppSelector } from '../../../store';
import axios from 'axios';
import moment from 'moment';
import { Button, Drawer, DrawerProps, Form, Input, Space } from 'antd';

const NewsFeed: React.FC = () => {
  const [getPostFriend, setGetPostFriend] = useState([]);
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchDataFirend = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/post/get-post-friend/' + user._id
      );
      console.log(data);
      setGetPostFriend(data);
    };
    fetchDataFirend();
  }, [user._id]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="mt-6 w-full h-full pb-5 relative">
      <Drawer
        title="Chi tiết bình luận"
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
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <div className="absolute bottom-5">
          <Form
            name="basic"
            style={{ maxWidth: 900 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="">

              <div className=''>
                <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your comment!' },
                ]}
              >
                <Input.TextArea  className='w-full' placeholder='Nhập bình luận của bạn !'/>
              </Form.Item>
              </div>
              <div className=''>
                <label htmlFor="enterFile" className='font-bold text-lg underline cursor-pointer' >Chọn ảnh</label>
                <input type="file" className="hidden opacity-0" id="enterFile" name="" />
              </div>
            </div>

              <Button type="primary" htmlType="submit">
                Submit
              </Button>
          </Form>
        </div>
      </Drawer>
      {/* Story Section */}
      <div className="w-full h-50 flex items-center justify-center space-x-2 overflow-hidden cursor-pointer my-6">
        <div
          className="w-28 h-48 relative rounded-xl shadow "
          style={{
            backgroundImage: `url('https://random.imagecdn.app/500/400')`,
          }}
        >
          <div
            className="w-full absolute flex justify-center"
            style={{ bottom: '13%' }}
          >
            <button className="focus:outline-none z-40 w-10 h-10 bg-primary rounded-full border-4 border-white">
              <i className="text-white fas fa-plus"></i>
            </button>
          </div>
          <div className="bg-white z-30 absolute text-center bottom-0 p-2 pt-4 w-full h-auto rounded-b-lg ">
            <p className="text-gray-500 text-sm font-semibold">Create Story</p>
          </div>
        </div>
        {storiesData.length
          ? storiesData.map((story, idx) => <Story key={idx} story={story} />)
          : null}
      </div>
      {/* Create Post       */}
      <CreatePostBox />
      {/* All posts */}
      <div className="mt-10">
        {getPostFriend?.map((post: any, idx) => {
          const count: any = post.like.length + post.tym.length;
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
                <div className="w-8 h-8">
                  <button className="w-full h-full hover:bg-gray-100 rounded-full text-gray-400 focus:outline-none">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
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
                  <div className="flex items-center">
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
                      <button className="focus:outline-none flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500 text-white">
                        <i
                          style={{ fontSize: 10 }}
                          className="fas fa-surprise"
                        ></i>
                      </button>
                      <span className="pl-3"> {count}</span>
                      <div className="ml-1">
                        <p>{post.likes}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button>{post.comments} Comments</button>
                    <button>{post.shares} Shares</button>
                  </div>
                </div>
                <div className="flex space-x-3 text-gray-500 text-sm font-thin">
                  <button className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md">
                    <div>
                      <i className="fas fa-thumbs-up"></i>
                    </div>
                    <div>
                      <p className="font-semibold">Like</p>
                    </div>
                  </button>
                  <button
                    onClick={showDrawer}
                    className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md"
                  >
                    <div>
                      <i className="fas fa-comment"></i>
                    </div>
                    <div>
                      <p className="font-semibold">Comment</p>
                    </div>
                  </button>
                  <button className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md">
                    <div>
                      <i className="fas fa-share"></i>
                    </div>
                    <div>
                      <p className="font-semibold">Share</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;
