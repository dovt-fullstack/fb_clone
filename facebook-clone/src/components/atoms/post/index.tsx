import moment from 'moment';
import React, { useState } from 'react';
import { IPost } from '../../../types/post';
import axios from 'axios';
import { toast } from 'react-toastify';
import { createSearchParams, useNavigate } from 'react-router-dom';
interface IProps {
  post: any;
  dataPost: any;
}

const Post: React.FC<IProps> = (props) => {
  const { post, dataPost } = props;
  const [showPopUp, setShowPopUp] = useState(false);
  const { users } = post;
  const handelCheckActionPost = (id: string) => {
    setShowPopUp(!showPopUp);
  };
  const navigate = useNavigate()
  const handelRemovePost = (id: string, isRm: number) => {
    if (isRm == 1) {
      axios
        .post('http://localhost:8000/api/remove-post/' + id)
        .then((response) => {
          toast.success('Successfully removed');
          setTimeout(() => {
            window.location.reload();
          }, 350);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (isRm == 2) {
      axios
        .post('http://localhost:8000/api/remove-post/' + id + '?reverse=2')
        .then((response) => {
          toast.success('Successfully reverse');
          setTimeout(() => {
            window.location.reload();
          }, 350);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // remove-post
  };
  return (
    <div className="w-full relative shadow h-auto bg-white rounded-md">
      {showPopUp && (
        <div
          className={
            'absolute right-5 w-[200px]  bg-gray-400 top-12 rounded-md shadow-md' +
            (post.status == 1 ? 'h-[150px]' : 'h-[120px]')
          }
        >
          <div>
            <p   onClick={() => {
            navigate({
              search: createSearchParams({
                isEdit: '1',
                idPost : post._id
              }).toString(),
            });
          }} className="border-b border-[#ccc] pb-4 text-white font-semibold text-md pl-5 pt-3 cursor-pointer hover:bg-gray-600">
              Sửa bài post
            </p>
            <p
              onClick={() => handelRemovePost(post._id, 1)}
              className="border-b border-[#ccc] pb-4 text-white font-semibold text-md pl-5 pt-3 cursor-pointer hover:bg-gray-600"
            >
              Xoá bài post
            </p>
            {post.status == 1 && (
              <p
                onClick={() => handelRemovePost(post._id, 2)}
                className="border-b border-[#ccc] pb-4 text-white font-semibold text-md pl-5 pt-3 cursor-pointer hover:bg-gray-600"
              >
                Khôi phục bài post
              </p>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center space-x-2 p-2.5 px-4">
        <div className="w-10 h-10">
          <img
            src={users.avatar}
            className="w-full h-full rounded-full"
            alt="dp"
          />
        </div>
        <div className="flex-grow flex flex-col">
          <p className="font-semibold text-sm text-gray-700">
            {users.username}
          </p>
          <span className="text-xs font-thin text-gray-400">
            {moment(post.createdAt).fromNow()} {post.status == 1 && 'deleted'}
          </span>
        </div>
        <div className="w-8 h-8">
          <button
            onClick={() => handelCheckActionPost(post._id)}
            className="w-full h-full hover:bg-gray-100 rounded-full text-gray-400 focus:outline-none"
          >
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
                <i style={{ fontSize: 10 }} className="fas fa-heart"></i>
              </button>
              <button className="focus:outline-none flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white">
                <i style={{ fontSize: 10 }} className="fas fa-thumbs-up"></i>
              </button>
              <button className="focus:outline-none flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500 text-white">
                <i style={{ fontSize: 10 }} className="fas fa-surprise"></i>
              </button>
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
          <button className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md">
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
};

export default Post;
