import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Link,
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import CategorySliBar from './CategorySliBar';
import { Avatar, Button, Card, Empty, Pagination } from 'antd';
import Meta from 'antd/es/card/Meta';
import parse from 'html-react-parser';

const NewBlogs = () => {
  const [dataCategory, setDataCategory] = useState([]);
  const [queryParameters] = useSearchParams();
  const location = useLocation();

  const dataPageQuery: any = queryParameters.get('idBlog');
  const navigate = useNavigate();
  useEffect(() => {
    const handelFetchAllCate = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/newsBlog-update/active'
      );
      console.log(data);
      const listBlogsByIdCate =
        data &&
        data?.docs?.filter((item: any) =>
          dataPageQuery
            ? item?.category?._id === dataPageQuery
            : item?.category?._id === '65478ffd3401df94791e632b'
        );
      setDataCategory(listBlogsByIdCate);
    };
    handelFetchAllCate();
  }, [dataPageQuery]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dataCategory?.slice(startIndex, endIndex);
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };
console.log(paginatedData && paginatedData.length,'paginatedData && paginatedData.length')
  return (
    <div>
      <>
        {paginatedData && paginatedData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[20px] gap-y-[30px] my-[30px]">
              {paginatedData?.map((item: any) => (
                <Card
                  onClick={() =>
                    navigate({
                      search: createSearchParams({
                        isDetails: item._id,
                      }).toString(),
                    })
                  }
                  key={item._id}
                  hoverable
                  className="w-[calc(50% - 8px)] bg-[#f5f5f5] hover:bg-[#fff]"
                  cover={
                    <img
                      className="w-full max-h-[200px] object-cover"
                      alt={item.images[0].filename}
                      src={item.images[0].url}
                    />
                  }
                >
                  <Meta
                    className="custom-title  mb-5"
                    avatar={<Avatar src="/logo_icon.png" />}
                    title={item.name}
                    description={
                      <div className="line-clamp-3 text-base">
                        {parse(item.description)}
                      </div>
                    }
                  />
                  <Link to={'#'} className="text-left ">
                    <Button style={{background:"rgb(0, 128, 0)"}} className="mt-[25px] hover:!text-[#d3b673] hover:bg-transparent hover:!border-[#d3b673]  text-[#fff] bg-[#d3b673]">
                      Xem thêm 
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
            <Pagination
              showQuickJumper
              pageSize={itemsPerPage}
              defaultCurrent={1}
              current={currentPage}
              total={dataCategory?.length}
              onChange={handleChangePage}
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-center w-full py-4">
              <Empty
                className="flex items-center flex-col"
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 200 }}
                description={<span>Hiện tại chưa có bài viết nào!</span>}
              />
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default NewBlogs;
