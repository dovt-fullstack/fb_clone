import React, { useEffect, useState } from 'react';
import { postsData } from '../../data';
import { TPostView } from '../../types/post';
import { cn } from '../../utils';
import Post from '../atoms/post';
import axios from 'axios';
import { useAppSelector } from '../../store';
import { useParams, useSearchParams } from 'react-router-dom';

interface IProps {
  postsView?: TPostView;
}

const PostContainer: React.FC<IProps> = (props) => {
  const [dataPost, setDataPost] = useState([]);
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  const [queryParameters] = useSearchParams();
  const dataPageQuery: any = queryParameters.get('isDelete');
  const {id} = useParams()
  const fetchPostByUser = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/get-all-post/by-user/' + id
    );
    const newData =
     dataPageQuery == 1
        ? data.filter((it: any) => it.status == 1)
        : data.filter((it: any) => it.status == 0);
    setDataPost(newData);
  };
  useEffect(() => {
   
    fetchPostByUser();
  }, [id, dataPageQuery]);
  const handelok = () => {
    
  }
  
  const { postsView } = props;
  return (
    <div className="mt-4 w-full h-full">
      <div
        className={cn(
          'grid gap-2',
          postsView === 'gridView' ? 'grid-cols-2' : 'grid-cols-1'
        )}
      >
        {dataPost.length ? (
          dataPost.map((post, idx) => (
            <Post key={idx} post={post} dataPost={dataPost} fetchPostByUser={fetchPostByUser}/>
          ))
        ) : (
          <p>No posts yet!</p>
        )}
      </div>
    </div>
  );
};

export default PostContainer;

