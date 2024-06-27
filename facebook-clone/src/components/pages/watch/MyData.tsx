import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../atoms/navbar';
import { Button, Drawer, Form, Image, Input, Select, message } from 'antd';
import UploadFiles from './UploadFile';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../store';

const MyData = () => {
  const { Option } = Select;
  const [form] = Form.useForm();
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);

  const [dataCategory, setDataCategory] = useState<any>();
  const reactQuillRef = useRef<ReactQuill>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [openBlog, _] = useState(true);
  const [dataIdBlogs, setDataIdBlogs] = useState<any>();
  const { id } = useParams();
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
  const fethnewBlogId = async () => {
    const { data } = await axios.get('http://localhost:8000/api/newBlog/' + id);
    console.log(data, 'fwefde');

    setDataIdBlogs(data);
  };
  useEffect(() => {
    // newBlog

    fethnewBlogId();
  }, [id]);
  useEffect(() => {
    id &&
      form.setFieldsValue({
        name: dataIdBlogs?.name,
        description: dataIdBlogs?.description,
        images: dataIdBlogs?.images[0]?.url,
        category: dataIdBlogs?.category,
        is_active: dataIdBlogs?.is_active,
      });
  }, [id, dataIdBlogs, form]);
  const onFinishBlogs = (values: any) => {
    const formData = new FormData();
    const file = fileList[0]?.originFileObj as any;
    formData.append('images', file);
    axios
      .post('http://localhost:8000/api/uploadImages', formData)
      .then((data: any) => {
        console.log(data, 'urls');
        axios
          .put('http://localhost:8000/api/newsBlog/' + id, {
            name: values.name,
            description: values.description,
            images: data.data.urls[0]
              ? data.data.urls[0]
              : dataIdBlogs?.images[0],
            category: values.category,
            is_active: values.is_active,
            id_user: user._id,
          })
          .then(() => {
            fethnewBlogId();
            message.success('sửa bài viết thành công');
          })
          .catch((error) => {
            message.error(`sửa bài viết thất bại! ${error.message}`);
          });
      })
      .catch((error: any) => {
        // dataIdBlogs?.images[0]?.url
        axios
          .put('http://localhost:8000/api/newsBlog/' + id, {
            name: values.name,
            description: values.description,
            images: dataIdBlogs?.images[0],
            category: values.category,
            is_active: values.is_active,
            id_user: user._id,
          })
          .then(() => {
            fethnewBlogId();
            message.success('sửa bài viết thành công');
          })
          .catch((error) => {
            message.error(`sửa bài viết thất bại! ${error.message}`);
          });
      });
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
  const navigate = useNavigate();
  const onClose = () => {
    navigate('/forum');
  };
  return (
    <div>
      <Navbar />
      <Drawer
        title={'sửa bài viết mới'}
        width={'50%'}
        destroyOnClose
        getContainer={false}
        onClose={onClose}
        open={openBlog}
      >
        <Form
          name="basic"
          autoComplete="off"
          form={form}
          layout="vertical"
          className="dark:text-white"
          onFinish={onFinishBlogs}
        >
          {dataIdBlogs?.images?.length > 0 && (
            <div>
              <Image
                className="!w-[80px]"
                src={dataIdBlogs?.images[0]?.url}
                width={300}
              />
            </div>
          )}
          <Form.Item
            className="dark:text-white"
            label="Article photo"
            name="images"
            // rules={[{ required: true, message: 'Không được bỏ trống!' }]}
          >
            <UploadFiles fileList={fileList} setFileList={setFileList} />
          </Form.Item>
          <Form.Item
            className="dark:text-white"
            label="Article name"
            name="name"
            rules={[
              { required: true, message: 'Article title cannot be left blank!' },
              {
                validator: (_, value) => {
                  if (value.trim() === '') {
                    return Promise.reject(
                      'The article name cannot contain all spaces!'
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input size="large" placeholder="Article name" />
          </Form.Item>
          <div className="grid grid-cols-[1fr,1fr] gap-5">
            <Form.Item
              name="category"
              label="Article category name"
              rules={[
                { required: true, message: 'Article categories are required' },
              ]}
            >
              <Select placeholder="List of articles" size="large">
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
                { required: true, message: 'Post status is required' },
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
            rules={[{ required: true, message: 'Not be empty!' }]}
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
            <Button className="!w-full mt-5 py-2" htmlType="submit">
            Edit Post
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default MyData;
