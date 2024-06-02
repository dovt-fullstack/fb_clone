import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../../store';
import { useNavigate, useParams } from 'react-router-dom';

const PrevFriend = () => {
  const [data, setData] = useState([]);
  const {id} = useParams()
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  const navigate = useNavigate()


  useEffect(() => {
    const fetchDataFriend = async () => {
      const allFriend = await axios.get(
        'http://localhost:8000/get-all/friendUser/' + id + '?friend=0'
      );
      setData(allFriend.data.data);
    };
    fetchDataFriend();
  }, [id]);
  console.log("data",data)

  return (
    <div>
      <div className="col-span-2">
        <div className="bg-white rounded-lg p-3 text-sm text-gray-600 shadow">
          <div className="mb-2 flex justify-between items-center">
            <div>
              <p className="font-bold text-xl text-gray-800">Bạn bè</p>
              <p>{data?.length} Người bạn</p>
            </div>
            <div>
              <p onClick={()=>navigate('/profile/friends')} className="text-blue-500 text-lg font-medium">
                Xem tất cả bạn bè
              </p>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-6'>
            {data &&
              data.slice(0,9).map((items: any, index) => {
                console.log(items, 'o');
                return (
                  <div key={items._id}>
                    <div onClick={()=>navigate('/profile/' + items._id)} className="mt-3 cursor-pointer">
                      <img
                        className="w-[130px] rounded-md h-[130px]"
                        src={
                          items.avatar != null && items.avatar != ''
                            ? items.avatar
                            : 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='
                        }
                        alt=""
                      />
                      <p className="pt-2 pl-2 font-medium text-lg">
                        {items.username}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevFriend;
