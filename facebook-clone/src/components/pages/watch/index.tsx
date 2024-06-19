import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import CategorySliBar from './CategorySliBar';
import NewBlogs from './NewBlogs';
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import NewDetails from './NewDetails';
import { Button, Drawer, Form, Input, Select, Table, message } from 'antd';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import UploadFiles from './UploadFile';
const { Option } = Select;
import 'react-quill/dist/quill.snow.css';
import { useAppSelector } from '../../../store';

const WatchPage: React.FC = () => {
  const [queryParameters] = useSearchParams();
  const location = useLocation();
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openBlog, setOpenBlog] = useState(false);
  const [dataMyCate, setDataMyCate] = useState<any[]>([]);
  const [openMyCategory, setOpenMyCategory] = useState(false);
  const [dataIdBlog, setDataIdBlog] = useState<any>();
  const [fileList, setFileList] = useState<any[]>([]);
  const reactQuillRef = useRef<ReactQuill>(null);
  const [form] = Form.useForm();
  const isDetails: any = queryParameters.get('isDetails');
  const idBlog: any = queryParameters.get('idBlog');
  const idEditMyBlog: any = queryParameters.get('idEditMyBlog');
  const [openMyNewBlog, setOpenMyNewBlog] = useState(false);
  const [dataNewUser, setDataNewUser] = useState<any[]>([]);
  const openNewBlog = () => {
    setOpenMyNewBlog(true);
  };
  const closeNewBlog = () => {
    setOpenMyNewBlog(false);
  };
  const fetchMyNew = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/get-blogs-user/' + user._id
    );
    setDataNewUser(data);
  };
  useEffect(() => {
    fetchMyNew();
  }, [user._id]);
  useEffect(() => {
    // category-blog
    const fetchIdBlogs = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/category-blog/' + idEditMyBlog
      );
      setDataIdBlog(data);
    };
    fetchIdBlogs();
  }, [idEditMyBlog]);
  useEffect(() => {
    idEditMyBlog &&
      open &&
      form.setFieldsValue({
        name: dataIdBlog?.name,
      });
  }, [idEditMyBlog, form, dataIdBlog, open]);
  const { id } = useParams();
  const [dataCategory, setDataCategory] = useState<any>();
  const fetchCateMyUser = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/get-category-user/' + user._id
    );
    console.log(data, 'oki');
    setDataMyCate(data);
  };
  useEffect(() => {
    fetchCateMyUser();
  }, [user._id]);
  useEffect(() => {
    const handelFetchAllCate = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/category-blogs'
      );
      console.log(data, 'categ');
      setDataCategory(data);
    };
    handelFetchAllCate();
  }, []);
  const getContentByUrl = () => {
    if (location.pathname.includes('tin-tuc-khuyen-mai')) {
      return 'Tin tức khuyến mãi';
    } else if (location.pathname.includes('cau-chuyen-thuong-hieu')) {
      return 'Câu chuyện thương hiệu';
    } else if (location.pathname.includes('su-kien')) {
      return 'Sự kiện';
    }
  };
  const onClose = () => {
    setOpen(false);
    navigate({
      search: createSearchParams({
        idBlog: idBlog,
        idEditMyBlog: '',
      }).toString(),
    });
    form.resetFields();
  };
  const onOpen = () => {
    setOpen(true);
  };
  const onFinish = async (values: { name: string }) => {
    const dataCreateCate = {
      id_user: user._id,
      name: values.name,
    };
    if (idEditMyBlog && idEditMyBlog != '') {
      axios
        .put(
          'http://localhost:8000/api/category-blog/' + idEditMyBlog,
          dataCreateCate
        )
        .then((ok: any) => {
          toast.success('Successfully');
          fetchCateMyUser();
          setOpen(false);
          setOpenMyCategory(true);
        })
        .catch((error: any) => {
          console.log(error);
        });
      return;
    } else {
      axios
        .post('http://localhost:8000/api/category-blog', dataCreateCate)
        .then((ok: any) => {
          toast.success('Successfully');
          setTimeout(() => {
            window.location.reload();
          }, 450);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };
  const container = [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['code-block'],
    ['clean'],
  ];
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'code-block',
  ];
  const onFinishBlogs = (values: any) => {
    const formData = new FormData();
    const file = fileList[0]?.originFileObj as any;
    console.log(fileList[0].originFileObj, 'fileList[0]');
    formData.append('images', file);
    axios
      .post('http://localhost:8000/api/uploadImages', formData)
      .then((data: any) => {
        console.log(data, 'urls');
        axios
          .post('http://localhost:8000/api/create-newsBlog', {
            name: values.name,
            description: values.description,
            images: data.data.urls[0],
            category: values.category,
            is_active: values.is_active,
            id_user: user._id,
          })
          .then(() => {
            message.success('Thêm bài viết thành công');
            onCloseBlogs();
          })
          .catch((error) => {
            message.error(`Thêm bài viết thất bại! ${error.message}`);
            onCloseBlogs();
          });
      })
      .catch((error: any) =>
        message.error(`Thêm bài viết thất bại! ${error.message}`)
      );
  };
  const onCloseBlogs = () => {
    setOpenBlog(false);
  };
  const closeMyCate = () => {
    setOpenMyCategory(false);
    navigate({
      search: createSearchParams({
        idBlog: idBlog,
        idEditMyBlog: '',
      }).toString(),
    });
    form.resetFields();
  };
  const openMyCate = () => {
    setOpenMyCategory(true);
  };
  const dataSource = dataMyCate?.map((items: any, index: any) => ({
    stt: index + 1,
    key: items._id,
    name: items.name,
  }));
  const columns = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'action',
      render: ({ key }: any) => {
        return (
          <div className="space-x-5">
            <Button
              onClick={() => {
                closeMyCate();
                navigate({
                  search: createSearchParams({
                    idBlog: idBlog,
                    idEditMyBlog: key,
                  }).toString(),
                });
                setOpen(true);
              }}
              className="bg-blue-500 text-white"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to delete this item?')
                ) {
                  axios
                    .delete('http://localhost:8000/api/category-blog/' + key)
                    .then(() => {
                      fetchCateMyUser();
                      toast.success('Delete successfully');
                    })
                    .catch((error: any) => console.log(error));
                }
              }}
              className="bg-red-500 text-white"
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];

  const dataSourceNew = dataNewUser?.map((items: any, index: any) => ({
    stt: index + 1,
    key: items._id,
    name: items.name,
    image: items.images[0].url,
  }));
  const columnsNew = [
    {
      title: '#',
      dataIndex: 'stt',
      key: 'stt',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => {
        return (
          <div>
            <p>{name && name.length > 30 ? `${name.slice(0, 30)}...` : name}</p>
          </div>
        );
      },
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => {
        return (
          <div>{image && <img className="w-[80px]" src={image} alt="" />}</div>
        );
      },
    },
    {
      title: 'action',
      render: ({ key }: any) => {
        return (
          <div className="space-x-5">
            <Button
              onClick={() => {
                navigate('/my-category/' + key);
              }}
              className="bg-blue-500 text-white"
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                if (
                  window.confirm('Are you sure you want to delete this item?')
                ) {
                  axios
                    .delete('http://localhost:8000/api/newsBlog-remove/' + key)
                    .then(() => {
                      fetchMyNew();
                      toast.success('Delete successfully');
                    })
                    .catch((error: any) => console.log(error));
                }
              }}
              className="bg-red-500 text-white"
            >
              Remove
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <>
      {/* category */}
      <Drawer
        title={idEditMyBlog ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        width={376}
        destroyOnClose
        onClose={onClose}
        getContainer={false}
        open={open}
      >
        <Form
          name="basic"
          autoComplete="off"
          layout="vertical"
          form={form}
          className="dark:text-white"
          onFinish={onFinish}
        >
          <Form.Item
            className="dark:text-white"
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: 'Tên danh mục không được bỏ trống !' },
              {
                validator: (_, value) => {
                  if (value.trim() === '') {
                    return Promise.reject(
                      'Tên danh mục không được chứa toàn khoảng trắng!'
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input size="large" placeholder="Tên danh mục" />
          </Form.Item>

          <Form.Item>
            <Button className="!w-full mt-5 py-2" htmlType="submit">
              {idEditMyBlog ? 'Sửa danh mục' : 'Thêm danh mục mới'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      {/* blogs */}
      <Drawer
        title={'Article name'}
        width={776}

        destroyOnClose
        onClose={onCloseBlogs}
        getContainer={false}
        open={openBlog}
      >
        <Form
          name="basic"
          autoComplete="off"
          layout="vertical"
          className="dark:text-white"
          onFinish={onFinishBlogs}
        >
          <Form.Item
            className="dark:text-white"
            label="Article photo"
            name="images"
          >
            <UploadFiles fileList={fileList} setFileList={setFileList} />
          </Form.Item>
          <Form.Item
            className="dark:text-white"
            label="Article name"
            name="name"
            rules={[
              { required: true, message: 'Tên bài viết không được bỏ trống!' },
              {
                validator: (_, value) => {
                  if (value.trim() === '') {
                    return Promise.reject(
                      'Tên bài viết không được chứa toàn khoảng trắng!'
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input maxLength={40} size="large" placeholder="Tên bài viết" />
          </Form.Item>
          <div className="grid grid-cols-[1fr,1fr] gap-5">
            <Form.Item
              name="category"
              label="Article category name"
              rules={[
                { required: true, message: 'Danh mục bài viết là bắt buộc' },
              ]}
            >
              <Select placeholder="NEWS CATEGORY" size="large">
                {dataCategory?.docs?.map((category: any) => (
                  <Option value={category._id} key={category._id}>
                    <span className="text-sm capitalize">{category.name}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="is_active"
              label="Post status"
              rules={[
                { required: true, message: 'Trạng thái bài viết là bắt buộc' },
              ]}
            >
              <Select placeholder="Post status" size="large">
                <Option value={true}>Công khai</Option>
                <Option value={false}>Riêng tư</Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            className="dark:text-white mb-17"
            label="Article description"
            name="description"
            rules={[{ required: true, message: 'Không được bỏ trống!' }]}
          >
            <ReactQuill
              className="h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
              ref={reactQuillRef}
              theme="snow"
              placeholder="Start writing..."
              modules={{
                toolbar: {
                  container: container,
                },
                clipboard: {
                  matchVisual: false,
                },
              }}
              formats={formats}
            />
          </Form.Item>
          <Form.Item>
            <Button
              style={{ width: '30%', display: 'flex', margin: "auto", justifyContent: "center", background: 'rgb(21, 137, 76)', alignItems: "center" }}
              className="mt-5 py-2" htmlType="submit">
              Add new article
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      {/* my-category */}
      <Drawer
        title={'danh mục bạn đã chia sẻ'}
        width={476}
        destroyOnClose
        onClose={closeMyCate}
        getContainer={false}
        open={openMyCategory}
      >
        <Table dataSource={dataSource} columns={columns} />
      </Drawer>

      {/* my blogs */}

      <Drawer
        title={'danh mục tin tức của bạn'}
        width={666}
        destroyOnClose
        onClose={closeNewBlog}
        getContainer={false}
        open={openMyNewBlog}
      >
        <Table dataSource={dataSourceNew} columns={columnsNew} />
      </Drawer>

      <div
        className={`page_top_banner text-[20px] sm:text-[28px] lg:text-[36px]`}
      >
        {getContentByUrl()}
      </div>
      <div className="max-w-[1211px] grid  m-auto px-4 sm:px-6 sm:grid-cols-1 lg:px-8 lg:grid-cols-[2fr,5fr] lg:gap-[30px] mb-12">
        <CategorySliBar />
        <div>
          <div className="flex justify-end space-x-5 mt-5">
            {/* <Button onClick={onOpen}>Tạo chuyên mục</Button> */}
            <Button onClick={() => setOpenBlog(true)}>Create news</Button>
            {/* <Button onClick={() => openMyCate()}>Your directory</Button> */}
            <Button className="" onClick={openNewBlog}>
              Your news
            </Button>
          </div>
          <p
            className={`page_title text-center sm:mt-[20px] sm:text-center mb-[25px] lg:text-xl lg:text-left lg:mt-[40px]`}
          >
            {getContentByUrl()}
          </p>
          {isDetails ? <NewDetails /> : <NewBlogs />}
        </div>
      </div>
    </>
  );
};

export default WatchPage;
