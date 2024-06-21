import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import axios from 'axios';
import {
  Link,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  message,
} from 'antd';
const { Option } = Select;
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../store';
import { Pagination } from 'antd/lib';
const MarketplacePage: React.FC = () => {
  const [dataProduct, setDataProduct] = useState([]);
  const [openProduct, setOpenProduct] = useState(false);
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [dataProductUser, setDataProductUser] = useState([]);
  const [dataIdProduct, setDataIdProduct] = useState<any>();
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user: userInfo } = useAppSelector(
    (state: any) => state.persistedReducer.auth
  );

  const [queryParameters] = useSearchParams();
  const isEditMyPro: any = queryParameters.get('isEditMyPro');
  const [openMyNewBlog, setOpenMyNewBlog] = useState(false);
  const [openMyNewProduct, setOpenMyNewProduct] = useState(false);
  const [productFavourite, setProductFavourite] = useState([]);
  const navigate = useNavigate();
  const isCreateLoading = '';
  const [form] = Form.useForm();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = dataProduct?.slice(startIndex, endIndex);
  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  console.log("dataProduct", dataProduct)
  const openNewBlog = () => {
    setOpenMyNewBlog(true);
  };
  const closeNewBlog = () => {
    setOpenMyNewBlog(false);
  };
  const openNewProduct = () => {
    setOpenMyNewProduct(true);
  };
  const closeNewProduct = () => {
    setOpenMyNewProduct(false);
  };
  const fetchProductFavourite = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/get-product-farvourite/' + userInfo._id
    );
    setProductFavourite(data.ytProduct);
  };
  useEffect(() => {
    fetchProductFavourite();
  }, [userInfo._id]);

  useEffect(() => {
    const getIdProducto = async () => {
      const { data } = await axios.get(
        'http://localhost:8000/api/product/' + isEditMyPro
      );
      setDataIdProduct(data.data);
    };
    getIdProducto();
  }, [isEditMyPro]);
  // api/get-product-user-create
  const fetchDataProductUser = async () => {
    const { data } = await axios.get(
      'http://localhost:8000/api/get-product-user-create/' + userInfo._id
    );
    setDataProductUser(data);
  };
  useEffect(() => {
    if (isEditMyPro) {
      console.log('isEditMyPro', dataIdProduct);
      form.setFieldsValue({
        name: dataIdProduct?.name,
        description: dataIdProduct?.description,
        sale: dataIdProduct?.sale,
        is_active: dataIdProduct?.is_active,
      });
    }
  }, [isEditMyPro, dataIdProduct, form]);
  useEffect(() => {
    fetchDataProductUser();
  }, [userInfo._id]);
  const fetchAllProduct = async () => {
    const { data } = await axios.get('http://localhost:8000/api/products');
    setDataProduct(data.docs);
  };
  useEffect(() => {
    fetchAllProduct();
  }, []);
  const handleSubmitForm = (values: any) => {
    const dataPost = {
      name: values.name,
      description: values.description,
      images: images,
      sale: values.sale,
      is_active: values.is_active,
      idUser: userInfo._id,
    };

    const dataEdit = {
      name: values.name,
      description: values.description,
      images: images.length > 0 ? images : dataIdProduct?.images, // Kiểm tra xem dataIdProduct có tồn tại không trước khi truy cập vào thuộc tính images
      sale: values.sale,
      is_active: values.is_active,
      idUser: userInfo._id,
    };

    if (!isEditMyPro) {
      axios
        .post('http://localhost:8000/api/create/product', dataPost)
        .then((response) => {
          //
          form.resetFields();
          fetchAllProduct();
          fetchDataProductUser();
          toast.success('product created successfully');
          navigate('/marketplace');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post(
          'http://localhost:8000/api/update-product-v5/' + isEditMyPro,
          dataEdit
        )
        .then((response) => {
          //
          form.resetFields();
          fetchAllProduct();
          fetchDataProductUser();
          toast.success('product edited successfully');
          navigate('/marketplace');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const uploadImage = async (formData: FormData) => {
    return await axios.post(
      'http://localhost:8000/api/uploadImages',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  };
  const handleUploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setIsLoading(true);
    const files = e.target.files;
    const urls: any[] = [];

    if (!files) return message.error('Không có hình ảnh nào được chọn');

    const formData = new FormData();

    for (const file of files) {
      formData.append('images', file);
      const response = await uploadImage(formData);
      if (response.status === 200) {
        urls.push(...response.data.urls);
      }
    }
    setIsLoading(false);
    return urls;
  };
  const handleOnChange = async (e: any) => {
    const urls = await handleUploadImage(e, setIsLoading);
    setIsUpload(true);
    setImages(urls as any[]);
  };

  const dataSourceNew = dataProductUser?.map((items: any, index: any) => ({
    stt: index + 1,
    key: items._id,
    name: items.name,
    image: items?.images[0]?.url,
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
                closeNewBlog();
                setOpenProduct(true);
                navigate({
                  search: createSearchParams({
                    isEditMyPro: key,
                  }).toString(),
                });
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
                    .delete('http://localhost:8000/api/product/' + key)
                    .then(() => {
                      fetchDataProductUser();
                      toast.success('Deleted successfully');
                    })
                    .catch((error) => {
                      console.error('Error deleting item:', error);
                    });
                }
              }}
              className="bg-red-500 text-white"
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="mt-6">
        <div className="flex justify-center space-x-2">
          <Button onClick={openNewBlog} className="bg-blue-500 text-white">
            Blog
          </Button>
          <Button onClick={openNewProduct} className="bg-blue-500 text-white">
            New product
          </Button>
        </div>
        <div className="mt-8">
          <h3 className="text-[23px] text-[#333] mb-5 text-center">
            List of Your Products
          </h3>
          <Table
            pagination={false}
            className="mt-5"
            dataSource={dataSourceNew}
            columns={columnsNew}
          />
        </div>
      </div>

      <Drawer
        title="Create a new blog"
        width={720}
        onClose={closeNewBlog}
        open={openMyNewBlog}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <div className="mt-5">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: 'Please enter product name' },
                ]}
              >
                <Input placeholder="Please enter product name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: 'Please enter product description' },
                ]}
              >
                <Input placeholder="Please enter product description" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sale"
                label="Sale"
                rules={[
                  { required: true, message: 'Please enter sale price' },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Please enter sale price"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="is_active"
                label="Active"
                rules={[
                  { required: true, message: 'Please select active status' },
                ]}
              >
                <Select placeholder="Please select active status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Space className="mt-5">
          <Button onClick={() => setOpenMyNewBlog(false)} className="bg-red-500 text-white">
            Cancel
          </Button>
          <Button
            onClick={() => {
              form.validateFields().then((values) => {
                handleSubmitForm(values);
              });
            }}
            className="bg-blue-500 text-white"
          >
            Submit
          </Button>
        </Space>
      </Drawer>

      <Drawer
        title="Create a new product"
        width={720}
        onClose={closeNewProduct}
        open={openMyNewProduct}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitForm}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[
                  { required: true, message: 'Please enter product name' },
                ]}
              >
                <Input placeholder="Please enter product name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: 'Please enter product description' },
                ]}
              >
                <Input placeholder="Please enter product description" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sale"
                label="Sale"
                rules={[
                  { required: true, message: 'Please enter sale price' },
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Please enter sale price"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="is_active"
                label="Active"
                rules={[
                  { required: true, message: 'Please select active status' },
                ]}
              >
                <Select placeholder="Please select active status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Upload Image">
            <input
              type="file"
              multiple
              onChange={handleOnChange}
            />
          </Form.Item>
          <Space className="mt-5">
            <Button onClick={closeNewProduct} className="bg-red-500 text-white">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" className="bg-blue-500 text-white">
              Submit
            </Button>
          </Space>
        </Form>
      </Drawer>
    </div>
  );
};

export default MarketplacePage;
