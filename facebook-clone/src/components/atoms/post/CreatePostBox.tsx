import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from 'antd';
import {
  FormProps,
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useAppSelector } from '../../../store';
import axios from 'axios';
import { toast } from 'react-toastify';
const { Option } = Select;
type FieldType = {
  description?: string;
};
const CreatePostBox: React.FC = () => {
  const [dataFile, setDataFile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const dataPageQuery: any = queryParameters.get('isEdit');
  const dataPost: any = queryParameters.get('idPost');
  const { id } = useParams();
  const [form] = Form.useForm();
  const [imageDetails, setImageDetails] = useState('');
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    navigate({
      search: createSearchParams({
        isEdit: '0',
      }).toString(),
    });
  };
  const { user } = useAppSelector((state: any) => state.persistedReducer.auth);
  useEffect(() => {
    if (dataPageQuery == 1) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [dataPageQuery]);
  useEffect(() => {
    if (dataPost) {
      const fetchDataIDPost = async () => {
        const detailsPost = await axios.get(
          'http://localhost:8000/api/get-post/' + dataPost
        );
        form.setFieldsValue({
          description: detailsPost.data.post.name,
        });
        setImageDetails(detailsPost.data.post.image);
        console.log(detailsPost.data.post.image, 'data');
      };
      fetchDataIDPost();
    }
  }, [dataPost, form]);
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
  const onFinish = (values: any) => {
    const data = {
      name: values.description,
      image: dataFile,
    };
    if (!dataPost && dataPageQuery != 1) {
      axios
        .post('http://localhost:8000/api/post/create-post/' + user._id, {
          data,
        })
        .then((response) => {
          toast.success('created successfully');
          setOpen(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post('http://localhost:8000/api/post/update-post/' + dataPost, {
          data,
        })
        .then((response) => {
          toast.success('updated successfully');
          setOpen(false);
          navigate({
            search: createSearchParams({
              isEdit: '0',
            }).toString(),
          });
          window.location.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  return (
    <div className="rounded-lg bg-white flex flex-col p-3 px-4 shadow">
      {open && (
        <>

          <div style={{
            padding:"20px 80px 120px 100px",
            margin:"-13px -22px 12px -31px",
            background:"#FFF5EE",
            position:"relative",
            boxShadow:"0px -1px 7px 27px rgba(60,64,67,.102), 0 2px 6px 2px rgba(60,64,67,.149)",
            borderRadius:"20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between",paddingBottom:"50px" }}>
              <div style={{ display: "flex", gap: "13px", alignItems: "center" }}>
                <img onClick={onClose} style={{ width: "10px", height: "10px" }} src="https://cdn-icons-png.flaticon.com/128/1828/1828778.png" alt="" />
                <span style={{}}>Create a new post</span>
              </div>
              <Button onClick={onClose}>Cancel</Button>
            </div>

            <div style={{ width: "533px", margin: "auto" }}>
              <Form
                name="basic"
                style={{ margin: "auto" }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                form={form}

                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                hideRequiredMark
              >
                <Row gutter={16}>
                  <Col span={24}>

                    <Form.Item
                      style={{ width: "800px" }}
                      name="description"
                      label="Bạn đang nghĩ gì "
                      rules={[
                        {
                          required: true,
                          message: 'Please enter url description',
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Please enter url description"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <input
                  onChange={(event: any) => {
                    handleFileChange(event);
                  }}
                  type="file"
                  name=""
                  id="updateAvatars"
                  className="hidden"
                />
                {dataPageQuery == 1 && dataPost && (
                  <img className=" mt-5" src={imageDetails} />
                )}
                <Button
                  htmlType="submit"
                  className="mt-5 bg-green-500 text-white"
                >
                  Submit
                </Button>
              </Form>
            </div>
          </div>


        </>
      )}
      <>
        <div className="flex items-center space-x-2 border-b pb-3 mb-2">
          <div className="w-10 h-10">
            <img
              src={user?.avatar}
              className="w-full h-full rounded-full"
              alt="dp"
            />
          </div>
          <button
            onClick={showDrawer}
            className="hover:bg-gray-200 focus:bg-gray-300 focus:outline-none flex-grow bg-gray-100 text-gray-500 text-left rounded-full h-10 pl-5"
          >
            What&apos;s on your mind, Shihab?
          </button>
        </div>
        <div className="flex space-x-3 font-thin text-sm text-gray-600 -mb-1">
          <button className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md">
            <div>
              <i className="fab fa-youtube text-red-400"></i>
            </div>
            <div>
              <p className="font-semibold">Create Video</p>
            </div>
          </button>
          <button className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md">
            <div>
              <i className="fas fa-images text-green-500"></i>
            </div>
            <div>
              <p className="font-semibold">Photos/Video</p>
            </div>
          </button>
          <button className="flex-1 flex items-center h-8 focus:outline-none focus:bg-gray-200 justify-center space-x-2 hover:bg-gray-100 rounded-md">
            <div>
              <i className="far fa-smile text-yellow-500"></i>
            </div>
            <div>
              <p className="font-semibold">Feeling/Activity</p>
            </div>
          </button>
        </div>
      </>
    </div>
  );
};

export default CreatePostBox;
