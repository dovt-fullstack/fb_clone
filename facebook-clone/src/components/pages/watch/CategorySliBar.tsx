import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';

const CategorySliBar = () => {
  const navigate = useNavigate();
  const [dataCategory, setDataCategory] = useState<any>();
  useEffect(() => {
    const handelFetchAllCate = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/category-blogs'
      );
      setDataCategory(data);
    };
    handelFetchAllCate();
  }, []);
  return (
    <div>
      <div className="sm:w-full lg:w-full max-w-[300px] ">
        <div
        style={{color:'rgb(0, 128, 0)'}}
          className={`category_menu_title sm:text-[25px] text-center lg:text-[28px] `}
        >
          NEWS CATEGORY
        </div>
        <div className="w-full max-w-[260px] mx-auto mb-[70px]">
          <ul>
            {dataCategory &&
              dataCategory.docs.length > 0 &&
              dataCategory?.docs?.map((item: any, index: number) => (
                <li key={index} className={'menu_category cursor-pointer hover:text-green-500 hover:scale-110'}>
                  <p
                    onClick={() => {
                      navigate({
                        search: createSearchParams({
                          idBlog: item._id,
                        }).toString(),
                      });
                    }}
                  >
                    {item?.name} 
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategorySliBar;
